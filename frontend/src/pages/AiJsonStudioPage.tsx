import { useMemo, useState } from "react";
import type {
  AiJsonImportQueueItem,
  PersonaJsonV1Draft,
  ReplyTemplatesJson,
} from "../../../schemas";
import {
  validatePersonaJsonV1Draft,
  validateReplyTemplatesJson,
  validReplyTemplatesJsonSample,
  invalidReplyTemplatesJsonSample,
} from "../../../schemas";

type TargetTab =
  | "人格"
  | "返答テンプレートJSON"
  | "返答カテゴリ"
  | "返答集"
  | "条件イベント"
  | "カテゴリ定義"
  | "エラー修正";

type WorkStartSource =
  | "new"
  | "review_candidate"
  | "existing_base"
  | "history"
  | "my_preset"
  | "ideal_schema";

interface HistoryItem {
  id: string;
  name: string;
  target: TargetTab;
  status: "採用済み" | "修正待ち" | "生成のみ";
  timeLabel: string;
  revisionCount: number;
  presetPromoted?: boolean;
}

interface RegisterAiJsonImportQueueDraftInput {
  generationTarget: AiJsonImportQueueItem["generation_target"];
  sourceNaturalText: string;
  promptText: string;
  returnedJson: unknown;
  validationErrors: string[];
}

const targetTabs: TargetTab[] = [
  "人格",
  "返答テンプレートJSON",
  "返答カテゴリ",
  "返答集",
  "条件イベント",
  "カテゴリ定義",
  "エラー修正",
];

const workStartSources: Array<{ key: WorkStartSource; label: string }> = [
  { key: "new", label: "新規作成" },
  { key: "review_candidate", label: "Review候補から開始" },
  { key: "existing_base", label: "既存ベース" },
  { key: "history", label: "履歴" },
  { key: "my_preset", label: "マイプリセット" },
  { key: "ideal_schema", label: "理想スキーマから開始" },
];

const personaRequiredKeys = [
  "schema_version",
  "preset_name",
  "persona_core",
  "audience_modes",
  "speech_style",
  "safety_rules",
  "meta",
] as const;

const personaGuideItems = [
  "schema_version は persona_json_v1_draft 固定",
  "top-level / nested ともに想定外キーを含めない",
  "meta.created_from は必須 enum",
  "favorite_phrases は空配列不可",
  "JSON 以外の説明文を混ぜない",
];

const personaSampleObject = {
  schema_version: "persona_json_v1_draft",
  preset_name: "クール秘書_補助寄り",
  persona_core: {
    archetype: "クール秘書",
    summary: "少しクールだが、身内にはやわらかい補助役寄りの人格。",
    traits: ["落ち着いている", "補助役寄り", "身内にはやわらかい"],
    emotional_temperature: "やや低め",
    social_distance: "近すぎず遠すぎない",
  },
  audience_modes: {
    viewer: {
      stance: "礼儀正しく受ける",
      tone: "丁寧で落ち着いた",
      distance: "やや控えめ",
      behavior_notes: ["常連には少しやわらかくする", "でしゃばりすぎない"],
    },
    streamer: {
      stance: "困っているときは支える",
      tone: "少し近いが静かめ",
      distance: "やや近め",
      behavior_notes: ["補助役として動く", "邪魔しない範囲で助け舟を出す"],
    },
  },
  speech_style: {
    tone_label: "落ち着いた",
    sentence_ending_style: "〜ですね / 〜ですよ",
    favorite_phrases: ["なるほどですね", "ひとまず見てみましょう"],
    avoid_phrases: ["強い煽り", "乱暴すぎる言い回し"],
    speaking_rules: ["断定しすぎない", "補助役として短くまとめる"],
  },
  safety_rules: {
    banned_expressions: ["露骨な暴言"],
    banned_attitudes: ["高圧的すぎる態度", "過度に攻撃的な態度"],
    notes: ["視聴者を不用意に突き放さない"],
  },
  meta: {
    created_from: "ideal_schema",
    reference_character_note: "クール秘書寄り",
    author_note: "人格タブの見本用",
  },
} as const;

const provisionalJsonByTarget: Record<Exclude<TargetTab, "人格" | "返答テンプレートJSON">, string> = {
  "返答カテゴリ": `{
  "draft_note": "返答カテゴリの JSON 契約は暫定です",
  "category_name": "挨拶カテゴリ",
  "description": "初回の挨拶や歓迎向け",
  "direction": "暫定見本"
}`,
  "返答集": `{
  "draft_note": "返答集の JSON 契約は暫定です",
  "target_category": "挨拶",
  "reply_candidates": ["こんばんは", "来てくれてありがとう"]
}`,
  "条件イベント": `{
  "draft_note": "条件イベントの JSON 契約は暫定です",
  "event_type": "無コメント",
  "condition_value": 120
}`,
  "カテゴリ定義": `{
  "draft_note": "カテゴリ定義の JSON 契約は暫定です",
  "category_name": "機材トーク",
  "difference_from_existing": "質問カテゴリとの差を補助的に説明"
}`,
  "エラー修正": `{
  "draft_note": "エラー修正の JSON 契約は暫定です",
  "error_summary": "不足キーを補う",
  "retry_direction": "JSONのみを返す"
}`,
};

