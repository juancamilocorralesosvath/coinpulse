import { NextResponse } from 'next/server'
import { fetcher } from '@/lib/coingecko.actions'

export async function GET() {
  try {
    const data = await fetcher<{ coins: TrendingCoin[] }>('search/trending');
    return NextResponse.json(data);
  } catch (err) {
    console.error('Trending API error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
