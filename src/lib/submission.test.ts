import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { handleSubmission, validateSubmission } from './submission';

function formData(fields: Record<string, string>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}

describe('validateSubmission', () => {
  it('accepts a valid submission and trims it', () => {
    const result = validateSubmission(
      formData({ name: ' Ada ', email: 'ada@example.com', message: ' Hi ' }),
    );
    expect(result).toEqual({
      ok: true,
      value: { name: 'Ada', email: 'ada@example.com', message: 'Hi' },
    });
  });

  it('reports each empty field separately', () => {
    const result = validateSubmission(formData({ name: ' ', email: '', message: '' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name']);
  });

  it('refuses invalid e-mail addresses', () => {
    for (const email of ['nope', 'a@b', 'a b@c.d', '@c.d']) {
      const result = validateSubmission(formData({ name: 'Ada', email, message: 'Hi' }));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(Object.keys(result.errors)).toEqual(['email']);
    }
  });

  it('treats missing fields as empty', () => {
    expect(validateSubmission(new FormData()).ok).toBe(false);
  });
});

function formRequest(fields: Record<string, string>): Request {
  return new Request('http://localhost/submit', {
    method: 'POST',
    body: new URLSearchParams(fields),
  });
}

describe('handleSubmission', () => {
  let dir: string;
  let file: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'cfc-'));
    file = join(dir, 'data', 'messages.jsonl');
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('checks a valid submission and writes it to a file', async () => {
    const response = await handleSubmission(
      formRequest({ name: 'Ada', email: 'ada@example.com', message: 'Hello' }),
      file,
    );
    expect(response.status).toBe(201);
    const lines = (await readFile(file, 'utf8')).trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0] as string)).toMatchObject({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello',
    });
  });

  it('rejects an invalid submission and writes nothing', async () => {
    const response = await handleSubmission(
      formRequest({ name: '', email: 'nope', message: '' }),
      file,
    );
    expect(response.status).toBe(400);
    expect(existsSync(file)).toBe(false);
  });

  it('records the date and time received', async () => {
    await handleSubmission(
      formRequest({ name: 'Ada', email: 'ada@example.com', message: 'Hello' }),
      file,
    );
    const saved = JSON.parse((await readFile(file, 'utf8')).trim());
    expect(Number.isNaN(Date.parse(saved.receivedAt))).toBe(false);
  });
});
