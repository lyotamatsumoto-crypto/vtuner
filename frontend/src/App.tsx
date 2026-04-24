import { useEffect, useState } from "react";

import { AppShell, type AppScreen } from "./components/layout/AppShell";
import {
  defaultBasicPreviewBridgeSettings,
  type BasicPreviewBridgeSettings,
} from "./basicPreviewBridge";
import type {
  AdoptedChangeItem,
  ReviewPatchQueueItem,
} from "../../backend/src/contracts/queue";
import type {
  CompilePlanItem,
  CompileRecord,
} from "../../backend/src/contracts/compile";
import { AiJsonStudioPage } from "./pages/AiJsonStudioPage";
import { BasicSettingsPage } from "./pages/BasicSettingsPage";
import { DetailedRulesPage } from "./pages/DetailedRulesPage";
import { PreviewTestPage } from "./pages/PreviewTestPage";
import { ReviewPage } from "./pages/ReviewPage";
import {
  buildCompilePrecheckPlanItems,
  createAdoptedChangeFromReviewPatch,
  createReviewPatchQueueItem,
  initialAdoptedChanges,
  initialCompileHistory,
  initialReviewPatchQueue,
  markCompiledReviewPatchQueueItems,
  runCompileFromAdoptedChanges,
  updateReviewPatchStatus,
} from "./reviewCompileBridge";
import { loadReviewCompileReadModel } from "./reviewCompileApi";

type StorageReadStatus = "idle" | "loading" | "loaded" | "fallback";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("preview_test");
  const [basicPreviewBridgeSettings, setBasicPreviewBridgeSettings] =
    useState<BasicPreviewBridgeSettings>(defaultBasicPreviewBridgeSettings);
  const [reviewPatchQueue, setReviewPatchQueue] =
    useState<ReviewPatchQueueItem[]>(initialReviewPatchQueue);
  const [adoptedChanges, setAdoptedChanges] =
    useState<AdoptedChangeItem[]>(initialAdoptedChanges);
  const [compileHistory, setCompileHistory] =
    useState<CompileRecord[]>(initialCompileHistory);
  const [storageReadStatus, setStorageReadStatus] =
    useState<StorageReadStatus>("idle");
  const [storageReadMessage, setStorageReadMessage] = useState(
    "backend read はまだ読み込んでいません。frontend の初期表示を使っています。",
  );

  const compilePrecheckPlanItems: CompilePlanItem[] =
    buildCompilePrecheckPlanItems(adoptedChanges);

  useEffect(() => {
    let cancelled = false;

    setStorageReadStatus("loading");
    setStorageReadMessage(
      "backend から Review Patch Queue / Adopted Changes / compile 履歴を読み込み中です。",
    );

    loadReviewCompileReadModel()
      .then((result) => {
        if (cancelled) {
          return;
        }

        setReviewPatchQueue(result.reviewPatchQueue);
        setAdoptedChanges(result.adoptedChanges);
        setCompileHistory(result.compileHistory);
        setStorageReadStatus("loaded");
        setStorageReadMessage(
          `backend read を初期表示へ反映しています。(${result.backendOrigin})`,
        );
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setStorageReadStatus("fallback");
        setStorageReadMessage(
          "backend read に失敗したため、frontend の初期表示をそのまま使っています。",
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleCreateReviewPatchCandidate(
    input: Parameters<typeof createReviewPatchQueueItem>[0],
  ) {
    const nextPatch = createReviewPatchQueueItem(input);
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

  function handleRunCompile() {
    const result = runCompileFromAdoptedChanges(
      adoptedChanges,
      compilePrecheckPlanItems,
    );

    if (!result.compileRecord) {
      return;
    }

    const nextCompileRecord = result.compileRecord;

    setAdoptedChanges(result.nextAdoptedChanges);
    setCompileHistory((current) => [nextCompileRecord, ...current]);
    setReviewPatchQueue((current) =>
      markCompiledReviewPatchQueueItems(
        current,
        adoptedChanges,
        compilePrecheckPlanItems,
      ),
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
          storageReadStatus={storageReadStatus}
          storageReadMessage={storageReadMessage}
        />
      ) : null}
      {currentScreen === "detailed_rules" ? (
        <DetailedRulesPage
          reviewPatchQueue={reviewPatchQueue}
          adoptedChanges={adoptedChanges}
          compilePrecheckItems={compilePrecheckPlanItems}
          compileHistory={compileHistory}
          onSetReviewPatchStatus={handleSetReviewPatchStatus}
          onRunCompile={handleRunCompile}
          storageReadStatus={storageReadStatus}
          storageReadMessage={storageReadMessage}
        />
      ) : null}
      {currentScreen === "ai_json_studio" ? <AiJsonStudioPage /> : null}
    </AppShell>
  );
}
