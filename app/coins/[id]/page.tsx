import { fetcher } from '@/lib/coingecko.actions'
import CandlestickChart from '@/components/CandlestickChart'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { notFound } from 'next/navigation'

const CoinPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  try {
    const [coin, coinOHLC] = await Promise.all([
      fetcher<CoinDetailsData>(`/coins/${id}`, { dex_pair_format: 'symbol' }),
      fetcher<OHLCData[]>(`/coins/${id}/ohlc`, { vs_currency: 'usd', days: 1, precision: 'full' }),
    ]);

    return (
      <main id="coin-page">
        <div className="content">
          <div className="mb-6">
            <CandlestickChart data={coinOHLC} coinId={id}>
              <div className="header pt-2">
                <Image
                  src={coin.image.large}
                  alt={coin.name}
                  width={56}
                  height={56}
                />
                <div className="info">
                  <p>{coin.name} / {coin.symbol}</p>
                  <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
                </div>
              </div>
            </CandlestickChart>
          </div>

          <div id="coin-details" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <h5 className="text-sm text-purple-100/50 mb-2">Market Cap</h5>
              <p className="font-medium">{formatCurrency(coin.market_data.market_cap.usd)}</p>
            </div>

            <div className="card">
              <h5 className="text-sm text-purple-100/50 mb-2">Market Cap Rank</h5>
              <p className="font-medium">#{coin.market_cap_rank}</p>
            </div>

            <div className="card">
              <h5 className="text-sm text-purple-100/50 mb-2">Total Volume</h5>
              <p className="font-medium">{formatCurrency(coin.market_data.total_volume.usd)}</p>
            </div>

            <div className="card">
              <h5 className="text-sm text-purple-100/50 mb-2">Website</h5>
              <p className="truncate w-full">
                {coin.links.homepage?.[0] ? (
                  <a href={coin.links.homepage[0]} target="_blank" rel="noreferrer" className="text-purple-100 underline">
                    {coin.links.homepage[0]}
                  </a>
                ) : (
                  '—'
                )}
              </p>
            </div>

            <div className="card">
              <h5 className="text-sm text-purple-100/50 mb-2">Explorer</h5>
              <p className="truncate w-full">
                {coin.links.blockchain_site?.filter(Boolean)[0] ? (
                  <a href={coin.links.blockchain_site.filter(Boolean)[0]} target="_blank" rel="noreferrer" className="text-purple-100 underline">
                    {coin.links.blockchain_site.filter(Boolean)[0]}
                  </a>
                ) : (
                  '—'
                )}
              </p>
            </div>

            <div className="card">
              <h5 className="text-sm text-purple-100/50 mb-2">Community</h5>
              <p>
                {coin.links.subreddit_url ? (
                  <a href={coin.links.subreddit_url} target="_blank" rel="noreferrer" className="text-purple-100 underline">
                    Subreddit
                  </a>
                ) : (
                  '—'
                )}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/coins" className="text-sm text-purple-100/60 hover:underline">← Back to all coins</Link>
          </div>
        </div>
      </main>
    )
  } catch (err) {
    console.error('Coin details fetch error:', err)
    notFound()
  }
}

export default CoinPage
