import { describe, expect, it } from 'vitest';
import { formatClock, isValidActiveSnapshot, isValidImport, parsePrompts, recap, validatePromptInput } from './logic';

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
    expect(validatePromptInput(tooMany).message).toBe('Use 30 pairs or fewer.');
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

describe('backup schema validation', () => {
  const validExport = {
    product: 'focus-study-sprint',
    version: 1,
    exportedAt: '2026-08-30T00:00:00.000Z',
    sessions: [{
      id: 'session-1',
      startedAt: '2026-08-30T00:00:00.000Z',
      endedAt: '2026-08-30T00:05:00.000Z',
      durationMinutes: 5,
      endReason: 'complete',
      promptCount: 5,
      responses: [{
        promptId: 'prompt-1',
        question: 'Capital of Peru?',
        expected: 'Lima',
        response: '',
        rating: 'recalled'
      }]
    }],
    decks: [{
      id: 'deck-1',
      name: 'Geography',
      createdAt: '2026-08-30T00:00:00.000Z',
      prompts: [{ id: 'prompt-1', question: 'Capital of Peru?', answer: 'Lima' }]
    }]
  } as const;

  it('accepts a complete backup', () => {
    expect(isValidImport(validExport)).toBe(true);
  });

  it('rejects the verifier malformed nested session', () => {
    expect(isValidImport({
      product: 'focus-study-sprint', version: 1, exportedAt: 'now', sessions: [{ id: 'bad' }], decks: []
    })).toBe(false);
  });

  it.each([
    ['session response', { ...validExport, sessions: [{ ...validExport.sessions[0], responses: [{ promptId: 'prompt-1' }] }] }],
    ['session field type', { ...validExport, sessions: [{ ...validExport.sessions[0], promptCount: '5' }] }],
    ['saved deck', { ...validExport, decks: [{ id: 'deck-1', name: 'Geography', prompts: [] }] }],
    ['saved prompt', { ...validExport, decks: [{ ...validExport.decks[0], prompts: [{ id: 'prompt-1', question: 'Capital?' }] }] }]
  ])('rejects an invalid %s record', (_name, candidate) => {
    expect(isValidImport(candidate)).toBe(false);
  });
});

describe('active-session snapshot validation', () => {
  const prompts = Array.from({ length: 5 }, (_, index) => ({ id: `prompt-${index}`, question: `Question ${index}`, answer: `Answer ${index}` }));
  const snapshot = {
    prompts,
    current: 1,
    response: '',
    revealed: false,
    responses: [{ promptId: 'prompt-0', question: 'Question 0', expected: 'Answer 0', response: 'My answer', rating: 'recalled' }],
    remaining: 294,
    endAt: Date.now() + 294_000,
    paused: false,
    startedAt: '2026-09-02T10:00:00.000Z',
    duration: 5
  };

  it('accepts a complete active session snapshot', () => {
    expect(isValidActiveSnapshot(snapshot)).toBe(true);
  });

  it.each([
    ['out-of-range prompt index', { ...snapshot, current: 5 }],
    ['malformed prompt', { ...snapshot, prompts: [{ id: 'only-id' }] }],
    ['malformed response', { ...snapshot, responses: [{ promptId: 'prompt-0' }] }],
    ['unsupported duration', { ...snapshot, duration: 7 }],
    ['negative remaining time', { ...snapshot, remaining: -1 }],
    ['invalid flags', { ...snapshot, revealed: 'yes' }]
  ])('rejects a snapshot with %s', (_name, candidate) => {
    expect(isValidActiveSnapshot(candidate)).toBe(false);
  });
});
