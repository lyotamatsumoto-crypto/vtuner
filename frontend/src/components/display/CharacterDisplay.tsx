export interface CharacterDisplayProps {
  character_name?: string;
  orientation: "front" | "side";
  mirror: boolean;
  asset_path?: string;
  accent_color?: string;
}

export function CharacterDisplay({
  character_name = "VTuner",
  orientation,
  mirror,
  asset_path,
  accent_color = "#4AAEB6",
}: CharacterDisplayProps) {
  const faceRotation = orientation === "front" ? "rotate(0deg)" : "rotate(-10deg)";
  const eyeScale = orientation === "front" ? "scaleX(1)" : "scaleX(0.7)";
  const shoulderOffset = orientation === "front" ? "50%" : "56%";
  const ribbonOffset = orientation === "front" ? "61%" : "66%";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transform: mirror ? "scaleX(-1)" : "none",
        transformOrigin: "center center",
        filter: "drop-shadow(0 18px 28px rgba(47, 62, 70, 0.18))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "8% 12% 8% 14%",
          borderRadius: "42% 38% 28% 24%",
          background: "linear-gradient(180deg, #FFEADB 0%, #F4C49D 55%, #E19186 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "4%",
          top: "18%",
          width: "34%",
          height: "48%",
          borderRadius: "48% 42% 44% 54%",
          background: "linear-gradient(180deg, #FFE5D2 0%, #F3B596 55%, #D8897E 100%)",
          transform: orientation === "front" ? "rotate(10deg)" : "rotate(20deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "35%",
          top: "22%",
          width: "30%",
          height: "24%",
          borderRadius: "48% 48% 52% 52%",
          background: "linear-gradient(180deg, #FFF3E8 0%, #FFE4D5 100%)",
          transform: faceRotation,
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "27%",
          top: "15%",
          width: "30%",
          height: "22%",
          borderRadius: "62% 34% 48% 50%",
          background: "linear-gradient(180deg, #FFF0DF 0%, #F7CBA4 100%)",
          transform: "rotate(-12deg)",
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "46%",
          top: "14%",
          width: "25%",
          height: "23%",
          borderRadius: "32% 62% 42% 58%",
          background: "linear-gradient(180deg, #FFF0DF 0%, #F7C6A2 100%)",
          transform: orientation === "front" ? "rotate(12deg)" : "rotate(18deg)",
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "13%",
          width: "18%",
          height: "3.5%",
          borderRadius: "999px",
          background: "linear-gradient(90deg, #7DDF5A, #FF5A9C)",
          transform: "rotate(14deg)",
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "33%",
          left: orientation === "front" ? "44%" : "46%",
          width: "6%",
          height: "5.5%",
          borderRadius: "48% 52% 52% 48%",
          background:
            "radial-gradient(circle at 45% 35%, #FFFFFF 0 14%, #B99FFF 20%, #7C5CF6 60%, #5B21B6 100%)",
          transform: eyeScale,
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "33%",
          left: orientation === "front" ? "56%" : "58%",
          width: orientation === "front" ? "6%" : "4.6%",
          height: "5.5%",
          borderRadius: "48% 52% 52% 48%",
          background:
            "radial-gradient(circle at 45% 35%, #FFFFFF 0 14%, #B99FFF 20%, #7C5CF6 60%, #5B21B6 100%)",
          transform: eyeScale,
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: orientation === "front" ? "51%" : "54%",
          top: "42%",
          width: "7%",
          height: "3%",
          borderBottom: "2px solid #D67B76",
          borderRadius: "0 0 999px 999px",
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "28%",
          top: "45%",
          width: "42%",
          height: "38%",
          borderRadius: "18% 18% 10% 10%",
          background: "linear-gradient(180deg, #EA5854 0%, #C63D3A 100%)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "39%",
          top: "49%",
          width: "20%",
          height: "10%",
          background: "#FFFFFF",
          clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: ribbonOffset,
          top: "36%",
          width: "12%",
          height: "8%",
          background: "linear-gradient(90deg, #F97316 0%, #EF4444 100%)",
          clipPath:
            "polygon(0 50%, 24% 0, 50% 40%, 76% 0, 100% 50%, 76% 100%, 50% 60%, 24% 100%)",
          zIndex: 6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: shoulderOffset,
          top: "36%",
          width: "5%",
          height: "5%",
          borderRadius: "999px",
          background: accent_color,
          zIndex: 7,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "2%",
          transform: `${mirror ? "scaleX(-1) " : ""}translateX(-50%)`,
          padding: "6px 10px",
          borderRadius: "999px",
          border: "1px solid rgba(191, 220, 221, 0.9)",
          background: "rgba(255, 255, 255, 0.92)",
          color: "#2F3E46",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
          zIndex: 8,
        }}
      >
        {character_name}
        {asset_path ? " / asset linked" : " / placeholder display"}
      </div>
    </div>
  );
}

export const characterDisplayPlacement = {
  component_name: "CharacterDisplay",
  directory: "frontend/src/components/display",
  reused_by: ["Preview / Test", "Overlay"],
  includes_ui_controls: false,
} as const;
