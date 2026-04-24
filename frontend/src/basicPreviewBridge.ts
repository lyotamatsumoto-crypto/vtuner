export type SharedOrientation = "front" | "side";
export type PreviewBackgroundVariant = "mint" | "studio" | "night";
export type DisplaySizeOption = "小さめ" | "標準" | "やや大きめ";
export type BubbleToggle = "使う" | "使わない";

export interface BasicPreviewBridgeSettings {
  vtunerName: string;
  firstPerson: string;
  viewerCall: string;
  streamerCall: string;
  toneLabel: string;
  endingStyle: string;
  defaultFacing: SharedOrientation;
  mirrorEnabled: boolean;
  displaySize: DisplaySizeOption;
  bubbleEnabled: BubbleToggle;
  bubbleTextColor: string;
  bubbleBackgroundColor: string;
  previewBackgroundVariant: PreviewBackgroundVariant;
}

export const defaultBasicPreviewBridgeSettings: BasicPreviewBridgeSettings = {
  vtunerName: "ヴィヴィ",
  firstPerson: "私",
  viewerCall: "皆さん",
  streamerCall: "マスター",
  toneLabel: "丁寧で落ち着いた口調",
  endingStyle: "〜ですね / 〜ですよ",
  defaultFacing: "front",
  mirrorEnabled: true,
  displaySize: "標準",
  bubbleEnabled: "使う",
  bubbleTextColor: "#111827",
  bubbleBackgroundColor: "#FFFFFF",
  previewBackgroundVariant: "mint",
};

export function displaySizeToScale(displaySize: DisplaySizeOption) {
  if (displaySize === "やや大きめ") {
    return 92;
  }

  if (displaySize === "小さめ") {
    return 72;
  }

  return 82;
}
