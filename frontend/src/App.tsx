import { useEffect, useState } from "react";

import { AppShell, type AppScreen } from "./components/layout/AppShell";
import {
  defaultBasicPreviewBridgeSettings,
  type BasicPreviewBridgeSettings,
} from "./basicPreviewBridge";
import type {
  AdoptedChangeItem,
  AiJsonImportQueueItem,
  ReviewPatchQueueItem,
} from "../../schemas";
import type {
  CompilePlanItem,
  CompileRecord,
} from "../../schemas";
import { AiJsonStudioPage } from "./pages/AiJsonStudioPage";
import { BasicSettingsPage } from "./pages/BasicSettingsPage";
import { DetailedRulesPage } from "./pages/DetailedRulesPage";
import { OverlayCharacterPage } from "./pages/OverlayCharacterPage";
import { PreviewTestPage } from "./pages/PreviewTestPage";
import { ReviewPage } from "./pages/ReviewPage";
import {
  buildCompilePrecheckPlanItems,
  type CompiledRuntimeEntry,
  createAiJsonImportQueueItem,
  createAdoptedChangeFromAiJsonImportQueueItem,
  createAdoptedChangeFromReviewPatch,
  createReviewPatchQueueItem,
  initialAdoptedChanges,
  initialAiJsonImportQueue,
  initialCompileHistory,
  initialReviewPatchQueue,
  markCompiledReviewPatchQueueItems,
  runCompileFromAdoptedChanges,
  updateReviewPatchStatus,
} from "./reviewCompileBridge";
import {
  loadReviewCompileReadModel,
  saveAdoptedChanges,
  saveAiJsonImportQueue,
  saveCompileHistory,
  saveReviewPatchQueue,
} from "./reviewCompileApi";

type StorageReadStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "backend_empty"
  | "fallback";

interface CharacterProfileDraft {
  id: string;
  name: string;
  savedAt: string;
  settings: BasicPreviewBridgeSettings;
}

function cloneBasicPreviewBridgeSettings(
  settings: BasicPreviewBridgeSettings,
): BasicPreviewBridgeSettings {
  return JSON.parse(JSON.stringify(settings)) as BasicPreviewBridgeSettings;
}

function buildInitialCharacterProfile(
  settings: BasicPreviewBridgeSettings,
): CharacterProfileDraft {
  const timestamp = new Date().toISOString();
  return {
    id: "character-profile-default",
    name: "Default Character",
    savedAt: timestamp,
    settings: cloneBasicPreviewBridgeSettings(settings),
  };
}

