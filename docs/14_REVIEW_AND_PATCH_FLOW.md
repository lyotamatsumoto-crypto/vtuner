# 14_REVIEW_AND_PATCH_FLOW.md

## Purpose

本書は、VTuner における配信後レビューと patch 追加の流れを定義する。  
目的は次のとおり。

- 配信中に拾えなかった反応を、配信後に回収できるようにする
- 自動学習ではなく、ユーザーの明示的な判断で設定を育てる
- 既存設定を壊さず、差分として追加できるようにする
- review と patch を分離し、改善ループをわかりやすくする
- review と Detailed Rules を分離し、役割を混同しないようにする

---

## Basic Policy

- 配信中の安定動作を優先する
- 配信中に理解できなかったコメントは `unknown` として残してよい
- 配信後にユーザーが意味を仕分けする
- 改善は全面再生成ではなく patch 方式で追加する
- VTuner が勝手に性格や辞書を変える設計にはしない
- 配信後レビューは「本格的なルール編集の場」ではなく、「仕分けと候補化の場」とする
- 正式なルール定義や詳細な編集は Detailed Rules 側で行う

---

## Review Flow Overview

配信後レビューの基本フローは次のとおり。

1. 配信中ログを保持する
2. コメントごとの状態を確認する
3. `unknown` や `skipped` を中心に見直す
4. 必要なら既存カテゴリへの追加候補とする
5. 必要なら ignore にする
6. 必要なら新カテゴリ候補として保留する
7. その結果を patch 候補としてまとめる
8. patch を保存または compile 前の差分として保持する
9. 必要なものは Detailed Rules 側で正式なルールとして整理する

---

## Review Targets

### Comment States

レビュー対象の基本状態は次のとおり。

- `displayed`
- `skipped`
- `ignored`
- `unknown`

### Meaning of Each State

#### displayed
分類され、実際に VTuner が反応したコメント。

#### skipped
分類はできたが、優先度や重複などの理由で表示・発話に使わなかったコメント。

#### ignored
無視ルールや除外ルールにより、処理対象から外したコメント。

#### unknown
分類できなかったコメント。  
初期レビューでは、特にこの状態を重点的に扱う。

---

## Review UI Direction

レビュー画面は、次の考え方で構成する。

- 全件を細かく読むことを前提にしない
- まず `unknown` を中心に絞り込めるようにする
- 一括操作しやすくする
- 詳細情報は必要時だけ見られるようにする
- patch 候補へつなげやすくする
- review の結果をその場で本体設定へ即全面反映する前提にはしない
- review 画面の役割は「正式追加」ではなく「判断結果の整理」にとどめる

### Suggested Initial Filters

- すべて
- unknown のみ
- skipped のみ
- displayed のみ
- ignored のみ

### Suggested Initial Sorts

- 新しい順
- 出現回数順
- コメント本文順

---

## Minimum Review Operations

初期段階で最低限必要な操作は次のとおり。

### 1. ignore
このコメントまたはこの傾向を今後も無視したいときに使う。  
review 上では ignore 候補として扱い、patch 候補へ反映する。

### 2. add to existing category
既存カテゴリへ寄せたいときに使う。  
これは「その場で完成済みルールへ直接書き込む」ことではなく、  
既存カテゴリへの追加候補として patch に入れる操作とする。

例:
- `question`
- `praise`
- `greeting`

### 3. hold as new candidate
すぐ反映せず、新カテゴリ候補や後回し候補として保留する。

### 4. bulk apply
似たコメントを複数選択して、同じ操作をまとめて適用する。

---

## Bulk Handling Philosophy

レビュー負荷を下げるため、初期段階でも一括操作を重視する。

### Initial Bulk Cases

- 複数の `unknown` をまとめて ignore
- 複数の `unknown` を既存カテゴリへの追加候補としてまとめて扱う
- 類似した反応をまとめて新規候補にする

### Notes

- 高度な自動クラスタリングは初期段階では必須ではない
- まずは複数選択 + 一括適用で十分
- 類似判定が未実装でも、一括操作できれば運用価値がある

---

## Patch Philosophy

### Why Patch Is Used

review の結果を既存設定へ直接全面上書きすると、  
すでに整っている設定まで壊れる可能性がある。

そのため、review 結果はまず patch として保持する。

### What Patch Represents

patch は、次のような「差分追加」を表す。

- 既存カテゴリへのキーワード追加候補
- 既存テンプレートへの候補追加
- ignore ルール追加
- 新規カテゴリ候補
- 名前イベント候補追加
- 時間イベント候補追加

### Patch Position in Workflow

patch は、review 結果をその場で完成形にするためのものではなく、  
後で整理・見直し・compile できるようにするための中間差分である。

review 画面で行う操作は、まず patch 候補へ落とし込まれることを基本とする。

