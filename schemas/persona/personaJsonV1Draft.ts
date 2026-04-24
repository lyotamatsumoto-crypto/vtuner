export const PERSONA_JSON_V1_DRAFT = "persona_json_v1_draft";

export const PERSONA_CREATED_FROM_VALUES = [
  "new",
  "review_candidate",
  "existing_base",
  "history",
  "my_preset",
  "ideal_schema",
] as const;

export type PersonaCreatedFrom = (typeof PERSONA_CREATED_FROM_VALUES)[number];

export interface PersonaCore {
  archetype: string;
  summary: string;
  traits: string[];
  emotional_temperature: string;
  social_distance: string;
}

export interface AudienceMode {
  stance: string;
  tone: string;
  distance: string;
  behavior_notes: string[];
}

export interface SpeechStyle {
  tone_label: string;
  sentence_ending_style: string;
  favorite_phrases: string[];
  avoid_phrases: string[];
  speaking_rules: string[];
}

export interface SafetyRules {
  banned_expressions: string[];
  banned_attitudes: string[];
  notes: string[];
}

export interface PersonaMeta {
  created_from: PersonaCreatedFrom;
  reference_character_note?: string;
  author_note?: string;
}

export interface PersonaJsonV1Draft {
  schema_version: typeof PERSONA_JSON_V1_DRAFT;
  preset_name: string;
  persona_core: PersonaCore;
  audience_modes: {
    viewer: AudienceMode;
    streamer: AudienceMode;
  };
  speech_style: SpeechStyle;
  safety_rules: SafetyRules;
  meta: PersonaMeta;
}

export interface ValidationSuccess<T> {
  ok: true;
  value: T;
}

export interface ValidationFailure {
  ok: false;
  errors: string[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

const TOP_LEVEL_KEYS = [
  "schema_version",
  "preset_name",
  "persona_core",
  "audience_modes",
  "speech_style",
  "safety_rules",
  "meta",
] as const;

const PERSONA_CORE_KEYS = [
  "archetype",
  "summary",
  "traits",
  "emotional_temperature",
  "social_distance",
] as const;

const AUDIENCE_MODE_KEYS = [
  "stance",
  "tone",
  "distance",
  "behavior_notes",
] as const;

const SPEECH_STYLE_KEYS = [
  "tone_label",
  "sentence_ending_style",
  "favorite_phrases",
  "avoid_phrases",
  "speaking_rules",
] as const;

const SAFETY_RULE_KEYS = [
  "banned_expressions",
  "banned_attitudes",
  "notes",
] as const;

const META_ALLOWED_KEYS = [
  "created_from",
  "reference_character_note",
  "author_note",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(
  record: Record<string, unknown>,
  allowedKeys: readonly string[],
  path: string,
  errors: string[],
): void {
  for (const key of Object.keys(record)) {
    if (!allowedKeys.includes(key)) {
      errors.push(`${path}: unexpected key "${key}"`);
    }
  }
}

function requireString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
): void {
  if (typeof record[key] !== "string" || record[key].length === 0) {
    errors.push(`${path}.${key}: non-empty string is required`);
  }
}

function requireStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: string[],
  allowEmpty: boolean,
): void {
  const value = record[key];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    errors.push(`${path}.${key}: string array is required`);
    return;
  }

  if (!allowEmpty && value.length === 0) {
    errors.push(`${path}.${key}: empty array is not allowed`);
  }
}

