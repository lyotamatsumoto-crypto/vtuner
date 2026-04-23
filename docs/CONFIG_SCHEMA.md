# CONFIG_SCHEMA.md

## Purpose

本書は、VTuner で扱う主要設定データ、人格構造、カテゴリ、返答集、条件イベント、queue、compile 反映対象の構造を定義する文書である。

ここでは実装コードや JSON Schema の詳細コードではなく、データの責務分離と項目設計の基準を定める。

---

## Configuration Policy

- データは責務ごとに分離する
- 人格、口調、返答カテゴリ、返答集、条件イベントを混ぜない
- AI 生成 JSON はこの構造に合わせて返させる
- JSON 検証成功時のみ本採用とする
- 採用済み差分は compile により正式データへ反映する

---

## Contract Maturity（確定度）

本書では、外部ブラウザAIから返してもらう JSON 契約の「確定度」を区別する。

- 人格JSON: `Persona JSON Contract (v1 draft)` を今回の強い契約として定義する（必須/任意、型、禁止事項をここで明記する）
- 返答カテゴリ / 返答集 / 条件イベント / カテゴリ定義 / エラー修正: まだ完全確定前であり、現時点では暫定対象とする（本書では概念と責務のみを維持する）

---

## Main Data Domains

### 1. Character Core
キャラクターの基本情報

含むもの:
- VTuner 名
- 一人称
- 視聴者の呼び方
- 配信者の呼び方
- プロフィール
- 基本見た目情報
- 音声の基本情報

### 2. Personality Layer
人格レイヤー

人格は次の 3 層で持つ。

- 基本性格
- 視聴者向け態度
- 配信者向け態度

人格プリセットは、この 3 層を初期束として扱う。

### 3. Speech Layer
話し方レイヤー

含むもの:
- 口調
- 語尾
- 好きな言い回し
- 禁止表現
- 避けたい言い回し

### 4. Visual Layer
見た目レイヤー

含むもの:
- front 画像
- side 画像
- mirror 設定
- 初期位置
- 表示サイズ
- 吹き出し設定
- フォント設定
- 字幕や文字色設定

### 5. Response Category Layer
返答カテゴリ定義

カテゴリ定義は次を持つ。

- カテゴリ名
- 説明
- 対象例
- 既存カテゴリとの差
- Basic Settings の選択肢へ反映するか
- 有効 / 無効の対象か

### 6. Reply Collection Layer
返答集

返答集はカテゴリごとに持つ。

含むもの:
- 対応カテゴリ
- 候補文リスト
- 対象別に分かれるか
- 口調制約があるか
- 使用優先度または重み
- 備考

### 7. Condition Event Layer
条件イベント定義

初期対象:
- 無コメント
- 連投
- 初見
- 常連
- 特定ユーザー
- 名前条件
- 時間帯
- NG / ignore
- 配信開始直後
- 配信終盤

各条件イベントは次を持つ。

- ルール名
- 種別
- 条件
- 条件値
- 単位
- 発話対象
- 使用カテゴリまたは使用返答集
- 有効 / 無効
- source

---

## Source Types

各定義やルールには source を持たせる。

候補:
- 初期プリセット
- 手動追加
- JSON取込
- ブラウザAI生成
- Review由来
- 派生編集

---

## Preset Types

プリセットは次の 3 種に分ける。

- 初期プリセット
- ユーザー派生プリセット
- マイプリセット

マイプリセット化条件:
- 検証成功
- 採用済み
- 名前付け済み

---

## Queue Structures

### Review Patch Queue
Review 由来の差分候補を保持する。

含むもの:
- 差分種別
- 対象コメント
- 対象カテゴリまたは対象定義
- 提案内容
- 状態
- 作成日時

### AI JSON Import Queue
AI / JSON Studio 由来の JSON 差分を保持する。

含むもの:
- 生成対象
- 元自然文
- プロンプト情報
- 返却 JSON
- 検証結果
- 状態
- エラー内容
- 作成日時

### Adopted Changes
採用済み差分を保持する。

含むもの:
- 採用種別
- 生成元レーン
- 採用日時
- 採用対象
- 採用名
- compile 待ち状態

---

## Compile Target

compile は、採用済み差分を次へ反映する。

- 正式ルール一覧
- 正式定義一覧
- 基本設定の選択肢
- 返答集
- runtime 用データ

compile は、採用済み差分を正式データへ確定反映し、VTuner 本体が利用する実行用データへ反映する処理である。

---

## Persona JSON Contract (v1 draft)

本節は、AI / JSON Studio の「人格」タブで外部ブラウザAIに返してもらう JSON 契約を定義する。

