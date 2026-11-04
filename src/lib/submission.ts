import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

/** What the server keeps for each message. */
export interface StoredMessage {
  receivedAt: string;
  name: string;
  email: string;
  message: string;
}

export type ValidationResult =
  { ok: true; value: Omit<StoredMessage, 'receivedAt'> } | { ok: false; errors: string[] };

/** Checks the fields of a submitted form. Placeholder rules: SWWCF-3 defines the real ones. */
export function validateSubmission(form: FormData): ValidationResult {
  const read = (key: string) => String(form.get(key) ?? '').trim();
  const name = read('name');
  const email = read('email');
  const message = read('message');
  const errors: string[] = [];
  if (!name) errors.push('name is required');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push('email is not valid');
  if (!message) errors.push('message is required');
  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: { name, email, message } };
}

/** Appends one message, as one JSON line, to a file on this computer. Creates the folder if needed. */
export async function appendMessage(filePath: string, message: StoredMessage): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(message)}\n`, 'utf8');
}

/** Receives a form submission, checks it and writes it to `filePath`. */
export async function handleSubmission(request: Request, filePath: string): Promise<Response> {
  const result = validateSubmission(await request.formData());
  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }
  await appendMessage(filePath, { receivedAt: new Date().toISOString(), ...result.value });
  return Response.json({ saved: true }, { status: 201 });
}
