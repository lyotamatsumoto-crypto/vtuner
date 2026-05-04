# ROADMAP_TO_EXTENSION.md

## Purpose

本書は、VTuner の条件付き MVP 完了後に追加していく**機能拡張（使い勝手・表現・運用拡張）**の実装順と判断基準を整理するための文書である。

現在の VTuner は、以下の5画面構成を前提とする。

1. Preview / Test
2. Basic Settings
3. Review
4. Detailed Rules
5. AI / JSON Studio

本書は、この5画面構成を崩さずに、後続で追加する基礎機能・演出機能・拡張機能の優先順を定める。  
追加候補そのものは `VTuner Additional Core Features Specification` を土台としつつ、現在の実装状態に合わせて導入順を整理する。  

---

## Current Status

VTuner は現時点で、**条件付き MVP 完了** とみなす。

成立しているものは次のとおり。

- 5画面 skeleton
- Preview / Test の最小 runtime wiring
- Basic Settings から Preview / Test への最小反映
- Review → Detailed Rules → Adopted Changes → compile 前確認 → compile 履歴 の最小導線
- backend read/write helper
- Review Patch Queue / Adopted Changes / compile history の最小保存導線
- frontend 側の共有 contract を `schemas/` 経由に寄せる整理

完成基盤側の未完（Contract SSOT、AI JSON Import Queue 本接続、compile 本処理、storage safety、Overlay / OBS、runbook 強化）は、本書では主対象にしない。  
これらは `ROADMAP_TO_COMPLETION.md` 側で扱う。

そのため、本書は「MVP 後の機能拡張」を優先順で整理する実装計画として扱う。

---

## Basic Policy

追加機能は、次の3層を混ぜずに実装する。

1. キャラの定義
2. 挙動の制御
3. 表示・体験

この分離を守ることで、Basic Settings・Detailed Rules・Preview / Test・AI / JSON Studio の責務を崩さない。

### 画面責務の前提

Basic Settings:
- キャラクター全体設定
- Character Profile 管理
- 未保存状態表示
- 共通設定

Preview / Test:
- 表示確認
- runtime 確認
- 読み上げのみモード
- 発話対象確認
- 演出確認

Review:
- 未対応候補やコメント候補の確認
- patch candidate 化

Detailed Rules:
- 採用済みルールの正式編集
- Review patch の採用
- compile 前確認

AI / JSON Studio:
- 外部ブラウザ AI 用プロンプト生成
- JSON 構造確認
- import 候補検証

---

## Source of This Roadmap

本ロードマップは、追加仕様メモに定義された以下の拡張候補を元にしている。

- Character Profile 保存
- 未保存状態表示
- JSON import / export
- 読み上げのみモード
- NG / 禁止表現の共通処理
- 反応頻度
- 発話の長さ
- 沈黙時の自発発話
- 発言対象
- 発言対象による画像切り替え
- キャラ切替アニメーション
- 吹き出し文字アニメーション
- キャラ状態表示
- シーンプリセット
- コラボモード
- 未対応コメント蓄積

ただし、本書では「実装価値」だけでなく、「現在の土台に安全に載せられるか」を基準に優先順を再整理する。

---

## Priority Summary

### 最優先で入れるもの
1. Character Profile 保存
2. 未保存状態表示
3. 読み上げのみモード
4. NG / 禁止表現の共通処理

### 次に強いもの
5. 発言対象
6. 発言対象による画像切り替え
7. キャラ状態表示
8. 反応頻度
9. 発話の長さ

### その次
10. JSON import / export
11. 沈黙時の自発発話
12. 吹き出し文字アニメーション
13. キャラ切替アニメーション

### 将来拡張
14. シーンプリセット
15. 未対応コメント蓄積
16. コラボモード

---

## Recommended Next Phases

以下は **Extension Track（機能拡張側の Phase 12+）** として扱う。

## Phase 12: Character Profile Foundation

### Goal

Basic Settings を、単なる項目編集画面ではなく、**キャラクター運用の基礎画面** にする。

### Scope

- Character Profile 保存
- Character Profile 読み込み
- Character Profile 複製
- 未保存状態表示
- 最終保存時刻表示
- Character Profile 管理 UI を Basic Settings 上部へ追加

### Notes

