import type { AppExport, Prompt, Response, SavedDeck, SessionRecord } from './types';

const separators = ['::', '\t', ' — ', ' - '];

export function parsePrompts(input: string): Prompt[] {
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.flatMap((line, index) => {
    const separator = separators.find((candidate) => line.includes(candidate));
    if (!separator) return [];
    const splitAt = line.indexOf(separator);
    const question = line.slice(0, splitAt).trim();
    const answer = line.slice(splitAt + separator.length).trim();
    return question && answer
      ? [{ id: `p-${Date.now()}-${index}`, question, answer }]
      : [];
  });
}

export function validatePromptInput(input: string): { prompts: Prompt[]; message: string } {
  const nonEmptyLines = input.split(/\r?\n/).filter((line) => line.trim()).length;
  const prompts = parsePrompts(input);
  if (!input.trim()) return { prompts, message: 'Paste at least 5 prompt and answer pairs.' };
  if (prompts.length !== nonEmptyLines) {
    return { prompts, message: 'Each non-empty line needs a prompt and answer separated by :: or a tab.' };
  }
  if (prompts.length < 5) return { prompts, message: `Add ${5 - prompts.length} more pair${prompts.length === 4 ? '' : 's'} to begin.` };
  if (prompts.length > 30) return { prompts, message: 'Use 30 pairs or fewer.' };
  return { prompts, message: '' };
}

export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60).toString().padStart(2, '0')}:${(safe % 60).toString().padStart(2, '0')}`;
}

export function recap(responses: Response[]) {
  const recalled = responses.filter((item) => item.rating === 'recalled').length;
  return { recalled, practice: responses.length - recalled, answered: responses.length };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

export function isValidPrompt(value: unknown): value is Prompt {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.id) && isNonEmptyString(value.question) && isNonEmptyString(value.answer);
}

export function isValidResponse(value: unknown): value is Response {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.promptId) && isNonEmptyString(value.question) &&
    isNonEmptyString(value.expected) && isString(value.response) &&
    (value.rating === 'recalled' || value.rating === 'practice');
}

export function isValidSessionRecord(value: unknown): value is SessionRecord {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.id) && isNonEmptyString(value.startedAt) &&
    isNonEmptyString(value.endedAt) && typeof value.durationMinutes === 'number' &&
    Number.isFinite(value.durationMinutes) && value.durationMinutes > 0 &&
    (value.endReason === 'complete' || value.endReason === 'time') &&
    Array.isArray(value.responses) && value.responses.every(isValidResponse) &&
    typeof value.promptCount === 'number' && Number.isInteger(value.promptCount) &&
    value.promptCount >= 0 && value.responses.length <= value.promptCount;
}

export function isValidSavedDeck(value: unknown): value is SavedDeck {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.id) && isNonEmptyString(value.name) &&
    isNonEmptyString(value.createdAt) && Array.isArray(value.prompts) &&
    value.prompts.every(isValidPrompt);
}

export function isValidImport(value: unknown): value is AppExport {
  if (!isRecord(value)) return false;
  return value.product === 'focus-study-sprint' && value.version === 1 &&
    isString(value.exportedAt) && Array.isArray(value.sessions) &&
    value.sessions.every(isValidSessionRecord) && Array.isArray(value.decks) &&
    value.decks.every(isValidSavedDeck);
}
