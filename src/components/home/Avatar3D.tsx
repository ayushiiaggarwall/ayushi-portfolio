"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Sphere, MeshDistortMaterial, Float, useGLTF, Environment, Center, Bounds, ContactShadows, PresentationControls } from "@react-three/drei";
import { Message } from "ai/react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Avatar3DProps {
  messages: Message[];
  isTalking?: boolean;
}

// The cool AI Hologram core placeholder (now used as fallback loader)
export function HologramCore({ isTalking }: { isTalking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (materialRef.current) {
      // increase distort when talking
      const targetDistort = isTalking ? 0.6 : 0.3;
      const targetSpeed = isTalking ? 4 : 2;
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.1);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#06b6d4" // cyan-500
          emissive="#a855f7" // purple-500
          emissiveIntensity={isTalking ? 2 : 0.5}
          wireframe={true}
          distort={0.3}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
}

// User uploaded actual GLB avatar
export function LoadedModel({ url, isTalking }: { url: string; isTalking: boolean }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const modelWrapperRef = useRef<THREE.Group>(null);
  const [pedestalY, setPedestalY] = useState(-1.5); // Dynamically computed floor height

  // Guarantee normalization of any arbitrary GLB model strictly in local space
  useEffect(() => {    
    if (!scene) return;

    // Use a detached clone strictly for measuring so parent groups (like scaling wrappers) don't distort World Matrix math
    const measureScene = scene.clone();
    measureScene.scale.set(1, 1, 1);
    measureScene.position.set(0, 0, 0);
    measureScene.rotation.set(0, -Math.PI / 2, 0);
    measureScene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(measureScene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim === 0 || !isFinite(maxDim)) return;

    // Normalize so largest dimension is exactly 3.0 units strictly relative to itself
    const targetScale = 3.0 / maxDim;
    measureScene.scale.setScalar(targetScale);
    measureScene.updateMatrixWorld(true);

    const box2 = new THREE.Box3().setFromObject(measureScene);
    const center = box2.getCenter(new THREE.Vector3());

    // Apply pure local transformations to the real active scene
    scene.scale.setScalar(targetScale);
    scene.position.set(-center.x, -center.y, -center.z);
    scene.rotation.set(0, -Math.PI / 2, 0);
    
    // The pedestal anchors exactly to the local computed bottom boundary
    setPedestalY(box2.min.y - center.y);

  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Safe, native exponential ease (frame-independent damping)
      const dampFactor = 1 - Math.exp(-6 * delta);

      // Subtle hovering/bobbing when talking
      const targetY = isTalking ? Math.sin(state.clock.elapsedTime * 15) * 0.05 : 0;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * dampFactor;
      
      // Combine idle sway with passive mouse cursor tracking
      // Invert pointer.y so positive Y (top of screen) creates negative X rotation (tilting model backwards to look "up")
      // Clamp the maximum backward tilt so we don't expose the ugly underside of the 3D pedestal
      const targetRotX = Math.max(-0.05, -(state.pointer.y * 0.4)); 
      const targetRotY = state.pointer.x * 1.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05; // greatly widened look left/right arc
      
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * dampFactor;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * dampFactor;
    }
  });

  return (
    <PresentationControls
      global
      rotation={[0, 0, 0]}
      polar={[-0.1, 0.1]} // Allow slight up-down tilt
      azimuth={[-Math.PI, Math.PI]} // Full 360 drag freedom side-to-side
      snap={true}
    >
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Mathematically normalized GLB */}
        <group ref={modelWrapperRef}>
          <primitive object={scene} />
        </group>
          
        {/* Soft Shadow baked below the model's computed floor plane */}
        <ContactShadows resolution={1024} position={[0, pedestalY + 0.01, 0]} opacity={0.6} scale={4} blur={2.5} far={2} />
        
        {/* Sci-Fi Premium Platform instantly snaps directly beneath the model's floor plane */}
        <group position={[0, pedestalY - 0.1, 0]}>
          <mesh receiveShadow>
            {/* Slightly reduced pedestal size to securely fit inside viewport bounds */}
            <cylinderGeometry args={[1.8, 2.0, 0.2, 64]} />
            <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.1} />
          </mesh>
          
          <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.6, 1.75, 64]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.55, 1.6, 64]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>
      </group>
    </PresentationControls>
  );
}
useGLTF.preload('/models/avatar.glb');