- 保存対象は Basic Settings に存在する共通設定を中心とする
- Detailed Rules には置かない
- 現在の Basic Settings の shared state を土台に拡張する

### Done when

- 現在設定を 1 体分の Character Profile として保存できる
- 保存済み Character Profile を読み込める
- 変更後に「未保存」が分かる
- 保存済み / 未保存 / 最終保存時刻が表示できる

### Phase 12 local foundation status

- Basic Settings 上部に Character Profile 管理 UI（選択 / 保存 / 複製）を追加済み
- local state で Profile 保存・読込・複製・未保存表示・最終保存時刻表示を実装済み
- 保存対象は `BasicPreviewBridgeSettings` 相当の共有設定に限定
- Preview / Test 反映元（shared settings）は維持し、既存反映を壊していない
- backend 永続保存 / JSON import-export / 完全 schema 化は後続で扱う

---

## Phase 13: Read Aloud and Shared Blocking Rules

### Goal

Preview / Test に **読み上げのみモード** を追加し、コメント反応と分けた確認経路を持つ。

### Scope

- 読み上げのみモードの ON / OFF
- 読み上げのみ時は runtime decide を通さない
- 入力文をそのまま吹き出し / 音声対象へ送る
- NG / 禁止表現だけは共通 block
- Preview 履歴で通常反応と区別する
- blocked / ignore の見え方を整理する

### Notes

- NG / 禁止表現 UI は Basic Settings 既存のものを使う
- 新規で禁止表現 UI を増やさない
- Preview / Test の確認用機能として扱う
- Review には送らない

### Done when

- 読み上げのみ ON/OFF が切り替えられる
- ON 時は分類せず、そのまま表示対象へ送る
- NG 一致時は読まない / 出さない / 反応しない
- 履歴で読み上げのみ実行と通常反応が区別できる

### Phase 13 close status（最小完了）

- Preview / Test に読み上げのみモード（ON / OFF）を追加済み
- 読み上げのみ ON 時は runtime decide を通さず、入力文をそのまま吹き出し表示する
- Basic Settings の禁止表現は shared settings（`BasicPreviewBridgeSettings.bannedExpressions`）として扱い、共通 NG block に利用する
- NG 一致時は `blocked` として扱い、runtime は実行しない
- runtime decide の `ignore` は `ignored` として扱い、`blocked` と分離する
- Preview 履歴で `runtime` / `read_aloud` / `blocked` / `ignored` を区別できる
- backend / schemas / compile / Overlay は未変更
- 音声合成本実装、YouTube 接続、Review 送信は後続で扱う

---

## Phase 14: Speech Target and Visual Direction

### Goal

VTuner の特徴である「視聴者と配信者の間に立つキャラクター」を、挙動だけでなく見た目にも反映する。

### Scope

- 発言対象 viewer / streamer / all
- Basic Settings で発話対象ごとの表示向きを設定（`viewerTargetFacing` / `streamerTargetFacing` / `allTargetFacing`）
- Basic Settings で横向き画像の向き解釈を設定（`sideImageFacing`）
- Preview / Test で発言対象を確認表示
- runtime decision の結果を CharacterStage に反映
- `speech_target -> targetFacing -> orientation / mirror` の順で表示向きを決定
- targetFacing が front の場合は `orientation=front` + `mirror=mirrorEnabled`
- targetFacing が side の場合のみ `sideImageFacing` を使って mirror 判定
- ignore / blocked は表示変化なし

### Notes

- これは単なる見た目変更ではなく、発話対象の視覚化機能として扱う
- Preview / Test での確認が先
- Overlay 反映は後続でよい
- `all` は helper 内の表示上の扱いに留め、runtime schema へは追加しない

### Done when

- 発言対象が Preview / Test で確認できる
- 発言対象に応じて front / side が切り替わる
- 既存の CharacterStage 再利用方針を崩していない

### Phase 14 close status（最小完了）

