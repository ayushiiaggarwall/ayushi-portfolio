"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import knowledge from "@/data/knowledge.json";

export function FeaturedProjects() {
  return (
    <section className="py-24 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="space-y-4 mb-12 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Featured Work</h2>
        <p className="text-muted-foreground max-w-2xl">
          A selection of projects where I merged technical engineering with deep product intuition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {knowledge.featuredProjects?.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col hover:border-primary/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">{project.metrics?.[0]}</span>
              </div>
              <p className="text-sm mb-4 leading-relaxed line-clamp-3 md:line-clamp-none flex-1 text-muted-foreground">
                {project.summary}
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map(tool => (
                    <Badge key={tool} variant="secondary" className="bg-secondary/50 font-normal">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
