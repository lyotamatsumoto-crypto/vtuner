# UI_SPEC.md

## Purpose

本書は、VTuner の正式 UI 構造、5 画面の責務、画面ごとの対象範囲、非対象範囲、画面間の関係を定義する文書である。

本書の目的は、画面責務の混線を防ぎ、Mock UI 作成と実装時の判断基準を固定することにある。

---

## UI Policy

- UI は 5 画面構成とする
- 各画面は責務を分離する
- 主要画面への遷移は左サイドバーを基本とする
- 上部領域は現在画面名、補助操作、ユーザー情報の表示に使い、主要画面遷移の主導線にはしない
- Basic Settings は共通土台、Detailed Rules は正式編集、AI / JSON Studio は生成と検証、といった役割を崩さない
- 初回利用導線は Basic Settings 起点を基本とする
- Preview / Test は見え方確認と試験入力の導線である
- Review は配信後コメントの見直しと patch candidate 化の導線である
- AI / JSON Studio は常時のメイン入口ではなく、必要時の補助導線である
- 非プログラマ前提で、UI 主導の運用を優先する
- JSON 直編集を主導線にしない
- Review と compile の流れを UI 上で追えるようにする

---

## Screen Map

1. Preview / Test
2. Basic Settings
3. Review
4. Detailed Rules
5. AI / JSON Studio

---

## Common Layout

- 全画面は原則として左サイドバー + メインコンテンツの構造を基本とする
- 左サイドバーには主要5画面への導線を置く
- 左サイドバーの項目は以下を基本とする
  - Basic Settings
  - Preview / Test
  - Detailed Rules
  - AI / JSON Studio
  - Review
- 現在表示中の画面は左サイドバー上で選択状態として表示する
- 上部領域は画面タイトル、補助アクション、ユーザー情報、必要に応じた戻る導線に使う
- AI / JSON Studio は補助導線だが、独立した画面として左サイドバーに表示する
- 配色と詳細な視覚ルールは DESIGN_GUIDE.md に委ねる
- 共通部品の詳細は COMPONENT_SPEC.md に委ねる

---

## 1. Preview / Test

### Purpose
- 実配信での見え方確認
- コメント反応と条件イベントのテスト
- 理由や使用反応名の確認
- テストプリセットの実行

### Main areas
- Main Preview
- VTuner 表示領域
- 背景差し替え
- front / side / mirror 操作
- 吹き出し調整
- コメント入力
- 単発サンプル
- Comment / Test History
- Bottom Test Area

### Must include
- 背景差し替え
- VTuner の位置とサイズ調整
- 吹き出し位置とサイズ調整
- コメント入力
- 条件イベントテスト
- テスト履歴
- 理由ラベルまたは使用反応名確認

### Must not include
- 共通設定の主編集
- 配信後仕分け
- 正式ルール追加
- JSON 生成、JSON 検証の主操作

### Notes
- ここに表示される履歴は、この画面で実行したテスト専用履歴とする
- 実運用 review ログとは分ける
- Preview / Test は確認用 UI を含む画面であり、そのまま OBS などの本番表示へ出す前提にはしない
- OBS などの本番表示には、確認 UI を含まない表示専用ルートを用いる
- キャラクター表示と吹き出し表示は、共通表示部品として Preview / Test と Overlay 表示専用ルートで再利用する
- Preview / Test と Overlay は同じ画面ではない
- 拡張フェーズでは、読み上げのみモード、発言対象表示、発言対象に応じた front / side 切替を本画面で確認する（詳細は `ROADMAP_TO_EXTENSION.md`）

---

## 2. Basic Settings

### Purpose
キャラクターの共通土台を作る。

### Main areas
- 基本プロフィール
- キャラプロフィール
- キャラ方針
- 話し方
- 音声
- 見た目と画像
- 吹き出しと文字
- 反応カテゴリ

### Must include
- VTuner 名
- 一人称
- 視聴者の呼び方
- 配信者の呼び方
- 基本性格
- 視聴者向け方針
- 配信者向け方針
- 口調
- 語尾
- 好きな言い回し
- 禁止表現
- 音声設定
- 画像設定
- 吹き出し設定
- 反応カテゴリ ON / OFF

### Must not include
- 新規定義の正式追加
- 新ルールの正式追加
- 配信後整理
- JSON 生成や JSON 検証の主操作

### Notes
- ここはキャラの共通土台であり、詳細ルール追加画面ではない
- 新しい定義追加は Detailed Rules または AI / JSON Studio に委ねる
- 拡張フェーズでは、Character Profile 保存、未保存状態表示、最終保存時刻表示を本画面に追加する（詳細は `ROADMAP_TO_EXTENSION.md`）

---

## 3. Review

### Purpose
配信後にコメント処理結果を整理し、patch candidate を作る。

### Main areas
- 左サイドバー（配信一覧 / 選択）
- コメント貼り付け / 読み込み（MVP）
- フィルタ
- コメント一覧
- 選択中コメント
- 推論カテゴリ候補 / 理由確認
- Review 操作（ignore / existing category / new candidate）
- Patch Candidate Area

