# AGENTS.md

## Purpose

本書は、このプロジェクトにおいて VS Code 上の AI が従うべき行動原則、作業範囲、禁止事項、停止条件、読込順、報告ルールを定義する中核文書である。  
実装、修正、読込、提案は、常に本書および `docs/` 内文書に従って行うこと。

---

## Project-specific Core Understanding

このプロジェクトは VTuner である。

VTuner は、主にリスナーコメントへ反応する仲介キャラクターを、ルールベースで運用、調整、改善するための配信補助アプリである。

本プロジェクトの正式な画面構成は次の 5 画面である。

1. Preview / Test
2. Basic Settings
3. Review
4. Detailed Rules
5. AI / JSON Studio

この 5 画面構成を、明示許可なく変更しないこと。

また、本プロジェクトでは次を厳守すること。

- アプリ内部に AI は存在しない
- VTuner 本体はルールベースで動く
- 外部ブラウザ AI は設定生成や定義生成のためにのみ使う
- 外部 AI 返却 JSON は検証成功なら基本本採用である
- エラー時は再修正プロンプトを生成する

---

## Priority Order

判断に迷った場合は、次の順で参照すること。

1. `AGENTS.md`
2. `docs/PROJECT_OVERVIEW.md`
3. `docs/PHASES.md`
4. `docs/CHECKPOINTS.md`
5. `docs/COMPLETION_CRITERIA.md`
6. `docs/UI_SPEC.md`
7. `docs/CONFIG_SCHEMA.md`
8. `docs/EVENT_PROTOCOL.md`
9. `docs/REVIEW_FLOW.md`
10. `docs/AI_JSON_STUDIO_SPEC.md`
11. `docs/IMPLEMENTATION_GUIDE.md`
12. ユーザーの直近の明示指示

衝突がある場合は、勝手に解釈せず停止して報告すること。

---

## Scope of Work

AI が行ってよい作業は、原則として以下に限る。

- 現在のワークスペース内のフォルダ作成
- 現在のワークスペース内のコード作成
- 現在のワークスペース内の既存コード修正
- docs 内文書を参照した実装、修正、整備
- 指定 Phase に対応する作業
- 必要最小限のリファクタ
- 文書と実装の整合を取るための局所修正
- 変更内容、影響範囲、未解決事項の報告

AI は、常に現在のワークスペースをプロジェクトルートとして扱うこと。

---

## Out of Scope

AI は以下を行ってはならない。

- ワークスペース外のファイル変更
- Git / GitHub の実操作
- pytest の実行
- add / commit / push
- 認証操作
- 外部サービスへの登録や設定変更
- 未承認の大規模設計変更
- 指定されていない Phase の先行実装
- docs にない仕様を勝手に確定すること
- アプリ内部に AI を組み込むこと
- 配信中の主制御を外部 AI に任せること
- 5 画面の責務を勝手に混線させること

---

## User Responsibilities

以下はユーザー担当である。

- md ファイルの保存
- md ファイルの配置
- VS Code でのプロジェクトオープン
- pytest 実行
- git add / commit / push
- GitHub リポジトリ作成と接続
- 実装継続の最終判断
- 破壊的変更の承認
- 曖昧仕様に対する最終決定

---

## Core Working Principles

### 1. Document-driven development
実装は常に docs 内文書に基づいて行う。  
推測で仕様を補完しない。

### 2. Minimal change first
変更は最小差分を原則とする。  
全面書き換えより局所修正と局所追加を優先する。

### 3. No speculative implementation
曖昧な仕様や複数解釈がある場合、勝手に実装しない。  
必要なら停止して報告する。

### 4. Phase discipline
現在指定されている Phase の範囲だけを扱う。  
次 Phase の内容を先取りしない。

### 5. Safe modification
既存構造を壊す可能性がある変更は、必要性を説明して停止する。  
大規模移動、大規模削除、全面置換は慎重に扱う。

### 6. Explicit reporting
作業後は、何を変えたか、何に影響するか、未解決事項は何かを簡潔に報告する。

### 7. UI responsibility separation
- Preview / Test は見た目確認と挙動検証
- Basic Settings は共通土台
- Review は配信後整理
- Detailed Rules は正式編集
- AI / JSON Studio は生成、検証、再修正、採用

この責務分離を壊してはならない。

### 8. No internal AI assumption
本プロジェクトでは、アプリ内部に AI を持たない前提を守ること。  
AI を使うのは外部ブラウザ AI へのプロンプト生成と JSON 取込支援に限る。

---

## Required Reading Before Work

作業開始前に、少なくとも以下を確認すること。

- `AGENTS.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/PHASES.md`
- `docs/CHECKPOINTS.md`

必要に応じて以下も確認すること。

- `docs/COMPLETION_CRITERIA.md`
- `docs/UI_SPEC.md`
- `docs/CONFIG_SCHEMA.md`
- `docs/EVENT_PROTOCOL.md`
- `docs/REVIEW_FLOW.md`
- `docs/AI_JSON_STUDIO_SPEC.md`
- `docs/IMPLEMENTATION_GUIDE.md`

---

## Dependency Policy

AI は依存追加に慎重でなければならない。

- 明示許可なしで依存を追加しない
- 既存依存で達成できるなら新規依存を増やさない
- 依存追加が必要なら理由を説明する
- 小規模個人開発として維持しやすい構成を優先する

---

## Data and JSON Handling Policy

- JSON の生成元として外部ブラウザ AI を想定する
- JSON は `CONFIG_SCHEMA.md` に基づいて検証する
- JSON 検証成功時は基本本採用とする
- JSON エラー時は、エラー内容に応じた再修正プロンプトを生成する
- JSON をユーザーが直接手で直すことを前提にしない
- AI / JSON Studio と Detailed Rules の責務を混線させない

---

## Stop Conditions

以下の場合、AI は無理に進めず停止すること。

- docs 同士が矛盾している
- ユーザー指示と docs が衝突している
- 仕様が曖昧で複数解釈があり得る
- 現在の Phase 範囲を超える必要がある
- 大規模変更が必要である
- ワークスペース外操作が必要になる
- 新規依存追加が必要だが未承認である
- UI 5 画面の責務が崩れる
- internal AI 前提の実装が必要になっている
- JSON 仕様や compile 意味が文書と噛み合わない

停止時は、次を返すこと。

- 何が不足または衝突しているか
- 何を判断できないか
- 次にユーザーが決めるべきこと
- 続行するならどの選択肢があるか

---

## Reporting Format

作業後は、簡潔に次を報告すること。

### 1. Changes made
- 変更したファイル
- 変更内容の要約

### 2. Impact
- どこに影響するか
- 既存機能への影響有無

### 3. Open issues
- 未解決事項
- 追加で確認が必要なこと
- docs 側で同期が必要な候補

### 4. Next smallest step
- 次に行うべき最小作業
- 次に触るべき Phase または画面

---

## Completion Awareness

AI は、次を守ること。

- 一度動作しただけで完成扱いしない
- README と主要 docs を無視して完了判定しない
- ユーザーが後日見返して再開できる状態を重視する
- docs と実装の整合が取れていないなら安易に done と言わない

---

## Final Reminder

このプロジェクトでは、  
賢そうに見えるものを先に作るのではなく、  
壊れにくく、役割が分かれ、非プログラマでも扱いやすい土台を作ることを優先する。

AI は、文書主導、最小差分、Phase 順守、停止条件順守を守り、  
VTuner の 5 画面構成と外部 AI 連携方針を壊さないこと。