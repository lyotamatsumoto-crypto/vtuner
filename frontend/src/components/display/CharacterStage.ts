export interface CharacterStageProps {
  transparent_background: boolean;
  show_ui_controls: boolean;
}

export const characterStagePlacement = {
  component_name: "CharacterStage",
  directory: "frontend/src/components/display",
  reused_by: ["Preview / Test", "Overlay"],
  includes_ui_controls: false,
  note: "Preview / Test and Overlay are separate routes that reuse the same display layer.",
} as const;
