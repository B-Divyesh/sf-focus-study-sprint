import './style.css';
import { createStorage } from './db';
import { clearDemoWorkspace } from './demo';
import { formatClock, isValidActiveSnapshot, isValidImport, recap, validatePromptInput } from './logic';
import { cachedUnlock, captureLicenseFromUrl, CHECKOUT_URL, saveLicense, verifyLicense } from './license';
import type { Prompt, Response as StudyResponse, SavedDeck, SessionRecord, Theme } from './types';

type Screen = 'setup' | 'session' | 'recap' | 'library' | 'about';

const DEMO_MODE = location.pathname === '/demo' || location.pathname.startsWith('/demo/') || new URLSearchParams(location.search).get('demo') === '1';
const storage = createStorage(DEMO_MODE ? 'demo:focus-study-sprint' : 'focus-study-sprint');
const localKey = (key: string): string => DEMO_MODE ? `demo:${key}` : key;

const SAMPLE = `What process do plants use to convert light into energy? :: Photosynthesis
What is the capital of Peru? :: Lima
What does HTTP stand for? :: Hypertext Transfer Protocol
Which organelle is called the powerhouse of the cell? :: Mitochondrion
What year did the Berlin Wall fall? :: 1989`;

const state = {
  screen: 'setup' as Screen,
  draft: localStorage.getItem(localKey('fss:draft')) ?? (DEMO_MODE ? SAMPLE : ''),
  duration: Number(localStorage.getItem(localKey('fss:duration')) ?? (DEMO_MODE ? 5 : 10)),
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
  unlocked: DEMO_MODE || cachedUnlock(),
  licenseNotice: '',
  theme: (localStorage.getItem(localKey('fss:theme')) as Theme | null) ?? 'system',
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

document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  const main = document.querySelector<HTMLElement>('#main');
  main?.focus();
  main?.scrollIntoView();
});

let timer: number | undefined;
const ACTIVE_KEY = localKey('fss:active-session');
let reloadForUpdate = false;

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
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return false;
    const snapshot: unknown = JSON.parse(raw);
    if (!isValidActiveSnapshot(snapshot)) {
      localStorage.removeItem(ACTIVE_KEY);
      state.message = 'An unfinished session could not be restored. Start a new study session when ready.';
      return false;
    }
    Object.assign(state, snapshot);
    state.remaining = snapshot.paused ? snapshot.remaining : Math.max(0, Math.ceil((snapshot.endAt - Date.now()) / 1000));
    state.screen = 'session';
    return true;
  } catch {
    localStorage.removeItem(ACTIVE_KEY);
    state.message = 'An unfinished session could not be restored. Start a new study session when ready.';
    return false;
  }
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
  localStorage.setItem(localKey('fss:theme'), theme);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : '';
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const color = theme === 'dark' || (theme === 'system' && systemDark) ? '#17201d' : '#f4f0e6';
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', color);
}

const SCREEN_TITLES: Record<Screen, string> = {
  setup: 'Focus Study Sprint — practice answers in short sessions',
  session: 'Study session — Focus Study Sprint',
  recap: 'Session recap — Focus Study Sprint',
  library: 'Library — Focus Study Sprint',
  about: 'About — Focus Study Sprint'
};

function routeFor(screen: Screen): string {
  if (DEMO_MODE) return screen === 'session' ? '/demo' : `/demo?screen=${screen}`;
  return screen === 'setup' ? '/' : `/${screen}`;
}

function demoExitHref(path: string): string {
  if (!DEMO_MODE) return path;
  const url = new URL(path, location.origin);
  url.searchParams.set('demo', 'exit');
  return `${url.pathname}${url.search}${url.hash}`;
}

function screenFromLocation(): Screen {
  if (DEMO_MODE) {
    const requested = new URLSearchParams(location.search).get('screen') as Screen | null;
    return requested && ['setup', 'session', 'recap', 'library', 'about'].includes(requested) ? requested : 'session';
  }
  const requested = location.pathname.replace(/^\/+|\/+$/g, '') as Screen;
  return ['session', 'recap', 'library', 'about'].includes(requested) ? requested : 'setup';
}

