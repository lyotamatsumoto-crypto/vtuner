import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { AdoptedReplyTemplatesItem } from "../contracts/replyTemplates";
import {
  ADOPTED_REPLY_TEMPLATE_STATUSES,
  validateReplyTemplatesJson,
} from "../contracts/replyTemplates";
import {
  REPLY_TEMPLATE_FILE_PATHS,
  resolveStoragePath,
} from "./fileLayout";

class StorageValidationError extends Error {
  code = "STORAGE_VALIDATION_ERROR" as const;
}

const ADOPTED_REPLY_TEMPLATE_ITEM_KEYS = [
  "id",
  "source_queue_item_id",
  "generation_target",
  "name",
  "adopted_at",
  "status",
  "reply_templates",
] as const;

export async function readAdoptedReplyTemplates() {
  return readJsonArrayFile(
    REPLY_TEMPLATE_FILE_PATHS.adopted_reply_templates,
    isAdoptedReplyTemplatesItem,
  );
}

export async function writeAdoptedReplyTemplates(
  items: AdoptedReplyTemplatesItem[],
) {
  await writeJsonArrayFile(
    REPLY_TEMPLATE_FILE_PATHS.adopted_reply_templates,
    items,
    isAdoptedReplyTemplatesItem,
  );
}

async function readJsonArrayFile<T>(
  relativePath: string,
  validator: (item: unknown) => item is T,
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

    assertSingleActiveItem(parsed as AdoptedReplyTemplatesItem[], relativePath);

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
  validator: (item: unknown) => item is T,
): Promise<void> {
  if (!Array.isArray(items) || !items.every(validator)) {
    throw new StorageValidationError(
      `Write payload shape is invalid: ${relativePath}`,
    );
  }

  assertSingleActiveItem(
    items as AdoptedReplyTemplatesItem[],
    relativePath,
  );

  const absolutePath = resolveStoragePath(relativePath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function assertSingleActiveItem(
  items: AdoptedReplyTemplatesItem[],
  relativePath: string,
) {
  const activeCount = items.filter((item) => item.status === "active").length;
  if (activeCount > 1) {
    throw new StorageValidationError(
      `Storage array has multiple active reply templates: ${relativePath}`,
    );
  }
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

function isAdoptedReplyTemplatesItem(
  value: unknown,
): value is AdoptedReplyTemplatesItem {
  if (!isRecord(value)) {
    return false;
  }

  if (!hasOnlyAllowedKeys(value, ADOPTED_REPLY_TEMPLATE_ITEM_KEYS)) {
    return false;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.source_queue_item_id !== "string" ||
    value.generation_target !== "reply_templates" ||
    typeof value.name !== "string" ||
    typeof value.adopted_at !== "string" ||
    !isOneOf(value.status, ADOPTED_REPLY_TEMPLATE_STATUSES)
  ) {
    return false;
  }

  const validation = validateReplyTemplatesJson({
    reply_templates: value.reply_templates,
  });
  return validation.ok;
}

function hasOnlyAllowedKeys(
  record: Record<string, unknown>,
  allowedKeys: readonly string[],
) {
  return Object.keys(record).every((key) => allowedKeys.includes(key));
}

function isOneOf<T extends string>(
  value: unknown,
  candidates: readonly T[],
): value is T {
  return typeof value === "string" && candidates.includes(value as T);
}
