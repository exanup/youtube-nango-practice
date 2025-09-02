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
            allowed_integrations: ['youtube'],
        })
        res.status(200).json({ sessionToken: r.data.token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'failed_to_create_session' })
    }
})

const PORT = Number(process.env.PORT || 4000)
app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)
})
