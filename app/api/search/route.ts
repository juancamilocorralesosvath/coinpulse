import { NextResponse } from 'next/server'
import { searchCoins } from '@/lib/coingecko.actions'

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('query') ?? '';
  const limit = Number(url.searchParams.get('limit') ?? '10');

  if (!query) return NextResponse.json([]);

  try {
    const data = await searchCoins(query, limit);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Search API error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
