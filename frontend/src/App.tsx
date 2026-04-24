import { useState } from "react";

import { AppShell, type AppScreen } from "./components/layout/AppShell";
import {
  defaultBasicPreviewBridgeSettings,
  type BasicPreviewBridgeSettings,
} from "./basicPreviewBridge";
import type {
  AdoptedChangeItem,
  ReviewPatchQueueItem,
} from "../../backend/src/contracts/queue";
import type { CompilePlanItem } from "../../backend/src/contracts/compile";
import { AiJsonStudioPage } from "./pages/AiJsonStudioPage";
import { BasicSettingsPage } from "./pages/BasicSettingsPage";
import { DetailedRulesPage } from "./pages/DetailedRulesPage";
import { PreviewTestPage } from "./pages/PreviewTestPage";
import { ReviewPage } from "./pages/ReviewPage";
import {
  buildCompilePrecheckItems,
  createAdoptedChangeFromReviewPatch,
  createReviewPatchCandidate,
  initialAdoptedChanges,
  initialReviewPatchQueue,
  updateReviewPatchStatus,
} from "./reviewCompileBridge";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("preview_test");
  const [basicPreviewBridgeSettings, setBasicPreviewBridgeSettings] =
    useState<BasicPreviewBridgeSettings>(defaultBasicPreviewBridgeSettings);
  const [reviewPatchQueue, setReviewPatchQueue] =
    useState<ReviewPatchQueueItem[]>(initialReviewPatchQueue);
  const [adoptedChanges, setAdoptedChanges] =
    useState<AdoptedChangeItem[]>(initialAdoptedChanges);

  const compilePrecheckItems: CompilePlanItem[] =
    buildCompilePrecheckItems(adoptedChanges);

  function handleCreateReviewPatchCandidate(
    input: Parameters<typeof createReviewPatchCandidate>[0],
  ) {
    const nextPatch = createReviewPatchCandidate(input);
    setReviewPatchQueue((current) => [nextPatch, ...current]);
  }

  function handleSetReviewPatchStatus(
    patchId: string,
    status: ReviewPatchQueueItem["status"],
  ) {
    const patch = reviewPatchQueue.find((item) => item.id === patchId);
    if (!patch) {
      return;
    }

    setReviewPatchQueue((current) => updateReviewPatchStatus(current, patchId, status));

    if (status === "adopted") {
      setAdoptedChanges((current) => {
        const existing = current.find((item) => item.id === `adopted-${patchId}`);
        if (existing) {
          return current;
        }

        return [createAdoptedChangeFromReviewPatch(patch), ...current];
      });
      return;
    }

    setAdoptedChanges((current) =>
      current.filter((item) => item.id !== `adopted-${patchId}`),
    );
  }

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
      {currentScreen === "review" ? (
        <ReviewPage
          reviewPatchQueue={reviewPatchQueue}
          onCreateReviewPatchCandidate={handleCreateReviewPatchCandidate}
        />
      ) : null}
      {currentScreen === "detailed_rules" ? (
        <DetailedRulesPage
          reviewPatchQueue={reviewPatchQueue}
          adoptedChanges={adoptedChanges}
          compilePrecheckItems={compilePrecheckItems}
          onSetReviewPatchStatus={handleSetReviewPatchStatus}
        />
      ) : null}
      {currentScreen === "ai_json_studio" ? <AiJsonStudioPage /> : null}
    </AppShell>
  );
}
