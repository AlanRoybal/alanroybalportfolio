import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { ProjectsHorizontal } from "@/components/sections/ProjectsHorizontal";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <ProjectsHorizontal />
      <Contact />
    </>
  );
}
