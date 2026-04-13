# AGENTS.md

## Purpose

このファイルは、VTuner リポジトリ内で作業する IDE agent / Codex 向けの行動ルールを定義する。
目的は、作業範囲を明確にし、仕様と実装のズレ、不要な変更、リポジトリ外への逸脱を防ぐことにある。

---

## Repository Boundary

### Absolute Rule
- 作業対象は **このリポジトリ配下のみ** とする。
- リポジトリのルートは `C:\WORK\Projects\vtuner` である。
- **`C:\WORK\Projects\vtuner` の外にファイルやフォルダを作成・変更・削除しないこと。**
- 親ディレクトリ、兄弟ディレクトリ、他プロジェクト、ユーザー環境の既存ファイルには触れないこと。
- 一時ファイル、ログ、キャッシュ、生成物も原則としてリポジトリ配下に閉じること。

### Do Not
- リポジトリ外へ移動して作業しない
- 他プロジェクトの設定を流用しない
- 上位ディレクトリに設定ファイルを作らない
- 勝手にグローバルな設定変更をしない

---

## Current Human / Agent Role Split

### Codex / Agent Does
- ファイル作成
- コード修正
- 文書修正
- 構造整理
- 必要最小限のテストコード追加
- 指定範囲内での差分作成

### User Does
- 差分確認
- `git add`
- `git commit`
- `pytest` などの実行確認
- 最終動作確認
- `git push`
- GitHub 側の作業

### Important Rule
- **agent は `git add` / `git commit` / `git push` を行わないこと。**
- **agent はテスト実行の最終責任を持たない。**
- 実行系の確認はユーザーが行う前提で作業すること。

---

## Document Priority

仕様が競合した場合は、次の順で優先する。

1. `docs/00_PROJECT_CHARTER.md`
2. `docs/03_ARCHITECTURE_DECISIONS.md`
3. `docs/12_EVENT_PROTOCOL.md`
4. `docs/13_CONFIG_SCHEMA.md`
5. `docs/10_FRONTEND_SPEC.md`
6. `docs/11_BACKEND_SPEC.md`
7. `docs/14_REVIEW_AND_PATCH_FLOW.md`
8. `docs/16_ACCEPTANCE_CRITERIA.md`
9. この `AGENTS.md`

補足:
- `AGENTS.md` は作業ルール文書であり、上位仕様を上書きしない。
- 仕様に不足があれば、勝手に最終決定せず TODO / Open Question として残す。

---

## Working Principles

### 1. Change Only What Is Necessary
- 1回の作業で触る責務はできるだけ小さくする。
- 指定されていない大規模リファクタはしない。
- 無関係なファイルまで巻き込まない。

### 2. Do Not Invent Hidden Scope
- 頼まれていない機能を足さない。
- 便利そうでも、仕様未確定の挙動を勝手に実装しない。
- UI文言やカテゴリを勝手に増やしすぎない。

### 3. Respect Current Architecture Direction
- 配信中コア挙動はルールベース優先
- AIは設定生成補助・レビュー補助
- frontend は表示・操作中心
- backend は分類・決定・状態管理中心
- 設定はブロック分割
- patch は差分として扱う

### 4. Prefer Explicitness
- 入力、出力、制約を明示する。
- 曖昧な「いい感じ」実装にしない。
- 必要ならコメントや TODO を残す。

---

## Initial Repository Areas

### Main Directories
- `frontend/`
- `backend/`
- `docs/`
- `schemas/`
- `assets/`
- `tools/`

### Expected Use
- `frontend/`: UI、表示、操作、音声再生
- `backend/`: コメント処理、分類、発話決定、イベント送信
- `docs/`: 仕様文書
- `schemas/`: JSON schema / Zod / 型契約
- `assets/`: キャラクター画像やUI素材
- `tools/`: 補助スクリプト

---

## Before Making Changes

作業前に、少なくとも次を確認すること。

1. 変更対象に対応する仕様文書を読む
2. その変更が frontend 側か backend 側か schema 側かを明確にする
3. 変更がリポジトリ外へ影響しないことを確認する
4. 変更対象以外を不用意に触らない方針を取る

---

## File Creation Rules

- 新しいファイルやフォルダは、本当に必要な場合だけ作る
- 作成場所はリポジトリ配下に限定する
- 文書ファイルを増やす場合は、既存の番号体系や役割を崩さない
- 生成物を出す場合は、後でユーザーが理解できる名前にする

---

## Code Change Rules

- 変更単位は小さく保つ
- 既存命名を尊重する
- 型や schema を追加した場合、関連文書も必要に応じて更新候補を示す
- 破壊的変更をする場合は、理由が明確でない限り避ける
- frontend / backend の責務を混ぜない

---

## Documentation Rules

- 文書は実装判断の基準として扱う
- 仕様未確定のものは断定しない
- TODO / Open Areas / Notes を活用する
- 文書とコードの責務境界を一致させる

---

## UI Language Policy

- 初期段階では、**UI 表示は日本語固定** を前提とする
- 多言語対応は現時点では主目的ではない
- 文言追加時も、まずは日本語で整理する

---

## Current Implementation Direction

現時点では、次の流れで進める。

1. 文書基盤を固める
2. event / config 契約を固める
3. UIラフや画面仕様を整理する
4. その後に小さい実装単位で frontend / backend を進める

### Important
- いきなり全面実装をしない
- 大きな単位で一気に完成を狙わない
- 本仕様に残る形で段階的に積み上げる

---

## When Unclear

不明点がある場合は次の方針を取る。

- 勝手に大きな機能追加で解決しない
- 仕様にない前提を増やさない
- TODO / Open Question として残す
- 既存文書の方向性を壊さない

---

## Summary

このリポジトリで作業する agent は、

- **`C:\WORK\Projects\vtuner` の外へ出ない**
- **変更作成までに責務を限定する**
- **Git操作と最終確認はユーザーが行う**
- **仕様文書を優先し、勝手に広げない**

ことを守る。
