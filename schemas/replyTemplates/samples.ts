import type { ReplyTemplatesJson } from "./replyTemplateTypes";

export const validReplyTemplatesJsonSample: ReplyTemplatesJson = {
  reply_templates: {
    greeting: {
      short: ["こんばんは。"],
      normal: ["こんばんは。来てくれてうれしいです。"],
      long: ["こんばんは。今日も来てくれてうれしいです。ゆっくりしていってくださいね。"],
    },
    compliment: {
      short: ["ありがとうございます。"],
      normal: ["ありがとうございます。そう言ってもらえるとうれしいです。"],
      long: ["ありがとうございます。落ち着いた空気を大事にしているので、そう感じてもらえるとうれしいです。"],
    },
  },
};

export const invalidReplyTemplatesJsonSample: unknown = {
  reply_templates: {
    greeting: {
      short: [""],
      normal: ["こんばんは。"],
      extra: ["invalid"],
    },
    compliment: {
      short: "ありがとうございます。",
      normal: [
        "ありがとうございます。".repeat(20),
      ],
      long: ["ありがとうございます。"],
    },
    unknown_category: {
      short: ["x"],
      normal: ["y"],
      long: ["z"],
    },
  },
};
