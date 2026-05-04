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

## Completion Roadmap C6 Checkpoints: Runbook / Documentation Hardening（最小完了）

### Check items
- 後日再開時の入口が docs で分かる
- backend / frontend 起動手順が分かる
- check / build 手順が分かる
- data 保存場所と recovery 入口が分かる
- 5画面責務と Overlay 境界が分かる
- Review / AI JSON / Adopted Changes / compile の流れが分かる
- Overlay / OBS の読み込み手順が分かる
- 既知制限と次候補が分かる

### Verified snapshot（C6 close patch 時点）
- `docs/RUNBOOK.md` を新規作成し、運用再開情報を集約
- 保存場所（`data/queues/*`, `data/compile/history.json`）を実装準拠で明記
- fail-close / missing file / 手動 backup / 手動復旧の方針を明記
- Full Completion 未達と後続課題を明記

### Done criteria（C6 最小完了）
- 実装変更なしで、再開・起動・確認・復旧・次作業判断が docs だけで可能
- 「最小完了」と「Full Completion」の差が誤解なく説明できる

### Stop if
- package.json と手順が一致しない
- storage path が実装と一致しない
- 実装変更なしでは運用説明が成立しない

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

---

## Extension Phase 12 Checkpoints: Character Profile Foundation（local foundation）

### Check items
- Character Profile 管理 UI が Basic Settings 上部にある
- local state で保存 / 読み込み / 複製ができる
- 保存済み / 未保存 / 最終保存時刻が表示される
- 保存対象が `BasicPreviewBridgeSettings` の共有設定に限定されている
- Preview / Test への既存反映が維持されている

### Verified snapshot（Phase 12 local foundation 時点）
- `App.tsx` に Character Profile 最小型（id / name / savedAt / settings）を追加
- `BasicSettingsPage` に profile 選択・保存・複製 UI を追加
- 未保存判定は active profile settings と shared settings の比較で実装
- backend / schemas / compile / Overlay は未変更
- `npm run check` passed

### Done criteria（Phase 12 local foundation）
- Basic Settings 責務内で Character Profile 基礎運用ができる
- local foundation と後続課題（永続化・JSON連携）が区別して説明できる

### Stop if
- Basic Settings 以外へ大規模波及する
- shared settings を壊さないと成立しない
- backend API / schemas 変更が必要になる

---

## Extension Phase 13 Checkpoints: Read Aloud and Shared Blocking Rules（最小完了）

### Check items
- Preview / Test で読み上げのみモード ON / OFF を切り替えられる
- 読み上げのみ ON では runtime decide を通さず、入力文をそのまま吹き出し表示できる
- Basic Settings の既存禁止表現入力が shared settings に接続されている
- 通常モード / 読み上げのみモードの両方で NG 一致時に共通 block される
- NG 一致は `blocked`、runtime ignore は `ignored` として区別される
- Preview 履歴で `runtime` / `read_aloud` / `blocked` / `ignored` を区別表示できる
- 読み上げのみモードは Preview / Test の確認機能に限定され、Review へ送らない

### Verified snapshot（Phase 13 implementation patch 時点）
- `BasicPreviewBridgeSettings` に `bannedExpressions` を追加済み
- Basic Settings の既存「禁止表現」入力は shared settings 更新に接続済み
- Preview / Test に読み上げのみモード ON / OFF を追加済み
- NG 一致時は `blocked` として runtime 未実行・表示更新なし
- runtime decide の `ignore` は `ignored` として履歴で分離済み
- backend / schemas / compile / Overlay は未変更
- `npm run check` passed

### Done criteria（Phase 13 最小完了）
- Preview / Test 内で読み上げのみ確認経路が成立している
- 共通 NG block が通常モード / 読み上げのみモードに同じ基準で適用される
- `blocked` と `ignored` の意味が履歴上で混線せず説明できる
- Review / Detailed Rules / AI / JSON Studio / compile / Overlay へ責務を広げていない

### Stop if
- 読み上げのみ機能を Review 送信導線へ接続しないと成立しない
- NG block のために backend API / schemas 変更が必要になる
- `blocked` と `ignored` の境界が UI / docs で説明できなくなる
- 5 画面責務分離（Preview / Test と他画面）が崩れる

---

## Extension Phase 14 Checkpoints: Speech Target and Visual Direction（最小完了）

