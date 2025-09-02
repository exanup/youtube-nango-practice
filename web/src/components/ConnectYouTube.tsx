import { useState } from 'react'
import Nango from '@nangohq/frontend'

export default function ConnectYouTube() {
    const [status, setStatus] = useState<
        'idle' | 'ready' | 'connecting' | 'connected'
    >('idle')

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
                    // Always log the raw event for debugging
                    console.log('[Nango raw event]', event)

                    if (event.type === 'ready') {
                        setStatus('ready')
                        console.log('[Nango] UI ready')
                    }
                    if (event.type === 'connect') {
                        setStatus('connected')
                        console.log(
                            '[Nango] Connected:',
                            event.payload.connectionId,
                        )
                    }
                    if (event.type === 'close' && status !== 'connected') {
                        setStatus('idle')
                        console.log('[Nango] Closed')
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
    )
}
