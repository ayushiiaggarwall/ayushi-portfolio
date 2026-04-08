"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const phrases = [
  "What do you want to ask me today?",
  "Ask about my projects.",
  "Ask about my hackathons.",
  "Ask about Merkri Media.",
  "Ask about what is my favorite project.",
  "Ask about tools I have used."
];

export function TypewriterEffect() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <div className="h-8 md:h-10 flex items-center justify-center relative w-full mb-6">
      <p className="text-xl md:text-2xl text-muted-foreground font-medium text-center">
        {text}
        <motion.span 
          animate={{ opacity: [1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-[2px] h-6 md:h-7 bg-primary ml-1 align-middle"
        />
      </p>
    </div>
  );
}