function setRoute(screen: Screen, replace = false): void {
  const method = replace ? 'replaceState' : 'pushState';
  history[method]({ screen }, '', routeFor(screen));
}

function shell(content: string): string {
  const status = !state.online
    ? '<div class="status-strip warning" role="status">Offline — your session and saved data still work.</div>'
    : state.message ? `<div class="status-strip" role="status">${escapeHtml(state.message)}</div>` : '';
  return `
    <header class="site-header">
      <a class="brand" href="${DEMO_MODE ? '/demo?screen=setup' : '/'}" data-nav="setup" aria-label="Focus Study Sprint, start">
        ${icon('route')}
        <span>Focus Study Sprint</span>
      </a>
      <nav aria-label="Primary">
        <a href="${routeFor('setup')}" class="nav-link ${state.screen === 'setup' ? 'active' : ''}" data-nav="setup">Start</a>
        <a href="${routeFor('library')}" class="nav-link ${state.screen === 'library' ? 'active' : ''}" data-nav="library">Library</a>
        <a href="/demo" class="nav-link ${DEMO_MODE ? 'active' : ''}">Demo</a>
        <a href="${demoExitHref('/privacy/')}" class="nav-link" ${DEMO_MODE ? 'data-demo-exit' : ''}>Privacy</a>
      </nav>
      <button class="icon-button theme-button" aria-label="Change color theme" title="Change color theme" data-theme-toggle>
        ${icon(state.theme === 'dark' ? 'moon' : state.theme === 'light' ? 'sun' : 'system')}
      </button>
    </header>
    ${DEMO_MODE ? '<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><div><button data-reset-demo>Reset demo</button><button data-start-real>Start for real</button></div></aside>' : ''}
    ${status}
    <main id="main" tabindex="-1">${content}</main>
    <footer>
      <p>Short answer-practice sessions for students and self-learners.</p>
      <div><a href="${routeFor('about')}" data-nav="about">About</a><a href="${demoExitHref('/privacy/')}" ${DEMO_MODE ? 'data-demo-exit' : ''}>Privacy</a><a href="${demoExitHref('/terms/')}" ${DEMO_MODE ? 'data-demo-exit' : ''}>Terms</a><span>Built by Param Factory</span><span>v1.1.5 · polish-5</span></div>
    </footer>
    <div class="sr-only" aria-live="polite" id="live-region"></div>
    ${state.updateReady ? '<div class="update-toast" role="status"><span>An app update is ready.</span><button data-update>Update app</button></div>' : ''}
  `;
}

