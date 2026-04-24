export interface SpeechBubbleProps {
  text: string;
  visible: boolean;
  font_family?: string;
  text_color?: string;
  background_color?: string;
  label?: string;
}

export function SpeechBubble({
  text,
  visible,
  font_family,
  text_color = "#2F3E46",
  background_color = "rgba(255, 255, 255, 0.98)",
  label,
}: SpeechBubbleProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "120px",
        padding: "18px 18px 16px",
        borderRadius: "20px",
        border: "1px solid #BFDCDD",
        background: background_color,
        boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
        color: text_color,
        fontFamily: font_family ?? "\"Noto Sans JP\", system-ui, sans-serif",
        lineHeight: 1.7,
      }}
    >
      {label ? (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "18px",
            padding: "5px 9px",
            borderRadius: "999px",
            background: "#DDF3F4",
            color: "#357F91",
            fontSize: "11px",
            fontWeight: 800,
          }}
        >
          {label}
        </div>
      ) : null}
      <div style={{ paddingTop: label ? "6px" : 0, fontSize: "15px" }}>{text}</div>
      <div
        style={{
          position: "absolute",
          left: "34px",
          bottom: "-10px",
          width: "18px",
          height: "18px",
          transform: "rotate(45deg)",
          background: background_color,
          borderRight: "1px solid #BFDCDD",
          borderBottom: "1px solid #BFDCDD",
        }}
      />
    </div>
  );
}

export const speechBubblePlacement = {
  component_name: "SpeechBubble",
  directory: "frontend/src/components/display",
  reused_by: ["Preview / Test", "Overlay"],
  includes_ui_controls: false,
} as const;
