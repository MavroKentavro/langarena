import { ThemeProvider } from "./theme/ThemeProvider";
import { LocaleProvider } from "./i18n/LocaleProvider";
import { FunnelProvider, useFunnel } from "./funnel/FunnelProvider";
import { FunnelRouter } from "./funnel/FunnelRouter";

/**
 * App root.
 *
 * Provider order (outer → inner):
 *   ThemeProvider — light now, dark prepared
 *   LocaleProvider — UI-only locale selection
 *   FunnelProvider — step + answers state
 */
export default function App() {
  return (
    <ThemeProvider initialTheme="light">
      <LocaleProvider>
        <FunnelProvider>
          <AppShell />
        </FunnelProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

/**
 * Inner shell — reads the current funnel step so globals.css can apply
 * screen-specific breakpoints (only the language screen expands beyond
 * the baseline 375 layout).
 */
function AppShell() {
  const { currentStep } = useFunnel();
  return (
    <div className="app-shell" data-active-step={currentStep}>
      <div className="app-shell__viewport">
        <FunnelRouter />
      </div>
    </div>
  );
}
