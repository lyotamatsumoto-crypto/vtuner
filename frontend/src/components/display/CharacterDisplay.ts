export interface CharacterDisplayProps {
  character_name?: string;
  orientation: "front" | "side";
  mirror: boolean;
  asset_path?: string;
}

export const characterDisplayPlacement = {
  component_name: "CharacterDisplay",
  directory: "frontend/src/components/display",
  reused_by: ["Preview / Test", "Overlay"],
  includes_ui_controls: false,
} as const;
