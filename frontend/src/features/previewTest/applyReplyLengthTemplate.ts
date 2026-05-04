import type { RuntimeDecision } from "../../../../schemas/runtime/runtimeTypes";
import {
  replyTemplates,
  type ReplyTemplateCategory,
  type ReplyTemplateLength,
} from "./replyTemplates";

interface ApplyReplyLengthTemplateInput {
  runtimeDecision: RuntimeDecision;
  replyLengthMode: "short" | "normal" | "long";
}

interface ApplyReplyLengthTemplateResult {
  templatedDecision: RuntimeDecision;
  templateApplied: boolean;
  templateCategory: string;
  templateLength: ReplyTemplateLength;
  templateReasonLabel: string;
}

export function applyReplyLengthTemplate({
  runtimeDecision,
  replyLengthMode,
}: ApplyReplyLengthTemplateInput): ApplyReplyLengthTemplateResult {
  if (runtimeDecision.kind !== "reply") {
    return {
      templatedDecision: runtimeDecision,
      templateApplied: false,
      templateCategory: "n/a",
      templateLength: replyLengthMode,
      templateReasonLabel: "template未適用: runtimeDecision が reply ではない",
    };
  }

  if (replyLengthMode === "normal") {
    return {
      templatedDecision: runtimeDecision,
      templateApplied: false,
      templateCategory: "n/a",
      templateLength: "normal",
      templateReasonLabel: "template未適用: normal は既存 reply_text を維持",
    };
  }

  const resolvedCategory = resolveTemplateCategory(runtimeDecision);
  if (!resolvedCategory) {
    return {
      templatedDecision: runtimeDecision,
      templateApplied: false,
      templateCategory: "unresolved",
      templateLength: replyLengthMode,
      templateReasonLabel: "template未適用: category を解決できないため既存文を維持",
    };
  }

  const candidate = replyTemplates[resolvedCategory][replyLengthMode][0];
  if (!candidate) {
    return {
      templatedDecision: runtimeDecision,
      templateApplied: false,
      templateCategory: resolvedCategory,
      templateLength: replyLengthMode,
      templateReasonLabel: "template未適用: 指定lengthテンプレートがないため既存文を維持",
    };
  }

  return {
    templatedDecision: {
      ...runtimeDecision,
      reply_text: candidate,
    },
    templateApplied: true,
    templateCategory: resolvedCategory,
    templateLength: replyLengthMode,
    templateReasonLabel: `template適用: ${resolvedCategory} / ${replyLengthMode}`,
  };
}

function resolveTemplateCategory(runtimeDecision: Extract<RuntimeDecision, { kind: "reply" }>) {
  const joined = [
    runtimeDecision.used_category,
    runtimeDecision.reply_name ?? "",
    runtimeDecision.reason_label,
    runtimeDecision.reply_text ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (joined.includes("挨拶") || joined.includes("greeting")) {
    return "greeting" as ReplyTemplateCategory;
  }

  if (joined.includes("質問") || joined.includes("question")) {
    return "question" as ReplyTemplateCategory;
  }

  if (
    joined.includes("共感") ||
    joined.includes("雰囲気") ||
    joined.includes("静か") ||
    joined.includes("empathy") ||
    joined.includes("quiet")
  ) {
    return "empathy" as ReplyTemplateCategory;
  }

  if (joined.includes("褒め") || joined.includes("compliment")) {
    return "compliment" as ReplyTemplateCategory;
  }

  return null;
}
