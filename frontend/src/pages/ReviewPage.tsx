import { useMemo, useState } from "react";
import type {
  ReviewCommentState as QueueReviewCommentState,
  ReviewPatchAction,
  ReviewPatchQueueItem,
  ReviewPatchStatus,
  ReviewPatchType,
} from "../../../backend/src/contracts/queue";
import type { CreateReviewPatchCandidateInput } from "../reviewCompileBridge";

type ReviewState = "unknown" | "skipped" | "displayed" | "ignored";
type InferenceHint = "existing_close" | "ambiguous" | "unknown_leaning" | "ignore_leaning";

interface ReviewSession {
  id: string;
  title: string;
  reviewedLabel: string;
  dateLabel: string;
  commentCount: number;
  patchCount: number;
  urlNote?: string;
  pastedNote: string;
}

interface ReviewComment {
  id: string;
  sessionId: string;
  author: string;
  text: string;
  state: ReviewState;
  inference: InferenceHint;
  categoryCandidates: string[];
  reasonLabels: string[];
  helperNote?: string;
  parseError?: string;
}

const initialSessions: ReviewSession[] = [
  {
    id: "session-13",
    title: "雑談配信 #13",
    reviewedLabel: "Review 中",
    dateLabel: "2026/04/23 21:00",
    commentCount: 6,
    patchCount: 3,
    urlNote: "補助情報あり",
    pastedNote: "コメント貼り付け主導で読み込み済み",
  },
  {
    id: "session-12",
    title: "ゲーム配信 #12",
    reviewedLabel: "見直し済み",
    dateLabel: "2026/04/22 20:00",
    commentCount: 4,
    patchCount: 2,
    pastedNote: "貼り付け読み込み済み",
  },
  {
    id: "session-11",
    title: "朝雑談テスト配信",
    reviewedLabel: "保留あり",
    dateLabel: "2026/04/21 09:30",
    commentCount: 3,
    patchCount: 1,
    pastedNote: "parse_error を含む",
  },
];

const initialComments: ReviewComment[] = [
  {
    id: "c1",
    sessionId: "session-13",
    author: "猫宮マメ",
    text: "今日の機材、新しくしたって言ってたやつ？",
    state: "unknown",
    inference: "unknown_leaning",
    categoryCandidates: ["質問", "技術系"],
    reasonLabels: ["条件が足りない", "境界が曖昧"],
    helperNote: "既存カテゴリへ寄せる余地あり",
  },
  {
    id: "c2",
    sessionId: "session-13",
    author: "視聴者A",
    text: "wwwww",
    state: "skipped",
    inference: "ignore_leaning",
    categoryCandidates: [],
    reasonLabels: ["短すぎる", "文脈不足"],
  },
  {
    id: "c3",
    sessionId: "session-13",
    author: "TechUser",
    text: "こんにちは！初見です",
    state: "displayed",
    inference: "existing_close",
    categoryCandidates: ["挨拶", "初見反応"],
    reasonLabels: ["既存ルールに近い"],
    helperNote: "existing category patch 向き",
  },
  {
    id: "c4",
    sessionId: "session-13",
    author: "匿名きぼう",
    text: "VTunerの動き、たまにカクつくかも？",
    state: "skipped",
    inference: "ambiguous",
    categoryCandidates: ["指摘", "技術系"],
    reasonLabels: ["候補はあるが境界が曖昧"],
  },
  {
    id: "c5",
    sessionId: "session-13",
    author: "User-99",
    text: "晩御飯たべた？",
    state: "unknown",
    inference: "unknown_leaning",
    categoryCandidates: [],
    reasonLabels: ["返答方針が未定"],
  },
  {
    id: "c6",
    sessionId: "session-13",
    author: "匿名",
    text: "○○って言って",
    state: "ignored",
    inference: "ignore_leaning",
    categoryCandidates: ["無視対象"],
    reasonLabels: ["誘導 / 不採用"],
  },
  {
    id: "c7",
    sessionId: "session-12",
    author: "Kumo",
    text: "今日のボス戦よかった！",
    state: "displayed",
    inference: "existing_close",
    categoryCandidates: ["褒め", "応援"],
    reasonLabels: ["既存カテゴリに近い"],
  },
  {
    id: "c8",
    sessionId: "session-12",
    author: "Neko",
    text: "配信止まった？",
    state: "skipped",
    inference: "ambiguous",
    categoryCandidates: ["指摘"],
    reasonLabels: ["技術指摘候補"],
  },
  {
    id: "c9",
    sessionId: "session-11",
    author: "parse_error",
    text: "[時刻不明] スタンプ断片 / 投稿者不明",
    state: "unknown",
    inference: "unknown_leaning",
    categoryCandidates: [],
    reasonLabels: ["parse_error 保持"],
    parseError: "投稿者名と本文の切り分けに失敗",
  },
];

