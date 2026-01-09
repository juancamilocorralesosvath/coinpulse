'use client'

import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from '@/constants'
import { fetcher } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import React, { useEffect, useRef, useState, useTransition } from 'react'

const CandlestickChart = ({ children, data, coinId, height = 360, initialPeriod = 'daily' }: CandlestickChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [period, setPeriod] = useState(initialPeriod);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOHLCData = async (selectedPeriod: Period) => {
        const { days } = PERIOD_CONFIG[selectedPeriod];
        try {
            const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
                vs_currency: 'usd',
                days,
                // not available for the demo plan
                //interval: 'hourly',
                precision: 'full'
            });
            return newData ?? [];
        } catch (error) {
            console.error('Error fetching OHLC data:', error);
            return [];
        }
    }

    const handlePeriodChange = async (newPeriod: Period) => {
        if (newPeriod === period) return;

        setLoading(true);
        try {
            const newData = await fetchOHLCData(newPeriod);

            startTransition(() => {
                setPeriod(newPeriod);
                setOhlcData(newData);
            });
        } catch (error) {
            console.error('Error changing period:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const showTime = ['daily', 'weekly', 'monthly'].includes(period);

        const chart = createChart(container, {
            ...getChartConfig(height, showTime),
            width: container.clientWidth,
        });
        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

        const convertedToSeconds = ohlcData.map(
            (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
        );
        series.setData(convertOHLCData(convertedToSeconds));
        chart.timeScale().fitContent();
        chartRef.current = chart;
        candleSeriesRef.current = series;

        const observer = new ResizeObserver((entries) => {
            if(!entries.length) return;
            chart.applyOptions({ width: entries[0].contentRect.width });

        });
        observer.observe(container);

        return () => {
            // destroy the chart instance to prevent memory leaks
            observer.disconnect();
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        };
    }, [height, ohlcData, period]);

    useEffect(() => {
        if (!candleSeriesRef.current) return;

        const convertedToSeconds = ohlcData.map(
            (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
        );

        const converted = convertOHLCData(convertedToSeconds);
        candleSeriesRef.current.setData(converted);
        chartRef.current?.timeScale().fitContent();
    }, [ohlcData, period]);

    return (
        <div id='candlestick-chart'>
            <div className='chart-header'>
                <div className="flex-1">
                    {children}
                </div>
                <div className="button-group">
                    <span className='text-sm mx-2 font-medium text-purple-100/50 '>Period:</span>
                    {PERIOD_BUTTONS.map(({ value, label }) => (
                        <button key={value} className={period === value ? 'config-button-active' : 'config-button'} onClick={() => handlePeriodChange(value)} disabled={loading || isPending}>
                            {label}
                        </button>
                    ))}

                </div>
            </div>
            <div ref={chartContainerRef} className='chart' style={{ height }} />
        </div>
    )
}

export default CandlestickChart