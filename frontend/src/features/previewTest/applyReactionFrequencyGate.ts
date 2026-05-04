import type {
  IgnoreDecision,
  RuntimeDecision,
} from "../../../../schemas/runtime/runtimeTypes";

interface ApplyReactionFrequencyGateInput {
  runtimeDecision: RuntimeDecision;
  reactionFrequencyMode: "low" | "normal" | "high";
}

interface ApplyReactionFrequencyGateResult {
  gatedDecision: RuntimeDecision;
  gateApplied: boolean;
  gateReasonLabel: string;
}

export function applyReactionFrequencyGate({
  runtimeDecision,
  reactionFrequencyMode,
}: ApplyReactionFrequencyGateInput): ApplyReactionFrequencyGateResult {
  if (reactionFrequencyMode !== "low") {
    return {
      gatedDecision: runtimeDecision,
      gateApplied: false,
      gateReasonLabel: "gate未適用: reactionFrequencyMode が low ではない",
    };
  }

  if (runtimeDecision.kind !== "reply") {
    return {
      gatedDecision: runtimeDecision,
      gateApplied: false,
      gateReasonLabel: "gate未適用: runtimeDecision が reply ではない",
    };
  }

  if (runtimeDecision.source === "test_event_input") {
    return {
      gatedDecision: runtimeDecision,
      gateApplied: false,
      gateReasonLabel: "gate未適用: test_event_input は保護対象",
    };
  }

  if (runtimeDecision.speech_target === "streamer") {
    return {
      gatedDecision: runtimeDecision,
      gateApplied: false,
      gateReasonLabel: "gate未適用: speech_target=streamer は保護対象",
    };
  }

  const joinedText = [
    runtimeDecision.used_category,
    runtimeDecision.reply_name ?? "",
    runtimeDecision.reason_label,
    runtimeDecision.reply_text ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const isQuestionOrGreeting =
    joinedText.includes("質問") ||
    joinedText.includes("question") ||
    joinedText.includes("挨拶") ||
    joinedText.includes("greeting");
  if (isQuestionOrGreeting) {
    return {
      gatedDecision: runtimeDecision,
      gateApplied: false,
      gateReasonLabel: "gate未適用: question/greeting は保護対象",
    };
  }

  const isLowPriorityReply =
    joinedText.includes("雰囲気") ||
    joinedText.includes("共感") ||
    joinedText.includes("静か") ||
    joinedText.includes("褒め");
  if (!isLowPriorityReply) {
    return {
      gatedDecision: runtimeDecision,
      gateApplied: false,
      gateReasonLabel: "gate未適用: low 抑制対象キーワードに一致しない",
    };
  }

  const ignoreDecision: IgnoreDecision = {
    kind: "ignore",
    source: runtimeDecision.source,
    reason_label:
      "reaction_frequency_low_gate: low mode により低優先度 reply を抑制",
    related_rule: "reaction_frequency_low_gate",
    should_record_review: false,
  };

  return {
    gatedDecision: ignoreDecision,
    gateApplied: true,
    gateReasonLabel:
      "low gate 適用: 低優先度 reply（雰囲気/共感/静か/褒め）を ignored へ変換",
  };
}
