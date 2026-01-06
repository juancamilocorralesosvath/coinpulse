import React from 'react'
import DataTable from '@/components/DataTable'

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image" />
        <div className="info">
          <div className="header-title-skeleton" />
          <div className="value-skeleton-lg" />
        </div>
      </div>

      <div className="controls">
        <div className="periods">
          <div className="period-button-skeleton" />
          <div className="period-button-skeleton" />
          <div className="period-button-skeleton" />
        </div>
      </div>

      <div className="chart">
        <div className="chart-skeleton" />
      </div>
    </div>
  )
}

const SkeletonName = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div className="header-image" style={{ width: 36, height: 36 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="header-title-skeleton" style={{ width: 120 }} />
    </div>
  </div>
)

export const TrendingCoinsFallback = () => {
  const columns = [
    {
      header: 'Name',
      cellClassName: 'name-cell',
      cell: () => <SkeletonName />,
    },
    {
      header: '24h Change',
      cellClassName: 'name-cell',
      cell: () => <div className="value-skeleton-sm" />,
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: () => <div className="value-skeleton-md" />,
    },
  ]

  const data = new Array(6).fill(null).map((_, i) => ({ id: `fallback-${i}` }))

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        columns={columns as any}
        data={data as any}
        rowKey={(row: any, idx: number) => row.id ?? idx}
        tableClassName="trending-coins-table"
      />
    </div>
  )
}

export default null
