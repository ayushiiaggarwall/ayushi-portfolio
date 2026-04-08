import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30">
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
      </main>
    </div>
  );
}
