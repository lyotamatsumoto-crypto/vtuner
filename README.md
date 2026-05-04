# VTuner

## Overview

VTuner は、配信画面の端に常駐する仲介キャラクターを、ルールベースで運用・調整・改善するための配信補助アプリです。

主な対象はリスナーコメントです。  
VTuner は主にコメントを拾い、事前に定義されたカテゴリ、返答集、条件イベント、対象別の人格設定に基づいて反応します。

このプロジェクトでは、アプリ内部に AI を持ちません。  
その代わりに、設定作成や定義生成を支援するために、外部ブラウザ AI に渡すプロンプトを生成し、返ってきた JSON を検証して採用する仕組みを持ちます。

---

## Goal

このプロジェクトの主目的は次のとおりです。

- 主にリスナーコメントへ反応する VTuner キャラクターを成立させる
- キャラの共通設定、対象別人格、返答集、条件イベントを UI 中心で調整できるようにする
- 配信後レビューによって unknown や skipped を整理し、差分改善を継続できるようにする
- 非プログラマでも外部ブラウザ AI を使って JSON 形式の設定を作成・採用できるようにする

---

## Core Product Shape

このプロジェクトは、次の 5 画面で構成します。

1. Preview / Test
2. Basic Settings
3. Review
4. Detailed Rules
5. AI / JSON Studio

この 5 画面構成は正式仕様です。  
明示的な変更決定なしに、画面責務を混線させたり、画面数を減らしたりしません。

---

## MVP

MVP では、少なくとも次を成立させます。

- 5 画面の責務が分離されている
- VTuner が主にリスナーコメントへルールベースで反応できる
- Preview / Test で見た目と反応を確認できる
- Review で unknown / skipped / displayed / ignored を整理できる
- Detailed Rules で正式なルールと定義を編集できる
- AI / JSON Studio で外部ブラウザ AI 用プロンプト生成、JSON 検証、再修正プロンプト生成、本採用ができる
- compile により採用済み差分を VTuner 本体へ反映できる

---

## Out of Scope

現段階では、以下は対象外です。

- アプリ内部に LLM を組み込むこと
- 配信中の自由会話を AI に任せること
- 全コメントを高度に意味理解して返答すること
- 自動学習で人格を勝手に変化させること
- 非UI中心で JSON を直接手作業編集する運用を主軸にすること
- 本番長時間運用レベルの監視基盤や配信基盤統合を最初から完成させること

---

## Development Style

このプロジェクトは、次の方針で進めます。

- 文書主導で進める
- 仕様は UI とデータ境界を明確に保つ
- 変更は最小差分を優先する
- Phase 単位で進める
- 曖昧な仕様では推測実装しない
- アプリ内部に AI を入れない前提を守る
- 外部ブラウザ AI は設定生成支援のためにのみ使う
- 非プログラマでも運用しやすい構造を優先する

---

## Role Split

### User

ユーザーの担当は次のとおりです。

- プロジェクト方針の最終承認
- md ファイルの保存
- md ファイルの配置
- VS Code でのプロジェクトオープン
- pytest 実行
- git add / commit / push
- GitHub リポジトリ作成と接続
- 破壊的変更の承認
- 実装継続可否の判断

### VS Code AI

VS Code 上の AI は、docs 内文書に従って次を行います。

- フォルダ作成
- コード作成
- コード修正
- 局所的なリファクタ
- 文書に基づく実装
- 変更内容と影響範囲の報告

制約、禁止事項、停止条件は `AGENTS.md` に従います。

---

## Document Reading Order

作業前には、原則として次の順で文書を参照します。

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

---

## Core Documents

このプロジェクトの中核文書は次のとおりです。

- `README.md`
- `AGENTS.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/PHASES.md`
- `docs/CHECKPOINTS.md`
- `docs/COMPLETION_CRITERIA.md`
- `docs/RUNBOOK.md`（後日再開・起動・確認・復旧の運用入口）

新規重要文書は次のとおりです。

- `docs/UI_SPEC.md`
- `docs/CONFIG_SCHEMA.md`
- `docs/EVENT_PROTOCOL.md`
- `docs/REVIEW_FLOW.md`
- `docs/AI_JSON_STUDIO_SPEC.md`
- `docs/IMPLEMENTATION_GUIDE.md`

---

## Status

現在の状態:

- Project status: 条件付きMVP完了（Phase 11 Completion Review の判定整理段階）
- Current phase: Phase 11 Completion Review
- Next focus: Completion Review 判定の確定と、Completion / Extension の二系統ロードマップ接続整理
- Completion roadmap: `docs/ROADMAP_TO_COMPLETION.md`（Conditional MVP Complete から Full Completion への基盤強化）
- Extension roadmap: `docs/ROADMAP_TO_EXTENSION.md`（MVP後の拡張計画）

---

## Quick Start

最小起動順:

1. backend: `npm run dev:backend`
2. frontend: `npm run dev:frontend`
3. 確認: `npm run check`

Overlay 表示専用入口:

- `http://localhost:5173/overlay/character`

保存ファイル:

- `data/queues/review-patch-queue.json`
- `data/queues/adopted-changes.json`
- `data/compile/history.json`

---

## Known Constraints

- compile は段階実装中で、確認版導線と本処理導線を分離して扱う
- Overlay は表示専用の最小導線であり、AppShell / テストUI / 履歴は表示しない
- YouTube Live Chat 本接続、OBS 自動設定、音声合成は未実装

---

## Notes

- VTuner は主にリスナーコメントに反応します
- アプリ内部に AI は存在しません
- 外部ブラウザ AI は、設定生成と定義生成のための支援先です
- JSON は検証成功なら基本本採用です
- エラー時は再修正プロンプトを生成します
