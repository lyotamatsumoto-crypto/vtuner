# DESIGN_GUIDE.md

## 1. 文書の目的

本書は、今回決定した UI 方針（Mint Coral 配色 + 左サイドバー構造）をもとに、
見た目と視覚ルールを実装へ安全に橋渡しするためのガイドラインである。

単なる配色メモではなく、以下を一貫したルールとして整理する。

* 色（役割ベース）
* レイアウト（サイドバー前提）
* 余白・密度
* タイポグラフィ
* コンポーネントの見た目
* 状態表現

採用済みの基準モックは次とする。

* Theme Name: Mint Coral
* Status: Adopted
* Base Screen: AI / JSON Studio
* Reference mock: `mockups/gemini_chatgpt/AI_JSON_Studio.html`

---

## 2. デザイン全体方針

### 基本姿勢

* 派手さより「構造の明快さ」を優先する
* 主作業面（編集・レビュー・設定）を邪魔しない
* AI補助は強調しすぎず、必要時に使う導線とする

### 目指す印象

* 落ち着いた実務系モダン
* 長時間使っても疲れにくい
* 情報量が多くても整理されて見える

### UI性質

* 管理画面 / 設定ツール寄り
* 非エンジニアでも扱えるが、軽すぎない

### Mint Coral の追加方針

* VTuner の Mock UI は、Mint / Cyan 系を基調にした軽い管理画面UIとする
* 背景は淡いミント系、Cardは白またはごく薄いミント系
* 黒文字は避け、ネイビーグレー系を基本にする
* Coral / Red 系は限定アクセントとして使う（多用しない）
* サマリー系バッジ、補助ラベル、通常タグは同系色に統一する（意味のない多色化を避ける）
* Warning / Error / Coral は、検証結果・注意・重要CTAなど必要箇所だけに限定する

---

## 3. レイアウトルール

### 3-1. 基本構造

```
[左サイドバー] | [メインコンテンツ（2カラム or 1カラム）]

上部: 軽いヘッダー（画面タイトル・補助操作）
```

### 3-2. サイドバー

役割:

* 画面遷移の主導線
* 現在位置の明示

項目:

* Basic Settings
* Preview / Test
* Detailed Rules
* AI / JSON Studio
* Review

ルール:

* 現在選択は Mint 系背景で強調
* hover は Soft Mint 系
* Coral / Red の縦線や強い挿し色で active を表現しない
* アイコン + ラベル構成

### 3-3. メインエリア

構成:

* 左: 主作業（入力・編集）
* 右: 補助情報（検証・差分・状態）

原則:

* 主作業面を広く取る
* 補助情報は右に寄せる

### 3-4. AI / JSON Studio の基本割当

* 左カラム: 入力・生成（外部AIに渡す文の生成）
* 右カラム: JSON貼り付け・検証・再修正・差分・採用・履歴

---

## 4. カラールール（Mint Coral）

### 4-1. Base

* App Background: #F3F7F7
* Surface / Card: #FFFFFF
* Sub Mint: #EAF7F7
* Sub Blue: #EAF3F8
* Border: #BFDCDD
* Strong Border: #8FCFD3

### 4-2. Text

* Primary Text: #2F3E46
* Secondary Text: #5F747A
* Muted Text: #91A3A8

ルール:

* #000000（純黒）は避ける
* 重要箇所以外でテキスト色を増やしすぎない

### 4-3. Mint / Primary

* Mint: #7ECFD4
* Deep Mint: #4AAEB6
* Soft Mint: #DDF3F4

用途:

* active navigation / active tab
* selected / current state
* primary action（基本の肯定操作）

### 4-4. Coral（限定アクセント）

* Coral: #F47F7A
* Coral Hover: #E86D69

用途（限定）:

* 検証ボタン
* 再修正文脈（注意喚起が必要な箇所）
* 画面全体へ広げない

### 4-5. Status

* Success Text: #3F8A63 / Success BG: #E4F5EC
* Warning Text: #A96E22 / Warning BG: #FFF0D8
* Error Text: #B94D4D / Error BG: #FFE2E2
* Info Text: #357F91 / Info BG: #DFF3F6

ルール:

* 色だけでなく文言でも状態を補う
* Warning / Error は「検証結果」など本当に注意が必要な場所だけに使う
* サマリー系バッジ・補助ラベル・通常タグは同系色に統一し、意味のない多色化をしない

### 4-6. 色の使い分け（役割ベース）

* Mint:
  * active navigation
  * active tab
  * selected / current state
  * primary action
* Deep Mint:
  * primary button
  * adoption / confirm action
* Soft Mint / Success BG:
  * summary badge
  * helper badge
  * normal tag
  * sub block
* Coral:
  * validation button
  * correction / attention context（限定）
* Warning / Error:
  * validation result only
  * general badges には使わない

---

---

## 5. コンポーネント見た目ルール

### Button

* Primary: Deep Mint 背景 + 白文字
* Secondary: 白背景 + 境界線
* Coral: 検証・注意・再修正などの文脈に限定
* Danger: 破壊的操作がある場合のみ（通常操作に赤を使わない）

### Card

* 白背景またはごく薄いミント系
* 境界線は淡いミント / ブルーグレー系
* 角丸: 16〜20px
* 影は弱め

### Input

* 白またはごく薄いミント系背景
* 薄いボーダー（淡いミント / ブルーグレー系）
* focus時に Mint 系で強調

### Tabs

* 非選択: 白または薄いミント系
* 選択: Mint 系

### Sidebar item

* 非選択: グレー文字
* hover: Soft Mint 背景
* 選択: Mint 系背景
* Coral / Red の縦線や強い挿し色は使わない

---

## 6. スペーシング

基本:

* 詰めすぎない
* セクション間はしっかり空ける

目安:

* 要素間: 8〜12px
* セクション内: 16〜24px
* セクション間: 32px以上

---

## 7. タイポグラフィ

* フォント（推奨）:
  * Logo / Heading / Badge / Button: Nunito + Noto Sans JP
  * Body / Input / Textarea: Noto Sans JP
  * Code / JSON: 等幅フォント
* 見出し: 太め（ただし強すぎない）
* 本文: 読みやすさ優先

階層:

* Page title: 強
* Section: 中
* Body: 標準
* Caption: 弱

---

## 8. 状態表現

必須:

* loading
* success
* error
* empty

ルール:

* 色 + アイコン + 文言で伝える
* ボタン状態（disabled / loading）は明確に

---

## 9. 視線誘導

* 左 → 右へ流れる構造
* 入力 → 結果が近くにある
* CTAは右下または右側に配置

---

## 10. 今回の変更の位置づけ

今回の変更は以下に該当する。

* 配色方針（Mint Coral）の確定
* 共通レイアウト（サイドバー）の確定

これは UI仕様の変更ではなく、
**デザイン方針の確定**として扱う。

→ 主な反映先:

* DESIGN_GUIDE.md（本書）
* COMPONENT_SPEC.md（必要に応じて）

また、次を記録として扱う。

* `mockups/gemini_chatgpt/AI_JSON_Studio.html` を AI / JSON Studio の採用済みHTMLモックとする
* この画面のデザインを、残り4画面の見た目調整の基準にする（仕様や責務は変更しない）

---

## 11. 今後の拡張

* Figma反映後の微調整
* 状態バリエーションの追加
* コンポーネントの再利用整理

---

以上
