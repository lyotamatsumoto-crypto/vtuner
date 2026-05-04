# ROADMAP_TO_COMPLETION.md

## Purpose

本書は、VTuner の **Conditional MVP Complete** から **Full Completion** へ進むための基盤強化ロードマップを定義する文書である。

使い勝手、表現、演出、追加機能の拡張は `ROADMAP_TO_EXTENSION.md` で扱う。  
本書では、完成阻害要因の解消に集中する。

---

## Current Status

- 現在地: **Conditional MVP Complete**
- 5画面責務分離、最小 runtime wiring、Review → compile の最小導線、backend 最小保存導線は成立している
- 一方で、Full Completion 判定に必要な基盤項目は未完が残る

成立しているものは次のとおり。

- 5画面 skeleton
- Preview / Test の最小 runtime wiring
- Basic Settings から Preview / Test への最小反映
- Review → Detailed Rules → Adopted Changes → compile 前確認 → compile 履歴 の最小導線
- Review Patch Queue / Adopted Changes / compile history の最小保存導線
- backend read / write helper
- frontend 側の共有 contract を `schemas/` 経由に寄せる整理
- Completion Roadmap C1 による Review / Compile 系 contract の SSOT 整理
- `schemas` の独立 build unit 化と backend build output の整理

未完として残るものは次のとおり。

- AI JSON Import Queue / JSON validation の本接続
- compile 本処理化
- storage safety の強化
- Overlay / OBS 実用出力
- runbook / documentation の運用再開性強化

---

## Full Completion の意味

本書でいう **Full Completion** は、`COMPLETION_CRITERIA.md` の観点で次を満たす状態を指す。

- compile が確認版ではなく、正式処理として説明可能である
- compile 後の正式データ / runtime 反映が説明可能である
- JSON 導線（生成 / 検証 / 採用）が最小確認版を超えて運用可能である
- Review Patch Queue と AI JSON Import Queue が separate に成立している
- 保存と再開の安全性が、実運用を意識した水準に近づいている
- 表示専用出力（Overlay / OBS）を含む運用導線が説明可能である
- ユーザーが後日再開、確認、最低限の運用を行える状態である

---

## Completion Gaps（完成阻害の残課題）

### 1. Contract SSOT（C1-3 時点で整理済み）

Review / Compile 系 contract の正は `schemas/reviewCompile/*` とする。

C1-1 で `backend/src/contracts/*` は契約本体ではなく re-export façade へ整理した。  
C1-2 で `schemas` は独立 build unit となり、`schemas/dist` を生成する構成になった。backend は `schemas/dist/reviewCompile/*` を参照し、`backend/dist/schemas` が生成されない backend 本体中心の build output になっている。

C1-3 時点では、Contract SSOT は完了扱いできる。次の Completion 作業は Phase C2 以降で扱う。

### 2. AI JSON Import Queue / JSON validation の本接続未完

AI / JSON Studio は画面骨格として成立しているが、JSON validation、Import Queue、Adopted Changes への接続はまだ確認版である。

Full Completion では、少なくとも人格JSONを中心に、次の導線が必要である。

- JSON 貼り付け
- 構造検証
- エラー表示
- 再修正プロンプト生成
- AI JSON Import Queue への登録
- 採用判断
- Adopted Changes への接続

### 3. compile 本処理未完

現在の compile は、Review / Detailed Rules / compile history の最小確認導線である。  
Full Completion では、compile が「正式データと runtime へ反映する処理」として説明できる必要がある。

確認版 compile と本処理 compile の役割差を明文化し、採用済み変更が runtime の参照データへ反映される導線を作る。

### 4. storage safety 未完

backend の最小 read / write 導線は成立しているが、本番完成版としてはまだ弱い。

未整備のものは次のとおり。

- 保存時 validation
- 壊れた JSON 読込時の扱い
- retry 方針
- 競合時方針
- backup 方針
- fail-close なエラー表示

