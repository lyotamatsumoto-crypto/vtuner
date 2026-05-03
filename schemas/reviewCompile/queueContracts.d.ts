export declare const REVIEW_COMMENT_STATES: readonly ["unknown", "skipped", "displayed", "ignored"];
export type ReviewCommentState = (typeof REVIEW_COMMENT_STATES)[number];
export declare const REVIEW_PATCH_TYPES: readonly ["ignore_patch", "existing_category_patch", "new_candidate_patch"];
export type ReviewPatchType = (typeof REVIEW_PATCH_TYPES)[number];
export declare const REVIEW_PATCH_ACTIONS: readonly ["ignore", "existing_category", "new_candidate"];
export type ReviewPatchAction = (typeof REVIEW_PATCH_ACTIONS)[number];
export declare const REVIEW_PATCH_STATUSES: readonly ["candidate", "pending", "adopted", "discarded", "compiled"];
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
export declare const AI_JSON_GENERATION_TARGETS: readonly ["persona", "response_category", "reply_collection", "condition_event", "category_definition", "error_correction"];
export type AiJsonGenerationTarget = (typeof AI_JSON_GENERATION_TARGETS)[number];
export declare const AI_JSON_IMPORT_STATUSES: readonly ["imported", "validated", "validation_failed", "adopted", "discarded"];
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
export declare const ADOPTED_CHANGE_TYPES: readonly ["review_patch", "persona_json", "draft_json"];
export type AdoptedChangeType = (typeof ADOPTED_CHANGE_TYPES)[number];
export declare const ADOPTED_CHANGE_SOURCE_LANES: readonly ["review_patch_queue", "ai_json_import_queue"];
export type AdoptedChangeSourceLane = (typeof ADOPTED_CHANGE_SOURCE_LANES)[number];
export declare const COMPILE_WAIT_STATUSES: readonly ["pending", "compiled"];
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
