import { useState } from "react";

import { AppShell, type AppScreen } from "./components/layout/AppShell";
import { AiJsonStudioPage } from "./pages/AiJsonStudioPage";
import { BasicSettingsPage } from "./pages/BasicSettingsPage";
import { DetailedRulesPage } from "./pages/DetailedRulesPage";
import { PreviewTestPage } from "./pages/PreviewTestPage";
import { ReviewPage } from "./pages/ReviewPage";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("ai_json_studio");

  return (
    <AppShell currentScreen={currentScreen} onSelectScreen={setCurrentScreen}>
      {currentScreen === "basic_settings" ? <BasicSettingsPage /> : null}
      {currentScreen === "preview_test" ? <PreviewTestPage /> : null}
      {currentScreen === "review" ? <ReviewPage /> : null}
      {currentScreen === "detailed_rules" ? <DetailedRulesPage /> : null}
      {currentScreen === "ai_json_studio" ? <AiJsonStudioPage /> : null}
    </AppShell>
  );
}
