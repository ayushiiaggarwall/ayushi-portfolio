"use client";

import { useEffect, useRef } from "react";
import { Send, Sparkles, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Message } from "ai/react";

interface ChatBoxProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error?: Error;
}

export function ChatBox({ messages, input, handleInputChange, handleSubmit, isLoading, error }: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0 || error !== undefined;

  useEffect(() => {
    if (messagesEndRef.current && hasMessages) {
      // Find the specific viewport to scroll, avoiding window-level scroll side effects
      const viewport = messagesEndRef.current.closest('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      } else {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [messages, isLoading, hasMessages]);

  return (
    <div className="font-mono flex flex-col h-full w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative min-h-0">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />
      
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-white/5 relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono font-medium text-white/80">system.ai_assistant</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 min-h-0 w-full overflow-hidden px-4 py-4 relative z-10">
          {!hasMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70 mt-20">
              <Sparkles className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-medium text-white">Ask me anything</h3>
              <p className="text-xs text-white/50 mt-2 max-w-[200px]">
                I am Ayushi's AI agent. I can help navigate her projects, skills, and portfolio.
              </p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex flex-col items-center justify-center shrink-0 mt-1">
                        <Sparkles className="w-3 h-3 text-cyan-300" />
                      </div>
                    )}
                    <div
                      className={
                        msg.role === "user"
                          ? "px-4 py-2 rounded-2xl rounded-tr-sm text-[14px] bg-purple-500/20 border border-purple-500/30 text-white/90 max-w-[85%] font-sans"
                          : "px-4 py-3 rounded-2xl rounded-tl-sm text-[14px] border border-white/10 bg-black/40 text-white/80 w-full prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 font-sans"
                      }
                    >
                      {msg.role === "assistant" ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && messages[messages.length - 1]?.role === 'user' && !error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start w-full">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-white/10 bg-black/40 flex items-center gap-1.5 h-[46px]">
                      <motion.div className="w-1.5 h-1.5 bg-white/40 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-white/40 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-white/40 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent relative z-10 shrink-0">
        <form onSubmit={handleSubmit} className="relative w-full rounded-xl border border-white/10 bg-black/50 focus-within:ring-1 focus-within:ring-cyan-500/50 flex items-center p-1.5 shadow-inner backdrop-blur-md">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="font-sans border-0 focus-visible:ring-0 shadow-none text-sm text-white bg-transparent px-3 py-2 placeholder:text-white/30 h-auto"
          />
          <Button type="submit" size="icon" className="rounded-lg shrink-0 w-8 h-8 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
