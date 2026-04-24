import { useState } from "react";

import { CharacterStage } from "../components/display";

type BackgroundVariant = "mint" | "studio" | "night";
type SampleKey = "compliment" | "greeting" | "question" | "quiet";
type Orientation = "front" | "side";

interface PreviewHistoryItem {
  id: string;
  kind: "comment" | "reply" | "event";
  label: string;
  name?: string;
  text: string;
}

interface PreviewResult {
  result_label: string;
  reason_label: string;
  reaction_name: string;
  adoption_label: string;
  orientation: Orientation;
  bubble_text: string;
}

interface SampleDefinition {
  author: string;
  text: string;
  reason_label: string;
  reaction_name: string;
  orientation: Orientation;
  bubble_text: string;
}

interface EventPreset {
  id: string;
  title: string;
  condition_label: string;
  value_label: string;
  reason_label: string;
  reaction_name: string;
  orientation: Orientation;
  bubble_text: string;
}

const sampleDefinitions: Record<SampleKey, SampleDefinition> = {
  compliment: {
    author: "Sora_77",
    text: "こんばんは。今日の雰囲気、少し静かで好きです。",
    reason_label: "褒めコメント",
    reaction_name: "落ち着いたお礼",
    orientation: "side",
    bubble_text:
      "こんばんは。ありがとうございます。今日は少し落ち着いた空気で進めようと思っていました。",
  },
  greeting: {
    author: "Mikan88",
    text: "こんばんは、今日も来ました。",
    reason_label: "挨拶コメント",
    reaction_name: "挨拶返答",
    orientation: "front",
    bubble_text: "こんばんは。来てくれてうれしいです。ゆっくりしていってくださいね。",
  },
  question: {
    author: "Ame_14",
    text: "今日はどんな話題から始めますか？",
    reason_label: "質問コメント",
    reaction_name: "質問応答",
    orientation: "front",
    bubble_text: "今日は最近の出来事からゆっくり話していく予定です。気になることがあれば気軽にどうぞ。",
  },
  quiet: {
    author: "Nagi_01",
    text: "静かな配信も好きです。",
    reason_label: "雰囲気共有",
    reaction_name: "共感返答",
    orientation: "side",
    bubble_text: "ありがとうございます。この落ち着いた空気も大事にしたいので、少し丁寧めに進めてみます。",
  },
};

const eventPresets: EventPreset[] = [
  {
    id: "silence-120",
    title: "無コメント120秒",
    condition_label: "条件イベント",
    value_label: "無コメント / 120秒",
    reason_label: "無コメント条件成立",
    reaction_name: "無言時の話題振り",
    orientation: "front",
    bubble_text: "少し静かになってきましたね。ここで最近の小さな話題をひとつ挟んでみます。",
  },
  {
    id: "rapid-post",
    title: "連投5件",
    condition_label: "コメント条件",
    value_label: "同一ユーザー / 5件",
    reason_label: "連投抑制",
    reaction_name: "未実行",
    orientation: "side",
    bubble_text: "今回は採用を見送りました。連投抑制が働いたときの見え方だけを確認しています。",
  },
  {
    id: "ng-word",
    title: "NGワード入力",
    condition_label: "コメント条件",
    value_label: "NGワード含有",
    reason_label: "NGワード一致",
    reaction_name: "未実行",
    orientation: "front",
    bubble_text: "このケースは ignored 想定です。理由ラベルと表示向きの確認だけを行います。",
  },
];

const initialSample = sampleDefinitions.compliment;

