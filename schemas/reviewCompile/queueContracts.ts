export const REVIEW_COMMENT_STATES = [
  "unknown",
  "skipped",
  "displayed",
  "ignored",
] as const;

export type ReviewCommentState = (typeof REVIEW_COMMENT_STATES)[number];

export const REVIEW_PATCH_TYPES = [
  "ignore_patch",
  "existing_category_patch",
  "new_candidate_patch",
] as const;

export type ReviewPatchType = (typeof REVIEW_PATCH_TYPES)[number];

export const REVIEW_PATCH_ACTIONS = [
  "ignore",
  "existing_category",
  "new_candidate",
] as const;

export type ReviewPatchAction = (typeof REVIEW_PATCH_ACTIONS)[number];

export const REVIEW_PATCH_STATUSES = [
  "candidate",
  "pending",
  "adopted",
  "discarded",
  "compiled",
] as const;

export type ReviewPatchStatus = (typeof REVIEW_PATCH_STATUSES)[number];

export interface ReviewCommentSourceRef {
  source_type: "pasted_text";
  session_id: string;
  original_text: string;
  extracted_author?: string;
  extracted_body?: string;
  extracted_metadata?: string[];
  parse_errors?: string[];
}

export interface ReviewPatchQueueItem {
  id: string;
  patch_type: ReviewPatchType;
  comment_state: ReviewCommentState;
  inferred_category_candidates: string[];
  selected_action: ReviewPatchAction;
  target_category_or_definition?: string;
  proposal_summary: string;
  source_ref: ReviewCommentSourceRef;
  created_at: string;
  status: ReviewPatchStatus;
}

export const AI_JSON_GENERATION_TARGETS = [
  "persona",
  "reply_templates",
  "response_category",
  "reply_collection",
  "condition_event",
  "category_definition",
  "error_correction",
] as const;

export type AiJsonGenerationTarget =
  (typeof AI_JSON_GENERATION_TARGETS)[number];

export const AI_JSON_IMPORT_STATUSES = [
  "imported",
  "validated",
  "validation_failed",
  "adopted",
  "discarded",
] as const;

export type AiJsonImportStatus = (typeof AI_JSON_IMPORT_STATUSES)[number];

export interface AiJsonImportQueueItem {
  id: string;
  generation_target: AiJsonGenerationTarget;
  source_natural_text: string;
  prompt_text: string;
  returned_json: unknown;
  validation_ok: boolean;
  status: AiJsonImportStatus;
  error_messages: string[];
  created_at: string;
}

export const ADOPTED_CHANGE_TYPES = [
  "review_patch",
  "persona_json",
  "draft_json",
] as const;

export type AdoptedChangeType = (typeof ADOPTED_CHANGE_TYPES)[number];

export const ADOPTED_CHANGE_SOURCE_LANES = [
  "review_patch_queue",
  "ai_json_import_queue",
] as const;

export type AdoptedChangeSourceLane =
  (typeof ADOPTED_CHANGE_SOURCE_LANES)[number];

export const COMPILE_WAIT_STATUSES = [
  "pending",
  "compiled",
] as const;

export type CompileWaitStatus = (typeof COMPILE_WAIT_STATUSES)[number];

export interface AdoptedChangeItem {
  id: string;
  adopted_type: AdoptedChangeType;
  source_lane: AdoptedChangeSourceLane;
  adopted_at: string;
  target_name: string;
  target_kind: string;
  compile_wait_status: CompileWaitStatus;
}
