"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { X, Terminal, Cpu, Target, Award, Code2, Briefcase, Zap } from "lucide-react";
import knowledge from "@/data/knowledge.json";

// Top level helpers for decoupled node physics
const getIconAndColor = (type: string) => {
  switch (type) {
    case "hackathon": return { icon: Award, color: "text-purple-400", hex: "#c084fc", bg: "bg-purple-500/20", border: "border-purple-500/30" };
    case "production": return { icon: Briefcase, color: "text-blue-400", hex: "#60a5fa", bg: "bg-blue-500/20", border: "border-blue-500/30" };
    default: return { icon: Zap, color: "text-emerald-400", hex: "#34d399", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
  }
};

const formatTitle = (title: string, type: string) => {
  if (type === "hackathon") return title.split('-')[1]?.trim() || title;
  return title;
};



function NodeWithBranch({ project, angle, radius, delay, isExpanded, isSelected, onClick }: any) {
  const initialX = radius * Math.cos(angle);
  const initialY = radius * Math.sin(angle);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(0);
  const pathLength = useMotionValue(0);
  const opacity = useMotionValue(0);

  useEffect(() => {
    // Determine dynamic targets based on expansion state
    const targetX = isExpanded ? initialX : 0;
    const targetY = isExpanded ? initialY : 0;
    const targetScale = isExpanded ? 1 : 0;
    const targetOpacity = isExpanded ? 1 : 0;

    // Perform imperative framer-motion physics animations to identically sync SVG thread rendering with node expansion dragging
    const physics = { type: "spring", bounce: 0.4, delay: isExpanded ? delay : 0 } as any;
    animate(x, targetX, physics);
    animate(y, targetY, physics);
    animate(scale, targetScale, physics);
    animate(opacity, targetOpacity, { duration: 0.5, delay: isExpanded ? delay : 0 });
    animate(pathLength, targetScale, { duration: 1.5, delay: isExpanded ? delay : 0 });
  }, [isExpanded, initialX, initialY, delay, x, y, scale, opacity, pathLength]);

  const styleMeta = getIconAndColor(project.type);
  const Icon = styleMeta.icon;

  return (
    <>
      <svg className="absolute inset-0 pointer-events-none overflow-visible z-0">
        <motion.line
          x1={0} y1={0}
          x2={x} y2={y}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          style={{ pathLength, opacity }}
        />
      </svg>

      <motion.div
        className="absolute top-0 left-0 w-0 h-0 cursor-grab active:cursor-grabbing z-20 pointer-events-auto"
        drag
        dragConstraints={{ left: initialX - 100, right: initialX + 100, top: initialY - 100, bottom: initialY + 100 }}
        dragElastic={0.2}
        dragSnapToOrigin={true}
        style={{ x, y, scale, opacity }}
        whileHover={{ scale: 1.15 }}
        whileDrag={{ scale: 1.25, zIndex: 50 }}
        onClick={() => onClick({ ...project, styleMeta })}
      >
        <motion.div
          className="relative flex flex-col items-center group -translate-x-1/2 -translate-y-1/2"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 4 + delay, ease: "easeInOut" }}
        >
          {isSelected && (
            <motion.div
              layoutId="ring"
              className="absolute inset-0 rounded-full border border-white/40 scale-[1.3] animate-pulse pointer-events-none"
            />
          )}

          <div className={`w-14 h-14 rounded-full border ${isSelected ? 'border-white' : 'border-white/20'} bg-[#111] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] shadow-black transition-colors group-hover:border-white/60 backdrop-blur-sm`}>
            <Icon className={`w-5 h-5 ${styleMeta.color}`} />
          </div>

          <div className="absolute top-full mt-3 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-medium text-white shadow-sm">
              {formatTitle(project.displayTitle, project.type)}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export function GraphicNodeGraph() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const allProjects = [
    ...knowledge.hackathons.map(p => ({ ...p, type: "hackathon", displayTitle: p.title, displayDesc: p.outcome })),
    ...knowledge.productionWork.map(p => ({ ...p, type: "production", displayTitle: p.client, displayDesc: p.impact })),
    ...knowledge.featuredProjects.map(p => ({ ...p, type: "featured", displayTitle: p.title, displayDesc: p.summary }))
  ];

  const radius = 320; // mathematical fixed pixel distance

  return (
    <section className="relative w-full h-[calc(100vh-56px)] bg-[#050505] overflow-hidden flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-[#050505] to-[#050505] pointer-events-none" />

      {/* Constellation Container - Full Screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Central Hub Node (Rendered first so it rests under the node layering contexts recursively) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          onClick={() => {
            setSelectedNode(null);
            setIsExpanded(!isExpanded);
          }}
        >
          <div className="relative group">
            <div className={`absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 transition-all duration-700 ${!isExpanded ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-100'}`} />
            <div className="w-20 h-20 rounded-full border border-primary/50 bg-[#0A0A0A] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-105 transition-transform duration-300 relative z-20">
              <Cpu className="w-6 h-6 text-primary mb-1" />
              <span className="text-[10px] font-mono text-primary/80">CORE</span>
            </div>
          </div>
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full">
          {/* Center Zero Point */}
          <div className="absolute top-1/2 left-1/2">
            {allProjects.map((project, index) => {
              const angle = (index / allProjects.length) * (2 * Math.PI) - (Math.PI / 2);
              return (
                <NodeWithBranch
                  key={project.id || index}
                  project={project}
                  angle={angle}
                  radius={radius}
                  delay={0.8 + index * 0.1}
                  isExpanded={isExpanded}
                  isSelected={selectedNode?.id === project.id}
                  onClick={setSelectedNode}
                />
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Detailed Overlay Drawer (Opens when Node is Clicked) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none"
          >
            <div className="w-full max-w-4xl h-[75vh] bg-[#0c0c0c]/95 backdrop-blur-3xl border border-white/20 rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col pointer-events-auto text-left">

              {/* MAC WINDOW HEADER */}
              <div className="h-10 bg-[#1e1e1e] border-b border-white/10 flex items-center px-4 shrink-0 shadow-sm relative">
                <div className="flex gap-2 z-10">
                  <button onClick={() => setSelectedNode(null)} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors shadow-sm flex items-center justify-center group">
                    <X className="w-2.5 h-2.5 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-sm" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[13px] font-mono font-medium text-white/50">ayushi@macbook-pro: ~/{selectedNode.type}s/{formatTitle(selectedNode.displayTitle, selectedNode.type).replace(/\s+/g, '_').toLowerCase()}</span>
                </div>
              </div>

              {/* TERMINAL CONTENT */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-black text-white/80 font-mono text-sm leading-relaxed">
                <div className="text-emerald-400 text-lg mb-6">$ cat ./readme.md</div>
                <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-4">
                  {formatTitle(selectedNode.displayTitle, selectedNode.type)}
                </h1>

                <div className="text-blue-400 mb-8 border-l-2 border-blue-500/30 pl-4 py-1 bg-blue-500/5">
                  {selectedNode.metrics && <div>Metrics: {Array.isArray(selectedNode.metrics) ? selectedNode.metrics.join(', ') : selectedNode.metrics}</div>}
                  {selectedNode.date && <div>Date: {selectedNode.date}</div>}
                  <div>Status: <span className="text-emerald-400">Execution Ready</span></div>
                </div>

                <div className="text-white/70 text-[15px] whitespace-pre-wrap max-w-3xl">
                  {selectedNode.displayDesc}
                </div>

                <div className="text-purple-400 mt-10 mb-4 animate-pulse">{'// BEHIND THE SCENES'}</div>
                <div className="flex gap-3 flex-wrap max-w-3xl">
                  {selectedNode.techStack?.map((t: string) => (
                    <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 rounded-md shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>

                {selectedNode.link && (
                  <div className="mt-12 mb-4">
                    <a href={selectedNode.link} target="_blank" rel="noreferrer" className="text-yellow-400 hover:text-yellow-300 hover:underline transition-all font-semibold break-all">
                      $&gt; ./execute_launch {selectedNode.link}
                    </a>
                  </div>
                )}

                <div className="mt-8 text-white/30 italic pb-8">$ awaiting command...</div>
              </div>

            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </section>
  );
}
