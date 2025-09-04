import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

import fs from 'node:fs'
import path from 'node:path'

const DB_PATH = path.resolve(__dirname, '../../data/app.sqlite')
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const sqlite = new Database(DB_PATH)
export const db = drizzle(sqlite, { schema })

export async function pingDb(): Promise<number> {
    const row = sqlite.prepare('SELECT 1 as ok').get() as { ok: number }
    return row.ok
}

export type DBRunResult = Database.RunResult
