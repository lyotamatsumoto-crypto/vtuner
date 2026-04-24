import type {
  IgnoreDecision,
  ReplyDecision,
  RuntimeDecision,
  SkipDecision,
  TestEventInput,
} from "../../../../schemas/runtime/runtimeTypes";

// Preview / Test 用の条件イベント簡易処理。
// runtime contract は使うが、本番 runtime の完成版としては扱わない。
export function decidePreviewTestEvent(input: TestEventInput): RuntimeDecision {
  if (input.test_name === "silence-120") {
    const decision: ReplyDecision = {
      kind: "reply",
      reason_label: "無コメント条件成立",
      source: "test_event_input",
      used_category: "応援っぽい",
      reply_name: "無言時の話題振り",
      reply_text: "少し静かになってきましたね。ここで最近の小さな話題をひとつ挟んでみます。",
      speech_target: "viewer",
      persona_layer: "viewer_mode",
      display_orientation: {
        facing: "front",
        mirror: false,
      },
    };

    return decision;
  }

  if (input.test_name === "rapid-post") {
    const decision: SkipDecision = {
      kind: "skip",
      reason_label: "連投抑制",
      source: "test_event_input",
      suppression_type: "rapid_post_guard",
      related_rule: "same_user_rapid_post",
      should_review: false,
    };

    return decision;
  }

  const decision: IgnoreDecision = {
    kind: "ignore",
    reason_label: "NGワード一致",
    source: "test_event_input",
    related_rule: "ng_word_match",
    should_record_review: false,
  };

  return decision;
}
