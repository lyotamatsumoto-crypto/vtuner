import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { CompileRecord } from "../contracts/compile";
import {
  COMPILE_FILE_PATHS,
  resolveStoragePath,
} from "./fileLayout";

class StorageValidationError extends Error {
  code = "STORAGE_VALIDATION_ERROR" as const;
}

type CompileItemValidator<T> = (item: unknown) => item is T;

async function readJsonArrayFile<T>(
  relativePath: string,
  validator: CompileItemValidator<T>,
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
  validator: CompileItemValidator<T>,
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

export function readCompileHistory() {
  return readJsonArrayFile<CompileRecord>(
    COMPILE_FILE_PATHS.history,
    isCompileRecord,
  );
}

export function writeCompileHistory(items: CompileRecord[]) {
  return writeJsonArrayFile(
    COMPILE_FILE_PATHS.history,
    items,
    isCompileRecord,
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

function isCompileRecord(value: unknown): value is CompileRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.executed_at === "string" &&
    typeof value.target_count === "number" &&
    Array.isArray(value.target_kinds) &&
    value.target_kinds.every((item) => typeof item === "string") &&
    typeof value.status === "string" &&
    Array.isArray(value.reflected_to) &&
    value.reflected_to.every((item) => typeof item === "string")
  );
}
