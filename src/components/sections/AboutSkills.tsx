"use client";

import { motion } from "framer-motion";
import { User, Code2 } from "lucide-react";
import knowledge from "@/data/knowledge.json";

export function AboutSkills() {
  return (
    <section className="py-24 px-4 md:px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
          <User className="w-8 h-8 text-primary" />
          About Ayushi
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
          <p className="text-xl font-bold text-foreground">{knowledge.bio.tagline}</p>
          <p className="text-foreground font-medium">{knowledge.bio.description}</p>
          <p className="pt-4 text-primary font-medium">{knowledge.bio.brandBuilder}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
          <Code2 className="w-8 h-8 text-primary" />
          Toolkit
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 pt-4"
        >
          {knowledge.skills.map(skill => (
            <span key={skill} className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg shadow-sm border border-border/40">
              {skill}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
