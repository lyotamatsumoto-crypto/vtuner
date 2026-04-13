# 12_EVENT_PROTOCOL.md

## Purpose

本書は、VTuner における frontend と backend のイベント通信仕様を定義する。  
主な目的は次のとおり。

- frontend / backend 間の責務を明確にする
- 実行時イベントの形を固定する
- テスト画面と本番挙動で同じ経路を使えるようにする
- 再接続時の最低限の状態同期を可能にする
- 将来の拡張に備えつつ、初期段階ではイベント種類を絞る

---

## Basic Policy

- 通信方式は WebSocket を前提とする
- 送受信データは JSON オブジェクトとする
- すべてのイベントは `type` を持つ
- 1イベント = 1責務とする
- 配信中の主要イベントは少数に絞る
- frontend は受信イベントを描画・再生に使う
- backend は分類・発話決定・状態管理を担う

---

## Common Fields

すべてのイベントは次の共通フィールドを持つ。

- `type`
- `eventId`
- `timestamp`

### Meanings

#### `type`

イベント種別を表す文字列。  
イベントの解釈はこの値で分岐する。

#### `eventId`

イベント自体の一意識別子。  
重複受信対策やデバッグ補助に利用できる。

#### `timestamp`

イベント生成時刻。  
UNIX epoch milliseconds を想定する。

---

## Event Directions

### backend → frontend

- `vtuner_state`
- `vtuner_message`
- `vtuner_debug`
- `vtuner_error`

### frontend → backend

- `frontend_ready`
- `request_state_sync`
- `test_comment_submit`
- `test_scenario_start`
- `test_scenario_stop`

---

## Shared Domain Values

### mode

- `front`
- `side`

補足:

- 初期段階では `back` は採用しない
- side は mirror 利用を前提にする

### action

- `idle`
- `speaking`
- `turning`

補足:

- 初期段階では `turning` を将来拡張余地として残してよい
- 実装上は `idle` / `speaking` 中心でもよい

### emotion

- `neutral`
- `happy`
- `sad`
- `angry`
- `surprised`

### target

- `streamer`
- `audience`
- `system`

### category

初期候補:

- `greeting`
- `praise`
- `question`
- `laugh`
- `topicPrompt`
- `system`
- `unknown`

補足:

- 初期カテゴリの最終確定は別仕様で扱う
- ここではイベントが運べる値の枠のみ定義する

### connection

- `connected`
- `disconnected`
- `reconnecting`

### decision

- `displayed`
- `skipped`
- `ignored`
- `unknown`

---

## backend → frontend Events

---

## 1. `vtuner_state`

### Role

現在の VTuner 表示状態を frontend に伝える。  
主に初期表示、再接続、状態同期に使う。

### Main Uses

- frontend 初期化後の状態同期
- 再接続時の状態再送
- 現在の mode / action / emotion の反映
- connection 状態の表示

### Required Fields

- `type`
- `eventId`
- `timestamp`
- `mode`
- `action`
- `emotion`
- `connection`
- `queueLength`
- `voiceEnabled`

### Optional / Nullable Fields

- `currentMessageId`

### Notes

- frontend は `vtuner_state` を受信したら、現在状態を上書きしてよい
- 発話途中の完全復元は初期段階では要求しない
- 最低限「今どの向きで、接続はどうで、何件待っているか」が分かればよい

### Example

```json
{
  "type": "vtuner_state",
  "eventId": "evt_state_001",
  "timestamp": 1711111111111,
  "mode": "front",
  "action": "idle",
  "emotion": "neutral",
  "connection": "connected",
  "currentMessageId": null,
  "queueLength": 0,
  "voiceEnabled": true
}
```

---

## 2. `vtuner_message`

### Role

VTuner の表示・発話の中心イベント。  
frontend はこのイベントを受けて、吹き出し表示・向き変更・音声再生を行う。

### Main Uses

- コメントに対する反応
- 配信者向け補助発話
- 視聴者向け仲介発話
- テスト時の擬似反応表示

### Required Fields

- `type`
- `eventId`
- `timestamp`
- `messageId`
- `target`
- `category`
- `mode`
- `emotion`
- `displayText`
- `durationMs`
- `voiceEnabled`
- `priority`

### Optional / Nullable Fields

- `voiceText`

### Notes

- `displayText` は吹き出し表示用の最終文
- `voiceText` は読み上げ文。未設定時は `displayText` を読んでよい
- `priority` は backend がキュー制御の参考として付与する
- frontend は基本的に逐次処理でよい

### Example

```json
{
  "type": "vtuner_message",
  "eventId": "evt_msg_001",
  "timestamp": 1711111112222,
  "messageId": "msg_001",
  "target": "streamer",
  "category": "question",
  "mode": "side",
  "emotion": "neutral",
  "displayText": "質問が来ていますよ",
  "durationMs": 5000,
  "voiceEnabled": true,
  "voiceText": "質問が来ていますよ",
  "priority": 60
}
```

---

## 3. `vtuner_debug`

### Role

分類や判断結果を frontend に伝えるデバッグ補助イベント。  
主にテスト画面やレビュー導線の確認に使う。

### Main Uses

- テスト画面での判定表示
- 未分類の確認
- スキップ理由の確認
- ルールID確認

### Required Fields

