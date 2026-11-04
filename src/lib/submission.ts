import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

/** What the server keeps for each message. */
export interface StoredMessage {
  receivedAt: string;
  name: string;
  email: string;
  message: string;
}

export type FieldName = 'name' | 'email' | 'message';

/** One error message per faulty field. */
export type FieldErrors = Partial<Record<FieldName, string>>;

export type ValidationResult =
  { ok: true; value: Omit<StoredMessage, 'receivedAt'> } | { ok: false; errors: FieldErrors };

/** Where the site keeps the saved messages, relative to the folder the site is started from. */
export const MESSAGES_FILE = 'data/messages.jsonl';

/** Checks the fields of a submitted form: none may be empty, and the e-mail address must be valid. */
export function validateSubmission(form: FormData): ValidationResult {
  const read = (key: string) => String(form.get(key) ?? '').trim();
  const name = read('name');
  const email = read('email');
  const message = read('message');
  const errors: FieldErrors = {};
  if (!name) errors.name = 'Please enter your name.';
  if (!email) errors.email = 'Please enter your e-mail address.';
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    errors.email = 'Please enter a valid e-mail address.';
  if (!message) errors.message = 'Please enter a message.';
  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, value: { name, email, message } };
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