function setupView(): string {
  const validation = state.draft ? validatePromptInput(state.draft) : { prompts: [], message: '' };
  const count = validation.prompts.length;
  return shell(`
    <section class="hero" aria-labelledby="setup-title">
      <div class="hero-copy">
        <p class="eyebrow">Focus Study Sprint</p>
        <h1 id="setup-title" tabindex="-1">Practice recalling answers in a short session.</h1>
        <p class="lede">For students and self-learners who want focused practice without streaks, feeds, or generated lessons.</p>
        <div class="hero-actions"><a class="primary-action" href="/demo">Try it with sample data</a><p>Opens a five-prompt practice session.</p></div>
        <ul class="trust-list" aria-label="Product facts">
          <li>${icon('check')} Works offline after your first visit</li>
          <li>${icon('check')} Study data stays in this browser</li>
          <li>${icon('check')} Study sessions and JSON backup are free</li>
        </ul>
      </div>
      <picture class="hero-art">
        <source media="(max-width: 640px)" srcset="/assets/topographic-route-768.webp" type="image/webp" />
        <img src="/assets/topographic-route-1280.webp" width="1280" height="853" alt="A short orange route crossing layered paper contour lines toward a survey pin beside a blank study card." fetchpriority="high" decoding="async" />
      </picture>
    </section>
    <section class="chart" aria-labelledby="chart-title">
      <div class="section-heading">
        <div><p class="coordinate">SET UP YOUR SESSION</p><h2 id="chart-title">Add your prompts</h2></div>
        <button class="text-button" data-sample>Load sample into my draft</button>
      </div>
      <label for="prompt-input">One prompt and answer per line, separated by <strong>::</strong> or a tab</label>
      <textarea id="prompt-input" rows="9" aria-describedby="prompt-help prompt-error" placeholder="What is the capital of Peru? :: Lima">${escapeHtml(state.draft)}</textarea>
      <div class="field-meta"><span id="prompt-help">Use 5–30 pairs. Nothing is uploaded.</span><span class="count ${count > 30 ? 'danger-text' : ''}">${count} / 30 ready</span></div>
      <p class="form-error" id="prompt-error" aria-live="polite">${state.draft && validation.message ? escapeHtml(validation.message) : ''}</p>
      <fieldset class="duration-field">
        <legend>Choose the session length</legend>
        <div class="duration-options">
          ${[5, 10, 20].map((minutes) => `<label class="duration"><input type="radio" name="duration" value="${minutes}" ${state.duration === minutes ? 'checked' : ''}><span><strong>${minutes}</strong> min</span></label>`).join('')}
        </div>
      </fieldset>
      <button class="primary-action" data-start ${validation.message || count < 5 ? 'disabled' : ''}>Start study session <span aria-hidden="true">→</span></button>
      <p class="keyboard-note">Keyboard ready: press Tab to move, then Enter to begin.</p>
    </section>
    <section class="landing-section steps-section" aria-labelledby="steps-title">
      <p class="coordinate">HOW IT WORKS</p><h2 id="steps-title">Complete a study session in three steps</h2>
      <ol class="steps-list"><li><strong>Paste 5–30 pairs.</strong><span>Put one prompt and answer on each line.</span></li><li><strong>Recall each answer.</strong><span>Reveal it, then choose Recalled or Keep practicing.</span></li><li><strong>Review your recap.</strong><span>Export a JSON backup whenever you want one.</span></li></ol>
    </section>
    <section class="landing-section limits-section" aria-labelledby="limits-title">
      <div><p class="coordinate">PRIVATE BY DEFAULT</p><h2 id="limits-title">Your study material stays local</h2><p>Prompts, responses, ratings, and recaps remain in this browser. The app does not send usage reports.</p><a href="${demoExitHref('/privacy/')}" ${DEMO_MODE ? 'data-demo-exit' : ''}>Read the privacy policy</a></div>
      <div><p class="coordinate">WHAT THIS APP DOES NOT DO</p><h2>This app does not check answers</h2><p>The app does not teach content, check correctness, or promise learning results.</p></div>
    </section>
    <section class="landing-section price-section" aria-labelledby="price-title">
      <div><p class="coordinate">OPTIONAL ONE-TIME PURCHASE</p><h2 id="price-title">Keep reusable prompt sets for $12</h2><p>Contour adds saved prompt sets and your latest 20 session records. Study sessions and JSON backup remain free.</p></div>
      <a class="secondary-action" href="${CHECKOUT_URL}" ${DEMO_MODE ? 'data-demo-exit' : ''}>Buy Contour once for $12</a>
    </section>
  `);
}

function sessionView(): string {
  const prompt = state.prompts[state.current];
  const percent = ((state.current + (state.revealed ? 0.6 : 0.15)) / state.prompts.length) * 100;
  return shell(`
    <section class="session-wrap" aria-labelledby="session-title">
      <div class="session-topline">
        <div><p class="coordinate">PROMPT ${state.current + 1} OF ${state.prompts.length}</p><h1 id="session-title" class="sr-only" tabindex="-1">Study session</h1></div>
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
      <p class="coordinate">SESSION COMPLETE · PRIVATE RECAP</p>
      <h1 id="recap-title" tabindex="-1">Your study session is complete.</h1>
      <p class="lede">${session.endReason === 'time' ? 'The timer ended the session.' : 'You checked every prompt.'} This is a record of today’s practice, not a grade.</p>
      <dl class="recap-stats">
        <div><dt>Checked</dt><dd>${summary.answered}</dd></div>
        <div><dt>Recalled</dt><dd>${summary.recalled}</dd></div>
        <div><dt>Keep practicing</dt><dd>${summary.practice}</dd></div>
      </dl>
      <div class="recap-actions"><button class="primary-action" data-nav="setup">Start another study session</button><button class="secondary-action" data-export>Export my data ${icon('download')}</button></div>
      <section class="review-list" aria-labelledby="review-title">
        <h2 id="review-title">Marked for more practice</h2>
        ${practiceItems.length ? `<ol>${practiceItems.map((item) => `<li><strong>${escapeHtml(item.question)}</strong><span>${escapeHtml(item.expected)}</span></li>`).join('')}</ol>` : '<p class="empty-copy">You did not mark any checked prompts for more practice.</p>'}
      </section>
    </section>
  `);
}