const stateOrder: ReviewState[] = ["unknown", "skipped", "displayed", "ignored"];
const inferenceOrder: InferenceHint[] = ["existing_close", "ambiguous", "unknown_leaning", "ignore_leaning"];

export function ReviewPage({
  reviewPatchQueue,
  onCreateReviewPatchCandidate,
}: {
  reviewPatchQueue: ReviewPatchQueueItem[];
  onCreateReviewPatchCandidate: (input: CreateReviewPatchCandidateInput) => void;
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const [comments] = useState(initialComments);
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessions.at(0)?.id ?? "");
  const [selectedCommentId, setSelectedCommentId] = useState("c1");
  const [stateFilter, setStateFilter] = useState<ReviewState | "all">("all");
  const [inferenceFilter, setInferenceFilter] = useState<InferenceHint | "all">("all");
  const [pastedUrl, setPastedUrl] = useState("https://www.youtube.com/live/xxxxxxxxxxx");
  const [pastedTitle, setPastedTitle] = useState("雑談配信 #13");
  const [pastedDate, setPastedDate] = useState("2026/04/24 21:00");
  const [pastedText, setPastedText] = useState(
    "猫宮マメ: 今日の機材、新しくしたって言ってたやつ？\n視聴者A: wwwwwww\nTechUser: こんにちは！初見です\n匿名きぼう: VTunerの動き、たまにカクつくかも？\nUser-99: 晩御飯たべた？\n匿名: ○○って言って",
  );
  const [loadNotice, setLoadNotice] = useState(
    "貼り付け読み込みが主導線です。URL は補助情報として任意保持に留めています。",
  );

  const selectedSession = sessions.find((session) => session.id === selectedSessionId);

  const sessionComments = useMemo(
    () =>
      comments.filter((comment) => {
        if (comment.sessionId !== selectedSessionId) {
          return false;
        }

        if (stateFilter !== "all" && comment.state !== stateFilter) {
          return false;
        }

        if (inferenceFilter !== "all" && comment.inference !== inferenceFilter) {
          return false;
        }

        return true;
      }),
    [comments, selectedSessionId, stateFilter, inferenceFilter],
  );

  const selectedComment =
    sessionComments.find((comment) => comment.id === selectedCommentId) ??
    comments.find((comment) => comment.id === selectedCommentId) ??
    sessionComments[0];

  const currentSessionPatchCandidates = reviewPatchQueue.filter(
    (candidate) => candidate.source_ref.session_id === selectedSessionId,
  );

  function loadPastedSessionSkeleton() {
    const sessionId = `session-${Date.now()}`;
    const nextSession: ReviewSession = {
      id: sessionId,
      title: pastedTitle || "貼り付け読み込みセッション",
      reviewedLabel: "Review 中",
      dateLabel: pastedDate || "日時未設定",
      commentCount: pastedText.split("\n").filter(Boolean).length,
      patchCount: 0,
      pastedNote: "parser 未接続のため貼り付けテキストを骨格保持",
      ...(pastedUrl ? { urlNote: "補助情報あり" } : {}),
    };

    setSessions((current) => [nextSession, ...current]);
    setSelectedSessionId(sessionId);
    setLoadNotice(
      "読み込み導線の骨格としてセッションを追加しました。実際の貼り付け parser 本実装はまだ接続していません。",
    );
  }

  function addPatchCandidate(action: ReviewPatchAction) {
    if (!selectedComment) {
      return;
    }

    const nextPatchType = toPatchType(action);
    const existing = reviewPatchQueue.find(
      (candidate) =>
        candidate.source_ref.session_id === selectedSessionId &&
        candidate.source_ref.original_text === `${selectedComment.author}: ${selectedComment.text}` &&
        candidate.patch_type === nextPatchType,
    );

    if (existing) {
      return;
    }

    const summaryByAction: Record<ReviewPatchAction, string> = {
      ignore: "ignore 候補として保持",
      existing_category: "既存カテゴリ候補として保持",
      new_candidate: "新カテゴリ候補として保留",
    };

    const targetLabel =
      selectedComment.categoryCandidates.length > 0
        ? selectedComment.categoryCandidates.join(" / ")
        : selectedComment.text;

    onCreateReviewPatchCandidate({
      session_id: selectedSessionId,
      comment_id: selectedComment.id,
      comment_state: selectedComment.state as QueueReviewCommentState,
      selected_action: action,
      proposal_summary: `${selectedComment.author} のコメントを ${summaryByAction[action]}`,
      inferred_category_candidates: selectedComment.categoryCandidates,
      target_category_or_definition: targetLabel,
      source_ref: {
        source_type: "pasted_text",
        session_id: selectedSessionId,
        original_text: `${selectedComment.author}: ${selectedComment.text}`,
        extracted_author: selectedComment.author,
        extracted_body: selectedComment.text,
        ...(selectedComment.parseError ? { parse_errors: [selectedComment.parseError] } : {}),
      },
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "24px",
        background: "#F3F7F7",
        color: "#2F3E46",
        fontFamily: "\"Noto Sans JP\", system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1480px",
          margin: "0 auto",
          display: "grid",
          gap: "16px",
        }}
      >
        <header style={pageHeaderStyle}>
          <div style={{ display: "grid", gap: "6px" }}>
            <div style={pageBadgeStyle}>Review Skeleton</div>
            <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800 }}>Review</h1>
            <p style={pageTextStyle}>
              配信後の見直しと patch candidate 化の画面です。正式編集、JSON 生成、compile 実行はここでは行いません。
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={summaryChipStyle(true)}>貼り付け MVP</div>
            <div style={summaryChipStyle(false)}>compile はここで実行しない</div>
          </div>
        </header>

        <section style={summaryCardStyle}>
          <strong style={{ fontSize: "15px" }}>この画面の役割</strong>
          <span style={pageTextStyle}>
            コメント一覧を見直し、`unknown / skipped / displayed / ignored` を追いながら、
            `ignore`、`existing category`、`new candidate` の patch candidate を Review Patch Queue 向けに整理します。
          </span>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "280px minmax(0, 1fr) 380px",
            gap: "16px",
            alignItems: "start",
          }}
        >
          <aside style={paneStyle}>
            <div style={{ ...paneHeaderStyle, borderBottom: "1px solid #BFDCDD" }}>
              <div>
                <h2 style={sectionTitleStyle}>配信一覧</h2>
                <p style={pageTextStyle}>貼り付け読み込みから配信単位の見直しを作ります。</p>
              </div>
            </div>

            <div style={{ padding: "14px", display: "grid", gap: "12px" }}>
              <div style={cardInsetStyle}>
                <strong style={{ fontSize: "14px" }}>コメント貼り付け入力</strong>
                <p style={{ ...pageTextStyle, fontSize: "12px" }}>
                  URL は補助情報です。主導線はコメントテキストの貼り付けです。
                </p>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>配信 URL（任意 / 補助情報）</span>
                  <input style={inputStyle} value={pastedUrl} onChange={(event) => setPastedUrl(event.target.value)} />
                </label>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>配信タイトル（補助情報）</span>
                  <input style={inputStyle} value={pastedTitle} onChange={(event) => setPastedTitle(event.target.value)} />
                </label>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>配信日時（補助情報）</span>
                  <input style={inputStyle} value={pastedDate} onChange={(event) => setPastedDate(event.target.value)} />
                </label>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>コメントテキスト（主導線）</span>
                  <textarea
                    style={{ ...inputStyle, minHeight: "180px", resize: "vertical" }}
                    value={pastedText}
                    onChange={(event) => setPastedText(event.target.value)}
                  />
                </label>
                <button style={primaryButtonStyle} onClick={loadPastedSessionSkeleton}>
                  読み込み導線を確認
                </button>
                <div style={inlineNoticeStyle}>{loadNotice}</div>
              </div>

              {sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setSelectedSessionId(session.id)}
                  style={{
                    ...sessionCardStyle,
                    borderColor: session.id === selectedSessionId ? "#8FCFD3" : "#BFDCDD",
                    background:
                      session.id === selectedSessionId
                        ? "linear-gradient(180deg, #FFFFFF 0%, #F7FCFC 100%)"
                        : "#FFFFFF",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                      <strong style={{ textAlign: "left" }}>{session.title}</strong>
                      <span style={statusChipStyle(session.reviewedLabel === "Review 中")}>{session.reviewedLabel}</span>
                    </div>
                    <span style={{ ...pageTextStyle, fontSize: "12px", textAlign: "left" }}>{session.dateLabel}</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
                    <div style={metricCardStyle}>
                      <span style={metricLabelStyle}>コメント</span>
                      <strong>{session.commentCount}</strong>
                    </div>
                    <div style={metricCardStyle}>
                      <span style={metricLabelStyle}>候補</span>
                      <strong>{reviewPatchQueue.filter((item) => item.source_ref.session_id === session.id).length}</strong>
                    </div>
                  </div>
                  <span style={{ ...pageTextStyle, fontSize: "12px", textAlign: "left" }}>
                    {session.urlNote ? `${session.pastedNote} / ${session.urlNote}` : session.pastedNote}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <section style={paneStyle}>
            <div style={paneHeaderStyle}>
              <div>
                <h2 style={sectionTitleStyle}>コメント一覧</h2>
                <p style={pageTextStyle}>配信後の見直し用コメントだけをここで確認します。</p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {stateOrder.map((state) => (
                  <span key={state} style={stateCountChipStyle(state)}>
                    {state}{" "}
                    {
                      comments.filter(
                        (comment) => comment.sessionId === selectedSessionId && comment.state === state,
                      ).length
                    }
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: "14px", display: "grid", gap: "14px" }}>
              <div style={cardInsetStyle}>
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={filterLabelStyle}>状態</span>
                    <button style={toggleButtonStyle(stateFilter === "all")} onClick={() => setStateFilter("all")}>
                      すべて
                    </button>
                    {stateOrder.map((state) => (
                      <button
                        key={state}
                        style={toggleButtonStyle(stateFilter === state)}
                        onClick={() => setStateFilter(state)}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={filterLabelStyle}>推論補助</span>
                    <button
                      style={toggleButtonStyle(inferenceFilter === "all")}
                      onClick={() => setInferenceFilter("all")}
                    >
                      すべて
                    </button>
                    {inferenceOrder.map((hint) => (
                      <button
                        key={hint}
                        style={toggleButtonStyle(inferenceFilter === hint)}
                        onClick={() => setInferenceFilter(hint)}
                      >
                        {inferenceLabel(hint)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {sessionComments.map((comment) => (
                  <button
                    key={comment.id}
                    type="button"
                    onClick={() => setSelectedCommentId(comment.id)}
                    style={{
                      ...commentCardStyle,
                      borderColor: selectedComment?.id === comment.id ? "#8FCFD3" : commentBorderColor(comment.inference),
                      background: commentBackground(comment.inference),
                    }}
                  >
                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={inferenceChipStyle(comment.inference)}>{inferenceLabel(comment.inference)}</span>
                        <span style={stateChipStyle(comment.state)}>{comment.state}</span>
                        <strong style={{ fontSize: "12px" }}>{comment.author}</strong>
                      </div>
                      <div style={{ textAlign: "left", lineHeight: 1.65 }}>{comment.text}</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span style={metaChipStyle}>
                          候補: {comment.categoryCandidates.length > 0 ? comment.categoryCandidates.join(" / ") : "なし"}
                        </span>
                        <span style={metaChipStyle}>理由: {comment.reasonLabels.join(" / ")}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside style={paneStyle}>
            <div style={{ padding: "14px", display: "grid", gap: "14px" }}>
              <section style={cardInsetStyle}>
                <h2 style={sectionTitleStyle}>選択中コメント詳細</h2>
                {selectedComment ? (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={inferenceChipStyle(selectedComment.inference)}>
                        {inferenceLabel(selectedComment.inference)}
                      </span>
                      <span style={stateChipStyle(selectedComment.state)}>{selectedComment.state}</span>
                      <strong style={{ fontSize: "12px" }}>{selectedComment.author}</strong>
                    </div>
                    <div style={selectedTextBoxStyle}>{selectedComment.text}</div>
                    <div style={{ display: "grid", gap: "8px" }}>
                      <DetailRow label="候補カテゴリ" value={joinOrFallback(selectedComment.categoryCandidates)} />
                      <DetailRow label="理由ラベル" value={selectedComment.reasonLabels.join(" / ")} />
                      <DetailRow label="推論補助" value={inferenceLabel(selectedComment.inference)} />
                      <DetailRow label="補助メモ" value={selectedComment.helperNote ?? "なし"} />
                      <DetailRow label="parse_error" value={selectedComment.parseError ?? "なし"} />
                    </div>
                  </div>
                ) : (
                  <p style={pageTextStyle}>コメントを選ぶと詳細がここに表示されます。</p>
                )}
              </section>

              <section style={cardInsetStyle}>
                <h2 style={sectionTitleStyle}>Review 操作</h2>
                <div style={{ display: "grid", gap: "8px" }}>
                  <button style={secondaryButtonStyle} onClick={() => addPatchCandidate("ignore")}>
                    ignore にする
                  </button>
                  <button style={primaryButtonStyle} onClick={() => addPatchCandidate("existing_category")}>
                    existing category 候補にする
                  </button>
                  <button style={secondaryButtonStyle} onClick={() => addPatchCandidate("new_candidate")}>
                    new category 候補として保留
                  </button>
                </div>
                <div style={inlineNoticeStyle}>
                  ここでは仕分けと candidate 作成だけを行います。正式編集や compile は後段です。
                </div>
              </section>

              <section style={cardInsetStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                  <h2 style={sectionTitleStyle}>Patch Candidate Area</h2>
                  <span style={summaryChipStyle(currentSessionPatchCandidates.length > 0)}>
                    {currentSessionPatchCandidates.length}件
                  </span>
                </div>
                <div style={{ display: "grid", gap: "10px" }}>
                  {currentSessionPatchCandidates.map((candidate) => (
                    <article key={candidate.id} style={patchCandidateStyle}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={metaChipStyle}>{patchTypeLabel(candidate.patch_type)}</span>
                        <span style={queueStatusChipStyle(candidate.status)}>{candidate.status}</span>
                      </div>
                      <strong>{candidate.proposal_summary}</strong>
                      <span style={pageTextStyle}>
                        対象: {candidate.target_category_or_definition ?? "未設定"}
                      </span>
                    </article>
                  ))}
                </div>
                <div style={inlineNoticeStyle}>
                  ここで作った差分は Review Patch Queue を意識した骨格表示です。compile 前差分として保持するだけで、まだ反映はしません。
                </div>
              </section>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "4px",
        paddingBottom: "8px",
        borderBottom: "1px solid rgba(191, 220, 221, 0.55)",
      }}
    >
      <span style={fieldLabelStyle}>{label}</span>
      <span style={{ lineHeight: 1.6 }}>{value}</span>
    </div>
  );
}

function toPatchType(action: ReviewPatchAction): ReviewPatchType {
  if (action === "ignore") {
    return "ignore_patch";
  }

  if (action === "existing_category") {
    return "existing_category_patch";
  }

  return "new_candidate_patch";
}

function patchTypeLabel(type: ReviewPatchType) {
  if (type === "ignore_patch") {
    return "ignore patch";
  }

  if (type === "existing_category_patch") {
    return "existing category patch";
  }

  return "new candidate patch";
}

function inferenceLabel(hint: InferenceHint) {
  if (hint === "existing_close") {
    return "既存カテゴリに近い";
  }

  if (hint === "ambiguous") {
    return "あいまい";
  }

  if (hint === "unknown_leaning") {
    return "unknown 寄り";
  }

  return "ignore 寄り";
}

function joinOrFallback(values: string[]) {
  return values.length > 0 ? values.join(" / ") : "なし";
}

function commentBackground(hint: InferenceHint) {
  if (hint === "existing_close") {
    return "#E4F5EC";
  }

  if (hint === "ambiguous") {
    return "#FFF0D8";
  }

  if (hint === "unknown_leaning") {
    return "#FFE2E2";
  }

  return "#F7FCFC";
}

function commentBorderColor(hint: InferenceHint) {
  if (hint === "existing_close") {
    return "rgba(168, 221, 190, 0.95)";
  }

  if (hint === "ambiguous") {
    return "rgba(242, 201, 142, 0.95)";
  }

  if (hint === "unknown_leaning") {
    return "rgba(243, 176, 176, 0.95)";
  }

  return "#BFDCDD";
}

const pageHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  padding: "18px 20px",
  border: "1px solid #BFDCDD",
  borderRadius: "20px",
  background: "#FFFFFF",
  boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
} as const;

const summaryCardStyle = {
  display: "grid",
  gap: "8px",
  padding: "16px 18px",
  border: "1px solid #BFDCDD",
  borderRadius: "20px",
  background: "linear-gradient(180deg, #F7FCFC 0%, #FFFFFF 100%)",
  boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
} as const;

const paneStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "20px",
  background: "#FFFFFF",
  boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
  overflow: "hidden",
  minWidth: 0,
} as const;

const paneHeaderStyle = {
  padding: "16px 18px",
  background: "#F7FCFC",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  flexWrap: "wrap",
} as const;

const cardInsetStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "16px",
  background: "#F7FCFC",
  padding: "14px",
  display: "grid",
  gap: "12px",
} as const;

const sessionCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "16px",
  padding: "14px",
  display: "grid",
  gap: "10px",
  textAlign: "left",
  cursor: "pointer",
  background: "#FFFFFF",
} as const;

const metricCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "12px",
  background: "#FFFFFF",
  padding: "10px",
  display: "grid",
  gap: "4px",
  textAlign: "center",
} as const;

const metricLabelStyle = {
  color: "#5F747A",
  fontSize: "10px",
  fontWeight: 800,
  textTransform: "uppercase",
} as const;

const sectionTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 800,
} as const;

const pageBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#DDF3F4",
  color: "#357F91",
  fontSize: "12px",
  fontWeight: 800,
} as const;

const pageTextStyle = {
  margin: 0,
  color: "#5F747A",
  lineHeight: 1.7,
} as const;

const fieldStyle = {
  display: "grid",
  gap: "6px",
} as const;

const fieldLabelStyle = {
  color: "#5F747A",
  fontSize: "12px",
  fontWeight: 800,
} as const;

const inputStyle = {
  width: "100%",
  border: "1px solid #BFDCDD",
  borderRadius: "12px",
  padding: "10px 12px",
  background: "#FFFFFF",
  color: "#2F3E46",
  font: "inherit",
} as const;

const primaryButtonStyle = {
  border: "1px solid #4AAEB6",
  borderRadius: "14px",
  padding: "10px 14px",
  background: "#4AAEB6",
  color: "#FFFFFF",
  fontWeight: 800,
  cursor: "pointer",
} as const;

const secondaryButtonStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "14px",
  padding: "10px 14px",
  background: "#FFFFFF",
  color: "#2F3E46",
  fontWeight: 800,
  cursor: "pointer",
} as const;

const inlineNoticeStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "14px",
  background: "linear-gradient(180deg, #F7FCFC, #EAF7F7)",
  padding: "12px 13px",
  color: "#5F747A",
  lineHeight: 1.7,
  fontSize: "12px",
} as const;

const commentCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "18px",
  padding: "14px",
  textAlign: "left",
  cursor: "pointer",
} as const;

