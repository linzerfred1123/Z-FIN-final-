
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
    <div className="cyber-panel rounded-sm overflow-hidden mt-12">
      <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{t.strategyBoard}</h3>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{t.cfoRec}</p>
        </div>
        <div className="w-12 h-12 bg-machina-cyan/10 border border-machina-cyan/30 flex items-center justify-center text-machina-cyan">
           <ShieldCheck size={24} />
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {insights.map((insight, idx) => (
          <div key={idx} className="p-10 hover:bg-white/[0.01] transition-colors relative group">
            <div className="flex items-start gap-10">
              <div className={`mt-2 w-3 h-3 rotate-45 shrink-0 shadow-[0_0_15px] ${
                insight.severity === 'high' ? 'bg-machina-magenta shadow-machina-magenta/50' : 
                insight.severity === 'medium' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-machina-cyan shadow-machina-cyan/50'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-machina-cyan/60">{insight.category}</span>
                  <div className="flex-1 h-[1px] bg-white/5"></div>
                  <h4 className="font-black text-2xl uppercase tracking-tight text-white">{insight.title}</h4>
                </div>
                <p className="text-gray-400 mb-10 leading-relaxed font-medium text-lg max-w-4xl">{insight.description}</p>
                <div className="bg-machina-cyan/5 border-l-4 border-machina-cyan p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={16} className="text-machina-cyan" />
                    <span className="text-[10px] font-black text-machina-cyan uppercase tracking-[0.2em]">{t.recommendation}</span>
                  </div>
                  <p className="text-lg text-white font-bold leading-relaxed">{insight.recommendation}</p>
                </div>
              </div>
            </div>
            {/* Holographic detail */}
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
               <span className="text-[40px] font-black text-white/5">0{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
