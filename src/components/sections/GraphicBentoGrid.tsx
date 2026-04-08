"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Code2, MoveRight } from "lucide-react";
import knowledge from "@/data/knowledge.json";

type ViewState = 'overview' | 'production' | 'hackathon' | 'featured';

export function GraphicBentoGrid() {
  const [view, setView] = useState<ViewState>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Grouped datasets
  const dataMap = {
    production: knowledge.productionWork.map(p => ({ ...p, type: "production", displayTitle: p.client, displayDesc: p.impact })),
    featured: knowledge.featuredProjects.map(p => ({ ...p, type: "featured", displayTitle: p.title, displayDesc: p.summary })),
    hackathon: knowledge.hackathons.map(p => ({ ...p, type: "hackathon", displayTitle: p.title, displayDesc: p.outcome }))
  };

  const activeProjects = view !== 'overview' ? (dataMap as any)[view] : [];
  const selectedProject = activeProjects.find((p: any) => p.id === selectedProjectId);

  const getImageUrl = (title: string, id: string) => {
    if (title.toLowerCase().includes("travel")) return "/images/projects/travel.png";
    if (title.toLowerCase().includes("saraswati")) return "/images/projects/loyalty.png";
    if (title.toLowerCase().includes("field")) return "/images/projects/field.png";
    if (title.toLowerCase().includes("research")) return "/images/projects/deep.png";
    return null;
  };

  const handleZoom = (state: ViewState) => {
    setView(state);
    setSelectedProjectId(null);
    if (state !== 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine viewport scale and translation based on active zoom target
  const getCameraTransform = () => {
    switch (view) {
      case 'production': return { scale: 3.5, x: "0%", y: "15%" };
      case 'hackathon': return { scale: 4.5, x: "30%", y: "-25%" };
      case 'featured': return { scale: 4.5, x: "-30%", y: "-25%" };
      default: return { scale: 1, x: "0%", y: "0%" };
    }
  };

  const camera = getCameraTransform();

  return (
    <section className="relative w-full min-h-[calc(100vh-56px)] bg-[#050505] overflow-hidden flex items-center justify-center font-sans py-8">
      
      {/* Containerized sharply scaled room instead of fullbleed cover to preserve 8K quality */}
      <div className="relative w-full max-w-[1400px] aspect-video md:aspect-[16/10] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative perspective-[1000px]">
        {/* 3D Camera / Pan-Zoom Wrapper */}
        <motion.div 
          className="absolute inset-0 w-full h-full origin-center"
          animate={{ scale: camera.scale, x: camera.x, y: camera.y }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 1:1 Intrinsic Map Wrapper - This behaves like object-cover but allows precise mathematical hitboxes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pt-[100%] sm:w-[130%] sm:pt-[130%] md:w-[100%] md:pt-[100%]">
            <img 
              src="/images/workspace_bg.png" 
              alt="Virtual Workspace"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Ambient Darkener to help UI pop during overview */}
            <motion.div 
              className="absolute inset-0 bg-black/20 pointer-events-none"
              animate={{ opacity: view === 'overview' ? 1 : 0.8 }}
              transition={{ duration: 1 }}
            />

            {/* MAPPED COMPONENT BOUNDING BOXES (Only visible in overview) */}
            {/* Coordinates are now physically hardcoded to the 1024x1024 asset space */}
            <AnimatePresence>
              {view === 'overview' && (
                <>
                  {/* Laptop Screen Hotzone */}
                  <Hotspot 
                    top="55%" left="50%" width="46%" height="32%" rotate="0deg"
                    color="rgba(147, 197, 253, 0.4)" // Blue
                    onClick={() => handleZoom('production')} 
                  />
                  {/* Tablet Screen Hotzone */}
                  <Hotspot 
                    top="58%" left="18%" width="15%" height="25%" rotate="0deg"
                    color="rgba(192, 132, 252, 0.4)" // Purple
                    onClick={() => handleZoom('hackathon')} 
                  />
                  {/* Notebook Paper Hotzone */}
                  <Hotspot 
                    top="59%" left="82%" width="28%" height="24%" rotate="0deg"
                    color="rgba(253, 230, 138, 0.3)" // Amber/Paper
                    onClick={() => handleZoom('featured')} 
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>


        {/* --- UI IMMERSION LAYERS --- */}
        {/* 1. Terminal UI (Laptop) */}
        <AnimatePresence>
          {view === 'production' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none"
            >
              <div className="w-full max-w-5xl h-[85vh] bg-[#0c0c0c]/95 backdrop-blur-3xl border border-white/20 rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col pointer-events-auto">
                <div className="h-10 bg-[#1e1e1e] border-b border-white/10 flex items-center px-4 shrink-0 shadow-sm relative">
                  <div className="flex gap-2 z-10">
                    <button onClick={() => handleZoom('overview')} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors shadow-sm" />
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 shadow-sm" />
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-sm" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[13px] font-mono font-medium text-white/50">ayushi@macbook-pro: ~/production-builds</span>
                  </div>
                </div>
                <div className="flex-1 flex font-mono text-sm h-full overflow-hidden min-h-0">
                  <div className="w-1/3 border-r border-white/10 p-6 flex flex-col gap-2 overflow-y-auto">
                    <div className="text-emerald-400 mb-4">$ ls -la ./clients</div>
                    {activeProjects.map((p: any) => (
                      <button key={p.id} onClick={() => setSelectedProjectId(p.id)} className={`text-left px-3 py-2 rounded transition-colors ${selectedProjectId === p.id ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/60'}`}>
                        drwxr-xr-x {p.displayTitle.replace(/\s+/g, '_').toLowerCase()}
                      </button>
                    ))}
                  </div>
                  <div className="w-2/3 p-8 overflow-y-auto bg-black text-white/80">
                    {selectedProject ? (
                      <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                        <div className="text-emerald-400 text-lg mb-6">$ cat ./clients/{selectedProject.displayTitle.replace(/\s+/g, '_').toLowerCase()}/readme.md</div>
                        <h1 className="text-3xl font-bold text-white uppercase">{selectedProject.displayTitle}</h1>
                        <div className="text-blue-400">Scale: {selectedProject.metrics?.salesRepresentatives} Reps | Dist: {selectedProject.metrics?.companies} B2B</div>
                        <div className="text-white/60 mt-4 leading-relaxed">{selectedProject.displayDesc}</div>
                        
                        <div className="text-purple-400 mt-6 mb-2">{'// TECH STACK'}</div>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProject.techStack?.map((t: string) => <span key={t} className="px-2 py-1 bg-white/10 rounded">{t}</span>)}
                        </div>

                        {selectedProject.link && (
                          <div className="mt-8">
                            <a href={selectedProject.link} target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline hover:text-yellow-300">
                              $&gt; ./execute_launch {selectedProject.link}
                            </a>
                          </div>
                        )}
                      </div>
                    ) : <div className="text-white/30 italic animate-pulse">$ awaiting command...</div>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. iPad UI (Hackathons) */}
        <AnimatePresence>
          {view === 'hackathon' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none"
            >
              <div className="w-full max-w-5xl h-[85vh] bg-[#f5f5f7]/95 backdrop-blur-2xl border-[12px] border-black rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col pointer-events-auto relative">
                
                {/* Native iOS/Mac traffic light minimize close buttons */}
                <div className="absolute top-6 left-6 flex gap-2 z-50">
                  <button onClick={() => handleZoom('overview')} className="w-3.5 h-3.5 rounded-full bg-red-400 hover:bg-red-500 cursor-pointer transition-colors shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-sm" />
                </div>

                <div className="pt-16 px-10 pb-6 border-b border-black/5 flex-shrink-0">
                  <h1 className="text-5xl font-extrabold text-black tracking-tight">Hackathons</h1>
                  <p className="text-black/50 text-xl font-medium mt-1">Winning projects & prototypes</p>
                </div>
                <div className="flex-1 flex bg-white/50 h-full overflow-hidden min-h-0">
                   <div className="w-1/3 border-r border-black/5 p-6 overflow-y-auto space-y-4">
                     {activeProjects.map((p: any) => (
                       <button key={p.id} onClick={() => setSelectedProjectId(p.id)} className={`w-full text-left p-6 rounded-3xl transition-all ${selectedProjectId === p.id ? 'bg-white shadow-xl scale-100 ring-2 ring-purple-500/20' : 'bg-transparent hover:bg-white/50 scale-95'}`}>
                         <h3 className="text-xl font-bold text-black mb-2">{p.displayTitle.split('-')[1]?.trim() || p.displayTitle}</h3>
                         <p className="text-sm text-black/50 line-clamp-2">{p.displayDesc}</p>
                       </button>
                     ))}
                   </div>
                   
                   <div className="w-2/3 p-10 overflow-y-auto">
                     {selectedProject ? (
                       <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-black/5 animate-in fade-in slide-in-from-right-4 duration-500">
                          {getImageUrl(selectedProject.displayTitle, selectedProject.id) && (
                             <img src={getImageUrl(selectedProject.displayTitle, selectedProject.id)!} className="w-full h-64 object-cover rounded-2xl mb-8 border border-black/5" />
                          )}
                          <h2 className="text-4xl font-bold text-black mb-2">{selectedProject.displayTitle.split('-')[1]?.trim() || selectedProject.displayTitle}</h2>
                          <h3 className="text-purple-600 font-bold mb-6 tracking-wide uppercase text-sm">Target Engineering</h3>
                          <p className="text-lg text-black/70 leading-relaxed mb-8">{selectedProject.displayDesc}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-8">
                             {selectedProject.techStack?.map((t: string) => (
                               <span key={t} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-semibold text-sm">{t}</span>
                             ))}
                          </div>

                          {selectedProject.link && (
                            <a href={selectedProject.link} target="_blank" rel="noreferrer" className="inline-block px-8 py-4 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform">
                              View Live Prototype
                            </a>
                          )}
                       </div>
                     ) : <div className="h-full flex items-center justify-center text-black/20 font-bold text-2xl">Select a prototype</div>}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Paper Notebook UI (Featured Research) -> With PAGE FLIP Entry */}
        <AnimatePresence>
          {view === 'featured' && (
            <motion.div 
              initial={{ opacity: 0, rotateY: 90, perspective: 1200 }}
              animate={{ opacity: 1, rotateY: 0, perspective: 1200 }}
              exit={{ opacity: 0, rotateY: -90, perspective: 1200 }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              style={{ transformOrigin: "left center" }} // Anchors rotation to simulate opening a book
              className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none"
            >
              <div className="w-full max-w-5xl h-[85vh] bg-[#fdfbf7] border border-stone-300 rounded-r-3xl shadow-[50px_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex pointer-events-auto relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-stone-200 border-r border-stone-300 flex flex-col justify-around py-20 z-20 shadow-[inset_-5px_0_15px_rgba(0,0,0,0.05)]">
                   {[...Array(6)].map((_, i) => <div key={i} className="w-12 h-6 -ml-4 bg-stone-800 rounded-full shadow-md z-30 opacity-80" />)}
                </div>
                <button onClick={() => handleZoom('overview')} className="absolute top-6 right-6 z-50 p-2 text-stone-400 hover:text-stone-800 transition-colors">
                  <X className="w-8 h-8" />
                </button>

                <div className="flex-1 flex ml-12 font-serif text-stone-800 h-full overflow-hidden min-h-0">
                   <div className="w-1/3 border-r border-stone-200 p-10 flex flex-col pt-16">
                     <h2 className="text-3xl font-bold tracking-tight mb-10 italic border-b-2 border-stone-800 pb-4 inline-block">Research Index</h2>
                     <div className="flex-1 space-y-6">
                       {activeProjects.map((p: any) => (
                         <button key={p.id} onClick={() => setSelectedProjectId(p.id)} className={`text-left text-xl transition-colors block w-full ${selectedProjectId === p.id ? 'font-bold text-black underline decoration-2 underline-offset-4' : 'text-stone-500 hover:text-stone-800'}`}>
                           {p.displayTitle}
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className="w-2/3 p-12 overflow-y-auto relative pt-16">
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_27px,#e5e5e5_28px)] bg-[size:100%_28px] pointer-events-none opacity-50" />
                      <div className="relative z-10 transition-all">
                        {selectedProject ? (
                          <motion.div
                             key={selectedProject.id}
                             initial={{ opacity: 0, rotateY: 90, x: 50 }}
                             animate={{ opacity: 1, rotateY: 0, x: 0 }}
                             transition={{ duration: 0.6, ease: "easeOut" }}
                             style={{ transformOrigin: "left center" }}
                          >
                            <h1 className="text-5xl font-bold italic mb-6 leading-tight">{selectedProject.displayTitle}</h1>
                            <p className="text-xl leading-relaxed text-stone-600 space-y-6 whitespace-pre-wrap">{selectedProject.displayDesc}</p>
                            
                            <div className="mt-12 flex flex-wrap gap-3">
                              {selectedProject.techStack?.map((t: string) => (
                                <span key={t} className="px-3 py-1 border border-stone-400 rounded-full text-stone-600 text-sm font-sans uppercase tracking-widest">{t}</span>
                              ))}
                            </div>
                            
                            {selectedProject.link && (
                              <div className="mt-16">
                                <a href={selectedProject.link} target="_blank" rel="noreferrer" className="inline-block px-8 py-4 border-2 border-stone-800 text-stone-800 font-bold hover:bg-stone-800 hover:text-white transition-colors">
                                  Access Prototype Archive
                                </a>
                              </div>
                            )}
                          </motion.div>
                        ) : <div className="text-3xl italic text-stone-300 font-light mt-20 text-center">Flip to a research entry...</div>}
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

// Invisible 3D Hotspot that highlights the component directly
function Hotspot({ left, top, width, height, rotate, color, onClick }: { left: string, top: string, width: string, height: string, rotate: string, color: string, onClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ opacity: 1, scale: 1.02 }}
      style={{ top, left, width, height, rotate, x: "-50%", y: "-50%" }}
      onClick={onClick}
      className="absolute cursor-pointer z-20 group"
    >
      <div 
        className="w-full h-full rounded-md border-2 border-white/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 60px ${color}`
        }}
      >
        <div className="animate-ping w-full h-full rounded-md border border-white opacity-40 absolute" style={{ borderColor: color }} />
      </div>
      
      {/* Idle pulsating glow so users know it's clickable */}
      <div 
        className="absolute inset-0 rounded-md pointer-events-none animate-pulse opacity-40 transition-opacity group-hover:opacity-0"
        style={{
          boxShadow: `inset 0 0 20px ${color}, 0 0 20px ${color}`,
        }}
      />
    </motion.div>
  );
}
