import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import nangoRoutes from './routes/nango'
import youtubeRoutes from './routes/youtube'
import dbRoutes from './routes/db'
import connectionsRoutes from './routes/connections'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
    res.json({ ok: true })
})

app.use(nangoRoutes)
app.use(youtubeRoutes)
app.use(dbRoutes)
app.use(connectionsRoutes)

const PORT = Number(process.env.PORT || 4000)
app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)
})
