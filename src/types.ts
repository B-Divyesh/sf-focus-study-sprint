export type Prompt = { id: string; question: string; answer: string };
export type Rating = 'recalled' | 'practice';
export type Response = {
  promptId: string;
  question: string;
  expected: string;
  response: string;
  rating: Rating;
};
export type SessionRecord = {
  id: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  endReason: 'complete' | 'time';
  responses: Response[];
  promptCount: number;
};
export type SavedDeck = { id: string; name: string; createdAt: string; prompts: Prompt[] };
export type Theme = 'system' | 'light' | 'dark';
export type AppExport = {
  product: 'focus-study-sprint';
  version: 1;
  exportedAt: string;
  sessions: SessionRecord[];
  decks: SavedDeck[];
};
