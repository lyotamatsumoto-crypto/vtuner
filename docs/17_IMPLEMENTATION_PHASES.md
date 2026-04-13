# 17_IMPLEMENTATION_PHASES.md

## Purpose

本書は、VTuner の実装を小さな単位に分けて、IDE agent / Codex が安全に進められるようにするための実装フェーズ文書である。

本書の目的は次のとおり。

- 本仕様を前提に、実装順を整理する
- 「MVP専用の捨て実装」を避ける
- frontend / backend を粗く二分せず、責務ごとに分割する
- 1フェーズごとの完了条件を明確にする
- Codex が一度に広く触りすぎないようにする

---

## Basic Policy

- フェーズは本仕様を前提に切る
- 各フェーズは「将来捨てない部品」を作ることを目指す
- 1フェーズで扱う責務はできるだけ絞る
- 大きな実装を一度にまとめて行わない
- 仕様未確定の部分は TODO や保留として残し、勝手に拡張しない
- フェーズごとに「触ってよい範囲」と「触らない範囲」を意識する

---

## Current Working Assumptions

現時点では、次の前提で実装を進める。

- 配信中のコア挙動はルールベース
- AI は設定JSON生成や patch 候補生成の補助に限定する
- UI は当面日本語固定
- front / side のみ扱い、back は初期採用しない
- side は mirror で左右反転利用する
- 画面は 3画面構成とする
- 実装前に docs と schemas を優先的に参照する
- Codex は変更作成のみ担当し、`git add` / `git commit` / `pytest` / `git push` はユーザーが行う

---

## Screen Targets

frontend は次の 3画面を対象とする。

1. Preview / Test
2. Personality / Speech / Reaction Settings
3. Review

この構成は、現時点の本仕様の基本画面構成として扱う。

---

## Phase Structure Overview

### Phase 1
Repository / Docs / Schema Baseline

### Phase 2
Event Protocol and Config Loading Foundation

### Phase 3
Preview / Test Screen Skeleton

### Phase 4
Personality / Speech / Reaction Settings Screen

### Phase 5
Backend Runtime Skeleton

### Phase 6
Frontend-Backend Wiring

### Phase 7
Review Screen Minimum Flow

### Phase 8
Voice Minimum Flow

### Phase 9
Polish / Consistency / Acceptance Pass

---

# Phase 1 — Repository / Docs / Schema Baseline

## Goal

リポジトリの土台、仕様文書、設定構造の骨組みを揃える。

## In Scope

- フォルダ構成
- README
- AGENTS
- Project Charter
- System Overview
- Frontend Spec
- Event Protocol
- Config Schema
- Review / Patch Flow
- Acceptance Criteria
- Implementation Phases

## Out of Scope

- 本格実装コード
- UI コンポーネント実装
- runtime ロジック
- 音声実装
- review 実動作

## Done When

- 基本MD群が揃っている
- 各文書の役割が矛盾していない
- frontend / backend / config / review の大枠が把握できる

---

# Phase 2 — Event Protocol and Config Loading Foundation

## Goal

frontend / backend 間で共有するイベント契約と設定読込の基礎を整える。

## In Scope

- event 型の定義
- event schema / zod の土台
- config block の読込入口
- 設定ファイル構造の整理
- personality / behavior / templates / appearance の読込単位

## Out of Scope

- 本格的なコメント分類
- UI 完成
- review UI
- AI 補助実装

## Done When

- イベント型が定義されている
- personality / behavior / templates / appearance を個別に読み込める
- 壊れた設定を検出できる足場がある

---

# Phase 3 — Preview / Test Screen Skeleton

## Goal

YouTube風の簡易プレビュー / テスト画面の骨組みを作る。

## In Scope

- 画面1の基本レイアウト
- YouTube風コメントエリアの骨組み
- 縦長プレビュー枠
- VTuner の表示領域
- VTuner のドラッグ移動
- 初期位置は右下
- 下部ログエリアの枠
- テスト入力欄の枠
- 疑似イベント欄の枠

## Out of Scope

- 高度なスタイル調整
- 完全な音声再生
- review 機能
- 高度な event 処理

## Done When

- 画面1の基本レイアウトが表示される
- VTuner の仮表示ができる
- ドラッグ移動できる
- ログ / コメント / プレビューの役割が視覚的に分かる

---

# Phase 4 — Personality / Speech / Reaction Settings Screen

## Goal

画面2の設定UI骨組みを作る。

## In Scope

