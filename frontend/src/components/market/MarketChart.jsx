import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const MarketChart = ({ data, title, color = "#10b981" }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.4)" 
            fontSize={12} 
            tickMargin={10}
            tickFormatter={(tick) => {
                // If it's a date string, format it shortly
                try {
                    const date = new Date(tick);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                } catch (e) {}
                return tick;
            }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.4)" 
            fontSize={12} 
            tickFormatter={(value) => `₹${value}`}
            domain={['auto', 'auto']}
            width={60}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value) => [`₹${value}`, 'Price']}
            labelFormatter={(label) => {
                 try {
                    const date = new Date(label);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    }
                } catch (e) {}
                return label;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;
