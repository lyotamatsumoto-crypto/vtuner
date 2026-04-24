import { useState } from "react";

import { AppShell, type AppScreen } from "./components/layout/AppShell";
import {
  defaultBasicPreviewBridgeSettings,
  type BasicPreviewBridgeSettings,
} from "./basicPreviewBridge";
import { AiJsonStudioPage } from "./pages/AiJsonStudioPage";
import { BasicSettingsPage } from "./pages/BasicSettingsPage";
import { DetailedRulesPage } from "./pages/DetailedRulesPage";
import { PreviewTestPage } from "./pages/PreviewTestPage";
import { ReviewPage } from "./pages/ReviewPage";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("preview_test");
  const [basicPreviewBridgeSettings, setBasicPreviewBridgeSettings] =
    useState<BasicPreviewBridgeSettings>(defaultBasicPreviewBridgeSettings);

  return (
    <AppShell currentScreen={currentScreen} onSelectScreen={setCurrentScreen}>
      {currentScreen === "basic_settings" ? (
        <BasicSettingsPage
          sharedSettings={basicPreviewBridgeSettings}
          onSharedSettingsChange={setBasicPreviewBridgeSettings}
        />
      ) : null}
      {currentScreen === "preview_test" ? (
        <PreviewTestPage sharedSettings={basicPreviewBridgeSettings} />
      ) : null}
      {currentScreen === "review" ? <ReviewPage /> : null}
      {currentScreen === "detailed_rules" ? <DetailedRulesPage /> : null}
      {currentScreen === "ai_json_studio" ? <AiJsonStudioPage /> : null}
    </AppShell>
  );
}
