# IMPLEMENTATION_GUIDE.md

## Purpose

本書は、VTuner をどの順で実装するか、各画面と各データ構造にどう着手するか、VS Code AI がどの順序で読み、どこから手を付けるべきかを定義する補助文書である。

`PHASES.md` が開発段階の中核文書であるのに対し、本書はより実装寄りの順序整理を担う。

運用再開・起動・復旧の手順は `docs/RUNBOOK.md` を正とする。

---

## Implementation Order Policy

* 画面を全部同時に作らない
* まず構造と契約を固める
* 次に UI 骨格を作る
* その後に runtime と queue をつなぐ
* compile は最後まで意味を崩さない
* AI / JSON Studio は generate, validate, correct, adopt の流れで作る
* Detailed Rules と AI / JSON Studio の境界を崩さない

### 追加方針（UI基準）

* UI実装は採用済み Mock UI と DESIGN_GUIDE.md / COMPONENT_SPEC.md を基準にする
* 左サイドバー型レイアウトを全画面共通の前提とする
* Mint Coral は正式Mock UIテーマとして扱い、別テーマを勝手に増やさない

---

## Common UI Implementation Baseline

以下は全画面共通の実装前提とする。

* 左サイドバー + メインコンテンツ構造を基本とする
* TopBar / Page Summary / Card / Button / Tabs / Badge / Input は共通部品として扱う
* CharacterDisplay / SpeechBubble / CharacterStage のような表示部品は共通化し、Preview / Test と Overlay 表示専用ルートで再利用する
* 配色と視覚ルールは `docs/DESIGN_GUIDE.md` に従う
* 共通部品の責務と使い分けは `docs/COMPONENT_SPEC.md` に従う
* 基準モックは `mockups/gemini_chatgpt/AI_JSON_Studio.html` とする
* 5画面のHTMLモックは `mockups/gemini_chatgpt/` 配下の採用版を参照する

---

## Recommended Build Order

### Step 1: Workspace and data baseline

先に整えるもの:

* ディレクトリ構成
* docs 配置
* config schema の枠
* queue 概念の枠
* compile 反映先の枠

---

### Step 2: Preview / Test skeleton

先に見える価値を作る:

* Main Preview
* VTuner 位置調整
* 吹き出し調整
* コメント入力
* 単発サンプル
* Bottom Test Area 骨格
* ただし Preview / Test 全体を OBS に出す前提にはせず、表示本体は Overlay 表示専用ルートでも再利用できる構造を保つ

---

### Step 3: Basic Settings skeleton

次に共通土台を作る:

* キャラ基本情報
* 人格層
* 口調層
* 見た目
* 音声
* カテゴリ ON / OFF

---

### Step 4: Review skeleton

運用改善の導線を作る:

* 状態フィルタ
* コメント一覧
* patch candidate area

---

### Step 5: Detailed Rules skeleton

正式編集の土台を作る:

* ルール一覧
* 手動編集
* 手動追加
* patch 採用枠

---

### Step 6: AI / JSON Studio skeleton

生成ワークフローを作る:

* 採用済み Mint Coral モックを基準画面として扱う
* 生成対象タブ
* 左右 2 カラム
* 入力
* プロンプト生成
* JSON 取込
* 検証
* 再修正
* 採用
* 履歴

---

### Step 7: Runtime wiring

* コメント入力を runtime へつなぐ
* 条件イベントをつなぐ
* 返答カテゴリと返答集をつなぐ
* 発話対象と表示向きを反映する

---

### Step 8: Queue and compile

* Review Patch Queue
* AI JSON Import Queue
* Adopted Changes
* compile 実行
* compile 後反映

実装現在地メモ（Phase 10-3 時点）:
* Review Patch Queue / Adopted Changes / compile history は、backend の最小 PUT API と storage helper により local JSON へ保存できる
* compile は frontend 確認版の最小導線であり、本体反映の高度化は未実装
* frontend 側の共有契約参照は `schemas/` 経由へ整理済み
* backend 側契約の真正な一本化（`schemas/` 単一ソース化）は Phase 10-3 時点では後続課題として残していた

