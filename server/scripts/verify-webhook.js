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

console.log('Payload length:', JSON.stringify(payload).length, 'chars')
console.log('Expected signature:', sig)
