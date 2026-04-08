"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function Showcase() {
  const [filter, setFilter] = useState("All");

  const showcaseItems = [
    {
      title: "Field Sales Tracker",
      category: "Advanced Apps",
      gradient: "from-blue-200 via-blue-100 to-white",
      id: "field"
    },
    {
      title: "Deep Research Assistant",
      category: "AI Tools",
      gradient: "from-purple-200 via-violet-100 to-white",
      id: "deep"
    },
    {
      title: "Travel Ease",
      category: "Consumer Apps",
      gradient: "from-emerald-200 via-teal-100 to-white",
      id: "travel"
    },
    {
      title: "Ply House Loyalty",
      category: "B2B Platforms",
      gradient: "from-amber-200 via-orange-100 to-white",
      id: "loyalty"
    }
  ];

  const filteredItems = filter === "All" ? showcaseItems : showcaseItems.filter(i => i.category === filter);

  return (
    <section className="py-24 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight inline-flex items-center gap-2">
          Showcase
        </h2>
        <p className="text-muted-foreground mt-2">
          Explore what is being built in production.
        </p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {["All", "Advanced Apps", "AI Tools", "B2B Platforms", "Consumer Apps"].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-sm font-semibold rounded-full shrink-0 transition-colors ${filter === cat ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:bg-secondary border border-border/50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer flex flex-col gap-4"
            >
              {/* Replace block with real images when provided */}
              <div className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${item.gradient} relative overflow-hidden border border-border/60 group-hover:border-primary/40 transition-all shadow-sm group-hover:shadow-md`}>
                
                {/* Fallback pattern underneath */}
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <h3 className="text-foreground/80 font-serif text-2xl md:text-3xl font-bold tracking-tight px-6 text-center group-hover:scale-105 transition-transform duration-500 z-0">
                    {item.title}
                  </h3>
                </div>

                {/* Primary Image Overlay (If present in public directory) */}
                <img 
                  src={`/images/projects/${item.id}.png`} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105" 
                  onError={(e) => { e.currentTarget.style.display = 'none' }} 
                />

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur flex items-center justify-center shadow-sm text-foreground">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="px-1">
                <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {item.category}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
