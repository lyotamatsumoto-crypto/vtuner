# 13_CONFIG_SCHEMA.md

## Purpose

本書は、VTuner における設定データの構成方針を定義する。  
目的は次のとおり。

- 設定を役割ごとに分割する
- frontend / backend / AI補助が共通理解できる形を持つ
- ユーザー編集用UIと内部契約を分離する
- patch と compile を見据えた構造を用意する

---

## Basic Policy

- 設定は単一巨大ファイルにしない
- 役割ごとにブロック分割する
- 内部では JSON 系データで扱う
- ユーザーは主にフォームUIを通じて編集する
- AI補助は各ブロック単位で JSON を生成する
- patch はベース設定とは別で保持する
- 実行時は compiled runtime config を使う

---

## Main Config Blocks

現時点の主要ブロックは次のとおり。

1. personality
2. behavior
3. templates
4. appearance
5. patches
6. runtime config

必要に応じて将来追加:
- voice
- review preferences
- test scenarios

---

## 1. personality

### Role

仲介者の性格と話し方の傾向を表す。  
「どういうキャラか」「どういう雰囲気で話すか」を定義する。

### Includes

- 性格タイプ
- 口調
- 語尾
- 元気さ
- やさしさ
- 丁寧さ
- 自発性
- 距離感
- 視聴者の呼び方
- 配信者の呼び方
- 好きな言い回し
- 避けたい言い回し
- 禁止表現
- 参考セリフ
- ラベル生成の元になる情報

### Notes

- 数値は最終発話を直接生成するためではなく、候補選択や文体補正の重みとして扱う
- personality は「傾向」と「具体語」の両方を持てる
- AI補助で生成する対象として適している

### Example Shape

```json
{
  "archetype": "gentle",
  "tone": "casual",
  "sentenceEndingStyle": ["だよ", "だな", "かな"],
  "energy": 0.7,
  "warmth": 0.8,
  "formality": 0.3,
  "initiative": 0.6,
  "closeness": 0.9,
  "viewerAddress": "ブラザー",
  "streamerAddress": "おまえ",
  "preferredPhrases": ["よぉ", "なるほどな"],
  "avoidPhrases": ["黙れ"],
  "forbiddenPhrases": ["差別的表現"],
  "referenceLines": [
    "よぉブラザー",
    "新入りが何のようだ？"
  ]
}
```

---

## 2. behavior

### Role

何に反応するか、どんな条件で発話するか、どの程度しゃべるかを定義する。

### Includes

- コメントカテゴリのON/OFF
- unknown の扱い
- target 別の基本方針
- 一定時間無言イベント
- 名前イベント
- 回数イベント
- 読み上げ対象ルール
- 優先度・クールダウンの基本値
- 音声利用のON/OFF方針

### Notes

- personality が「どういう雰囲気か」なら、behavior は「どんな条件で反応するか」
- behavior は時間イベントや名前イベントの受け皿になる
- AI補助で生成する場合も、値の枠はアプリ側が先に用意する

### Example Shape

```json
{
  "categories": {
    "greeting": true,
    "praise": true,
    "question": true,
    "laugh": true,
    "topicPrompt": true,
    "unknown": false
  },
  "idlePrompt": {
    "enabled": true,
    "thresholdSec": 60
  },
  "nameHandling": {
    "useNames": true,
    "longNameMode": "stumble",
    "maxNormalLength": 12
  },
  "commentMilestones": {
    "enabled": true,
    "thresholds": [1, 10]
  },
  "voice": {
    "enabled": true
  }
}
```

---

## 3. templates

### Role

カテゴリ別・イベント別の実際の発話候補を保持する。  
VTuner が最終的に使うセリフの辞書である。

### Includes

- greeting 用テンプレート
- praise 用テンプレート
- question 用テンプレート
- laugh 用テンプレート
- topicPrompt 用テンプレート
- idlePrompt 用テンプレート
- name event 用テンプレート
- long name event 用テンプレート
- toStreamer / toAudience の違い

### Notes

- personality はテンプレートの選び方に影響する
- templates は具体文の候補集
- カテゴリ別とイベント別を区別してもよい
- 同じカテゴリでも target に応じて分岐できる

### Example Shape