const historyItems: HistoryItem[] = [
  {
    id: "h1",
    name: "クール秘書_補助寄り",
    target: "人格",
    status: "採用済み",
    timeLabel: "今日 18:42",
    revisionCount: 1,
    presetPromoted: true,
  },
  {
    id: "h2",
    name: "挨拶カテゴリ_やわらかめ",
    target: "返答カテゴリ",
    status: "修正待ち",
    timeLabel: "今日 17:10",
    revisionCount: 2,
  },
  {
    id: "h3",
    name: "無コメント120秒_話題振り",
    target: "条件イベント",
    status: "採用済み",
    timeLabel: "昨日 23:18",
    revisionCount: 0,
  },
];

export function AiJsonStudioPage({
  onRegisterAiJsonImportQueueDraft,
  onAdoptImportQueueItem,
  onDiscardImportQueueItem,
  aiJsonImportQueueItems,
}: {
  onRegisterAiJsonImportQueueDraft?: (
    input: RegisterAiJsonImportQueueDraftInput,
  ) => AiJsonImportQueueItem;
  onAdoptImportQueueItem?: (
    queueItemId: string,
  ) => Promise<{ ok: boolean; message: string }>;
  onDiscardImportQueueItem?: (queueItemId: string) => void;
  aiJsonImportQueueItems: AiJsonImportQueueItem[];
}) {
  const [activeTarget, setActiveTarget] = useState<TargetTab>("人格");
  const [workStartSource, setWorkStartSource] = useState<WorkStartSource>("new");
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [simpleInput, setSimpleInput] = useState("少しクールで、でも身内にはやわらかい補助役寄りにしたい");
  const [detailInput, setDetailInput] = useState(
    "視聴者には丁寧、配信者には少し近い。強い煽りや露骨な暴言は禁止。口調は落ち着いた方向。",
  );
  const [relatedPreset, setRelatedPreset] = useState("既存プリセット: ヴィヴィ基本人格");
  const [jsonText, setJsonText] = useState(JSON.stringify(personaSampleObject, null, 2));
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validatedPersona, setValidatedPersona] = useState<PersonaJsonV1Draft | null>(null);
  const [validatedReplyTemplates, setValidatedReplyTemplates] =
    useState<ReplyTemplatesJson | null>(null);
  const [importQueueMessage, setImportQueueMessage] = useState(
    "AI JSON Import Queue への登録は未実行です。",
  );

  const promptText = useMemo(() => {
    const header =
      activeTarget === "人格"
        ? "VTuner 用の人格定義 JSON を作ってください。"
        : activeTarget === "返答テンプレートJSON"
          ? "VTuner 用の replyTemplates JSON を作ってください。"
        : `${activeTarget} 用の JSON 草案を作ってください。`;

    const startSourceLine = `meta.created_from または作業開始元は ${workStartSource} を基準にしてください。`;

    if (activeTarget === "人格") {
      return [
        header,
        "",
        "- 少しクールで、でも身内にはやわらかい",
        "- 視聴者には丁寧、配信者には少し近い",
        "- 強い煽り、露骨な暴言は禁止",
        "- 補助役寄りで、でしゃばりすぎない",
        "- 口調は落ち着いた方向",
        "- 必須キーを省略しない",
        "- top-level は schema_version / preset_name / persona_core / audience_modes / speech_style / safety_rules / meta を使う",
        "- JSON 以外の説明文を含めない",
        startSourceLine,
      ].join("\n");
    }

    if (activeTarget === "返答テンプレートJSON") {
      return [
        header,
        "",
        "- ルートは reply_templates のみを使う",
        "- category は greeting / compliment / question / empathy のみ使う",
        "- category 内では short / normal / long をすべて含める",
        "- 各 length は string array にする",
        "- 空配列と空文字を入れない",
        "- JSON 以外の説明文を含めない",
        startSourceLine,
      ].join("\n");
    }

    return [
      header,
      "",
      `- 生成対象: ${activeTarget}`,
      "- この対象の JSON 契約はまだ暫定扱いです",
      "- 想定用途に沿った安全な草案にする",
      "- 余計な説明文をつけず JSON のみ返す",
      startSourceLine,
    ].join("\n");
  }, [activeTarget, workStartSource]);

  const requiredItems =
    activeTarget === "人格"
      ? personaRequiredKeys
      : activeTarget === "返答テンプレートJSON"
        ? [
            "reply_templates",
            "greeting / compliment / question / empathy（部分定義可）",
            "short / normal / long（category 内で全必須）",
          ]
      : ["この生成対象の JSON 契約は暫定です", "必須キー表示は後続 Phase で強化"];

  const guideItems =
    activeTarget === "人格"
      ? personaGuideItems
      : activeTarget === "返答テンプレートJSON"
        ? [
            "unknown key / unknown category / unknown length は拒否",
            "string array のみ許可（non-array 不可）",
            "trim 後空文字・長文制約・空配列制約を fail-close で検証",
          ]
      : ["このタブは暫定対象", "人格以外の契約はまだ厳格確定していない", "UI 骨格としてのみ表示"];

  function insertSample() {
    if (activeTarget === "人格") {
      setJsonText(JSON.stringify(personaSampleObject, null, 2));
      return;
    }

    if (activeTarget === "返答テンプレートJSON") {
      setJsonText(JSON.stringify(validReplyTemplatesJsonSample, null, 2));
      return;
    }

    setJsonText(provisionalJsonByTarget[activeTarget]);
  }

  function insertInvalidReplyTemplatesSample() {
    if (activeTarget !== "返答テンプレートJSON") {
      return;
    }

    setJsonText(JSON.stringify(invalidReplyTemplatesJsonSample, null, 2));
  }

  function clearToIdealSchema() {
    if (activeTarget === "人格") {
      setJsonText(
        JSON.stringify(
          {
            schema_version: "persona_json_v1_draft",
            preset_name: "",
            persona_core: {
              archetype: "",
              summary: "",
              traits: [""],
              emotional_temperature: "",
              social_distance: "",
            },
            audience_modes: {
              viewer: {
                stance: "",
                tone: "",
                distance: "",
                behavior_notes: [],
              },
              streamer: {
                stance: "",
                tone: "",
                distance: "",
                behavior_notes: [],
              },
            },
            speech_style: {
              tone_label: "",
              sentence_ending_style: "",
              favorite_phrases: [""],
              avoid_phrases: [],
              speaking_rules: [],
            },
            safety_rules: {
              banned_expressions: [],
              banned_attitudes: [],
              notes: [],
            },
            meta: {
              created_from: workStartSource,
            },
          },
          null,
          2,
        ),
      );
      return;
    }

    if (activeTarget === "返答テンプレートJSON") {
      setJsonText(JSON.stringify({ reply_templates: {} }, null, 2));
      return;
    }

    setJsonText(`{\n  "draft_note": "${activeTarget} の理想スキーマ骨格は後続で強化"\n}`);
  }

  function runValidation() {
    if (activeTarget !== "人格" && activeTarget !== "返答テンプレートJSON") {
      setValidationErrors([
        "この生成対象の厳格検証は後続 Phase で扱います。現在は人格 JSON と返答テンプレート JSON を優先しています。",
      ]);
      setValidatedPersona(null);
      setValidatedReplyTemplates(null);
      return;
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch {
      setValidationErrors(["root: JSON parse failed"]);
      setValidatedPersona(null);
      setValidatedReplyTemplates(null);
      return;
    }

    if (activeTarget === "人格") {
      const result = validatePersonaJsonV1Draft(parsedJson);
      if (!result.ok) {
        setValidationErrors(result.errors);
        setValidatedPersona(null);
        setValidatedReplyTemplates(null);
        return;
      }

      setValidationErrors([]);
      setValidatedPersona(result.value);
      setValidatedReplyTemplates(null);
      return;
    }

    const result = validateReplyTemplatesJson(parsedJson);
    if (!result.ok) {
      setValidationErrors(result.errors);
      setValidatedPersona(null);
      setValidatedReplyTemplates(null);
      return;
    }

    setValidationErrors([]);
    setValidatedPersona(null);
    setValidatedReplyTemplates(result.parsed ?? null);
  }

  function createRepairPrompt() {
    if (validationErrors.length === 0) {
      return `前回の JSON は人格契約に整合しています。必要なら差分だけ最小変更で返してください。\n\n- JSON だけを返す`;
    }

    return `前回の JSON を次の点だけ直してください。\n\n${validationErrors
      .map((error) => `- ${error}`)
      .join("\n")}\n- それ以外の構造はなるべく変えない\n- JSON だけを返す`;
  }

  function registerImportQueueDraft() {
    if (activeTarget !== "人格" && activeTarget !== "返答テンプレートJSON") {
      setImportQueueMessage(
        "この target はまだ Import Queue 登録に対応していません。",
      );
      return;
    }

    if (!validationOk) {
      setImportQueueMessage(
        "validation_ok=true のときだけ Import Queue へ登録できます。先に検証結果を確認してください。",
      );
      return;
    }

    if (!onRegisterAiJsonImportQueueDraft) {
      setImportQueueMessage(
        "AI JSON Import Queue の登録先が未接続です。App 側の接続準備が必要です。",
      );
      return;
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch {
      setImportQueueMessage(
        "JSON parse に失敗したため、Import Queue へ登録できませんでした。",
      );
      return;
    }

    const queued = onRegisterAiJsonImportQueueDraft({
      generationTarget:
        activeTarget === "返答テンプレートJSON"
          ? "reply_templates"
          : "persona",
      sourceNaturalText: `${simpleInput}\n${detailInput}`,
      promptText,
      returnedJson: parsedJson,
      validationErrors,
    });

    setImportQueueMessage(
      `AI JSON Import Queue へ下書き登録しました。status=${queued.status} / id=${queued.id}`,
    );
  }

  const validationOk =
    activeTarget === "人格"
      ? validatedPersona !== null && validationErrors.length === 0
      : activeTarget === "返答テンプレートJSON"
        ? validatedReplyTemplates !== null && validationErrors.length === 0
        : false;
  const validationTargetLabel =
    activeTarget === "人格"
      ? "人格 JSON"
      : activeTarget === "返答テンプレートJSON"
        ? "返答テンプレート JSON"
        : `${activeTarget}（暫定）`;
  const parsedReplyTemplateCategories = validatedReplyTemplates
    ? Object.keys(validatedReplyTemplates.reply_templates)
    : [];
  const validatedQueueCount = aiJsonImportQueueItems.filter(
    (item) => item.validation_ok,
  ).length;
  const failedQueueCount = aiJsonImportQueueItems.length - validatedQueueCount;

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
            <div style={pageBadgeStyle}>AI / JSON Studio Skeleton</div>
            <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800 }}>AI / JSON Studio</h1>
            <p style={pageTextStyle}>
              外部ブラウザ AI 用の支援画面です。生成、検証、再修正、採用を扱い、アプリ内部に AI は持ち込みません。
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={summaryChipStyle(true)}>外部AI前提</div>
            <div style={summaryChipStyle(false)}>Detailed Rules は正式編集室</div>
          </div>
        </header>

        <section style={summaryCardStyle}>
          <strong style={{ fontSize: "15px" }}>この画面の役割</strong>
          <span style={pageTextStyle}>
            自然文入力から外部 AI 用プロンプトを作り、返ってきた JSON を検証し、必要なら再修正プロンプトを出し、
            良ければ採用して履歴やマイプリセット化へつなげます。
          </span>
        </section>

        <section style={{ display: "grid", gap: "14px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {targetTabs.map((tab) => (
              <button
                key={tab}
                style={targetTabStyle(activeTarget === tab)}
                onClick={() => setActiveTarget(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <section style={sourceCardStyle}>
            <div>
              <h2 style={sectionTitleStyle}>作業開始元</h2>
              <p style={pageTextStyle}>Review を主導線にせず、必要な seed から開始する骨格です。</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {workStartSources.map((source) => (
                <button
                  key={source.key}
                  style={workStartStyle(workStartSource === source.key, source.key === "ideal_schema")}
                  onClick={() => setWorkStartSource(source.key)}
                >
                  {source.label}
                </button>
              ))}
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 560px",
              gap: "16px",
              alignItems: "start",
            }}
          >
            <section style={paneStyle}>
              <div style={paneHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>入力とプロンプト</h2>
                  <p style={pageTextStyle}>左カラムは、外部 AI に渡す前の入力支援です。</p>
                </div>
                <span style={summaryChipStyle(activeTarget === "人格")}>
                  {activeTarget === "人格" ? "人格契約を強反映" : "暫定対象"}
                </span>
              </div>

              <div style={{ padding: "14px", display: "grid", gap: "14px" }}>
                <section style={cardInsetStyle}>
                  <Field label="かんたん入力">
                    <textarea
                      style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
                      value={simpleInput}
                      onChange={(event) => setSimpleInput(event.target.value)}
                    />
                  </Field>
                  <Field label="詳細入力">
                    <textarea
                      style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                      value={detailInput}
                      onChange={(event) => setDetailInput(event.target.value)}
                    />
                  </Field>
                  <Field label="関連プリセット選択">
                    <select style={inputStyle} value={relatedPreset} onChange={(event) => setRelatedPreset(event.target.value)}>
                      <option>既存プリセット: ヴィヴィ基本人格</option>
                      <option>Review候補: 機材トーク周辺</option>
                      <option>履歴: クール秘書_補助寄り</option>
                      <option>マイプリセット: viewer_soft_v1</option>
                    </select>
                  </Field>
                </section>

                <section style={cardInsetStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>外部AI用プロンプト</h3>
                      <p style={{ ...pageTextStyle, fontSize: "12px" }}>
                        基本は折りたたみ。閉じたままでも生成 / コピー / 開くが見えます。
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button style={primaryButtonStyle}>生成</button>
                      <button style={secondaryButtonStyle}>コピー</button>
                      <button style={secondaryButtonStyle} onClick={() => setPromptExpanded((current) => !current)}>
                        {promptExpanded ? "閉じる" : "開く"}
                      </button>
                    </div>
                  </div>

                  <div style={subCardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <strong>要約</strong>
                        <p style={{ ...pageTextStyle, fontSize: "12px" }}>
                          最終更新: たった今 / {activeTarget} / {workStartSources.find((item) => item.key === workStartSource)?.label}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span style={pillStyle("#EAF7F7", "#357F91")}>{activeTarget} 用プロンプト</span>
                        <span style={pillStyle("#E4F5EC", "#3F8A63")}>生成済み</span>
                      </div>
                    </div>

                    {promptExpanded ? (
                      <pre style={codeBoxStyle}>{promptText}</pre>
                    ) : (
                      <div style={inlineNoticeStyle}>
                        折りたたみ中です。外部ブラウザ AI へ渡す文面は「開く」で確認できます。
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </section>

            <aside style={paneStyle}>
              <div style={paneHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>見本 / JSON / 検証</h2>
                  <p style={pageTextStyle}>右カラムは、返ってきた JSON を壊れにくく扱う領域です。</p>
                </div>
              </div>

              <div style={{ padding: "14px", display: "grid", gap: "14px" }}>
                <section style={cardInsetStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>見本と項目ガイド</h3>
                      <p style={{ ...pageTextStyle, fontSize: "12px" }}>
                        {activeTarget === "人格"
                          ? "人格タブは CONFIG_SCHEMA.md の現行契約に合わせます。"
                          : "人格以外は暫定対象として案内だけを出します。"}
                      </p>
                    </div>
                    <span style={summaryChipStyle(activeTarget === "人格")}>
                      {activeTarget === "人格" ? "理想スキーマ前提" : "暫定契約"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
                    <button style={secondaryButtonStyle}>見本を見る</button>
                    <button style={secondaryButtonStyle} onClick={clearToIdealSchema}>
                      空の見本をコピー
                    </button>
                    <button style={secondaryButtonStyle} onClick={insertSample}>
                      サンプルを入れる
                    </button>
                    <button style={secondaryButtonStyle}>必須項目を見る</button>
                    <button style={{ ...secondaryButtonStyle, gridColumn: "1 / -1" }}>項目の説明を見る</button>
                  </div>

                  <div style={subCardBlueStyle}>
                    <p style={miniLabelStyle}>このタブの必須項目</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {requiredItems.map((item) => (
                        <span key={item} style={pillStyle("#F7FCFC", "#5F747A")}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={subCardStyle}>
                    <p style={miniLabelStyle}>項目説明メモ</p>
                    <ul style={guideListStyle}>
                      {guideItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section style={cardInsetStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>JSON 貼り付け欄</h3>
                      <p style={{ ...pageTextStyle, fontSize: "12px" }}>
                        外部ブラウザ AI から返ってきた JSON をここへ貼る骨格です。
                      </p>
                    </div>
                    <span style={pillStyle("#EAF7F7", "#357F91")}>貼って検証</span>
                  </div>
                  <textarea
                    style={{ ...codeTextareaStyle, minHeight: "220px" }}
                    value={jsonText}
                    onChange={(event) => setJsonText(event.target.value)}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button style={secondaryButtonStyle}>JSON を読み込む</button>
                      <button
                        style={coralButtonStyle}
                        onClick={runValidation}
                      >
                        検証する
                      </button>
                      <button
                        style={secondaryButtonStyle}
                        onClick={registerImportQueueDraft}
                        disabled={
                          activeTarget !== "人格" &&
                          activeTarget !== "返答テンプレートJSON"
                        }
                      >
                        Import Queue へ登録（準備）
                      </button>
                      {activeTarget === "返答テンプレートJSON" ? (
                        <button style={secondaryButtonStyle} onClick={insertInvalidReplyTemplatesSample}>
                          invalid sample を入れる
                        </button>
                      ) : null}
                    </div>
                    <span style={{ ...pageTextStyle, fontSize: "12px" }}>
                      {activeTarget === "人格"
                        ? "手で直すより、まず検証して外部 AI へ再依頼する想定です。"
                        : activeTarget === "返答テンプレートJSON"
                          ? "返答テンプレートJSON は検証のみ対応です（Queue 登録は後続）。"
                          : "この対象は暫定表示です。厳格検証は後続 Phase で扱います。"}
                    </span>
                  </div>
                </section>

                <section style={cardInsetStyle}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>検証結果</h3>
                    <p style={{ ...pageTextStyle, fontSize: "12px" }}>不足や不整合があればここに出します。</p>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={pillStyle("#EAF7F7", "#357F91")}>対象: {validationTargetLabel}</span>
                    <span style={pillStyle("#F7FCFC", "#5F747A")}>
                      validation_ok: {validationOk ? "true" : "false"}
                    </span>
                    <span style={pillStyle("#F7FCFC", "#5F747A")}>
                      error_messages: {validationErrors.length}
                    </span>
                  </div>

                  {!validationOk ? (
                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={warningBoxStyle}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={pillStyle("#FFF0D8", "#A96E22")}>不足</span>
                          <strong>人格 JSON に未整合があります</strong>
                        </div>
                        <span style={{ ...pageTextStyle, fontSize: "12px" }}>
                          {activeTarget === "返答テンプレートJSON"
                            ? "replyTemplates JSON の許可構造に合わない項目があります。"
                            : "最小検証の結果、修正が必要な項目があります。"}
                        </span>
                      </div>
                      {validationErrors.length > 0 ? (
                        <div style={errorBoxStyle}>
                          <div style={{ display: "grid", gap: "6px" }}>
                            {validationErrors.slice(0, 5).map((error) => (
                              <span key={error} style={{ ...pageTextStyle, fontSize: "12px" }}>
                                {error}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <div style={infoBoxStyle}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={pillStyle("#DFF3F6", "#357F91")}>注意</span>
                          <strong>
                            {activeTarget === "返答テンプレートJSON"
                              ? "reply_templates root と許可 category / length のみ使います"
                              : "schema_version は persona_json_v1_draft を使います"}
                          </strong>
                        </div>
                        <span style={{ ...pageTextStyle, fontSize: "12px" }}>
                          {activeTarget === "返答テンプレートJSON"
                            ? "unknown key / unknown category / unknown length は fail-close で拒否します。"
                            : "人格タブでは top-level / nested ともに想定外キーを含めません。"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ ...successBoxStyle, gap: "10px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={pillStyle("#E4F5EC", "#3F8A63")}>検証成功</span>
                        <strong>
                          {activeTarget === "返答テンプレートJSON"
                            ? "replyTemplates JSON Contract に整合しています"
                            : "人格 JSON Contract (v1 draft) に整合しています"}
                        </strong>
                      </div>
                      <span style={{ ...pageTextStyle, fontSize: "12px" }}>
                        {activeTarget === "返答テンプレートJSON"
                          ? "Phase 16-2 では検証のみ対応です。Import Queue / 採用導線は後続で扱います。"
                          : "差分要約を確認してから Import Queue / 採用判断へ進める想定です。"}
                      </span>
                      {activeTarget === "返答テンプレートJSON" ? (
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={pillStyle("#F7FCFC", "#5F747A")}>
                            parsed category count: {parsedReplyTemplateCategories.length}
                          </span>
                          <span style={pillStyle("#F7FCFC", "#5F747A")}>
                            parsed categories:{" "}
                            {parsedReplyTemplateCategories.length > 0
                              ? parsedReplyTemplateCategories.join(", ")
                              : "none"}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div style={inlineNoticeStyle}>{importQueueMessage}</div>
                </section>

                <section style={cardInsetStyle}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>再修正プロンプト</h3>
                    <p style={{ ...pageTextStyle, fontSize: "12px" }}>不足や型違いを直してもらうための再依頼文です。</p>
                  </div>
                  <pre style={codeBoxStyle}>{createRepairPrompt()}</pre>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <button style={secondaryButtonStyle}>再修正プロンプトをコピー</button>
                    <span style={{ ...pageTextStyle, fontSize: "12px" }}>そのまま外部ブラウザ AI に渡します。</span>
                  </div>
                </section>

                <section style={cardInsetStyle}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>差分要約</h3>
                    <p style={{ ...pageTextStyle, fontSize: "12px" }}>何が追加 / 変更されるのかを短く見ます。</p>
                  </div>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={subCardStyle}>
                      <p style={miniLabelStyle}>追加</p>
                      <strong>好きな言い回し 3件 / 禁止表現 2件</strong>
                    </div>
                    <div style={subCardBlueStyle}>
                      <p style={miniLabelStyle}>変更</p>
                      <strong>視聴者向け態度を「丁寧寄り」に調整</strong>
                    </div>
                    <div style={subCardCoralStyle}>
                      <p style={miniLabelStyle}>採用後の位置</p>
                      <strong>採用後は Detailed Rules で正式編集できます</strong>
                    </div>
                  </div>
                </section>

                <section style={cardInsetStyle}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                      AI JSON Import Queue（前段）
                    </h3>
                    <p style={{ ...pageTextStyle, fontSize: "12px" }}>
                      ここは Adopted Changes 接続前の保管レーンです。Review Patch Queue とは別導線で、混ぜずに扱います。
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={pillStyle("#EAF7F7", "#357F91")}>AI JSON Import Queue</span>
                    <span style={pillStyle("#FFF0D8", "#A96E22")}>
                      validation_failed: {failedQueueCount}
                    </span>
                    <span style={pillStyle("#E4F5EC", "#3F8A63")}>
                      validated: {validatedQueueCount}
                    </span>
                  </div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {aiJsonImportQueueItems.length === 0 ? (
                      <div style={subCardStyle}>
                        <span style={pageTextStyle}>
                          まだ queue 登録はありません。検証後に「Import Queue へ登録（準備）」を実行してください。
                        </span>
                      </div>
                    ) : (
                      aiJsonImportQueueItems.slice(0, 5).map((item) => (
                        <article key={item.id} style={subCardStyle}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "8px",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <strong>{toGenerationTargetLabel(item.generation_target)}</strong>
                            <span style={queueStatusPillStyle(item)}>
                              {item.status}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <span style={pillStyle("#F7FCFC", "#5F747A")}>
                              validation_ok: {item.validation_ok ? "true" : "false"}
                            </span>
                            <span style={pillStyle("#F7FCFC", "#5F747A")}>
                              error_messages: {item.error_messages.length}
                            </span>
                          </div>
                          <span style={{ ...pageTextStyle, fontSize: "12px" }}>
                            source: {item.source_natural_text.slice(0, 48)}
                            {item.source_natural_text.length > 48 ? "..." : ""}
                          </span>
                          {item.error_messages.length > 0 ? (
                            <div style={errorBoxStyle}>
                              <strong style={{ fontSize: "12px" }}>
                                validation failed の主な理由
                              </strong>
                              <div style={{ display: "grid", gap: "4px" }}>
                                {item.error_messages.slice(0, 2).map((error) => (
                                  <span key={`${item.id}-${error}`} style={{ ...pageTextStyle, fontSize: "12px" }}>
                                    {error}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : null}
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              style={primaryButtonStyle}
                              onClick={async () => {
                                if (!onAdoptImportQueueItem) {
                                  setImportQueueMessage(
                                    "採用導線が未接続です。App 側の接続準備が必要です。",
                                  );
                                  return;
                                }
                                if (
                                  item.generation_target !== "persona" &&
                                  item.generation_target !== "reply_templates"
                                ) {
                                  setImportQueueMessage(
                                    `id=${item.id} は target=${item.generation_target} のため採用対象外です。`,
                                  );
                                  return;
                                }
                                if (!item.validation_ok) {
                                  setImportQueueMessage(
                                    `id=${item.id} は validation_failed のため採用できません。先に再修正してください。`,
                                  );
                                  return;
                                }
                                if (item.status === "adopted") {
                                  setImportQueueMessage(
                                    `id=${item.id} はすでに採用済みです。`,
                                  );
                                  return;
                                }
                                if (item.status === "discarded") {
                                  setImportQueueMessage(
                                    `id=${item.id} は discarded のため再採用できません。`,
                                  );
                                  return;
                                }
                                const result = await onAdoptImportQueueItem(item.id);
                                setImportQueueMessage(result.message);
                              }}
                              disabled={
                                !item.validation_ok ||
                                item.status === "adopted" ||
                                item.status === "discarded" ||
                                (item.generation_target !== "persona" &&
                                  item.generation_target !== "reply_templates")
                              }
                            >
                              {item.generation_target === "reply_templates"
                                ? "Adopted Reply Templates へ採用"
                                : "Adopted Changes へ採用"}
                            </button>
                            <button
                              style={secondaryButtonStyle}
                              onClick={() => {
                                if (!onDiscardImportQueueItem) {
                                  setImportQueueMessage(
                                    "discard 導線が未接続です。App 側の接続準備が必要です。",
                                  );
                                  return;
                                }
                                if (item.status === "adopted") {
                                  setImportQueueMessage(
                                    `id=${item.id} は採用済みのため discarded へ変更しません。`,
                                  );
                                  return;
                                }
                                if (item.status === "discarded") {
                                  setImportQueueMessage(
                                    `id=${item.id} はすでに discarded です。`,
                                  );
                                  return;
                                }
                                onDiscardImportQueueItem(item.id);
                                setImportQueueMessage(
                                  `id=${item.id} を discarded に更新しました。`,
                                );
                              }}
                              disabled={item.status === "adopted" || item.status === "discarded"}
                            >
                              不採用（discarded）
                            </button>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>

                <section style={cardInsetStyle}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>採用</h3>
                    <p style={{ ...pageTextStyle, fontSize: "12px" }}>良ければ基本本採用へ進む骨格です。</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
                    <button style={primaryButtonStyle}>基本本採用にする</button>
                    <button style={secondaryButtonStyle}>下書き保存</button>
                  </div>
                  <div style={subCardBlueStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <strong>マイプリセット化</strong>
                        <p style={{ ...pageTextStyle, fontSize: "12px" }}>
                          検証成功 + 採用済み + 名前付け済みなら保存できます。
                        </p>
                      </div>
                      <span style={pillStyle("#E4F5EC", "#3F8A63")}>条件達成</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <input style={{ ...inputStyle, flex: 1 }} defaultValue="クール秘書_補助寄り" />
                      <button style={secondaryDarkButtonStyle}>マイプリセット化</button>
                    </div>
                  </div>
                </section>

                <section style={cardInsetStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>履歴</h3>
                      <p style={{ ...pageTextStyle, fontSize: "12px" }}>最近の作業を軽く確認します。</p>
                    </div>
                    <span style={summaryChipStyle(true)}>最近 3件</span>
                  </div>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {historyItems.map((item) => (
                      <article key={item.id} style={subCardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                          <div>
                            <strong>{item.name}</strong>
                            <p style={{ ...pageTextStyle, fontSize: "12px" }}>
                              {item.target} / {item.timeLabel}
                            </p>
                          </div>
                          <span style={historyStatusStyle(item.status)}>{item.status}</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={pillStyle("#F7FCFC", "#5F747A")}>修正 {item.revisionCount}回</span>
                          {item.presetPromoted ? (
                            <span style={pillStyle("#E4F5EC", "#3F8A63")}>マイプリセット化済み</span>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </section>
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

const sourceCardStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "20px",
  background: "#FFFFFF",
  boxShadow: "0 12px 28px rgba(47, 62, 70, 0.08)",
  padding: "16px 18px",
  display: "grid",
  gap: "12px",
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

const subCardBlueStyle = {
  ...subCardStyle,
  background: "#EAF3F8",
} as const;

const subCardCoralStyle = {
  ...subCardStyle,
  background: "#FFF0EE",
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

const sectionTitleStyle = {
  margin: 0,
  fontSize: "18px",
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

const miniLabelStyle = {
  margin: 0,
  color: "#91A3A8",
  fontSize: "10px",
  fontWeight: 800,
  textTransform: "uppercase",
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

const secondaryDarkButtonStyle = {
  border: "1px solid #BFDCDD",
  borderRadius: "14px",
  padding: "10px 14px",
  background: "#EEF2F2",
  color: "#2F3E46",
  fontWeight: 800,
  cursor: "pointer",
} as const;

const coralButtonStyle = {
  border: "1px solid #F47F7A",
  borderRadius: "14px",
  padding: "10px 14px",
  background: "#F47F7A",
  color: "#FFFFFF",
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

const codeBoxStyle = {
  margin: 0,
  whiteSpace: "pre-wrap",
  border: "1px solid #BFDCDD",
  borderLeft: "4px solid #7ECFD4",
  borderRadius: "16px",
  background: "#F7FCFC",
  padding: "16px",
  color: "#2F3E46",
  fontSize: "12px",
  lineHeight: 1.6,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;

const codeTextareaStyle = {
  ...codeBoxStyle,
  width: "100%",
  resize: "vertical",
} as const;

const guideListStyle = {
  margin: 0,
  paddingLeft: "18px",
  color: "#5F747A",
  lineHeight: 1.7,
} as const;

function targetTabStyle(active: boolean) {
  return {
    border: `1px solid ${active ? "#4AAEB6" : "#BFDCDD"}`,
    borderRadius: "16px",
    padding: "10px 14px",
    background: active ? "#7ECFD4" : "#F7FCFC",
    color: active ? "#2F3E46" : "#5F747A",
    fontSize: "14px",
    fontWeight: 800,
    cursor: "pointer",
  } as const;
}

function workStartStyle(active: boolean, ideal: boolean) {
  return {
    border: `1px solid ${active ? "#F47F7A" : ideal ? "#7ECFD4" : "#BFDCDD"}`,
    borderRadius: "14px",
    padding: "10px 14px",
    background: active ? "#F47F7A" : ideal ? "#DDF3F4" : "#F7FCFC",
    color: active ? "#FFFFFF" : ideal ? "#357F91" : "#5F747A",
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

const warningBoxStyle = {
  border: "1px solid #F2C98E",
  borderRadius: "14px",
  background: "#FFF0D8",
  padding: "12px",
  display: "grid",
  gap: "8px",
} as const;

const errorBoxStyle = {
  border: "1px solid #F3B0B0",
  borderRadius: "14px",
  background: "#FFE2E2",
  padding: "12px",
  display: "grid",
  gap: "8px",
} as const;

const infoBoxStyle = {
  border: "1px solid #9ED7DF",
  borderRadius: "14px",
  background: "#DFF3F6",
  padding: "12px",
  display: "grid",
  gap: "8px",
} as const;

const successBoxStyle = {
  border: "1px solid #A8DDBE",
  borderRadius: "14px",
  background: "#E4F5EC",
  padding: "12px",
  display: "grid",
  gap: "8px",
} as const;

function historyStatusStyle(status: HistoryItem["status"]) {
  if (status === "採用済み") {
    return pillStyle("#E4F5EC", "#3F8A63");
  }

  if (status === "修正待ち") {
    return pillStyle("#FFF0D8", "#A96E22");
  }

  return pillStyle("#F7FCFC", "#5F747A");
}

function queueStatusPillStyle(item: AiJsonImportQueueItem) {
  if (item.status === "validation_failed" || !item.validation_ok) {
    return pillStyle("#FFF0D8", "#A96E22");
  }

  if (item.status === "validated") {
    return pillStyle("#E4F5EC", "#3F8A63");
  }

  return pillStyle("#EAF7F7", "#357F91");
}

function toGenerationTargetLabel(target: AiJsonImportQueueItem["generation_target"]) {
  if (target === "persona") {
    return "target: 人格JSON";
  }

  if (target === "reply_templates") {
    return "target: 返答テンプレートJSON";
  }

  return `target: ${target}`;
}
