export async function searchCoins(query: string, limit = 10) {
  if (!query) return [];

  const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  if (!res.ok) {
    throw new Error('Search API error');
  }

  return res.json();
}
