# REVIEW_FLOW.md

## Purpose

本書は、配信後レビューの流れ、コメント状態の整理、patch candidate 化、Detailed Rules と compile への接続を定義する文書である。

Review は正式編集画面ではなく、配信後整理と改善候補作成の場として扱う。

---

## Review Policy

- Review は仕分けと patch candidate 化の画面である
- Review で正式ルール編集をしない
- Review で compile を直接行わない
- Review 由来差分は Review Patch Queue に入れる
- 正式採用は Detailed Rules と compile 側で行う

---

## MVP Input Policy（貼り付け中心）

- Review の MVP 入力は「コメントテキストの貼り付け」を正とする
- URL 後追いでコメントを再取得する前提にはしない
- 貼り付けを読み込んだ結果として、Review は「配信単位（セッション）」を扱える（左サイドバー等で選択可能）
- 配信メタ情報（タイトル、日時、URL等）は必要に応じて保持できるが、貼り付けコメントが主導線である

---

## Pasted Text Parsing Policy

- 貼り付けテキストの形式は単一フォーマットに固定しない
  - 例: `ユーザー名: コメント本文` の1行形式だけでなく、複数行形式（投稿者名行 + コメント行 + 補助情報行 等）もありうる
- VTuner は貼り付けテキストを解析し、可能な範囲で次を抽出する
  - 投稿者名（または識別子）
  - コメント本文
  - 補助情報（例: メンバー種別、スタンプ情報、時刻らしき情報 等）
- パース不能な行や断片は `parse_error` として保持し、無言で破棄しない
- `parse_error` は Review 上で確認でき、必要なら補助情報として扱える（ただし Review を正式編集画面にしない）

---

## Comment States

少なくとも次の状態を扱う。

- unknown
- skipped
- displayed
- ignored

### unknown
分類不能または正式カテゴリ外として扱われたコメント。

### skipped
何らかの条件で採用されなかったコメント。

### displayed
実際に採用され、表示または発話に使われたコメント。

### ignored
意図的に無視されたコメント。

---

## Review Actions

選択中コメントに対して、少なくとも次の操作が必要である。

- ignore にする
- 既存カテゴリ候補にする
- 新カテゴリ候補として保留する

これらは直ちに正式ルールへ反映しない。

---

## Patch Candidate Types

### 1. ignore patch
特定のコメント傾向や条件を無視対象にする差分候補。

### 2. existing category patch
既存カテゴリへ寄せる差分候補。

### 3. new candidate patch
新カテゴリまたは新定義の候補として保留する差分候補。

---

## Review Patch Queue

Review から作られた差分候補は Review Patch Queue に入る。

Queue に必要な情報:
- 差分種別
- 元コメント
- 推論カテゴリ候補
- 選択操作
- 元データ参照（貼り付けテキスト由来であること）
- 抽出結果参照（投稿者名 / コメント本文 / 補助情報：可能な範囲で）
- `parse_error` の有無と内容参照
- 作成日時
- 状態

状態例:
- candidate
- pending
- adopted
- discarded
- compiled

---

## Relationship with Detailed Rules

Review 由来差分は Detailed Rules で採用または破棄する。

Detailed Rules 側で行うこと:
- 既存カテゴリへの統合
- 新カテゴリ定義の正式追加
- 新ルール追加
- 候補文編集
- patch の正式採用

---

## Relationship with AI / JSON Studio

Review は基本的に人間中心の整理画面である。  
AI / JSON Studio は、生成と JSON 検証のための画面であり、主導線を Review に持ち込まない。

ただし、Review で見つかった傾向をもとに、後から AI / JSON Studio で新カテゴリや返答集を作ることは可能とする。

---

## Patch to Compile Flow

1. Review でコメントを整理する
2. patch candidate を作る
3. Review Patch Queue に入る
4. Detailed Rules で採用または破棄する
5. 採用済み差分は Adopted Changes に入る
6. compile により正式データと runtime に反映される

---

## UI Expectations

Review 画面では、少なくとも次を追える必要がある。

- フィルタ
- コメント一覧
- 選択中コメント
- 推論カテゴリ候補
- review 操作
- patch candidate area

Patch Candidate Area では、少なくとも次が分かる必要がある。

- 差分種別
- 要約
- 何に対する変更か
- compile 前差分として保持されること

---

## Notes

- Review は正式編集の場ではない
- Review は JSON 生成の主画面ではない
- Review は patch candidate を作る場である
- compile は Review ではなく全体反映処理である
