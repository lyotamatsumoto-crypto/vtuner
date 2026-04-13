# 16_ACCEPTANCE_CRITERIA.md

## Purpose

本書は、VTuner の初期版における受け入れ条件を定義する。  
目的は、実装の完了判定を曖昧にせず、frontend / backend / config / review の各領域で「何ができれば合格か」を明確にすることにある。

本書の条件は、初期版の安定動作と説明可能性を優先する。  
高度な拡張や将来機能は、本書の合格条件には含めない。

---

## Basic Policy

- 受け入れ条件は「触って確認できること」を優先する
- 配信中の安定性を優先し、過剰な賢さは要求しない
- 誤判定より沈黙を選ぶ方針に反しないこと
- UI 上でユーザーが理解しやすいことを重視する
- 初期版では、最小限のカテゴリとイベントで成立すればよい

---

## Initial Scope Summary

初期版で合格対象とする範囲は次のとおり。

- 3画面構成の frontend
- コメント分類と発話決定を行う backend
- personality / behavior / templates / appearance の基本設定
- Preview / Test 画面での配置確認と反応確認
- Review 画面での unknown 回収
- JSON の最低限の取り込みと検証
- 音声の基本設定（声を選ぶ）

---

## 1. Frontend Acceptance Criteria

### 1.1 画面構成

次の3画面が存在し、それぞれ役割が分かれていること。

1. Preview / Test
2. Personality / Speech / Reaction Settings
3. Review

### 1.2 Preview / Test

次が確認できること。

- VTuner がプレビュー画面上に表示される
- VTuner の基本初期位置が右下である
- VTuner をドラッグで移動できる
- front / side の見た目を確認できる
- side を左右反転して使える
- コメントを手入力して反応を試せる
- サンプル再生または疑似イベント発火ができる
- 音声の基本テストができる
- 下部に判定ログ / 使用テンプレ / 音声状態が表示される

### 1.3 Personality / Speech / Reaction Settings

次が確認できること。

- 性格設定項目がUI上で編集できる
- 話し方設定項目がUI上で編集できる
- 反応カテゴリ設定がUI上で編集できる
- 時間イベント設定がUI上で編集できる
- 名前イベント設定がUI上で編集できる
- AI補助用の導線が存在する
- レーダー表示・ラベル・例文プレビューが確認できる

### 1.4 Review

次が確認できること。

- コメント状態を一覧で確認できる
- unknown を絞り込める
- ignore を選べる
- 既存カテゴリへ追加できる
- 新規候補として保留できる

---

## 2. Backend Acceptance Criteria

### 2.1 コメント処理

backend は次の流れを成立させること。

1. コメントを受け取る
2. 正規化する
3. カテゴリを判定する
4. 必要なら発話を決定する
5. frontend にイベントを送る

### 2.2 初期カテゴリ

少なくとも次のカテゴリを扱えること。

- greeting
- praise
- question
- laugh
- topicPrompt
- unknown
- system

### 2.3 unknown の扱い

- unknown は保持できること
- unknown は review に回せること
- unknown を無理に発話させなくてよいこと

### 2.4 キュー方針

次の基本方針が成立していること。

- 発話は逐次処理される
- 並列発話を前提にしない
- 溢れた場合は低優先度から破棄できる
- unknown は発話キューに積まなくてよい

### 2.5 時間イベント

初期段階では、少なくとも次が扱えること。

- 一定時間コメントなしで話題振りするイベント

### 2.6 名前イベント

初期段階では、少なくとも次が扱えること。

- 名前を読む / 読まない
- 長い名前の扱い
- NG名 / センシティブ除外
- 初回っぽい反応

---

## 3. Event Protocol Acceptance Criteria

### 3.1 必須イベント

次のイベントが存在し、送受信の責務が分かれていること。

#### backend → frontend
- vtuner_state
- vtuner_message
- vtuner_debug
- vtuner_error

#### frontend → backend
- frontend_ready
- request_state_sync
- test_comment_submit
- test_scenario_start
- test_scenario_stop

### 3.2 共通項目

すべてのイベントが少なくとも次を持つこと。

- type
- eventId
- timestamp

### 3.3 基本動作

- frontend が `vtuner_message` を受けて表示処理できること
- frontend が `vtuner_state` を受けて状態反映できること
- test_comment_submit によりテストコメント経路を通せること
- request_state_sync により最低限の状態同期ができること