export function App() {
  const isOverlayCharacterRoute =
    typeof window !== "undefined" &&
    window.location.pathname === "/overlay/character";
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
    "backend 読込は未実行です。いまは frontend 確認版の初期表示です。",
  );
  const [backendOrigin, setBackendOrigin] = useState("http://localhost:3001");
  const [reviewPatchWriteMessage, setReviewPatchWriteMessage] = useState(
    "Review Patch Queue の backend 保存は未実行です（frontend 確認版の候補表示のみ）。",
  );
  const [adoptedChangesWriteMessage, setAdoptedChangesWriteMessage] = useState(
    "Adopted Changes の backend 保存は未実行です（frontend 確認版の採用表示のみ）。",
  );
  const [compileHistoryWriteMessage, setCompileHistoryWriteMessage] = useState(
    "compile history の backend 保存は未実行です（frontend 確認版の履歴表示のみ）。",
  );
  const [aiJsonImportQueue, setAiJsonImportQueue] =
    useState<AiJsonImportQueueItem[]>(initialAiJsonImportQueue);
  const [compiledRuntimeEntries, setCompiledRuntimeEntries] = useState<
    CompiledRuntimeEntry[]
  >([]);
  const [characterProfiles, setCharacterProfiles] = useState<CharacterProfileDraft[]>(
    () => [buildInitialCharacterProfile(defaultBasicPreviewBridgeSettings)],
  );
  const [activeCharacterProfileId, setActiveCharacterProfileId] = useState(
    "character-profile-default",
  );

  const compilePrecheckPlanItems: CompilePlanItem[] =
    buildCompilePrecheckPlanItems(adoptedChanges);
  const activeCharacterProfile =
    characterProfiles.find((profile) => profile.id === activeCharacterProfileId) ??
    characterProfiles[0];
  const isCharacterProfileDirty =
    activeCharacterProfile !== undefined &&
    JSON.stringify(activeCharacterProfile.settings) !==
      JSON.stringify(basicPreviewBridgeSettings);

  useEffect(() => {
    let cancelled = false;

    setStorageReadStatus("loading");
    setStorageReadMessage(
      "backend 読込中です: Review Patch Queue / Adopted Changes / compile 履歴",
    );

    loadReviewCompileReadModel()
      .then((result) => {
        if (cancelled) {
          return;
        }

        const nextReviewPatchQueue =
          result.reviewPatchQueue.length > 0
            ? result.reviewPatchQueue
            : initialReviewPatchQueue;
        const nextAdoptedChanges =
          result.adoptedChanges.length > 0
            ? result.adoptedChanges
            : initialAdoptedChanges;
        const nextCompileHistory =
          result.compileHistory.length > 0
            ? result.compileHistory
            : initialCompileHistory;
        const nextAiJsonImportQueue =
          result.aiJsonImportQueue.length > 0
            ? result.aiJsonImportQueue
            : initialAiJsonImportQueue;
        const emptySources = [
          result.reviewPatchQueue.length === 0 ? "Review Patch Queue" : null,
          result.adoptedChanges.length === 0 ? "Adopted Changes" : null,
          result.aiJsonImportQueue.length === 0 ? "AI JSON Import Queue" : null,
          result.compileHistory.length === 0 ? "compile 履歴" : null,
        ].filter((item): item is string => item !== null);

        setReviewPatchQueue(nextReviewPatchQueue);
        setAdoptedChanges(nextAdoptedChanges);
        setAiJsonImportQueue(nextAiJsonImportQueue);
        setCompileHistory(nextCompileHistory);
        setBackendOrigin(result.backendOrigin);

        if (emptySources.length === 4) {
          setStorageReadStatus("backend_empty");
          setStorageReadMessage(
            `backend 読込は成功しましたが、backend 側は空配列でした。frontend 確認版 seed を維持しています。(${result.backendOrigin})`,
          );
          return;
        }

        if (emptySources.length > 0) {
          setStorageReadStatus("backend_empty");
          setStorageReadMessage(
            `backend 読込値を反映中です。一部は backend 側が空のため frontend 確認版 seed を維持しています: ${emptySources.join(" / ")} (${result.backendOrigin})`,
          );
          return;
        }

        setStorageReadStatus("loaded");
        setStorageReadMessage(
          `backend 読込値を初期表示へ反映しています。(${result.backendOrigin})`,
        );
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setStorageReadStatus("fallback");
        setStorageReadMessage(
          "backend 読込に失敗したため、frontend 確認版の初期表示を継続しています。",
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
    setReviewPatchQueue((current) => {
      const nextQueue = [nextPatch, ...current];

      saveReviewPatchQueue(backendOrigin, nextQueue)
        .then(() => {
          setReviewPatchWriteMessage(
            `Review Patch Queue を backend へ保存しました。frontend 候補表示と backend 保存値は同期しています。(${backendOrigin})`,
          );
        })
        .catch(() => {
          setReviewPatchWriteMessage(
            "Review Patch Queue の backend 保存に失敗しました。frontend 候補表示は保持されています（backend 未反映）。",
          );
        });

      return nextQueue;
    });
  }

  function handleSetReviewPatchStatus(
    patchId: string,
    status: ReviewPatchQueueItem["status"],
  ) {
    const patch = reviewPatchQueue.find((item) => item.id === patchId);
    if (!patch) {
      return;
    }

    setReviewPatchQueue((current) => {
      const nextQueue = updateReviewPatchStatus(current, patchId, status);
      saveReviewPatchQueue(backendOrigin, nextQueue)
        .then(() => {
          setReviewPatchWriteMessage(
            `Review Patch Queue を backend へ保存しました。frontend 候補表示と backend 保存値は同期しています。(${backendOrigin})`,
          );
        })
        .catch(() => {
          setReviewPatchWriteMessage(
            "Review Patch Queue の backend 保存に失敗しました。frontend 候補表示は保持されています（backend 未反映）。",
          );
        });
      return nextQueue;
    });

    if (status === "adopted") {
      setAdoptedChanges((current) => {
        const existing = current.find((item) => item.id === `adopted-${patchId}`);
        if (existing) {
          return current;
        }

        const nextAdoptedChanges = [createAdoptedChangeFromReviewPatch(patch), ...current];
        saveAdoptedChanges(backendOrigin, nextAdoptedChanges)
          .then(() => {
            setAdoptedChangesWriteMessage(
              `Adopted Changes を backend へ保存しました。frontend 採用表示と backend 保存値は同期しています。(${backendOrigin})`,
            );
          })
          .catch(() => {
            setAdoptedChangesWriteMessage(
              "Adopted Changes の backend 保存に失敗しました。frontend 採用表示は保持されています（backend 未反映）。",
            );
          });
        return nextAdoptedChanges;
      });
      return;
    }

    setAdoptedChanges((current) => {
      const nextAdoptedChanges = current.filter(
        (item) => item.id !== `adopted-${patchId}`,
      );
      saveAdoptedChanges(backendOrigin, nextAdoptedChanges)
        .then(() => {
          setAdoptedChangesWriteMessage(
            `Adopted Changes を backend へ保存しました。frontend 採用表示と backend 保存値は同期しています。(${backendOrigin})`,
          );
        })
        .catch(() => {
          setAdoptedChangesWriteMessage(
            "Adopted Changes の backend 保存に失敗しました。frontend 採用表示は保持されています（backend 未反映）。",
          );
        });
      return nextAdoptedChanges;
    });
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
    const nextCompileHistory = [nextCompileRecord, ...compileHistory];
    const nextCompiledReviewPatchQueue = markCompiledReviewPatchQueueItems(
      reviewPatchQueue,
      adoptedChanges,
      compilePrecheckPlanItems,
    );

    setAdoptedChanges(result.nextAdoptedChanges);
    setCompileHistory(nextCompileHistory);
    setReviewPatchQueue(nextCompiledReviewPatchQueue);
    setCompiledRuntimeEntries(result.compiledRuntimeEntries);

    saveAdoptedChanges(backendOrigin, result.nextAdoptedChanges)
      .then(() => {
        setAdoptedChangesWriteMessage(
          `Adopted Changes を backend へ保存しました。frontend 採用表示と backend 保存値は同期しています。(${backendOrigin})`,
        );
      })
      .catch(() => {
        setAdoptedChangesWriteMessage(
          "Adopted Changes の backend 保存に失敗しました。frontend 採用表示は保持されています（backend 未反映）。",
        );
      });

    saveReviewPatchQueue(backendOrigin, nextCompiledReviewPatchQueue)
      .then(() => {
        setReviewPatchWriteMessage(
          `Review Patch Queue を backend へ保存しました。frontend 候補表示と backend 保存値は同期しています。(${backendOrigin})`,
        );
      })
      .catch(() => {
        setReviewPatchWriteMessage(
          "Review Patch Queue の backend 保存に失敗しました。frontend 候補表示は保持されています（backend 未反映）。",
        );
      });

    saveCompileHistory(backendOrigin, nextCompileHistory)
      .then(() => {
        setCompileHistoryWriteMessage(
          `compile history を backend へ保存しました。frontend 履歴表示と backend 保存値は同期しています。(${backendOrigin})`,
        );
      })
      .catch(() => {
        setCompileHistoryWriteMessage(
          "compile history の backend 保存に失敗しました。frontend 履歴表示は保持されています（backend 未反映）。",
        );
      });
  }

  function handleRegisterPersonaImportQueueDraft(input: {
    sourceNaturalText: string;
    promptText: string;
    returnedJson: unknown;
    validationErrors: string[];
  }) {
    const queueItem = createAiJsonImportQueueItem({
      generation_target: "persona",
      source_natural_text: input.sourceNaturalText,
      prompt_text: input.promptText,
      returned_json: input.returnedJson,
      validation_ok: input.validationErrors.length === 0,
      error_messages: input.validationErrors,
    });

    setAiJsonImportQueue((current) => {
      const nextQueue = [queueItem, ...current].slice(0, 20);
      saveAiJsonImportQueue(backendOrigin, nextQueue).catch(() => {
        // Keep frontend queue state even when backend is unavailable.
      });
      return nextQueue;
    });
    return queueItem;
  }

  function handleAdoptAiJsonImportQueueItem(queueItemId: string) {
    const queueItem = aiJsonImportQueue.find((item) => item.id === queueItemId);
    if (!queueItem || queueItem.status === "adopted" || !queueItem.validation_ok) {
      return;
    }

    const adoptedId = `adopted-${queueItemId}`;
    const alreadyAdopted = adoptedChanges.some(
      (item) => item.id === adoptedId && item.source_lane === "ai_json_import_queue",
    );
    if (alreadyAdopted) {
      return;
    }

    const nextQueue = aiJsonImportQueue.map((item) =>
      item.id === queueItemId ? { ...item, status: "adopted" as const } : item,
    );
    const nextAdoptedChanges = [
      createAdoptedChangeFromAiJsonImportQueueItem(queueItem),
      ...adoptedChanges,
    ];

    setAiJsonImportQueue(nextQueue);
    setAdoptedChanges(nextAdoptedChanges);

    saveAiJsonImportQueue(backendOrigin, nextQueue).catch(() => {
      // Keep frontend queue state even when backend is unavailable.
    });
    saveAdoptedChanges(backendOrigin, nextAdoptedChanges)
      .then(() => {
        setAdoptedChangesWriteMessage(
          `Adopted Changes を backend へ保存しました。frontend 採用表示と backend 保存値は同期しています。(${backendOrigin})`,
        );
      })
      .catch(() => {
        setAdoptedChangesWriteMessage(
          "Adopted Changes の backend 保存に失敗しました。frontend 採用表示は保持されています（backend 未反映）。",
        );
      });
  }

  function handleDiscardAiJsonImportQueueItem(queueItemId: string) {
    const queueItem = aiJsonImportQueue.find((item) => item.id === queueItemId);
    if (!queueItem || queueItem.status === "adopted" || queueItem.status === "discarded") {
      return;
    }

    const nextQueue = aiJsonImportQueue.map((item) =>
      item.id === queueItemId ? { ...item, status: "discarded" as const } : item,
    );
    setAiJsonImportQueue(nextQueue);
    saveAiJsonImportQueue(backendOrigin, nextQueue).catch(() => {
      // Keep frontend queue state even when backend is unavailable.
    });
  }

  function handleSelectCharacterProfile(profileId: string) {
    const profile = characterProfiles.find((item) => item.id === profileId);
    if (!profile) {
      return;
    }

    setActiveCharacterProfileId(profileId);
    setBasicPreviewBridgeSettings(cloneBasicPreviewBridgeSettings(profile.settings));
  }

  function handleSaveCharacterProfile() {
    const currentProfile =
      characterProfiles.find((item) => item.id === activeCharacterProfileId) ??
      characterProfiles[0];
    if (!currentProfile) {
      return;
    }

    const savedAt = new Date().toISOString();
    setCharacterProfiles((current) =>
      current.map((item) =>
        item.id === currentProfile.id
          ? {
              ...item,
              savedAt,
              settings: cloneBasicPreviewBridgeSettings(basicPreviewBridgeSettings),
            }
          : item,
      ),
    );
  }

  function handleDuplicateCharacterProfile() {
    const currentProfile =
      characterProfiles.find((item) => item.id === activeCharacterProfileId) ??
      characterProfiles[0];
    if (!currentProfile) {
      return;
    }

    const id = `character-profile-${Date.now()}`;
    const duplicated: CharacterProfileDraft = {
      id,
      name: `${currentProfile.name} Copy`,
      savedAt: new Date().toISOString(),
      settings: cloneBasicPreviewBridgeSettings(basicPreviewBridgeSettings),
    };

    setCharacterProfiles((current) => [duplicated, ...current]);
    setActiveCharacterProfileId(id);
  }

  if (isOverlayCharacterRoute) {
    return (
      <OverlayCharacterPage
        sharedSettings={basicPreviewBridgeSettings}
        compiledRuntimeEntries={compiledRuntimeEntries}
        lastCompileRecord={compileHistory[0] ?? null}
      />
    );
  }

  return (
    <AppShell currentScreen={currentScreen} onSelectScreen={setCurrentScreen}>
      {currentScreen === "basic_settings" ? (
        <BasicSettingsPage
          sharedSettings={basicPreviewBridgeSettings}
          onSharedSettingsChange={setBasicPreviewBridgeSettings}
          characterProfiles={characterProfiles}
          activeCharacterProfileId={activeCharacterProfile?.id ?? null}
          isCharacterProfileDirty={Boolean(isCharacterProfileDirty)}
          onSelectCharacterProfile={handleSelectCharacterProfile}
          onSaveCharacterProfile={handleSaveCharacterProfile}
          onDuplicateCharacterProfile={handleDuplicateCharacterProfile}
        />
      ) : null}
      {currentScreen === "preview_test" ? (
        <PreviewTestPage
          sharedSettings={basicPreviewBridgeSettings}
          compiledRuntimeEntries={compiledRuntimeEntries}
          lastCompileRecord={compileHistory[0] ?? null}
        />
      ) : null}
      {currentScreen === "review" ? (
        <ReviewPage
          reviewPatchQueue={reviewPatchQueue}
          onCreateReviewPatchCandidate={handleCreateReviewPatchCandidate}
          storageReadStatus={storageReadStatus}
          storageReadMessage={storageReadMessage}
          reviewPatchWriteMessage={reviewPatchWriteMessage}
        />
      ) : null}
      {currentScreen === "detailed_rules" ? (
        <DetailedRulesPage
          reviewPatchQueue={reviewPatchQueue}
          adoptedChanges={adoptedChanges}
          compilePrecheckItems={compilePrecheckPlanItems}
          compileHistory={compileHistory}
          compiledRuntimeEntries={compiledRuntimeEntries}
          onSetReviewPatchStatus={handleSetReviewPatchStatus}
          onRunCompile={handleRunCompile}
          storageReadStatus={storageReadStatus}
          storageReadMessage={storageReadMessage}
          adoptedChangesWriteMessage={adoptedChangesWriteMessage}
          compileHistoryWriteMessage={compileHistoryWriteMessage}
        />
      ) : null}
      {currentScreen === "ai_json_studio" ? (
        <AiJsonStudioPage
          onRegisterPersonaImportQueueDraft={handleRegisterPersonaImportQueueDraft}
          onAdoptImportQueueItem={handleAdoptAiJsonImportQueueItem}
          onDiscardImportQueueItem={handleDiscardAiJsonImportQueueItem}
          aiJsonImportQueueItems={aiJsonImportQueue}
        />
      ) : null}
    </AppShell>
  );
}

