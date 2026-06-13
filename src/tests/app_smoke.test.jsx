// @vitest-environment happy-dom
import { describe, test, expect, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock ResizeObserver for Recharts components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Vercel specific analytics and speed-insights
vi.mock('@vercel/analytics', () => ({
  track: vi.fn()
}));

vi.mock('@vercel/speed-insights', () => ({
  injectSpeedInsights: vi.fn()
}));

// Stub other window & navigator APIs not fully present in happy-dom
window.scrollTo = vi.fn();
if (!window.print) {
  window.print = vi.fn();
}

if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn(() => Promise.resolve())
    },
    configurable: true,
    writable: true
  });
} else if (!navigator.clipboard.writeText) {
  navigator.clipboard.writeText = vi.fn(() => Promise.resolve());
}

describe('App Smoke Test (DOM environment)', () => {
  test('should mount, execute lifecycles (useEffect), and render App without crashing', async () => {
    // Dynamically import App after mocking environment globals
    const { default: App } = await import('../App');

    // Create a container element in document body
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);

    // Mount the component in the mock DOM, triggering all useEffect hooks
    await act(async () => {
      root.render(<App />);
    });

    // Verify it rendered successfully and contains core app branding
    expect(container.innerHTML).toContain('Valia');

    // Unmount component to execute all cleanup functions
    await act(async () => {
      root.unmount();
    });

    // Clean up DOM container
    document.body.removeChild(container);
  });
});
