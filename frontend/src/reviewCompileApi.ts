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

export async function saveReviewPatchQueue(
  backendOrigin: string,
  reviewPatchQueue: ReviewPatchQueueItem[],
): Promise<void> {
  const response = await fetch(`${backendOrigin}/review-patch-queue`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewPatchQueue),
  });

  if (!response.ok) {
    throw new Error(`Request failed: /review-patch-queue (${response.status})`);
  }
}

export async function saveAdoptedChanges(
  backendOrigin: string,
  adoptedChanges: AdoptedChangeItem[],
): Promise<void> {
  const response = await fetch(`${backendOrigin}/adopted-changes`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adoptedChanges),
  });

  if (!response.ok) {
    throw new Error(`Request failed: /adopted-changes (${response.status})`);
  }
}

export async function saveCompileHistory(
  backendOrigin: string,
  compileHistory: CompileRecord[],
): Promise<void> {
  const response = await fetch(`${backendOrigin}/compile-history`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(compileHistory),
  });

  if (!response.ok) {
    throw new Error(`Request failed: /compile-history (${response.status})`);
  }
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
  const response = await fetch(`${backendOrigin}${path}`, {
    method: "GET",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${path} (${response.status})`);
  }

  const payload: unknown = await response.json();
  return Array.isArray(payload) ? (payload as T[]) : [];
}
