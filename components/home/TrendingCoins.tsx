import React from 'react'
import { fetcher } from '@/lib/coingecko.actions';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import DataTable from '@/components/DataTable'
import { TrendingCoinsFallback } from './fallback'


const TrendingCoins = async () => {

    let trendingCoins;

    try {
        trendingCoins = await fetcher<{ coins: TrendingCoin[] }>('search/trending', undefined, 300);
     } catch (err) {
        console.error('TrendingCoins fetch error:', err)
        return <TrendingCoinsFallback />
    }

        const columns: DataTableColumn<TrendingCoin>[] = [
            {
                header: 'Name',
                cellClassName: 'name-cell',
                cell: (coin) => {
                    const item = coin.item;

                    return (
                        <Link href={`/coins/${item.id}`} className="flex items-center gap-3">
                            <Image
                                src={item.large}
                                alt={item.name}
                                width={36}
                                height={36}
                            />
                            <p>{item.name}</p>

                        </Link>
                    )
                }
            },
            {
                header: '24h Change',
                cellClassName: 'name-cell',
                cell: (coin) => {
                    const item = coin.item;
                    const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

                    return (
                        <div className={cn('price-change', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
                            <p>
                                {isTrendingUp ? (
                                    <TrendingUp width={16} height={16} />
                                ) : (<TrendingDown width={16} height={16} />)}
                                {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
                            </p>
                        </div>
                    )
                }
            },
            {
                header: 'Price',
                cellClassName: 'price-cell',
                cell: (coin) => coin.item.data.price
            }
        ];
   

    const trendingData: TrendingCoin[] = [
        {
            item: {
                id: 'bitcoin',
                name: 'Bitcoin',
                symbol: 'btc',
                market_cap_rank: 1,
                thumb: '/favicon.ico',
                large: '/logo.svg',
                data: {
                    price: 89113,
                    price_change_percentage_24h: { usd: 2.3 }
                }
            }
        },
        {
            item: {
                id: 'ethereum',
                name: 'Ethereum',
                symbol: 'eth',
                market_cap_rank: 2,
                thumb: '/favicon.ico',
                large: '/logo.svg',
                data: {
                    price: 6113,
                    price_change_percentage_24h: { usd: -1.2 }
                }
            }
        },
        {
            item: {
                id: 'solana',
                name: 'Solana',
                symbol: 'sol',
                market_cap_rank: 10,
                thumb: '/favicon.ico',
                large: '/logo.svg',
                data: {
                    price: 120,
                    price_change_percentage_24h: { usd: 5.6 }
                }
            }
        }
    ];

    return (
        <div id='trending-coins'>
            <h4>Trending Coins</h4>
            <DataTable
                columns={columns}
                data={trendingCoins.coins.slice(0, 6) || []}
                rowKey={(row) => row.item.id}
                tableClassName="trending-coins-table"
                headerCellClassName="py-3! "
                bodyCellClassName="py-2! "
            />
        </div>
    )

}

export default TrendingCoins