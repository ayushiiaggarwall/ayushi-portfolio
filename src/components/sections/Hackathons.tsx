"use client";

import { motion } from "framer-motion";
import { Trophy, Clock } from "lucide-react";
import knowledge from "@/data/knowledge.json";

export function Hackathons() {
  return (
    <section className="py-24 px-4 md:px-6 bg-secondary/20 border-y border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Hackathons & High-Speed Execution
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Where ideas turn into working systems under extreme time constraints.
          </p>
        </div>

        <div className="relative border-l-2 border-border/50 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12">
          {knowledge.hackathons.map((hackathon, index) => (
            <motion.div
              key={hackathon.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline indicator */}
              <div className="absolute -left-[35px] md:-left-[51px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />

              <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h3 className="text-xl font-bold">{hackathon.title}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold whitespace-nowrap w-fit">
                    {hackathon.date}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
                  {hackathon.outcome}
                </p>
                <div className="flex gap-2 flex-wrap pt-1">
                  {hackathon.techStack?.map(tech => (
                    <span key={tech} className="text-xs text-foreground/70 font-medium px-2 py-0.5 bg-background border border-border/50 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