- Basic Settings に `viewerTargetFacing` / `streamerTargetFacing` / `allTargetFacing` を追加済み
- Basic Settings に `sideImageFacing`（`viewer` / `streamer`）を追加済み
- Preview / Test では `speech_target` から targetFacing を選び、`orientation` / `mirror` を決定する
- targetFacing が `front` の場合は `orientation=front` + `mirror=mirrorEnabled`
- targetFacing が `side` の場合は `orientation=side` とし、`viewer` / `streamer` は `sideImageFacing` で mirror を決定する
- targetFacing が `side` かつ `speech_target=all` の場合は `mirror=mirrorEnabled` を使う
- `all` は helper 内の表示上の扱いのみで、runtime schema には追加していない
- `read_aloud` は `viewer` 扱いで向きを決定する
- `blocked` / `ignored` は表示方向を更新しない
- `CharacterStage` / `CharacterDisplay` の props は変更していない
- Overlay 反映、画像アップロード、front / side 別 asset 管理は後続で扱う

---

## Phase 15: Reaction Control Layer

### Goal

反応量と返答長を調整できるようにし、配信の邪魔にならないバランスを作る。

### Scope

- 反応頻度
  - 控えめ
  - 標準
  - よく反応する
- 発話の長さ
  - 短い
  - 標準
  - やや長め
- キャラ状態表示
  - 通常
  - 待機中
  - 反応中
  - 読み上げのみ
  - ignore
  - blocked
  - 配信者に助け舟

### Notes

- 反応カテゴリ ON / OFF とは役割を分ける
- 反応頻度は全体量調整
- カテゴリ ON / OFF はカテゴリ有効化

### Done when

- 反応頻度が設定できる
- 発話の長さが設定できる
- Preview / Test 上でキャラ状態表示が確認できる
- 既存 runtime 確認表示と矛盾しない

### Phase 15-1 close status（Preview基礎）

- Basic Settings に reaction control 用 shared settings（`reactionFrequencyMode` / `replyLengthMode` / `defaultCharacterState`）を追加済み
- Basic Settings で反応頻度、発話の長さ、基本状態を設定できる
- Preview / Test で反応頻度モード、発話長モード、現在のキャラ状態、状態理由を確認できる
- 状態ラベルは `blocked` / `ignored` / `read_aloud` / `runtime reply` / `defaultCharacterState` の優先順で決定する
- 今回は Preview 確認レイヤーのみで、runtime 本格制御には進んでいない
- `reactionFrequencyMode` による runtime 間引きは未実装
- `replyLengthMode` による返答文加工は未実装
- backend / schemas / compile / Overlay は未変更
- Phase 15-2 以降で reaction frequency runtime gate や reply length 制御を扱う

### Phase 15-2 close status（runtime gate 最小完了）

- `reactionFrequencyMode=low` のみ runtime gate として実装済み
- `normal` / `high` は Phase 15-2 時点では既存挙動を維持する
- low gate は deterministic / rule-based で実装している
- gate 対象は低優先度 reply（雰囲気 / 共感 / 静か / 褒め）に限定する
- question / greeting / streamer / event / blocked / read_aloud は保護対象として gate しない
- gate 適用時は runtime schema を変えずに `IgnoreDecision` 形へ変換し、`ignored` として扱う
- Preview / Test で `gateApplied` / `gateReasonLabel` を確認できる
- runtime schema / backend / compile / Overlay は未変更
- `replyLengthMode` はまだ未使用
- Phase 15-3 以降で reply length 制御を扱う

### Phase 15-3 close status（reply template length selection 最小完了）

- `replyTemplates` は `category × length` の plain object で実装済み
- `replyTemplates` は将来 JSON 化しやすい構造（配列値を含む）として保持する
- `replyLengthMode=normal` は既存 `reply_text` を維持する
- `replyLengthMode=short` / `long` のときのみ template 適用を試みる
- `applyReplyLengthTemplate()` は `reply_text` のみ差し替え、他 field は維持する
- category 未解決 / template 欠落時は既存文を維持する
- `blocked` / `read_aloud` / `ignored` / low gate ignored は template 適用対象外
- Preview / Test で `templateApplied` / `templateCategory` / `templateLength` / `templateReasonLabel` を確認できる
- runtime schema / backend / compile / Overlay は未変更
- JSON import / export、Detailed Rules、AI / JSON Studio、compile 連携は後続で扱う

---

## Phase 16: JSON Import / Export and Silence Behavior

### Goal

キャラクター設定を外部とやり取りできるようにし、AI / JSON Studio と Basic Settings の橋渡しを強くする。

