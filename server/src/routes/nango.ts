import { Router } from 'express'

import { nango } from '../nango'
import { PROVIDER_KEYS } from '../config'

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

export default router
