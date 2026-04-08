import { Header } from "@/components/layout/Header";
import { ProjectConstellation3D } from "@/components/sections/ProjectConstellation3D";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30">
      <Header />
      <main className="flex-1 ">
        <ProjectConstellation3D />
      </main>
    </div>
  );
}
