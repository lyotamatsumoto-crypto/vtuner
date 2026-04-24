import { CharacterDisplay, type CharacterDisplayProps } from "./CharacterDisplay";
import { SpeechBubble, type SpeechBubbleProps } from "./SpeechBubble";

type BackgroundVariant = "mint" | "studio" | "night";

export interface CharacterStageProps {
  transparent_background: boolean;
  show_preview_overlay_label: boolean;
  stage_label?: string;
  subtitle?: string;
  background_variant?: BackgroundVariant;
  character: CharacterDisplayProps & {
    position_x: number;
    position_y: number;
    scale_percent: number;
  };
  bubble: SpeechBubbleProps & {
    position_x: number;
    position_y: number;
    width_percent: number;
  };
}

const stageBackgrounds: Record<BackgroundVariant, string> = {
  mint: "linear-gradient(180deg, #EAF3F8 0%, #DFF3F6 45%, #EAF7F7 100%)",
  studio: "linear-gradient(180deg, #FFF6E9 0%, #F8E2D4 42%, #F4F0FF 100%)",
  night: "linear-gradient(180deg, #20304B 0%, #314C69 48%, #445F7C 100%)",
};

export function CharacterStage({
  transparent_background,
  show_preview_overlay_label,
  stage_label = "Main Preview",
  subtitle,
  background_variant = "mint",
  character,
  bubble,
}: CharacterStageProps) {
  const stageBackground = transparent_background ? "transparent" : stageBackgrounds[background_variant];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        minHeight: "420px",
        overflow: "hidden",
        borderRadius: "20px",
        border: transparent_background ? "none" : "1px solid #8FCFD3",
        background: stageBackground,
      }}
    >
      {transparent_background ? null : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.24), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.05))",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: "14px",
          top: "14px",
          zIndex: 4,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.72)",
          background: "rgba(255,255,255,0.92)",
          color: "#357F91",
          fontSize: "12px",
          fontWeight: 800,
        }}
      >
        {stage_label}
      </div>
      {subtitle ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "3.5%",
            transform: "translateX(-50%)",
            maxWidth: "74%",
            minWidth: "260px",
            padding: "10px 14px",
            borderRadius: "12px",
            background: "rgba(47, 62, 70, 0.86)",
            color: "#FFFFFF",
            fontSize: "14px",
            lineHeight: 1.55,
            textAlign: "center",
            zIndex: 4,
          }}
        >
          {subtitle}
        </div>
      ) : null}
      {
        // Preview / Test can opt into this badge. Overlay reuse should keep it off.
      }
      {show_preview_overlay_label ? (
        <div
          style={{
            position: "absolute",
            right: "14px",
            top: "14px",
            zIndex: 4,
            padding: "7px 11px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.7)",
            background: "rgba(255,255,255,0.92)",
            color: "#5F747A",
            fontSize: "11px",
            fontWeight: 800,
          }}
        >
          Preview controls visible
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: `${bubble.position_x}%`,
          top: `${bubble.position_y}%`,
          width: `${bubble.width_percent}%`,
          minWidth: "250px",
          maxWidth: "440px",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
        }}
      >
        <SpeechBubble {...bubble} />
      </div>
      <div
        style={{
          position: "absolute",
          left: `${character.position_x}%`,
          top: `${character.position_y}%`,
          width: `${character.scale_percent / 2.6}%`,
          minWidth: "190px",
          maxWidth: "320px",
          aspectRatio: "0.78 / 1",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
        }}
      >
        <CharacterDisplay {...character} />
      </div>
    </div>
  );
}

export const characterStagePlacement = {
  component_name: "CharacterStage",
  directory: "frontend/src/components/display",
  reused_by: ["Preview / Test", "Overlay"],
  includes_ui_controls: false,
  note: "Preview / Test and Overlay are separate routes that reuse the same display layer.",
} as const;
