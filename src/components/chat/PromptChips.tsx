import { motion } from 'framer-motion';
import { Lightbulb, Code2, PenTool, LayoutDashboard, Database } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { text: "Show me AI projects", icon: <Code2 className="w-4 h-4" /> },
  { text: "Hackathon wins", icon: <Lightbulb className="w-4 h-4" /> },
  { text: "Tell me about Merkri Media", icon: <Database className="w-4 h-4" /> },
  { text: "Technical skills", icon: <PenTool className="w-4 h-4" /> },
  { text: "Production work", icon: <LayoutDashboard className="w-4 h-4" /> },
];

export function PromptChips({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3 mt-6 justify-center w-full max-w-3xl">
      {SUGGESTED_PROMPTS.map((prompt, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(prompt.text)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-foreground hover:bg-secondary border border-border/60 rounded-full transition-all shadow-sm hover:shadow-md font-medium"
        >
          <span className="text-muted-foreground">{prompt.icon}</span>
          {prompt.text}
        </motion.button>
      ))}
    </div>
  );
}
