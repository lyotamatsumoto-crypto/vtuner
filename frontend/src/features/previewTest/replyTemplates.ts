export const replyTemplates = {
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
  question: {
    short: ["そうですね。"],
    normal: ["そうですね。少し整理しながら答えてみます。"],
    long: ["そうですね。少し整理しながら、今の流れに合わせて答えてみます。"],
  },
  empathy: {
    short: ["わかります。"],
    normal: ["わかります。そういう空気もありますよね。"],
    long: ["わかります。そういう空気もありますよね。今日は少し落ち着いて進めてもよさそうです。"],
  },
} as const;

export type ReplyTemplateCategory = keyof typeof replyTemplates;
export type ReplyTemplateLength = keyof (typeof replyTemplates)["greeting"];
