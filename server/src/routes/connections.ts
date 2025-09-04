import { Router } from 'express'

import {
    upsertConnection,
    getConnectionsForUser,
    getConnection,
    deleteConnection,
} from '../services/connections'

const router = Router()

router.get('/connections/:userId', async (req, res) => {
    res.json(await getConnectionsForUser(req.params.userId))
})

router.post('/connections', async (req, res) => {
    const { userId, provider, connectionId } = req.body ?? {}

    if (!userId || !provider || !connectionId) {
        return res
            .status(400)
            .json({ error: 'userId, provider, and connectionId are required' })
    }

    await upsertConnection(userId, provider, connectionId)

    res.status(201).json({ ok: true })
})

router.get('/connections/:userId/:provider', async (req, res) => {
    const row = await getConnection(req.params.userId, req.params.provider)

    if (!row) return res.status(404).json({ error: 'Not found' })

    res.json(row)
})

router.delete('/connections/:connectionId', async (req, res) => {
    const result = await deleteConnection(req.params.connectionId)

    if (result.changes === 0)
        return res.status(404).json({ error: 'Not found' })

    res.status(204).end()
})

export default router
