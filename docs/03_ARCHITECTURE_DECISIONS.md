# 03_ARCHITECTURE_DECISIONS.md

## Purpose

本書は、VTuner プロジェクトにおける重要な設計判断と、その理由を記録する。  
目的は次のとおり。

- 「なぜその形を採用したのか」を後から追えるようにする
- IDE agent が勝手に別方針へ寄らないようにする
- 実装時の迷いを減らす
- 将来方針を変えるときの比較基準を残す

本書は、細かいUI仕様ではなく、プロジェクト全体を支える判断を扱う。

---

## Decision 1
### 配信中のコア挙動はルールベースを優先する

#### Adopted
採用する。

#### Decision
配信中のコメント処理・反応決定・発話決定は、初期段階ではルールベース中心で構成する。

#### Reason
- 安定して動かしやすい
- 遅延を小さくしやすい
- 暴走やハルシネーションを避けやすい
- 配信中は「変なことを言わない」ことが特に重要
- review による明示的改善と相性がよい

#### Consequence
- 不確実なコメントは unknown として処理する
- 無理に喋らせない
- 高度な自由会話は初期段階の主目的にしない

---

## Decision 2
### AI は本体ではなく補助役に限定する

#### Adopted
採用する。

#### Decision
AI は配信中の主要発話決定には使わず、主に設定生成・候補生成・patch 補助に使う。

#### Reason
- 配信中の常時AI依存は不安定になりやすい
- API 利用はコストと制御責任が増える
- ローカルLLM常駐は GPU / VRAM / 遅延の問題が大きい
- VTuner の価値は「制御できる仲介者」であり、「自由生成AI」そのものではない

#### Consequence
- personality / behavior / templates の生成補助にAIを使える
- review 結果から patch 候補を作る補助にAIを使える
- 本番中の心臓部はAIに握らせない

---

## Decision 3
### 設定は巨大1ファイルではなくブロック分割する

#### Adopted
採用する。

#### Decision
設定は、personality / behavior / templates / appearance / patches などに分割する。

#### Reason
- 役割ごとに責務を分けやすい
- AI補助でも一括生成より小分け生成のほうが安定しやすい
- フォームUIと内部契約を整理しやすい
- patch の扱いが明確になる
- 将来の compile に向けて整理しやすい

#### Consequence
- 一発で全設定を生成する方針を取らない
- personality だけ、behavior だけ、templates だけの生成・取込が可能になる

---

## Decision 4
### ユーザー編集はフォームUI中心にする

#### Adopted
採用する。

#### Decision
設定編集の主導線は Markdown や生JSON ではなく、フォームUIとプレビューにする。

#### Reason
- ユーザーが理解しやすい
- 触って変化を確認しやすい
- ポートフォリオとして見せやすい
- JSONは内部契約としては強いが、主操作には向かない

#### Consequence
- JSON は内部データまたは取込用とする
- personality / speech / reaction / event をフォームで編集する
- レーダー・ラベル・例文で結果を見せる

---

## Decision 5
### 見た目調整とテストは同じ画面にまとめる

#### Adopted
採用する。

#### Decision
キャラクター配置の調整と、コメント・イベントの反応テストは同一画面で扱う。

#### Reason
- 実際の使用感に近い
- ユーザーの操作の流れが自然
- 「置く → 試す → 直す」を1か所で行える
- 見た目調整はテストの一部として扱ったほうがわかりやすい

#### Consequence
- Preview / Test 画面を主画面の1つとする
- VTuner は YouTube風の簡易配信画面内でドラッグ配置できるようにする

---

## Decision 6
### 画面構成は初期段階では3画面に絞る

#### Adopted
採用する。

#### Decision
frontend の主画面は次の3つに絞る。

1. Preview / Test
2. Personality / Speech / Reaction Settings
3. Review

#### Reason
- 画面数が多すぎると理解しづらい
- 役割の大きな塊ごとに整理しやすい
- 現段階の情報量に対してバランスがよい

#### Consequence
- AI取込は設定画面の中の補助機能にする
- キャラ調整は Preview / Test に含める
- Review は独立画面として残す

---

## Decision 7
### 画像は front / side を初期採用とし、back は外す

#### Adopted
採用する。

#### Decision
初期段階では front / side のみを扱い、side は 1枚を mirror 利用する。back は扱わない。

