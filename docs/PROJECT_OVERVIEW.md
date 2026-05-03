# PROJECT_OVERVIEW.md

## Purpose

本書は、このプロジェクトの目的、想定ユーザー、MVP、非目標、前提条件を定義する文書である。  
実装、設計、Phase 分割、技術判断は、まず本書の内容を前提として行うこと。

---

## Project Summary

### Project name
VTuner

### One-line summary
主にリスナーコメントへ反応する仲介キャラクターを、ルールベースで運用、調整、改善するための配信補助アプリ。

### Short description
VTuner は、配信画面の端に常駐するキャラクターを通じて、コメント反応、配信者補助発話、返答カテゴリ、条件イベント、人格差分を運用するアプリである。  
アプリ内部に AI は持たず、外部ブラウザ AI を使って設定や定義を JSON 形式で生成し、検証後に本採用する仕組みを持つ。

---

## Problem Statement

このプロジェクトが解決したい問題は次のとおり。

- 配信コメントへの反応を、単なる読み上げよりもキャラ性ある形で扱いたい
- 非プログラマでも、性格や返答集や条件イベントを調整したい
- unknown や skipped を配信後に整理し、改善へ反映したい
- 外部 AI を使った設定生成を、壊れにくい JSON ワークフローとして扱いたい

---

## Project Goal

このプロジェクトの主目標は次のとおり。

- 主にリスナーコメントに反応する VTuner runtime を成立させる
- 5 画面構成で責務分離された UI を作る
- 外部ブラウザ AI を使って、非プログラマでも JSON 形式の設定や定義を作成できるようにする
- Review と compile により、改善を継続できる構造を作る

---

## Target Users

### Primary target
自分の配信文化に合う仲介キャラクターを育てたい個人配信者。

### Secondary target
配信補助 UI やルールベース運用に興味のある個人開発者、または VTuber 文化に親和性のある制作者。

### User characteristics
- 非プログラマ前提で使いたい
- UI 中心で設定を扱いたい
- 二次元文化や VTuber 文化に馴染みのある人格プリセットを使いたい
- 外部 AI を補助的に使いたいが、アプリ内部には AI を置きたくない
- 配信後 review を通してキャラを改善したい

---

## Value Proposition

このプロジェクトがユーザーに提供する主な価値は次のとおり。

- コメントへ反応する仲介キャラクターを、ルールベースで運用できる
- キャラの人格、口調、返答カテゴリ、条件イベントを UI 中心で調整できる
- 外部ブラウザ AI を使って、JSON 形式の設定を非プログラマでも扱える
- 配信後 review から patch を作り、compile により本体へ反映できる

---

## MVP Definition

今回の開発で最低限成立させるべき MVP は次のとおり。

- 5 画面が責務分離された状態で存在する
- VTuner が主にリスナーコメントへルールベースで反応する
- Preview / Test で見た目と挙動を確認できる
- Basic Settings でキャラの共通土台を設定できる
- Review で unknown / skipped / displayed / ignored を整理できる
- Detailed Rules で正式なルールと定義を編集できる
- AI / JSON Studio で生成、JSON 取込、検証、エラー修正、採用、履歴管理ができる
- compile により採用済み差分を正式データと runtime に反映できる

---

## MVP Boundary and Extension

現時点の実装は「条件付きMVP完了」を基準に評価し、MVP後の追加機能は別レイヤーで扱う。  
拡張機能の優先順、導入範囲、停止条件は `ROADMAP_TO_EXTENSION.md` を正とし、本書では目的・MVP・非目標の定義を維持する。

---

## Non-goals

現段階では、以下は対象外とする。

- アプリ内部に LLM を組み込むこと
- 配信中の主制御を外部 AI に任せること
- 自由会話を中心に据えること
- 自動学習で人格やルールを勝手に変化させること
- JSON 直編集を主な利用手段にすること
- 本番長時間運用レベルの耐障害性基盤を最初から完成させること

---

## Success Criteria

このプロジェクトが最低限成立したと言える条件は次のとおり。

- 5 画面の責務が明確で混線していない
- コメント反応、条件イベント、返答集が最低限動作する
- Review 由来 patch と AI JSON 由来差分が separate queue で扱える
- compile により採用済み変更を本体へ反映できる
- 非プログラマでも、外部 AI を使った設定作成が追える

---

## Assumptions

本プロジェクトの現時点の前提条件は次のとおり。

- VTuner は主にリスナーコメントへ反応する
- 配信者向け発話は補助的だが正式に扱う
- 配信者向け人格と視聴者向け人格は分けて持つ
- 口調、語尾、好きな言い回し、禁止表現は別レイヤーで持つ
- アプリ内部に AI は持たない
- 外部ブラウザ AI は JSON 生成のために使う
- JSON 検証成功なら基本本採用とする
- エラー時は再修正プロンプトを生成する
- compile は採用済み差分を本体へ反映する正式処理である

---

## Constraints

### Time / scope constraints
- MVP では土台と運用導線を優先する
- 二次元文化親和性は高めるが、過剰に文化知識へ依存しすぎない

### Technical constraints
- アプリ内部に AI を組み込まない
- JSON スキーマとデータ境界を崩さない
- 5 画面責務を混線させない

### Cost constraints
- 小規模個人開発として維持しやすい構成を優先する
- 明示許可なしで依存追加しない

### Operational constraints
- pytest 実行と Git / GitHub 実操作はユーザー担当
- AI はワークスペース外を変更しない

---

## Functional Scope

### In scope
- コメント反応
- 配信者補助発話
- 人格プリセット
- 口調プリセット
- 返答カテゴリ
- 返答集
- 条件イベント
- Review patch
- AI / JSON Studio
- compile
- マイプリセット化

### Out of scope
- 配信中の自由生成会話
- アプリ内部推論 AI
- 自動人格変化
- 大規模配信プラットフォーム連携完成
- 高度なモデレーション自動化

---

## Related Documents

- `README.md`
- `AGENTS.md`
- `PHASES.md`
- `CHECKPOINTS.md`
- `COMPLETION_CRITERIA.md`
- `UI_SPEC.md`
- `CONFIG_SCHEMA.md`
- `EVENT_PROTOCOL.md`
- `REVIEW_FLOW.md`
- `AI_JSON_STUDIO_SPEC.md`
- `IMPLEMENTATION_GUIDE.md`
