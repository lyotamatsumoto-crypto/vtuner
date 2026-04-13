# 01_SYSTEM_OVERVIEW.md

## Purpose

本書は、VTuner システム全体の構成と責務分離を整理するための概要仕様である。

本書の目的は次のとおり。

- VTuner 全体を大きな単位で理解しやすくする
- frontend / backend / config / review の責務を分ける
- Basic Settings と Detailed Rules の境界を明確にする
- 今後の個別仕様書を読むための土台にする

本書は詳細実装書ではなく、全体の見取り図を提供する文書である。

---

## System Goal

VTuner は、配信中のコメントと配信者の状況のあいだに立つ  
**仲介者キャラクター** を扱うシステムである。

この仲介者は、単なる読み上げ機能ではなく、

- 視聴者に反応する
- 必要に応じて配信者に話しかける
- 場をつなぐ
- 配信後に改善できる

という役割を持つ。

ただし、初期段階では過度な自律性を持たせず、  
**ルールベース中心** で安定性と説明可能性を優先する。

---

## High-Level Structure

VTuner は大きく次の要素で構成される。

1. Frontend
2. Backend
3. Config / Definitions
4. Review Flow

---

# 1. Frontend

## Role

frontend は、ユーザーが VTuner を設定し、確認し、テストし、振り返るためのUIを担当する。

frontend の責務は主に次のとおり。

- VTuner キャラクターの表示
- front / side 表示
- side の左右反転表示
- 吹き出し表示
- 音声再生
- Basic Settings UI
- Detailed Rules UI
- Preview / Test UI
- Review UI
- backend から受信したイベントの描画

frontend は、**表示と操作の場** であり、  
コメント分類や最終発話決定そのものは主責務としない。

---

## Frontend Screens

初期段階では、frontend は次の4画面構成とする。

1. Preview / Test
2. Basic Settings
3. Review
4. Detailed Rules

---

### 1. Preview / Test

この画面は、VTuner を実際に置いて、見て、動かして、確認する場所である。

主な役割:
- VTuner の位置確認
- VTuner の表示確認
- コメント入力テスト
- 疑似イベント発火
- 音声確認
- ルール動作確認
- 吹き出し実寸の調整
- 画像の仮差し替え確認

この画面では、見た目調整と反応テストを分けすぎず、  
**実際に使う感覚で確認できること** を優先する。

---

### 2. Basic Settings

この画面は、VTuner の**共通設定**を扱う場所である。

ここでは、キャラ全体に共通して効く設定を扱う。  
たとえば次のようなものが該当する。

- VTuner名
- 一人称
- 呼び方
- キャラプロフィール
- 性格タイプ
- 話し方タイプ
- 音声
- 画像
- 吹き出し
- フォント
- 反応カテゴリの大枠

Basic Settings は、**新しい定義を増やす場ではなく、既にあるものから選ぶ場** とする。  
ただし、フォント追加のような表示専用の軽量な追加はここで扱ってよい。

---

### 3. Review

この画面は、配信後の改善のための場所である。

主な役割:
- コメント履歴の確認
- displayed / skipped / ignored / unknown の確認
- unknown の整理
- 既存カテゴリへの追加候補整理
- 新ルール候補の回収

Review は、自動学習の場ではなく、  
**人間が意味を整理して改善につなげる場** とする。

---

### 4. Detailed Rules

この画面は、**いつ、誰に、何を話すか** を決める場所である。

主な役割:
- 発話ルール一覧の管理
- 条件編集
- 発話相手編集
- 候補文編集
- ルール追加
- 定義追加
- JSON読込
- 外部AI用の指示文作成

Detailed Rules は、Basic Settings では扱わない  
**可変ルールと拡張定義** を扱う。

---

# 2. Backend

## Role

backend は、VTuner の実行ロジックを担当する。

主な責務は次のとおり。

- コメント入力の受理
- コメント分類
- ルール判定
- 条件イベント判定
- 発話内容決定
- target / mode / emotion / displayText の決定
- review 用ログ生成
- JSON読込内容の検証
- 自然言語記述の内部ルール変換
- runtime state の保持

backend は、**何を話すかを決める側** である。

frontend は表示するが、  
backend が決めた結果を受け取って描画・再生する。

---

## Backend Direction

初期段階では、backend は次の方針を持つ。

- ルールベース中心
- 誤判定より沈黙を優先
- 条件式や判定理由が説明可能
- failure は fail-close を優先
- review 用に十分なログを残す
- AIは補助として扱い、主制御にはしない

---

# 3. Config / Definitions

## Role

VTuner では、「設定」と「ルール」と「定義」を区別する。

この区別は非常に重要である。

---

## 3.1 Basic Settings Data

Basic Settings で扱うのは、キャラ全体に共通する設定である。

例:
- VTuner名
- 呼び方
- キャラプロフィール
- 音声設定
- 画像設定
- 吹き出し設定
- フォント設定
- 反応カテゴリの有効 / 無効

これらは、**どのルールにも共通して効く設定** である。

---

## 3.2 Rules

Rules は、「いつ、誰に、何を話すか」を決める単位である。

例:
- 挨拶コメントに反応する
- 180秒無言なら話題を振る
- 特定ユーザーには特別な挨拶を返す
- 初見っぽい名前なら歓迎する

ルールには通常、次の要素が含まれる。

