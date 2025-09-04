import { Router } from 'express'

import { nango } from '../nango'
import { PROVIDER_KEYS } from '../config'
import { DBRunResult } from '../db'

import { deleteConnection, upsertConnection } from '../services/connections'

const router = Router()

router.post('/nango/session', async (_req, res) => {
    try {
        const r = await nango.createConnectSession({
            end_user: { id: 'dev-user-1' },
            allowed_integrations: [PROVIDER_KEYS.youtube],
        })
        res.status(200).json({ sessionToken: r.data.token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'failed_to_create_session' })
    }
})

router.post('/nango/webhook', async (req, res) => {
    try {
        const sig = req.header('x-nango-signature') ?? ''
        const isValid = nango.verifyWebhookSignature(sig, req.body)

        if (!isValid) {
            return res.status(401).json({ error: 'invalid_signature' })
        }

        const evt = req.body as {
            type?: string
            operation?: string
            success?: boolean
            connectionId?: string
            providerConfigKey?: string
            endUser?: { endUserId?: string | null }
        }

        let result: DBRunResult | null = null

        if (evt?.type === 'auth' && evt?.success) {
            const userId = evt.endUser?.endUserId ?? 'unknown'
            const provider = evt.providerConfigKey ?? 'unknown'
            const connectionId = evt.connectionId ?? 'unknown'

            if (evt?.operation === 'creation' || evt.operation === 'update') {
                result = await upsertConnection(userId, provider, connectionId)
            }

            if (evt.operation === 'deletion') {
                result = await deleteConnection(connectionId)
            }
        }

        // Always 200 to stop retries unless you need to debug
        const STATUS = 200

        if (process.env.ENV === 'dev') {
            res.status(STATUS).json(result)
            return
        }

        res.status(STATUS).end()
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'webhook_handler_failed' })
    }
})

export default router
