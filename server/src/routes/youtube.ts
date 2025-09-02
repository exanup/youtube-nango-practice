import { Router } from 'express'

import { nango } from '../nango'
import { PROVIDER_KEYS } from '../config'

const router = Router()

router.get('/youtube/subscriptions', async (req, res) => {
    try {
        const connectionId = req.query.connectionId as string
        const pageToken = req.query.pageToken as string | undefined

        if (!connectionId) {
            return res.status(400).json({ error: 'connectionId is required' })
        }

        const params: Record<string, string | number> = {
            part: 'snippet',
            mine: 'true',
            maxResults: 10,
        }
        if (pageToken) params.pageToken = pageToken

        const response = await nango.get({
            connectionId,
            providerConfigKey: PROVIDER_KEYS.youtube,
            endpoint: 'https://www.googleapis.com/youtube/v3/subscriptions',
            params,
        })

        res.json(response.data)
    } catch (err: any) {
        console.error(
            'YouTube subscriptions error:',
            err?.response?.data || err.message,
        )
        res.status(500).json({ error: 'failed_to_fetch_subscriptions' })
    }
})

export default router
