import { useEffect, useState } from 'react'

import type {
    ChannelSubscription,
    YouTubeSubscriptionApi,
} from '../types/youtube'
import { mapApiToSubscription } from '../types/youtube'

export default function Subscriptions({
    connectionId,
}: {
    connectionId: string
}) {
    const [subs, setSubs] = useState<ChannelSubscription[]>([])
    const [loading, setLoading] = useState(true)
    const [nextPageToken, setNextPageToken] = useState<string | null>(null)
    const [prevPageToken, setPrevPageToken] = useState<string | null>(null)
    const [currentPageToken, setCurrentPageToken] = useState<
        string | undefined
    >(undefined)

    useEffect(() => {
        async function fetchSubs() {
            setLoading(true)
            try {
                const res = await fetch(
                    `http://localhost:4000/youtube/subscriptions?connectionId=${connectionId}${
                        currentPageToken ? `&pageToken=${currentPageToken}` : ''
                    }`,
                )
                const data = await res.json()
                const mapped: ChannelSubscription[] =
                    data.items?.map((item: YouTubeSubscriptionApi) =>
                        mapApiToSubscription(item),
                    ) ?? []
                setSubs(mapped)
                setNextPageToken(data.nextPageToken ?? null)
                setPrevPageToken(data.prevPageToken ?? null)
            } catch (err) {
                console.error('Failed to load subscriptions:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchSubs()
    }, [connectionId, currentPageToken])

    if (loading) return <p>Loading subscriptions…</p>
    if (subs.length === 0) return <p>No subscriptions found.</p>

    return (
        <div className="mt-4">
            <ul className="space-y-2">
                {subs.map((sub) => (
                    <li
                        key={sub.subscriptionId}
                        className="flex items-center space-x-3"
                    >
                        <img
                            src={sub.thumbnailUrl ?? ''}
                            alt={sub.title}
                            className="h-8 w-8 rounded-full"
                        />
                        <span>{sub.title}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-4 flex space-x-2">
                {prevPageToken && (
                    <button
                        onClick={() => setCurrentPageToken(prevPageToken)}
                        className="rounded bg-gray-200 px-3 py-1"
                    >
                        Previous
                    </button>
                )}
                {nextPageToken && (
                    <button
                        onClick={() => setCurrentPageToken(nextPageToken)}
                        className="rounded bg-gray-200 px-3 py-1"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}
