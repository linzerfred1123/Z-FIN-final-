
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { AnalysisResult, Language, Theme } from '../types';
import MetricsGrid from './MetricsGrid';
import InsightsPanel from './InsightsPanel';
import { LayoutDashboard, PieChart as PieIcon, TrendingUp, Hexagon, ShieldAlert, X, Info } from 'lucide-react';
import { i18n } from '../i18n';

interface DashboardProps {
  data: AnalysisResult;
  lang: Language;
  theme: Theme;
}

const PIE_COLORS = [
  '#2dd4bf', '#10b981', '#fbbf24', '#06b6d4', '#84cc16', '#a855f7', '#f59e0b', '#ec4899', '#3b82f6'
];

const Dashboard: React.FC<DashboardProps> = ({ data, lang, theme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'comparison'>('overview');
  const [showRiskDetail, setShowRiskDetail] = useState(false);
  const t = i18n[lang];

  // Helper to ensure pie chart is a full ring even with small values
  const totalExpense = data.expenseBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div id="dashboard-report" className="max-w-[1500px] mx-auto px-6 py-12 md:py-16 relative">
      {/* Risk Detail Modal */}
      {showRiskDetail && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-reveal">
          <div className="cyber-panel p-10 max-w-2xl w-full rounded-[3rem] border-machina-magenta/30 relative shadow-[0_0_100px_rgba(251,191,36,0.1)]">
            <button 
              onClick={() => setShowRiskDetail(false)}
              className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors hover:rotate-90 duration-300"
            >
              <X size={28} />
            </button>
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 bg-machina-magenta/10 rounded-2xl flex items-center justify-center text-machina-magenta border border-machina-magenta/20">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">RISK_PROTOCOL_ANALYSIS</h2>
                <p className="text-[10px] font-mono font-bold text-machina-magenta tracking-[0.4em] mt-1 uppercase">Confidence Level: High-Resolution</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5">
                <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
                  "{data.riskReason || "No detailed risk audit available for this cycle."}"
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-6 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">SCORE</span>
                    <span className="text-3xl font-black text-white">{data.riskRating} / 10</span>
                 </div>
                 <div className="bg-white/5 p-6 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">STATUS</span>
                    <span className="text-xl font-black text-machina-magenta uppercase tracking-tighter">
                      {data.riskRating > 7 ? 'CRITICAL_EXPOSURE' : data.riskRating > 4 ? 'VIGILANCE_REQUIRED' : 'SYSTEM_STABLE'}
                    </span>
                 </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 text-center">
               <button 
                onClick={() => setShowRiskDetail(false)}
                className="px-12 py-4 bg-machina-magenta text-black font-black text-[11px] rounded-xl uppercase tracking-[0.3em] hover:scale-105 transition-transform shadow-lg shadow-machina-magenta/20"
               >
                 Acknowledge & Close
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 cyber-panel p-12 md:p-16 rounded-[3rem] relative overflow-hidden flex flex-col justify-center animate-reveal">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-machina-cyan/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-machina-cyan rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-machina-green rounded-full opacity-50"></div>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] font-mono">FIN_PROTOCOL: SYNCED</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] text-white">
            ULTIMATE<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-machina-cyan to-machina-green">REPORT.</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl leading-relaxed max-w-2xl font-medium border-l-2 border-machina-cyan/20 pl-8">
            {data.summary}
          </p>
        </div>

        {/* Updated Risk Card - Interactive */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div 
            onClick={() => setShowRiskDetail(true)}
            className="flex-1 cyber-panel p-12 rounded-[3rem] flex flex-col justify-between animate-reveal stagger-1 cursor-pointer group hover:border-machina-magenta/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono group-hover:text-machina-magenta transition-colors">RISK_COEFFICIENT</div>
                <div className="text-7xl font-black text-white">{data.riskRating}</div>
                <div className="mt-4 text-[11px] font-bold text-machina-magenta uppercase tracking-[0.2em] px-4 py-1.5 bg-machina-magenta/10 rounded-full inline-block border border-machina-magenta/20">
                  {data.riskRating > 7 ? 'CRITICAL' : data.riskRating > 4 ? 'MODERATE' : 'STABLE'}
                </div>
              </div>
              <div className="bg-machina-magenta/10 p-3 rounded-xl text-machina-magenta border border-machina-magenta/10 group-hover:animate-pulse">
                <Info size={20} />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-8">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.15em] group-hover:text-slate-300 transition-colors">Tap to view logic summary</p>
              <div className="relative w-16 h-16">
                 <Hexagon size={64} className="text-machina-magenta opacity-10 absolute inset-0 animate-pulse" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldAlert size={28} className="text-machina-magenta opacity-80" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MetricsGrid metrics={data.metrics} currency={data.currency} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 flex lg:flex-col gap-5 animate-reveal stagger-2 no-print">
          {[
            { id: 'overview', label: t.overview, icon: LayoutDashboard },
            { id: 'breakdown', label: t.expenses, icon: PieIcon },
            { id: 'comparison', label: t.growth, icon: TrendingUp }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-6 p-8 rounded-[2rem] transition-all duration-500 text-left w-full border ${activeTab === tab.id ? 'bg-machina-cyan text-slate-900 border-machina-cyan shadow-xl shadow-machina-cyan/20' : 'bg-machina-panel border-white/5 text-slate-500 hover:border-white/10'}`}
            >
              <tab.icon size={28} />
              <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-9 cyber-panel p-10 md:p-16 rounded-[3rem] min-h-[600px] animate-reveal stagger-3 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.25}/><stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#475569', fontWeight: 700, fontFamily: 'JetBrains Mono'}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#475569', fontWeight: 700, fontFamily: 'JetBrains Mono'}} />
                  <Tooltip contentStyle={{backgroundColor: '#070a0f', borderColor: 'rgba(45, 212, 191, 0.2)', borderRadius: '12px'}} />
                  <Area type="monotone" dataKey="revenue" name="REVENUE" stroke="#2dd4bf" strokeWidth={4} fill="url(#colorRev)" animationDuration={1500} />
                  <Area type="monotone" dataKey="profit" name="PROFIT" stroke="#10b981" strokeWidth={3} fill="url(#colorProf)" strokeDasharray="5 5" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="h-[450px] flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={data.expenseBreakdown} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={110} 
                        outerRadius={160} 
                        paddingAngle={4} 
                        dataKey="value" 
                        stroke="#070a0f" 
                        strokeWidth={4}
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {data.expenseBreakdown.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={PIE_COLORS[index % PIE_COLORS.length]} 
                            className="hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Total Value Centered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Total Burn</span>
                     <span className="text-2xl font-black text-white tracking-tighter">{data.currency}{totalExpense.toLocaleString()}</span>
                  </div>
               </div>
               <div className="w-full md:w-80 space-y-3">
                  <div className="mb-4 pb-2 border-b border-white/5">
                     <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Resource allocation</span>
                  </div>
                  {data.expenseBreakdown.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                        <span className="text-[11px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">{cat.name}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-machina-cyan">{data.currency}{cat.value.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="h-[450px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.comparisonData} barGap={12}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#475569', fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#475569'}} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                    <Bar dataKey="previous" name="BASELINE" fill="#1e293b" radius={[6, 6, 0, 0]} animationDuration={1000} />
                    <Bar dataKey="current" name="TARGET" fill="#2dd4bf" radius={[6, 6, 0, 0]} animationDuration={1500} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      <InsightsPanel insights={data.insights} lang={lang} />
    </div>
  );
};

export default Dashboard;
