'use server'
import qs from 'query-string'

const BASE_URL = process.env.COINGECKO_BASE_URL
const API_KEY = process.env.COINGECKO_API_KEY

if(!BASE_URL) throw new Error('COINGECKO_BASE_URL is not defined in environment variables')
if(!API_KEY) throw new Error('COINGECKO_API_KEY is not defined in environment variables')

export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60,
): Promise<T> {
    const url = qs.stringifyUrl({
        url: `${BASE_URL}/${endpoint}`,
        query: params
    }, {skipEmptyString: true, skipNull: true})

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
'x-cg-api-key': API_KEY,
        } as Record<string, string>,
        next: { revalidate },
    })

    if (!response.ok) {
        let message = ''

        try {
            const errorBody: CoinGeckoErrorBody = await response.json()
            const apiMessage =
                errorBody.error ||
                (errorBody.status && typeof errorBody.status === 'object'
                    ? (errorBody.status as { error_message?: string }).error_message
                    : undefined)

            if (apiMessage) {
                message = ` - ${apiMessage}`
            } else if (Object.keys(errorBody).length > 0) {
                message = ` - ${JSON.stringify(errorBody)}`
            }
        } catch {
            // response body might not be JSON; try to read as text
            try {
                const text = await response.text()
                if (text) message = ` - ${text}`
            } catch {
                // ignore
            }
        }

        throw new Error(`API error: ${response.status}: ${response.statusText}${message}`)
    }

    return await response.json()
}
