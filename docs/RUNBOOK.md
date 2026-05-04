# RUNBOOK

## Purpose

後日再開時に、起動・確認・復旧・次作業判断を迷わず行うための最小運用ガイド。

## Current Status

- 現在地: Conditional MVP Complete+
- Completion Roadmap: C1〜C6 は最小完了
- Extension: Phase 12 local foundation（Character Profile の local state 基礎）、Phase 13（Read Aloud and Shared Blocking Rules）、Phase 14（Speech Target and Visual Direction）、Phase 15-1（Reaction Control Preview Foundation）、Phase 15-2（Reaction Frequency Runtime Gate）、Phase 15-3（Reply Template Length Selection Foundation）、Phase 16-1（Reply Templates JSON Schema and Validation）を最小完了
- Full Completion は未達（後続課題あり）

## Startup

1. backend 起動: `npm run dev:backend`
2. frontend 起動: `npm run dev:frontend`

主要 URL:

- 通常画面: `http://localhost:5173`
- Overlay 表示専用: `http://localhost:5173/overlay/character`
- backend baseline: `http://localhost:3001/baseline`

## Check / Build

- 型確認: `npm run check`
- schemas build: `npm run build:schemas`
- backend build: `npm run build:backend`

注意:

- backend build では schemas build が前提（`build:backend` は内部で実行）
- Windows で `clean:backend` が `EPERM` の場合は、backend/dev server など掴んでいるプロセスを止めて再実行

## Storage Paths

保存先（`backend/src/storage/fileLayout.ts` 準拠）:

- Review Patch Queue: `data/queues/review-patch-queue.json`
- Adopted Changes: `data/queues/adopted-changes.json`
- AI JSON Import Queue: `data/queues/ai-json-import-queue.json`
- compile history: `data/compile/history.json`

読込方針:

- missing file のみ空配列扱い
- 壊れた JSON / 不正 shape は fail-close（`StorageValidationError`）
- 自動修復しない
- 自動上書きしない

## Backup / Recovery

手動 backup / snapshot:

- 作業前に `data/` 全体を手動コピー
- 大きな変更前に `data/queues` と `data/compile` をコピー

復旧手順（最小）:

1. 壊れた JSON ファイルを退避
2. 手動 backup から対象ファイルを戻す
3. `npm run check` 実行
4. 画面再読込で状態確認

復旧時に見る場所:

- backend 起動状態 / backend 応答
- frontend の保存失敗メッセージ
- `data/queues/*`, `data/compile/history.json`
- 直前の手動 backup

未実装:

- retry 自動再試行
- lock / 競合制御
- 複数プロセス・複数ユーザー同時編集対応

## Screen Responsibilities

- Preview / Test: 確認 UI
- Basic Settings: 共通土台設定
- Review: 仕分けと patch candidate 化
- Detailed Rules: 正式編集と採用
- AI / JSON Studio: 外部ブラウザAI支援 / JSON検証 / Import Queue
- Overlay: 5画面とは別の表示専用ルート

Preview / Test の Phase 13 現在地（最小）:

- 読み上げのみモード ON / OFF を確認できる
- Basic Settings の禁止表現（shared settings）を共通 block 判定に使う
- 履歴で `runtime` / `read_aloud` / `blocked` / `ignored` を区別表示できる
- `blocked` は NG 一致による runtime 未実行
- `ignored` は runtime decide の ignore 結果

Preview / Test の Phase 14 現在地（最小）:

- Basic Settings で viewer / streamer / all 向けの表示向き（targetFacing）を選べる
- Basic Settings で横向き画像の向き解釈（`sideImageFacing`）を選べる
- Preview / Test で `speech_target -> targetFacing -> orientation / mirror` の向き変化を確認できる
- `read_aloud` は `viewer` 扱いで向きを決める
- `blocked` / `ignored` は向き更新なし
- Overlay 反映と画像差し替え本実装は未対応

Preview / Test の Phase 15-1 現在地（最小）:

- Basic Settings で反応頻度、発話長、基本状態を選べる
- Preview / Test で現在のキャラ状態と状態理由を確認できる
- Phase 15-1 時点では reactionFrequency の runtime 間引きは未対応だったが、Phase 15-2 で low gate を最小実装済み
- Phase 15-1 時点では replyLength の返答文制御は未対応だったが、Phase 15-3 で short / long template selection を最小実装済み
- 表示確認レイヤーの基礎段階として運用する

Preview / Test の Phase 15-2 現在地（最小）:

- Basic Settings で反応頻度を `控えめ`（low）にすると、低優先度 reply を ignored 化する runtime gate が有効になる
- Preview / Test で `gateApplied` / `gateReasonLabel` を確認できる
- question / greeting / streamer / event / blocked / read_aloud は保護対象として gate しない
- `normal` / `high` は現時点では既存挙動を維持する
- Phase 15-2 時点の制限: replyLength 制御は後続扱い

Preview / Test の Phase 15-3 現在地（最小）:

- Basic Settings で発話の長さを `短い` / `標準` / `やや長め` に切り替えられる
- `標準`（`replyLengthMode=normal`）は既存文を維持する
- `短い` / `やや長め` は category × length template による差し替えを試みる
- Preview / Test で `templateApplied` / `templateCategory` / `templateLength` / `templateReasonLabel` を確認できる
- まだユーザー編集、JSON import/export、Detailed Rules 連携は未対応

Phase 16-1 の現在地（最小）:

- replyTemplates JSON の schema / validation 土台を `schemas/replyTemplates/` に追加済み
- `validateReplyTemplatesJson()` で fail-close validation を実施できる
- `validReplyTemplatesJsonSample` / `invalidReplyTemplatesJsonSample` を参照できる
- まだ UI から import / export はできない
- まだ AI / JSON Studio には接続していない
- まだ Detailed Rules / compile 連携は未対応

## Flow (Review / AI JSON / Compile)

1. Review Patch Queue（Review 由来）
2. AI JSON Import Queue（AI / JSON Studio 由来）
3. Adopted Changes（採用済み）
4. compile precheck
5. compile history
6. `compiledRuntimeEntries`（frontend確認版の runtime config 相当）

補足:

- compile 後は `compiledRuntimeEntries` が更新される
- production compile engine は後続課題（未実装）

## Overlay / OBS

- OBS Browser Source には `http://localhost:5173/overlay/character` を指定
- Preview / Test 全体を OBS に使わない
- 背景透明を想定
- キャラ + 吹き出し中心表示
- compile 前: 反映待ち表示
- compile 後: `compiledRuntimeEntries` 反映表示

未対応:

- YouTube Live Chat 本接続
- 音声合成
- 複数キャラ表示

## Error Triage

- backend が起動しているか
- frontend が想定 backend origin を見ているか
- `data/` JSON が壊れていないか
- storage validation error が出ていないか
- 保存失敗メッセージ（frontend保持 / backend未反映）を確認
- Windows `EPERM`（`clean:backend`）はプロセス停止後に再実行
- Overlay が表示されない場合は URL・frontend 起動・compile 前後状態を確認

## Next Candidates

- replyTemplates の JSON schema / validation / import-export 導線整理
- Phase 16-2: AI / JSON Studio validation 接続
- replyTemplates import/export 導線（段階導入）
- production compile engine 高度化
- runtime config 永続保存
- YouTube Live Chat 接続
- 音声合成
- Character Profile の backend 永続保存 / JSON import-export
- Extension Phase 12+
