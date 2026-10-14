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
    for (const pose of ['tablet', 'greeting']) assert.ok(html.includes(`assets/mascot/rackbot-${pose}.png`));
    for (const motion of ['rackbot-waving-hand', 'rackbot-typing-hand']) assert.ok(html.includes(motion));
    assert.ok(html.includes('mascot-wave'));
    assert.equal((html.match(/class="rackbot-smile"/g) || []).length, 2, 'Smile in both RackBot poses');
    assert.ok(html.includes('aria-hidden="true"'));
  }
}
const css = await fs.readFile('assets/editorial.css', 'utf8');
for (const pose of ['greeting', 'tablet']) await fs.access(`assets/mascot/rackbot-${pose}.png`);
assert.ok(css.includes('prefers-reduced-motion:reduce'));
assert.ok(css.includes('.voice-assistant * {animation:none!important;transition:none!important;}'));
for (const animation of ['rackbot-greeting-loop', 'rackbot-tablet-loop', 'rackbot-wave-hand', 'rackbot-type']) {
  assert.ok(css.includes(`@keyframes ${animation}`));
  assert.match(css, new RegExp(`animation:${animation}[^;]+infinite`));
}
console.log('PASS: 12 RackBot state/mute combinations, both poses present throughout, continuous pose/hand loops, assets and reduced motion.');