export function Avatar3D({ messages, isTalking }: Avatar3DProps) {
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Cast to the RefObject<Element> type framer-motion's viewport prop expects
  const viewportRoot = scrollContainerRef as React.RefObject<Element>;
  
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    // Exclusively scroll the inner chat container, NOT the global window
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTalking]);

  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
  const lastAssistantMessage = messages.slice().reverse().find(m => m.role === "assistant");
  const [spokenMessageId, setSpokenMessageId] = useState<string | null>(null);
  const [talking, setTalking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const processedTextRef = useRef("");
  const audioQueueRef = useRef<{ text: string; url?: string }[]>([]);
  const isPlayingRef = useRef(false);

  // Prefetch function to get audio ahead of time
  const prefetchChunk = async (index: number) => {
    const item = audioQueueRef.current[index];
    if (!item || item.url) return;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: item.text }),
      });
      if (response.ok) {
        const blob = await response.blob();
        item.url = URL.createObjectURL(blob);
      }
    } catch (e) {
      console.error("Prefetch error:", e);
    }
  };

  const playNextInQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setTalking(false);
      return;
    }

    isPlayingRef.current = true;
    const item = audioQueueRef.current.shift()!;
    
    try {
      // If not prefetched yet, fetch now
      let url = item.url;
      if (!url) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: item.text }),
        });
        if (response.ok) {
          const blob = await response.blob();
          url = URL.createObjectURL(blob);
        }
      }

      if (url) {
        const audio = new Audio(url);
        audioRef.current = audio;
        
        // Start prefetching the next one while this one plays
        if (audioQueueRef.current.length > 0) {
          prefetchChunk(0);
        }

        audio.onplay = () => setTalking(true);
        audio.onended = () => {
          URL.revokeObjectURL(url!);
          playNextInQueue();
        };
        audio.onerror = () => {
          setTalking(false);
          playNextInQueue();
        };
        
        await audio.play();
      } else {
        playNextInQueue();
      }
    } catch (e) {
      console.error("Queue Playback Error:", e);
      playNextInQueue();
    }
  };

  useEffect(() => {
    if (!lastAssistantMessage) {
      processedTextRef.current = "";
      return;
    }

    if (lastAssistantMessage.id !== spokenMessageId) {
      setSpokenMessageId(lastAssistantMessage.id);
      processedTextRef.current = "";
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      audioQueueRef.current.forEach(item => item.url && URL.revokeObjectURL(item.url));
      audioQueueRef.current = [];
      isPlayingRef.current = false;
      setTalking(false);
    }

    const fullContent = lastAssistantMessage.content;
    const unprocessed = fullContent.slice(processedTextRef.current.length);
    const sentenceBoundary = /[.!?](\s+|$)/.exec(unprocessed);
    const isFinished = !isTalking;

    if (sentenceBoundary || (isFinished && unprocessed.trim().length > 0)) {
       const chunkEndIndex = sentenceBoundary ? (sentenceBoundary.index + sentenceBoundary[0].length) : unprocessed.length;
       const textChunk = unprocessed.slice(0, chunkEndIndex).trim();

       if (textChunk.length > 0) {
         processedTextRef.current += unprocessed.slice(0, chunkEndIndex);
         const newItem = { text: textChunk };
         audioQueueRef.current.push(newItem);
         
         // Trigger prefetch for the new item immediately if we are already playing
         if (isPlayingRef.current) {
           prefetchChunk(audioQueueRef.current.length - 1);
         } else {
           playNextInQueue();
         }
       }
    }
  }, [lastAssistantMessage?.content, lastAssistantMessage?.id, isTalking, spokenMessageId]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Pulled camera back significantly to smoothly fit all pedestal geometry natively into frame limits */}
      <div className={`absolute inset-0 -translate-y-12 md:translate-y-0 transition-transform duration-[1000ms] ease-in-out ${messages.length > 0 ? 'md:translate-x-[12%]' : 'translate-x-0'}`}>
        <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
          <ambientLight intensity={2.5} />
          <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" castShadow />
          <pointLight position={[-10, 0, -10]} intensity={1.5} color="#a855f7" />
          <pointLight position={[10, 0, -10]} intensity={1.5} color="#06b6d4" />
          <Environment preset="city" />
          
          <React.Suspense fallback={<HologramCore isTalking={talking || isTalking || false} />}>
            <LoadedModel url="/models/avatar.glb" isTalking={talking || isTalking || false} />
          </React.Suspense>
        </Canvas>
      </div>
      {/* Holographic Chat HUD Overlay */}
      <div 
        className="absolute bottom-[5.5rem] md:bottom-32 left-0 w-full md:w-auto md:left-[4%] lg:left-[8%] max-w-[100%] md:max-w-[400px] flex flex-col justify-end items-start z-20 pointer-events-auto px-3 sm:px-4"
      >
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div 
          ref={scrollContainerRef}
          className="w-full flex flex-col gap-3 md:gap-4 max-h-[40vh] sm:max-h-[45vh] md:max-h-[55vh] overflow-y-auto overflow-x-hidden hide-scroll pb-2 pt-10"
          style={{
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,1) 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,1) 100%)",
          }}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx, arr) => {
              const isLong = msg.role === 'assistant' && msg.content.length > 200;
              const previewText = isLong 
                ? msg.content.substring(0, 180).replace(/[*#`_]/g, '') + "..."
                : msg.content;
                
              return (
                <motion.div
                  key={msg.id}
                  layout
                  // Entry animation
                  initial={{ opacity: 0, x: -30, scale: 0.95, y: 20 }}
                  // "resting" state: almost invisible mist to prevent clash with title text
                  animate={{ opacity: 0.01, scale: 0.92, x: 0, y: 0, filter: "blur(25px)" }}
                  // Active focus: crystal clear
                  whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  viewport={{ root: viewportRoot, once: false, amount: 0.5 }}
                  whileHover={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.85, filter: "blur(30px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`font-sans w-full shrink-0 rounded-2xl p-3 md:p-4 backdrop-blur-xl shadow-2xl pointer-events-auto flex flex-col ${
                    msg.role === 'user' 
                      ? 'bg-purple-900/40 border border-purple-500/30 text-white self-start rounded-tr-2xl md:rounded-tr-2xl rounded-tl-sm' 
                      : 'bg-[#050505]/90 border border-cyan-500/40 text-cyan-50 self-start rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                     <div className="flex gap-3 items-start overflow-hidden">
                       <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                       <div className="flex flex-col items-start pr-2 w-full">
                          {isLong ? (
                            <>
                              <p className="text-[13px] md:text-[14px] font-medium leading-relaxed">
                                {previewText}
                              </p>
                              <button 
                                onClick={() => setViewingMessage(msg)}
                                className="mt-3 text-cyan-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors bg-cyan-900/30 px-3 py-1.5 rounded-sm border border-cyan-500/30 w-full"
                              >
                                [+] Read Detailed Response
                              </button>
                            </>
                          ) : (
                            <div className="text-[13px] md:text-[14px] font-medium leading-relaxed prose prose-invert max-w-none prose-p:my-0 prose-ul:my-2 pr-3 w-full font-sans">
                               <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          )}
                       </div>
                     </div>
                  ) : (
                    <p className="text-[13px] md:text-[14px] font-medium leading-relaxed px-2">{msg.content}</p>
                  )}
                </motion.div>
              );
            })}
            
            {/* Active Typing Indicator */}
            {isTalking && messages[messages.length - 1]?.role === 'user' && (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -15, y: 10 }} 
                animate={{ opacity: 1, x: 0, y: 0 }} 
                className="bg-[#050505]/90 border border-cyan-500/40 text-cyan-50 self-start shrink-0 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-3 items-center backdrop-blur-xl shadow-2xl"
              >
                 <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
                 <div className="flex gap-1.5 h-4 items-center">
                    <motion.div className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pop-up Reading Dialog for Detailed Markdown Responses */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {viewingMessage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto"
            >
              {/* Absolute blur backdrop */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setViewingMessage(null)}
              />
              {/* Modal Body */}
              <motion.div 
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                className="relative w-full max-w-[800px] max-h-[85vh] bg-[#080808] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-y-auto flex flex-col"
              >
                <button 
                  onClick={() => setViewingMessage(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
                
                <div className="flex gap-4 items-center mb-6 sm:mb-8 border-b border-white/5 pb-4">
                   <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                   </div>
                   <div>
                     <h3 className="text-cyan-400 font-mono text-sm sm:text-base tracking-widest font-semibold uppercase">SYSTEM RESPONSE</h3>
                     <p className="text-white/40 text-xs tracking-wider">Detailed Output View</p>
                   </div>
                </div>
                
                <div className="font-sans text-[15px] sm:text-[16px] font-medium leading-relaxed prose prose-invert max-w-none prose-p:my-4 prose-ul:my-4 prose-li:my-1 prose-a:text-cyan-400 hover:prose-a:text-cyan-300 text-white/90">
                  <ReactMarkdown>{viewingMessage.content}</ReactMarkdown>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
