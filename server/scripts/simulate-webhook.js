require('dotenv').config({ path: 'server/.env' })
const fs = require('fs')
const crypto = require('crypto')
const { execSync } = require('child_process')

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

execSync(
    `curl -X POST ${url} \
    -H "Content-Type: application/json" \
    -H "x-nango-signature: ${sig}" \
    --data-binary @${payloadPath} -v`,
    { stdio: 'inherit' },
)
