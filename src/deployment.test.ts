import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type StaticConfig = {
  globalHeaders: Record<string, string>;
  mimeTypes: Record<string, string>;
  responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
  routes: Array<{ route: string; headers?: Record<string, string>; rewrite?: string }>;
};

const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as StaticConfig;

describe('static deployment policy', () => {
  it('keeps fingerprinted assets immutable and the worker updateable', () => {
    const assets = config.routes.find((route) => route.route === '/assets/*');
    const worker = config.routes.find((route) => route.route === '/sw.js');
    expect(assets?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(worker?.headers?.['Cache-Control']).toBe('no-cache');
  });

  it('serves a standards manifest and restrictive static-app policy', () => {
    const manifest = config.routes.find((route) => route.route === '/manifest.webmanifest');
    expect(manifest?.headers?.['Cache-Control']).toContain('must-revalidate');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("connect-src 'self' https://api.sociobot.in");
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
  });

  it('does not require unsafe inline styles under the production CSP', () => {
    expect(readFileSync('src/app.ts', 'utf8')).not.toContain('style="');
    expect(readFileSync('public/offline.html', 'utf8')).not.toContain('<style>');
    expect(readFileSync('public/offline.html', 'utf8')).toContain('href="/offline.css"');
    expect(config.globalHeaders['Content-Security-Policy']).not.toContain("'unsafe-inline'");
  });

  it('ships a versioned app shell for service-worker update activation', () => {
    expect(readFileSync('public/sw.js', 'utf8')).toContain("const VERSION = 'fss-v11'");
    expect(readFileSync('public/sw.js', 'utf8')).toContain('html.matchAll');
    expect(readFileSync('public/sw.js', 'utf8')).toContain('ignoreVary: true');
    expect(readFileSync('public/manifest.webmanifest', 'utf8')).toContain('"start_url": "/?v=11"');
  });

  it('rewrites only real app routes and serves a designed 404 for unknown paths', () => {
    expect(config.routes.find((route) => route.route === '/demo')?.rewrite).toBe('/demo/index.html');
    expect(config.routes.find((route) => route.route === '/library')?.rewrite).toBe('/index.html');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    expect(readFileSync('404.html', 'utf8')).toContain('This page does not exist');
    expect(readFileSync('public/staticwebapp.config.json', 'utf8')).not.toContain('navigationFallback');
  });

  it('declares every public claim with one unique browser-test tag', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
    const browserTests = readFileSync('tests/app.spec.ts', 'utf8');
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(claim.test).toContain(tag);
      expect(browserTests.split(tag)).toHaveLength(2);
    }
  });

  it('makes the production billing contract a required release gate', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };
    const billingContract = readFileSync('scripts/verify-live-contract.mjs', 'utf8');
    expect(packageJson.scripts['test:release']).toContain('npm run test:live-contract');
    expect(billingContract).toContain("slug: 'focus-study-sprint'");
    expect(billingContract).toContain('priceMinor: 1200');
    expect(billingContract).toContain('assert.ok(registered');
    expect(billingContract).toContain('Checkout must redirect to hosted Sociobot checkout');
  });
});
