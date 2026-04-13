# 15_AGENT_WORKFLOW.md

## Purpose

本書は、VTuner リポジトリ内で IDE agent / Codex が作業する際の基本ルールを定義する。  
目的は次のとおり。

- 仕様と実装のズレを減らす
- agent が勝手に広げすぎることを防ぐ
- 変更単位を小さく保つ
- 先に文書と契約を読み、後からコードを書く流れを固定する

---

## Scope of Work

- 作業対象はリポジトリ直下配下のみとする
- 他プロジェクトや親ディレクトリには触れない
- 既存構造を壊すような移動・大量改名は行わない

---

## Reading Order Before Implementation

agent は実装前に、少なくとも次の順で文書を読むこと。

1. `docs/00_PROJECT_CHARTER.md`
2. `docs/01_SYSTEM_OVERVIEW.md`
3. `docs/12_EVENT_PROTOCOL.md`
4. `docs/13_CONFIG_SCHEMA.md`
5. 対象機能に対応する個別仕様

補足:
- 上位仕様に反する実装は行わない
- 不足がある場合は勝手に確定せず、Open Questions として扱う

---

## Core Working Principle

### 1. 1変更 = 1責務
1回の変更では、責務を混ぜすぎない。

例:
- イベント型追加
- テストUI追加
- レビュー一覧の絞り込み追加

を同時に大きく混ぜない。

### 2. 先に契約、次に実装
イベントや設定が関わる変更は、先に protocol / schema を確認する。

### 3. 仕様未確定を実装で埋めない
仕様にない機能を「便利そうだから」で勝手に追加しない。

### 4. 暫定実装は明示する
一時的な実装を入れる場合は、TODO または明示的コメントを残す。

---

## Preferred Change Order

変更時の基本順序は次のとおり。

1. 仕様確認
2. 型 / schema / protocol 確認
3. 実装変更
4. 必要なテスト追加
5. 関連文書更新

---

## Files That Must Be Kept In Sync

### Event changes
変更対象:
- `12_EVENT_PROTOCOL.md`
- event schema / 型定義
- frontend / backend の利用箇所

### Config changes
変更対象:
- `13_CONFIG_SCHEMA.md`
- validator / schema
- 関連UI
- backend 読み込み処理

### UI changes
変更対象:
- `10_FRONTEND_SPEC.md`
- 対象画面の実装
- 必要なら acceptance criteria

### Review / Patch changes
変更対象:
- `14_REVIEW_AND_PATCH_FLOW.md`
- review UI
- patch 処理

---

## Forbidden Behaviors

agent は次を行わないこと。

- 勝手に大規模リネームする
- 仕様にない画面を増やす
- JSON schema を変えたのに文書を更新しない
- frontend で backend 責務を肩代わりする
- backend で UI 表現を過剰に持つ
- 実験コードを大量に常設化する
- 一括巨大実装を先に流し込む

---

## Preferred Output Style

- 差分は小さく保つ
- 意図が分かる命名にする
- 型安全性を優先する
- event / config の境界を崩さない
- 初期段階では安定性優先

---

## Handling Unknowns

仕様に未確定部分がある場合は、次の優先順で扱う。

1. 上位文書に明示があるか確認
2. 既存の実装方針に整合するか確認
3. それでも不明なら Open Question として残す
4. 勝手な拡張で埋めない

---

## Commit / Patch Direction

推奨される変更単位:

- 文書だけ
- schema だけ
- frontend の小変更
- backend の小変更
- review の小変更

大きな変更は、可能なら複数段階に分ける。

---

## Initial Quality Bar

初期段階では次を優先する。

- 仕様とズレない
- 動作が単純で安定している
- 変更理由が追いやすい
- review / patch / AI補助へ後から広げやすい

---

## Summary

IDE agent / Codex は、VTuner を「思いつきで広げる対象」ではなく、  
既存仕様に従って段階的に積み上げる対象として扱う。  
先に文書と契約を確認し、責務ごとに小さく変更し、必要な同期更新を必ず行うこと。
