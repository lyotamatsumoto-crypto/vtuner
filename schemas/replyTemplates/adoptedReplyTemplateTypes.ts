import type { ReplyTemplatesJson } from "./replyTemplateTypes";

export const ADOPTED_REPLY_TEMPLATE_STATUSES = [
  "active",
  "archived",
] as const;

export type AdoptedReplyTemplateStatus =
  (typeof ADOPTED_REPLY_TEMPLATE_STATUSES)[number];

export interface AdoptedReplyTemplatesItem {
  id: string;
  source_queue_item_id: string;
  generation_target: "reply_templates";
  name: string;
  adopted_at: string;
  status: AdoptedReplyTemplateStatus;
  reply_templates: ReplyTemplatesJson["reply_templates"];
}
