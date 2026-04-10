"use client";

import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Terminal, Calendar, User, Cpu, Lock, ShieldCheck, RefreshCw, Eye, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatLog = {
  u: string; // user message
  a: string; // ai answer
  t: string; // timestamp
};

function DashboardContent() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  const fetchLogs = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(`/api/admin/history?key=${encodeURIComponent(passcode)}`);
      const data = await resp.json();

      if (resp.ok) {
        setLogs(data.logs || []);
        setIsAuthorized(true);
      } else {
        setError(data.error || "Failed to fetch logs");
        setIsAuthorized(false);
      }
    } catch (err) {
      setError("Network error. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6 font-mono">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-2xl border border-cyan-500/20 bg-[#050505] shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden"
        >
          {/* Ambient Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
            
            <h1 className="text-xl font-bold tracking-[0.2em] mb-2 uppercase text-center">Admin Node Access</h1>
            <p className="text-white/40 text-xs mb-8 text-center leading-relaxed">System history is restricted. Enter authentication key to decode logs.</p>
            
            <form onSubmit={fetchLogs} className="w-full space-y-4">
              <div className="relative">
                <input 
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="ENTER ACCESS KEY"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-mono tracking-widest text-center"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-red-400 text-[10px] text-center uppercase tracking-widest"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit" 
                disabled={loading || !passcode.trim()}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg py-3 text-xs font-bold tracking-[0.3em] transition-all disabled:opacity-50 uppercase flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Authorize Link"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white font-mono selection:bg-cyan-500/30">
      {/* Top HUD Bar */}
      <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] tracking-[0.3em] text-emerald-400 font-bold uppercase">SECURE LINK : ACTIVE</span>
          </div>
          <div className="hidden md:flex h-4 w-px bg-white/10" />
          <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            <span>STORAGE : VERCEL KV</span>
            <span className="text-white/10">•</span>
            <span>LOGS : {logs.length} / 100</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchLogs()} 
            className="text-[10px] tracking-widest text-cyan-400 hover:text-white transition-colors uppercase font-bold flex items-center gap-2"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="h-4 w-px bg-white/10" />
          <button 
            onClick={() => { setIsAuthorized(false); setLogs([]); }} 
            className="text-[10px] tracking-widest text-white/40 hover:text-red-400 transition-colors uppercase"
          >
            Disconnect
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white">CONVERSATION FEED</h1>
            <p className="text-white/40 text-xs tracking-widest uppercase mt-1">Real-time interaction matrix</p>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {logs.length === 0 && !loading && (
              <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-white/20 text-xs uppercase tracking-widest">No communication logs recorded yet.</p>
              </div>
            )}
            
            {logs.map((log, i) => (
              <motion.div 
                key={log.t + i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 p-6 rounded-2xl bg-[#050505] border border-white/5 hover:border-cyan-500/20 transition-all shadow-xl"
              >
                {/* Timestamp & Metadata */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] tracking-widest font-bold text-white/30 uppercase group-hover:text-cyan-400/60 transition-colors">
                    <Calendar className="w-3 h-3" />
                    {new Date(log.t).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                  
                  <div className="bg-purple-500/5 rounded-xl border border-purple-500/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                       <User className="w-3 h-3 text-purple-400" />
                       <span className="text-[9px] tracking-[0.2em] font-bold text-purple-400 uppercase">Input</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed font-sans font-medium">{log.u}</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="bg-cyan-500/5 rounded-xl border border-cyan-500/10 p-4 md:p-6 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                     <Cpu className="w-3 h-3 text-cyan-400" />
                     <span className="text-[9px] tracking-[0.2em] font-bold text-cyan-400 uppercase">Response</span>
                  </div>
                  <div className="text-[13px] text-white/90 leading-relaxed prose prose-invert prose-sm max-w-none font-sans font-medium selection:bg-cyan-500/50">
                    <ReactMarkdown>{log.a}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/30 tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3" />
              Auto-pruning active (100 log limit)
           </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020202] flex items-center justify-center text-cyan-400 font-mono tracking-widest text-xs uppercase animate-pulse">Initializing Terminal...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
