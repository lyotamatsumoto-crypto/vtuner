# 02_DOMAIN_MODEL.md

## Purpose

本書は、VTuner プロジェクト内で使う主要な用語と概念を固定するための文書である。  
目的は次のとおり。

- 文書間・実装間で同じ言葉を同じ意味で使う
- frontend / backend / review / AI補助での解釈ズレを防ぐ
- IDE agent が曖昧な言葉を勝手に別解釈しないようにする

本書で定義する用語は、他文書より先に参照される基礎語彙とする。

---

## VTuner

VTuner は、配信画面の端に常駐する「仲介者キャラクター」およびそのシステム全体を指す。  
文脈に応じて、次の2つの意味を持つ。

1. 画面上に表示される 2D キャラクター
2. コメント反応・設定・レビュー・改善ループを含むツール全体

曖昧さを避ける必要がある場合は、次のように言い分ける。

- `VTuner character` : 画面上のキャラクターそのもの
- `VTuner app` : ツール全体

---

## Character

配信画面上に表示される 2D キャラクター本体。  
画像素材と、その表示状態を含む。

### Character が持つもの
- front 画像
- side 画像
- 現在位置
- 現在サイズ
- 現在向き
- 現在の吹き出し表示状態

### 初期方針
- back は初期段階では必須にしない
- side は 1枚を mirror 利用する前提でよい

---

## Appearance

Character の「見た目の使い方」を定義する設定領域。  
画像そのものではなく、画像をどう表示するかを表す。

### 代表例
- frontImage
- sideImage
- mirrorSide
- position
- scale

---

## Personality

仲介者の基本性格を表す設定領域。  
「どういうキャラか」という傾向を定義する。

### 代表例
- 性格タイプ
- 元気さ
- やさしさ
- 丁寧さ
- 自発性
- 距離感

### 補足
Personality は、発話全文を直接生成するものではなく、  
発話候補の選択や文体補正の重みに使う。

---

## Speech Style

仲介者の具体的な話し方を表す設定領域。  
Personality より具体的で、言葉の表面に近い要素を持つ。

### 代表例
- 口調
- 語尾
- 視聴者の呼び方
- 配信者の呼び方
- 好きな言い回し
- 避けたい言い回し
- 禁止表現
- 参考セリフ

### 補足
- Personality は傾向
- Speech Style は具体語

両者は競合せず、補完関係にある。

---

## Behavior

「何にどう反応するか」を定義する設定領域。  
発話の条件や頻度、対象の扱いを表す。

### 代表例
- カテゴリごとの反応 ON/OFF
- unknown の扱い
- 時間イベント設定
- 名前イベント設定
- 音声利用方針
- クールダウン

---

## Category

コメントやイベントの意味上の分類単位。  
backend は入力を category に分類し、templates と結びつける。

### 初期候補
- greeting
- praise
- question
- laugh
- topicPrompt
- system
- unknown

### 補足
category は「コメント本文そのもの」ではなく、  
コメントが持つ反応上の意味ラベルである。

---

## Target

その発話が誰に向いているかを表す値。

### 値
- `streamer`
- `audience`
- `system`

### 意味
- `streamer` : 配信者に向けた補助発話
- `audience` : 視聴者に向けた案内・反応
- `system` : 状態や内部通知寄りの発話

---

## Mode

Character の向き・見せ方に関する値。  
frontend 側の描画に使う。

### 初期値
- `front`
- `side`

### 初期方針
- back は初期段階では使わない
- side は配信者側へ向いて話している印象も担う

---

## Emotion

Character の表情や演出トーンを表す値。  
frontend 側での見た目分岐に使う。

### 値候補
- neutral
- happy
- sad
- angry
- surprised

### 補足
初期段階では値を持つだけでもよく、  
すべての emotion に専用画像がなくてもよい。

---

## Event

frontend と backend の間でやり取りされる通信単位。  
WebSocket を通じて送受信される JSON オブジェクトを指す。

### 代表例
- vtuner_state
- vtuner_message
- vtuner_debug
- vtuner_error
- test_comment_submit

---

## Template

最終発話候補として使われる文の辞書要素。  
category や target、イベント条件などに応じて選ばれる。

### 例
- greeting 用テンプレート
- question 用テンプレート
- idlePrompt 用テンプレート
- longName 用テンプレート

---

## Runtime State

実行中の現在状態。  
設定ではなく、「今どうなっているか」を表す。

### 代表例
- current mode
- current action
- current emotion
- currentMessageId
- queueLength
- connection state

---

## Queue

frontend 側で順番に表示・再生するための待機列。  
主に `vtuner_message` を順次処理するために使う。

### 初期方針
- 逐次処理
- 並列発話はしない
- 溢れたら低優先度から捨てる
- unknown は積まない

---

## Review

配信後にコメントや反応履歴を見直し、  
見逃しや改善点を仕分ける行為、およびその画面を指す。

### 主な目的
- unknown の回収
- ignore の追加
- 既存カテゴリへの追加
- 新規候補の保留

---

## Patch

既存設定への差分追加を表すデータ。  
全面上書きではなく、後から追加・修正した内容を保持する。

### 代表例
- 既存カテゴリへの keyword 追加
- templates 候補追加
- ignore 追加
- 新カテゴリ候補

### 補足
patch は永久に積み上げることを目的としない。  
将来的に compile の対象となる。

---

## Compile

base config と patch 群を統合して、  
実行時に使う compiled runtime config を作る処理。

### 補足
初期段階では compile の詳細実装を急がないが、  
patch の存在は compile を前提に設計する。

---

## Unknown

分類できなかったコメント、または意味を安全に確定できなかったコメントの状態。

### 原則
- 無理に発話しない
- ログへ残す
- review で回収する

Unknown は失敗ではなく、安定性を優先した結果として許容される状態である。

---

## Ignore

意図的に無視する対象または状態。

### 例
- ノイズ的コメント
- NGワードを含む名前
- 記号だらけの名前
- 処理対象にしたくない特定傾向

---

## Name Event

投稿者名に関するイベント・反応の総称。

### 代表例
- 名前を読む / 読まない
- 長い名前への反応
- 初回っぽい名前への反応
- 回数到達への反応
- NG名 / センシティブ名の除外

---

## Time Event

時間経過に基づいて起きるイベントの総称。

### 代表例
- 一定時間コメントなし
- 無言時の話題振り

---

## AI Assist

ブラウザAIや外部AIを使って、設定JSONや候補文を補助生成する導線。  
配信中の中核挙動ではなく、設定と改善の補助を担う。

### 主な用途
- personality JSON 生成補助
- behavior JSON 生成補助
- templates JSON 生成補助
- patch 候補生成補助

---

## Preview / Test

VTuner を実際に置いて、動かして、反応を確認するための画面。  
見た目調整とテストを同じ場で行う。

### 代表要素
- YouTube風の簡易配信画面
- 縦長プレビュー枠
- コメント手入力
- サンプル再生
- 疑似イベント発火
- 音声確認

---

## UI Language Policy

初期段階の frontend UI は日本語固定とする。

### 意味
- ラベル
- ボタン文言
- 説明文
- 状態表示
- 設定名

は、当面日本語を前提に設計する。

### 補足
多言語対応は初期段階の必須対象にしない。  
ただし、後から差し替えやすい構造が望ましい。

---

## Summary

本書で定義した用語は、VTuner の他仕様における基礎語彙である。  
今後の文書や実装では、本書の意味を優先して解釈する。
