import type {
  SharedOrientation,
  SideImageFacingTarget,
} from "../../basicPreviewBridge";

type VisualSpeechTarget = "viewer" | "streamer" | "all";

interface ResolveVisualDirectionInput {
  speechTarget: VisualSpeechTarget;
  sideImageFacing: SideImageFacingTarget;
  defaultFacing: SharedOrientation;
  mirrorEnabled: boolean;
}

interface ResolvedVisualDirection {
  orientation: SharedOrientation;
  mirror: boolean;
  reasonLabel: string;
}

export function resolveVisualDirection({
  speechTarget,
  sideImageFacing,
  defaultFacing,
  mirrorEnabled,
}: ResolveVisualDirectionInput): ResolvedVisualDirection {
  if (speechTarget === "viewer") {
    return {
      orientation: "side",
      mirror: sideImageFacing === "viewer" ? false : true,
      reasonLabel:
        sideImageFacing === "viewer"
          ? "viewer向け: side画像は視聴者側向きのため mirrorなし"
          : "viewer向け: side画像は配信者側向きのため mirror反転",
    };
  }

  if (speechTarget === "streamer") {
    return {
      orientation: "side",
      mirror: sideImageFacing === "streamer" ? false : true,
      reasonLabel:
        sideImageFacing === "streamer"
          ? "streamer向け: side画像は配信者側向きのため mirrorなし"
          : "streamer向け: side画像は視聴者側向きのため mirror反転",
    };
  }

  return {
    orientation: "front",
    mirror: mirrorEnabled,
    reasonLabel: `all向け: front表示を採用（defaultFacing=${defaultFacing}, mirror=${mirrorEnabled ? "on" : "off"}）`,
  };
}