#### Reason
- 実装と素材準備が軽い
- 今必要な演出には十分
- side は「配信者のほうを向いて話す」印象にも使える
- back は初期コストに対して優先度が低い

#### Consequence
- appearance は frontImage / sideImage / mirrorSide を中心に設計する
- mode は初期段階では front / side 中心でよい

---

## Decision 8
### VTuner の位置調整は数値入力より直接操作を優先する

#### Adopted
採用する。

#### Decision
VTuner の配置は、Preview / Test 画面上でのドラッグ操作を基本にする。

#### Reason
- 直感的でわかりやすい
- OBS上での見え方を想像しやすい
- 配信ゲームごとに位置を変えたい要望と相性がよい
- 数値入力だけより実使用に近い

#### Consequence
- appearance に position は持つが、主編集はドラッグで行う
- 基本初期位置は右下とする

---

## Decision 9
### 音声は初期段階では「声を選ぶ」までに絞る

#### Adopted
採用する。

#### Decision
音声機能は、初期段階では声の選択と簡易テストを中心とする。

#### Reason
- まず反応とUI体験を固めたい
- 話速やピッチやカテゴリ別音声制御は広がりやすい
- 初期範囲を絞ることで仕様を安定させやすい

#### Consequence
- voice 設定は拡張余地を残しつつ、初期項目は最小限にする
- 音声テストは Preview / Test で確認できるようにする

---

## Decision 10
### 初期UI言語は日本語固定とする

#### Adopted
採用する。

#### Decision
frontend のUI文言、説明、ラベルは当面日本語固定とする。

#### Reason
- まずは設計理解と実装を優先したい
- 多言語対応を早期に入れると文言管理が複雑になる
- 現在の主利用者想定と作業環境に合っている

#### Consequence
- ボタン、ラベル、補助文は日本語で設計する
- i18n は初期必須にしない
- 将来差し替え可能な構造にしておく余地は残す

---

## Decision 11
### 配信後改善は自動学習ではなく review + patch で行う

#### Adopted
採用する。

#### Decision
配信中に拾えなかった反応の改善は、自動学習ではなく review で仕分けし、patch として追加する。

#### Reason
- ユーザーの制御感を保てる
- 性格や辞書が勝手に崩れない
- 何を追加したか追いやすい
- 失敗時に戻しやすい

#### Consequence
- unknown を許容する
- review 画面を重視する
- patch compile と rollback を将来見据える

---

## Decision 12
### キュー処理は逐次処理を基本とする

#### Adopted
採用する。

#### Decision
frontend の発話処理は並列ではなく逐次処理を基本とし、溢れたら低優先度から捨てる。

#### Reason
- 吹き出しと音声が重なると分かりにくい
- VTuner は整理役なので、1つずつ反応するほうが自然
- ポートフォリオとして安定して見せやすい
- 実装がシンプルになる

#### Consequence
- `vtuner_message` は順番に処理する
- unknown はキューへ積まない
- greeting など低優先カテゴリは破棄候補になりうる

---

## Decision 13
### 名前イベントは初期から一部対応する

#### Adopted
採用する。

#### Decision
名前に関する反応は完全後回しにせず、初期段階から次を対象にする。

- 名前を読む / 読まない
- 長い名前の扱い
- NG名 / センシティブ名制御
- 初回っぽい反応

#### Reason
- VTuner のキャラ性が出やすい
- 実況体験として面白い
- ただし全部入れると複雑なので、範囲は絞る

#### Consequence
- 名前イベントの設定欄を画面2に持つ
- 長い名前の「噛んだ演出」などはテンプレート化して扱う
- コメント回数節目反応は後から拡張してよい

---

## Decision 14
### 無言時イベントは初期から1種類入れる

#### Adopted
採用する。

#### Decision
一定時間コメントが来ないときの話題振りイベントを、初期段階から扱う。

#### Reason
- 配信者への補助感が出る
- キャラ性が出やすい
- ルールベースでも実現しやすい

#### Consequence
- time event の最小セットとして idlePrompt を持つ
- 複数段階の無言イベントは後から拡張してよい
- Preview / Test では疑似イベント発火で確認できるようにする

---

## Summary

VTuner の現在の設計判断は、  
「配信中は安定重視、前後は調律と改善重視」という軸でまとまっている。

この方針により、VTuner は
- 自由生成AI中心の不安定な配信補助ではなく、
- ユーザーが育てられる仲介キャラクター付き配信UI

として設計される。
