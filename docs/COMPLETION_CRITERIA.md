# COMPLETION_CRITERIA.md

## Purpose

本書は、このプロジェクトにおける「完成」の定義を明確にするための文書である。  
ここでいう完成とは、単に技術的に一度動くことではなく、ユーザーが再実行、再開、最低限の運用を行える状態まで含む。

---

## Completion Policy

- 一時的に動作しただけでは完成とみなさない
- ユーザーが後から再実行できることを重視する
- ユーザーが次に何をすればよいか分かる状態を重視する
- 必要な手順が文書化されていることを重視する
- AI 側の実装完了と、人間側の使える完成を区別する
- 完成判定には技術面、文書面、運用面、ユーザー理解面を含める

---

## Definition of Completion

このプロジェクトが完成と言えるのは、少なくとも以下を満たす場合に限る。

1. 主要目的に対して十分な成果がある
2. 5 画面構成が成立している
3. VTuner runtime がルールベースで成立している
4. 外部 AI 用 JSON ワークフローが成立している
5. compile が成立している
6. 実装と主要文書が大きく矛盾していない
7. ユーザーが最低限の実行、再開、確認を行える

---

## What Does NOT Count as Completion

以下は、単独では完成とみなさない。

- 一度だけコメントに反応した
- JSON を一度読み込めた
- エラー修正プロンプトがなく、失敗時に詰まる
- 5 画面のどれかが責務不明のままである
- compile ボタンがあるだけで意味が曖昧である
- ユーザーが翌日見返しても何から再開するか分からない

---

## Technical Completion Criteria

- 5 画面が役割分離されている
- 主にリスナーコメントへ反応する runtime が成立している
- 条件イベントが最低限成立している
- Review Patch Queue と AI JSON Import Queue が separate に存在する
- JSON 検証成功時に基本本採用される
- JSON エラー時に再修正プロンプト生成ができる
- compile により正式データと runtime へ反映できる

---

## User-facing Completion Criteria

- README を見ればプロジェクトの目的が分かる
- どの画面が何をするか分かる
- Basic Settings で共通土台を作れる
- Preview / Test で見た目と挙動を確認できる
- Review で配信後整理ができる
- Detailed Rules で正式編集できる
- AI / JSON Studio で非プログラマでも JSON 生成運用ができる

---

## Beginner-friendly Completion Criteria

- JSON を手修正しなくても運用しやすい
- 生成対象タブが分かりやすい
- 差分要約が読める
- エラー時に何をすればよいか分かる
- compile の意味が分かる
- 後日見返しても再開しやすい

---

## Documentation Completion Criteria

- `README.md` が入口として機能している
- `AGENTS.md` が制約を定義している
- `PROJECT_OVERVIEW.md` が目的、MVP、非目標を定義している
- `PHASES.md` が順序と現在地を定義している
- `CHECKPOINTS.md` が完了条件を定義している
- `UI_SPEC.md` が 5 画面責務を定義している
- `CONFIG_SCHEMA.md` がデータ構造を定義している
- `EVENT_PROTOCOL.md` がイベントの考え方を定義している
- `REVIEW_FLOW.md` が review から compile の流れを定義している
- `AI_JSON_STUDIO_SPEC.md` が外部 AI ワークフローを定義している

---

## Operational Completion Criteria

- 5 画面の役割が崩れていない
- Review と compile の関係が説明できる
- AI / JSON Studio の検証失敗時も再開できる
- マイプリセット化が追える
- 採用履歴が追える

---

## Re-run and Resume Criteria

- ユーザーが後日見返して何から始めるか分かる
- 最初に読むべき文書が分かる
- 現在の Phase が分かる
- 採用済み差分と未反映差分の区別が分かる
- compile 実行の意味が分かる

---

## Completion Review Questions

- VTuner は主にコメントへ反応するアプリとして成立しているか
- 5 画面の責務は明確か
- 外部 AI 用ワークフローは非プログラマ向けに成立しているか
- JSON エラー修正導線はあるか
- compile の意味は UI と文書で一致しているか
- 後日見返して再開できるか

---

## Stop Conditions for Completion Claims

以下の場合、完成と言ってはならない。

- 5 画面のどれかが責務不明
- JSON は読めるがエラー修正導線がない
- compile の意味が不明
- Review patch と AI JSON 差分が混線している
- アプリ内部に AI を前提とした実装になっている
- docs と実装が大きく乖離している