import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type {
  AdoptedChangeItem,
  ReviewPatchQueueItem,
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
    typeof value.patch_type === "string" &&
    typeof value.comment_state === "string" &&
    Array.isArray(value.inferred_category_candidates) &&
    value.inferred_category_candidates.every((item) => typeof item === "string") &&
    typeof value.selected_action === "string" &&
    typeof value.proposal_summary === "string" &&
    typeof value.created_at === "string" &&
    typeof value.status === "string" &&
    isRecord(value.source_ref)
  );
}

function isAdoptedChangeItem(value: unknown): value is AdoptedChangeItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.adopted_type === "string" &&
    typeof value.source_lane === "string" &&
    typeof value.adopted_at === "string" &&
    typeof value.target_name === "string" &&
    typeof value.target_kind === "string" &&
    typeof value.compile_wait_status === "string"
  );
}
