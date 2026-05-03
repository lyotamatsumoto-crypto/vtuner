import { CharacterStage } from "../components/display";
import type { BasicPreviewBridgeSettings } from "../basicPreviewBridge";
import type { CompileRecord } from "../../../schemas";
import type { CompiledRuntimeEntry } from "../reviewCompileBridge";

export function OverlayCharacterPage({
  sharedSettings,
  compiledRuntimeEntries,
  lastCompileRecord,
}: {
  sharedSettings: BasicPreviewBridgeSettings;
  compiledRuntimeEntries: CompiledRuntimeEntry[];
  lastCompileRecord: CompileRecord | null;
}) {
  const firstCompiledEntry = compiledRuntimeEntries[0] ?? null;
  const orientation = firstCompiledEntry?.display_facing ?? sharedSettings.defaultFacing;
  const bubbleText =
    firstCompiledEntry !== null
      ? `compile反映: ${firstCompiledEntry.target_name}`
      : "Overlay 表示専用ルート（compile 後反映待ち）";

  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: "transparent",
      }}
    >
      <CharacterStage
        transparent_background
        show_stage_label={false}
        show_preview_overlay_label={false}
        stage_label="Overlay"
        {...(lastCompileRecord ? {} : { subtitle: "確認版 Overlay 出力" })}
        background_variant={sharedSettings.previewBackgroundVariant}
        character={{
          character_name: sharedSettings.vtunerName,
          orientation,
          mirror: sharedSettings.mirrorEnabled,
          position_x: 74,
          position_y: 68,
          scale_percent: 84,
        }}
        bubble={{
          text: bubbleText,
          visible: sharedSettings.bubbleEnabled === "使う",
          text_color: sharedSettings.bubbleTextColor,
          background_color: sharedSettings.bubbleBackgroundColor,
          position_x: 31,
          position_y: 50,
          width_percent: 36,
        }}
      />
    </main>
  );
}