### Check items
- `viewerTargetFacing` / `streamerTargetFacing` / `allTargetFacing` が Basic Settings の shared settings として設定できる
- `sideImageFacing` が Basic Settings の shared settings として設定できる
- `sideImageFacing=viewer` は「side画像が視聴者・コメント側向き」を意味する
- `sideImageFacing=streamer` は「side画像が配信者側向き」を意味する
- Preview / Test で `speech_target -> targetFacing -> orientation / mirror` の順に表示向きが決まる
- targetFacing が `front` の場合は `orientation=front` + `mirror=mirrorEnabled`
- targetFacing が `side` の場合は `orientation=side`、`viewer` / `streamer` は `sideImageFacing` で mirror 判定する
- targetFacing が `side` かつ `speech_target=all` の場合は `mirror=mirrorEnabled` を使う
- `all` は helper 内の表示上の扱いに留め、runtime schema へ追加しない
- `read_aloud` は `viewer` 扱いで向き変換される
- `blocked` / `ignored` は表示方向を更新しない
- Overlay へは反映しない

### Verified snapshot（Phase 14 correction patch 時点）
- `BasicPreviewBridgeSettings` に `viewerTargetFacing` / `streamerTargetFacing` / `allTargetFacing` を追加済み
- `BasicPreviewBridgeSettings` に `sideImageFacing: "viewer" | "streamer"` を追加済み
- Basic Settings の見た目設定に「横向き画像の向き」select を追加済み
- Basic Settings の見た目設定に「視聴者向け / 配信者向け / 全体向けの表示向き」select を追加済み
- `resolveVisualDirection.ts` を追加し、Preview / Test の向き変換を集約済み
- 変換ルール:
  - `speech_target` から targetFacing（viewer/streamer/all）を選ぶ
  - targetFacing が `front`: `orientation=front`, `mirror=mirrorEnabled`
  - targetFacing が `side` + `viewer`: side画像 viewer向きなら false / streamer向きなら true
  - targetFacing が `side` + `streamer`: side画像 streamer向きなら false / viewer向きなら true
  - targetFacing が `side` + `all`: `mirror=mirrorEnabled`
- `blocked` / `ignored` は表示方向更新なしを維持
- `CharacterStage` / `CharacterDisplay` の props は未変更
- backend / schemas / compile / Overlay は未変更
- `npm run check` passed

### Done criteria（Phase 14 最小完了）
- Preview / Test で発話対象と targetFacing 設定の関係を確認できる
- side画像の向き解釈を Basic Settings から切り替えて挙動差を確認できる
- front/side の向き方針を発話対象ごとに Basic Settings で変更できる
- `all` を runtime schema へ追加せずに実装境界を維持できる
- `blocked` / `ignored` の既存方針を崩していない
- CharacterStage / CharacterDisplay の再利用方針を維持している

### Stop if
- `all` を runtime schema へ追加しないと成立しない
- CharacterStage / CharacterDisplay の props 変更が必要になる
- backend / schemas / compile / Overlay 変更が必要になる
- `blocked` / `ignored` の表示方向更新なし方針を維持できない

---

## Extension Phase 15-1 Checkpoints: Reaction Control Preview Foundation（最小完了）

### Check items
- `reactionFrequencyMode` / `replyLengthMode` / `defaultCharacterState` が Basic Settings の shared settings として設定できる
- Basic Settings に「反応コントロール（Preview 基礎）」UI があり、3項目を選択できる
- Preview / Test で反応頻度モード、発話長モード、現在のキャラ状態、状態理由を確認できる
- 状態ラベルが `blocked` / `ignored` / `read_aloud` / `runtime reply` / `defaultCharacterState` 優先順で決まる
- runtime 本格制御（実行間引き / 返答文加工）に進んでいない
- Phase 13 の `blocked` / `ignored` / `read_aloud` 挙動を壊していない
- Phase 14 の targetFacing / orientation / mirror 挙動を壊していない
- backend / schemas / compile / Overlay へ波及していない

### Verified snapshot（Phase 15-1 implementation patch 時点）
- `BasicPreviewBridgeSettings` に以下を追加済み:
  - `reactionFrequencyMode: "low" | "normal" | "high"`
  - `replyLengthMode: "short" | "normal" | "long"`
  - `defaultCharacterState: "normal" | "idle" | "reacting"`
- Basic Settings に「反応コントロール（Preview 基礎）」セクションを追加済み
- Preview / Test に reaction control の表示確認（モード / 状態 / 理由）を追加済み
- `resolveCharacterStateLabel.ts` を追加し、状態ラベル決定を集約済み
- `reactionFrequencyMode` は表示用途のみで runtime gate 未実装
- `replyLengthMode` は表示用途のみで返答文加工未実装
- `decideRuntimeEvent` 未変更、runtime schema 未変更
- backend / schemas / compile / Overlay は未変更
- `npm run check` passed

