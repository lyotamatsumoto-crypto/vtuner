"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPILE_WAIT_STATUSES = exports.ADOPTED_CHANGE_SOURCE_LANES = exports.ADOPTED_CHANGE_TYPES = exports.AI_JSON_IMPORT_STATUSES = exports.AI_JSON_GENERATION_TARGETS = exports.REVIEW_PATCH_STATUSES = exports.REVIEW_PATCH_ACTIONS = exports.REVIEW_PATCH_TYPES = exports.REVIEW_COMMENT_STATES = void 0;
exports.REVIEW_COMMENT_STATES = [
    "unknown",
    "skipped",
    "displayed",
    "ignored",
];
exports.REVIEW_PATCH_TYPES = [
    "ignore_patch",
    "existing_category_patch",
    "new_candidate_patch",
];
exports.REVIEW_PATCH_ACTIONS = [
    "ignore",
    "existing_category",
    "new_candidate",
];
exports.REVIEW_PATCH_STATUSES = [
    "candidate",
    "pending",
    "adopted",
    "discarded",
    "compiled",
];
exports.AI_JSON_GENERATION_TARGETS = [
    "persona",
    "response_category",
    "reply_collection",
    "condition_event",
    "category_definition",
    "error_correction",
];
exports.AI_JSON_IMPORT_STATUSES = [
    "imported",
    "validated",
    "validation_failed",
    "adopted",
    "discarded",
];
exports.ADOPTED_CHANGE_TYPES = [
    "review_patch",
    "persona_json",
    "draft_json",
];
exports.ADOPTED_CHANGE_SOURCE_LANES = [
    "review_patch_queue",
    "ai_json_import_queue",
];
exports.COMPILE_WAIT_STATUSES = [
    "pending",
    "compiled",
];
