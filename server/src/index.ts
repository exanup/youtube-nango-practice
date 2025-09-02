import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Nango } from '@nangohq/node'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
    res.json({ ok: true })
})

const nango = new Nango({
    secretKey: process.env.NANGO_SECRET_KEY as string,
    host: process.env.NANGO_HOST || 'https://api.nango.dev',
})

app.post('/nango/session', async (_req, res) => {
    try {
        const r = await nango.createConnectSession({
            end_user: { id: 'dev-user-1' },
            allowed_integrations: ['youtube-subscriptions-test'],
        })
        res.status(200).json({ sessionToken: r.data.token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'failed_to_create_session' })
    }
})

app.get('/youtube/subscriptions', async (req, res) => {
    try {
        const connectionId = req.query.connectionId as string
        if (!connectionId) {
            return res.status(400).json({ error: 'connectionId is required' })
        }

        // Use Nango to make the API call to YouTube
        const response = await nango.get({
            connectionId,
            providerConfigKey: 'youtube-subscriptions-test',
            endpoint: 'https://www.googleapis.com/youtube/v3/subscriptions',
            params: {
                part: 'snippet',
                mine: 'true',
                maxResults: 10,
            },
        })

        res.json(response.data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'failed_to_fetch_subscriptions' })
    }
})

const PORT = Number(process.env.PORT || 4000)
app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)
})
