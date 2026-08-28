import './style.css';
import { storage } from './db';
import { formatClock, isValidImport, recap, validatePromptInput } from './logic';
import { cachedUnlock, captureLicenseFromUrl, CHECKOUT_URL, saveLicense, verifyLicense } from './license';
import type { Prompt, Response as StudyResponse, SavedDeck, SessionRecord, Theme } from './types';

type Screen = 'setup' | 'session' | 'recap' | 'library' | 'about';

const SAMPLE = `What process do plants use to convert light into energy? :: Photosynthesis
What is the capital of Peru? :: Lima
What does HTTP stand for? :: Hypertext Transfer Protocol
Which organelle is called the powerhouse of the cell? :: Mitochondrion
What year did the Berlin Wall fall? :: 1989`;

const state = {
  screen: 'setup' as Screen,
  draft: localStorage.getItem('fss:draft') ?? '',
  duration: Number(localStorage.getItem('fss:duration') ?? 10),
  prompts: [] as Prompt[],
  current: 0,
  response: '',
  revealed: false,
  responses: [] as StudyResponse[],
  remaining: 0,
  endAt: 0,
  paused: false,
  startedAt: '',
  recap: null as SessionRecord | null,
  decks: [] as SavedDeck[],
  sessions: [] as SessionRecord[],
  unlocked: cachedUnlock(),
  licenseNotice: '',
  theme: (localStorage.getItem('fss:theme') as Theme | null) ?? 'system',
  online: navigator.onLine,
  updateReady: null as ServiceWorker | null,
  installPrompt: null as BeforeInstallPromptEvent | null,
  message: ''
};

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App mount not found');
const mount: HTMLDivElement = app;

let timer: number | undefined;
const ACTIVE_KEY = 'fss:active-session';

type ActiveSnapshot = Pick<typeof state, 'prompts' | 'current' | 'response' | 'revealed' | 'responses' | 'remaining' | 'endAt' | 'paused' | 'startedAt' | 'duration'>;

function persistActive(): void {
  if (!state.startedAt) { localStorage.removeItem(ACTIVE_KEY); return; }
  const snapshot: ActiveSnapshot = {
    prompts: state.prompts, current: state.current, response: state.response, revealed: state.revealed,
    responses: state.responses, remaining: state.remaining, endAt: state.endAt, paused: state.paused,
    startedAt: state.startedAt, duration: state.duration
  };
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(snapshot));
}

