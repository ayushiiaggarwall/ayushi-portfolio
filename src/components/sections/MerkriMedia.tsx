"use client";

import { motion } from "framer-motion";
import { Briefcase, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import knowledge from "@/data/knowledge.json";

export function MerkriMedia() {
  const { merkriMedia } = knowledge;

  return (
    <section className="py-24 px-4 md:px-6 bg-secondary/10 border-y border-border/50 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight flex items-center gap-3">
              <Briefcase className="w-10 h-10 text-primary" />
              {merkriMedia.title}
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium">
                {merkriMedia.description}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-border/50 bg-background/50 backdrop-blur shadow-2xl">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary block mb-2">Core Offerings</span>
                  <ul className="text-lg font-bold space-y-2">
                    {merkriMedia.offerings.map((offer, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-accent" />
                        {offer}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
