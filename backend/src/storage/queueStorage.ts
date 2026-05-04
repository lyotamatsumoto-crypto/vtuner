import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type {
  AdoptedChangeItem,
  AiJsonImportQueueItem,
  ReviewPatchQueueItem,
} from "../contracts/queue";
import {
  ADOPTED_CHANGE_SOURCE_LANES,
  ADOPTED_CHANGE_TYPES,
  AI_JSON_GENERATION_TARGETS,
  AI_JSON_IMPORT_STATUSES,
  COMPILE_WAIT_STATUSES,
  REVIEW_COMMENT_STATES,
  REVIEW_PATCH_ACTIONS,
  REVIEW_PATCH_STATUSES,
  REVIEW_PATCH_TYPES,
} from "../contracts/queue";
import {
  QUEUE_FILE_PATHS,
  resolveStoragePath,
} from "./fileLayout";

class StorageValidationError extends Error {
  code = "STORAGE_VALIDATION_ERROR" as const;
}

type QueueItemValidator<T> = (item: unknown) => item is T;

async function readJsonArrayFile<T>(
  relativePath: string,
  validator: QueueItemValidator<T>,
): Promise<T[]> {
  const absolutePath = resolveStoragePath(relativePath);

  try {
    const raw = await readFile(absolutePath, "utf8");
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new StorageValidationError(
        `Storage file must be a JSON array: ${relativePath}`,
      );
    }

    if (!parsed.every(validator)) {
      throw new StorageValidationError(
        `Storage array item shape is invalid: ${relativePath}`,
      );
    }

    return parsed;
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }

    throw error;
  }
}

async function writeJsonArrayFile<T>(
  relativePath: string,
  items: T[],
  validator: QueueItemValidator<T>,
): Promise<void> {
  if (!Array.isArray(items) || !items.every(validator)) {
    throw new StorageValidationError(
      `Write payload shape is invalid: ${relativePath}`,
    );
  }

  const absolutePath = resolveStoragePath(relativePath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

export function readReviewPatchQueue() {
  return readJsonArrayFile<ReviewPatchQueueItem>(
    QUEUE_FILE_PATHS.review_patch_queue,
    isReviewPatchQueueItem,
  );
}

export function writeReviewPatchQueue(items: ReviewPatchQueueItem[]) {
  return writeJsonArrayFile(
    QUEUE_FILE_PATHS.review_patch_queue,
    items,
    isReviewPatchQueueItem,
  );
}

export function readAdoptedChanges() {
  return readJsonArrayFile<AdoptedChangeItem>(
    QUEUE_FILE_PATHS.adopted_changes,
    isAdoptedChangeItem,
  );
}

export function writeAdoptedChanges(items: AdoptedChangeItem[]) {
  return writeJsonArrayFile(
    QUEUE_FILE_PATHS.adopted_changes,
    items,
    isAdoptedChangeItem,
  );
}

export function readAiJsonImportQueue() {
  return readJsonArrayFile<AiJsonImportQueueItem>(
    QUEUE_FILE_PATHS.ai_json_import_queue,
    isAiJsonImportQueueItem,
  );
}

export function writeAiJsonImportQueue(items: AiJsonImportQueueItem[]) {
  return writeJsonArrayFile(
    QUEUE_FILE_PATHS.ai_json_import_queue,
    items,
    isAiJsonImportQueueItem,
  );
}

function isMissingFileError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isReviewPatchQueueItem(value: unknown): value is ReviewPatchQueueItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isOneOf(value.patch_type, REVIEW_PATCH_TYPES) &&
    isOneOf(value.comment_state, REVIEW_COMMENT_STATES) &&
    Array.isArray(value.inferred_category_candidates) &&
    value.inferred_category_candidates.every((item) => typeof item === "string") &&
    isOneOf(value.selected_action, REVIEW_PATCH_ACTIONS) &&
    typeof value.proposal_summary === "string" &&
    typeof value.created_at === "string" &&
    isOneOf(value.status, REVIEW_PATCH_STATUSES) &&
    isRecord(value.source_ref)
  );
}

function isAdoptedChangeItem(value: unknown): value is AdoptedChangeItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isOneOf(value.adopted_type, ADOPTED_CHANGE_TYPES) &&
    isOneOf(value.source_lane, ADOPTED_CHANGE_SOURCE_LANES) &&
    typeof value.adopted_at === "string" &&
    typeof value.target_name === "string" &&
    typeof value.target_kind === "string" &&
    isOneOf(value.compile_wait_status, COMPILE_WAIT_STATUSES)
  );
}

function isAiJsonImportQueueItem(
  value: unknown,
): value is AiJsonImportQueueItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isOneOf(value.generation_target, AI_JSON_GENERATION_TARGETS) &&
    typeof value.source_natural_text === "string" &&
    typeof value.prompt_text === "string" &&
    typeof value.validation_ok === "boolean" &&
    isOneOf(value.status, AI_JSON_IMPORT_STATUSES) &&
    Array.isArray(value.error_messages) &&
    value.error_messages.every((item) => typeof item === "string") &&
    typeof value.created_at === "string" &&
    "returned_json" in value
  );
}

function isOneOf<T extends string>(
  value: unknown,
  candidates: readonly T[],
): value is T {
  return typeof value === "string" && candidates.includes(value as T);
}
