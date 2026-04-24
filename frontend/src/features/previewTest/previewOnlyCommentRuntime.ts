import type { SharedOrientation } from "../../basicPreviewBridge";

export type PreviewOnlyRuntimeCategory =
  | "挨拶っぽい"
  | "質問っぽい"
  | "応援っぽい"
  | "unknown"
  | "ignore 寄り";

export interface PreviewOnlyReaction {
  result_label: string;
  category_label: PreviewOnlyRuntimeCategory;
  reason_label: string;
  reaction_name: string;
  adoption_label: string;
  target_label: "viewer" | "streamer";
  orientation: SharedOrientation;
  bubble_text: string;
}

interface DecidePreviewReactionInput {
  normalizedComment: string;
  firstPerson: string;
  viewerCall: string;
  toneLabel: string;
  endingStyle: string;
}

// Preview / Test 専用の仮ロジック。
// 正式 runtime 最小入口とは分離して残しておき、本番 runtime へ昇格させない。
export function normalizeCommentInput(text: string) {
  return text.trim().toLowerCase();
}

// Preview / Test で見え方を確認するための簡易判定。
// 正式ルール処理や runtime contract の主導線とは分離して扱う。
export function decidePreviewReaction({
  normalizedComment,
  firstPerson,
  viewerCall,
  toneLabel,
  endingStyle,
}: DecidePreviewReactionInput): PreviewOnlyReaction {
  const endingSuffix = buildEndingSuffix(endingStyle);

  if (
    normalizedComment.includes("www") ||
    normalizedComment === "w" ||
    normalizedComment.includes("草") ||
    normalizedComment.includes("言って") ||
    normalizedComment.includes("ngワード")
  ) {
    return {
      result_label: "ignored",
      category_label: "ignore 寄り",
      reason_label: "短文ノイズまたは誘導寄りのため仮 ignore",
      reaction_name: "ignore 候補",
      adoption_label: "不採用",
      target_label: "viewer",
      orientation: "side",
      bubble_text: `${firstPerson}はこの入力を ignore 寄りとして扱いました${endingSuffix} Preview / Test 専用の見え方だけを確認しています。`,
    };
  }

  if (
    normalizedComment.includes("こんにちは") ||
    normalizedComment.includes("こんばんは") ||
    normalizedComment.includes("おはよう") ||
    normalizedComment.includes("初見") ||
    normalizedComment.includes("来ました")
  ) {
    return {
      result_label: "displayed",
      category_label: "挨拶っぽい",
      reason_label: "あいさつ系キーワードを検出",
      reaction_name: "挨拶返答",
      adoption_label: "採用",
      target_label: "viewer",
      orientation: "front",
      bubble_text: `${viewerCall}、来てくれてありがとうございます${endingSuffix} ${toneLabel} の仮反応を確認しています。`,
    };
  }

  if (
    normalizedComment.includes("？") ||
    normalizedComment.includes("?") ||
    normalizedComment.includes("どう") ||
    normalizedComment.includes("何") ||
    normalizedComment.includes("どんな") ||
    normalizedComment.includes("ですか")
  ) {
    return {
      result_label: "displayed",
      category_label: "質問っぽい",
      reason_label: "質問らしい記号または語尾を検出",
      reaction_name: "質問応答",
      adoption_label: "採用",
      target_label: "viewer",
      orientation: "front",
      bubble_text: `${firstPerson}は質問っぽい入力として拾いました${endingSuffix} いまは Preview / Test 専用の仮応答で確認しています。`,
    };
  }

  if (
    normalizedComment.includes("応援") ||
    normalizedComment.includes("がんば") ||
    normalizedComment.includes("好き") ||
    normalizedComment.includes("よかった") ||
    normalizedComment.includes("すごい")
  ) {
    return {
      result_label: "displayed",
      category_label: "応援っぽい",
      reason_label: "応援または好意寄りの語を検出",
      reaction_name: "応援お礼",
      adoption_label: "採用",
      target_label: "viewer",
      orientation: "side",
      bubble_text: `${viewerCall}からの応援っぽい入力として受けました${endingSuffix} Preview / Test 限定の仮 wiring なので反応名は確認用です。`,
    };
  }

  return {
    result_label: "unknown",
    category_label: "unknown",
    reason_label: "簡易分類でカテゴリを決めきれない",
    reaction_name: "unknown 仮反応",
    adoption_label: "保留",
    target_label: "viewer",
    orientation: "front",
    bubble_text: `${firstPerson}はこの入力を unknown 扱いにしました${endingSuffix} 正式ルールではなく Preview / Test 限定の仮 runtime 結果だけを表示しています。`,
  };
}

function buildEndingSuffix(endingStyle: string) {
  if (endingStyle.includes("だね")) {
    return "だよ。";
  }

  if (endingStyle.includes("特に固定しない")) {
    return "です。";
  }

  return "ですね。";
}
