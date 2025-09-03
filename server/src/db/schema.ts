import {
    sqliteTable,
    text,
    integer,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const connections = sqliteTable(
    'connections',
    {
        id: text('id').primaryKey(),
        userId: text('user_id').notNull(),
        provider: text('provider').notNull(),
        connectionId: text('connection_id').notNull(),
        scope: text('scope'),
        createdAt: integer('created_at', { mode: 'timestamp_ms' })
            .notNull()
            .default(sql`(strftime('%s','now') * 1000)`),
        updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
            .notNull()
            .default(sql`(strftime('%s','now') * 1000)`),
    },
    (t) => [
        uniqueIndex('unq_user_provider').on(t.userId, t.provider),
        uniqueIndex('unq_connection_id').on(t.connectionId),
    ],
)
