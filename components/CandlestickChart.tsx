'use client'

import { PERIOD_BUTTONS } from '@/constants'
import React, { useState } from 'react'

const CandlestickChart = ({ children, data, coinId, height = 360, initialPeriod = 'daily' }: CandlestickChartProps) => {
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState(initialPeriod);

    const handlePeriodChange = (newPeriod: Period) => {
        if(newPeriod === period) return;

        setPeriod(newPeriod);

    }
    return (
        <div id='candlestick-chart'>
            <div className='chart-header'>
                <div className="flex-1">
                    {children}
                </div>
                <div className="button-group">
                    <span className='text-sm mx-2 font-medium text-purple-100/50 '>Period:</span>
                    {PERIOD_BUTTONS.map(({ value, label }) => (
                        <button key={value} className={period === value ? 'config-button-active' : 'config-button'} onClick={()=> handlePeriodChange(value)} disabled={loading}>
                            {label}
                        </button>
                    ))}
                    
                </div>
            </div>
        </div>
    )
}

export default CandlestickChart