### Scope

- Character Profile の JSON export
- Character Profile の JSON import
- 許可構造のみ import
- 読込前の最小 validation
- 沈黙時自発発話設定
  - しない
  - 控えめ
  - 標準
  - 多め
- 沈黙時間候補
  - 60秒
  - 120秒
  - 180秒

### Notes

- 主導線は Basic Settings
- JSON 生成・検証補助は AI / JSON Studio
- 自由形式 JSON は許可しない
- 許可構造だけ通す

### Done when

- Character Profile を JSON export できる
- 許可構造のみ import できる
- import 前に構造確認ができる
- 沈黙時自発発話の設定が保存できる

### Phase 16-1 close status（replyTemplates schema / validation 最小完了）

- `schemas/replyTemplates/` を新設し、replyTemplates JSON の型・validation 基盤を追加済み
- `ReplyTemplatesJson` / `ReplyTemplateCategory` / `ReplyTemplateLength` と制約定数を定義済み
- `validateReplyTemplatesJson()` を追加済み
- fail-close validation を実装済み（invalid は採用しない）
- unknown key / unknown category / unknown length を拒否する
- category は部分定義を許可する
- ただし存在する category では `short` / `normal` / `long` を全必須にする
- 空配列 / 空文字（trim 後）/ 長すぎる文 / non-array を拒否する
- `validReplyTemplatesJsonSample` / `invalidReplyTemplatesJsonSample` を追加済み
- Preview / Test の既存挙動は変更していない
- AI / JSON Studio 接続、import / export、Detailed Rules、compile 連携は後続で扱う

---

## Phase 17: Experience Layer

### Goal

配信画面としての見栄えと VTuner らしさを高める。

### Scope

- 吹き出し文字アニメーション
  - なし
  - フェードイン
  - タイプライター
  - 一文字ずつ表示
- キャラ切替アニメーション
  - なし
  - フェード
  - スライド
  - 軽く跳ねる

### Notes

- 初期実装は簡易でよい
- 音声同期までは求めない
- 見た目確認を優先する

### Done when

- CharacterStage / SpeechBubble に簡易アニメーション設定がある
- Preview / Test で確認できる
- 過剰な編集機能を増やしていない

---

## Future Extension Candidates

### シーンプリセット
- 雑談
- ゲーム
- 作業
- 深夜
- コラボ

### 未対応コメント蓄積
- 未対応コメント記録
- Review で確認
- patch candidate 化
- Detailed Rules で採用

### コラボモード
- 相手キャラ名
- 相手への呼び方
- 発話かぶり防止
- 自分が話す頻度
- 相手を立てる
- ツッコミ寄り

---

## Non-Goals for the Near Term

以下は、このロードマップの近接フェーズでは扱わない。

- 本番 TTS 連携
- OBS 本接続
- YouTube / Twitch 本接続
- 複数キャラ同時表示
- 高度なアナリティクス
- 自動改善
- 自由形式の無制限 JSON 実行

---

## Stop Conditions

次の条件に当てはまる場合は、追加実装を止めて設計へ戻る。

- 5画面責務が崩れそう
- Basic Settings / Detailed Rules / AI / JSON Studio の責務が混ざる
- runtime と preview-only の境界が壊れる
- compile 確認版と compile 本処理の区別が曖昧になる
- Character Profile とルール編集が混線する
- 外部 AI 用 JSON 導線と Character Profile 管理が同一責務になり始める

---

## What Not To Do Next

直近で避けることは次のとおり。

- いきなり全部入れる
- Character Profile 保存より先に Scene Preset を作る
- 読み上げのみモードより先に大規模アニメーション機能へ行く
- 既存 UI を重複して作り直す
- Basic Settings で扱うべきものを Detailed Rules に入れる
- JSON import/export を無制限な自由形式にする
- OBS / 配信プラットフォーム連携をこの段階で main scope にする

---

## Summary

VTuner の次段階で優先すべき追加実装は、次の3つである。

1. キャラを保存して運用すること
2. コメント反応と別に読み上げ確認モードを持つこと
3. 発話対象に応じて見た目と挙動を変えること

この順で進めることで、VTuner はルール編集 UI から、より実用的なキャラクター運用ツールへ近づく。
