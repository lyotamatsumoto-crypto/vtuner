import { useState, type ReactNode } from "react";

import { CharacterStage } from "../components/display";

type CategoryKey =
  | "greeting"
  | "compliment"
  | "question"
  | "support"
  | "empathy"
  | "smallTalk"
  | "firstTime"
  | "regular";

const categoryMeta: Array<{ key: CategoryKey; label: string; description: string }> = [
  { key: "greeting", label: "挨拶", description: "入室時や最初の受け答え" },
  { key: "compliment", label: "褒め", description: "好意的なコメントへの返答" },
  { key: "question", label: "質問", description: "質問や確認コメントへの返答" },
  { key: "support", label: "応援", description: "応援コメントへの返答" },
  { key: "empathy", label: "共感", description: "共感や雰囲気共有への返答" },
  { key: "smallTalk", label: "話題振り", description: "場をつなぐ補助的な反応" },
  { key: "firstTime", label: "初見反応", description: "初めて来た視聴者への歓迎" },
  { key: "regular", label: "常連反応", description: "よく来る視聴者への返答" },
];

export function BasicSettingsPage() {
  const [vtunerName, setVtunerName] = useState("ヴィヴィ");
  const [firstPerson, setFirstPerson] = useState("私");
  const [viewerCall, setViewerCall] = useState("皆さん");
  const [streamerCall, setStreamerCall] = useState("マスター");
  const [profileSummary, setProfileSummary] = useState(
    "少し落ち着いた雰囲気で、配信の空気を整えながら視聴者と配信者の間をやわらかくつなぐ仲介キャラクター。",
  );
  const [personaSummary, setPersonaSummary] = useState(
    "丁寧で落ち着いているが、親しみを切りすぎず、必要なときだけ一歩前に出る。",
  );
  const [viewerPolicy, setViewerPolicy] = useState("礼儀正しく、常連には少しやわらかく接する");
  const [streamerPolicy, setStreamerPolicy] = useState("困っているときは助け舟を出す");
  const [toneLabel, setToneLabel] = useState("丁寧で落ち着いた口調");
  const [endingStyle, setEndingStyle] = useState("〜ですね / 〜ですよ");
  const [favoritePhrases, setFavoritePhrases] = useState("ありがとうございます / なるほどです / それは良いですね");
  const [bannedExpressions, setBannedExpressions] = useState("暴言、差別的表現、過度に攻撃的な言い回し");
  const [voiceEnabled, setVoiceEnabled] = useState("使う");
  const [voiceType, setVoiceType] = useState("落ち着いた女性声");
  const [voiceSpeed, setVoiceSpeed] = useState("標準");
  const [voiceVolume, setVoiceVolume] = useState(68);
  const [defaultFacing, setDefaultFacing] = useState<"front" | "side">("front");
  const [mirrorEnabled, setMirrorEnabled] = useState(true);
  const [displaySize, setDisplaySize] = useState("標準");
  const [bubbleEnabled, setBubbleEnabled] = useState("使う");
  const [bubbleShape, setBubbleShape] = useState("角丸");
  const [bubbleFont, setBubbleFont] = useState("読みやすいゴシック体");
  const [bubbleTextColor, setBubbleTextColor] = useState("#111827");
  const [bubbleBackgroundColor, setBubbleBackgroundColor] = useState("#FFFFFF");
  const [categoryStates, setCategoryStates] = useState<Record<CategoryKey, boolean>>({
    greeting: true,
    compliment: true,
    question: true,
    support: true,
    empathy: true,
    smallTalk: true,
    firstTime: true,
    regular: true,
  });
  const previewSubtitle =
    bubbleEnabled === "使う" ? `${firstPerson}、${viewerCall}。今日もゆっくり進めます。` : undefined;

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
        <header style={pageHeaderStyle}>
          <div style={{ display: "grid", gap: "6px" }}>
            <div style={pageBadgeStyle}>Basic Settings Skeleton</div>
            <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800 }}>Basic Settings</h1>
            <p style={pageTextStyle}>
              キャラクターの共通土台をまとめる画面です。新規定義追加や JSON 生成はここでは行いません。
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={summaryChipStyle(true)}>共通土台</div>
            <div style={summaryChipStyle(false)}>詳細追加は他画面</div>
          </div>
        </header>

        <section style={summaryCardStyle}>
          <strong style={{ fontSize: "15px" }}>この画面の役割</strong>
          <span style={pageTextStyle}>
            VTuner 名、人格の土台、話し方、音声、見た目、吹き出し、反応カテゴリの ON / OFF をまとめます。
            Detailed Rules の正式追加や AI / JSON Studio の生成操作はここへ混ぜません。
          </span>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 360px",
            gap: "16px",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: "16px" }}>
            <SettingsSection
              title="基本プロフィール"
              description="共通土台として使う呼び方と基本プロフィールです。"
            >
              <FieldGrid columns={2}>
                <Field label="VTuner名">
                  <input style={inputStyle} value={vtunerName} onChange={(event) => setVtunerName(event.target.value)} />
                </Field>
                <Field label="一人称">
                  <input style={inputStyle} value={firstPerson} onChange={(event) => setFirstPerson(event.target.value)} />
                </Field>
                <Field label="視聴者の呼び方">
                  <input style={inputStyle} value={viewerCall} onChange={(event) => setViewerCall(event.target.value)} />
                </Field>
                <Field label="配信者の呼び方">
                  <input style={inputStyle} value={streamerCall} onChange={(event) => setStreamerCall(event.target.value)} />
                </Field>
                <Field label="キャラプロフィール" fullWidth>
                  <textarea
                    style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                    value={profileSummary}
                    onChange={(event) => setProfileSummary(event.target.value)}
                  />
                </Field>
              </FieldGrid>
            </SettingsSection>

            <SettingsSection
              title="基本性格と方針"
              description="ここは共通土台の人格層です。新しい定義追加の主操作は持ち込みません。"
            >
              <FieldGrid columns={2}>
                <Field label="基本性格">
                  <textarea
                    style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                    value={personaSummary}
                    onChange={(event) => setPersonaSummary(event.target.value)}
                  />
                </Field>
                <Field label="視聴者向け方針">
                  <select style={inputStyle} value={viewerPolicy} onChange={(event) => setViewerPolicy(event.target.value)}>
                    <option>礼儀正しく、常連には少しやわらかく接する</option>
                    <option>親しみやすく、距離を近めにする</option>
                    <option>少し観察者寄りに、落ち着いて接する</option>
                  </select>
                </Field>
                <Field label="配信者向け方針">
                  <select style={inputStyle} value={streamerPolicy} onChange={(event) => setStreamerPolicy(event.target.value)}>
                    <option>困っているときは助け舟を出す</option>
                    <option>邪魔しない範囲で静かに補助する</option>
                    <option>少し甘めに支える</option>
                  </select>
                </Field>
              </FieldGrid>
              <InlineNotice>
                新しい人格定義の正式追加は Detailed Rules、外部 AI での生成と採用は AI / JSON Studio の責務です。
              </InlineNotice>
            </SettingsSection>

            <SettingsSection
              title="話し方"
              description="口調、語尾、好きな言い回し、禁止表現を共通土台として整理します。"
            >
              <FieldGrid columns={2}>
                <Field label="口調">
                  <select style={inputStyle} value={toneLabel} onChange={(event) => setToneLabel(event.target.value)}>
                    <option>丁寧で落ち着いた口調</option>
                    <option>やわらかく親しみやすい口調</option>
                    <option>知的で淡々とした口調</option>
                  </select>
                </Field>
                <Field label="語尾">
                  <select style={inputStyle} value={endingStyle} onChange={(event) => setEndingStyle(event.target.value)}>
                    <option>〜ですね / 〜ですよ</option>
                    <option>〜だね / 〜だよ</option>
                    <option>特に固定しない</option>
                  </select>
                </Field>
                <Field label="好きな言い回し">
                  <input
                    style={inputStyle}
                    value={favoritePhrases}
                    onChange={(event) => setFavoritePhrases(event.target.value)}
                  />
                </Field>
                <Field label="禁止表現">
                  <input
                    style={inputStyle}
                    value={bannedExpressions}
                    onChange={(event) => setBannedExpressions(event.target.value)}
                  />
                </Field>
              </FieldGrid>
            </SettingsSection>

            <SettingsSection title="音声設定" description="音声の骨格だけを置きます。再生処理や保存処理はまだ入れません。">
              <FieldGrid columns={2}>
                <Field label="音声を使う">
                  <select style={inputStyle} value={voiceEnabled} onChange={(event) => setVoiceEnabled(event.target.value)}>
                    <option>使う</option>
                    <option>使わない</option>
                  </select>
                </Field>
                <Field label="声の種類">
                  <select style={inputStyle} value={voiceType} onChange={(event) => setVoiceType(event.target.value)}>
                    <option>落ち着いた女性声</option>
                    <option>やわらかい女性声</option>
                    <option>中性的な声</option>
                  </select>
                </Field>
                <Field label="話すスピード">
                  <select style={inputStyle} value={voiceSpeed} onChange={(event) => setVoiceSpeed(event.target.value)}>
                    <option>ゆっくり</option>
                    <option>標準</option>
                    <option>やや速い</option>
                  </select>
                </Field>
                <Field label={`音量 ${voiceVolume}%`}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceVolume}
                    onChange={(event) => setVoiceVolume(Number(event.target.value))}
                  />
                </Field>
              </FieldGrid>
            </SettingsSection>

            <SettingsSection title="見た目設定" description="正式登録する front / side 表示の土台だけを置きます。">
              <FieldGrid columns={3}>
                <Field label="既定の向き">
                  <select
                    style={inputStyle}
                    value={defaultFacing}
                    onChange={(event) => setDefaultFacing(event.target.value as "front" | "side")}
                  >
                    <option value="front">front</option>
                    <option value="side">side</option>
                  </select>
                </Field>
                <Field label="mirror の扱い">
                  <select
                    style={inputStyle}
                    value={mirrorEnabled ? "on" : "off"}
                    onChange={(event) => setMirrorEnabled(event.target.value === "on")}
                  >
                    <option value="on">使用する</option>
                    <option value="off">使用しない</option>
                  </select>
                </Field>
                <Field label="表示サイズ">
                  <select style={inputStyle} value={displaySize} onChange={(event) => setDisplaySize(event.target.value)}>
                    <option>小さめ</option>
                    <option>標準</option>
                    <option>やや大きめ</option>
                  </select>
                </Field>
              </FieldGrid>
              <AssetGrid />
            </SettingsSection>

            <SettingsSection title="吹き出し設定" description="吹き出しと文字の土台だけをここで整えます。">
              <FieldGrid columns={2}>
                <Field label="吹き出しを使う">
                  <select style={inputStyle} value={bubbleEnabled} onChange={(event) => setBubbleEnabled(event.target.value)}>
                    <option>使う</option>
                    <option>使わない</option>
                  </select>
                </Field>
                <Field label="吹き出しの形">
                  <select style={inputStyle} value={bubbleShape} onChange={(event) => setBubbleShape(event.target.value)}>
                    <option>角丸</option>
                    <option>丸み強め</option>
                    <option>四角寄り</option>
                  </select>
                </Field>
                <Field label="フォント">
                  <select style={inputStyle} value={bubbleFont} onChange={(event) => setBubbleFont(event.target.value)}>
                    <option>読みやすいゴシック体</option>
                    <option>やわらかい丸ゴシック</option>
                    <option>少し上品な明朝寄り</option>
                  </select>
                </Field>
                <Field label="文字色">
                  <ColorChoices
                    value={bubbleTextColor}
                    onChange={setBubbleTextColor}
                    colors={["#111827", "#374151", "#1E3A8A", "#FFFFFF"]}
                  />
                </Field>
                <Field label="背景色">
                  <ColorChoices
                    value={bubbleBackgroundColor}
                    onChange={setBubbleBackgroundColor}
                    colors={["#FFFFFF", "#F3F4F6", "#EFF6FF", "#FDF2F8", "#FFF7ED"]}
                  />
                </Field>
              </FieldGrid>
            </SettingsSection>

            <SettingsSection title="反応カテゴリ ON / OFF" description="採用済みカテゴリの有効 / 無効だけをここで切り替えます。">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                }}
              >
                {categoryMeta.map((item) => {
                  const isOn = categoryStates[item.key];

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setCategoryStates((current) => ({ ...current, [item.key]: !current[item.key] }))
                      }
                      style={{
                        ...toggleCardStyle,
                        borderColor: isOn ? "#8FCFD3" : "#BFDCDD",
                        background: isOn ? "#F7FCFC" : "#FFFFFF",
                      }}
                    >
                      <strong>{item.label}</strong>
                      <span style={pageTextStyle}>{item.description}</span>
                      <span style={statusChipStyle(isOn)}>{isOn ? "有効" : "無効"}</span>
                    </button>
                  );
                })}
              </div>
              <InlineNotice>
                新しいカテゴリの正式追加は Detailed Rules または AI / JSON Studio 側で扱い、ここでは採用済みカテゴリの ON / OFF に留めます。
              </InlineNotice>
            </SettingsSection>
          </div>

          <aside style={{ display: "grid", gap: "16px", position: "sticky", top: "24px" }}>
            <div style={sideCardStyle}>
              <h2 style={{ ...cardTitleStyle, fontSize: "18px" }}>現在のキャラクター表示</h2>
              <div
                style={{
                  border: "1px solid #BFDCDD",
                  borderRadius: "18px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(234,247,247,0.92)), repeating-linear-gradient(45deg, rgba(74,174,182,0.03), rgba(74,174,182,0.03) 10px, rgba(74,174,182,0.06) 10px, rgba(74,174,182,0.06) 20px)",
                  padding: "14px",
                }}
              >
                <CharacterStage
                  transparent_background
                  show_preview_overlay_label={false}
                  stage_label="Character Preview"
                  {...(previewSubtitle ? { subtitle: previewSubtitle } : {})}
                  character={{
                    character_name: vtunerName,
                    orientation: defaultFacing,
                    mirror: mirrorEnabled,
                    position_x: 70,
                    position_y: 66,
                    scale_percent: displaySize === "やや大きめ" ? 92 : displaySize === "小さめ" ? 72 : 82,
                  }}
                  bubble={{
                    text: `${firstPerson}は ${viewerCall} をやわらかく迎えます。`,
                    visible: bubbleEnabled === "使う",
                    text_color: bubbleTextColor,
                    background_color: bubbleBackgroundColor,
                    position_x: 30,
                    position_y: 50,
                    width_percent: 38,
                  }}
                />
              </div>
            </div>

            <div style={sideCardStyle}>
              <h2 style={{ ...cardTitleStyle, fontSize: "18px" }}>現在の設定要約</h2>
              <div style={{ display: "grid", gap: "10px" }}>
                <SummaryRow label="VTuner名" value={vtunerName} />
                <SummaryRow label="一人称" value={firstPerson} />
                <SummaryRow label="視聴者の呼び方" value={viewerCall} />
                <SummaryRow label="配信者の呼び方" value={streamerCall} />
                <SummaryRow label="基本性格" value={personaSummary} />
                <SummaryRow label="口調" value={`${toneLabel} / ${endingStyle}`} />
                <SummaryRow label="音声" value={`${voiceEnabled} / ${voiceType} / ${voiceSpeed}`} />
                <SummaryRow label="吹き出し" value={`${bubbleEnabled} / ${bubbleShape} / ${bubbleFont}`} />
              </div>
            </div>

            <div style={sideCardStyle}>
              <h2 style={{ ...cardTitleStyle, fontSize: "18px" }}>次に触る場所</h2>
              <InlineNotice>
                いつ、誰に、何を返すかの正式ルール追加は Detailed Rules、外部 AI を使った生成と JSON 検証は AI / JSON Studio で扱います。
              </InlineNotice>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section style={cardStyle}>
      <div style={sectionHeaderStyle}>
        <div style={{ display: "grid", gap: "6px" }}>
          <h2 style={cardTitleStyle}>{title}</h2>
          <p style={pageTextStyle}>{description}</p>
        </div>
      </div>
      <div style={{ padding: "16px 18px", display: "grid", gap: "14px" }}>{children}</div>
    </section>
  );
}

