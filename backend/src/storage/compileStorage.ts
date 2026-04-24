import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { CompileRecord } from "../contracts/compile";
import {
  COMPILE_FILE_PATHS,
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

export function readCompileHistory() {
  return readJsonArrayFile<CompileRecord>(COMPILE_FILE_PATHS.history);
}

export function writeCompileHistory(items: CompileRecord[]) {
  return writeJsonArrayFile(COMPILE_FILE_PATHS.history, items);
}

function isMissingFileError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