function libraryView(): string {
  const recent = [...state.sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, state.unlocked ? 20 : 3);
  return shell(`
    <section class="library-wrap" aria-labelledby="library-title">
      <p class="coordinate">LOCAL STUDY DATA</p><h1 id="library-title" tabindex="-1">Your library</h1>
      <p class="lede">Stored only in this browser. Export a backup whenever you like.</p>
      <div class="library-grid">
        <section aria-labelledby="decks-title">
          <div class="section-heading"><h2 id="decks-title">Reusable prompt sets</h2>${state.unlocked ? '<button class="text-button" data-save-draft>Save current draft</button>' : ''}</div>
          ${state.unlocked ? (state.decks.length ? `<ul class="deck-list">${state.decks.map((deck) => `<li><div><strong>${escapeHtml(deck.name)}</strong><span>${deck.prompts.length} prompts</span></div><div><button data-load-deck="${deck.id}" aria-label="Load ${escapeHtml(deck.name)} prompt set">Load this prompt set</button><button class="danger-button" data-delete-deck="${deck.id}" aria-label="Delete ${escapeHtml(deck.name)}">Delete</button></div></li>`).join('')}</ul>` : '<div class="empty-state"><span class="map-mark">×</span><h3>No saved sets yet</h3><p>Return to Start, paste a valid set, then save it here.</p></div>') : `
            <div class="unlock-panel"><span class="map-mark">◇</span><h3>Reuse prompt sets</h3><p>The $12 one-time Contour license adds reusable prompt sets and your latest 20 on-device session records. Starting sessions and exporting data stay free.</p><a class="primary-action" href="${CHECKOUT_URL}">Buy Contour once for $12</a><button class="text-button" data-license-dialog>Have a license? Restore it</button><p class="merchant-note">Checkout is handled by Sociobot / Dodo, merchant of record. No subscription.</p></div>
          `}
        </section>
        <section aria-labelledby="history-title">
          <div class="section-heading"><h2 id="history-title">Recent sessions</h2><span>${state.unlocked ? 'Latest 20' : 'Latest 3'}</span></div>
          ${recent.length ? `<ol class="history-list">${recent.map((session) => { const result = recap(session.responses); return `<li><time datetime="${session.startedAt}">${new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time><span>${result.answered} checked · ${result.practice} to revisit</span></li>`; }).join('')}</ol>` : '<div class="empty-state"><span class="map-mark">○</span><h3>No sessions recorded</h3><p>Complete a study session to add its private recap here.</p><a class="empty-action" href="/" data-nav="setup">Start a study session</a></div>'}
          ${!state.unlocked && state.sessions.length > 3 ? '<p class="quiet-notice">Contour shows your latest 20 sessions after unlocking. All sessions remain in your JSON export.</p>' : ''}
        </section>
      </div>
      <section class="data-controls" aria-labelledby="data-title">
        <h2 id="data-title">Own your data</h2><p>Download or restore a JSON backup. Import replaces the data currently on this device.</p>
        <div><button class="secondary-action" data-export>Export JSON ${icon('download')}</button><label class="secondary-action file-action">Import JSON<input type="file" accept="application/json,.json" data-import></label><button class="danger-button" data-clear>Clear local data</button></div>
      </section>
      ${state.installPrompt ? '<button class="install-card" data-install><strong>Install for offline access</strong><span>Add the app to this device. No account needed. →</span></button>' : ''}
      ${state.licenseNotice ? `<p class="quiet-notice">${escapeHtml(state.licenseNotice)} <a href="${CHECKOUT_URL}">Get a new license</a>.</p>` : ''}
      <dialog id="license-dialog" aria-labelledby="license-title"><form method="dialog"><button class="dialog-close" value="cancel" aria-label="Close">×</button><p class="coordinate">RESTORE PURCHASE</p><h2 id="license-title">Enter your license</h2><p>Paste the token from your purchase email.</p><label for="license-input">License token</label><input id="license-input" autocomplete="off"><p class="form-error" data-license-error aria-live="polite"></p><button class="primary-action" type="button" data-restore-license>Verify and restore</button></form></dialog>
    </section>
  `);
}