実装現在地メモ（Completion Roadmap C1-3 時点）:
* Review / Compile 系 contract の正は `schemas/reviewCompile/*`
* `schemas` は独立 build unit として `schemas/dist` を生成する
* backend の `backend/src/contracts/*` は `schemas/dist/reviewCompile/*` を re-export する互換 façade
* backend build 前には `npm run build:schemas` が必要で、`npm run build:backend` はこれを含む
* backend build output は backend 本体中心で、`backend/dist/schemas` を生成しない
* Windows sandbox で `clean:backend` が `EPERM` になる場合は、dev server や出力ファイルを掴んでいるプロセスを止めて再実行する

実装現在地メモ（Completion Roadmap C2 close patch 時点）:
* 人格 JSON の validation 成功 / 失敗は AI / JSON Studio で明示表示できる
* AI JSON Import Queue は backend 永続化を含む最小 read/write 導線がある
* validated item を Adopted Changes へ採用できる最小導線がある
* validation_failed item は採用不可、adopted / discarded item は再操作不可の最小制御がある
* この段階は採用前段の接続までであり、compile 本処理整理は C3 で扱う

実装現在地メモ（Completion Roadmap C3-2 close patch 時点）:
* `compiledRuntimeEntries` は、最新 compile 実行の runtime config 相当データ（frontend 確認版）として扱う
* 各 runtime entry は `compile_record_id` を持ち、最新 compile history レコードと最小対応づけできる
* Detailed Rules / Preview で compile 後反映結果（source_lane / target_kind / target_name）を確認できる
* 過去履歴ごとの runtime entry 復元と正式 runtime config 永続保存は未対応
* backend compile API / backend compile 実行 / production compile engine 化は後続 Phase で扱う

実装現在地メモ（Completion Roadmap C4-1 close patch 時点）:
* queue / compile の local JSON 保存は、保存前の最小 validation を許容値チェック寄りに強化済み
* 壊れた JSON / 不正 shape は fail-close（validation error）で止め、状態不明のまま進めない
* missing file のみ空配列として扱う
* 自動修復・自動上書きは行わない
* backup / snapshot / retry / 競合制御 / 復旧手順の本格整備は C4 後続で扱う

実装現在地メモ（Completion Roadmap C4-2 close patch 時点）:
* local JSON の保存場所:
  * `data/queues/review-patch-queue.json`
  * `data/queues/adopted-changes.json`
  * `data/queues/ai-json-import-queue.json`
  * `data/compile/history.json`
* 読込方針:
  * 壊れた JSON / 不正 shape は fail-close（`StorageValidationError`）
  * missing file のみ空配列扱い
  * 自動修復・自動上書きは行わない
* 保存失敗時:
  * frontend 表示は維持し、backend 未反映メッセージで確認する
  * backend 応答と `data/` 配下ファイルを確認してから再操作する
* 手動 backup / snapshot（運用手順）:
  * 作業前に `data/` 全体を手動コピーする
  * 大きな変更前に `data/queues` と `data/compile` を別フォルダへコピーする
  * 復旧時は壊れたファイルを退避し、手動 backup から戻す
  * 復旧後は `npm run check` と画面再読込で確認する
* 未実装:
  * retry 自動再試行
  * lock file / 競合制御
  * 複数プロセス・複数ユーザー同時編集対応

実装現在地メモ（Completion Roadmap C5-1 close patch 時点）:
* Overlay は `/overlay/character` を表示専用ルートとして扱う
* Overlay は AppShell を通さず、背景透明 + キャラクター + 吹き出し中心の表示に限定する
* `show_stage_label=false` / `show_preview_overlay_label=false` を維持する
* compile 前は「反映待ち」表示、compile 後は `compiledRuntimeEntries` を参照した表示になる
* Preview / Test は確認 UI、Overlay は OBS 出力用ルートとして責務を分離する

実装現在地メモ（Extension Phase 12 local foundation 時点）:
* Character Profile 管理 UI は Basic Settings 上部に配置する
* local state で profile 保存 / 読み込み / 複製 / 未保存表示を扱う
* 保存対象はまず `BasicPreviewBridgeSettings` の共有設定に限定する
* Preview / Test 反映は既存 shared settings を継続利用する
* backend 永続保存 / JSON import-export / 完全 schema 化は後続 Phase で扱う

実装現在地メモ（Extension Phase 13 implementation patch 時点）:
* `bannedExpressions` は `BasicPreviewBridgeSettings` の shared settings として扱う
* Basic Settings の既存「禁止表現」入力を shared settings 更新に接続する（新規 UI は増やさない）
* Preview / Test のコメント実行順は次のとおり:
  * 入力
  * NG 判定
  * NG 一致なら `blocked`
  * NG 非一致かつ読み上げのみ ON なら runtime を通さず表示（`read_aloud`）
  * NG 非一致かつ通常モードなら runtime decide
  * runtime decide の `ignore` は `ignored`