### Done criteria（Phase 15-1 最小完了）
- Basic Settings と Preview / Test の範囲で reaction control 基礎を確認できる
- runtime 本格制御へ踏み込まず、表示確認レイヤーとして説明できる
- Phase 13 / 14 の既存挙動（executionKind 区別と向き反映）を維持している
- 後続 Phase 15-2 / 15-3 へ安全に引き継げる

### Stop if
- reactionFrequency 反映のため runtime 実行間引きが必須になる
- replyLength 反映のため返答文加工が必須になる
- `decideRuntimeEvent` や runtime schema 変更が必要になる
- backend / schemas / compile / Overlay 変更が必要になる

---

## Extension Phase 15-2 Checkpoints: Reaction Frequency Runtime Gate（最小完了）

### Check items
- `applyReactionFrequencyGate()` が Preview / Test 専用 helper として存在する
- `reactionFrequencyMode=low` のときだけ deterministic gate を適用する
- `reactionFrequencyMode=normal` / `high` は既存挙動を維持する
- low gate は `runtimeDecision.kind=reply` のみを対象にする
- low gate 対象キーワード（雰囲気 / 共感 / 静か / 褒め）を持つ低優先度 reply のみに限定する
- 保護条件（question / greeting / `speech_target=streamer` / `test_event_input` / blocked / read_aloud / 既存 ignore）を維持する
- gate 適用時は `IgnoreDecision` へ変換し、runtime schema を変更しない
- gate による ignored と通常 ignored を detail / reason で区別できる
- runtime schema / backend / compile / Overlay へ広げていない

### Verified snapshot（Phase 15-2 implementation patch 時点）
- `frontend/src/features/previewTest/applyReactionFrequencyGate.ts` を追加済み
- Preview / Test のコメント runtime フローで `decideRuntimeEvent()` 直後に gate を適用済み
- `reactionFrequencyMode=low` のみ gate 適用、`normal` / `high` は透過
- gate 適用時は `IgnoreDecision` 形へ変換（`related_rule: reaction_frequency_low_gate`）
- Preview / Test で `gateApplied` / `gateReasonLabel` を表示済み
- 履歴 detail で gate 理由を追跡可能
- `decideRuntimeEvent` 本体は未変更
- runtime schema / backend / compile / Overlay は未変更
- `npm run check` passed

### Done criteria（Phase 15-2 最小完了）
- low mode のみ runtime gate が deterministic に動作する
- normal / high の既存挙動が維持される
- 保護対象（question / greeting / streamer / event / blocked / read_aloud）を潰していない
- ignored の見え方で gate 適用有無を説明できる
- Phase 15-3（reply length 制御）へ境界を保ったまま引き継げる

### Stop if
- low gate 実装のため runtime schema 変更が必要になる
- gate 実装のため backend / compile / Overlay 変更が必要になる
- deterministic 判定を維持できない
- 保護条件（question / greeting / streamer / event / blocked / read_aloud）を維持できない

---

## Extension Phase 15-3 Checkpoints: Reply Template Length Selection Foundation（最小完了）

### Check items
- `replyTemplates.ts` が存在し、`category × length` の plain object で構成されている
- `applyReplyLengthTemplate()` が Preview / Test 専用 helper として存在する
- `replyLengthMode=normal` は既存 `reply_text` を維持する
- `replyLengthMode=short` / `long` のときのみ template 適用を試みる
- template 適用時は `reply_text` だけを差し替え、他 field は維持する
- category 未解決または template 欠落時は既存文を維持する
- `blocked` / `read_aloud` / `ignored` / low gate ignored を template 適用対象外として保護する
- Preview / Test で `templateApplied` / `templateCategory` / `templateLength` / `templateReasonLabel` を確認できる
- runtime schema / backend / compile / Overlay へ広げていない

### Verified snapshot（Phase 15-3 implementation patch 時点）
- `frontend/src/features/previewTest/replyTemplates.ts` を追加済み
- `frontend/src/features/previewTest/applyReplyLengthTemplate.ts` を追加済み
- `replyTemplates` は `greeting` / `compliment` / `question` / `empathy` × `short` / `normal` / `long` の構造
- コメント runtime フローで `applyReactionFrequencyGate()` の後に `applyReplyLengthTemplate()` を適用済み
- `replyLengthMode=normal` は既存 `reply_text` を維持する実装
- `replyLengthMode=short` / `long` は category 解決時のみ `reply_text` を差し替える
- schema 変更なし、`reply_text` 以外の field 変更なし
- `decideRuntimeEvent` / `applyReactionFrequencyGate` 本体は未変更
- runtime schema / backend / compile / Overlay は未変更
- `npm run check` passed

