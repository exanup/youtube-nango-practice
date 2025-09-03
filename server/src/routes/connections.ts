import { Router } from 'express'
import { db } from '../db'
import { connections } from '../db/schema'
import { and, eq, desc } from 'drizzle-orm'

const router = Router()

router.get('/connections/:userId', async (req, res) => {
    const rows = await db
        .select()
        .from(connections)
        .where(eq(connections.userId, req.params.userId))
        .orderBy(desc(connections.updatedAt))
    res.json(rows)
})

router.post('/connections', async (req, res) => {
    try {
        const { userId, provider, connectionId } = req.body ?? {}
        if (!userId || !provider || !connectionId) {
            return res.status(400).json({
                error: 'userId, provider, and connectionId are required',
            })
        }
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

        res.status(201).json({ ok: true })
    } catch (e) {
        res.status(500).json({ error: (e as Error).message })
    }
})

router.get('/connections/:userId/:provider', async (req, res) => {
    try {
        const { userId, provider } = req.params
        const [row] = await db
            .select()
            .from(connections)
            .where(
                and(
                    eq(connections.userId, userId),
                    eq(connections.provider, provider),
                ),
            )

        if (!row) return res.status(404).json({ error: 'Not found' })
        res.json(row)
    } catch (e) {
        res.status(500).json({ error: (e as Error).message })
    }
})

router.delete('/connections/:connectionId', async (req, res) => {
    const { connectionId } = req.params
    const result = await db
        .delete(connections)
        .where(eq(connections.connectionId, connectionId))
        .run()

    if ((result as any).changes === 0)
        return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
})

export default router
