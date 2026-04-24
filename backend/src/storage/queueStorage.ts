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

async function readJsonArrayFile<T>(relativePath: string): Promise<T[]> {
  const absolutePath = resolveStoragePath(relativePath);

  try {
    const raw = await readFile(absolutePath, "utf8");
    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }

    return [];
  }
}

async function writeJsonArrayFile<T>(
  relativePath: string,
  items: T[],
): Promise<void> {
  const absolutePath = resolveStoragePath(relativePath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

export function readReviewPatchQueue() {
  return readJsonArrayFile<ReviewPatchQueueItem>(
    QUEUE_FILE_PATHS.review_patch_queue,
  );
}

export function writeReviewPatchQueue(items: ReviewPatchQueueItem[]) {
  return writeJsonArrayFile(QUEUE_FILE_PATHS.review_patch_queue, items);
}

export function readAdoptedChanges() {
  return readJsonArrayFile<AdoptedChangeItem>(
    QUEUE_FILE_PATHS.adopted_changes,
  );
}

export function writeAdoptedChanges(items: AdoptedChangeItem[]) {
  return writeJsonArrayFile(QUEUE_FILE_PATHS.adopted_changes, items);
}

function isMissingFileError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
