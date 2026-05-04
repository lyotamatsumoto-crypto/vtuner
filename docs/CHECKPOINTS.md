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
- backend 側契約の真正な一本化（`backend/src/contracts` と `schemas/` の単一ソース化）は Phase 10-3 時点では未完了で、後続課題として保持していた

### Residual handoff（Completion Review 前）
- 今やる: なし（Phase 10 の範囲では整合確認と最小文書同期を優先し、大規模構造変更は行わない）
- Completion Review に持ち込む:
  - compile が「確認版最小導線」であること
  - backend 保存導線はあるが、本番完成版（厳格 validation / retry / 競合制御）ではないこと
  - Review / Detailed Rules / compile history の最小保存導線を「MVP達成」とするかの最終判断
- 後続送り:
  - backend 契約の真正な一本化（`backend/src/contracts` と `schemas/reviewCompile/*` の単一ソース化。C1-3 時点で整理済み）
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

### Review snapshot（Phase 11 実施時点）
- 5 画面 skeleton は責務分離を維持したまま実装済み
- Preview / Test は最小 runtime wiring と確認導線を実装済み（確認版）
- Basic Settings → Preview / Test の最小反映導線は実装済み
- Review → Detailed Rules → Adopted Changes → compile 前確認 → compile 履歴の最小導線は実装済み
- Review Patch Queue / Adopted Changes / compile history は backend PUT で local JSON へ最小保存可能
- compile は frontend 確認版最小導線（履歴保存あり）であり、本体 runtime 反映の高度化は後続課題
- backend 契約の真正な一本化（`backend/src/contracts` と `schemas/` の単一ソース化）は Phase 11 時点では未完了だったが、Completion Roadmap C1-3 時点で整理済み

### Done criteria
- 完成または継続判断が説明できる
- 未解決事項が整理されている

### Stop if
- 一度動いただけで完成扱いしている
- docs 不足で再開できない

---

## Completion Roadmap C1 Checkpoints: Contract SSOT

### Check items
- Review / Compile 系 contract の正が `schemas/reviewCompile/*` にある
- `backend/src/contracts/*` は契約本体ではなく `schemas/dist/reviewCompile/*` への re-export façade である
- `schemas` は独立 build unit として `schemas/dist` を生成する
- backend build は `../schemas` を compile 対象に含めず、backend 本体中心の output になる

### Verified snapshot（C1-3 時点）
- `npm run check` passed
- `npm run build:schemas` passed
- `npm run build:backend` passed
- `schemas/dist/reviewCompile` が存在する
- `backend/dist/schemas` が存在しない
- `backend/dist` は `index` / `contracts` / `storage` 中心の出力である
- Windows sandbox では `clean:backend` が `EPERM` になる場合がある

### Done criteria
- frontend / backend の Review / Compile 系 contract 参照元を説明できる
- `backend/src/contracts` が新しい契約源として増殖していない
- backend dist に `schemas` が混ざらない

### Stop if
- 契約型を `backend/src/contracts` 側で再定義し始める
- backend build のために `../schemas/**/*.ts` を backend compile 対象へ戻す必要が出る
- C1 の範囲を超えて compile 本処理化や storage safety 強化へ進み始める

---

## Completion Roadmap C2 Checkpoints: AI JSON Import Queue and Validation Flow

### Check items
- 人格 JSON の validation 成功 / 失敗が AI / JSON Studio 上で判別できる
- validation 成功時に AI JSON Import Queue へ登録できる
- AI JSON Import Queue と Review Patch Queue が separate に扱われる
- validated item を Adopted Changes へ採用できる
- validation_failed item は採用不可である
- adopted / discarded item の再操作を最小制御できる
- 採用時に Adopted Changes と AI JSON Import Queue の backend 保存が維持される

### Verified snapshot（C2 close patch 時点）
- C2-1: validation 表示（`validation_ok`, `error_messages`）と queue 可視化を整理済み
- C2-2: AI JSON Import Queue から Adopted Changes への最小採用導線を実装済み
- Review Patch Queue 側の導線と保存挙動には変更なし
- `npm run check` passed

### Done criteria
- AI / JSON Studio 上で validation / queue / 採用前段を説明できる
- C3（compile production path）へ進む前提が揃っている

### Stop if
- AI / JSON Studio が Detailed Rules の正式編集責務を持ち始める
- queue 導線が混線してどちら由来の採用か説明できなくなる

---

## Completion Roadmap C3 Checkpoints: Compile Production Path（最小完了）

### Check items
- Adopted Changes から compile 入力（precheck）を作れる
- compile 実行で runtime config 相当データ（`compiledRuntimeEntries`）を生成できる
- runtime entry が最新 compile 実行ID（`compile_record_id`）を持つ
- Detailed Rules で compile history と runtime entry の対応を最小確認できる
- Preview / Test で最新 compile 反映結果を確認できる
- Overlay は既存の表示専用参照を維持している

