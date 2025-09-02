export interface YouTubeSubscriptionApi {
    id: string
    snippet: {
        title: string
        resourceId?: { channelId?: string }
        thumbnails?: { default?: { url?: string } }
    }
}

export interface ChannelSubscription {
    subscriptionId: string
    channelId: string
    title: string
    thumbnailUrl?: string
}

export function mapApiToSubscription(
    item: YouTubeSubscriptionApi,
): ChannelSubscription {
    return {
        subscriptionId: item.id,
        channelId: item.snippet.resourceId?.channelId ?? '',
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails?.default?.url,
    }
}
