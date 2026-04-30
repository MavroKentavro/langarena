/**
 * StaticTextProvider
 * ==================
 *
 * Centralized read-only access to the project's static content +
 * translations. Fetches a single JSON document over HTTP, caches it
 * in memory for the session, and serves locale-aware lookups so the
 * rest of the app never has to know how the wire format is shaped.
 *
 * During development the JSON sits in the dev server's `public/`
 * folder (`./public/data.json` relative to the page); production
 * will swap this URL for a CDN endpoint without any consumer change.
 *
 * The wire format mixes two distinct localization patterns and we
 * normalize both behind one API:
 *
 *   1. `static.<iso>.<key>` — flat key/value strings indexed by
 *      ISO 639 code (`en`, `ru`, `pt-BR`, …). Used by every
 *      generic string in the UI ("web.tutor", "web.money.back.guarantee", …).
 *      Read via `t(key)`.
 *
 *   2. Localized arrays (`hows`, `whys`, `struggles`, `topics`,
 *      `reviews`) with shape:
 *          { id, title, image, localized: { "<lang_id>": "<text>" } }
 *      The `localized` map is keyed by NUMERIC language id (65, 66, …)
 *      not ISO. We bridge the two via the `languages` catalogue
 *      (`{ id, iso, name, icon }`).
 *      Read via `list(name)` — returns the same array but with
 *      `title` replaced by the locale-correct string (with English
 *      fallback, then base `title` if both are missing/empty).
 *
 *   3. `onboarding_video.<iso>` — read via `getOnboardingVideo()`.
 *
 *   4. `languages` — read via `getLanguages()`.
 *
 *   5. Anything else — escape hatch: `getRaw()` exposes the parsed
 *      JSON unchanged for screens that need test_words / grammar_test
 *      / lex_test directly.
 *
 * Usage
 * -----
 *     const provider = new StaticTextProvider({
 *       url: './public/data.json',
 *       initialLang: 'en',
 *     });
 *     await provider.load();
 *     provider.setLanguage('uk');
 *     provider.t('web.tutor');                 // → "Репетитор" (uk) or English fallback
 *     provider.list('hows');                   // → [{ id, title (localized), image, … }]
 *     provider.getOnboardingVideo();           // → "<asset id>" for current locale
 *
 * Resilience
 * ----------
 *  • `load()` is idempotent — repeat calls share the same in-flight
 *    promise.
 *  • Every getter is null-safe — returns sensible defaults if
 *    `load()` hasn't completed yet (rather than throwing). Callers
 *    that care about the load state should `await provider.load()`
 *    first.
 *  • Missing translations fall back to the configured fallback
 *    language (default `en`), then to the raw key / base title.
 */
