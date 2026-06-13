import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';

// Mock browser globals needed for App to load and render
global.window = {
  location: {
    search: '',
    origin: 'http://localhost',
    pathname: '/'
  },
  localStorage: {
    getItem: () => null,
    setItem: () => null
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {}
};

global.localStorage = global.window.localStorage;

Object.defineProperty(global, 'navigator', {
  value: {
    clipboard: {
      writeText: () => Promise.resolve()
    }
  },
  configurable: true,
  writable: true
});

global.document = {
  documentElement: {
    setAttribute: () => {},
    removeAttribute: () => {}
  },
  querySelector: () => null,
  createElement: () => ({
    setAttribute: () => {},
    id: '',
    type: ''
  }),
  head: {
    appendChild: () => {}
  },
  addEventListener: () => {},
  removeEventListener: () => {}
};

// Mock modules that import css or other files that might break in node test
vi.mock('@vercel/analytics', () => ({
  track: vi.fn()
}));

describe('App Smoke Test', () => {
  test('should import and render App without crashing', async () => {
    // Dynamically import App after setting up mock globals
    const { default: App } = await import('../App');
    
    // Render App to static HTML string (runs render phase but not useEffects)
    const html = renderToString(<App />);
    expect(html).toContain('Valia');
  });
});
