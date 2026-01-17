
import React from 'react';
import { FinancialMetric } from '../types';

interface MetricsGridProps {
  metrics: FinancialMetric[];
  currency: string;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, currency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {metrics.map((metric, idx) => (
        <div key={idx} className="cyber-panel p-6 rounded-sm transition-all hover:border-machina-cyan group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{metric.label}</span>
            <span className={`px-2 py-0.5 text-[9px] font-black border tracking-widest ${
              metric.trend === 'up' ? 'border-machina-cyan/30 text-machina-cyan' : 
              metric.trend === 'down' ? 'border-machina-magenta/30 text-machina-magenta' : 'border-gray-500/30 text-gray-500'
            }`}>
              {metric.change}
            </span>
          </div>
          <div className="text-3xl font-black mb-6 text-white group-hover:text-machina-cyan transition-colors">{currency}{metric.value}</div>
          
          <div className="mt-4 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000" 
              style={{ 
                width: '70%', 
                backgroundColor: metric.color || '#00f2ff',
                boxShadow: `0 0 10px ${metric.color || '#00f2ff'}`
              }}
            ></div>
          </div>
          {metric.details && <p className="mt-4 text-[10px] font-mono text-gray-500 opacity-60 leading-tight">{metric.details}</p>}
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
