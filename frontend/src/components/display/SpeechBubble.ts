export interface SpeechBubbleProps {
  text: string;
  visible: boolean;
  font_family?: string;
  text_color?: string;
  background_color?: string;
}

export const speechBubblePlacement = {
  component_name: "SpeechBubble",
  directory: "frontend/src/components/display",
  reused_by: ["Preview / Test", "Overlay"],
  includes_ui_controls: false,
} as const;
