import { useMemo, useState } from "react";
import type {
  AdoptedChangeItem,
  ReviewPatchQueueItem,
} from "../../../backend/src/contracts/queue";
import type {
  CompilePlanItem,
  CompileRecord,
} from "../../../backend/src/contracts/compile";

type EntryKind = "rule" | "definition";
type RuleSource = "初期プリセット" | "手動追加" | "Review由来" | "AI採用済み" | "派生編集";
type RuleTarget = "視聴者" | "配信者" | "共通";
type PatchStatus = "candidate" | "pending" | "adopted" | "discarded" | "compiled";

interface LibraryEntry {
  id: string;
  name: string;
  kind: EntryKind;
  enabled: boolean;
  source: RuleSource;
  target: RuleTarget;
  summary: string;
  conditionCount?: number;
  replyCount?: number;
}

interface EditableCondition {
  id: string;
  type: string;
  content: string;
  priority: "高" | "中" | "低";
}

interface ReviewPatchCandidate {
  id: string;
  patchType: "ignore_patch" | "existing_category_patch" | "new_candidate_patch";
  title: string;
  summary: string;
  targetLabel: string;
  status: PatchStatus;
}

const libraryEntries: LibraryEntry[] = [
  {
    id: "rule-first-time",
    name: "初見歓迎ルール",
    kind: "rule",
    enabled: true,
    source: "初期プリセット",
    target: "視聴者",
    summary: "初見 / 挨拶系コメントを優先して歓迎する正式ルール",
    conditionCount: 2,
    replyCount: 4,
  },
  {
    id: "rule-regular",
    name: "常連向けお礼ルール",
    kind: "rule",
    enabled: true,
    source: "派生編集",
    target: "視聴者",
    summary: "よく来る視聴者へ少しやわらかく返す正式ルール",
    conditionCount: 2,
    replyCount: 3,
  },
  {
    id: "rule-gear-talk",
    name: "機材トーク候補ルール",
    kind: "rule",
    enabled: false,
    source: "Review由来",
    target: "視聴者",
    summary: "機材や配信環境に関する質問を正式ルールへ寄せる候補",
    conditionCount: 1,
    replyCount: 2,
  },
  {
    id: "def-question",
    name: "質問カテゴリ",
    kind: "definition",
    enabled: true,
    source: "初期プリセット",
    target: "視聴者",
    summary: "質問系コメントへ返すカテゴリ定義",
  },
  {
    id: "def-gear",
    name: "機材トーク定義",
    kind: "definition",
    enabled: true,
    source: "手動追加",
    target: "視聴者",
    summary: "マイク、カメラ、配信環境などの話題に使う正式定義",
  },
];

const initialConditions: EditableCondition[] = [
  {
    id: "cond-1",
    type: "コメント条件",
    content: "初見 / はじめまして / 初見です を含む",
    priority: "高",
  },
  {
    id: "cond-2",
    type: "名前条件",
    content: "初見バッジ / 初回ユーザー寄り",
    priority: "中",
  },
];

const initialReplyCandidates = [
  "こんにちは。来てくれてありがとうございます。ゆっくりしていってくださいね。",
  "初見さん、ありがとうございます。今日はこんな感じでやっています。",
];

const initialReviewPatches: ReviewPatchCandidate[] = [
  {
    id: "patch-1",
    patchType: "ignore_patch",
    title: "晩御飯系の軽い雑談質問",
    summary: "軽い雑談質問を ignore 対象へ寄せる候補",
    targetLabel: "ignore 条件候補",
    status: "candidate",
  },
  {
    id: "patch-2",
    patchType: "existing_category_patch",
    title: "question カテゴリへの追加候補",
    summary: "機材トーク系を質問カテゴリへ統合する候補",
    targetLabel: "質問カテゴリ",
    status: "pending",
  },
  {
    id: "patch-3",
    patchType: "new_candidate_patch",
    title: "機材トークの新規候補",
    summary: "新しい反応カテゴリまたはルール候補として保持",
    targetLabel: "機材トーク",
    status: "adopted",
  },
];