### Verified snapshot（C3-2 close patch 時点）
- C3-1: `compiledRuntimeEntries` を compile 後 runtime 参照データとして可視化済み（source_lane 含む）
- C3-2: 各 runtime entry に `compile_record_id` を付与し、最新 compile レコードとの対応を UI で確認可能
- compile history 保存導線は維持
- `npm run check` passed

### Done criteria（C3 最小完了）
- compile 後反映先を frontend 確認版として説明できる
- compile history と runtime entry の関係を最小で説明できる
- production compile engine 未実装である境界を docs/UI で明示できる

### Out of scope（C3 時点）
- backend compile API
- backend compile 実行
- runtime config 永続保存
- 過去履歴ごとの runtime entry 復元

### Stop if
- compile の意味（確認版 / 本処理）が曖昧になる
- 5 画面責務分離を崩す必要が出る

---

## Completion Roadmap C4 Checkpoints: Storage Safety（最小完了）

### Check items
- queue / compile の保存前 validation が最小強化されている
- 壊れた JSON / 不正 shape は fail-close で扱う
- missing file のみ空配列として扱う
- 保存失敗時に frontend 表示維持 + backend 未反映が分かる
- 自動修復 / 自動上書きを行わない

### Verified snapshot（C4-1 close patch 時点）
- `queueStorage.ts` で status / lane / type などの許容値チェックを追加
- `compileStorage.ts` で compile status / target kinds の許容値チェックを追加
- `StorageValidationError` を維持し、読込時の fail-close 方針を継続
- `npm run check` passed

### Verified snapshot（C4-2 close patch 時点）
- data 保存場所（queues / compile history）を docs に明記
- 壊れた JSON / 不正 shape は fail-close、missing file のみ空配列扱いを docs に明記
- 手動 backup / snapshot 手順と復旧時の確認ポイントを docs に明記
- retry / lock / 競合制御が未実装であることを docs に明記

### Done criteria（C4 最小完了）
- 状態不明データのまま進まない最低限の安全性がある
- docs 上で fail-close、保存場所、手動復旧入口、未対応範囲（retry/競合制御）が説明できる

### Stop if
- payload 変更や API path 変更が必要になる
- 自動修復や自動上書きを入れないと成立しない
- DB 化や大規模 storage 再設計が必要になる

---

## Completion Roadmap C5 Checkpoints: Overlay / OBS Output（最小完了）

### Check items
- `/overlay/character` が表示専用ルートとして分離されている
- Overlay は AppShell / サイドバー / TopBar を表示しない
- 背景透明でキャラクターと吹き出し中心の表示になっている
- `show_stage_label=false` / `show_preview_overlay_label=false` を維持している
- compile 前反映待ち / compile 後反映済みの見方を説明できる
- OBS Browser Source 手順が docs にある

### Verified snapshot（C5-1 close patch 時点）
- App は `/overlay/character` のとき AppShell ではなく `OverlayCharacterPage` を直接表示する
- Overlay は `CharacterStage` を再利用し、透明背景で表示専用の最小出力を維持
- compile 後 entry がある場合は `compiledRuntimeEntries` を参照して表示する
- Preview / Test は確認 UI、Overlay は表示専用出力という境界を docs に明記
- OBS Browser Source の URL 例と最小手順を docs に追加

### Done criteria（C5 最小完了）
- OBS 用表示専用ルートとして `/overlay/character` を説明できる
- Preview / Test と Overlay の責務境界を docs と実装で説明できる
- 後続課題（YouTube 連携 / 音声合成 / 複数キャラ等）を未実装として明示できる

### Stop if
- Overlay に操作 UI を追加しないと成立しない
- Preview / Test をそのまま OBS 用に流用しないと成立しない
- backend / schemas 変更が必要になる

---

## Phase 12+ Checkpoints: Extension Roadmap

### Check items
- `ROADMAP_TO_EXTENSION.md` の優先順に沿っている
- Completion 基盤課題を扱う場合は `ROADMAP_TO_COMPLETION.md` を参照している
- 5画面責務（Basic Settings / Preview / Review / Detailed Rules / AI JSON Studio）を崩していない
- MVP範囲と拡張範囲の境界が docs 上で明示されている
- compile 確認版と本処理高度化の区別が維持されている
- Overlay は表示専用ルートで、Preview / Test の確認UIを含めない

### Done criteria
- 追加対象が最小単位で導入され、既存導線を壊していない
- 未完項目と後続送り項目が文書で追える

### Stop if
- 画面責務が混線する
- 拡張のためにMVP基盤を大規模に崩す必要がある
