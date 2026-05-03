# CHECKPOINTS.md

## Purpose

本書は、このプロジェクトにおける各 Phase の確認項目、完了条件、レビュー観点、停止判断の基準を定義する文書である。  
実装、修正、Phase 移行は、常に `PHASES.md` と本書を参照して判断すること。

---

## Checkpoint Policy

- 各 Phase には確認項目と完了条件を持たせる
- 完了条件を満たさない限り次へ進まない
- 未確認事項は未確認として明示する
- pytest や Git 操作はユーザー担当であり AI 完了条件に含めない
- 重大な未解決事項がある場合は完了扱いせず停止または保留とする
- 動いただけでは完了とみなさず、目的、範囲、文書整合も確認する

---

## Global Review Axes

### 1. Scope
- 現在 Phase の範囲内で作業しているか
- 次 Phase を先取りしていないか
- 不要な拡張をしていないか

### 2. Document alignment
- `AGENTS.md` に反していないか
- `PROJECT_OVERVIEW.md` に反していないか
- `PHASES.md` の対象範囲と一致しているか
- UI / config / event / review / AI JSON の仕様と矛盾していないか

### 3. Change safety
- 最小差分で進めているか
- 既存構造を不必要に壊していないか
- 大規模変更を勝手に行っていないか

### 4. Implementation clarity
- 何を変更したか説明できるか
- 未解決事項が整理されているか
- 次の作業が明確か

### 5. User responsibility boundary
- pytest 実行を AI 完了条件に含めていないか
- Git / GitHub 実操作を AI 側に含めていないか
- ユーザー承認が必要な事項を勝手に確定していないか

### 6. Screen responsibility separation
- 5 画面の責務が混線していないか
- Detailed Rules と AI / JSON Studio の境界が崩れていないか
- Review と compile の関係が崩れていないか

---

## Phase 1 Checkpoints: Project Foundation

### Check items
- 中核 md が揃っている
- 重要仕様文書が揃っている
- internal AI を使わない前提が明文化されている
- 5 画面構成が明文化されている
- compile の意味が定義されている

### Done criteria
- VS Code AI に渡す文書土台が揃っている
- 文書の役割が衝突していない
- 仕様の大枠が口頭ではなく md に落ちている

### Stop if
- 中核文書が不足している
- AI / JSON ワークフローが未定義
- 5 画面責務が曖昧
- compile の意味が曖昧

---

## Phase 2 Checkpoints: Workspace and Contract Baseline

### Check items
- 初期フォルダ構成が作成されている
- docs が配置されている
- config schema と event protocol の枠組みがある
- queue の概念が定義されている
- compile 反映先が定義されている

### Done criteria
- VS Code AI が文書を読みながら実装を始められる
- event / config / queue の前提が崩れていない

### Stop if
- 契約面が曖昧
- queue の意味が不統一
- event と compile の関係が不明

---

## Phase 3 Checkpoints: Preview / Test Skeleton

### Check items
- Main Preview がある
- VTuner 配置確認ができる
- front / side / mirror がある
- コメントテスト入力がある
- 条件イベントテストがある
- テスト履歴がこの画面専用である

### Done criteria
- 見た目確認と挙動検証の画面として成立している
- Basic Settings や Review の責務を持ち込んでいない

### Stop if
- 共通設定編集を混ぜている
- 実運用 review ログと混ぜている

---

## Phase 4 Checkpoints: Basic Settings Skeleton

### Check items
- 基本プロフィールがある
- 基本性格がある
- 視聴者向け方針がある
- 配信者向け方針がある
- 口調と禁止表現がある
- 音声、画像、吹き出し、カテゴリ ON / OFF がある

### Done criteria
- 共通土台の画面として成立している
- 定義追加や JSON 生成を主操作として混ぜていない

### Stop if
- 新規定義追加を主操作にしている
- Detailed Rules や AI / JSON Studio と混線している

---

## Phase 5 Checkpoints: Review Skeleton

### Check items
- unknown / skipped / displayed / ignored がある
- コメント一覧がある
- ignore / existing category / new candidate がある
- patch candidate area がある

