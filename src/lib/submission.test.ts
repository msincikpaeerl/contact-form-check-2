import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { handleSubmission } from './submission';

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
});
