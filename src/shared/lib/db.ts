import fs from 'node:fs/promises';
import path from 'node:path';

const initialDbPath = path.join(process.cwd(), 'db.json');
const dbPath = process.env.VERCEL ? path.join('/tmp', 'db.json') : initialDbPath;

export async function readDb<T>(): Promise<T> {
  try {
    const rawData = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(rawData) as T;
  } catch {
    const seedData = await fs.readFile(initialDbPath, 'utf-8');
    await fs.writeFile(dbPath, seedData, 'utf-8');
    return JSON.parse(seedData) as T;
  }
}

export async function writeDb<T>(data: T): Promise<void> {
  const formattedData = JSON.stringify(data, null, 2);
  await fs.writeFile(dbPath, formattedData, 'utf-8');
}
