import type {
  AdoptedChangeItem,
  ReviewPatchQueueItem,
} from "../../backend/src/contracts/queue";
import type { CompileRecord } from "../../backend/src/contracts/compile";

const DEFAULT_BACKEND_ORIGIN = "http://localhost:3001";

export interface ReviewCompileReadModel {
  reviewPatchQueue: ReviewPatchQueueItem[];
  adoptedChanges: AdoptedChangeItem[];
  compileHistory: CompileRecord[];
  backendOrigin: string;
}

export async function loadReviewCompileReadModel(): Promise<ReviewCompileReadModel> {
  const backendOrigin =
    (import.meta.env.VITE_BACKEND_ORIGIN as string | undefined) ??
    DEFAULT_BACKEND_ORIGIN;

  const [reviewPatchQueue, adoptedChanges, compileHistory] = await Promise.all([
    fetchJsonArray<ReviewPatchQueueItem>(backendOrigin, "/review-patch-queue"),
    fetchJsonArray<AdoptedChangeItem>(backendOrigin, "/adopted-changes"),
    fetchJsonArray<CompileRecord>(backendOrigin, "/compile-history"),
  ]);

  return {
    reviewPatchQueue,
    adoptedChanges,
    compileHistory,
    backendOrigin,
  };
}

async function fetchJsonArray<T>(
  backendOrigin: string,
  path: string,
): Promise<T[]> {
  const response = await fetch(`${backendOrigin}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${path} (${response.status})`);
  }

  const payload: unknown = await response.json();
  return Array.isArray(payload) ? (payload as T[]) : [];
}
