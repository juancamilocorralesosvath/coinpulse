import Categories from '@/components/Categories';
import DataTable from '@/components/DataTable'
import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import { CoinOverviewFallback, TrendingCoinsFallback, CategoriesFallback } from '@/components/home/fallback';
import { fetcher } from '@/lib/coingecko.actions';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { Suspense } from 'react'




const Page = async () => {

  return (
    <main className='main-container'>
      <section className='home-grid'>
       <Suspense fallback={<CoinOverviewFallback />}>
         <CoinOverview />
       </Suspense>

       <Suspense fallback={<TrendingCoinsFallback />}>
         <TrendingCoins />
       </Suspense>
       
      </section>
      <section className='w-full mt-7 space-y-4'>
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
        
      </section>
    </main>
  )
}

export default Page