const filterLabelStyle = {
  color: "#91A3A8",
  fontSize: "11px",
  fontWeight: 800,
  textTransform: "uppercase",
} as const;

function toggleButtonStyle(active: boolean) {
  return {
    border: `1px solid ${active ? "#4AAEB6" : "#BFDCDD"}`,
    borderRadius: "999px",
    padding: "7px 11px",
    background: active ? "#DDF3F4" : "#FFFFFF",
    color: active ? "#357F91" : "#2F3E46",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  } as const;
}

function summaryChipStyle(active: boolean) {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: "999px",
    border: `1px solid ${active ? "#8FCFD3" : "#BFDCDD"}`,
    background: active ? "#DDF3F4" : "#FFFFFF",
    color: active ? "#357F91" : "#5F747A",
    fontSize: "12px",
    fontWeight: 800,
  } as const;
}

function statusChipStyle(active: boolean) {
  return {
    width: "fit-content",
    padding: "5px 9px",
    borderRadius: "999px",
    background: active ? "#FFF0D8" : "#EAF7F7",
    color: active ? "#A96E22" : "#5F747A",
    fontSize: "11px",
    fontWeight: 800,
  } as const;
}

function stateChipStyle(state: ReviewState) {
  return stateCountChipStyle(state);
}

function stateCountChipStyle(state: ReviewState) {
  if (state === "displayed") {
    return chipStyle("#E4F5EC", "#3F8A63");
  }

  if (state === "skipped") {
    return chipStyle("#FFF0D8", "#A96E22");
  }

  if (state === "unknown") {
    return chipStyle("#FFE2E2", "#B94D4D");
  }

  return chipStyle("#F7FCFC", "#5F747A");
}