- Personality セクション
- Speech Style セクション
- Reaction Categories セクション
- Time Events セクション
- Name Events セクション
- AI Assist セクション
- Radar / Label / Example Preview セクション

## Out of Scope

- 実際のAI連携
- review 反映
- 高度な validation 表示
- backend との完全接続

## Done When

- 各セクションのフォームUIがある
- スライダー / 入力欄 / 選択欄が並ぶ
- レーダー / ラベル / 例文の仮表示が確認できる
- JSON 取込枠の入口がある

---

# Phase 5 — Backend Runtime Skeleton

## Goal

backend 側で最小限の runtime 流れを作る。

## In Scope

- WebSocket サーバー骨組み
- test_comment_submit の受信
- 最小限のカテゴリ判定
- vtuner_message の生成
- vtuner_state の返却
- vtuner_debug の返却
- runtime state の最小管理

## Initial Category Scope

- greeting
- praise
- question
- laugh
- topicPrompt
- system
- unknown

## Out of Scope

- 本番プラットフォーム接続
- 高度なキュー最適化
- AI利用
- review patch compile

## Done When

- テストコメントを受け取れる
- 最低限のカテゴリへ分類できる
- vtuner_message を返せる
- unknown を vtuner_debug で返せる

---

# Phase 6 — Frontend-Backend Wiring

## Goal

画面1と backend の最小実行ループをつなぐ。

## In Scope

- frontend から test_comment_submit を送る
- backend から vtuner_message を受ける
- frontend で吹き出し表示
- front / side の向き切替
- ログ表示
- 逐次キュー処理
- unknown を表示しない方針の反映

## Queue Policy

初期段階では次を基本とする。

- vtuner_message は 1つずつ処理する
- 並列発話はしない
- 溢れた場合は低優先度から捨てる
- unknown はキューに積まない

## Out of Scope

- 本番コメント接続
- 高度な state recovery
- review 連動

## Done When

- 画面1から送ったテストコメントに反応する
- VTuner の表示とログが連動する
- 逐次処理が崩れない

---

# Phase 7 — Review Screen Minimum Flow

## Goal

配信後レビューの最小構成を作る。

## In Scope

- review 画面骨組み
- comment state 一覧
- unknown フィルタ
- ignore
- add to existing category
- hold as new candidate
- 一括操作の最小版

## Out of Scope

- 高度なクラスタリング
- compile 実装の完成
- AI patch 自動生成

## Done When

- unknown を一覧表示できる
- ignore できる
- 既存カテゴリへ追加できる
- 保留できる

---

# Phase 8 — Voice Minimum Flow

## Goal

音声の最小実装を追加する。

## In Scope

- 音声ON/OFF
- 声選択
- テスト再生
- vtuner_message の音声再生

## Out of Scope

- 話速 / ピッチ調整
- カテゴリ別音声制御の細分化
- 外部音声エンジン高度連携

## Done When

- 声を1つ以上選べる
- テスト再生ができる
- vtuner_message に応じて読み上げられる

---

# Phase 9 — Polish / Consistency / Acceptance Pass

## Goal

ここまでの部品の整合をとり、受け入れ条件に照らして不足を埋める。

## In Scope

- 用語統一
- 画面間の整合
- docs の更新
- acceptance criteria の確認
- 不要な仮実装の整理
- review / settings / preview のつながり確認

## Out of Scope

- 新機能の大幅追加
- スコープ拡張
- 本番配信連携の拡張

## Done When

- 主要画面がつながっている
- 用語が揃っている
- docs と実装が大きくずれていない
- 初期受け入れ条件を満たす

---

## Execution Guidance for Codex

Codex に実装を依頼する際は、次を守る。

- 一度に 1 phase または 1 phase の一部だけ依頼する
- phase をまたいで広く触らせない
- docs と schema を先に参照させる
- UI ラフがある場合は、それを前提にする
- 仕様未確定の部分は勝手に拡張させない
- 変更対象ファイルを明示する
- リポジトリ外に出ないことを守らせる

---

## Recommended Next Steps

現時点では、次の順序を推奨する。

1. AGENTS.md を確定する
2. UIラフを Gemini canvas などで作る
3. `docs/ui/` 相当の形で画面ラフ情報を保存する
4. Phase 2 から順に Codex に依頼する

---

## Summary

本プロジェクトでは、MVP 専用の仮設計に止まるのではなく、  
本仕様の部品を小さな実装単位で積み上げていく。

そのため、実装は frontend / backend の大きな二分ではなく、  
docs / schema / preview / settings / runtime / review / voice など、  
責務ごとの phase に分けて進める。