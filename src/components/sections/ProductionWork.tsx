"use client";

import { motion } from "framer-motion";
import { Server, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import knowledge from "@/data/knowledge.json";

export function ProductionWork() {
  return (
    <section className="py-24 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="space-y-4 mb-12 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
          <Server className="w-8 h-8 text-primary" />
          Production Work
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Shipping features beyond local environments. Systems built for real users and real business impact.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {knowledge.productionWork?.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 md:p-8 hover:bg-card/80 transition-colors border-l-4 border-l-primary">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <Activity className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{work.client}</h3>
                  <p className="text-sm font-medium text-primary">{work.summary}</p>
                  <p className="text-foreground/90 leading-relaxed max-w-4xl">
                    {work.impact}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {work.techStack?.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
