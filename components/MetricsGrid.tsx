
import React from 'react';
import { FinancialMetric } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsGridProps {
  metrics: FinancialMetric[];
  currency: string;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, currency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {metrics.map((metric, idx) => (
        <div 
          key={idx} 
          className={`cyber-panel p-8 rounded-3xl border-beam animate-reveal`}
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">{metric.label}</span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
              metric.trend === 'up' ? 'bg-machina-cyan/10 text-machina-cyan' : 
              metric.trend === 'down' ? 'bg-machina-magenta/10 text-machina-magenta' : 'bg-white/5 text-slate-400'
            }`}>
              {metric.trend === 'up' ? <TrendingUp size={12} /> : 
               metric.trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
              {metric.change}
            </div>
          </div>
          
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-xl font-bold text-machina-cyan/30">{currency}</span>
            <span className="text-4xl font-black tracking-tighter text-white">{metric.value}</span>
          </div>
          
          <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
             <div 
                className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out" 
                style={{ 
                  width: '65%', 
                  backgroundColor: metric.trend === 'up' ? '#2dd4bf' : metric.trend === 'down' ? '#fbbf24' : '#64748b',
                  boxShadow: `0 0 15px ${metric.trend === 'up' ? 'rgba(45, 212, 191, 0.4)' : 'rgba(251, 191, 36, 0.2)'}`
                }}
             ></div>
          </div>
          
          {metric.details && (
            <p className="mt-6 text-[11px] font-medium text-slate-400 leading-relaxed italic opacity-80 border-t border-slate-800 pt-4">
              {metric.details}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
