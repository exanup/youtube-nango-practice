import { useEffect, useState } from 'react'

type Subscription = {
    id: string
    title: string
    thumbnailUrl: string
}

export default function Subscriptions({
    connectionId,
}: {
    connectionId: string
}) {
    const [subs, setSubs] = useState<Subscription[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSubs() {
            try {
                const res = await fetch(
                    `http://localhost:4000/youtube/subscriptions?connectionId=${connectionId}`,
                )
                const data = await res.json()
                const mapped: Subscription[] =
                    data.items?.map((item: any) => ({
                        id: item.id,
                        title: item.snippet.title,
                        thumbnailUrl: item.snippet.thumbnails?.default?.url,
                    })) ?? []
                setSubs(mapped)
            } catch (err) {
                console.error('Failed to load subscriptions:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchSubs()
    }, [connectionId])

    if (loading) return <p>Loading subscriptions…</p>
    if (subs.length === 0) return <p>No subscriptions found.</p>

    return (
        <ul className="mt-4 space-y-2">
            {subs.map((sub) => (
                <li key={sub.id} className="flex items-center space-x-3">
                    <img
                        src={sub.thumbnailUrl}
                        alt={sub.title}
                        className="h-8 w-8 rounded-full"
                    />
                    <span>{sub.title}</span>
                </li>
            ))}
        </ul>
    )
}
