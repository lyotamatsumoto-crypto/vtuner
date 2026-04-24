import { resolve } from "node:path";

export const DATA_ROOT = "data";

export const PROJECT_ROOT = resolve(__dirname, "../../..");

export const QUEUE_FILE_PATHS = {
  review_patch_queue: `${DATA_ROOT}/queues/review-patch-queue.json`,
  ai_json_import_queue: `${DATA_ROOT}/queues/ai-json-import-queue.json`,
  adopted_changes: `${DATA_ROOT}/queues/adopted-changes.json`,
} as const;

export const COMPILE_FILE_PATHS = {
  history: `${DATA_ROOT}/compile/history.json`,
} as const;

export const LOCAL_STORAGE_LAYOUT = {
  queues: QUEUE_FILE_PATHS,
  compile: COMPILE_FILE_PATHS,
} as const;

export function resolveStoragePath(relativePath: string) {
  return resolve(PROJECT_ROOT, relativePath);
}
