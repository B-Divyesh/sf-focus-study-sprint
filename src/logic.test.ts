import { describe, expect, it } from 'vitest';
import { formatClock, isValidImport, parsePrompts, recap, validatePromptInput } from './logic';

describe('prompt parsing', () => {
  it('parses supported separators and preserves answer text', () => {
    const prompts = parsePrompts('Capital of Peru :: Lima\n2 + 2\t4\nColor — burnt orange');
    expect(prompts).toHaveLength(3);
    expect(prompts[0]).toMatchObject({ question: 'Capital of Peru', answer: 'Lima' });
  });

  it('requires every line to be valid and limits the finite set', () => {
    expect(validatePromptInput('one :: 1\nbad line').message).toContain('Each non-empty');
    expect(validatePromptInput('a::1\nb::2\nc::3\nd::4').message).toContain('Add 1 more');
    const tooMany = Array.from({ length: 31 }, (_, i) => `q${i}::a${i}`).join('\n');
    expect(validatePromptInput(tooMany).message).toContain('30');
  });
});

it('formats the finite timer', () => {
  expect(formatClock(65.9)).toBe('01:05');
  expect(formatClock(-5)).toBe('00:00');
});

it('summarises self-ratings without making a learning claim', () => {
  expect(recap([
    { promptId: '1', question: 'q', expected: 'a', response: 'a', rating: 'recalled' },
    { promptId: '2', question: 'q', expected: 'a', response: '', rating: 'practice' }
  ])).toEqual({ recalled: 1, practice: 1, answered: 2 });
});

it('recognises only this product export shape', () => {
  expect(isValidImport({ product: 'focus-study-sprint', version: 1, sessions: [], decks: [], exportedAt: '' })).toBe(true);
  expect(isValidImport({ product: 'other', version: 1, sessions: [], decks: [] })).toBe(false);
});
