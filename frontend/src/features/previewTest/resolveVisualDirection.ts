import type {
  SharedOrientation,
  SideImageFacingTarget,
} from "../../basicPreviewBridge";

type VisualSpeechTarget = "viewer" | "streamer" | "all";

interface ResolveVisualDirectionInput {
  speechTarget: VisualSpeechTarget;
  sideImageFacing: SideImageFacingTarget;
  viewerTargetFacing: SharedOrientation;
  streamerTargetFacing: SharedOrientation;
  allTargetFacing: SharedOrientation;
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
  viewerTargetFacing,
  streamerTargetFacing,
  allTargetFacing,
  mirrorEnabled,
}: ResolveVisualDirectionInput): ResolvedVisualDirection {
  const targetFacing =
    speechTarget === "viewer"
      ? viewerTargetFacing
      : speechTarget === "streamer"
        ? streamerTargetFacing
        : allTargetFacing;

  if (targetFacing === "front") {
    return {
      orientation: "front",
      mirror: mirrorEnabled,
      reasonLabel: `${speechTarget}向け: targetFacing=front のため front表示（mirror=${mirrorEnabled ? "on" : "off"}）`,
    };
  }

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
    orientation: "side",
    mirror: mirrorEnabled,
    reasonLabel: `all向け: targetFacing=side のため side表示（mirror=${mirrorEnabled ? "on" : "off"}）`,
  };
}
