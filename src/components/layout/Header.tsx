"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Mail } from "lucide-react";

const links = {
  github: "https://github.com/ayushiiaggarwall",
  linkedin: "https://www.linkedin.com/in/ayushiiaggarwall/",
  email: "ayushi@merkri.media",
};

export function Header() {
  const pathname = usePathname();

  return (
    <header className="font-mono sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md shadow-sm shadow-black/50">
      <div className="container mx-auto max-w-6xl flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className={`font-bold tracking-tight transition-colors hover:text-cyan-400 ${pathname === '/' ? 'text-cyan-400' : 'text-white'}`}>Ayushi.</Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 mr-4">
          <Link href="/projects" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === '/projects' ? 'text-cyan-400' : 'text-white/60'}`}>Projects</Link>
          <Link href="/experience" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === '/experience' ? 'text-cyan-400' : 'text-white/60'}`}>Experience</Link>
          <Link href="/about" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${pathname === '/about' ? 'text-cyan-400' : 'text-white/60'}`}>About</Link>
        </nav>
        <nav className="flex items-center gap-4">
          <Link href={links.github} target="_blank" className="text-white/60 hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </Link>
          <Link href={links.linkedin} target="_blank" className="text-white/60 hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </Link>
          <Link href={`mailto:${links.email}`} className="text-white/60 hover:text-cyan-400 transition-colors">
            <Mail className="w-4 h-4" />
          </Link>

        </nav>
      </div>
    </header>
  );
}
