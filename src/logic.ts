import type { AppExport, Prompt, Response } from './types';

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
  if (prompts.length > 30) return { prompts, message: 'Keep this route finite: use 30 pairs or fewer.' };
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

export function isValidImport(value: unknown): value is AppExport {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<AppExport>;
  return item.product === 'focus-study-sprint' && item.version === 1 &&
    Array.isArray(item.sessions) && Array.isArray(item.decks);
}