function restoreActive(): boolean {
  try {
    const snapshot = JSON.parse(localStorage.getItem(ACTIVE_KEY) ?? '') as ActiveSnapshot;
    if (!snapshot.startedAt || !Array.isArray(snapshot.prompts) || !snapshot.prompts.length || !Array.isArray(snapshot.responses)) return false;
    Object.assign(state, snapshot);
    state.remaining = snapshot.paused ? snapshot.remaining : Math.max(0, Math.ceil((snapshot.endAt - Date.now()) / 1000));
    state.screen = 'session';
    return true;
  } catch { return false; }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function icon(name: 'route' | 'moon' | 'sun' | 'system' | 'download' | 'lock' | 'check' | 'back'): string {
  const paths = {
    route: '<path d="M4 19c2-7 5-12 9-12s4 6 7 2"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="9" r="2"/>',
    moon: '<path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    back: '<path d="m15 18-6-6 6-6"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
}

function setTheme(theme: Theme): void {
  state.theme = theme;
  localStorage.setItem('fss:theme', theme);
  document.documentElement.dataset.theme = theme;
  const color = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', color || '#f4f0e6');
}

function shell(content: string): string {
  const status = !state.online
    ? '<div class="status-strip warning" role="status">Offline — your session and saved data still work.</div>'
    : state.message ? `<div class="status-strip" role="status">${escapeHtml(state.message)}</div>` : '';
  return `
    <header class="site-header">
      <a class="brand" href="#setup" data-nav="setup" aria-label="Focus Study Sprint, start">
        ${icon('route')}
        <h1>Focus Study Sprint</h1>
      </a>
      <nav aria-label="Primary">
        <button class="nav-link ${state.screen === 'setup' ? 'active' : ''}" data-nav="setup">Start</button>
        <button class="nav-link ${state.screen === 'library' ? 'active' : ''}" data-nav="library">Library</button>
        <button class="nav-link ${state.screen === 'about' ? 'active' : ''}" data-nav="about">About</button>
      </nav>
      <button class="icon-button theme-button" aria-label="Change color theme" title="Change color theme" data-theme-toggle>
        ${icon(state.theme === 'dark' ? 'moon' : state.theme === 'light' ? 'sun' : 'system')}
      </button>
    </header>
    ${status}
    <main id="main" tabindex="-1">${content}</main>
    <footer>
      <p>Private by design. No account, feed, streak, or behavioral analytics.</p>
      <div><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><span>Artwork made for this product with generative AI.</span></div>
    </footer>
    <div class="sr-only" aria-live="polite" id="live-region"></div>
    ${state.updateReady ? '<div class="update-toast" role="status"><span>A fresh map is ready.</span><button data-update>Update app</button></div>' : ''}
  `;
}

function setupView(): string {
  const validation = state.draft ? validatePromptInput(state.draft) : { prompts: [], message: '' };
  const count = validation.prompts.length;
  return shell(`
    <section class="hero" aria-labelledby="setup-title">
      <div class="hero-copy">
        <p class="eyebrow">A finite route for active recall</p>
        <h2 id="setup-title">Study what you brought.<br><em>Then be done.</em></h2>
        <p class="lede">Paste a small set of prompt-and-answer pairs. Move through one calm, timed session. Your work stays on this device.</p>
        <ul class="trust-list" aria-label="Product principles">
          <li>${icon('check')} No generated lessons</li>
          <li>${icon('check')} No streaks or scores</li>
          <li>${icon('check')} Works offline</li>
        </ul>
      </div>
      <picture class="hero-art">
        <source media="(max-width: 640px)" srcset="/assets/topographic-route-768.webp" type="image/webp" />
        <img src="/assets/topographic-route-1280.webp" width="1280" height="853" alt="A short orange route crossing layered paper contour lines toward a survey pin beside a blank study card." fetchpriority="high" decoding="async" />
      </picture>
    </section>
    <section class="chart" aria-labelledby="chart-title">
      <div class="section-heading">
        <div><p class="coordinate">ROUTE 01 · SET THE FIELD</p><h2 id="chart-title">Chart your prompts</h2></div>
        <button class="text-button" data-sample>Use an example</button>
      </div>
      <label for="prompt-input">One prompt and answer per line, separated by <strong>::</strong> or a tab</label>
      <textarea id="prompt-input" rows="9" aria-describedby="prompt-help prompt-error" placeholder="What is the capital of Peru? :: Lima">${escapeHtml(state.draft)}</textarea>
      <div class="field-meta"><span id="prompt-help">Use 5–30 pairs. Nothing is uploaded.</span><span class="count ${count > 30 ? 'danger-text' : ''}">${count} / 30 ready</span></div>
      <p class="form-error" id="prompt-error" aria-live="polite">${state.draft && validation.message ? escapeHtml(validation.message) : ''}</p>
      <fieldset class="duration-field">
        <legend>Choose the length of this route</legend>
        <div class="duration-options">
          ${[5, 10, 20].map((minutes) => `<label class="duration"><input type="radio" name="duration" value="${minutes}" ${state.duration === minutes ? 'checked' : ''}><span><strong>${minutes}</strong> min</span></label>`).join('')}
        </div>
      </fieldset>
      <button class="primary-action" data-start ${validation.message || count < 5 ? 'disabled' : ''}>Begin this sprint <span aria-hidden="true">→</span></button>
      <p class="keyboard-note">Keyboard ready: press Tab to move, then Enter to begin.</p>
    </section>
  `);
}

function sessionView(): string {
  const prompt = state.prompts[state.current];
  const percent = ((state.current + (state.revealed ? 0.6 : 0.15)) / state.prompts.length) * 100;
  return shell(`
    <section class="session-wrap" aria-labelledby="session-title">
      <div class="session-topline">
        <div><p class="coordinate">PROMPT ${state.current + 1} OF ${state.prompts.length}</p><h2 id="session-title" class="sr-only">Active recall session</h2></div>
        <div class="timer ${state.paused ? 'is-paused' : ''}" aria-label="${formatClock(state.remaining)} remaining"><span>${formatClock(state.remaining)}</span><button class="text-button" data-pause>${state.paused ? 'Resume' : 'Pause'}</button></div>
      </div>
      <div class="route-progress" role="progressbar" aria-label="Prompt progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(percent)}"><span class="progress-${Math.round(percent)}"></span></div>
      <article class="study-card ${state.revealed ? 'revealed' : ''}">
        <p class="card-label">Prompt</p>
        <p class="question">${escapeHtml(prompt.question)}</p>
        <label for="response-input">Your answer <span>(optional—thinking or speaking works too)</span></label>
        <textarea id="response-input" rows="4" ${state.revealed ? 'disabled' : ''}>${escapeHtml(state.response)}</textarea>
        ${state.revealed ? `
          <div class="answer" role="region" aria-label="Expected answer"><p class="card-label">Check against</p><p>${escapeHtml(prompt.answer)}</p></div>
          <fieldset class="rating"><legend>How did recall feel?</legend><div>
            <button class="secondary-action" data-rate="practice"><kbd>1</kbd> Keep practicing</button>
            <button class="primary-action" data-rate="recalled"><kbd>2</kbd> Recalled</button>
          </div></fieldset>
        ` : '<button class="primary-action reveal-action" data-reveal>Reveal answer <kbd>Enter</kbd></button>'}
      </article>
      <button class="end-link" data-end>End session and see recap</button>
    </section>
  `);
}

function recapView(): string {
  const session = state.recap;
  if (!session) return setupView();
  const summary = recap(session.responses);
  const practiceItems = session.responses.filter((item) => item.rating === 'practice');
  return shell(`
    <section class="recap-wrap" aria-labelledby="recap-title">
      <p class="coordinate">ROUTE COMPLETE · PRIVATE RECAP</p>
      <h2 id="recap-title">You reached a stopping point.</h2>
      <p class="lede">${session.endReason === 'time' ? 'Time ended the route.' : 'You checked every prompt.'} This is a record of today’s practice, not a grade.</p>
      <dl class="recap-stats">
        <div><dt>Checked</dt><dd>${summary.answered}</dd></div>
        <div><dt>Recalled</dt><dd>${summary.recalled}</dd></div>
        <div><dt>Keep practicing</dt><dd>${summary.practice}</dd></div>
      </dl>
      <div class="recap-actions"><button class="primary-action" data-nav="setup">Start another sprint</button><button class="secondary-action" data-export>Export my data ${icon('download')}</button></div>
      <section class="review-list" aria-labelledby="review-title">
        <h3 id="review-title">Marked for more practice</h3>
        ${practiceItems.length ? `<ol>${practiceItems.map((item) => `<li><strong>${escapeHtml(item.question)}</strong><span>${escapeHtml(item.expected)}</span></li>`).join('')}</ol>` : '<p class="empty-copy">You did not mark any checked prompts for more practice.</p>'}
      </section>
    </section>
  `);
}

function libraryView(): string {
  const recent = [...state.sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, state.unlocked ? 20 : 3);
  return shell(`
    <section class="library-wrap" aria-labelledby="library-title">
      <p class="coordinate">LOCAL FIELD NOTES</p><h2 id="library-title">Your library</h2>
      <p class="lede">Stored only in this browser. Export a backup whenever you like.</p>
      <div class="library-grid">
        <section aria-labelledby="decks-title">
          <div class="section-heading"><h3 id="decks-title">Reusable prompt sets</h3>${state.unlocked ? '<button class="text-button" data-save-draft>Save current draft</button>' : ''}</div>
          ${state.unlocked ? (state.decks.length ? `<ul class="deck-list">${state.decks.map((deck) => `<li><div><strong>${escapeHtml(deck.name)}</strong><span>${deck.prompts.length} prompts</span></div><div><button data-load-deck="${deck.id}">Use</button><button class="danger-button" data-delete-deck="${deck.id}" aria-label="Delete ${escapeHtml(deck.name)}">Delete</button></div></li>`).join('')}</ul>` : '<div class="empty-state"><span class="map-mark">×</span><h4>No saved sets yet</h4><p>Return to Start, paste a valid set, then save it here.</p></div>') : `
            <div class="unlock-panel"><span class="map-mark">◇</span><h3>Keep routes you want to revisit</h3><p>The $12 one-time Contour unlock adds reusable prompt sets and your full on-device session list. Starting sessions and exporting data stay free.</p><a class="primary-action" href="${CHECKOUT_URL}">Buy once for $12</a><button class="text-button" data-license-dialog>Have a license? Restore it</button><p class="merchant-note">Secure checkout by Sociobot / Dodo, merchant of record. No subscription.</p></div>
          `}
        </section>
        <section aria-labelledby="history-title">
          <div class="section-heading"><h3 id="history-title">Recent sessions</h3><span>${state.unlocked ? 'Latest 20' : 'Latest 3'}</span></div>
          ${recent.length ? `<ol class="history-list">${recent.map((session) => { const result = recap(session.responses); return `<li><time datetime="${session.startedAt}">${new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time><span>${result.answered} checked · ${result.practice} to revisit</span></li>`; }).join('')}</ol>` : '<div class="empty-state"><span class="map-mark">○</span><h4>No sessions recorded</h4><p>Your first private recap will appear here.</p></div>'}
          ${!state.unlocked && state.sessions.length > 3 ? '<p class="quiet-notice">Older sessions remain in your export and appear after unlocking.</p>' : ''}
        </section>
      </div>
      <section class="data-controls" aria-labelledby="data-title">
        <h3 id="data-title">Own your data</h3><p>Download or restore a JSON backup. Import replaces the data currently on this device.</p>
        <div><button class="secondary-action" data-export>Export JSON ${icon('download')}</button><label class="secondary-action file-action">Import JSON<input type="file" accept="application/json,.json" data-import></label><button class="danger-button" data-clear>Clear local data</button></div>
      </section>
      ${state.installPrompt ? '<button class="install-card" data-install><strong>Install for quicker offline access</strong><span>Add the app to this device. No account needed. →</span></button>' : ''}
      ${state.licenseNotice ? `<p class="quiet-notice">${escapeHtml(state.licenseNotice)} <a href="${CHECKOUT_URL}">Get a new license</a>.</p>` : ''}
      <dialog id="license-dialog" aria-labelledby="license-title"><form method="dialog"><button class="dialog-close" value="cancel" aria-label="Close">×</button><p class="coordinate">RESTORE PURCHASE</p><h3 id="license-title">Enter your license</h3><p>Paste the token from your purchase email. Verification never blocks free study.</p><label for="license-input">License token</label><input id="license-input" autocomplete="off"><p class="form-error" data-license-error aria-live="polite"></p><button class="primary-action" type="button" data-restore-license>Verify and restore</button></form></dialog>
    </section>
  `);
}

function aboutView(): string {
  return shell(`
    <section class="about-wrap" aria-labelledby="about-title">
      <p class="coordinate">WHY THIS MAP IS SMALL</p><h2 id="about-title">Practice without an attention tax.</h2>
      <p class="lede">Focus Study Sprint supports short active-recall practice. It does not generate teaching material, judge mastery, or try to make you return.</p>
      <div class="principles-grid"><article><span>01</span><h3>Bring your own material</h3><p>You decide what matters. The app only makes a quiet route through it.</p></article><article><span>02</span><h3>Finish on purpose</h3><p>A timer and finite prompt set give the session a real edge. Completion is the product.</p></article><article><span>03</span><h3>Keep it private</h3><p>Prompts, answers, ratings, and saved sets live in IndexedDB on this device.</p></article></div>
      <aside class="calm-note"><p>“A good study tool should be easy to leave.”</p><span>Product principle, not a learning claim</span></aside>
    </section>
  `);
}

function render(options: { focus?: string } = {}): void {
  window.clearInterval(timer);
  mount.innerHTML = state.screen === 'setup' ? setupView() : state.screen === 'session' ? sessionView() : state.screen === 'recap' ? recapView() : state.screen === 'library' ? libraryView() : aboutView();
  bindEvents();
  if (state.screen === 'session' && !state.paused) startTimer();
  const focusTarget = options.focus;
  if (focusTarget) requestAnimationFrame(() => document.querySelector<HTMLElement>(focusTarget)?.focus());
}

function navigate(screen: Screen): void {
  if (state.screen === 'session' && screen !== 'session' && state.responses.length + state.current > 0) {
    if (!window.confirm('End this session? Your checked prompts will be saved in a recap.')) return;
    finishSession('complete');
    return;
  }
  state.screen = screen;
  history.replaceState({}, '', `#${screen}`);
  render({ focus: '#main' });
}

function startSession(): void {
  const validation = validatePromptInput(state.draft);
  if (validation.message) { state.message = validation.message; render({ focus: '#prompt-input' }); return; }
  state.prompts = validation.prompts;
  state.current = 0;
  state.response = '';
  state.revealed = false;
  state.responses = [];
  state.remaining = state.duration * 60;
  state.endAt = Date.now() + state.remaining * 1000;
  state.startedAt = new Date().toISOString();
  state.paused = false;
  state.screen = 'session';
  state.message = '';
  persistActive();
  render({ focus: '#response-input' });
}

function startTimer(): void {
  timer = window.setInterval(() => {
    state.remaining = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
    const timerText = document.querySelector<HTMLElement>('.timer span');
    if (timerText) timerText.textContent = formatClock(state.remaining);
    if (state.remaining === 0) finishSession('time');
  }, 250);
}

function reveal(): void {
  state.response = document.querySelector<HTMLTextAreaElement>('#response-input')?.value ?? '';
  state.revealed = true;
  persistActive();
  render({ focus: '[data-rate="practice"]' });
  announce(`Expected answer: ${state.prompts[state.current].answer}`);
}

function rate(rating: 'practice' | 'recalled'): void {
  const prompt = state.prompts[state.current];
  state.responses.push({ promptId: prompt.id, question: prompt.question, expected: prompt.answer, response: state.response.trim(), rating });
  if (state.current === state.prompts.length - 1) { finishSession('complete'); return; }
  state.current += 1;
  state.response = '';
  state.revealed = false;
  persistActive();
  render({ focus: '#response-input' });
  announce(`Prompt ${state.current + 1} of ${state.prompts.length}`);
}

async function finishSession(reason: 'complete' | 'time'): Promise<void> {
  window.clearInterval(timer);
  if (!state.startedAt) { state.screen = 'setup'; render(); return; }
  const record: SessionRecord = {
    id: crypto.randomUUID(), startedAt: state.startedAt, endedAt: new Date().toISOString(), durationMinutes: state.duration,
    endReason: reason, responses: [...state.responses], promptCount: state.prompts.length
  };
  state.recap = record;
  state.sessions.push(record);
  state.screen = 'recap';
  state.startedAt = '';
  localStorage.removeItem(ACTIVE_KEY);
  try { await storage.putSession(record); } catch { state.message = 'The recap could not be saved. Export your data before leaving.'; }
  render({ focus: '#recap-title' });
}

function announce(message: string): void {
  const live = document.querySelector('#live-region');
  if (live) live.textContent = message;
}

async function exportData(): Promise<void> {
  try {
    const data = await storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focus-study-sprint-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    state.message = 'Your private backup was downloaded.';
    render();
  } catch { state.message = 'The backup could not be created. Try again before closing the app.'; render(); }
}

async function importData(file: File): Promise<void> {
  try {
    const parsed: unknown = JSON.parse(await file.text());
    if (!isValidImport(parsed)) throw new Error('wrong shape');
    if (!window.confirm(`Replace local data with ${parsed.sessions.length} sessions and ${parsed.decks.length} saved sets?`)) return;
    await storage.importAll(parsed);
    [state.sessions, state.decks] = await Promise.all([storage.getSessions(), storage.getDecks()]);
    state.message = 'Backup restored on this device.';
  } catch { state.message = 'That file is not a valid Focus Study Sprint backup. Choose an exported JSON file.'; }
  render();
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((element) => element.addEventListener('click', (event) => { event.preventDefault(); navigate(element.dataset.nav as Screen); }));
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const next: Theme = state.theme === 'system' ? 'light' : state.theme === 'light' ? 'dark' : 'system';
    setTheme(next); render(); announce(`Theme set to ${next}`);
  });
  const input = document.querySelector<HTMLTextAreaElement>('#prompt-input');
  input?.addEventListener('input', () => { state.draft = input.value; localStorage.setItem('fss:draft', state.draft); renderSetupFeedback(); });
  document.querySelector('[data-sample]')?.addEventListener('click', () => { state.draft = SAMPLE; localStorage.setItem('fss:draft', SAMPLE); render({ focus: '#prompt-input' }); });
  document.querySelectorAll<HTMLInputElement>('input[name="duration"]').forEach((radio) => radio.addEventListener('change', () => { state.duration = Number(radio.value); localStorage.setItem('fss:duration', radio.value); }));
  document.querySelector('[data-start]')?.addEventListener('click', startSession);
  document.querySelector('[data-reveal]')?.addEventListener('click', reveal);
  document.querySelector<HTMLTextAreaElement>('#response-input')?.addEventListener('input', (event) => { state.response = (event.target as HTMLTextAreaElement).value; persistActive(); });
  document.querySelectorAll<HTMLButtonElement>('[data-rate]').forEach((button) => button.addEventListener('click', () => rate(button.dataset.rate as 'practice' | 'recalled')));
  document.querySelector('[data-pause]')?.addEventListener('click', () => {
    if (state.paused) { state.endAt = Date.now() + state.remaining * 1000; state.paused = false; }
    else { state.remaining = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000)); state.paused = true; }
    persistActive();
    render({ focus: '[data-pause]' });
  });
  document.querySelector('[data-end]')?.addEventListener('click', () => { if (window.confirm('End this session and save the prompts you already checked?')) void finishSession('complete'); });
  document.querySelectorAll('[data-export]').forEach((button) => button.addEventListener('click', () => void exportData()));
  document.querySelector<HTMLInputElement>('[data-import]')?.addEventListener('change', (event) => { const file = (event.target as HTMLInputElement).files?.[0]; if (file) void importData(file); });
  document.querySelector('[data-clear]')?.addEventListener('click', async () => {
    if (!window.confirm('Clear every local session and saved prompt set from this device? Export first if you need a backup.')) return;
    await storage.clearAll(); state.sessions = []; state.decks = []; state.message = 'Local session and prompt-set data cleared.'; render();
  });
  document.querySelector('[data-save-draft]')?.addEventListener('click', async () => {
    const validation = validatePromptInput(state.draft);
    if (validation.message) { state.message = `Current draft was not saved: ${validation.message}`; render(); return; }
    const name = window.prompt('Name this prompt set:', `Route ${state.decks.length + 1}`)?.trim();
    if (!name) return;
    const deck: SavedDeck = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString(), prompts: validation.prompts };
    await storage.putDeck(deck); state.decks.push(deck); state.message = `Saved “${name}” on this device.`; render();
  });
  document.querySelectorAll<HTMLButtonElement>('[data-load-deck]').forEach((button) => button.addEventListener('click', () => {
    const deck = state.decks.find((item) => item.id === button.dataset.loadDeck); if (!deck) return;
    state.draft = deck.prompts.map((prompt) => `${prompt.question} :: ${prompt.answer}`).join('\n'); localStorage.setItem('fss:draft', state.draft); state.screen = 'setup'; render({ focus: '#prompt-input' });
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-delete-deck]').forEach((button) => button.addEventListener('click', async () => {
    const deck = state.decks.find((item) => item.id === button.dataset.deleteDeck); if (!deck || !window.confirm(`Delete the saved set “${deck.name}”?`)) return;
    await storage.deleteDeck(deck.id); state.decks = state.decks.filter((item) => item.id !== deck.id); render();
  }));
  document.querySelector('[data-license-dialog]')?.addEventListener('click', () => document.querySelector<HTMLDialogElement>('#license-dialog')?.showModal());
  document.querySelector('[data-restore-license]')?.addEventListener('click', async () => {
    const value = document.querySelector<HTMLInputElement>('#license-input')?.value.trim() ?? '';
    const error = document.querySelector<HTMLElement>('[data-license-error]');
    if (!value) { if (error) error.textContent = 'Paste the token from your purchase email.'; return; }
    saveLicense(value); const verdict = await verifyLicense(true);
    if (verdict?.valid) { state.unlocked = true; state.message = 'Contour features restored on this device.'; document.querySelector<HTMLDialogElement>('#license-dialog')?.close(); render(); }
    else if (error) error.textContent = navigator.onLine ? 'That license is not active for this product.' : 'You are offline. Connect once to verify this license.';
  });
  document.querySelector('[data-install]')?.addEventListener('click', async () => { await state.installPrompt?.prompt(); state.installPrompt = null; render(); });
  document.querySelector('[data-update]')?.addEventListener('click', () => state.updateReady?.postMessage({ type: 'SKIP_WAITING' }));
}