function aboutView(): string {
  return shell(`
    <section class="about-wrap" aria-labelledby="about-title">
      <p class="coordinate">PRODUCT SCOPE</p><h1 id="about-title" tabindex="-1">Practice without streaks or feeds</h1>
      <p class="lede">Focus Study Sprint supports short answer practice. It does not generate teaching material, judge mastery, or try to make you return.</p>
      <div class="principles-grid"><article><span>01</span><h2>Bring your own material</h2><p>You choose the material. The app presents one prompt at a time.</p></article><article><span>02</span><h2>Finish on purpose</h2><p>A timer and finite prompt set give the session a clear end.</p></article><article><span>03</span><h2>Keep it private</h2><p>Prompts, answers, ratings, and saved sets stay in this browser.</p></article></div>
    </section>
  `);
}

function render(options: { focus?: string } = {}): void {
  window.clearInterval(timer);
  mount.innerHTML = state.screen === 'setup' ? setupView() : state.screen === 'session' ? sessionView() : state.screen === 'recap' ? recapView() : state.screen === 'library' ? libraryView() : aboutView();
  document.title = DEMO_MODE ? 'Demo — Focus Study Sprint' : SCREEN_TITLES[state.screen];
  const publicPath = DEMO_MODE ? '/demo' : routeFor(state.screen);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://focus-study-sprint.sociobot.in${publicPath}`);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', `https://focus-study-sprint.sociobot.in${publicPath}`);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', document.title);
  bindEvents();
  if (state.screen === 'session' && !state.paused) startTimer();
  const focusTarget = options.focus;
  if (focusTarget) requestAnimationFrame(() => document.querySelector<HTMLElement>(focusTarget)?.focus());
}

function navigate(screen: Screen, replace = false): void {
  if (state.screen === 'session' && screen !== 'session' && state.responses.length + state.current > 0) {
    if (!window.confirm('End this session? Your checked prompts will be saved in a recap.')) return;
    finishSession('complete');
    return;
  }
  state.screen = screen;
  setRoute(screen, replace);
  render({ focus: 'h1' });
  announce(document.title);
}

