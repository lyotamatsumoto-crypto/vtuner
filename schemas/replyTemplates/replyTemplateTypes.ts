export const REPLY_TEMPLATE_CATEGORIES = [
  "greeting",
  "compliment",
  "question",
  "empathy",
] as const;

export const REPLY_TEMPLATE_LENGTHS = [
  "short",
  "normal",
  "long",
] as const;

export type ReplyTemplateCategory = (typeof REPLY_TEMPLATE_CATEGORIES)[number];
export type ReplyTemplateLength = (typeof REPLY_TEMPLATE_LENGTHS)[number];

export type ReplyTemplateLengthMap = Record<ReplyTemplateLength, string[]>;

export type ReplyTemplatesMap = Partial<
  Record<ReplyTemplateCategory, ReplyTemplateLengthMap>
>;

export interface ReplyTemplatesJson {
  reply_templates: ReplyTemplatesMap;
}

export const REPLY_TEMPLATE_MAX_ITEMS_PER_LENGTH = 20;
export const REPLY_TEMPLATE_MAX_TEXT_LENGTH = 200;
