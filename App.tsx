
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult, AppState, Language, Theme } from './types';
import { analyzeFinancialData } from './services/geminiService';
import Dashboard from './components/Dashboard';
import * as pdfjsLib from 'pdfjs-dist';
import { i18n } from './i18n';
import { Sun, Moon, Cpu, FileText, ImageIcon, Loader2, ArrowRight, Terminal, Layers, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('dark');
  const [progress, setProgress] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = i18n[lang];

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Matrix Rain Logic for Analyzing state
  useEffect(() => {
    if (appState !== 'analyzing' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);
    const chars = "01$¥€₿%#&*@XYZABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const draw = () => {
      ctx.fillStyle = "rgba(1, 4, 9, 0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#2dd4bf";
      ctx.font = `${fontSize}px 'JetBrains Mono'`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [appState]);

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
          const base64 = (reader.result as string).split(',')[1];
          const analysis = await analyzeFinancialData(base64, true, lang);
          setResult(analysis);
          setAppState('completed');
        };
        reader.readAsDataURL(file);
      } else {
        const text = await file.text();
        const analysis = await analyzeFinancialData(text, false, lang);
        setResult(analysis);
        setAppState('completed');
      }
    } catch (err: any) {
      setError(err.message || 'Fatal Protocol Breach.');
      setAppState('error');
    }
  };

  const exportToPDF = async () => {
    const element = document.getElementById('dashboard-report');
    if (!element) return;
    setIsExporting(true);
    
    // Smooth scrolling to ensure all layout elements are loaded
    window.scrollTo(0, 0);

    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        backgroundColor: '#010409', 
        useCORS: true,
        logging: false,
        windowWidth: 1600,
        onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('dashboard-report');
            if (el) el.style.padding = '40px';
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If content is very long, add multi-page support or fit to page
      // Here we scale to fit one long page (standard for dashboards) 
      // or optionally split if preferred. For "Complete Dashboard", we fit.
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Z-FIN-ULTIMATE-REPORT-${Date.now()}.pdf`);
    } catch (err) { 
      console.error('PDF Export Error:', err); 
    } finally { 
      setIsExporting(false); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-machina-bg text-slate-200 selection:bg-machina-cyan/30">
      <nav className="h-24 border-b border-white/5 bg-machina-bg/80 backdrop-blur-2xl flex items-center px-10 sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setAppState('idle')}>
            <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-machina-cyan">
              <Layers size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter text-white">Z-FIN</span>
          </div>
          <div className="flex items-center gap-6">
             {appState === 'completed' && (
                <div className="flex items-center gap-3">
                   <button 
                    onClick={exportToPDF} 
                    disabled={isExporting} 
                    className="px-6 py-3 bg-slate-900 border border-slate-700 text-machina-cyan text-[11px] font-black rounded-xl hover:border-machina-cyan transition-all flex items-center gap-2 uppercase tracking-[0.2em] disabled:opacity-50"
                  >
                    {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 导出 PDF
                  </button>
                  <button onClick={() => setAppState('idle')} className="px-8 py-3 bg-machina-cyan text-slate-900 text-[11px] font-black rounded-xl hover:bg-white transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-machina-cyan/20">
                    {t.newAnalysis} <ArrowRight size={14} />
                  </button>
                </div>
             )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {appState === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-reveal">
             <div className="mb-20 relative scale-125">
                <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="hands-svg">
                  <path d="M40 160C80 160 100 120 120 110C140 100 170 100 190 100" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <path d="M50 150C90 150 110 110 130 100C150 90 180 95 195 100" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" />
                  <path d="M360 40C320 40 300 80 280 90C260 100 230 100 210 100" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <path d="M350 50C310 50 290 90 270 100C250 110 220 105 205 100" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="200" cy="100" r="5" fill="#fbbf24" className="glow-point" />
                  <circle cx="200" cy="100" r="15" fill="#fbbf24" fillOpacity="0.3" className="glow-point" />
                  <circle cx="200" cy="100" r="30" fill="#fbbf24" fillOpacity="0.1" className="glow-point" />
                </svg>
             </div>
             
             <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter mb-10 text-white leading-none">
               BEYOND<br/><span className="text-machina-cyan">FINANCE.</span>
             </h1>
             <p className="text-2xl md:text-3xl text-slate-400 max-w-2xl mx-auto mb-20 font-medium leading-tight">
               Precision insights through the lens of machine intelligence.
             </p>

             <div className="max-w-2xl mx-auto w-full">
               <label className="group relative block cursor-pointer cyber-panel p-24 rounded-[3.5rem] border-dashed border-slate-800 hover:border-machina-cyan/50 hover:scale-[1.01] transition-all">
                  <input type="file" className="hidden" accept=".pdf,.csv,.png,.jpg,.jpeg" onChange={handleFileUpload} />
                  <div className="flex flex-col items-center">
                     <div className="w-24 h-24 bg-machina-cyan/5 border border-machina-cyan/10 text-machina-cyan rounded-3xl flex items-center justify-center mb-10 group-hover:bg-machina-cyan/10 group-hover:shadow-[0_0_30px_rgba(45,212,191,0.1)]">
                        <Cpu size={48} />
                     </div>
                     <span className="text-2xl font-black uppercase tracking-[0.2em] text-white group-hover:text-machina-cyan transition-colors">{t.dropZone}</span>
                     <div className="flex gap-12 mt-12">
                        <div className="flex items-center gap-3 opacity-30 group-hover:opacity-60 transition-opacity text-[11px] font-black uppercase tracking-widest"><FileText size={18} /> PDF</div>
                        <div className="flex items-center gap-3 opacity-30 group-hover:opacity-60 transition-opacity text-[11px] font-black uppercase tracking-widest"><ImageIcon size={18} /> VISION</div>
                     </div>
                  </div>
               </label>
             </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
             <canvas ref={canvasRef} className="absolute inset-0 z-0" />
             <div className="z-10 text-center space-y-12 animate-reveal bg-black/40 p-16 rounded-[4rem] backdrop-blur-xl border border-machina-cyan/10">
                <div className="relative w-56 h-56 mx-auto">
                    <div className="absolute inset-0 border-[4px] border-slate-900 rounded-full"></div>
                    <div className="absolute inset-0 border-[4px] border-machina-cyan border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Terminal size={56} className="text-machina-cyan animate-pulse" />
                    </div>
                </div>
                <div>
                   <h3 className="text-5xl font-black tracking-tighter text-white uppercase italic mb-6">DECRYPTING...</h3>
                   <div className="flex flex-col items-center gap-8">
                      <div className="px-10 py-3 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-black text-machina-cyan tracking-[0.6em] shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                        0x4F_SECURE_STREAM
                      </div>
                      <div className="w-96 bg-slate-900/50 h-2 rounded-full overflow-hidden border border-slate-800 backdrop-blur-sm">
                        <div className="h-full bg-gradient-to-r from-machina-cyan via-machina-purple to-machina-cyan bg-[length:200%_100%] animate-[border-beam_3s_linear_infinite] transition-all duration-500" style={{ width: `${Math.max(progress, 25)}%` }}></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {appState === 'completed' && result && <Dashboard data={result} lang={lang} theme={theme} />}

        {appState === 'error' && (
          <div className="flex-1 flex items-center justify-center p-10 animate-reveal">
            <div className="cyber-panel p-20 rounded-[3.5rem] max-w-lg w-full text-center border-machina-magenta/20">
              <div className="w-24 h-24 bg-machina-magenta/5 border border-machina-magenta/20 rounded-3xl flex items-center justify-center text-machina-magenta mx-auto mb-10 text-5xl font-black">!</div>
              <h3 className="text-4xl font-black mb-6 uppercase text-white tracking-tighter">PROTOCOL_ERROR</h3>
              <p className="text-slate-500 font-mono text-sm mb-12 bg-black/40 p-6 rounded-2xl border border-white/5">{error}</p>
              <button onClick={() => setAppState('idle')} className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl hover:bg-machina-cyan transition-all uppercase tracking-widest text-[11px]">
                {t.tryAgain}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
