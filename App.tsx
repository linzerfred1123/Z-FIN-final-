
import React, { useState, useEffect } from 'react';
import { AnalysisResult, AppState, Language, Theme } from './types';
import { analyzeFinancialData } from './services/geminiService';
import Dashboard from './components/Dashboard';
import * as pdfjsLib from 'pdfjs-dist';
import { i18n } from './i18n';
import { Sun, Moon, Zap, Cpu, Upload, FileText, ImageIcon, Loader2, ArrowRight, Activity, Terminal } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('dark');
  const [progress, setProgress] = useState<number>(0);

  const t = i18n[lang];

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(' ') + '\n';
      setProgress(Math.round((i / pdf.numPages) * 100));
    }
    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setAppState('analyzing');
    setError(null);
    setProgress(0);

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const extractedText = await extractTextFromPDF(arrayBuffer);
        const analysis = await analyzeFinancialData(extractedText, false, lang);
        setResult(analysis);
        setAppState('completed');
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = (reader.result as string).split(',')[1];
            const analysis = await analyzeFinancialData(base64, true, lang);
            setResult(analysis);
            setAppState('completed');
          } catch (err: any) {
            setError(err.message || 'Error.');
            setAppState('error');
          }
        };
        reader.readAsDataURL(file);
      } else {
        const text = await file.text();
        const analysis = await analyzeFinancialData(text, false, lang);
        setResult(analysis);
        setAppState('completed');
      }
    } catch (err: any) {
      setError(err.message || 'Error during analysis.');
      setAppState('error');
    }
  };

  const reset = () => {
    setAppState('idle');
    setResult(null);
    setError(null);
    setFileName('');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500`}>
      {/* Nav */}
      <nav className="h-20 border-b border-machina-cyan/20 cyber-panel flex items-center px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={reset}>
            <div className="w-10 h-10 bg-machina-bg border-2 border-machina-cyan flex items-center justify-center text-machina-cyan font-black group-hover:shadow-[0_0_15px_#00f2ff] transition-all">
              <Zap size={20} className="neon-glow-cyan" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-[0.1em] text-machina-cyan leading-none">Z-FIN</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Protocol v4.0.2</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-sm border border-white/10">
                {(['zh', 'en', 'ja', 'de'] as Language[]).map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-4 py-1.5 rounded-sm text-[9px] font-black transition-all ${lang === l ? 'bg-machina-cyan text-black' : 'text-gray-500 hover:text-white'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
             </div>

             <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 bg-white/5 border border-white/10 text-machina-cyan hover:bg-machina-cyan/10 transition-all rounded-sm"
             >
               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             {appState === 'completed' && (
                <button 
                  onClick={reset}
                  className="px-6 py-3 bg-machina-cyan text-black text-[11px] font-black rounded-sm hover:bg-white transition-all flex items-center gap-2 uppercase tracking-widest shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                >
                  {t.newAnalysis} <ArrowRight size={14} />
                </button>
             )}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {appState === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-machina-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
             
             <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 z-10">
               <div className="inline-flex items-center gap-2 px-6 py-2 bg-machina-cyan/10 text-machina-cyan text-[11px] font-black tracking-[0.3em] uppercase mb-12 border border-machina-cyan/30 rounded-full">
                 <Activity size={14} /> Core Engine Synced
               </div>
               <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter mb-8 leading-[0.8] text-white">
                 Z-FIN<span className="text-machina-cyan">.</span>
               </h1>
               <p className="text-xl md:text-3xl text-gray-400 max-w-3xl mx-auto mb-20 leading-tight font-medium">
                 {t.subtitle}<br/>
                 <span className="text-sm uppercase tracking-[0.5em] text-gray-600">{t.uploadDesc}</span>
               </p>

               <div className="max-w-xl mx-auto w-full">
                 <label className="group relative block cursor-pointer cyber-panel p-20 rounded-sm hover:border-machina-cyan transition-all hover:scale-[1.01] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <input type="file" className="hidden" accept=".pdf,.csv,.png,.jpg,.jpeg" onChange={handleFileUpload} />
                    <div className="scanline"></div>
                    <div className="flex flex-col items-center">
                       <div className="w-24 h-24 bg-machina-cyan/5 border border-machina-cyan/20 text-machina-cyan flex items-center justify-center mb-8 group-hover:scale-110 transition-all group-hover:border-machina-cyan group-hover:shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                          <Cpu size={40} className="tech-pulse" />
                       </div>
                       <span className="text-xl font-black uppercase tracking-widest text-white group-hover:text-machina-cyan transition-colors">{t.dropZone}</span>
                       <div className="flex items-center gap-8 mt-10">
                          <div className="flex items-center gap-2 opacity-60 text-[10px] font-black uppercase tracking-[0.2em]"><FileText size={14} className="text-machina-cyan" /> PROTOCOL PDF</div>
                          <div className="flex items-center gap-2 opacity-60 text-[10px] font-black uppercase tracking-[0.2em]"><ImageIcon size={14} className="text-machina-magenta" /> VISION JPG</div>
                       </div>
                    </div>
                 </label>
               </div>
             </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-machina-bg">
             <div className="w-full max-w-2xl relative">
                {/* Complex Machina Loading UI */}
                <div className="flex items-center justify-center mb-20">
                    <div className="relative w-64 h-64">
                        {/* Outer rotating ring */}
                        <div className="absolute inset-0 border-[3px] border-machina-cyan/20 rounded-full animate-[spin_8s_linear_infinite]"></div>
                        <div className="absolute inset-2 border border-machina-magenta/20 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
                        <div className="absolute inset-[-10px] border-[2px] border-machina-cyan border-t-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
                        
                        {/* Center Hub */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-40 h-40 bg-machina-cyan/10 rounded-full blur-2xl animate-pulse"></div>
                            <Terminal size={48} className="text-machina-cyan tech-pulse" />
                        </div>
                    </div>
                </div>

                <div className="space-y-8 text-center">
                   <h3 className="text-4xl font-black tracking-tighter text-white uppercase italic">{t.analyzing}</h3>
                   <div className="flex flex-col items-center gap-6">
                      <div className="flex items-center gap-4 px-6 py-3 bg-machina-cyan/5 border border-machina-cyan/20 rounded-sm text-[11px] font-black uppercase text-machina-cyan tracking-[0.3em] shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                        <Loader2 className="animate-spin" size={16} /> Matrix Decryption Active
                      </div>
                      
                      {/* Terminal-like progress */}
                      <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden max-w-md mx-auto">
                        <div className="h-full bg-machina-cyan shadow-[0_0_10px_#00f2ff] transition-all duration-300" style={{ width: `${Math.max(progress, 15)}%` }}></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2"><span className="w-1 h-1 bg-machina-cyan"></span> SYNCING_STREAMS</div>
                        <div className="flex items-center gap-2"><span className="w-1 h-1 bg-machina-magenta"></span> OPTIMIZING_MODEL</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {appState === 'completed' && result && (
          <Dashboard data={result} lang={lang} theme={theme} />
        )}

        {appState === 'error' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="cyber-panel p-16 rounded-sm max-w-lg w-full text-center">
              <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 mx-auto mb-10 text-4xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                !
              </div>
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-white">{t.error}</h3>
              <div className="p-4 bg-red-500/5 border border-red-500/10 mb-12">
                 <p className="text-gray-400 font-mono text-xs">{error}</p>
              </div>
              <button 
                onClick={reset}
                className="w-full bg-white text-black font-black py-5 rounded-sm hover:bg-machina-cyan transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                {t.tryAgain}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-20 bg-machina-bg border-t border-white/5 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
          <div className="flex items-center gap-4">
             <span className="text-machina-cyan">CORE ENGINE: GEMINI_V3</span>
             <span className="w-1 h-1 bg-gray-800"></span>
             <span>PROTOCOL: QUANTUM_SECURE</span>
          </div>
          <div>© Z-FIN // {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
