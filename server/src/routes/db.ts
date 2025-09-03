import { Router } from 'express'
import { eq } from 'drizzle-orm'

import { pingDb, db } from '../db'
import { connections } from '../db/schema'

const router = Router()

router.get('/db/health', async (_req, res) => {
    try {
        const ok = await pingDb()
        res.json({ ok, sqlite: true })
    } catch (e) {
        res.status(500).json({ ok: 0, error: (e as Error).message })
    }
})

router.get('/db/smoke', async (_req, res) => {
    try {
        const id = crypto.randomUUID()
        await db
            .insert(connections)
            .values({
                id,
                userId: 'dev-user',
                provider: 'youtube',
                connectionId: 'demo-connection',
            })
            .run()

        const rows = await db
            .select()
            .from(connections)
            .where(eq(connections.id, id))
        res.json({ inserted: rows[0] ?? null })
    } catch (e) {
        res.status(500).json({ error: (e as Error).message })
    }
})

export default router