function renderSetupFeedback(): void {
  const validation = validatePromptInput(state.draft);
  const count = document.querySelector<HTMLElement>('.count');
  const error = document.querySelector<HTMLElement>('#prompt-error');
  const button = document.querySelector<HTMLButtonElement>('[data-start]');
  if (count) { count.textContent = `${validation.prompts.length} / 30 ready`; count.classList.toggle('danger-text', validation.prompts.length > 30); }
  if (error) error.textContent = validation.message;
  if (button) button.disabled = Boolean(validation.message);
}

document.addEventListener('keydown', (event) => {
  if (state.screen !== 'session' || state.paused || event.repeat) return;
  if (!state.revealed && event.key === 'Enter' && !(event.target instanceof HTMLTextAreaElement && event.shiftKey)) { event.preventDefault(); reveal(); }
  if (state.revealed && event.key === '1') { event.preventDefault(); rate('practice'); }
  if (state.revealed && event.key === '2') { event.preventDefault(); rate('recalled'); }
});

window.addEventListener('online', () => { state.online = true; state.message = 'Back online. Your local work never stopped.'; render(); });
window.addEventListener('offline', () => { state.online = false; render(); });
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); state.installPrompt = event as BeforeInstallPromptEvent; if (state.screen === 'library') render(); });

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.register('/sw.js');
  if (registration.waiting) { state.updateReady = registration.waiting; render(); }
  registration.addEventListener('updatefound', () => {
    const installing = registration.installing;
    installing?.addEventListener('statechange', () => {
      if (installing.state === 'installed' && navigator.serviceWorker.controller) { state.updateReady = installing; render(); }
    });
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
}

async function init(): Promise<void> {
  setTheme(state.theme);
  captureLicenseFromUrl();
  state.unlocked = cachedUnlock();
  try { [state.sessions, state.decks] = await Promise.all([storage.getSessions(), storage.getDecks()]); }
  catch { state.message = 'Private storage is unavailable in this browser. Sessions still work, but export before leaving.'; }
  const restored = restoreActive();
  if (!restored) {
    const hash = location.hash.slice(1) as Screen;
    if (['setup', 'library', 'about'].includes(hash)) state.screen = hash;
  }
  if (restored && state.remaining <= 0) await finishSession('time');
  else render();
  void registerServiceWorker();
  const verdict = await verifyLicense();
  if (verdict && verdict.valid !== state.unlocked) { state.unlocked = verdict.valid; if (!verdict.valid) state.licenseNotice = 'Your saved license is no longer active.'; render(); }
}

void init();
