type ExecutionKind = "runtime" | "read_aloud" | "blocked" | "ignored" | null;
type DefaultCharacterState = "normal" | "idle" | "reacting";
type SpeechTarget = "viewer" | "streamer";

interface ResolveCharacterStateLabelInput {
  executionKind: ExecutionKind;
  speechTarget: SpeechTarget;
  defaultCharacterState: DefaultCharacterState;
  isRuntimeReply: boolean;
}

interface CharacterStateResolution {
  stateLabel: string;
  reasonLabel: string;
}

export function resolveCharacterStateLabel({
  executionKind,
  speechTarget,
  defaultCharacterState,
  isRuntimeReply,
}: ResolveCharacterStateLabelInput): CharacterStateResolution {
  if (executionKind === "blocked") {
    return {
      stateLabel: "blocked",
      reasonLabel: "NG一致のため runtime 未実行",
    };
  }

  if (executionKind === "ignored") {
    return {
      stateLabel: "ignored",
      reasonLabel: "runtime ignore 結果",
    };
  }

  if (executionKind === "read_aloud") {
    return {
      stateLabel: "読み上げのみ",
      reasonLabel: "read_aloud 実行（viewer 扱い）",
    };
  }

  if (executionKind === "runtime" && isRuntimeReply) {
    if (speechTarget === "streamer") {
      return {
        stateLabel: "配信者に助け舟",
        reasonLabel: "runtime reply + speech_target=streamer",
      };
    }

    return {
      stateLabel: "反応中",
      reasonLabel: "runtime reply",
    };
  }

  if (defaultCharacterState === "idle") {
    return { stateLabel: "待機中", reasonLabel: "基本状態設定" };
  }

  if (defaultCharacterState === "reacting") {
    return { stateLabel: "反応中", reasonLabel: "基本状態設定" };
  }

  return { stateLabel: "通常", reasonLabel: "基本状態設定" };
}
