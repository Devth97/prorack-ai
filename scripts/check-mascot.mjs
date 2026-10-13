import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { transform } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Render the actual component in every call state without starting a paid call.
const source = await fs.readFile('src/app.jsx', 'utf8');
const component = source.slice(source.indexOf('function VoiceMascot('), source.indexOf('function VoiceAssistant('));
const { code } = await transform(component, { loader: 'jsx', format: 'cjs' });
const Mascot = new Function('React', `${code}; return VoiceMascot;`)(React);
for (const state of ['idle', 'connecting', 'ringing', 'active', 'ended', 'error']) {
  for (const muted of [true, false]) {
    const html = renderToStaticMarkup(React.createElement(Mascot, { state, muted }));
    assert.ok(html.includes(`data-state="${state}"`));
    assert.ok(html.includes(`data-muted="${muted}"`));
    for (const part of ['mascot-eyes', 'mascot-wave', 'mascot-laptop']) assert.ok(html.includes(part));
    assert.ok(html.includes('aria-hidden="true"'));
  }
}
const css = await fs.readFile('assets/editorial.css', 'utf8');
assert.ok(css.includes('prefers-reduced-motion:reduce'));
assert.ok(css.includes('.voice-assistant * {animation:none!important;transition:none!important;}'));
const response = await fetch('http://localhost:4600/');
assert.equal(response.status, 200);
console.log('PASS: 12 mascot state/mute combinations, decorative accessibility, reduced-motion override, preview HTTP 200.');
