import {
  REPLY_TEMPLATE_CATEGORIES,
  REPLY_TEMPLATE_LENGTHS,
  REPLY_TEMPLATE_MAX_ITEMS_PER_LENGTH,
  REPLY_TEMPLATE_MAX_TEXT_LENGTH,
  type ReplyTemplateCategory,
  type ReplyTemplateLength,
  type ReplyTemplateLengthMap,
  type ReplyTemplatesJson,
  type ReplyTemplatesMap,
} from "./replyTemplateTypes";

interface ValidateReplyTemplatesJsonResult {
  ok: boolean;
  errors: string[];
  parsed?: ReplyTemplatesJson;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateReplyTemplatesJson(
  input: unknown,
): ValidateReplyTemplatesJsonResult {
  const errors: string[] = [];

  if (!isRecord(input)) {
    return {
      ok: false,
      errors: ["root: object is required"],
    };
  }

  for (const key of Object.keys(input)) {
    if (key !== "reply_templates") {
      errors.push(`root: unexpected key "${key}"`);
    }
  }

  if (!("reply_templates" in input)) {
    errors.push("root.reply_templates: required");
  }

  const replyTemplatesRaw = input.reply_templates;
  if (!isRecord(replyTemplatesRaw)) {
    errors.push("root.reply_templates: object is required");
  }

  const parsedReplyTemplates: ReplyTemplatesMap = {};

  if (isRecord(replyTemplatesRaw)) {
    for (const key of Object.keys(replyTemplatesRaw)) {
      if (!REPLY_TEMPLATE_CATEGORIES.includes(key as ReplyTemplateCategory)) {
        errors.push(`root.reply_templates: unknown category "${key}"`);
      }
    }

    for (const category of REPLY_TEMPLATE_CATEGORIES) {
      if (!(category in replyTemplatesRaw)) {
        continue;
      }

      const categoryValue = replyTemplatesRaw[category];
      if (!isRecord(categoryValue)) {
        errors.push(`root.reply_templates.${category}: object is required`);
        continue;
      }

      for (const key of Object.keys(categoryValue)) {
        if (!REPLY_TEMPLATE_LENGTHS.includes(key as ReplyTemplateLength)) {
          errors.push(
            `root.reply_templates.${category}: unknown length "${key}"`,
          );
        }
      }

      const parsedLengthMap = {} as ReplyTemplateLengthMap;
      for (const length of REPLY_TEMPLATE_LENGTHS) {
        if (!(length in categoryValue)) {
          errors.push(`root.reply_templates.${category}.${length}: required`);
          continue;
        }

        const entries = categoryValue[length];
        if (!Array.isArray(entries)) {
          errors.push(
            `root.reply_templates.${category}.${length}: string array is required`,
          );
          continue;
        }

        if (entries.length === 0) {
          errors.push(
            `root.reply_templates.${category}.${length}: empty array is not allowed`,
          );
        }

        if (entries.length > REPLY_TEMPLATE_MAX_ITEMS_PER_LENGTH) {
          errors.push(
            `root.reply_templates.${category}.${length}: max ${REPLY_TEMPLATE_MAX_ITEMS_PER_LENGTH} items`,
          );
        }

        let hasInvalidItem = false;
        const normalizedEntries: string[] = [];
        for (let index = 0; index < entries.length; index += 1) {
          const item = entries[index];
          const path = `root.reply_templates.${category}.${length}[${index}]`;
          if (typeof item !== "string") {
            hasInvalidItem = true;
            errors.push(`${path}: string is required`);
            continue;
          }

          if (item.trim().length === 0) {
            hasInvalidItem = true;
            errors.push(`${path}: empty string is not allowed`);
            continue;
          }

          if (item.length > REPLY_TEMPLATE_MAX_TEXT_LENGTH) {
            hasInvalidItem = true;
            errors.push(
              `${path}: max ${REPLY_TEMPLATE_MAX_TEXT_LENGTH} characters`,
            );
            continue;
          }

          normalizedEntries.push(item);
        }

        if (!hasInvalidItem && entries.length > 0) {
          parsedLengthMap[length] = normalizedEntries;
        }
      }

      if (REPLY_TEMPLATE_LENGTHS.every((length) => length in parsedLengthMap)) {
        parsedReplyTemplates[category] = parsedLengthMap;
      }
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    errors: [],
    parsed: {
      reply_templates: parsedReplyTemplates,
    },
  };
}
