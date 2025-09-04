require('dotenv').config({ path: 'server/.env' })
const fs = require('fs')
const crypto = require('crypto')

const secret = process.env.NANGO_SECRET_KEY
if (!secret) {
    console.error('❌ Missing NANGO_SECRET_KEY in env')
    process.exit(1)
}

const payloadPath = process.argv[2] || 'server/payloads/creation.json'
const payload = JSON.parse(fs.readFileSync(payloadPath).toString())

const signatureString = `${secret}${JSON.stringify(payload)}`
const sig = crypto.createHash('sha256').update(signatureString).digest('hex')

const url = process.env.WEBHOOK_URL || 'http://localhost:4000/nango/webhook'
console.log(`→ POSTing ${payloadPath} to ${url} with signature ${sig}`)

async function sendWebhook() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-nango-signature': sig,
            },
            body: JSON.stringify(payload),
        })

        console.log(`Status: ${response.status} ${response.statusText}`)

        if (!response.ok) {
            console.error(`❌ HTTP error! status: ${response.status}`)
            const errorText = await response.text()
            console.error('Response:', errorText)
            process.exit(1)
        }

        const result = await response.text()
        console.log('✅ Response:', result)
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

sendWebhook()