function FieldGrid({
  columns,
  children,
}: {
  columns: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "14px",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  fullWidth = false,
}: {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: "6px",
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      <span style={fieldLabelStyle}>{label}</span>
      {children}
    </label>
  );
}

function InlineNotice({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #BFDCDD",
        borderRadius: "14px",
        background: "linear-gradient(180deg, #F7FCFC, #EAF7F7)",
        padding: "13px 14px",
        color: "#5F747A",
        lineHeight: 1.7,
        fontSize: "12px",
      }}
    >
      {children}
    </div>
  );
}

function ColorChoices({
  colors,
  value,
  onChange,
}: {
  colors: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={color}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "999px",
            border: `2px solid ${value === color ? "#8FCFD3" : "#BFDCDD"}`,
            background: color,
            boxShadow: value === color ? "0 0 0 3px rgba(127, 207, 212, 0.18)" : "none",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}

function AssetGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "14px",
      }}
    >
      {["front 画像", "side 画像"].map((label) => (
        <div
          key={label}
          style={{
            border: "1px dashed #BFDCDD",
            borderRadius: "16px",
            background: "#F7FCFC",
            padding: "16px",
            minHeight: "180px",
            display: "grid",
            gap: "12px",
          }}
        >
          <strong>{label}</strong>
          <div
            style={{
              flex: 1,
              minHeight: "110px",
              border: "2px dashed #8FCFD3",
              borderRadius: "16px",
              background: "linear-gradient(180deg, #F7FCFC, #EAF7F7)",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              color: "#357F91",
              lineHeight: 1.6,
            }}
          >
            画像の置き場だけを表示
            <br />
            asset 読込本実装は後続 Phase
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "14px",
        paddingBottom: "10px",
        borderBottom: "1px solid rgba(191, 220, 221, 0.55)",
      }}
    >
      <span style={{ ...fieldLabelStyle, fontSize: "13px" }}>{label}</span>
      <span style={{ textAlign: "right", lineHeight: 1.6 }}>{value}</span>
    </div>
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

const cardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "20px",
  background: "#FFFFFF",
  boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
} as const;

const sectionHeaderStyle = {
  padding: "16px 18px",
  borderBottom: "1px solid #BFDCDD",
  background: "#F7FCFC",
} as const;

const sideCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "20px",
  background: "#FFFFFF",
  boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
  padding: "16px 18px",
  display: "grid",
  gap: "12px",
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

const cardTitleStyle = {
  margin: 0,
  fontSize: "20px",
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

const toggleCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "16px",
  padding: "14px",
  display: "grid",
  gap: "10px",
  textAlign: "left",
  cursor: "pointer",
} as const;

function statusChipStyle(active: boolean) {
  return {
    width: "fit-content",
    padding: "6px 10px",
    borderRadius: "999px",
    background: active ? "#E4F5EC" : "#F3F4F6",
    color: active ? "#3F8A63" : "#5F747A",
    fontSize: "12px",
    fontWeight: 800,
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