### 5. Overlay / OBS 出力の実運用導線未完

Preview / Test は確認 UI として成立しているが、OBS などに渡す表示専用ルートはまだ未整備である。

Full Completion では、Preview / Test 全体をそのまま本番表示として使わず、表示専用の Overlay 導線を用意する必要がある。

### 6. runbook / documentation の運用再開性強化未完

主要 docs は整っているが、後日再開や実行確認のための運用文書はまだ強化余地がある。

Full Completion では、ユーザーが次を確認できる必要がある。

- どの順番で起動するか
- backend / frontend の確認方法
- 保存ファイルの場所
- compile の意味
- エラー時に何を見るか
- 後続開発へ進む場合の最初の作業

---

## Recommended Phases

## Phase C1: Contract SSOT

### Goal

共有契約の真正な一本化を行い、frontend / backend / schemas の参照関係を安定させる。

### Scope

- 共有契約の正を `schemas/` 側へ寄せる
- frontend / backend の契約参照経路を単一ソースへ寄せる
- `ReviewPatchQueueItem`
- `AdoptedChangeItem`
- `CompileRecord`
- `CompilePlanItem`
- runtime input / decision 系の契約を確認する
- `backend/src/contracts` の扱いを整理する

### Notes

- 新しい契約型は原則 `schemas/` 側へ追加する
- `backend/src/contracts` を新しい契約源として増やさない
- backend 側は `schemas/` の型を参照、または薄い re-export に寄せる
- 既存 API の挙動変更は最小にする
- この Phase では UI の大幅変更を行わない

### C1-3 status

- Review / Compile 系 contract の正は `schemas/reviewCompile/*`
- `backend/src/contracts/*` は `schemas/dist/reviewCompile/*` を re-export する互換 façade
- `schemas` は `schemas/dist` を生成する独立 build unit
- `backend/tsconfig.json` は backend 本体を `rootDir: "./src"` として扱い、`../schemas` を compile 対象に含めない
- `npm run check` / `npm run build:schemas` / `npm run build:backend` は確認済み
- `backend/dist/schemas` は生成されない
- Windows sandbox では `clean:backend` が `EPERM` になる場合があるため、掴んでいるプロセスを止めて再実行する

### Done when

- frontend と backend が同じ契約定義を参照している
- `backend/src/contracts` が契約の別ソースとして増殖していない
- `npm run check` が通る
- queue / compile / runtime の主要型の参照元を説明できる

### Out of scope

- compile 本処理化
- AI JSON validation 本接続
- storage safety 強化
- Overlay 実装

---

## Phase C2: AI JSON Import Queue and Validation Flow

### Goal

AI / JSON Studio の JSON 導線を、画面 skeleton から最小運用可能な import / validation 導線へ進める。

### Scope

- 人格JSONを中心に validation を本接続する
- JSON 貼り付け内容を検証する
- validation 成功 / 失敗を明確に表示する
- エラー時の再修正プロンプトを生成する
- AI JSON Import Queue に登録する
- Import Queue から Adopted Changes へ進む導線を作る
- Review Patch Queue と AI JSON Import Queue を混線させない

### Notes

- 最初は人格JSONを優先する
- 人格以外の JSON 契約を無理に確定しない
- external browser AI 前提を維持する
- アプリ内部 AI は導入しない
- JSON 直編集を主導線にしない

### Done when

- JSON validation 成功 / 失敗が UI 上で確認できる
- validation 失敗時に再修正プロンプトを出せる
- validation 成功時に AI JSON Import Queue へ登録できる
- Import Queue と Review Patch Queue が separate に扱われている
- Adopted Changes へ接続できる

### C2 close status（最小完了）

