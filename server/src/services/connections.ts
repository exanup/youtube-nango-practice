// server/src/services/connections.ts
import { db } from '../db'
import { connections } from '../db/schema'
import { and, eq, desc } from 'drizzle-orm'

export async function upsertConnection(
    userId: string,
    provider: string,
    connectionId: string,
) {
    const now = new Date()
    await db
        .insert(connections)
        .values({
            id: crypto.randomUUID(),
            userId,
            provider,
            connectionId,
            updatedAt: now,
        })
        .onConflictDoUpdate({
            target: [connections.userId, connections.provider],
            set: { connectionId, updatedAt: now },
        })
        .run()
}

export async function getConnectionsForUser(userId: string) {
    return db
        .select()
        .from(connections)
        .where(eq(connections.userId, userId))
        .orderBy(desc(connections.updatedAt))
}

export async function getConnection(userId: string, provider: string) {
    const [row] = await db
        .select()
        .from(connections)
        .where(
            and(
                eq(connections.userId, userId),
                eq(connections.provider, provider),
            ),
        )
    return row ?? null
}

export async function deleteConnection(connectionId: string) {
    return db
        .delete(connections)
        .where(eq(connections.connectionId, connectionId))
        .run()
}