export function validatePersonaJsonV1Draft(
  input: unknown,
): ValidationResult<PersonaJsonV1Draft> {
  const errors: string[] = [];

  if (!isRecord(input)) {
    return { ok: false, errors: ["root: object is required"] };
  }

  hasOnlyKeys(input, TOP_LEVEL_KEYS, "root", errors);

  for (const key of TOP_LEVEL_KEYS) {
    if (!(key in input)) {
      errors.push(`root.${key}: required`);
    }
  }

  if (input.schema_version !== PERSONA_JSON_V1_DRAFT) {
    errors.push(
      `root.schema_version: must be "${PERSONA_JSON_V1_DRAFT}"`,
    );
  }

  requireString(input, "preset_name", "root", errors);

  if (isRecord(input.persona_core)) {
    hasOnlyKeys(input.persona_core, PERSONA_CORE_KEYS, "root.persona_core", errors);
    for (const key of PERSONA_CORE_KEYS) {
      if (!(key in input.persona_core)) {
        errors.push(`root.persona_core.${key}: required`);
      }
    }
    requireString(input.persona_core, "archetype", "root.persona_core", errors);
    requireString(input.persona_core, "summary", "root.persona_core", errors);
    requireStringArray(input.persona_core, "traits", "root.persona_core", errors, false);
    requireString(
      input.persona_core,
      "emotional_temperature",
      "root.persona_core",
      errors,
    );
    requireString(input.persona_core, "social_distance", "root.persona_core", errors);
  } else {
    errors.push("root.persona_core: object is required");
  }

  if (isRecord(input.audience_modes)) {
    hasOnlyKeys(input.audience_modes, ["viewer", "streamer"], "root.audience_modes", errors);
    for (const key of ["viewer", "streamer"] as const) {
      if (!(key in input.audience_modes)) {
        errors.push(`root.audience_modes.${key}: required`);
        continue;
      }

      const mode = input.audience_modes[key];
      if (!isRecord(mode)) {
        errors.push(`root.audience_modes.${key}: object is required`);
        continue;
      }

      hasOnlyKeys(mode, AUDIENCE_MODE_KEYS, `root.audience_modes.${key}`, errors);
      for (const modeKey of AUDIENCE_MODE_KEYS) {
        if (!(modeKey in mode)) {
          errors.push(`root.audience_modes.${key}.${modeKey}: required`);
        }
      }
      requireString(mode, "stance", `root.audience_modes.${key}`, errors);
      requireString(mode, "tone", `root.audience_modes.${key}`, errors);
      requireString(mode, "distance", `root.audience_modes.${key}`, errors);
      requireStringArray(
        mode,
        "behavior_notes",
        `root.audience_modes.${key}`,
        errors,
        true,
      );
    }
  } else {
    errors.push("root.audience_modes: object is required");
  }

  if (isRecord(input.speech_style)) {
    hasOnlyKeys(input.speech_style, SPEECH_STYLE_KEYS, "root.speech_style", errors);
    for (const key of SPEECH_STYLE_KEYS) {
      if (!(key in input.speech_style)) {
        errors.push(`root.speech_style.${key}: required`);
      }
    }
    requireString(input.speech_style, "tone_label", "root.speech_style", errors);
    requireString(
      input.speech_style,
      "sentence_ending_style",
      "root.speech_style",
      errors,
    );
    requireStringArray(
      input.speech_style,
      "favorite_phrases",
      "root.speech_style",
      errors,
      false,
    );
    requireStringArray(
      input.speech_style,
      "avoid_phrases",
      "root.speech_style",
      errors,
      true,
    );
    requireStringArray(
      input.speech_style,
      "speaking_rules",
      "root.speech_style",
      errors,
      true,
    );
  } else {
    errors.push("root.speech_style: object is required");
  }

  if (isRecord(input.safety_rules)) {
    hasOnlyKeys(input.safety_rules, SAFETY_RULE_KEYS, "root.safety_rules", errors);
    for (const key of SAFETY_RULE_KEYS) {
      if (!(key in input.safety_rules)) {
        errors.push(`root.safety_rules.${key}: required`);
      }
    }
    requireStringArray(
      input.safety_rules,
      "banned_expressions",
      "root.safety_rules",
      errors,
      true,
    );
    requireStringArray(
      input.safety_rules,
      "banned_attitudes",
      "root.safety_rules",
      errors,
      true,
    );
    requireStringArray(input.safety_rules, "notes", "root.safety_rules", errors, true);
  } else {
    errors.push("root.safety_rules: object is required");
  }

  if (isRecord(input.meta)) {
    hasOnlyKeys(input.meta, META_ALLOWED_KEYS, "root.meta", errors);
    if (!("created_from" in input.meta)) {
      errors.push("root.meta.created_from: required");
    } else if (
      typeof input.meta.created_from !== "string" ||
      !PERSONA_CREATED_FROM_VALUES.includes(
        input.meta.created_from as PersonaCreatedFrom,
      )
    ) {
      errors.push("root.meta.created_from: invalid enum value");
    }

    for (const optionalKey of ["reference_character_note", "author_note"] as const) {
      if (
        optionalKey in input.meta &&
        typeof input.meta[optionalKey] !== "string"
      ) {
        errors.push(`root.meta.${optionalKey}: string is required when present`);
      }
    }
  } else {
    errors.push("root.meta: object is required");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: input as PersonaJsonV1Draft,
  };
}