### Must include
- unknown / skipped / displayed / ignored
- コメント貼り付け入力欄
- 読み込み操作（貼り付けテキストを取り込む）
- 読み込み結果として「配信単位（セッション）」を扱える（左サイドバーで選べる）
- コメント本文確認
- 推論カテゴリ候補またはカテゴリ候補表示
- ignore
- existing category 候補化
- new category 候補保留
- patch candidate area

### Must not include
- 正式ルール編集
- 定義の正式編集
- JSON 生成と JSON 取込
- compile 実行の主操作

### Notes
- Review は仕分け画面であり、正式編集画面ではない
- Review の MVP は「コメント貼り付けで読み込む」を正とする
- URL 後追いでコメントを再取得する前提にはしない
- 必要に応じて配信メタ情報（タイトル・日時・URL等）を保持できるが、貼り付けコメントが主導線である
- ここで作られた差分は Review Patch Queue に入る

---

## 4. Detailed Rules

### Purpose
正式なルール、定義、patch を編集、追加、採用する。

### Main areas
- ルール一覧
- ルール編集
- 候補文編集
- 手動ルール追加
- 手動定義追加
- patch 採用
- プリセット派生編集

### Must include
- 既存ルール一覧
- 既存定義一覧または定義編集導線
- 手動で新ルールを 1 件追加する導線
- 手動で新定義を 1 件追加する導線
- 採用済みルールの候補文編集
- 条件編集
- ON / OFF
- 複製
- 削除
- Review 由来 patch の採用導線

### Must not include
- AI 生成の主ワークフロー
- JSON 検証の主ワークフロー
- JSON エラー修正の主ワークフロー
- 共通設定の主編集
- 配信後仕分け

### Notes
- Detailed Rules は正式編集室である
- AI / JSON Studio は生成と検証室である
- この境界を崩さないこと

---

## 5. AI / JSON Studio

### Purpose
外部ブラウザ AI を使って、JSON 形式の設定や定義を生成、取込、検証、再修正、採用する。

### Screen structure
- 左右 2 カラム常設型
- 生成対象ごとの専用作業面切替
- 作業開始元の選択（新規作成 / Review候補 / 既存ベース / 履歴 / マイプリセット / 理想スキーマ）

### Generation target tabs
- 人格
- 返答カテゴリ
- 返答集
- 条件イベント
- カテゴリ定義
- エラー修正

### Left column
- 生成対象説明
- かんたん入力
- 詳細入力
- 関連プリセット選択
- プロンプト生成
- プロンプトコピー

### Right column
- 見本と項目ガイド（見本を見る / 空の見本をコピー / サンプルを入れる / 必須項目を見る / 項目の説明を見る）
- JSON 貼り付け / 読込
- 検証結果
- エラー内容
- 再修正プロンプト
- 差分要約
- 採用
- 履歴
- マイプリセット化導線

### Must include
- 生成対象タブ
- 左右 2 カラム
- 作業開始元の選択
- かんたん入力 / 詳細入力
- プロンプト生成
- JSON 取込
- JSON 検証
- エラー修正プロンプト生成
- 差分要約
- 採用
- 履歴
- マイプリセット化
- 見本 / 必須項目 / 項目説明のガイド導線

### Must not include
- 既存採用ルールの細かい手動編集
- 配信後仕分け
- Preview の見た目調整

### Notes
- ここはやり込み機能の中心である
- 一本道ウィザードではなく、対象別の常設作業面とする
- 非プログラマ向けだが、プリセットより深い操作をしたい人にも耐える構造とする
- 外部AI用プロンプト欄は基本折りたたみとする
- 折りたたみ状態でも「生成 / コピー / 開く」ができる

---

## Cross-screen Relationships

### Basic Settings → Detailed Rules
- Basic Settings で選べる内容は、Detailed Rules で追加された正式定義が反映される

### Review → Detailed Rules
- Review で作った patch candidate は Detailed Rules で採用される

### AI / JSON Studio → Detailed Rules
- AI / JSON Studio で生成、検証、採用されたものは、Detailed Rules で正式編集可能になる

### Adopted Changes → compile
- 採用済み差分は compile によって本体へ反映される

### Preview / Test → Overlay
- Preview / Test は確認用画面である
- Overlay は配信表示専用の表示ルートであり、UI 操作部品を表示しない
- 両者はキャラクター表示と吹き出し表示の共通部品を再利用するが、同一画面として扱わない

---

## UI Design Guidance for Mock Refinement

特に Detailed Rules と AI / JSON Studio は、次を守ってモックを詰めること。

- 1 画面に役割を詰め込みすぎない
- 生成、検証、再修正は AI / JSON Studio に集める
- 採用済みの正式編集は Detailed Rules に集める
- Review は patch candidate 作成までで止める
- compile は全体の確定反映処理として別概念で扱う