```json
{
  "greeting": {
    "toAudience": [
      "来てくれた人がいるみたいだ",
      "よぉブラザー"
    ],
    "toStreamer": [
      "初見っぽい人が来ていますよ"
    ]
  },
  "question": {
    "toStreamer": [
      "質問が来ていますよ",
      "これ気になってる人がいそうです"
    ]
  },
  "idlePrompt": {
    "toStreamer": [
      "少し静かですね",
      "仕方ないから話題ふってやるよっ！"
    ]
  },
  "longName": {
    "toAudience": [
      "{namePrefix}…ぶらぶらぶら…長すぎて呼べなかったよ、ごめんね"
    ]
  }
}
```

---

## 4. appearance

### Role

キャラクター画像と表示方法を定義する。  
素材そのものと、その素材の使い方を橋渡しする設定ブロック。

### Includes

- front画像参照
- side画像参照
- side の mirror 利用
- 初期位置
- 初期サイズ
- 必要に応じて吹き出し位置

### Notes

- 画像自体は asset
- 画像をどう使うかは appearance
- 初期段階では back は含めない
- side は 1枚を左右反転で使う前提でよい

### Example Shape

```json
{
  "frontImage": "assets/characters/default/front.png",
  "sideImage": "assets/characters/default/side.png",
  "mirrorSide": true,
  "position": {
    "x": 120,
    "y": 540
  },
  "scale": 1.0
}
```

---

## 5. patches

### Role

配信後レビューなどで追加・変更された差分を保持する。  
ベース設定の全面書き換えではなく、明示的な追加・修正として扱う。

### Includes

- 既存カテゴリへのキーワード追加
- 既存テンプレートへの候補追加
- ignore 追加
- 新カテゴリ候補
- 名前イベント追加
- idlePrompt 追加候補

### Notes

- patch は一時的に積み上がる
- 永久に積み続けるのではなく、将来的に compile してまとめる
- patch は元設定を壊さずに差分を表現するために使う

### Example Shape

```json
{
  "addTemplates": {
    "question": {
      "toStreamer": [
        "これ、気になっている人がいそうです"
      ]
    }
  },
  "addRules": {
    "questionKeywords": ["ランクいく", "このあとランク"]
  }
}
```

---

## 6. compiled runtime config

### Role

実行時に backend / frontend が使う最終設定。  
base と patch、必要な上書きや統合を反映した結果として生成される。

### Includes

- personality の確定値
- behavior の確定値
- templates の確定値
- appearance の確定値
- patch 反映結果
- 実行に必要な補助値

### Notes

- 実行中はこの compiled config を主に参照する
- compile 前後でスナップショットを持てると安全
- rollback の足場になる

---

## Editing Philosophy

### User Editing

- ユーザーはフォームUI中心で編集する
- JSON を直接主操作しない
- 必要なら取り込み・詳細確認用に JSON を見せる

### AI-assisted Editing

- AI には各ブロック単位で JSON を生成させる
- 一発で全設定を作らせない
- personality / behavior / templates を分けて扱う
- 出力は validator を通ったものだけ採用する

---

## Validation Philosophy

各ブロックは schema で最低限検証する。

### 検証したいことの例

- 必須キーの有無
- 型の整合
- enum 値の整合
- 数値範囲
- テンプレート配列の最小件数
- 長すぎる文字列の除外
- 無効カテゴリ参照の検出

詳細な schema は別途定義してよい。

---

## Merge / Precedence Policy

設定の優先順位は次を基本とする。

1. base config
2. user-edited config
3. patch additions
4. latest manual override

### 補足

- personality / behavior / templates / appearance は別々に評価してよい
- patch は base の上に差分適用する
- 競合時の細かいマージルールは別仕様で定義する

---

## Initial Areas That Must Stay Flexible

以下は最初から固定しすぎない。

- 初期カテゴリの最終数
- idlePrompt の段階数
- 名前イベントの細かい条件
- long name の扱いモードの数
- voice ブロックの詳細項目
- review 由来 patch の細分化粒度

---

## Summary

VTuner の設定構造は、  
「性格」「反応」「セリフ」「見た目」を分離しつつ、  
配信後レビューによる patch 追加と、将来の compile を見据えて組み立てる。

内部では JSON 系契約を使うが、  
ユーザーに見せる編集体験はフォームUI中心とする。
