const DEMO_DATABASE = 'demo:focus-study-sprint';
const DEMO_KEY_PREFIX = 'demo:fss:';

function removeDemoKeys(): void {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(DEMO_KEY_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

function deleteDemoDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DEMO_DATABASE);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Demo storage could not be cleared.'));
    request.onblocked = () => reject(new Error('Demo storage is still open.'));
  });
}

/** Clears the isolated sample workspace without reading or changing real study data. */
export async function clearDemoWorkspace(): Promise<void> {
  removeDemoKeys();
  await deleteDemoDatabase();
}

/** Legal pages use this as a fallback for demo links opened outside the app shell. */
export async function clearDemoWorkspaceFromExitLink(): Promise<void> {
  if (new URLSearchParams(location.search).get('demo') !== 'exit') return;
  try {
    await clearDemoWorkspace();
  } finally {
    const url = new URL(location.href);
    url.searchParams.delete('demo');
    history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }
}