function inferenceChipStyle(inference: InferenceHint) {
  if (inference === "existing_close") {
    return chipStyle("#E4F5EC", "#3F8A63");
  }

  if (inference === "ambiguous") {
    return chipStyle("#FFF0D8", "#A96E22");
  }

  if (inference === "unknown_leaning") {
    return chipStyle("#FFE2E2", "#B94D4D");
  }

  return chipStyle("#F7FCFC", "#5F747A");
}

function queueStatusChipStyle(status: ReviewPatchStatus) {
  if (status === "candidate") {
    return chipStyle("#EAF7F7", "#357F91");
  }

  if (status === "pending") {
    return chipStyle("#FFF0D8", "#A96E22");
  }

  if (status === "adopted") {
    return chipStyle("#E4F5EC", "#3F8A63");
  }

  if (status === "compiled") {
    return chipStyle("#DDF3F4", "#357F91");
  }

  return chipStyle("#F7FCFC", "#5F747A");
}

const metaChipStyle = chipStyle("#FFFFFF", "#5F747A");

function chipStyle(background: string, color: string) {
  return {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "5px 9px",
    borderRadius: "999px",
    border: "1px solid rgba(191, 220, 221, 0.9)",
    background,
    color,
    fontSize: "11px",
    fontWeight: 800,
  } as const;
}

const selectedTextBoxStyle = {
  border: "1px solid rgba(243, 176, 176, 0.95)",
  borderRadius: "14px",
  background: "#FFE2E2",
  padding: "14px",
  lineHeight: 1.7,
} as const;

const patchCandidateStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "14px",
  background: "#FFFFFF",
  padding: "12px 13px",
  display: "grid",
  gap: "8px",
} as const;