- 本契約は draft である（将来更新されうる）
- ただし v1 draft の範囲では、キー名、必須/任意、型、禁止事項は本節を正とする
- UI 上の文面例（モック文面）や説明文は契約の正ではない
- 想定外キーは許可しない（top-level / nested ともに）

### Top-level（必須）

- `schema_version` (string, required)
- `preset_name` (string, required)
- `persona_core` (object, required)
- `audience_modes` (object, required)
- `speech_style` (object, required)
- `safety_rules` (object, required)
- `meta` (object, required)

#### schema_version
- 型: string
- 値: `persona_json_v1_draft`（v1 draft の固定値）

#### preset_name
- 型: string
- 意味: この人格プリセットの人間向け名前（履歴や採用一覧で識別するため）

---

### persona_core（必須 / object）

必須キー:
- `archetype` (string)
- `summary` (string)
- `traits` (array of string)
- `emotional_temperature` (string)
- `social_distance` (string)

制約:
- `traits` は文字列配列（空配列は不可）

---

### audience_modes（必須 / object）

必須キー:
- `viewer` (object)
- `streamer` (object)

#### audience_modes.viewer（必須 / object）
必須キー:
- `stance` (string)
- `tone` (string)
- `distance` (string)
- `behavior_notes` (array of string)

#### audience_modes.streamer（必須 / object）
必須キー:
- `stance` (string)
- `tone` (string)
- `distance` (string)
- `behavior_notes` (array of string)

制約:
- `behavior_notes` は文字列配列（空配列は許可）

---

### speech_style（必須 / object）

必須キー:
- `tone_label` (string)
- `sentence_ending_style` (string)
- `favorite_phrases` (array of string)
- `avoid_phrases` (array of string)
- `speaking_rules` (array of string)

制約:
- `favorite_phrases` は文字列配列（空配列は不可）
- `avoid_phrases` は文字列配列（空配列は許可）
- `speaking_rules` は文字列配列（空配列は許可）

---

### safety_rules（必須 / object）

必須キー:
- `banned_expressions` (array of string)
- `banned_attitudes` (array of string)
- `notes` (array of string)

制約:
- 各配列は文字列配列（空配列は許可）

---

### meta（必須 / object）

`meta` は緩めに扱う。ただし `created_from` は必須である。

必須キー:
- `created_from` (string)

任意キー:
- `reference_character_note` (string)
- `author_note` (string)

`created_from` の値（enum / v1 draft）:
- `new`（新規作成）
- `review_candidate`（Review候補から開始）
- `existing_base`（既存ベース）
- `history`（履歴）
- `my_preset`（マイプリセット）
- `ideal_schema`（理想スキーマから開始）

制約:
- `created_from` は上記 enum 以外を許可しない
- `reference_character_note` / `author_note` は省略可能とする（ただし存在する場合は string）

---

### Global Prohibitions（禁止事項）

- JSON 以外の説明文を混ぜない（Markdown、コメント、前置き、後書きを含めない）
- 追加キー（想定外キー）を top-level / nested ともに含めない
- 型を崩さない（配列が要求される箇所を文字列にしない 等）

---

## Generation Targets in AI / JSON Studio

### 人格
人格は `Persona JSON Contract (v1 draft)` の JSON 形式で返させる。

- 必須項目、キー名、型、禁止事項は上記契約を正とする
- 本書では今回、人格JSON契約のみを強く確定する

### 返答カテゴリ
含むもの:
- カテゴリ名
- カテゴリ説明
- 想定対象例
- 初期使用方向性

### 返答集
含むもの:
- 対応カテゴリ
- 候補文
- 対象別差分
- 備考

### 条件イベント
含むもの:
- 種別
- 条件
- 発話対象
- 使用カテゴリまたは候補文方向性

### カテゴリ定義
含むもの:
- 新カテゴリ名
- 説明
- 対象例
- 既存カテゴリとの差

### エラー修正
含むもの:
- 元 JSON
- エラー要約
- 修正指示
- 再出力要求

---

## Validation Policy

- JSON は生成対象ごとに独立して検証する
- 想定外キーは許可しない
- 必須キー不足は失敗とする
- enum 値の逸脱は失敗とする
- 人格JSONは `Persona JSON Contract (v1 draft)` に対して厳格に検証する（必須/型/enum/禁止キー）
- 人格以外の生成対象は完全確定前であるため、現時点では暫定対象として扱う（契約の強化は確定後に行う）
- 不正時は再修正プロンプトを生成する
- 検証成功時は差分要約を出す

---

## Naming Policy

履歴名の推奨形式:

`キャラ名__対象__用途__性格軸__日時`

例:
- ヴィヴィ__viewer__greeting-pack__ツンデレ__2026-04-18-2230
- ヴィヴィ__streamer__topic-nudge__クーデレ__2026-04-18-2242
