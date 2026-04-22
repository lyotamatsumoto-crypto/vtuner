# EVENT_PROTOCOL.md

## Purpose

本書は、VTuner の runtime における主なイベント種別、入力と出力の考え方、画面間のイベント責務、compile 後反映の前提を定義する文書である。

本書では、内部実装の通信方式ではなく、イベントとして何が存在し、どこで発生し、何を運ぶかの概念を定義する。

---

## Event Policy

- VTuner 本体はルールベースで動く
- runtime イベントは主にコメントと条件イベントから発生する
- AI / JSON Studio の生成フローは runtime event ではなく設定系ワークフローとして扱う
- Review と compile は runtime 外の運用イベントだが、runtime に影響する

---

## Runtime Input Events

### 1. Comment Input
主な入力。  
リスナーコメントを runtime が受け取る。

含むもの:
- ユーザー名
- コメント本文
- タイムスタンプ
- 追加メタ情報があればその参照

### 2. Condition Event Input
条件イベントの成立通知。

例:
- 無コメント成立
- 連投抑制
- 初見検出
- 常連検出
- 特定ユーザー検出
- 名前条件一致
- 時間帯条件一致
- 配信開始直後
- 配信終盤
- NG / ignore

### 3. Test Event Input
Preview / Test で手動実行されるテストイベント。

例:
- 単発サンプル
- 条件イベントテスト
- 無言イベントテスト
- NG テスト

---

## Runtime Decision Outputs

### 1. Reply Decision
反応を返すと決めた結果。

含むもの:
- 使用カテゴリ
- 使用返答名または候補文
- 発話対象
- 使用人格レイヤー
- 表示向き初期値
- 理由ラベル

### 2. Skip Decision
拾わない、または保留する決定。

含むもの:
- skip 理由
- 抑制種別
- 関連ルール
- review 対象化の要否

### 3. Unknown Decision
分類不能または正式カテゴリ外として扱う決定。

含むもの:
- unknown 理由
- 推論カテゴリ候補があればその候補
- review 対象化フラグ

### 4. Ignore Decision
無視すべきと決めた結果。

含むもの:
- ignore 理由
- 関連ルール
- review 記録の要否

---

## Preview / Test Related Outputs

Preview / Test では、次を確認できる必要がある。

- 実行結果
- 理由ラベル
- 使用反応名
- 採用 / 不採用
- 表示向き
- 見た目プレビュー

ここで扱う履歴は、実運用 review 履歴とは分離する。

---

## Review-related State

Review では、コメントごとに少なくとも次の状態を持てる必要がある。

- unknown
- skipped
- displayed
- ignored

Review は runtime の後段であり、正式編集ではなく仕分けと patch candidate 化を担う。

---

## Patch-related Events

Review から次の patch candidate が生まれる。

- ignore patch
- existing category patch
- new candidate patch

これらは Review Patch Queue に入る。

---

## AI / JSON Studio Related Workflow Events

AI / JSON Studio は runtime event ではないが、設定ワークフローとして次を持つ。

- 生成対象選択
- プロンプト生成
- JSON 取込
- JSON 検証成功
- JSON 検証失敗
- 再修正プロンプト生成
- 採用
- マイプリセット化

これらは AI JSON Import Queue と Adopted Changes に影響する。

---

## Compile-related Events

compile は、採用済み差分を正式データと runtime に反映する処理である。

compile 実行時には、少なくとも次を扱う。

- compile 対象件数
- compile 対象の種類
- 成功 / 失敗
- 反映先
- compile 履歴

---

## Event Responsibility by Screen

### Preview / Test
- test input
- test execution
- test result display

### Basic Settings
- 共通設定変更
- compile 済み定義の選択反映

### Review
- review state display
- patch candidate creation

### Detailed Rules
- adopted change editing
- manual definition / rule editing
- review patch adoption

### AI / JSON Studio
- generation workflow
- validation workflow
- correction prompt workflow
- adoption workflow

---

## Orientation and Target Handling

発話には少なくとも次の概念が関わる。

- 発話対象
  - viewer
  - streamer

- 使用人格
  - 基本性格
  - 視聴者向け態度
  - 配信者向け態度

- 表示向き
  - front
  - side
  - mirror の有無

表示向きは人格そのものではなく、別設定として持つ。

---

## Notes

- アプリ内部に AI を持たない前提を守る
- AI / JSON Studio 由来の生成は runtime event と混同しない
- Review と compile は runtime 後段の改善フローとして扱う