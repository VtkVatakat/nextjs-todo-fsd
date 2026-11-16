import fs from 'node:fs/promises';
import path from 'node:path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function readDb<T>(): Promise<T> {
  const rawData = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(rawData) as T;
}

export async function writeDb<T>(data: T): Promise<void> {
  const formattedData = JSON.stringify(data, null, 2);
  await fs.writeFile(dbPath, formattedData, 'utf-8');
}