export function PreviewTestPage() {
  const [orientation, setOrientation] = useState<Orientation>("front");
  const [mirror, setMirror] = useState(false);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>("mint");
  const [characterX, setCharacterX] = useState(77);
  const [characterY, setCharacterY] = useState(67);
  const [characterScale, setCharacterScale] = useState(82);
  const [bubbleX, setBubbleX] = useState(29);
  const [bubbleY, setBubbleY] = useState(50);
  const [bubbleWidth, setBubbleWidth] = useState(38);
  const [authorName, setAuthorName] = useState(initialSample.author);
  const [selectedSample, setSelectedSample] = useState<SampleKey>("compliment");
  const [commentText, setCommentText] = useState(initialSample.text);
  const [historyItems, setHistoryItems] = useState<PreviewHistoryItem[]>([]);
  const [previewResult, setPreviewResult] = useState<PreviewResult>({
    result_label: "未実行",
    reason_label: "未実行",
    reaction_name: "未実行",
    adoption_label: "確認待ち",
    orientation: "front",
    bubble_text:
      "ここでは Main Preview、キャラクター表示、吹き出し表示、Bottom Test Area の骨格を確認できます。",
  });

  function applySample(sampleKey: SampleKey) {
    const sample = sampleDefinitions[sampleKey];

    setSelectedSample(sampleKey);
    setAuthorName(sample.author);
    setCommentText(sample.text);
  }

  function appendHistory(items: PreviewHistoryItem[]) {
    setHistoryItems((current) => [...items, ...current].slice(0, 10));
  }

  function runCommentTest(source: "manual" | "sample") {
    const sample = sampleDefinitions[selectedSample];
    const nextOrientation = source === "manual" ? sample.orientation : sample.orientation;
    const nextResult: PreviewResult = {
      result_label: "displayed",
      reason_label: sample.reason_label,
      reaction_name: sample.reaction_name,
      adoption_label: "採用",
      orientation: nextOrientation,
      bubble_text: sample.bubble_text,
    };

    setOrientation(nextOrientation);
    setPreviewResult(nextResult);
    appendHistory([
      {
        id: `${Date.now()}-comment`,
        kind: "comment",
        label: "コメント",
        name: authorName,
        text: commentText,
      },
      {
        id: `${Date.now()}-reply`,
        kind: "reply",
        label: "VTuner返答",
        text: sample.bubble_text,
      },
    ]);
  }

  function runEventPreset(preset: EventPreset) {
    const isIgnored = preset.id === "ng-word";
    const nextResult: PreviewResult = {
      result_label: isIgnored ? "ignored" : preset.id === "rapid-post" ? "skipped" : "displayed",
      reason_label: preset.reason_label,
      reaction_name: preset.reaction_name,
      adoption_label: isIgnored ? "不採用" : preset.id === "rapid-post" ? "保留" : "採用",
      orientation: preset.orientation,
      bubble_text: preset.bubble_text,
    };

    setOrientation(preset.orientation);
    setPreviewResult(nextResult);
    appendHistory([
      {
        id: `${Date.now()}-${preset.id}`,
        kind: "event",
        label: preset.condition_label,
        text: `${preset.title} を実行: ${preset.value_label}`,
      },
      {
        id: `${Date.now()}-${preset.id}-reply`,
        kind: "reply",
        label: "VTuner返答",
        text: preset.bubble_text,
      },
    ]);
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
          maxWidth: "1440px",
          margin: "0 auto",
          display: "grid",
          gap: "16px",
        }}
      >
        <header
          style={{
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
          }}
        >
          <div style={{ display: "grid", gap: "6px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                width: "fit-content",
                padding: "6px 10px",
                borderRadius: "999px",
                background: "#DDF3F4",
                color: "#357F91",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              Preview / Test Skeleton
            </div>
            <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800 }}>Preview / Test</h1>
            <p style={{ margin: 0, color: "#5F747A", lineHeight: 1.7 }}>
              見た目確認と試験入力の画面です。Overlay 表示専用ルートは後続 Phase で分離して扱います。
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={toolbarChipStyle("front" === orientation)}>
              向き: {orientation}
            </div>
            <div style={toolbarChipStyle(mirror)}>mirror: {mirror ? "on" : "off"}</div>
            <div style={toolbarChipStyle(false)}>履歴: Preview / Test 専用</div>
          </div>
        </header>

        <section
          style={{
            padding: "16px 18px",
            border: "1px solid #BFDCDD",
            borderRadius: "20px",
            background: "linear-gradient(180deg, #F7FCFC 0%, #FFFFFF 100%)",
            boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
          }}
        >
          <div style={{ display: "grid", gap: "8px" }}>
            <strong style={{ fontSize: "15px" }}>この画面の役割</strong>
            <span style={{ color: "#5F747A", lineHeight: 1.7 }}>
              Main Preview、試験入力、条件イベント確認、理由ラベルと使用反応名の確認に限定します。
              Basic Settings の主編集や Review の仕分けはここへ持ち込みません。
            </span>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.55fr) minmax(320px, 0.85fr)",
            gap: "16px",
            alignItems: "start",
          }}
        >
          <section style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <h2 style={cardTitleStyle}>Main Preview</h2>
                <p style={cardBodyTextStyle}>
                  CharacterStage を使って、キャラクター表示と吹き出し表示を確認用 UI と一緒に見ます。
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button style={toggleButtonStyle(orientation === "front")} onClick={() => setOrientation("front")}>
                  front
                </button>
                <button style={toggleButtonStyle(orientation === "side")} onClick={() => setOrientation("side")}>
                  side
                </button>
                <button style={toggleButtonStyle(mirror)} onClick={() => setMirror((current) => !current)}>
                  mirror
                </button>
              </div>
            </div>

            <div style={{ padding: "14px", display: "grid", gap: "14px" }}>
              <CharacterStage
                transparent_background={false}
                show_ui_controls
                stage_label="Main Preview"
                subtitle={previewResult.bubble_text}
                background_variant={backgroundVariant}
                character={{
                  character_name: "ヴィヴィ",
                  orientation,
                  mirror,
                  position_x: characterX,
                  position_y: characterY,
                  scale_percent: characterScale,
                }}
                bubble={{
                  text: previewResult.bubble_text,
                  visible: true,
                  label: "Speech Bubble",
                  position_x: bubbleX,
                  position_y: bubbleY,
                  width_percent: bubbleWidth,
                }}
              />

              <section style={resultGridStyle}>
                <div style={resultCardStyle}>
                  <span style={resultLabelStyle}>実行結果</span>
                  <strong>{previewResult.result_label}</strong>
                </div>
                <div style={resultCardStyle}>
                  <span style={resultLabelStyle}>理由ラベル</span>
                  <strong>{previewResult.reason_label}</strong>
                </div>
                <div style={resultCardStyle}>
                  <span style={resultLabelStyle}>使用反応名</span>
                  <strong>{previewResult.reaction_name}</strong>
                </div>
                <div style={resultCardStyle}>
                  <span style={resultLabelStyle}>採用 / 不採用</span>
                  <strong>{previewResult.adoption_label}</strong>
                </div>
                <div style={resultCardStyle}>
                  <span style={resultLabelStyle}>表示向き</span>
                  <strong>{previewResult.orientation}</strong>
                </div>
              </section>

              <section style={controlGridStyle}>
                <div style={controlPanelStyle}>
                  <strong>背景確認</strong>
                  <span style={cardBodyTextStyle}>本番 Overlay ではなく、確認用背景の切替だけを行います。</span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button style={toggleButtonStyle(backgroundVariant === "mint")} onClick={() => setBackgroundVariant("mint")}>
                      Mint
                    </button>
                    <button style={toggleButtonStyle(backgroundVariant === "studio")} onClick={() => setBackgroundVariant("studio")}>
                      Studio
                    </button>
                    <button style={toggleButtonStyle(backgroundVariant === "night")} onClick={() => setBackgroundVariant("night")}>
                      Night
                    </button>
                  </div>
                </div>

                <div style={controlPanelStyle}>
                  <strong>キャラクター確認用コントロール</strong>
                  <ControlRow label={`X 位置 ${characterX}%`}>
                    <input type="range" min="58" max="85" value={characterX} onChange={(event) => setCharacterX(Number(event.target.value))} />
                  </ControlRow>
                  <ControlRow label={`Y 位置 ${characterY}%`}>
                    <input type="range" min="48" max="78" value={characterY} onChange={(event) => setCharacterY(Number(event.target.value))} />
                  </ControlRow>
                  <ControlRow label={`サイズ ${characterScale}%`}>
                    <input
                      type="range"
                      min="60"
                      max="110"
                      value={characterScale}
                      onChange={(event) => setCharacterScale(Number(event.target.value))}
                    />
                  </ControlRow>
                </div>

                <div style={controlPanelStyle}>
                  <strong>吹き出し確認用コントロール</strong>
                  <ControlRow label={`X 位置 ${bubbleX}%`}>
                    <input type="range" min="20" max="44" value={bubbleX} onChange={(event) => setBubbleX(Number(event.target.value))} />
                  </ControlRow>
                  <ControlRow label={`Y 位置 ${bubbleY}%`}>
                    <input type="range" min="28" max="68" value={bubbleY} onChange={(event) => setBubbleY(Number(event.target.value))} />
                  </ControlRow>
                  <ControlRow label={`幅 ${bubbleWidth}%`}>
                    <input
                      type="range"
                      min="28"
                      max="50"
                      value={bubbleWidth}
                      onChange={(event) => setBubbleWidth(Number(event.target.value))}
                    />
                  </ControlRow>
                </div>
              </section>
            </div>
          </section>

          <aside style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <h2 style={cardTitleStyle}>Comment / Test History</h2>
                <p style={cardBodyTextStyle}>
                  この履歴は Preview / Test 画面専用です。Review や runtime 後段の履歴とは分離します。
                </p>
              </div>
            </div>

            <div style={{ padding: "14px", display: "grid", gap: "14px" }}>
              <div
                style={{
                  border: "1px solid #BFDCDD",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#FFFFFF",
                }}
              >
                {historyItems.length === 0 ? (
                  <div style={{ padding: "26px 18px", textAlign: "center", color: "#5F747A", lineHeight: 1.7 }}>
                    まだこの画面でテストを実行していません。<br />
                    コメント送信か Bottom Test Area の実行で、この履歴に追加されます。
                  </div>
                ) : (
                  historyItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "14px",
                        borderBottom: "1px solid rgba(191, 220, 221, 0.55)",
                        display: "grid",
                        gap: "7px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={historyBadgeStyle(item.kind)}>{item.label}</span>
                        {item.name ? <strong style={{ color: "#3F8A63", fontSize: "13px" }}>{item.name}</strong> : null}
                      </div>
                      <div style={{ lineHeight: 1.65 }}>{item.text}</div>
                    </div>
                  ))
                )}
              </div>

              <div style={inputBoxStyle}>
                <p style={{ margin: 0, color: "#5F747A", fontSize: "12px", lineHeight: 1.7 }}>
                  ここは手入力テスト用です。正式ルール編集や JSON 生成は他画面の責務です。
                </p>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>投稿者名</span>
                  <input style={inputStyle} value={authorName} onChange={(event) => setAuthorName(event.target.value)} />
                </label>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>単発サンプル</span>
                  <select
                    style={inputStyle}
                    value={selectedSample}
                    onChange={(event) => applySample(event.target.value as SampleKey)}
                  >
                    <option value="compliment">褒めコメント</option>
                    <option value="greeting">挨拶</option>
                    <option value="question">質問</option>
                    <option value="quiet">静かな雰囲気</option>
                  </select>
                </label>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>コメント入力</span>
                  <textarea
                    style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                  />
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button style={primaryButtonStyle} onClick={() => runCommentTest("manual")}>
                    送信
                  </button>
                  <button style={secondaryButtonStyle} onClick={() => runCommentTest("sample")}>
                    単発サンプル実行
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={cardTitleStyle}>Bottom Test Area</h2>
              <p style={cardBodyTextStyle}>
                条件イベントやコメント条件を繰り返し確認する骨格です。queue / compile の処理にはまだ接続しません。
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "14px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "12px",
            }}
          >
            {eventPresets.map((preset) => (
              <article key={preset.id} style={controlPanelStyle}>
                <div style={{ display: "grid", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={toolbarChipStyle(false)}>{preset.condition_label}</span>
                    <strong>{preset.title}</strong>
                  </div>
                  <div style={{ color: "#5F747A", lineHeight: 1.7 }}>
                    条件値: {preset.value_label}
                    <br />
                    理由ラベル: {preset.reason_label}
                    <br />
                    使用反応名: {preset.reaction_name}
                  </div>
                </div>
                <button style={primaryButtonStyle} onClick={() => runEventPreset(preset)}>
                  この条件を実行
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ControlRow({
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

const cardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "20px",
  background: "#FFFFFF",
  boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
} as const;

const cardHeaderStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  padding: "16px 18px",
  borderBottom: "1px solid #BFDCDD",
  background: "#F7FCFC",
} as const;

const cardTitleStyle = {
  margin: "0 0 6px",
  fontSize: "20px",
  fontWeight: 800,
} as const;

const cardBodyTextStyle = {
  margin: 0,
  color: "#5F747A",
  lineHeight: 1.7,
} as const;

const controlGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
} as const;

const controlPanelStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "16px",
  background: "#F7FCFC",
  padding: "14px",
  display: "grid",
  gap: "12px",
} as const;

const resultGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "10px",
} as const;

const resultCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "14px",
  background: "#FFFFFF",
  padding: "12px 14px",
  display: "grid",
  gap: "4px",
} as const;

const resultLabelStyle = {
  color: "#5F747A",
  fontSize: "12px",
  fontWeight: 700,
} as const;

const inputBoxStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "16px",
  background: "#F7FCFC",
  padding: "14px",
  display: "grid",
  gap: "12px",
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

function toggleButtonStyle(active: boolean) {
  return {
    border: `1px solid ${active ? "#4AAEB6" : "#BFDCDD"}`,
    borderRadius: "999px",
    padding: "8px 12px",
    background: active ? "#DDF3F4" : "#FFFFFF",
    color: active ? "#357F91" : "#2F3E46",
    fontWeight: 800,
    cursor: "pointer",
  } as const;
}

function toolbarChipStyle(active: boolean) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    border: `1px solid ${active ? "#8FCFD3" : "#BFDCDD"}`,
    background: active ? "#DDF3F4" : "#FFFFFF",
    color: active ? "#357F91" : "#5F747A",
    fontSize: "12px",
    fontWeight: 800,
  } as const;
}

function historyBadgeStyle(kind: PreviewHistoryItem["kind"]) {
  if (kind === "reply") {
    return {
      padding: "5px 9px",
      borderRadius: "999px",
      background: "#E4F5EC",
      color: "#3F8A63",
      fontSize: "11px",
      fontWeight: 800,
    } as const;
  }

  if (kind === "event") {
    return {
      padding: "5px 9px",
      borderRadius: "999px",
      background: "#EAF7F7",
      color: "#5F747A",
      fontSize: "11px",
      fontWeight: 800,
    } as const;
  }

  return {
    padding: "5px 9px",
    borderRadius: "999px",
    background: "#FFF0D8",
    color: "#A96E22",
    fontSize: "11px",
    fontWeight: 800,
  } as const;
}