- `type`
- `eventId`
- `timestamp`
- `rawText`
- `normalizedText`
- `matchedCategory`
- `decision`

### Optional / Nullable Fields

- `ruleId`
- `reason`

### Notes

- `vtuner_debug` は演出そのものには必須ではない
- `unknown` でも送ってよい
- レビュー機能の足場として有用

### Example

```json
{
  "type": "vtuner_debug",
  "eventId": "evt_dbg_001",
  "timestamp": 1711111113333,
  "rawText": "ランクいく？",
  "normalizedText": "ランクいく？",
  "matchedCategory": "question",
  "ruleId": "question_003",
  "decision": "displayed",
  "reason": null
}
```

---

## 4. `vtuner_error`

### Role

frontend に表示したいエラーや警告を伝える。

### Main Uses

- 接続エラー
- 音声再生不可
- 設定不足
- 復旧可能な警告

### Required Fields

- `type`
- `eventId`
- `timestamp`
- `code`
- `message`
- `recoverable`

### Example

```json
{
  "type": "vtuner_error",
  "eventId": "evt_err_001",
  "timestamp": 1711111114444,
  "code": "VOICE_DISABLED",
  "message": "音声再生が無効です",
  "recoverable": true
}
```

---

## frontend → backend Events

---

## 5. `frontend_ready`

### Role

frontend 側の初期化完了通知。  
backend は必要に応じて `vtuner_state` を返す。

### Main Uses

- 初回接続時
- frontend 再読込後
- state sync の起点

### Required Fields

- `type`
- `eventId`
- `timestamp`

### Optional / Nullable Fields

- `clientVersion`

### Example

```json
{
  "type": "frontend_ready",
  "eventId": "evt_cli_001",
  "timestamp": 1711111120000,
  "clientVersion": "0.1.0"
}
```

---

## 6. `request_state_sync`

### Role

現在の state を再送してほしいときに使う。  
再接続時や手動同期に利用する。

### Main Uses

- WebSocket 再接続後
- frontend 側の同期要求
- 状態復旧の起点

### Required Fields

- `type`
- `eventId`
- `timestamp`

### Example

```json
{
  "type": "request_state_sync",
  "eventId": "evt_cli_002",
  "timestamp": 1711111121111
}
```

---

## 7. `test_comment_submit`

### Role

テスト画面から擬似コメントを backend に送る。  
本番コメントとできるだけ同じ分類経路を通す。

### Main Uses

- 手動コメントテスト
- 名前付きコメントテスト
- 強制カテゴリテスト

### Required Fields

- `type`
- `eventId`
- `timestamp`
- `text`
- `forceCategory`

### Optional Fields

- `viewerName`

### Notes

- `forceCategory` はカテゴリ固定テスト用
- 通常は `null` でもよい
- `viewerName` は名前イベント検証用として将来利用しやすい

### Example

```json
{
  "type": "test_comment_submit",
  "eventId": "evt_cli_003",
  "timestamp": 1711111122222,
  "text": "こんばんは！",
  "forceCategory": null,
  "viewerName": "ブラザー太郎"
}
```

---

## 8. `test_scenario_start`

### Role

あらかじめ用意したテストシナリオの再生開始要求。

### Main Uses

- サンプルコメント自動再生
- 疑似配信テスト
- 連続反応確認

### Required Fields

- `type`
- `eventId`
- `timestamp`
- `scenarioId`

### Example

```json
{
  "type": "test_scenario_start",
  "eventId": "evt_cli_004",
  "timestamp": 1711111123333,
  "scenarioId": "basic_stream_01"
}
```

---

## 9. `test_scenario_stop`

### Role

実行中のテストシナリオ停止要求。

### Main Uses

- 自動テスト停止
- テストリセット

### Required Fields

- `type`
- `eventId`
- `timestamp`

### Example

```json
{
  "type": "test_scenario_stop",
  "eventId": "evt_cli_005",
  "timestamp": 1711111124444
}
```

---

## Initial Processing Rules

### frontend

- `vtuner_state` は現在状態として上書きしてよい
- `vtuner_message` は表示キューへ追加する
- `vtuner_debug` はテスト画面やデバッグ表示用に使う
- `vtuner_error` は状態表示へ反映する

### backend

- テストコメントも本番コメントも、可能な限り同じ分類経路を使う
- `unknown` は原則 `vtuner_message` にしない
- `unknown` は `vtuner_debug` では扱ってよい
- 再接続時は `request_state_sync` を受けて `vtuner_state` を返す

---

## Initial Queue Assumption

初期段階の frontend 側メッセージ処理は、次を基本とする。

- `vtuner_message` は逐次処理
- 並列発話は行わない
- 溢れた場合は低優先度から破棄する
- `unknown` はキューに積まない

詳細なキュー制御は別仕様で扱う。

---

## Out of Scope for Initial Version

- 発話途中からの完全復旧
- 複数 frontend クライアント完全同期
- メッセージ取消イベント
- 高度な partial update
- streaming トークン単位更新
- 音声再生完了の厳密相互通知

---

## Summary

VTuner のイベントプロトコルは、初期段階では少数のイベントに絞り、  
frontend は「表示・再生」、backend は「判断・状態管理」を担当する。

本仕様は、配信中の安定性を優先しつつ、  
テスト画面・レビュー機能・将来拡張の足場を確保するための基盤である。