### Done criteria
- 配信後整理の画面として成立している
- 正式編集と分離されている

### Stop if
- 正式編集を始めている
- compile を直接ここで行っている

---

## Phase 6 Checkpoints: Detailed Rules Skeleton

### Check items
- ルール一覧がある
- ルール編集ができる
- 候補文編集ができる
- 手動追加がある
- patch 採用導線がある
- プリセット派生編集がある

### Done criteria
- 正式編集画面として成立している
- AI / JSON Studio との境界が明確である

### Stop if
- 生成、検証、再修正の主フローをここへ持ち込んでいる
- Basic Settings と混線している

---

## Phase 7 Checkpoints: AI / JSON Studio Skeleton

### Check items
- 生成対象タブがある
- 左右 2 カラム構造である
- かんたん入力 / 詳細入力がある
- プロンプト生成がある
- JSON 取込がある
- JSON 検証がある
- エラー修正プロンプト生成がある
- 差分要約がある
- 採用がある
- 履歴がある
- マイプリセット化がある

### Done criteria
- 外部 AI 用支援画面として成立している
- 非プログラマでも使える導線になっている
- 詳細編集の主操作を持ち込んでいない

### Stop if
- Detailed Rules と区別がつかない
- スキーマ検証がない
- エラー修正導線がない

---

## Phase 8 Checkpoints: Runtime Wiring

### Check items
- コメント反応が成立している
- 条件イベントが最低限動く
- category / reply / target / orientation などが反映される
- compile 後に本体へ反映される

### Done criteria
- VTuner runtime が最低限成立している
- docs と event/config が大きく矛盾しない

### Stop if
- internal AI 前提になっている
- compile 後も runtime に反映されない

---

## Phase 9 Checkpoints: Review to Compile Flow

### Check items
- Review Patch Queue がある
- AI JSON Import Queue がある
- Adopted Changes がある
- compile 実行がある
- compile 履歴がある

### Done criteria
- 採用済み差分を本体へ反映できる
- compile 意味が docs と一致している

### Stop if
- queue が混線している
- compile の意味が実装で変質している

---

## Phase 10 Checkpoints: Validation and Consistency

### Check items
- docs と実装の整合がある
- 5 画面責務が守られている
- queue / compile / JSON ワークフローが一致している
- 用語が揃っている

### Progress snapshot（Phase 10-3 時点）
- Phase 9.6 で Review Patch Queue / Adopted Changes / compile history の最小保存導線（backend PUT + local JSON 保存）が通っている
- Review は candidate 作成、Detailed Rules は採用と compile 前確認、compile は確認版最小導線、という責務分離を維持している
- frontend 側の共有契約参照は `schemas/` 経由へ整理済み
- backend 側契約の真正な一本化（`backend/src/contracts` と `schemas/` の単一ソース化）は未完了で、後続課題として保持する

### Residual handoff（Completion Review 前）
- 今やる: なし（Phase 10 の範囲では整合確認と最小文書同期を優先し、大規模構造変更は行わない）
- Completion Review に持ち込む:
  - compile が「確認版最小導線」であること
  - backend 保存導線はあるが、本番完成版（厳格 validation / retry / 競合制御）ではないこと
  - Review / Detailed Rules / compile history の最小保存導線を「MVP達成」とするかの最終判断
- 後続送り:
  - backend 契約の真正な一本化（`backend/src/contracts` と `schemas/reviewCompile/*` の単一ソース化）
  - compile 本処理の高度化と runtime への本体反映

### Done criteria
- 実装と docs のズレが大きくない
- 再開しやすい状態である

### Stop if
- docs と実装が大きく乖離している
- 画面責務が崩れている

---

## Phase 11 Checkpoints: Completion Review

### Check items
- 当初目的に対して成果が出ている
- 5 画面が成立している
- JSON 生成、検証、採用が成立している
- compile が成立している
- 非プログラマでも再開できる

### Done criteria
- 完成または継続判断が説明できる
- 未解決事項が整理されている

### Stop if
- 一度動いただけで完成扱いしている
- docs 不足で再開できない
