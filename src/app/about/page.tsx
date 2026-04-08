import React from 'react';
import { Header } from "@/components/layout/Header";
import knowledge from "@/data/knowledge.json";
import Image from "next/image";
import { Mail, MapPin, Terminal, Briefcase, Code, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen  selection:bg-cyan-500/30 relative">
      <Header />



      <main className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20 relative z-10 block">

        {/* Page Heading */}
        <div className="mb-14 md:mb-20">
          <h1 className="font-mono flex items-baseline gap-2.5 mb-2">
            <span className="text-[1.2rem] md:text-[1.5rem] text-cyan-500/60 tracking-widest font-normal">//</span>
            <span className="text-[1.35rem] md:text-[1.65rem] font-bold text-white tracking-widest uppercase shadow-sm">ABOUT</span>
          </h1>
          <p className="font-mono text-xs md:text-sm text-emerald-400 tracking-wide pl-1">
            $ cat ./ayushi.md
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-stretch">

          {/* Left Column: Photo (45%) */}
          <div className="w-full md:w-[45%] shrink-0">
            <div className="relative w-full aspect-[4/5] max-w-sm mx-auto md:max-w-none group">
              {/* Cyan Corner Brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/80 transition-all duration-500 group-hover:w-10 group-hover:h-10 z-20" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/80 transition-all duration-500 group-hover:w-10 group-hover:h-10 z-20" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/80 transition-all duration-500 group-hover:w-10 group-hover:h-10 z-20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/80 transition-all duration-500 group-hover:w-10 group-hover:h-10 z-20" />

              {/* Image Base Layer */}
              <div className="absolute inset-2 md:inset-3 bg-[#111] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/5">
                <Image
                  src="/about-profile.JPG"
                  alt="Ayushi Aggarwal"
                  fill
                  quality={100}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-[80%_50%] opacity-80 group-hover:opacity-100 transition-opacity duration-700 hover:scale-[1.03]"
                />
                {/* Scanline overlay for aesthetic */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none mix-blend-overlay" />
              </div>
            </div>
          </div>

          {/* Right Column: Content (55%) */}
          <div className="w-full md:w-[55%] flex flex-col justify-center">

            <h2 className="font-mono text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 uppercase">Ayushi Aggarwal</h2>
            <div className="font-mono text-cyan-400 mb-8 tracking-widest text-sm md:text-base">
              // Founder &middot; Builder &middot; Brand Strategist
            </div>

            <div className="font-mono text-white/70 text-[14px] md:text-[15px] leading-relaxed mb-10 border-l-[3px] border-cyan-500/30 pl-5 space-y-4">
              <p>I build things that actually get used.</p>
              <p>Not prototypes that live on GitHub. Not decks that explain what I'm planning to build. Products with real users, real logins, and real businesses depending on them daily.</p>
              <p>I run Merkri Media — a brand building agency helping B2B founders stop being the best-kept secret in their industry. I also build AI products, two of which have won hackathons and three of which are in active production use right now.</p>
              <p>I left Ericsson because I wanted to build something of my own. So I did. And I'm not done yet.</p>
            </div>

            {/* Stat Badges */}
            <div className="flex gap-1.5 sm:gap-2.5 mb-10 whitespace-nowrap w-full overflow-hidden">
              <div className="flex-1 flex items-center justify-center gap-1.5 font-mono text-[8px] sm:text-[9px] lg:text-[10px] tracking-widest font-medium px-2 sm:px-3 py-1.5 rounded-full bg-emerald-900/20 border border-emerald-500/30 text-emerald-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_#10b981]" />
                1 AGENCY RUNNING
              </div>
              <div className="flex-1 flex items-center justify-center gap-1.5 font-mono text-[8px] sm:text-[9px] lg:text-[10px] tracking-widest font-medium px-2 sm:px-3 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0 shadow-[0_0_8px_#06b6d4]" />
                2 HACKATHON WINS
              </div>
              <div className="flex-1 flex items-center justify-center gap-1.5 font-mono text-[8px] sm:text-[9px] lg:text-[10px] tracking-widest font-medium px-2 sm:px-3 py-1.5 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-300">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 shadow-[0_0_8px_#a855f7]" />
                3 IN PRODUCTION
              </div>
            </div>

            {/* Terminal Card */}
            <div className="/80 border border-white/10 rounded-xl p-6 md:p-8 font-mono text-xs md:text-[13px] mb-10 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="text-white/40 w-28 shrink-0 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> LOCATION</span>
                  <span className="text-white">Mohali, India</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="text-white/40 w-28 shrink-0 flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> BACKGROUND</span>
                  <span className="text-white">CS Graduate &middot; Ex-Ericsson Software Engineer</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="text-white/40 w-28 shrink-0 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> NOW</span>
                  <span className="text-cyan-400">Building Merkri Media &middot; Shipping fast</span>
                </div>
              </div>
            </div>

            {/* Connect Section */}
            <div className="flex flex-wrap items-center gap-4">
              <a href={`mailto:${knowledge.links.email}`} className="flex items-center shrink-0 gap-2 px-6 py-2.5 bg-white text-black font-mono font-semibold rounded-md hover:bg-cyan-400 hover:text-white transition-colors shadow-lg">
                <Mail className="w-4 h-4" /> Reach Out
              </a>
              <span className="font-mono text-cyan-400/80 text-[13px] tracking-widest px-2">{knowledge.links.email}</span>

              <div className="flex gap-4 ml-auto">
                <a href={knowledge.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 border border-white/20 text-white font-medium rounded-md hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-400 transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
                <a href={knowledge.links.github} target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 border border-white/20 text-white font-medium rounded-md hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-400 transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
