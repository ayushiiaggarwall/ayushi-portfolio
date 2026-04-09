"use client";

import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import { X, Award, Briefcase, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import knowledge from "@/data/knowledge.json";
import { HologramCore, LoadedModel } from "@/components/home/Avatar3D";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

// Top level helpers for decoupled node logic
const getIconAndColor = (type: string) => {
  switch (type) {
    case "hackathon": return { icon: Award, color: "text-purple-400", hex: "#c084fc", bg: "bg-purple-500/20", border: "border-purple-500/30" };
    case "production": return { icon: Briefcase, color: "text-blue-400", hex: "#60a5fa", bg: "bg-blue-500/20", border: "border-blue-500/30" };
    default: return { icon: Zap, color: "text-emerald-400", hex: "#34d399", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
  }
};

// Remove formatTitle since the titles are now fully curated in knowledge.json

const allProjects = [
  ...knowledge.hackathons.map(p => ({ ...p, type: "hackathon", displayTitle: p.title, displayDesc: p.outcome })),
  ...knowledge.productionWork.map(p => ({ ...p, type: "production", displayTitle: p.client, displayDesc: p.impact })),
  ...knowledge.featuredProjects.map(p => ({ ...p, type: "featured", displayTitle: p.title, displayDesc: p.summary }))
];

function ProjectNode({ proj, idx, total, radius, onNodeClick, activeNodeId, isHoveredRef, isMobile }: any) {
  const nodeRef = useRef<THREE.Group>(null);
  const domRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Arrange firmly in a flat circle for an orderly, clean "carousel" ring
  const angle = (idx / total) * Math.PI * 2;
  const y = 0;

  const isSelected = activeNodeId === proj.id;
  const sequenceNum = String(idx + 1).padStart(2, '0');

  // Split title by em-dash (—) to style the signal text
  const titleParts = proj.displayTitle.split('—');
  const mainTitle = titleParts[0].trim();
  const signalText = titleParts.length > 1 ? titleParts.slice(1).join('—').trim() : null;

  useFrame(() => {
    if (nodeRef.current && domRef.current) {
      const worldPos = new THREE.Vector3();
      nodeRef.current.getWorldPosition(worldPos);

      const z = worldPos.z;
      // Fade exactly when it crosses behind the mesh midpoint (Z = 0)
      const opacity = Math.max(0, Math.min(1, (z + 1.2) / 1.5));

      // 60FPS Javascript Scaling strictly avoids CSS transition lag
      const depthScale = 0.75 + (opacity * 0.25);
      const hoverScale = (isSelected || isHovered) ? 1.15 : 1.0;
      const finalScale = depthScale * hoverScale;

      domRef.current.style.opacity = opacity.toString();
      domRef.current.style.transform = `scale(${finalScale})`;
      domRef.current.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      // Manually force strict UI overlap rules based absolutely on 3D distance
      domRef.current.style.zIndex = Math.round(z * 100).toString();
    }
  });

  return (
    <group ref={nodeRef} position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
      <Html center>
        <div
          ref={domRef}
          onPointerDown={(e) => { e.stopPropagation(); onNodeClick(proj); }}
          onPointerOver={() => { setIsHovered(true); isHoveredRef.current = true; document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setIsHovered(false); isHoveredRef.current = false; document.body.style.cursor = 'auto'; }}
          className={`relative flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border backdrop-blur-md group origin-center cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 max-w-[220px] sm:max-w-[300px] md:max-w-none ${isSelected ? 'border-cyan-400 bg-[#111]/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'border-white/10 bg-[#050505]/80 hover:bg-[#0a0a0a]/90 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]'}`}
        >
          {isSelected && (
            <div className="absolute inset-0 rounded-full border border-cyan-400/50 scale-[1.1] animate-pulse pointer-events-none" />
          )}

          <div className={`w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-full flex items-center justify-center border border-white/5 shadow-inner transition-colors duration-300 ${isSelected ? 'bg-cyan-500/30' : 'bg-cyan-500/20'}`}>
            <span className={`font-mono text-[10px] sm:text-xs font-bold tracking-wider ${isSelected ? 'text-cyan-200' : 'text-cyan-400'}`}>
              {sequenceNum}
            </span>
          </div>

          <span className={`text-[11px] sm:text-sm font-mono font-semibold tracking-wide leading-tight transition-colors duration-300 overflow-hidden ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}`}
            style={isMobile ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '160px' } : {}}
          >
            {mainTitle}
            {signalText && (
              <>
                <span className="text-white/40 px-1">—</span>
                <span className="text-cyan-400 font-bold">{signalText}</span>
              </>
            )}
          </span>
        </div>
      </Html>
    </group>
  );
}

function OrbitalNodes({ projects, onNodeClick, activeNodeId, radius, isMobile }: { projects: any[], onNodeClick: (node: any) => void, activeNodeId?: string, radius: number, isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const velocityY = useRef(0);
  const isHoveredRef = useRef(false);

  // Smoothly rotate the entire node layer over time, augmented by mouse tracking
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Pause completely if hovering a node OR viewing a node popup
      const isPaused = isHoveredRef.current || !!activeNodeId;
      const targetSpeedY = isPaused ? 0 : 0.5 + (state.pointer.x * 2.0);
      const dampFactor = 1 - Math.exp(-4 * delta);

      velocityY.current += (targetSpeedY - velocityY.current) * dampFactor;
      groupRef.current.rotation.y += velocityY.current * delta;

      // Slight fixed tilt for an elegant orbit
      const targetRotationX = 0.15 + (state.pointer.y * 0.1);
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * dampFactor;
      groupRef.current.rotation.z = -0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {projects.map((proj, idx) => (
        <ProjectNode
          key={proj.id || idx}
          proj={proj}
          idx={idx}
          total={projects.length}
          radius={radius}
          onNodeClick={onNodeClick}
          activeNodeId={activeNodeId}
          isHoveredRef={isHoveredRef}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
}

export function ProjectConstellation3D() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const isMobile = useIsMobile();

  // Responsive 3D params: smaller radius + pulled-back camera on mobile so ring stays in frame
  const orbitalRadius = isMobile ? 2.6 : 4.0;
  const cameraZ = isMobile ? 10.5 : 8.5;

  // Apply specific styles if a node is selected (zoom back slightly/blur outer scene)
  const isViewingNode = selectedNode !== null;

  return (
    <section className="relative w-full h-[calc(100vh-56px)] overflow-hidden flex items-center justify-center">


      {/* Page Heading Directory Layer */}
      <div className={`absolute top-8 left-5 md:top-16 md:left-12 z-20 pointer-events-none transition-opacity duration-700 ${isViewingNode ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="font-mono flex items-baseline gap-2 mb-1.5">
          <span className="text-[1rem] md:text-[1.5rem] text-cyan-500/60 tracking-widest font-normal">//</span>
          <span className="text-[1.15rem] md:text-[1.65rem] font-bold text-white tracking-widest uppercase shadow-sm">PROJECTS</span>
        </h1>
        <p className="font-mono text-[11px] md:text-sm text-emerald-400 tracking-wide pl-1">
          $ ls ~/projects
        </p>
      </div>

      {/* Primary 3D Renderer Context */}
      <div className={`absolute inset-0 w-full h-full z-10 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isViewingNode ? 'blur-[3px] scale-95 opacity-50' : 'blur-0 scale-100 opacity-100'}`}>
        <Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" castShadow />
          <pointLight position={[-10, 0, -10]} intensity={1.5} color="#a855f7" />
          <pointLight position={[10, 0, -10]} intensity={1.5} color="#06b6d4" />
          <Environment preset="city" />

          <group scale={isMobile ? 0.5 : 0.7}>
            <React.Suspense fallback={<HologramCore isTalking={false} />}>
              <LoadedModel url="/models/avatar.glb" isTalking={false} />
            </React.Suspense>
          </group>

          <OrbitalNodes projects={allProjects} onNodeClick={setSelectedNode} activeNodeId={selectedNode?.id} radius={orbitalRadius} isMobile={isMobile} />
        </Canvas>
      </div>

      {/* Floating Instructions (Fades out when a node is opened) */}
      <AnimatePresence>
        {!isViewingNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-[80px] z-20 pointer-events-none opacity-50 flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs tracking-widest uppercase text-white/70">DRAG TO SPIN • HOVER TO LOCK • CLICK TO EXECUTE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Overlay Drawer (Opens when Node is Clicked) */}
      <AnimatePresence>
        {isViewingNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-12 pointer-events-none"
          >
            <div className="w-full max-w-4xl h-[82vh] sm:h-[78vh] bg-[#0c0c0c]/95 backdrop-blur-3xl border border-white/20 rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col pointer-events-auto text-left">

              {/* MAC WINDOW HEADER */}
              <div className="h-9 bg-[#1e1e1e] border-b border-white/10 flex items-center px-3 shrink-0 shadow-sm relative">
                <div className="flex gap-2 z-10">
                  <button onClick={() => setSelectedNode(null)} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors shadow-sm flex items-center justify-center group">
                    <X className="w-2.5 h-2.5 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-sm" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12">
                  <span className="text-[10px] sm:text-[13px] font-mono font-medium text-white/50 truncate">
                    ayushi@system: ~/{selectedNode.type === 'hackathon' ? 'hackathons' : 'productions'}/{selectedNode.displayTitle.split('—')[0].trim().replace(/\s+/g, '_').toLowerCase()}
                  </span>
                </div>
              </div>

              {/* TERMINAL CONTENT */}
              <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto bg-black text-white/80 font-mono text-sm leading-relaxed">
                <div className="text-emerald-400 text-sm sm:text-base mb-4">$ cat ./readme.md</div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">
                  {selectedNode.displayTitle}
                </h1>

                <div className="text-blue-400 mb-5 border-l-2 border-blue-500/30 pl-3 py-1 bg-blue-500/5 text-xs sm:text-sm">
                  {selectedNode.metrics && <div>Metrics: {Array.isArray(selectedNode.metrics) ? selectedNode.metrics.join(', ') : selectedNode.metrics}</div>}
                  {selectedNode.date && <div>Date: {selectedNode.date}</div>}
                  <div>Status: <span className="text-emerald-400">{selectedNode.type === 'hackathon' ? '1st Place · Hackathon Winner' : `Live in Production${selectedNode.metrics ? ' · ' + (Array.isArray(selectedNode.metrics) ? selectedNode.metrics[0] : selectedNode.metrics) : ''}`}</span></div>
                </div>

                <div className="text-white/80 text-[13px] sm:text-[15px] leading-relaxed max-w-3xl">
                  {selectedNode.displayDesc}
                </div>

                <div className="text-purple-400 mt-6 sm:mt-10 mb-3 animate-pulse text-xs sm:text-sm">{'// BEHIND THE SCENES'}</div>
                <div className="flex gap-2 flex-wrap max-w-3xl">
                  {selectedNode.techStack?.map((t: string) => (
                    <span key={t} className="px-2.5 py-1 text-[11px] sm:text-sm bg-white/5 border border-white/10 text-white/80 rounded-md shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>

                {selectedNode.link && (
                  <div className="mt-6 sm:mt-12 mb-4">
                    <a href={selectedNode.link} target="_blank" rel="noreferrer" className="text-yellow-400 hover:text-yellow-300 hover:underline transition-all font-semibold break-all border border-yellow-400/30 bg-yellow-400/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md inline-block text-xs sm:text-sm">
                      $&gt; open {selectedNode.link}
                    </a>
                  </div>
                )}

                <div className="mt-6 text-white/30 italic pb-6 text-xs sm:text-sm">$ awaiting command... <span className="animate-pulse">_</span></div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