- 条件
- 発話相手
- 候補文
- ON / OFF
- 補足情報

---

## 3.3 Definitions

Definitions は、Basic Settings 側の選択肢を増やすための定義である。

例:
- 性格タイプ定義
- 口調タイプ定義
- 語尾タイプ定義
- 反応カテゴリ定義

これらは、Basic Settings で「選べるもの」を増やす。  
ただし、名前だけ増えても意味がないため、必要に応じて説明や候補文の方向性を伴う。

---

## Important Distinction

VTuner では次のように分ける。

- **Basic Settings** = 共通設定を選ぶ
- **Rules** = 発話条件と候補文を決める
- **Definitions** = Basic Settings で選べる種類を増やす

この分離により、UIと内部構造の破綻を防ぐ。

---

# 4. Boundary Between Basic Settings and Detailed Rules

この境界は VTuner 設計の中核である。

---

## Basic Settings に置くもの

Basic Settings に置くのは、**キャラ全体に共通して効くもの** である。

代表例:
- VTuner名
- 一人称
- 視聴者の呼び方
- 配信者の呼び方
- キャラプロフィール
- 性格タイプ
- 口調タイプ
- 語尾タイプ
- 音声の種類
- 話すスピード
- 音量
- 画像
- 吹き出しの形
- フォント
- 文字サイズ
- 文字色
- 背景色
- 反応カテゴリの大枠

---

## Detailed Rules に置くもの

Detailed Rules に置くのは、**条件ごと・ルールごとに変わるもの** である。

代表例:
- どの条件で発話するか
- 誰に向けて話すか
- 候補文は何か
- 特定ユーザー対応
- 初見対応
- 時間イベント
- 名前イベント
- 体重を聞かれたらどう返すか
- 新しい性格タイプ定義
- 新しい口調タイプ定義
- 新しい語尾タイプ定義
- 新しい反応カテゴリ定義

---

## Explicit Non-Boundary Cases

次は Detailed Rules 側に送らない。

- フォント追加
- 文字色パレット
- 背景色パレット
- 吹き出しの形
- 吹き出しサイズの共通調整

これらは **表示共通設定** なので、Basic Settings / Preview 側に残す。

---

# 5. Runtime Flow

初期段階の大まかな実行フローは次のとおり。

1. コメントを受け取る
2. backend が分類または条件判定する
3. 使用ルールを決定する
4. 候補文を選ぶ
5. 発話内容を決定する
6. frontend に描画イベントを送る
7. frontend が吹き出し表示・音声再生を行う
8. ログを review 用に残す

---

## Event Nature

runtime では、次の種類のイベントを扱う。

- コメント由来イベント
- 条件イベント
- テストイベント
- state 同期イベント
- error イベント

イベントの詳細な形は `12_EVENT_PROTOCOL.md` 側で定義する。

---

# 6. Extension Policy

VTuner は、最初からすべてを自由化しない。  
拡張は段階的に行う。

---

## Initial Extension Targets

初期段階で拡張対象にするのは主に次のもの。

- 新しい発話ルール
- 新しい性格タイプ定義
- 新しい口調タイプ定義
- 新しい語尾タイプ定義
- 新しい反応カテゴリ定義

---

## JSON Role

JSON は、追加ルールや追加定義をまとめて取り込むための形式である。

JSON は日常UIの主役ではない。  
主な役割は次のとおり。

- 複雑なルールをまとめて追加する
- 新しい定義をまとめて追加する
- 外部AIからの出力を受け取る
- バックアップや共有に使う

---

## External AI Role

外部AIは、VTuner の発話を直接制御する存在ではない。  
外部AIは、主に次の補助に使う。

- 追加ルール案を作る
- 追加定義案を作る
- JSON案を作る

つまり、**外部AIは設定補助役** であり、  
runtime の本体ではない。

---

# 7. Review and Improvement Loop

VTuner は、配信後の改善ループを重視する。

このループは次のようになる。

1. 配信中にログを残す
2. Review 画面で unknown や missed case を確認する
3. 必要なものだけルール候補にする
4. Detailed Rules で正式ルール化する
5. 再度 Preview / Test で試す

この流れにより、  
「動かして終わり」ではなく  
**改善可能な仲介者** にする。

---

# 8. Initial Non-Goals

初期段階では、次を急いで扱わない。

- 完全自動の発話生成
- 高度な人格連続値制御
- 性格バーやレーダー
- 条件ごとに吹き出し見た目を変える
- 未知のJSONから未知のUIを自動生成する
- 完全自動の自然言語解釈
- 本物そっくりの配信サイトUI再現
- 高度なアニメーションシステム
- 複数オーバーレイの複雑な同時制御

---

# Summary

VTuner は、配信中のコメントと配信者のあいだに立つ  
**仲介者キャラクター** を扱うシステムである。

全体は大きく、

- Frontend
- Backend
- Config / Definitions
- Review Flow

で構成される。

frontend は次の4画面で構成する。

1. Preview / Test
2. Basic Settings
3. Review
4. Detailed Rules

ここで重要なのは、

- **Basic Settings** = 共通設定を選ぶ場所
- **Detailed Rules** = 発話ルールと拡張定義を管理する場所

という分離である。

この分離により、  
UIの破綻を避けつつ、  
VTuner を現実的に育てていける構造を維持する。