### Done criteria（Phase 15-3 最小完了）
- `replyTemplates[category][length]` から選ぶ土台が成立している
- `normal` 既存維持で挙動差分を最小化できている
- `short` / `long` のみ段階導入できている
- template 適用有無を Preview / Test で確認できる
- JSON 化しやすい構造として後続（import/export・validation）へ引き継げる

### Stop if
- template 適用のために runtime schema 変更が必要になる
- backend / compile / Overlay 変更が必要になる
- `replyTemplates` 構造ではなく固定 if 直書き分岐に依存しないと成立しない
- `normal` の既存挙動を大きく壊す
- `blocked` / `read_aloud` / `ignored` / low gate ignored の保護が維持できない

---

## Extension Phase 16-1 Checkpoints: Reply Templates JSON Schema and Validation（最小完了）

### Check items
- `schemas/replyTemplates` 配下に type / validator / samples が存在する
- `validateReplyTemplatesJson()` が存在する
- replyTemplates JSON が自由形式ではなく許可 shape のみを通す
- fail-close validation で invalid payload を採用しない
- unknown key / unknown category / unknown length を拒否する
- category は部分定義可、ただし category 内は `short` / `normal` / `long` 全必須
- 配列制約（empty array 禁止、最大件数、string 要素、trim 後空文字禁止、最大文字数）を満たす
- Preview / Test 挙動を変更していない
- backend / compile / Overlay へ広げていない

### Verified snapshot（Phase 16-1 implementation patch 時点）
- `schemas/replyTemplates/replyTemplateTypes.ts` を追加済み
- `schemas/replyTemplates/validateReplyTemplatesJson.ts` を追加済み
- `schemas/replyTemplates/samples.ts` を追加済み
- `schemas/replyTemplates/index.ts` を追加済み
- `schemas/index.ts` から `replyTemplates` を export 済み
- `validReplyTemplatesJsonSample` / `invalidReplyTemplatesJsonSample` を追加済み
- `npm run check` passed

### Done criteria（Phase 16-1 最小完了）
- replyTemplates JSON の schema / type / validation 土台が `schemas/replyTemplates` に集約されている
- fail-close で invalid JSON を拒否できる
- 自由形式 JSON を許可していない
- Preview / Test の Phase 15-3 挙動を壊していない
- 後続の AI / JSON Studio 接続・import/export 導線へ引き継げる

### Stop if
- runtime schema 変更が必要になる
- backend / compile / Overlay 変更が必要になる
- fail-close を維持できない
- 自由形式 JSON を許可しないと成立しない
- Preview / Test 挙動変更が必須になる

### Next candidates
- Phase 16-2: AI / JSON Studio validation 接続（validator 呼び出しと error_messages 反映）
- replyTemplates import / export 導線（UI と queue 接続は段階導入）

---

## Extension Phase 16-2 Checkpoints: Reply Templates JSON Validation in AI / JSON Studio（最小完了）

### Check items
- AI / JSON Studio に `返答テンプレートJSON` target が存在する
- `validateReplyTemplatesJson()` が AI / JSON Studio validation に接続されている
- JSON parse error と schema validation error が分離されている
- valid 時に `category count` / `category names` を表示できる
- invalid 時に validator errors を表示できる
- Import Queue 登録に進んでいない（replyTemplates target で無効化される）
- persona validation / persona Import Queue 登録を壊していない
- backend / compile / Overlay / PreviewTest へ広げていない

### Verified snapshot（Phase 16-2 implementation patch 時点）
- `frontend/src/pages/AiJsonStudioPage.tsx` のみ更新済み
- `TargetTab` に `返答テンプレートJSON` を追加済み
- validation 分岐:
  - `人格` -> `validatePersonaJsonV1Draft()`
  - `返答テンプレートJSON` -> `validateReplyTemplatesJson()`
  - その他 target -> 暫定案内
- `validReplyTemplatesJsonSample` / `invalidReplyTemplatesJsonSample` 挿入導線を追加済み
- `返答テンプレートJSON` では Import Queue 登録ボタンを無効化し、登録処理を呼ばない
- `npm run check` passed

### Done criteria（Phase 16-2 最小完了）
- AI / JSON Studio 上で replyTemplates JSON の validation が確認できる
- parse error / schema validation error を区別して再修正に使える
- Queue 登録や採用・compile・runtime 反映へ広げていない
- persona 導線（validation / Import Queue）を維持している

### Stop if
- backend API 変更が必要になる
- validator 仕様変更が必要になる
- Queue 登録まで進めないと成立しない
- persona validation を壊す
- Preview / Test runtime 挙動変更が必要になる
- UI 大改修が必要になる
