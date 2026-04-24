import type {
  AdoptedChangeItem,
  ReviewCommentSourceRef,
  ReviewCommentState,
  ReviewPatchAction,
  ReviewPatchQueueItem,
  ReviewPatchStatus,
  ReviewPatchType,
} from "../../backend/src/contracts/queue";
import type {
  CompilePlanItem,
  CompileTargetKind,
} from "../../backend/src/contracts/compile";

export interface CreateReviewPatchCandidateInput {
  session_id: string;
  comment_id: string;
  comment_state: ReviewCommentState;
  selected_action: ReviewPatchAction;
  proposal_summary: string;
  inferred_category_candidates: string[];
  target_category_or_definition?: string;
  source_ref: ReviewCommentSourceRef;
}

export const initialReviewPatchQueue: ReviewPatchQueueItem[] = [
  {
    id: "review-patch-1",
    patch_type: "ignore_patch",
    comment_state: "unknown",
    inferred_category_candidates: [],
    selected_action: "ignore",
    target_category_or_definition: "晩御飯たべた？ 系コメント",
    proposal_summary: "軽い生活質問を ignore 候補として保持",
    source_ref: {
      source_type: "pasted_text",
      session_id: "session-13",
      original_text: "User-99: 晩御飯たべた？",
      extracted_author: "User-99",
      extracted_body: "晩御飯たべた？",
    },
    created_at: "2026-04-24T10:30:00.000Z",
    status: "candidate",
  },
  {
    id: "review-patch-2",
    patch_type: "existing_category_patch",
    comment_state: "displayed",
    inferred_category_candidates: ["挨拶", "初見反応"],
    selected_action: "existing_category",
    target_category_or_definition: "挨拶 / 初見反応",
    proposal_summary: "初見あいさつを既存カテゴリへ寄せる候補",
    source_ref: {
      source_type: "pasted_text",
      session_id: "session-13",
      original_text: "TechUser: こんにちは！初見です",
      extracted_author: "TechUser",
      extracted_body: "こんにちは！初見です",
    },
    created_at: "2026-04-24T10:35:00.000Z",
    status: "pending",
  },
  {
    id: "review-patch-3",
    patch_type: "new_candidate_patch",
    comment_state: "unknown",
    inferred_category_candidates: ["質問", "技術系"],
    selected_action: "new_candidate",
    target_category_or_definition: "機材トーク",
    proposal_summary: "機材トークを新カテゴリ候補として保留",
    source_ref: {
      source_type: "pasted_text",
      session_id: "session-13",
      original_text: "猫宮マメ: 今日の機材、新しくしたって言ってたやつ？",
      extracted_author: "猫宮マメ",
      extracted_body: "今日の機材、新しくしたって言ってたやつ？",
    },
    created_at: "2026-04-24T10:40:00.000Z",
    status: "adopted",
  },
];

export const initialAdoptedChanges: AdoptedChangeItem[] = [
  {
    id: "adopted-review-patch-3",
    adopted_type: "review_patch",
    source_lane: "review_patch_queue",
    adopted_at: "2026-04-24T11:05:00.000Z",
    target_name: "機材トーク",
    target_kind: "formal_definitions",
    compile_wait_status: "pending",
  },
];

export function createReviewPatchCandidate(
  input: CreateReviewPatchCandidateInput,
): ReviewPatchQueueItem {
  return {
    id: `review-patch-${Date.now()}`,
    patch_type: toReviewPatchType(input.selected_action),
    comment_state: input.comment_state,
    inferred_category_candidates: input.inferred_category_candidates,
    selected_action: input.selected_action,
    proposal_summary: input.proposal_summary,
    source_ref: input.source_ref,
    created_at: new Date().toISOString(),
    status: "candidate",
    ...(input.target_category_or_definition
      ? { target_category_or_definition: input.target_category_or_definition }
      : {}),
  };
}

export function updateReviewPatchStatus(
  queue: ReviewPatchQueueItem[],
  patchId: string,
  status: ReviewPatchStatus,
): ReviewPatchQueueItem[] {
  return queue.map((item) => (item.id === patchId ? { ...item, status } : item));
}

export function createAdoptedChangeFromReviewPatch(
  patch: ReviewPatchQueueItem,
): AdoptedChangeItem {
  return {
    id: `adopted-${patch.id}`,
    adopted_type: "review_patch",
    source_lane: "review_patch_queue",
    adopted_at: new Date().toISOString(),
    target_name: patch.target_category_or_definition ?? patch.proposal_summary,
    target_kind: toCompileTargetKind(patch.patch_type),
    compile_wait_status: "pending",
  };
}

export function buildCompilePrecheckItems(
  adoptedChanges: AdoptedChangeItem[],
): CompilePlanItem[] {
  return adoptedChanges
    .filter((item) => item.compile_wait_status === "pending")
    .map((item) => ({
      adopted_change_id: item.id,
      target_kind: item.target_kind as CompileTargetKind,
      target_name: item.target_name,
    }));
}

function toReviewPatchType(action: ReviewPatchAction): ReviewPatchType {
  if (action === "ignore") {
    return "ignore_patch";
  }

  if (action === "existing_category") {
    return "existing_category_patch";
  }

  return "new_candidate_patch";
}

function toCompileTargetKind(patchType: ReviewPatchType): CompileTargetKind {
  if (patchType === "ignore_patch" || patchType === "existing_category_patch") {
    return "formal_rules";
  }

  return "formal_definitions";
}
