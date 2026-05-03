export const COMPILE_TARGET_KINDS = [
  "formal_rules",
  "formal_definitions",
  "basic_settings_options",
  "reply_collections",
  "runtime_data",
] as const;

export type CompileTargetKind = (typeof COMPILE_TARGET_KINDS)[number];

export const COMPILE_RUN_STATUSES = [
  "success",
  "failed",
] as const;

export type CompileRunStatus = (typeof COMPILE_RUN_STATUSES)[number];

export interface CompilePlanItem {
  adopted_change_id: string;
  target_kind: CompileTargetKind;
  target_name: string;
}

export interface CompileRecord {
  id: string;
  executed_at: string;
  target_count: number;
  target_kinds: CompileTargetKind[];
  status: CompileRunStatus;
  reflected_to: CompileTargetKind[];
}