- 人格 JSON の validation 成功 / 失敗は AI / JSON Studio 上で判別できる
- validation 結果を持つ item を AI JSON Import Queue へ登録し、backend 保存できる
- validated item は Adopted Changes へ採用できる（`adopted_type: persona_json`, `source_lane: ai_json_import_queue`）
- validation_failed item は採用不可、adopted / discarded item は再操作不可の最小制御がある
- Review Patch Queue と AI JSON Import Queue は別導線で運用される
- 残課題は C3 以降（compile production path での正式 runtime 反映整理）で扱う

### Out of scope

- 自動AI生成
- 外部AI API接続
- 自由形式 JSON の許可
- compile 本処理化

---

## Phase C3: Compile Production Path

### Goal

compile を確認版最小導線から、正式データ / runtime 反映を説明できる本処理へ進める。

### Scope

- 確認版 compile と本処理 compile の役割差を明文化する
- Adopted Changes から正式 runtime config を生成する
- compile 後の反映先を明確にする
- Preview / Test が compile 後データを参照できるようにする
- compile history と正式反映先の整合を取る
- runtime への反映結果を UI 上で確認できるようにする

### Notes

- compile は「ボタンがあること」ではなく、「採用済み差分が正式データへ反映されること」とする
- runtime 反映先が曖昧なまま完成扱いしない
- Review / Detailed Rules / AI JSON Studio の責務を混ぜない

### Done when

- Adopted Changes から正式 runtime config を生成できる
- Preview / Test が compile 後の正式データを参照して動く
- compile history と反映結果の関係を説明できる
- compile の意味が docs と UI で一致している

### C3 close status（最小完了）

- compile は frontend 確認版のまま、Adopted Changes から runtime config 相当の最小データ（`compiledRuntimeEntries`）を生成できる
- `compiledRuntimeEntries` は最新 compile 実行結果を表し、各 entry は `compile_record_id` で compile history 先頭レコードと最小対応づけできる
- Detailed Rules / Preview で、compile 後に何が runtime 側へ反映されたか（source_lane / target_kind / target_name）を確認できる
- 過去履歴ごとの runtime entry 永続保持・復元は未対応
- backend compile API / backend compile 実行 / production compile engine は後続課題として扱う

### Out of scope

- Overlay 実装
- 長時間運用向け最適化
- 複雑なDB移行

---

## Phase C4: Storage Safety

### Goal

ローカル JSON 保存を、最低限の実運用に耐えやすい安全な保存導線へ強化する。

### Scope

- 保存前 validation
- 読込時 validation
- 壊れた JSON 読込時の fail-close
- 保存失敗時のメッセージ整理
- retry 方針の整理
- 競合時方針の整理
- backup / snapshot 方針の整理
- 復旧手順の文書化

### Notes

- いきなり DB 化しない
- ローカル JSON 保存を前提に、安全性を段階的に上げる
- 破損時に勝手に上書きしない
- fail-close を優先する
- 復旧不能な自動修復を入れない

### Done when

- 壊れた JSON を読んでも状態が不明なまま進まない
- 保存前に最低限の構造確認がある
- 保存失敗時に UI 上で分かる
- backup または snapshot 方針が説明できる
- 復旧手順が docs にある

### C4-1 status（最小強化）

- queue / compile の local JSON 読込・保存で、既存 shape validation を許容値チェック寄りに最小強化した
- 壊れた JSON / 不正 shape は fail-close（validation error）で扱い、空配列へ握りつぶさない
- missing file のみ空配列として扱う
- 保存失敗時は frontend 表示を維持したまま backend 未反映メッセージを出す
- 自動修復・自動上書きは行わない
- backup / snapshot / retry / 競合制御 / 復旧手順の本格整備は C4 後続で扱う

### C4 close status（最小完了）

- C4-1 で、queue / compile の保存前 validation を最小強化し、fail-close 方針を維持した
- C4-2 で、local JSON の保存場所、手動 backup / snapshot、復旧時確認手順を docs に明記した
- 壊れた JSON / 不正 shape は fail-close、missing file のみ空配列として扱う運用方針を明文化した
- 自動修復 / 自動上書きは行わない
- retry / lock / 競合制御 / 複数ユーザー同時編集は未実装で、後続課題として扱う