export function DetailedRulesPage({
  reviewPatchQueue,
  adoptedChanges,
  compilePrecheckItems,
  compileHistory,
  onSetReviewPatchStatus,
  onRunCompile,
}: {
  reviewPatchQueue: ReviewPatchQueueItem[];
  adoptedChanges: AdoptedChangeItem[];
  compilePrecheckItems: CompilePlanItem[];
  compileHistory: CompileRecord[];
  onSetReviewPatchStatus: (
    patchId: string,
    status: ReviewPatchQueueItem["status"],
  ) => void;
  onRunCompile: () => void;
}) {
  const [selectedEntryId, setSelectedEntryId] = useState("rule-first-time");
  const [searchText, setSearchText] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | EntryKind>("all");
  const [enabledFilter, setEnabledFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [targetFilter, setTargetFilter] = useState<"all" | RuleTarget>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | RuleSource>("all");
  const [ruleName, setRuleName] = useState("初見歓迎ルール");
  const [enabled, setEnabled] = useState("有効");
  const [target, setTarget] = useState<RuleTarget>("視聴者");
  const [personaLayer, setPersonaLayer] = useState("基本人格");
  const [toneDirection, setToneDirection] = useState("丁寧で落ち着いた口調");
  const [notes, setNotes] = useState("初見歓迎は強めに出す。常連向けルールより先に当てる。");
  const [conditions] = useState(initialConditions);
  const [replyCandidates] = useState(initialReplyCandidates);
  const [reviewPatchesFallback] = useState(initialReviewPatches);

  const reviewPatches: ReviewPatchCandidate[] =
    reviewPatchQueue.length > 0
      ? reviewPatchQueue.map((patch) => ({
          id: patch.id,
          patchType: patch.patch_type,
          title: patch.target_category_or_definition ?? patch.proposal_summary,
          summary: patch.proposal_summary,
          targetLabel: patch.target_category_or_definition ?? "未設定",
          status: patch.status,
        }))
      : reviewPatchesFallback;

  const filteredEntries = useMemo(
    () =>
      libraryEntries.filter((entry) => {
        if (kindFilter !== "all" && entry.kind !== kindFilter) {
          return false;
        }

        if (enabledFilter === "enabled" && !entry.enabled) {
          return false;
        }

        if (enabledFilter === "disabled" && entry.enabled) {
          return false;
        }

        if (targetFilter !== "all" && entry.target !== targetFilter) {
          return false;
        }

        if (sourceFilter !== "all" && entry.source !== sourceFilter) {
          return false;
        }

        if (
          searchText &&
          !`${entry.name} ${entry.summary} ${entry.source} ${entry.target}`.toLowerCase().includes(searchText.toLowerCase())
        ) {
          return false;
        }

        return true;
      }),
    [enabledFilter, kindFilter, searchText, sourceFilter, targetFilter],
  );

  const selectedEntry =
    filteredEntries.find((entry) => entry.id === selectedEntryId) ??
    libraryEntries.find((entry) => entry.id === selectedEntryId) ??
    libraryEntries[0];

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
          maxWidth: "1520px",
          margin: "0 auto",
          display: "grid",
          gap: "16px",
        }}
      >
        <header style={pageHeaderStyle}>
          <div style={{ display: "grid", gap: "6px" }}>
            <div style={pageBadgeStyle}>Detailed Rules Skeleton</div>
            <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800 }}>Detailed Rules</h1>
            <p style={pageTextStyle}>
              正式編集室として、採用済みルールと定義の編集、手動追加、Review Patch Queue からの採用をまとめます。
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={summaryChipStyle(true)}>正式編集室</div>
            <div style={summaryChipStyle(false)}>AI / JSON Studio 主導線は持ち込まない</div>
          </div>
        </header>

        <section style={summaryCardStyle}>
          <strong style={{ fontSize: "15px" }}>この画面の役割</strong>
          <span style={pageTextStyle}>
            ここでは採用済みルールの正式編集、採用済み定義の正式編集、手動追加、`Review Patch Queue` からの採用、
            `compile 前確認` だけを扱います。JSON 生成、JSON 検証、エラー修正は AI / JSON Studio の責務です。
          </span>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "320px minmax(0, 1fr) 380px",
            gap: "16px",
            alignItems: "start",
          }}
        >
          <aside style={paneStyle}>
            <div style={{ ...paneHeaderStyle, borderBottom: "1px solid #BFDCDD" }}>
              <div>
                <h2 style={sectionTitleStyle}>ルール / 定義</h2>
                <p style={pageTextStyle}>正式に使う内容を探して開きます。</p>
              </div>
              <span style={summaryChipStyle(true)}>採用済み変更 {adoptedChanges.length}件</span>
            </div>

            <div style={{ padding: "14px", display: "grid", gap: "12px" }}>
              <div style={cardInsetStyle}>
                <input
                  style={inputStyle}
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="ルール名 / 定義名 / 条件で検索"
                />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
                  <button style={toggleButtonStyle(kindFilter === "all")} onClick={() => setKindFilter("all")}>
                    すべて
                  </button>
                  <button style={toggleButtonStyle(kindFilter === "rule")} onClick={() => setKindFilter("rule")}>
                    ルール
                  </button>
                  <button
                    style={toggleButtonStyle(kindFilter === "definition")}
                    onClick={() => setKindFilter("definition")}
                  >
                    定義
                  </button>
                  <button style={toggleButtonStyle(sourceFilter === "Review由来")} onClick={() => setSourceFilter("Review由来")}>
                    Review 由来
                  </button>
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  <select
                    style={inputStyle}
                    value={enabledFilter}
                    onChange={(event) => setEnabledFilter(event.target.value as "all" | "enabled" | "disabled")}
                  >
                    <option value="all">状態: すべて</option>
                    <option value="enabled">有効のみ</option>
                    <option value="disabled">無効のみ</option>
                  </select>
                  <select
                    style={inputStyle}
                    value={targetFilter}
                    onChange={(event) => setTargetFilter(event.target.value as "all" | RuleTarget)}
                  >
                    <option value="all">発話対象: すべて</option>
                    <option value="視聴者">視聴者</option>
                    <option value="配信者">配信者</option>
                    <option value="共通">共通</option>
                  </select>
                  <select
                    style={inputStyle}
                    value={sourceFilter}
                    onChange={(event) => setSourceFilter(event.target.value as "all" | RuleSource)}
                  >
                    <option value="all">由来: すべて</option>
                    <option value="初期プリセット">初期プリセット</option>
                    <option value="手動追加">手動追加</option>
                    <option value="Review由来">Review由来</option>
                    <option value="AI採用済み">AI採用済み</option>
                    <option value="派生編集">派生編集</option>
                  </select>
                </div>
              </div>

              {filteredEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedEntryId(entry.id)}
                  style={{
                    ...listCardStyle,
                    borderColor: entry.id === selectedEntryId ? "#8FCFD3" : "#BFDCDD",
                    background:
                      entry.id === selectedEntryId
                        ? "linear-gradient(180deg, #FFFFFF 0%, #F7FCFC 100%)"
                        : "#FFFFFF",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ display: "grid", gap: "5px", textAlign: "left" }}>
                      <strong>{entry.name}</strong>
                      <span style={{ ...pageTextStyle, fontSize: "12px" }}>{entry.summary}</span>
                    </div>
                    <span style={statusChipStyle(entry.enabled)}>{entry.enabled ? "有効" : "無効"}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={pillStyle("#E4F5EC", "#3F8A63")}>{entry.kind === "rule" ? "ルール" : "定義"}</span>
                    <span style={pillStyle("#F7FCFC", "#5F747A")}>{entry.source}</span>
                    <span style={pillStyle("#EAF7F7", "#357F91")}>{entry.target}</span>
                  </div>
                  {entry.kind === "rule" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
                      <div style={metricCardStyle}>
                        <span style={metricLabelStyle}>候補文</span>
                        <strong>{entry.replyCount}</strong>
                      </div>
                      <div style={metricCardStyle}>
                        <span style={metricLabelStyle}>条件</span>
                        <strong>{entry.conditionCount}</strong>
                      </div>
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          </aside>

          <section style={paneStyle}>
            <div style={paneHeaderStyle}>
              <div>
                <h2 style={sectionTitleStyle}>選択中の正式編集</h2>
                <p style={pageTextStyle}>
                  {selectedEntry?.kind === "definition"
                    ? "定義の正式編集導線をここで確認します。"
                    : "採用済みルールの正式編集フォームをここで確認します。"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={pillStyle("#EAF7F7", "#357F91")}>{selectedEntry?.source ?? "由来未設定"}</span>
                <span style={pillStyle("#F7FCFC", "#5F747A")}>{selectedEntry?.target ?? "共通"}</span>
              </div>
            </div>

            <div style={{ padding: "14px", display: "grid", gap: "14px" }}>
              <section style={cardInsetStyle}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px" }}>
                  <Field label={selectedEntry?.kind === "definition" ? "定義名" : "ルール名"}>
                    <input style={inputStyle} value={ruleName} onChange={(event) => setRuleName(event.target.value)} />
                  </Field>
                  <Field label="状態">
                    <select style={inputStyle} value={enabled} onChange={(event) => setEnabled(event.target.value)}>
                      <option>有効</option>
                      <option>無効</option>
                    </select>
                  </Field>
                  <Field label="発話対象">
                    <select
                      style={inputStyle}
                      value={target}
                      onChange={(event) => setTarget(event.target.value as RuleTarget)}
                    >
                      <option value="視聴者">視聴者</option>
                      <option value="配信者">配信者</option>
                      <option value="共通">共通</option>
                    </select>
                  </Field>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
                  <Field label="使用人格レイヤー">
                    <select style={inputStyle} value={personaLayer} onChange={(event) => setPersonaLayer(event.target.value)}>
                      <option>基本人格</option>
                      <option>やわらかめ</option>
                      <option>補助寄り</option>
                      <option>クール寄り</option>
                    </select>
                  </Field>
                  <Field label="口調方向">
                    <select style={inputStyle} value={toneDirection} onChange={(event) => setToneDirection(event.target.value)}>
                      <option>丁寧で落ち着いた口調</option>
                      <option>やわらかい口調</option>
                      <option>少しカジュアル</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section style={cardInsetStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>条件編集</h3>
                    <p style={{ ...pageTextStyle, fontSize: "12px" }}>発火条件を正式ルールとして調整します。</p>
                  </div>
                  <button style={secondaryButtonStyle}>条件を追加</button>
                </div>

                <div style={{ display: "grid", gap: "10px" }}>
                  {conditions.map((condition) => (
                    <div key={condition.id} style={subCardStyle}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr auto", gap: "10px" }}>
                        <Field label="条件種別">
                          <select style={inputStyle} defaultValue={condition.type}>
                            <option>コメント条件</option>
                            <option>無コメント条件</option>
                            <option>連投条件</option>
                            <option>名前条件</option>
                            <option>時間条件</option>
                          </select>
                        </Field>
                        <Field label="条件内容">
                          <input style={inputStyle} defaultValue={condition.content} />
                        </Field>
                        <Field label="優先度">
                          <select style={inputStyle} defaultValue={condition.priority}>
                            <option>高</option>
                            <option>中</option>
                            <option>低</option>
                          </select>
                        </Field>
                        <div style={{ display: "flex", alignItems: "end" }}>
                          <button style={secondaryButtonStyle}>削除</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section style={cardInsetStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>候補文編集</h3>
                    <p style={{ ...pageTextStyle, fontSize: "12px" }}>採用済みルールの候補文を正式に調整します。</p>
                  </div>
                  <button style={secondaryButtonStyle}>候補文を追加</button>
                </div>

                <div style={{ display: "grid", gap: "10px" }}>
                  {replyCandidates.map((reply, index) => (
                    <div key={`${reply}-${index}`} style={subCardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                        <span style={pillStyle("#DDF3F4", "#357F91")}>候補文 {index + 1}</span>
                        <button style={textButtonStyle}>削除</button>
                      </div>
                      <textarea style={{ ...inputStyle, minHeight: "88px", resize: "vertical" }} defaultValue={reply} />
                    </div>
                  ))}
                </div>
              </section>

              <section style={cardInsetStyle}>
                <Field label="補足メモ">
                  <textarea
                    style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </Field>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button style={primaryButtonStyle}>保存</button>
                    <button style={secondaryButtonStyle}>複製</button>
                    <button style={dangerButtonStyle}>削除</button>
                  </div>
                  <span style={{ ...pageTextStyle, fontSize: "12px" }}>
                    最終更新: 今日 18:42 / 由来: {selectedEntry?.source ?? "初期プリセット"}
                  </span>
                </div>
              </section>
            </div>
          </section>

          <aside style={paneStyle}>
            <div style={{ padding: "14px", display: "grid", gap: "14px" }}>
              <section style={cardInsetStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>手動で新ルールを追加</h2>
                  <p style={pageTextStyle}>新しい正式ルールを人力で追加する骨格です。</p>
                </div>
                <Field label="何のルールを作るか">
                  <input style={inputStyle} defaultValue="機材トークへの返答" />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <Field label="対象">
                    <select style={inputStyle} defaultValue="視聴者">
                      <option>視聴者</option>
                      <option>配信者</option>
                    </select>
                  </Field>
                  <Field label="方向性">
                    <select style={inputStyle} defaultValue="質問への返答">
                      <option>質問への返答</option>
                      <option>補助コメント</option>
                      <option>軽い話題振り</option>
                    </select>
                  </Field>
                </div>
                <Field label="初期候補文">
                  <textarea
                    style={{ ...inputStyle, minHeight: "88px", resize: "vertical" }}
                    defaultValue="機材まわりは少しずつ整えています。まだ調整中のところもありますね。"
                  />
                </Field>
                <button style={primaryButtonStyle}>新ルールを作成</button>
              </section>

              <section style={cardInsetStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>手動で新定義を追加</h2>
                  <p style={pageTextStyle}>Basic Settings などで使う正式定義の追加骨格です。</p>
                </div>
                <Field label="定義種別">
                  <select style={inputStyle} defaultValue="反応カテゴリ">
                    <option>反応カテゴリ</option>
                    <option>性格タイプ</option>
                    <option>口調タイプ</option>
                    <option>語尾タイプ</option>
                  </select>
                </Field>
                <Field label="名前">
                  <input style={inputStyle} defaultValue="機材トーク" />
                </Field>
                <Field label="説明">
                  <textarea
                    style={{ ...inputStyle, minHeight: "72px", resize: "vertical" }}
                    defaultValue="マイク、カメラ、配信環境などの話題に使うカテゴリ"
                  />
                </Field>
                <Field label="初期方向性">
                  <input style={inputStyle} defaultValue="質問 / 指摘 / 調整中の説明" />
                </Field>
                <button style={secondaryDarkButtonStyle}>新定義を追加</button>
              </section>

              <section style={cardInsetStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                  <div>
                    <h2 style={sectionTitleStyle}>Review Patch Queue から採用</h2>
                    <p style={pageTextStyle}>Review で整理された差分候補を、ここで正式採用する前提の確認欄です。</p>
                  </div>
                  <span style={pillStyle("#FFF0D8", "#A96E22")}>{reviewPatches.length}件</span>
                </div>
                <div style={{ display: "grid", gap: "10px" }}>
                  {reviewPatches.map((patch) => (
                    <article key={patch.id} style={subCardStyle}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={patchTypeStyle(patch.patchType)}>{patchTypeLabel(patch.patchType)}</span>
                        <span style={reviewPatchStatusStyle(patch.status)}>
                          {reviewPatchStatusLabel(patch.status)}
                        </span>
                      </div>
                      <strong>{patch.title}</strong>
                      <span style={pageTextStyle}>{patch.summary}</span>
                      <span style={{ ...pageTextStyle, fontSize: "12px" }}>対象: {patch.targetLabel}</span>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button style={primaryButtonStyle} onClick={() => onSetReviewPatchStatus(patch.id, "adopted")}>採用する</button>
                        <button style={secondaryButtonStyle} onClick={() => onSetReviewPatchStatus(patch.id, "pending")}>保留に戻す</button>
                        <button style={dangerButtonStyle} onClick={() => onSetReviewPatchStatus(patch.id, "discarded")}>採用しない</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section style={cardInsetStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                  <div>
                    <h2 style={sectionTitleStyle}>Adopted Changes</h2>
                    <p style={pageTextStyle}>採用済み変更の一覧です。compile 前確認から、最小の compile 実行結果を履歴へ流せます。</p>
                  </div>
                  <span style={pillStyle("#EAF7F7", "#357F91")}>compile 前確認</span>
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  {adoptedChanges.map((item) => (
                    <div key={item.id} style={subCardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
                        <strong>{item.target_name}</strong>
                        <span style={{ ...pageTextStyle, fontSize: "12px" }}>{new Date(item.adopted_at).toLocaleDateString("ja-JP")}</span>
                      </div>
                      <span style={pillStyle(item.compile_wait_status === "pending" ? "#EAF7F7" : "#F7FCFC", item.compile_wait_status === "pending" ? "#357F91" : "#5F747A")}>
                        {item.compile_wait_status === "pending" ? "compile 前確認中" : "compiled / 反映済み"}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "14px" }}>compile 前確認</strong>
                    <button
                      style={compileActionButtonStyle(compilePrecheckItems.length > 0)}
                      onClick={onRunCompile}
                      disabled={compilePrecheckItems.length === 0}
                    >
                      最小 compile を実行
                    </button>
                  </div>
                  {compilePrecheckItems.map((item) => (
                    <div key={item.adopted_change_id} style={subCardStyle}>
                      <strong>{item.target_name}</strong>
                      <span style={pageTextStyle}>反映先: {item.target_kind}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  <strong style={{ fontSize: "14px" }}>compile 履歴</strong>
                  {compileHistory.length > 0 ? (
                    compileHistory.map((record) => (
                      <div key={record.id} style={subCardStyle}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <strong>{new Date(record.executed_at).toLocaleString("ja-JP")}</strong>
                          <span
                            style={pillStyle(
                              record.status === "success" ? "#E4F5EC" : "#FFE2E2",
                              record.status === "success" ? "#3F8A63" : "#B94D4D",
                            )}
                          >
                            {record.status === "success" ? "success / 成功" : "failed / 失敗"}
                          </span>
                        </div>
                        <span style={pageTextStyle}>対象件数: {record.target_count}</span>
                        <span style={pageTextStyle}>反映先: {record.reflected_to.join(" / ")}</span>
                      </div>
                    ))
                  ) : (
                    <div style={subCardStyle}>
                      <span style={pageTextStyle}>まだ compile 履歴はありません。</span>
                    </div>
                  )}
                </div>
                <div style={inlineNoticeStyle}>
                  ここでの compile は frontend 内の最小確認版です。履歴表示までは進めますが、queue 保存や本体反映はまだ行いません。
                </div>
              </section>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: "6px" }}>
      <span style={fieldLabelStyle}>{label}</span>
      {children}
    </label>
  );
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

const subCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "14px",
  background: "#FFFFFF",
  padding: "12px",
  display: "grid",
  gap: "8px",
} as const;

const listCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "16px",
  padding: "14px",
  display: "grid",
  gap: "10px",
  textAlign: "left",
  cursor: "pointer",
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

const inlineNoticeStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "14px",
  background: "linear-gradient(180deg, #F7FCFC, #EAF7F7)",
  padding: "12px 13px",
  color: "#5F747A",
  lineHeight: 1.7,
  fontSize: "12px",
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

const secondaryDarkButtonStyle = {
  border: "1px solid #2F3E46",
  borderRadius: "14px",
  padding: "10px 14px",
  background: "#2F3E46",
  color: "#FFFFFF",
  fontWeight: 800,
  cursor: "pointer",
} as const;

const dangerButtonStyle = {
  border: "1px solid rgba(185, 77, 77, 0.28)",
  borderRadius: "14px",
  padding: "10px 14px",
  background: "#FFFFFF",
  color: "#B94D4D",
  fontWeight: 800,
  cursor: "pointer",
} as const;

const textButtonStyle = {
  border: "none",
  background: "transparent",
  color: "#91A3A8",
  fontSize: "12px",
  fontWeight: 800,
  cursor: "pointer",
} as const;

function toggleButtonStyle(active: boolean) {
  return {
    border: `1px solid ${active ? "#4AAEB6" : "#BFDCDD"}`,
    borderRadius: "12px",
    padding: "8px 10px",
    background: active ? "#2F3E46" : "#FFFFFF",
    color: active ? "#FFFFFF" : "#5F747A",
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

function compileActionButtonStyle(active: boolean) {
  return {
    border: `1px solid ${active ? "#2F3E46" : "#BFDCDD"}`,
    borderRadius: "14px",
    padding: "10px 14px",
    background: active ? "#2F3E46" : "#F7FCFC",
    color: active ? "#FFFFFF" : "#91A3A8",
    fontWeight: 800,
    cursor: active ? "pointer" : "not-allowed",
    opacity: active ? 1 : 0.8,
  } as const;
}

function statusChipStyle(active: boolean) {
  return pillStyle(active ? "#E4F5EC" : "#F7FCFC", active ? "#3F8A63" : "#5F747A");
}

function patchTypeStyle(type: ReviewPatchCandidate["patchType"]) {
  if (type === "ignore_patch") {
    return pillStyle("#F7FCFC", "#5F747A");
  }

  if (type === "existing_category_patch") {
    return pillStyle("#DDF3F4", "#357F91");
  }

  return pillStyle("#FFF0D8", "#A96E22");
}

function patchTypeLabel(type: ReviewPatchCandidate["patchType"]) {
  if (type === "ignore_patch") {
    return "ignore 候補";
  }

  if (type === "existing_category_patch") {
    return "existing category 候補";
  }

  return "new candidate 候補";
}

function reviewPatchStatusLabel(status: PatchStatus) {
  if (status === "candidate") {
    return "candidate / 候補";
  }

  if (status === "pending") {
    return "pending / 保留";
  }

  if (status === "adopted") {
    return "adopted / 採用済み";
  }

  if (status === "compiled") {
    return "compiled / 反映済み";
  }

  return "discarded / 不採用";
}

function reviewPatchStatusStyle(status: PatchStatus) {
  if (status === "candidate") {
    return pillStyle("#EAF7F7", "#357F91");
  }

  if (status === "pending") {
    return pillStyle("#FFF0D8", "#A96E22");
  }

  if (status === "adopted") {
    return pillStyle("#E4F5EC", "#3F8A63");
  }

  if (status === "compiled") {
    return pillStyle("#DDF3F4", "#357F91");
  }

  return pillStyle("#F7FCFC", "#5F747A");
}

function pillStyle(background: string, color: string) {
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
