"use client";

import { motion } from "framer-motion";
import { Avatar3D } from "@/components/home/Avatar3D";
import { useChat } from "ai/react";
import { Send, Sparkles } from "lucide-react";

import { useState, useEffect } from "react";

const TerminalText = ({ text, delay = 0, className = "" }: { text: string; delay?: number, className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let typeInterval: NodeJS.Timeout;
    
    // Initial delay before typing starts
    timeoutId = setTimeout(() => {
      let index = 0;
      typeInterval = setInterval(() => {
        setDisplayedText(text.substring(0, index));
        index++;
        if (index > text.length) clearInterval(typeInterval);
      }, 20); // Fast mechanical typing
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(typeInterval);
    };
  }, [text, delay]);

  return (
    <h1 className={`relative font-mono tracking-wide text-center max-w-[900px] leading-tight ${className}`}>
      {/* Invisible clone to enforce strict layout geometry, preventing 3D model reflow jumps */}
      <span className="invisible pointer-events-none select-none" aria-hidden="true">{text}</span>
      {/* Absolute overlay performs the actual typing */}
      <span className="absolute inset-0 pointer-events-none text-white whitespace-pre-wrap">{displayedText}</span>
    </h1>
  );
};

export function Hero() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <section className="flex flex-col w-full h-[calc(100vh-56px)] relative  overflow-hidden">
      
      {/* ... Ambient Background and HUD ... */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-20" />

      <div className="w-full h-full min-h-0 max-w-[1200px] mx-auto flex flex-col items-center justify-center relative z-10 px-4 md:px-8 py-8 md:py-12">
        
        {/* Cinematic Typography HUD Layer */}
        <div className="w-full flex-shrink-0 flex flex-col items-center justify-center pointer-events-none z-20 px-4 mt-2 lg:mt-6 mb-4 lg:mb-8">
          
          <motion.div 
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2.5 mb-6 md:mb-8"
          >
            <span className="flex items-center gap-2 text-cyan-400 font-mono tracking-[0.2em] text-[10px] sm:text-[11px] font-medium bg-cyan-900/40 px-3 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]" />
              SYSTEM ID : AYUSHI
            </span>
            <span className="text-purple-400 font-mono tracking-[0.2em] text-[10px] sm:text-[11px] font-medium bg-purple-900/40 px-3 py-1.5 rounded-full border border-purple-500/30 backdrop-blur-md">
              ROLE : FOUNDER + BUILDER
            </span>
            <span className="text-emerald-400 font-mono tracking-[0.2em] text-[10px] sm:text-[11px] font-medium bg-emerald-900/40 px-3 py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-md">
              STATUS : SHIPPING
            </span>
          </motion.div>
          
          <div className="flex flex-col items-center gap-2 lg:gap-3">
            <TerminalText 
              className="text-xl sm:text-2xl md:text-[2rem] font-medium tracking-wide mb-1"
              text="I build AI products that actually ship." 
              delay={0.6} 
            />
            <TerminalText 
              className="text-sm sm:text-base md:text-[1.2rem] tracking-wide text-white/90"
              text="Two hackathon wins. Three in production." 
              delay={1.6} 
            />
            <TerminalText 
              className="text-xs sm:text-sm md:text-[1rem] tracking-widest text-[#06b6d4] uppercase mt-2 lg:mt-3"
              text="One brand building agency. Still going." 
              delay={2.5} 
            />
          </div>
        </div>
        
        {/* Centerpiece: Massive Avatar Scene */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full flex-1 flex flex-col justify-end items-center min-h-0"
        >
          {/* 3D Hologram Avatar Core */}
          <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
            <Avatar3D messages={messages} isTalking={isLoading} onTalkingChange={setIsSpeaking} />
          </div>

          {/* Integrated HUD Chat Input Bar */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-[650px] mb-6 relative z-30 pointer-events-auto"
          >
            <form 
              onSubmit={handleSubmit} 
              className="relative w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] focus-within:ring-1 focus-within:ring-cyan-500/50 flex items-center p-2 transition-all hover:bg-black/60"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 ml-1">
                {(isLoading || isSpeaking) ? (
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-500/60" />
                )}
              </div>
              <input
                value={input}
                onChange={handleInputChange}
                placeholder={(isLoading || isSpeaking) ? "Waiting for system output..." : "Ask me anything..."}
                disabled={isLoading || isSpeaking}
                className="font-sans flex-1 bg-transparent border-0 text-white placeholder:text-white/30 text-[15px] focus:outline-none focus:ring-0 px-4 h-10 disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading || isSpeaking}
                className="w-10 h-10 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 mr-1 transition-colors disabled:opacity-50 disabled:hover:bg-cyan-500/20"
              >
                <Send className="w-4 h-4 translate-x-[-1px]" />
              </button>
            </form>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
