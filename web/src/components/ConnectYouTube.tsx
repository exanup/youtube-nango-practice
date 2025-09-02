import { useState } from 'react'
import Nango from '@nangohq/frontend'
import Subscriptions from './Subscriptions'

export default function ConnectYouTube() {
    const [status, setStatus] = useState<
        'idle' | 'ready' | 'connecting' | 'connected'
    >('idle')
    const [connectionId, setConnectionId] = useState<string | null>(null)

    async function connect() {
        setStatus('connecting')

        try {
            const r = await fetch('http://localhost:4000/nango/session', {
                method: 'POST',
            })
            const { sessionToken } = await r.json()

            const nango = new Nango()
            const connect = nango.openConnectUI({
                onEvent: (event) => {
                    console.log('[Nango raw event]', event as any)

                    if (event.type === 'ready') {
                        setStatus('ready')
                    }
                    if (event.type === 'connect') {
                        setStatus('connected')
                        setConnectionId(event.payload.connectionId)
                    }
                    if (event.type === 'close' && status !== 'connected') {
                        setStatus('idle')
                    }
                },
            })

            connect.setSessionToken(sessionToken)
        } catch (e) {
            setStatus('idle')
            console.error('[Nango] Connect flow failed:', e)
        }
    }

    return (
        <div>
            <button
                onClick={connect}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
                disabled={status === 'connecting'}
            >
                {status === 'connected'
                    ? 'Connected!'
                    : status === 'connecting'
                      ? 'Connecting…'
                      : 'Connect YouTube'}
            </button>

            {connectionId && <Subscriptions connectionId={connectionId} />}
        </div>
    )
}
