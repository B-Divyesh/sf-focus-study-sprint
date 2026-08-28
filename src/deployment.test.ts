import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type StaticConfig = {
  globalHeaders: Record<string, string>;
  mimeTypes: Record<string, string>;
  routes: Array<{ route: string; headers: Record<string, string> }>;
};

const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as StaticConfig;

describe('static deployment policy', () => {
  it('keeps fingerprinted assets immutable and the worker updateable', () => {
    const assets = config.routes.find((route) => route.route === '/assets/*');
    const worker = config.routes.find((route) => route.route === '/sw.js');
    expect(assets?.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(worker?.headers['Cache-Control']).toBe('no-cache');
  });

  it('serves a standards manifest and restrictive static-app policy', () => {
    const manifest = config.routes.find((route) => route.route === '/manifest.webmanifest');
    expect(manifest?.headers['Cache-Control']).toContain('must-revalidate');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders['Content-Security-Policy']).toContain("connect-src 'self' https://api.sociobot.in");
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
  });

  it('does not require unsafe inline styles under the production CSP', () => {
    expect(readFileSync('src/app.ts', 'utf8')).not.toContain('style="');
    expect(config.globalHeaders['Content-Security-Policy']).not.toContain("'unsafe-inline'");
  });
});