(function (global) {
  "use strict";

  function StaticTextProvider(opts) {
    opts = opts || {};
    this.url = opts.url || "./public/data.json";
    this.fallbackLang = opts.fallback || "en";
    this.lang = opts.initialLang || this.fallbackLang;
    // Optional id of an inline `<script type="application/json">`
    // tag that holds the same payload — used as a graceful fallback
    // when `fetch()` is unavailable (e.g. the prototype is opened
    // straight from `file://` without a local server, where most
    // browsers refuse cross-origin fetches).
    this.inlineFallbackId = opts.inlineFallbackId || "static-text-data";

    this._data = null;
    this._loadPromise = null;
    // ISO → numeric id (string), built from the `languages` catalogue.
    this._isoToId = new Map();
    // numeric id (string) → ISO.
    this._idToIso = new Map();

    // Notify subscribers when language changes; useful if the UI
    // wants to re-render strings without re-fetching.
    this._listeners = new Set();
  }

  // ─── Loading ────────────────────────────────────────────────────
  // Strategy:
  //   1. Try `fetch(url)` — primary path for served contexts
  //      (localhost, GitHub Pages, CDN).
  //   2. If fetch fails (network error, CORS, file:// origin,
  //      missing URL), look for a `<script type="application/json"
  //      id="<inlineFallbackId>">` block in the document and parse
  //      its contents — this lets the prototype keep working when
  //      opened directly from disk.
  //   3. If both fail, reject the load promise so callers can react.
  StaticTextProvider.prototype.load = function () {
    if (this._loadPromise) return this._loadPromise;
    var self = this;

    function tryFetch() {
      if (!self.url || typeof fetch !== "function") {
        return Promise.reject(new Error("no-fetch"));
      }
      return fetch(self.url, { credentials: "omit" }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status + " for " + self.url);
        return res.json();
      });
    }

    this._loadPromise = tryFetch()
      .catch(function (fetchErr) {
        var inline = self._readInline();
        if (inline) {
          if (typeof console !== "undefined" && console.info) {
            console.info(
              "[StaticTextProvider] fetch failed (" +
              (fetchErr && fetchErr.message) +
              "); using inline fallback."
            );
          }
          return inline;
        }
        throw fetchErr;
      })
      .then(function (data) {
        self._initFromData(data);
        return self;
      })
      .catch(function (err) {
        // Reset the cached promise so a future call can retry.
        self._loadPromise = null;
        throw err;
      });
    return this._loadPromise;
  };

  StaticTextProvider.prototype._readInline = function () {
    if (typeof document === "undefined") return null;
    var el = document.getElementById(this.inlineFallbackId);
    if (!el) return null;
    var text = el.textContent || "";
    if (!text.trim()) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[StaticTextProvider] inline fallback JSON parse error:", e.message);
      }
      return null;
    }
  };

  StaticTextProvider.prototype._initFromData = function (data) {
    this._data = data;
    var langs = (data && data.languages) || [];
    this._isoToId.clear();
    this._idToIso.clear();
    for (var i = 0; i < langs.length; i++) {
      var l = langs[i];
      if (l && l.iso != null && l.id != null) {
        this._isoToId.set(l.iso, String(l.id));
        this._idToIso.set(String(l.id), l.iso);
      }
    }
  };

  StaticTextProvider.prototype.isLoaded = function () {
    return this._data != null;
  };

  // ─── Language ───────────────────────────────────────────────────
  StaticTextProvider.prototype.setLanguage = function (iso) {
    if (!iso || iso === this.lang) return;
    this.lang = iso;
    this._notify();
  };
  StaticTextProvider.prototype.getLanguage = function () {
    return this.lang;
  };
  StaticTextProvider.prototype.getLanguages = function () {
    return (this._data && this._data.languages) ? this._data.languages.slice() : [];
  };

  // Subscribe to language-change notifications.
  // Returns an unsubscribe function.
  StaticTextProvider.prototype.onLanguageChange = function (fn) {
    if (typeof fn !== "function") return function () {};
    this._listeners.add(fn);
    var self = this;
    return function () { self._listeners.delete(fn); };
  };
  StaticTextProvider.prototype._notify = function () {
    var iso = this.lang;
    this._listeners.forEach(function (fn) {
      try { fn(iso); } catch (_) { /* listener errors must not break others */ }
    });
  };

  // ─── Static-string lookup (`web.something.key`) ────────────────
  StaticTextProvider.prototype.t = function (key, defaultValue) {
    if (!this._data) return defaultValue != null ? defaultValue : key;
    var bucket = this._data.static || {};
    var cur = bucket[this.lang];
    if (cur && cur[key] != null && cur[key] !== "") return cur[key];
    var fb = bucket[this.fallbackLang];
    if (fb && fb[key] != null && fb[key] !== "") return fb[key];
    return defaultValue != null ? defaultValue : key;
  };

  // Convenience: bulk get a list of static keys.
  StaticTextProvider.prototype.tAll = function (keys) {
    var out = {};
    for (var i = 0; i < keys.length; i++) out[keys[i]] = this.t(keys[i]);
    return out;
  };

  // ─── Localized array lookup ────────────────────────────────────
  // Returns a NEW array of items with `title` replaced by the
  // locale-appropriate string. Original items are not mutated.
  StaticTextProvider.prototype.list = function (name) {
    if (!this._data || !Array.isArray(this._data[name])) return [];
    var langId = this._isoToId.get(this.lang);
    var fbId = this._isoToId.get(this.fallbackLang);
    var arr = this._data[name];
    var out = new Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i] || {};
      var loc = item.localized || {};
      var t = (langId && loc[langId]) || (fbId && loc[fbId]) || item.title || "";
      // Some items also have description_localized — apply the same
      // resolution so consumers don't have to repeat the dance.
      var dLoc = item.description_localized || null;
      var resolved = Object.assign({}, item, { title: t });
      if (dLoc) {
        resolved.description = (langId && dLoc[langId]) || (fbId && dLoc[fbId]) || item.description || "";
      }
      out[i] = resolved;
    }
    return out;
  };

  // Single item from a localized list, by id.
  StaticTextProvider.prototype.listItem = function (name, id) {
    var items = this.list(name);
    for (var i = 0; i < items.length; i++) {
      if (String(items[i].id) === String(id)) return items[i];
    }
    return null;
  };

  // ─── Other top-level fields ────────────────────────────────────
  StaticTextProvider.prototype.getOnboardingVideo = function () {
    if (!this._data) return null;
    var map = this._data.onboarding_video || {};
    return map[this.lang] || map[this.fallbackLang] || null;
  };

  // Escape hatch — exposes the parsed JSON for screens that need
  // direct access (test_words, grammar_test, lex_test, summary_keys).
  StaticTextProvider.prototype.getRaw = function () {
    return this._data;
  };

  // ─── Module exports ────────────────────────────────────────────
  if (typeof module !== "undefined" && module.exports) {
    module.exports = StaticTextProvider;
  }
  if (global) {
    global.StaticTextProvider = StaticTextProvider;
  }
})(typeof window !== "undefined" ? window : this);
