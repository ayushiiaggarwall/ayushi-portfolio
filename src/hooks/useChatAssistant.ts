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

    if (query.includes('project') || query.includes('build')) {
      responseText = "Ayushi has built several projects, focusing on full-stack AI system design and practical deployment. Here are some of her featured projects:";
      sourceTag = "from projects";
      attachedCards = knowledge.projects;
    } else if (query.includes('hackathon')) {
      responseText = "Ayushi thrives in fast-paced environments like hackathons. She has participated in several, often turning ideas into working systems within 48 hours.";
      sourceTag = "from hackathons";
      attachedCards = knowledge.hackathons;
    } else if (query.includes('merkri') || query.includes('agency') || query.includes('media')) {
      responseText = knowledge.merkri_media.summary + " " + knowledge.merkri_media.why_it_matters;
      sourceTag = "from merkri_media";
    } else if (query.includes('skill') || query.includes('stack') || query.includes('tools')) {
      responseText = `Ayushi is highly skilled in Engineering (${knowledge.skills.engineering.join(', ')}), AI Tools (${knowledge.skills.ai_tools.join(', ')}), and Product & Growth.`;
      sourceTag = "from skills";
    } else if (query.includes('problem') || query.includes('like solving')) {
      responseText = knowledge.faqs.find(f => f.question.includes('problems'))?.answer || "She loves solving complex UX and engineering problems.";
      sourceTag = "from faqs";
    } else if (query.includes('strong builder') || query.includes('why')) {
      responseText = knowledge.faqs.find(f => f.question.includes('strong builder'))?.answer || "She has a rare combination of robust engineering skills and product intuition.";
      sourceTag = "from faqs";
    } else if (query.includes('production') || query.includes('real world')) {
      responseText = "She has deployed real-world applications, such as the Automated Client Onboarding System for Merkri Media, which reduced manual verification time by 90%.";
      sourceTag = "from production_work";
      attachedCards = knowledge.production_work;
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