---

## 4. Config Acceptance Criteria

### 4.1 基本ブロック

少なくとも次の設定ブロックが概念上分かれていること。

- personality
- behavior
- templates
- appearance
- patches
- compiled runtime config

### 4.2 personality

次が表現できること。

- 性格タイプ
- 口調
- 語尾
- 元気さ
- やさしさ
- 丁寧さ
- 自発性
- 距離感
- 呼び方や参考セリフなどの具体語

### 4.3 behavior

次が表現できること。

- カテゴリごとの ON/OFF
- unknown の扱い
- 時間イベント
- 名前イベント
- 音声利用の基本方針

### 4.4 templates

次が表現できること。

- カテゴリ別テンプレート
- target 別テンプレート
- 名前イベント用テンプレート
- 時間イベント用テンプレート

### 4.5 appearance

次が表現できること。

- front 画像参照
- side 画像参照
- mirrorSide
- position
- scale

### 4.6 validation

- 壊れたJSONをそのまま採用しないこと
- 最低限の schema validation が可能であること
- 必須キー不足や型不整合を検知できること

---

## 5. Image / Appearance Acceptance Criteria

### 5.1 画像形式

初期段階では、次の読み込みができればよい。

- PNG
- JPEG

### 5.2 初期仕様

- front と side を扱える
- back は必須にしない
- side は mirror で左右対応できる
- 表示位置はプレビュー内で変更できる
- サイズ変更ができる

---

## 6. Voice Acceptance Criteria

### 6.1 初期範囲

初期段階の音声機能は、次を満たせばよい。

- 声を選べる
- 音声 ON / OFF を切り替えられる
- テスト再生できる
- 発話時にその声を使える

### 6.2 後回しにしてよいもの

次は初期合格条件に含めない。

- 話速調整
- ピッチ調整
- カテゴリ別読み上げ制御の詳細
- 高度な外部音声エンジン連携

---

## 7. AI Assist Acceptance Criteria

### 7.1 基本方針

AI補助は存在してよいが、本体の必須コアにはしない。  
初期段階では、少なくとも次の導線があればよい。

- personality 用 JSON の生成補助導線
- behavior 用 JSON の生成補助導線
- templates 用 JSON の生成補助導線
- 返ってきた JSON を取り込むUI

### 7.2 採用条件

- JSON をブロック単位で取り込めること
- 壊れた JSON は reject できること
- フォームUIへ反映できること

---

## 8. Review / Patch Acceptance Criteria

### 8.1 Review

次が成立していること。

- コメント状態が見える
- unknown を絞り込める
- ignore ができる
- 既存カテゴリへ追加できる
- 新規候補として保留できる

### 8.2 Patch

次が成立していること。

- review 結果を差分として保持できる
- 既存設定を毎回全面上書きしない
- patch を base とは別に扱える

### 8.3 compile / rollback

初期段階では詳細UIは不要だが、少なくとも concept として次を持つこと。

- patch は compile 前提である
- compile 前後の安全装置が必要である
- rollback の方向性が文書上定義されている

---

## 9. Practical Demo Acceptance Criteria

ポートフォリオとして初期版が成立したとみなせる最低条件は次のとおり。

### Demo 1
- キャラを表示できる
- 位置を動かせる
- front / side を確認できる

### Demo 2
- コメントを入力すると分類される
- VTuner が反応する
- 吹き出しと音声を確認できる

### Demo 3
- 性格設定を変えると、レーダー・ラベル・例文が変化する

### Demo 4
- unknown コメントを review で確認し、既存カテゴリへ追加できる

---

## 10. Non-Goals for Initial Acceptance

次は初期合格条件には含めない。

- 完全な高精度コメント理解
- リアルタイム自由生成会話
- 高度な感情制御
- back 表示
- 複雑なアニメーション補間
- 複雑な自動クラスタリング
- 本番長時間運用レベルの耐障害性の完全担保

---

## Summary

VTuner の初期版は、  
「配信中に安定して反応し、ユーザーが見た目・性格・反応を調律でき、配信後に見逃しを回収して育てられること」  
を満たせば合格とする。

本書は、その合格ラインを実装とUIの両面から固定するための基準である。