* `blocked` は runtime 未実行
* `read_aloud` は runtime 未実行
* `ignored` は runtime decide の結果
* 音声合成本実装は未対応（表示確認のみ）

build 確認:
* `npm run build:schemas`
* `npm run build:backend`
* `npm run check`

---

### Step 9: Final consistency

* 用語統一
* 5 画面責務チェック
* docs と実装の整合
* 非プログラマ導線の再確認

---

## Extension Handoff Policy（Phase 12+）

* 条件付きMVP完了後の拡張順は `ROADMAP_TO_EXTENSION.md` を正とする
* 直近優先は Character Profile 保存、未保存状態表示、読み上げのみモード、共通NG処理、発言対象関連
* 拡張実装でも 5 画面責務分離を維持し、Detailed Rules と AI / JSON Studio の境界を崩さない
* compile は確認版最小導線と本処理高度化を区別して段階導入する
* Overlay は Preview / Test から分離した表示専用ルートで扱い、確認UIを混ぜない

---

## First Implementation Targets

初回実装で優先度が高いものは次のとおり。

1. Preview / Test 骨格
2. Basic Settings 骨格
3. Review 骨格
4. Detailed Rules 骨格
5. AI / JSON Studio 骨格
6. queue データ構造
7. compile の最小流れ

---

## Recommended Unit of Work

一度に触る範囲は小さく保つ。
おすすめ単位は次のようなもの。

* Preview の見た目調整だけ
* Basic Settings の人格層 UI だけ
* Review の状態フィルタだけ
* Detailed Rules のルール一覧だけ
* AI / JSON Studio の人格タブだけ
* JSON 検証結果表示だけ
* compile の Adopted Changes 反映だけ

---

## AI / JSON Studio Specific Guidance

AI / JSON Studio の実装では、次を守る。

* 最初から全タブを完成させようとしない
* まず人格タブで流れを作る
* 次に返答カテゴリまたは返答集へ広げる
* 検証と再修正導線を後回しにしない
* 差分要約は早い段階で入れる
* 履歴は簡易版から入れてよい
* マイプリセット化は採用済み条件と名前付け導線から始める

---

## Detailed Rules Specific Guidance

Detailed Rules の実装では、次を守る。

* 既存ルール一覧と編集を先に作る
* 手動追加を次に作る
* patch 採用導線をその後に入れる
* AI / JSON Studio の生成フローをここへ混ぜない
* 正式編集室としての一貫性を保つ

---

## Review Specific Guidance

Review の実装では、次を守る。

* 状態整理を主役にする
* 仕分けを主役にする
* patch candidate area を入れる
* 正式編集導線を入れすぎない
* compile を直接置かない

---

## Compile Specific Guidance

compile は、採用済み差分を正式データと runtime に反映する正式処理である。
次を意識して実装する。

* 入力は Review Patch Queue と AI JSON Import Queue の採用済み項目
* 出力は正式ルール、正式定義、Basic Settings 選択肢、返答集、runtime 用データ
* compile 履歴を残す
* compile ボタン名は UI 上では分かりやすくする

UI 推奨ラベル:

* 本体に反映
* 変更を確定して反映

---

## Overlay / OBS Guidance（C5-1）

* OBS Browser Source には Preview / Test 画面全体ではなく `/overlay/character` を指定する
* URL 例: `http://localhost:5173/overlay/character`
* frontend dev server 起動中に OBS から読み込む
* 背景は透明を想定し、OBS 側で幅・高さを配信レイアウトに合わせて調整する
* Overlay はキャラクターと吹き出しのみを中心に表示する（操作 UI は表示しない）
* compile 前は Overlay に反映待ち文言が表示される
* compile 後は `compiledRuntimeEntries` を参照した表示に切り替わる
* 既知制限:
  * YouTube Live Chat 本接続は未対応
  * 音声合成は未対応
  * 複数キャラ同時表示は未対応

---

## Final Reminder

本プロジェクトでは、

* internal AI を入れない
* コメント反応を主軸にする
* 5 画面責務を守る
* 生成と正式編集を分離する
* compile の意味を崩さない

この 5 点を最後まで守ること。
