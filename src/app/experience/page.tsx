import React from 'react';
import { Header } from "@/components/layout/Header";

export default function ExperiencePage() {
  const experiences = [
    {
      role: "FOUNDER + BUILDER",
      company: "Merkri Media",
      date: "October 2025 — Present",
      status: "ACTIVE",
      badgeColor: "cyan",
      description: "Building a brand building agency for B2B founders.\nHelping manufacturers and businesses become the default name in their category - not just another option in the market."
    },
    {
      role: "HACKATHON WINNER",
      company: "AI Enginnering Outskill Hackathon",
      date: "December 2025",
      status: "1ST PLACE",
      badgeColor: "cyan",
      description: "Built Deep Researcher Agent — a multi-agent AI research system using LangChain and LangGraph.\n Won 1st place at AI Engineering hackathon competing against builders globally "
    },
    {
      role: "SOFTWARE ENGINEER",
      company: "Ericsson",
      date: "January 2023 — September 2025",
      status: "COMPLETED",
      badgeColor: "emerald",
      description: "Developed enterprise software solutions and collaborated on large-scale telecommunications infrastructure.\nLeft to pursue building independent products."
    },
    {
      role: "2X HACKATHON WINNER",
      company: "AI Generalist Outskill Hackathon",
      date: "August 2025",
      status: "1ST PLACE",
      badgeColor: "cyan",
      description: "Built Travel Ease — an AI travel planning agent for creating itinerary, booking flights, hotels, places to eat, weather of destination, everything.\nWon 1st place at AI Generalist hackathon competing against builders globally."
    }
  ];

  const getBadgeClasses = (color: string) => {
    switch (color) {
      case 'cyan': return 'bg-cyan-900/40 border-cyan-500/30 text-cyan-400';
      case 'emerald': return 'bg-emerald-900/40 border-emerald-500/30 text-emerald-400';
      default: return 'bg-white/5 border-white/10 text-white/50';
    }
  };

  const getDotClasses = (color: string) => {
    switch (color) {
      case 'cyan': return 'bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]';
      case 'emerald': return 'bg-emerald-500 shadow-[0_0_10px_#10b981]';
      default: return 'bg-white/30';
    }
  };

  return (
    <div className="flex flex-col min-h-screen  selection:bg-cyan-500/30 relative">
      <Header />



      <main className="flex-1 container mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-24 relative z-10 block">

        {/* Page Heading */}
        <div className="mb-14 md:mb-20">
          <h1 className="font-mono flex items-baseline gap-2.5 mb-2">
            <span className="text-[1.2rem] md:text-[1.5rem] text-cyan-500/60 tracking-widest font-normal">//</span>
            <span className="text-[1.35rem] md:text-[1.65rem] font-bold text-white tracking-widest uppercase shadow-sm">EXPERIENCE</span>
          </h1>
          <p className="font-mono text-xs md:text-sm text-emerald-400 tracking-wide pl-1">
            $ cat ./career_log.md
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="font-sans relative pl-8 md:pl-12 border-l-2 border-dotted border-cyan-500/30 space-y-16">

          {experiences.map((exp, idx) => (
            <div key={idx} className="relative group">
              {/* Connector Node */}
              <div className="absolute -left-[39px] md:-left-[55px] top-1.5 w-3.5 h-3.5 rounded-full  border-2 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)] group-hover:bg-cyan-400 group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300" />

              {/* Terminal Card */}
              <div className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 border-l-2 border-l-cyan-500/70 rounded-xl p-6 md:p-8 hover:border-cyan-500/30 hover:bg-[#111]/80 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(6,182,212,0.1)]">

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-mono text-sm md:text-base font-bold text-cyan-400 tracking-wider uppercase mb-1.5">{exp.role}</h2>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{exp.company}</span>
                      <span className="font-mono text-xs md:text-sm text-white/40">{exp.date}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`shrink-0 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest font-medium px-3 py-1 rounded-full border backdrop-blur-md ${getBadgeClasses(exp.badgeColor)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${getDotClasses(exp.badgeColor)}`} />
                    {exp.status}
                  </div>
                </div>

                <div className="font-mono text-sm md:text-[15px] text-white/70 leading-relaxed whitespace-pre-line border-l border-white/10 pl-4">
                  {exp.description}
                </div>
              </div>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
}
