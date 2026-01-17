
import React from 'react';
import { ExpertInsight, Language } from '../types';
import { i18n } from '../i18n';
import { ShieldCheck, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface InsightsPanelProps {
  insights: ExpertInsight[];
  lang: Language;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights, lang }) => {
  const t = i18n[lang];

  return (
    <div className="cyber-panel rounded-[2.5rem] overflow-hidden mt-12">
      <div className="px-10 py-10 border-b border-white/5 flex items-center justify-between bg-slate-900/20">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{t.strategyBoard}</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t.cfoRec}</p>
        </div>
        <div className="w-14 h-14 bg-machina-cyan/5 border border-machina-cyan/20 rounded-2xl flex items-center justify-center text-machina-cyan">
           <ShieldCheck size={28} />
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {insights.map((insight, idx) => (
          <div key={idx} className="p-12 hover:bg-white/[0.01] transition-colors relative group">
            <div className="flex items-start gap-12">
              <div className={`mt-2 w-3 h-3 shrink-0 rounded-sm rotate-45 ${
                insight.severity === 'high' ? 'bg-machina-magenta' : 
                insight.severity === 'medium' ? 'bg-machina-cyan' : 'bg-machina-purple'
              }`} style={{ boxShadow: `0 0 15px currentColor` }}></div>
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-machina-cyan/50">{insight.category}</span>
                  <div className="flex-1 h-px bg-slate-800"></div>
                  <h4 className="font-black text-2xl uppercase tracking-tight text-white">{insight.title}</h4>
                </div>
                <p className="text-slate-400 mb-10 leading-relaxed font-medium text-lg max-w-5xl">{insight.description}</p>
                <div className="bg-slate-900/40 border border-machina-cyan/10 p-8 rounded-3xl group-hover:border-machina-cyan/30 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={18} className="text-machina-cyan" />
                    <span className="text-[10px] font-black text-machina-cyan uppercase tracking-[0.3em]">{t.recommendation}</span>
                  </div>
                  <p className="text-xl text-white font-bold leading-relaxed">{insight.recommendation}</p>
                </div>
              </div>
            </div>
            {/* Index Display */}
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
               <span className="text-7xl font-black text-white">0{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
