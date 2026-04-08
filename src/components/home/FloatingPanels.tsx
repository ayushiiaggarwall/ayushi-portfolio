"use client";

import { motion } from "framer-motion";
import { Code2, Target, Cpu, Activity } from "lucide-react";

export function FloatingPanels() {
  return (
    <div className="flex flex-col h-full w-full justify-center space-y-6">
      
      {/* Metrics Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-purple-400" />
          <h4 className="text-sm font-semibold text-white/80 uppercase tracking-widest">Production Impact</h4>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-white/60 font-mono">
              <span>Daily Active Reps</span>
              <span className="text-purple-300">50+</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500/80 rounded-full w-[85%]" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-white/60 font-mono">
              <span>Live Loyalty Users</span>
              <span className="text-cyan-300">300+</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500/80 rounded-full w-[95%]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-white/60 font-mono">
              <span>B2B Companies Sourced</span>
              <span className="text-emerald-300">10+</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500/80 rounded-full w-[70%]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Code Snippet Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="bg-white/5 px-4 py-2 flex items-center border-b border-white/5 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] font-mono text-white/40 ml-2">multi_agent_system.ts</span>
        </div>
        <div className="p-4 bg-black/40 font-mono text-xs leading-relaxed overflow-hidden relative">
          <div className="text-purple-400">const <span className="text-blue-400">ResearchAgent</span> = new System({'{'}</div>
          <div className="pl-4 text-white/60 mt-1 mb-1">
            nodes: [<span className="text-amber-200">'Searcher'</span>, <span className="text-amber-200">'Fact-Checker'</span>],<br/>
            verification: <span className="text-cyan-400">true</span>, <span className="text-emerald-400/70">// zero hallucinations</span><br/>
            latest_award: <span className="text-amber-200">'1st Place Outskill AI'</span><br/>
          </div>
          <div className="text-purple-400">{'}'});</div>
          
          {/* Subtle scanning line effect */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Tech Stack Bubbles */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 flex-wrap"
      >
        {["Next.js", "React", "TypeScript", "Tailwind", "Python", "GenAI"].map((tech, i) => (
          <div key={tech} className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-mono shadow-sm">
            {tech}
          </div>
        ))}
      </motion.div>

    </div>
  );
}
