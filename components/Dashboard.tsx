
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { AnalysisResult, Language, Theme } from '../types';
import MetricsGrid from './MetricsGrid';
import InsightsPanel from './InsightsPanel';
import { LayoutDashboard, PieChart as PieIcon, TrendingUp, Zap, Hexagon } from 'lucide-react';
import { i18n } from '../i18n';

interface DashboardProps {
  data: AnalysisResult;
  lang: Language;
  theme: Theme;
}

const Dashboard: React.FC<DashboardProps> = ({ data, lang, theme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'comparison'>('overview');
  const t = i18n[lang];
  const isDark = theme === 'dark';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-machina-panel/90 border border-machina-cyan/30 p-5 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <p className="text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em] border-b border-white/5 pb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-10 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: entry.color }}>{entry.name}</span>
              <span className="text-[11px] font-black font-mono text-white">{data.currency}{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-20 animate-in fade-in duration-1000">
      {/* Machina Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-machina-cyan/10 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="px-5 py-2 bg-machina-cyan/10 border border-machina-cyan/30 text-machina-cyan text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_10px_rgba(0,242,255,0.1)]">{t.focus}</span>
            <div className="h-[1px] w-20 bg-white/10"></div>
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{data.currency} // SYNC_TIME: {new Date().toLocaleTimeString()}</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.8] text-white">
            DATA<br/><span className="text-machina-cyan">MATRIX.</span>
          </h1>
          <p className="text-gray-400 text-2xl leading-tight font-medium max-w-2xl">{data.summary}</p>
        </div>
        
        <div className="cyber-panel px-10 py-10 rounded-sm flex items-center gap-12 min-w-[300px] group hover:border-machina-cyan transition-all">
          <div className="relative">
            <Hexagon size={80} className="text-machina-cyan/20 group-hover:text-machina-cyan/40 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-black text-white">{10 - data.riskRating}</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{t.riskScore}</div>
            <div className="text-[11px] font-mono text-machina-cyan uppercase tracking-widest">
                {data.riskRating < 3 ? 'STABLE_NODE' : data.riskRating < 6 ? 'MODERATE_FLUX' : 'CRITICAL_BURN'}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <MetricsGrid metrics={data.metrics} currency={data.currency} />

      {/* Interactive Tabs HUD */}
      <div className="flex items-center gap-4 p-2 bg-white/5 w-fit border border-white/10 mb-12">
        {[
          { id: 'overview', label: t.overview, icon: LayoutDashboard },
          { id: 'breakdown', label: t.expenses, icon: PieIcon },
          { id: 'comparison', label: t.growth, icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 text-[11px] font-black transition-all tracking-widest uppercase ${
              activeTab === tab.id 
                ? 'bg-machina-cyan text-black shadow-[0_0_20px_rgba(0,242,255,0.4)]' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Feature Area */}
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 cyber-panel p-16 rounded-sm min-h-[600px] flex flex-col justify-center">
          {activeTab === 'overview' && (
            <div className="h-[500px] animate-in zoom-in-95 duration-700">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#666', fontWeight: 700}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#666', fontWeight: 700}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="REVENUE" 
                    stroke="#00f2ff" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={2000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    name="EXPENSES" 
                    stroke="#ff00ff" 
                    strokeWidth={2} 
                    strokeDasharray="10 5" 
                    fill="transparent" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="h-[500px] animate-in zoom-in-95 duration-700 flex flex-col md:flex-row items-center gap-20">
               <div className="flex-1 h-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={120}
                        outerRadius={180}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="#050505"
                        strokeWidth={5}
                      >
                        {data.expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#00f2ff'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="w-full md:w-96 space-y-4">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10">ALLOCATION_TABLE</div>
                  {data.expenseBreakdown.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 hover:border-machina-cyan/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rotate-45" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">{cat.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-machina-cyan">{data.currency}{cat.value.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="h-[500px] animate-in zoom-in-95 duration-700">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.comparisonData} barGap={15}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#666', fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#666', fontWeight: 700}} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.01)'}} content={<CustomTooltip />} />
                    <Bar dataKey="previous" name="PREV_VAL" fill="#1a1a1a" radius={[2, 2, 0, 0]} animationDuration={1500} />
                    <Bar dataKey="current" name="CURR_VAL" fill="#00f2ff" radius={[2, 2, 0, 0]} animationDuration={2000} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <InsightsPanel insights={data.insights} lang={lang} />

      <div className="mt-32 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-6">
            <span className="text-[11px] font-black tracking-[0.5em] text-gray-600 uppercase">{t.poweredBy} Z-FIN HUB CORE v4</span>
            <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-machina-cyan"></div>
                <div className="w-1.5 h-1.5 bg-machina-magenta"></div>
                <div className="w-1.5 h-1.5 bg-machina-purple"></div>
            </div>
        </div>
        <span className="text-[11px] font-black tracking-[0.5em] text-gray-600 uppercase">{t.confidential}</span>
      </div>
    </div>
  );
};

export default Dashboard;