### Out of scope

- DB 化
- クラウド同期
- 複数ユーザー同時編集
- 高度なトランザクション制御

---

## Phase C5: Overlay / OBS Output

### Goal

Preview / Test とは別に、OBS などへ渡せる表示専用出力を整備する。

### Scope

- Overlay 用の表示専用ルートを作る
- Preview / Test と Overlay の責務境界を維持する
- CharacterStage 再利用方針を維持する
- キャラクターと吹き出しだけを表示できるようにする
- 透明背景に対応する
- 表示用 UI ラベル、操作パネル、確認用ガイドを Overlay に出さない
- OBS Browser Source で読み込む前提を文書化する

### Notes

- Preview / Test 全体をそのまま Overlay に流用しない
- Overlay は確認画面ではなく、表示専用出力である
- CharacterStage / CharacterDisplay / SpeechBubble の共通部品は再利用してよい
- Preview 用の補助ラベルや test history は出さない
- YouTube Live Chat 本接続はこの Phase の必須条件にしない

### Done when

- `/overlay/character` のような表示専用ルートがある
- Preview / Test 全体ではなく、キャラクターと吹き出しのみを表示できる
- 背景を透明にできる
- OBS Browser Source で読み込む前提が説明できる
- Preview / Test と Overlay が同じ CharacterStage 系の表示部品を再利用している
- Overlay に操作 UI や確認用ラベルが出ない

### C5 close status（最小完了）

- `/overlay/character` を表示専用ルートとして運用できる状態を確認した
- Overlay は AppShell / サイドバー / TopBar を通さず、透明背景でキャラクターと吹き出しのみを表示する
- `show_stage_label=false` / `show_preview_overlay_label=false` を維持し、操作 UI を出さない
- compile 前は「反映待ち」表示、compile 後は `compiledRuntimeEntries` の先頭 entry を参照して表示する
- OBS Browser Source では Preview / Test 全体ではなく `/overlay/character` を指定する前提を docs に明記した
- YouTube Live 接続 / 音声合成 / 複数キャラ表示 / コラボモードは後続課題として扱う

### Out of scope

- YouTube Live Chat 本接続
- コメント取得 API
- 音声合成本実装
- 複数キャラ同時表示
- コラボモード

---

## Phase C6: Runbook / Documentation Hardening

### Goal

ユーザーが後日再開、実行、確認、復旧できるように、運用文書を強化する。

### Scope

- README の入口整理
- backend / frontend 起動手順
- `npm run check` の確認手順
- 保存ファイルの場所
- compile の意味
- Review → Detailed Rules → compile の流れ
- AI / JSON Studio の使い方
- Overlay / OBS の使い方
- エラー時に見る場所
- 復旧手順
- 既知の制限
- 次に開発する場合の入口

### Notes

- 初心者でも再開しやすいことを優先する
- 実装以上に見せない
- 未実装機能を完成済みのように書かない
- Conditional MVP Complete と Full Completion の違いを明確にする

### Done when

- README を見れば起動と確認の入口が分かる
- どの画面が何をするか分かる
- 保存場所と compile の意味が分かる
- エラー時に何を見るか分かる
- Conditional MVP Complete と Full Completion の差が説明されている

### C6 close status（最小完了）

- `docs/RUNBOOK.md` を追加し、後日再開の入口を集約した
- 起動手順、check/build 手順、保存場所、復旧入口、Overlay / OBS 手順を runbook に整理した
- C1〜C5 の最小完了状態を前提に、次作業判断（Completion 後続 / Extension）を明記した
- ただし Full Completion ではなく、production compile engine / runtime config 永続保存 / 配信連携強化は後続課題として残る

### Out of scope

