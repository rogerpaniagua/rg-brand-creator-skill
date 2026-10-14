// The one-command install must work from any folder, create missing folders and never clobber silently.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(here, '../bin/install.mjs');
const run = (args, env = {}) => new Promise((resolve) => {
  const p = spawn(process.execPath, [CLI, ...args], { cwd: os.tmpdir(), stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...env } });
  let all = ''; p.stdout.on('data', (d) => (all += d)); p.stderr.on('data', (d) => (all += d));
  p.on('close', (code) => resolve({ code, all }));
});
const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));

test('installs the whole skill, creating missing folders (the cp -R trap)', async () => {
  const target = path.join(tmp('inst-'), 'does', 'not', 'exist', 'yet');
  const r = await run(['--target', target]);
  assert.equal(r.code, 0, r.all);
  const dest = path.join(target, 'rg-brand-creator-skill');
  assert.match(fs.readFileSync(path.join(dest, 'SKILL.md'), 'utf8'), /^---\nname: rg-brand-creator-skill\n/);
  assert.match(r.all, /Claude Code/);
});

test('an existing install is kept unless --force', async () => {
  const target = tmp('inst-');
  await run(['--target', target]);
  const marker = path.join(target, 'rg-brand-creator-skill', 'MY-NOTES.txt');
  fs.writeFileSync(marker, 'local edit');
  assert.match((await run(['--target', target, '--lang', 'en'])).all, /already installed/);
  assert.ok(fs.existsSync(marker));
  assert.equal((await run(['--target', target, '--force'])).code, 0);
  assert.ok(!fs.existsSync(marker));
});

test('default target is ~/.claude/skills under the current home', async () => {
  const home = tmp('home-');
  const r = await run([], { HOME: home, USERPROFILE: home });
  assert.equal(r.code, 0, r.all);
  assert.ok(fs.existsSync(path.join(home, '.claude', 'skills', 'rg-brand-creator-skill', 'SKILL.md')));
});

test('refuses to write through a symlinked target', async () => {
  const real = tmp('real-'); const base = tmp('link-'); const link = path.join(base, 'skills');
  fs.symlinkSync(real, link);
  const r = await run(['--target', link]);
  assert.notEqual(r.code, 0);
  assert.deepEqual(fs.readdirSync(real), []);
});

test('the skill folder has what Claude Code needs', () => {
  const skill = path.join(here, '../rg-brand-creator-skill');
  assert.ok(fs.existsSync(path.join(skill, 'SKILL.md')));
  assert.match(fs.readFileSync(path.join(skill, 'SKILL.md'), 'utf8'), /^---\nname: rg-brand-creator-skill\n[\s\S]*?description:/);
});
