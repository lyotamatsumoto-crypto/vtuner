# COMPONENT_SPEC.md

## 1. 文書の目的

本書は、UI全体で再利用する共通コンポーネントを整理し、
実装時に一貫した見た目・挙動で構築できるようにするための文書である。

今回の前提:

* 配色: Mint Coral（Adopted）
* レイアウト: 左サイドバー + 上部ヘッダー + メイン
* 採用済み基準モック: `mockups/gemini_chatgpt/AI_JSON_Studio.html`（AI / JSON Studio）

---

## 2. 対象範囲

参照元:

* UI_SPEC.md
* DESIGN_GUIDE.md
* mock UI / HTML

対象:

* ナビゲーション系
* 入力系
* 表示系（Card / Badge）
* 操作系（Button / Tabs）

---

## 3. 共通方針

* 画面固有UIを減らし、部品で統一する
* 色ではなく「役割」でバリエーションを持つ
* 状態（hover / active / disabled）を必ず定義する
* 視認性と操作性を優先する

---

## 4. コンポーネント一覧

| 名称               | 役割        | 優先度    |
| ---------------- | --------- | ------ |
| Sidebar          | 画面遷移      | High   |
| SidebarItem      | ナビ項目      | High   |
| TopBar           | 上部情報・補助操作 | High   |
| Button           | 操作実行      | High   |
| Input / Textarea | 入力        | High   |
| Select           | 選択        | Medium |
| Tabs             | コンテキスト切替  | High   |
| Card             | 情報ブロック    | High   |
| StatusBadge      | 状態表示      | High   |
| Panel (Right)    | 検証・差分表示   | High   |

---

# 5. コンポーネント詳細

## 5-1. Sidebar

### 役割

* 主要画面への遷移
* 現在位置の可視化

### 構成

* アイコン + ラベル
* 上から並ぶリスト

### 状態

* default
* hover
* active（選択中）

### 表現

* active: Mint 系背景 + ネイビーグレー文字（強い挿し色は使わない）
* hover: Soft Mint 系背景
* default: ネイビーグレー / ブルーグレー文字

### 追加ルール（Mint Coral）

* active item に Coral / Red の縦線や強い挿し色を使わない
* 画面全体のアクセント色を Sidebar に広げすぎない

### 注意

* 項目数が増えても崩れない構造

---

## 5-2. SidebarItem

### props

* label
* icon
* active
* onClick

### 挙動

* クリックで画面遷移

---

## 5-3. TopBar

### 役割

* 現在画面名表示
* 補助操作（Preview / Reviewなど）

### 構成

* 左: タイトル
* 右: 補助ボタン / ユーザー情報

---

## 5-4. Button

### バリエーション

* Primary（Deep Mint）
* Secondary（白 + ボーダー）
* Coral（検証・注意・再修正などの文脈に限定）
* Danger（破壊的操作がある場合のみ）
* Ghost（背景なし）

### 状態

* default
* hover
* active
* disabled
* loading

### 使用ルール

* Primaryは1画面で1〜2個まで
* 危険操作でないものに Coral / 赤を使わない
* 採用 / 保存などの肯定系操作は Mint 系を優先する

---

## 5-5. Input / Textarea

### 役割

* テキスト入力

### 状態

* default
* focus（Mint強調）
* error
* disabled

### 注意

* label必須
* placeholder依存しない

---

## 5-6. Select

### 役割

* 選択入力

### 状態

* default
* open
* selected

---

## 5-7. Tabs

### 役割

* コンテキスト切替（人格 / カテゴリなど）

### 状態

* default
* active

### 表現

* active: Mint 系
* default: 白または薄いミント系

---

## 5-8. Card

### 役割

* 情報のまとまり表示

### 表現

* 白背景またはごく薄いミント系
* 薄いボーダー（淡いミント / ブルーグレー系）
* 角丸（16〜20px）

---

## 5-8b. Sub Block（Card内小ブロック）

### 役割

* Card内の補助情報ボックス
* 差分要約、履歴、補助説明、必須項目などに使う

### 表現

* 薄いミント系背景を基本とする
* 必要なら薄いブルー系のバリエーションを使う（派手にしない）
* 意味のない色分けはしない（状態差が必要なら文言で示す）

---

## 5-9. StatusBadge

### 役割

* 状態表示（成功 / 警告 / エラー / 情報）

### 種類

* Success（緑）
* Warning（黄）
* Error（赤）
* Info（青）

### 注意

* 色 + 文言で表現
* 上部サマリーや補助ラベルは、状態色を増やしすぎない（同系色で統一）
* Warning / Error は検証結果など必要箇所に限定する

---

## 5-10. Panel（Right Panel）

### 役割

* 検証結果
* 差分要約
* インポート/エクスポート

### 構成

* Cardの縦積み

---

## 6. 状態共通ルール

* loading: スケルトン or スピナー
* empty: ガイド文表示
* error: 赤 + メッセージ
* success: 緑 + 完了表示

---

## 7. 再利用ポリシー

* Sidebar / Button / Card は必ず共通化
* 画面固有UIは極力作らない

---

## 8. 今回の変更の位置づけ

今回追加された重要コンポーネント:

* Sidebar
* SidebarItem
* Panel（右側補助領域）

これはレイアウト基盤として全画面共通で使用する。

また、次を記録として扱う（仕様変更ではない）。

* `mockups/gemini_chatgpt/AI_JSON_Studio.html` を AI / JSON Studio の採用済みHTMLモックとする
* この画面のデザインを、残り4画面の見た目調整の基準にする
* 残り4画面は、仕様を変えず、Sidebar / Card / Button / Tabs / Badge / Input の見た目だけを揃える

---

以上