- 新機能実装
- UI 改修
- backend 構造変更
- compile 本処理拡張

---

## Recommended Order

基本順序は次のとおり。

1. **Phase C1: Contract SSOT**
2. **Phase C2: AI JSON Import Queue and Validation Flow**
3. **Phase C3: Compile Production Path**
4. **Phase C4: Storage Safety**
5. **Phase C5: Overlay / OBS Output**
6. **Phase C6: Runbook / Documentation Hardening**

ただし、配信画面での見栄え確認を優先する場合は、Phase C5 を C3 の前に一部先行してもよい。  
その場合も、Preview / Test と Overlay の責務境界は必ず維持する。

---

## Known Constraints

- 5画面責務分離は維持必須
- アプリ内部 AI を導入しない方針を維持する
- compile 確認版と本処理の境界を曖昧にしない
- Preview / Test と Overlay の責務を混ぜない
- 大規模再設計は段階分割前提とする
- 新しい契約源をむやみに増やさない
- external browser AI 前提を維持する

---

## Stop Conditions

次の場合は、実装を止めて整理を優先する。

- 5画面責務が崩れそうなとき
- completion 基盤強化と extension 機能追加が混線し始めたとき
- compile の意味が docs 間で不一致になったとき
- 契約一本化前に複数契約源をさらに増やす必要が出たとき
- Preview / Test をそのまま本番表示に流用する設計へ寄り始めたとき
- AI / JSON Studio が内部AI実装の入口になり始めたとき
- JSON import が自由形式 JSON 受け入れになり始めたとき
- storage safety 未整備のまま本運用可能と宣言しそうになったとき

---

## What Not To Do Next

- extension 機能追加で completion 阻害課題を先送りし続ける
- compile 本処理未完のまま「完成」と確定する
- Contract SSOT 未完の状態で参照経路を拡散させる
- 保存堅牢化未実施のまま運用前提を過大に宣言する
- Overlay 専用導線未整備のまま OBS 実用出力完了扱いにする
- AI JSON Import Queue 未接続のまま AI / JSON Studio 完成扱いにする
- Preview / Test と Overlay を同一画面として扱う
- アプリ内部 AI を前提にした実装へ寄せる
- 本番長時間運用レベルの耐障害性を実装済みと主張する

---

## Relationship to ROADMAP_TO_EXTENSION.md

`ROADMAP_TO_COMPLETION.md` は、Full Completion を阻害している基盤課題を扱う。

`ROADMAP_TO_EXTENSION.md` は、Conditional MVP Complete 後に追加する使い勝手、表現、演出、運用補助の拡張機能を扱う。

### Completion Roadmap が扱うもの

- Contract SSOT
- AI JSON Import Queue / validation
- compile 本処理化
- storage safety
- Overlay / OBS Output
- runbook / documentation hardening

### Extension Roadmap が扱うもの

- Character Profile 保存
- 未保存状態表示
- 読み上げのみモード
- NG / 禁止表現の共通処理
- 発言対象による画像切り替え
- 反応頻度
- 発話の長さ
- 吹き出し文字アニメーション
- キャラ切替アニメーション
- シーンプリセット
- コラボモード

両者は競合しない。  
ただし、extension 機能を追加する場合でも、completion 側の阻害課題を見失わないこと。

---

## Summary

現在の VTuner は **Conditional MVP Complete** であり、基礎導線は成立している。

ただし **Full Completion** と呼ぶには、次の基盤強化が必要である。

1. 契約の真正な一本化（C1-3 時点で整理済み）
2. AI JSON Import Queue / validation の本接続
3. compile 本処理化
4. 保存安全性の強化
5. Overlay / OBS 実用導線
6. 再開と運用のための runbook 整備

本書は、この6点を Completion 側の主課題として扱う。  
使い勝手や表現上の拡張は `ROADMAP_TO_EXTENSION.md` に委ねる。
