export declare const COMPILE_TARGET_KINDS: readonly ["formal_rules", "formal_definitions", "basic_settings_options", "reply_collections", "runtime_data"];
export type CompileTargetKind = (typeof COMPILE_TARGET_KINDS)[number];
export declare const COMPILE_RUN_STATUSES: readonly ["success", "failed"];
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
