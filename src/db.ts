import type { AppExport, SavedDeck, SessionRecord } from './types';

const DB_NAME = 'focus-study-sprint';
const DB_VERSION = 1;
const SESSIONS = 'sessions';
const DECKS = 'decks';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SESSIONS)) db.createObjectStore(SESSIONS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(DECKS)) db.createObjectStore(DECKS, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open private storage.'));
  });
}

async function request<T>(storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const result = operation(transaction.objectStore(storeName));
    result.onsuccess = () => resolve(result.result);
    result.onerror = () => reject(result.error ?? new Error('Private storage operation failed.'));
    transaction.oncomplete = () => db.close();
  });
}

export const storage = {
  putSession: (session: SessionRecord) => request(SESSIONS, 'readwrite', (store) => store.put(session)),
  putDeck: (deck: SavedDeck) => request(DECKS, 'readwrite', (store) => store.put(deck)),
  deleteDeck: (id: string) => request(DECKS, 'readwrite', (store) => store.delete(id)),
  getSessions: () => request<SessionRecord[]>(SESSIONS, 'readonly', (store) => store.getAll()),
  getDecks: () => request<SavedDeck[]>(DECKS, 'readonly', (store) => store.getAll()),
  async exportAll(): Promise<AppExport> {
    const [sessions, decks] = await Promise.all([this.getSessions(), this.getDecks()]);
    return { product: 'focus-study-sprint', version: 1, exportedAt: new Date().toISOString(), sessions, decks };
  },
  async importAll(data: AppExport): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSIONS, DECKS], 'readwrite');
      const sessionStore = transaction.objectStore(SESSIONS);
      const deckStore = transaction.objectStore(DECKS);
      sessionStore.clear();
      deckStore.clear();
      data.sessions.forEach((session) => sessionStore.put(session));
      data.decks.forEach((deck) => deckStore.put(deck));
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Import failed.')); };
    });
  },
  async clearAll(): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSIONS, DECKS], 'readwrite');
      transaction.objectStore(SESSIONS).clear();
      transaction.objectStore(DECKS).clear();
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Could not clear data.')); };
    });
  }
};
