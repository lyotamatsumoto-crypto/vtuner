# PHASES.md

## Purpose

本書は、このプロジェクトの開発 Phase、実装順序、各段階の目的、到達条件、非対象範囲を定義する文書である。  
実装は常に本書を参照し、現在の Phase の範囲内で進めること。

---

## Phase Policy

- 1つずつ順番に進める
- 現在 Phase 以外を先取りしない
- 各 Phase には目的、対象、非対象、完了条件を持たせる
- 完了条件を満たさない限り次へ進まない
- 曖昧さがある場合は、実装より先に整理を優先する
- 完成はコードがあることではなく、目的と運用判断が成立することとする

---

## Current Status

- Current phase: Phase 10 Validation and Consistency
- Current status: Phase 9.6 の最小 write 導線は実装済み。Phase 10-1/10-2/10-3 を経て、現在は Completion Review 前の残課題整理を実施中
- Next phase: Phase 11 Completion Review（Phase 10 の残課題整理後）
- Last completed phase: Phase 9 Review to Compile Flow（最小導線）

---

## Full Phase Map

1. Phase 0: Concept Clarification
2. Phase 1: Project Foundation
3. Phase 2: Workspace and Contract Baseline
4. Phase 3: Preview / Test Skeleton
5. Phase 4: Basic Settings Skeleton
6. Phase 5: Review Skeleton
7. Phase 6: Detailed Rules Skeleton
8. Phase 7: AI / JSON Studio Skeleton
9. Phase 8: Runtime Wiring
10. Phase 9: Review to Compile Flow
11. Phase 10: Validation and Consistency
12. Phase 11: Completion Review

---

## Phase 0: Concept Clarification

### Purpose
目的、想定ユーザー、MVP、非目標、5 画面構成を明確にする。

### In scope
- 企画整理
- 想定ユーザー整理
- MVP 定義
- 非目標定義
- 画面数と責務整理
- AI の位置づけ整理

### Out of scope
- 実装開始
- UI 作り込み
- コード生成

### Exit condition
- 5 画面構成が定義されている
- internal AI を使わない前提が定義されている
- 外部 AI 連携が設定生成用途であると定義されている

---

## Phase 1: Project Foundation

### Purpose
プロジェクト全体の土台文書と運用ルールを整える。

### In scope
- 中核 md の作成
- AI 行動制約の定義
- Phase とチェックポイント設計
- UI / データ / AI JSON ワークフローの文書化

### Out of scope
- 実機能の実装
- 本格的な UI 作り込み

### Exit condition
- 中核文書が揃っている
- 重要仕様文書が揃っている
- VS Code AI に渡す前提が整っている

---

## Phase 2: Workspace and Contract Baseline

### Purpose
VS Code AI が作業できる最小の受け皿と、データ契約前提を整える。

### In scope
- フォルダ構成の作成
- docs の配置確認
- config schema の枠組み
- event protocol の枠組み
- compile レーンのデータ前提
- queue の前提整理

### Out of scope
- UI 本実装
- 主要機能実装

### Exit condition
- ワークスペース構造が整っている
- event と config の前提が文書と噛み合っている

---

## Phase 3: Preview / Test Skeleton

### Purpose
見た目確認と挙動検証の画面骨格を作る。

### In scope
- Main Preview
- VTuner 表示
- 背景差し替え
- front / side / mirror
- 吹き出し位置調整
- コメントテスト入力
- テスト履歴
- Bottom Test Area

### Out of scope
- Basic Settings の主編集
- Review
- AI / JSON Studio

### Exit condition
- 見た目確認ができる
- テスト入力から反応確認ができる
- テスト履歴がこの画面専用として成立している

---

## Phase 4: Basic Settings Skeleton

### Purpose
キャラの共通土台を設定する画面骨格を作る。

### In scope
- 基本プロフィール
- キャラプロフィール
- 基本性格
- 視聴者向け方針
- 配信者向け方針
- 話し方
- 音声
- 見た目
- 吹き出し
- 反応カテゴリ ON / OFF

### Out of scope
- 新規ルール追加
- 新規定義追加
- JSON 生成
- Review patch 採用

### Exit condition
- 共通設定の画面責務が明確である
- Detailed Rules と AI / JSON Studio の責務を混ぜていない

---

## Phase 5: Review Skeleton

### Purpose
配信後のコメント処理結果整理画面を作る。

### In scope
- unknown / skipped / displayed / ignored フィルタ
- コメント一覧
- 仕分け
- patch candidate area
- existing category 候補化
- new candidate 保留
- ignore

### Out of scope
- 正式ルール編集
- JSON 生成
- compile 実行

### Exit condition
- patch candidate を作れる
- 正式編集と分離された review 画面として成立している

---

## Phase 6: Detailed Rules Skeleton

### Purpose
正式なルールと定義の編集画面骨格を作る。

### In scope
- ルール一覧
- ルール編集
- 候補文編集
- 手動ルール追加
- 手動定義追加
- patch 採用導線
- プリセット派生編集

### Out of scope
- AI JSON 生成の主ワークフロー
- JSON エラー修正の主ワークフロー

### Exit condition
- 正式編集画面として責務が明確である
- AI / JSON Studio との境界が保たれている

---

## Phase 7: AI / JSON Studio Skeleton

### Purpose
外部 AI を使った生成、取込、検証、再修正、採用の画面骨格を作る。

### In scope
- 生成対象タブ
- 左右 2 カラム
- かんたん入力 / 詳細入力
- プロンプト生成
- JSON 読込
- JSON 検証
- エラー修正プロンプト生成
- 差分要約
- 採用
- 履歴
- マイプリセット化

### Out of scope
- 正式手動編集の主操作
- Review 仕分け
- 本番 runtime 制御

### Exit condition
- 外部 AI 用支援画面として独立している
- Detailed Rules と責務が混ざっていない

---

## Phase 8: Runtime Wiring

### Purpose
ルールベース runtime と UI をつなぐ。

### In scope
- コメント受理
- カテゴリ判定
- 条件イベント判定
- 返答決定
- 表示反映
- queue 接続
- compile 後反映

### Exit condition
- Preview / Test で実際に反応確認できる
- compile 後内容が runtime に反映される

---

## Phase 9: Review to Compile Flow

### Purpose
Review patch と AI JSON 由来変更を compile で本体へ反映する流れを作る。

### In scope
- Review Patch Queue
- AI JSON Import Queue
- Adopted Changes
- compile 実装
- compile 履歴

### Exit condition
- 採用済み差分を本体へ反映できる
- compile の意味が実装と docs で一致している

---

## Phase 10: Validation and Consistency

### Purpose
実装と文書の整合を取る。

### In scope
- docs と実装の整合確認
- 用語統一
- queue と compile の整合
- 5 画面責務の整合
- テスト観点整理

### Exit condition
- docs と実装が大きく矛盾していない
- 画面責務が崩れていない

---

## Phase 11: Completion Review

### Purpose
完成と呼べるかを判断する。

### In scope
- 目的との照合
- MVP 達成確認
- 非目標逸脱確認
- 未解決課題整理
- 継続 / 凍結 / 完成判断

### Exit condition
- 完成または継続判断が説明できる
