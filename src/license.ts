const PRODUCT = 'focus-study-sprint';
const KEY = `sb_license:${PRODUCT}`;
const VERDICT_KEY = `${KEY}:verdict`;
const VERIFY_AFTER_MS = 24 * 60 * 60 * 1000;

type Verdict = { valid: boolean; checkedAt: number; reason?: string };

export const CHECKOUT_URL = `https://api.sociobot.in/api/v1/products/${PRODUCT}/checkout`;

export function captureLicenseFromUrl(): string | null {
  const url = new URL(window.location.href);
  const incoming = url.searchParams.get('license');
  if (!incoming) return localStorage.getItem(KEY);
  localStorage.setItem(KEY, incoming);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 }));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return incoming;
}

export function saveLicense(token: string): void {
  localStorage.setItem(KEY, token.trim());
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 }));
}

export function cachedUnlock(): boolean {
  if (!localStorage.getItem(KEY)) return false;
  try {
    return (JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '') as Verdict).valid;
  } catch {
    return false;
  }
}

export async function verifyLicense(force = false): Promise<Verdict | null> {
  const token = localStorage.getItem(KEY);
  if (!token) return null;
  let cached: Verdict | null = null;
  try { cached = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '') as Verdict; } catch { /* verify below */ }
  if (!force && cached && Date.now() - cached.checkedAt < VERIFY_AFTER_MS) return cached;
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${PRODUCT}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const body = await response.json() as { valid: boolean; reason?: string };
    const verdict = { valid: body.valid, reason: body.reason, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return verdict;
  } catch {
    return cached;
  }
}