---

## Patch Types

### 1. Rule Patch
分類ルールや keyword を追加する差分。

例:
- `question` に新しいキーワード追加
- 長い名前の扱いルール追加

### 2. Template Patch
テンプレート辞書へセリフ候補を追加する差分。

例:
- `idlePrompt` 用の新しい発話候補追加
- `longName` 用の噛んだ演出候補追加

### 3. Ignore Patch
無視対象を追加する差分。

例:
- 特定の記号だらけ名前を除外
- 特定傾向のコメントを ignore にする

### 4. New Candidate Patch
今すぐ本採用しないが、将来カテゴリやイベントとして追加したい候補。

---

## Direct Patch Addition vs Stock for Later

review からの変更は、すべて同じ重さで扱わない。  
次の2種類に分ける。

### Add to Patch Now
その場で patch 候補に入れてよいもの。

例:
- 既存カテゴリへの単純な追加候補
- ignore 追加候補
- 単純な keyword 追加候補

### Stock for Later
いったん保留し、あとでまとめて整理したほうがよいもの。

例:
- 新カテゴリ作成
- 性格に合わせた自然文追加
- 境界が曖昧なカテゴリ整理
- AI補助で patch 候補生成したいもの
- Detailed Rules 側で本格整理したいもの

### Important Note

`Add to Patch Now` は「即時に VTuner 本体へ確定反映する」ことを意味しない。  
review 画面では、あくまで patch 候補への追加として扱う。

実際の正式定義や本格的なルール化は、必要に応じて Detailed Rules 側で行う。

---

## Relationship to Detailed Rules

### Role Separation

配信後レビューと Detailed Rules は役割を分ける。

#### Review
- ログを見返す
- `unknown` や `skipped` を見直す
- ignore / 既存カテゴリ寄せ / 保留を判断する
- patch 候補として整理する

#### Detailed Rules
- patch 候補や保留候補を正式なルールとして定義する
- 新カテゴリや条件イベントを本格追加する
- 発話や条件を詳細に編集する
- review だけでは確定しにくい内容を整理する

### Design Intention

review 画面は「本格的な編集画面」ではなく、  
改善候補をためて整理する入口として扱う。

review で見つかった追加候補を、Detailed Rules 側へ送って正式ルール化できる構造が望ましい。

---

## AI Assistance in Review

AI は review でも補助役として使えるが、主判断者にはしない。

### Allowed Uses

- unknown コメント群の候補カテゴリ整理
- 新規テンプレート候補の下書き
- patch JSON の下書き
- 既存カテゴリとの重なり確認補助

### Not Intended For

- review 結果の自動確定
- 人間の確認なしの patch 適用
- 自動で personality を書き換えること

### Position of AI

AI は review を成立させるための必須前提ではない。  
まずはユーザーの明示的な判断だけで review / patch flow が成立することを優先する。

---

## Initial Review Focus

初期段階では、review 機能を広げすぎない。  
まずは次を重視する。

### Focus
- `unknown` の回収
- 既存カテゴリへの追加候補化
- ignore
- 新規候補の保留

### Not Required Initially
- 完全自動クラスタリング
- 複雑な類似度判定
- 高度な時系列分析
- 多段階承認フロー
- AI 前提の自動整理

---

## Suggested Patch Example

```json
{
  "addRules": {
    "questionKeywords": ["ランクいく", "次ランク", "このあとランク"]
  },
  "addTemplates": {
    "question": {
      "toStreamer": [
        "これ、気になっている人がいそうです"
      ]
    }
  }
}
Compile Relationship

patch は永久に積み上げる前提ではない。
一定数たまったら、base config + patch を compile して、
新しい compiled runtime config を作る前提とする。

Compile Before/After Safety

将来的には、少なくとも次を持てると望ましい。

compile 前スナップショット
compile 後スナップショット
1つ前に戻す手段

初期段階では詳細実装を急がないが、
review / patch 設計はこの方向を前提にしておく。

Acceptance Direction

review / patch flow が最低限成立したとみなせる条件は次のとおり。

コメント状態を表示できる
unknown を絞り込める
ignore を選べる
既存カテゴリへの追加候補化ができる
新規候補として保留できる
patch 候補を差分として保持できる
review と Detailed Rules の役割が混同されていない
Summary

VTuner の review は、
「配信中に完璧に理解する」のではなく、
「配信後に意味を仕分けして育てる」ための仕組みである。

改善は自動学習ではなく、
ユーザーの明示的な判断と patch によって行う。

初期段階では unknown 回収と一括操作を中心に据え、
複雑すぎる自動整理は後回しにする。

また、review は正式なルール編集の場ではなく、
仕分けと候補化の場として扱う。
本格的な追加や詳細なルール化は Detailed Rules 側で行う。