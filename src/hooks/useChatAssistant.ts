import { useState, useCallback, useEffect } from 'react';
import knowledge from '@/data/knowledge.json';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  cards?: any[];
};

export function useChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: "Hi! I'm Ayushi's AI assistant. You can ask me about her background, projects, hackathons, or technical experience.",
      }
    ]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate network/AI delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    // Basic logic mapping
    const query = content.toLowerCase();
    let responseText = "";
    let sourceTag = "";
    let attachedCards: any[] = [];

    if (query.includes('project') || query.includes('build') || query.includes('hackathon')) {
      responseText = "Ayushi has built several projects. She won 1st place at two Outskill AI hackathons and has three products running in active production daily.";
      sourceTag = "from hackathons";
      attachedCards = (knowledge.hackathons as any[]);
    } else if (query.includes('merkri') || query.includes('agency') || query.includes('media')) {
      responseText = knowledge.merkriMedia.description + " " + knowledge.merkriMedia.offerings.join(', ');
      sourceTag = "from merkri_media";
    } else if (query.includes('skill') || query.includes('stack') || query.includes('tools')) {
      responseText = `Ayushi is skilled in: ${(knowledge.skills as string[]).join(', ')}.`;
      sourceTag = "from skills";
    } else if (query.includes('production') || query.includes('real world') || query.includes('live')) {
      responseText = "She has three products running in active production daily — a field sales tracker (10 companies, 50+ daily active reps), a carpenter loyalty platform (300+ carpenters), and The Tomorrow's Team community platform.";
      sourceTag = "from production_work";
      attachedCards = (knowledge.productionWork as any[]);
    } else {
      responseText = `I'm an AI assistant focused on Ayushi's professional portfolio. I'm not sure about that specifically, but you can ask me about her AI projects, hackathons, skills, or experience with Merkri Media!`;
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      source: sourceTag,
      cards: attachedCards,
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  }, []);

  return { messages, isTyping, sendMessage };
}
