# COMPONENT_SPEC.md

## 1. 文書の目的

本書は、UI全体で再利用する共通コンポーネントを整理し、
実装時に一貫した見た目・挙動で構築できるようにするための文書である。

今回の前提:

* 配色: Slate × Indigo
* レイアウト: 左サイドバー + 上部ヘッダー + メイン

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

* active: Indigo背景 + 白文字
* hover: 薄Indigo背景
* default: グレー文字

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

* Primary（Indigo）
* Secondary（白 + ボーダー）
* Danger（赤）
* Ghost（背景なし）

### 状態

* default
* hover
* active
* disabled
* loading

### 使用ルール

* Primaryは1画面で1〜2個まで

---

## 5-5. Input / Textarea

### 役割

* テキスト入力

### 状態

* default
* focus（Indigo強調）
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

* active: Indigo + 薄背景

---

## 5-8. Card

### 役割

* 情報のまとまり表示

### 表現

* 白背景
* 薄いボーダー
* 角丸（16〜20px）

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

---

以上