function startSession(replaceRoute = false): void {
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
  setRoute('session', replaceRoute);
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
  setRoute('recap');
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

async function resetDemo(): Promise<void> {
  if (!DEMO_MODE) return;
  await clearDemoWorkspace();
  Object.assign(state, {
    screen: 'setup' as Screen,
    draft: SAMPLE,
    duration: 5,
    prompts: [],
    current: 0,
    response: '',
    revealed: false,
    responses: [],
    remaining: 0,
    endAt: 0,
    paused: false,
    startedAt: '',
    recap: null,
    decks: [],
    sessions: [],
    unlocked: true,
    licenseNotice: '',
    message: ''
  });
  localStorage.setItem(localKey('fss:draft'), SAMPLE);
  localStorage.setItem(localKey('fss:duration'), '5');
  startSession(true);
}

async function leaveDemo(): Promise<void> {
  await exitDemoTo('/');
}

async function exitDemoTo(destination: string): Promise<void> {
  if (!DEMO_MODE) { location.assign(destination); return; }
  try {
    await clearDemoWorkspace();
  } finally {
    location.assign(destination);
  }
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((element) => element.addEventListener('click', (event) => { event.preventDefault(); navigate(element.dataset.nav as Screen); }));
  document.querySelectorAll<HTMLAnchorElement>('[data-demo-exit]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void exitDemoTo(link.href);
  }));
  document.querySelector<HTMLButtonElement>('[data-theme-toggle]')?.addEventListener('click', (event) => {
    const next: Theme = state.theme === 'system' ? 'light' : state.theme === 'light' ? 'dark' : 'system';
    setTheme(next);
    (event.currentTarget as HTMLButtonElement).innerHTML = icon(next === 'dark' ? 'moon' : next === 'light' ? 'sun' : 'system');
    announce(`Theme set to ${next}`);
  });
  const input = document.querySelector<HTMLTextAreaElement>('#prompt-input');
  input?.addEventListener('input', () => { state.draft = input.value; localStorage.setItem(localKey('fss:draft'), state.draft); renderSetupFeedback(); });
  document.querySelector('[data-sample]')?.addEventListener('click', () => { state.draft = SAMPLE; localStorage.setItem(localKey('fss:draft'), SAMPLE); render({ focus: '#prompt-input' }); });
  document.querySelectorAll<HTMLInputElement>('input[name="duration"]').forEach((radio) => radio.addEventListener('change', () => { state.duration = Number(radio.value); localStorage.setItem(localKey('fss:duration'), radio.value); }));
  document.querySelector('[data-start]')?.addEventListener('click', () => startSession());
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
    const name = window.prompt('Name this prompt set:', `Prompt set ${state.decks.length + 1}`)?.trim();
    if (!name) return;
    const deck: SavedDeck = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString(), prompts: validation.prompts };
    await storage.putDeck(deck); state.decks.push(deck); state.message = `Saved “${name}” on this device.`; render();
  });
  document.querySelectorAll<HTMLButtonElement>('[data-load-deck]').forEach((button) => button.addEventListener('click', () => {
    const deck = state.decks.find((item) => item.id === button.dataset.loadDeck); if (!deck) return;
    state.draft = deck.prompts.map((prompt) => `${prompt.question} :: ${prompt.answer}`).join('\n'); localStorage.setItem(localKey('fss:draft'), state.draft); state.screen = 'setup'; setRoute('setup'); render({ focus: '#prompt-input' });
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
  document.querySelector('[data-update]')?.addEventListener('click', () => { reloadForUpdate = true; state.updateReady?.postMessage({ type: 'SKIP_WAITING' }); });
  document.querySelector('[data-reset-demo]')?.addEventListener('click', () => void resetDemo());
  document.querySelector('[data-start-real]')?.addEventListener('click', () => void leaveDemo());
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
window.addEventListener('popstate', () => {
  const next = screenFromLocation();
  if ((next === 'session' && !state.startedAt) || (next === 'recap' && !state.recap)) state.screen = 'setup';
  else state.screen = next;
  render({ focus: 'h1' });
  announce(document.title);
});

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
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!reloadForUpdate) return;
    reloadForUpdate = false;
    window.location.reload();
  });
}

async function init(): Promise<void> {
  setTheme(state.theme);
  if (!DEMO_MODE) {
    captureLicenseFromUrl();
    state.unlocked = cachedUnlock();
  }
  try { [state.sessions, state.decks] = await Promise.all([storage.getSessions(), storage.getDecks()]); }
  catch (error) {
    state.message = error instanceof Error && error.message.startsWith('Stored ')
      ? 'Stored data could not be read. Open Library to restore a valid backup or clear local data.'
      : 'Private storage is unavailable in this browser. Sessions still work, but export before leaving.';
  }
  const restored = restoreActive();
  if (!restored) {
    state.screen = screenFromLocation();
    if (state.screen === 'recap' || (state.screen === 'session' && !DEMO_MODE)) state.screen = 'setup';
    if (DEMO_MODE && state.screen === 'session') {
      localStorage.setItem(localKey('fss:draft'), SAMPLE);
      localStorage.setItem(localKey('fss:duration'), '5');
      startSession(true);
    }
  }
  if (restored && state.remaining <= 0) await finishSession('time');
  else if (!(DEMO_MODE && !restored && state.screen === 'session')) {
    setRoute(state.screen, true);
    render();
  }
  void registerServiceWorker();
  if (!DEMO_MODE) {
    const verdict = await verifyLicense();
    if (verdict && verdict.valid !== state.unlocked) { state.unlocked = verdict.valid; if (!verdict.valid) state.licenseNotice = 'Your saved license is no longer active.'; render(); }
  }
}

void init();
