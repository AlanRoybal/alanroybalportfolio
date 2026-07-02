import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { ProjectsHorizontal } from "@/components/sections/ProjectsHorizontal";
import { Contact } from "@/components/sections/Contact";
import { ScrollCharm } from "@/components/effects/ScrollCharm";
import { SectionSeam } from "@/components/effects/SectionSeam";

export default function Home() {
  return (
    <>
      <Hero />
      <SectionSeam variant="cores" prev="base" next="tint" />
      <About />
      <SectionSeam variant="monoliths" prev="tint" next="base" />
      <Experience />
      <SectionSeam variant="terminal" prev="base" next="base" />
      <ProjectsHorizontal />
      <SectionSeam variant="planes" prev="base" next="tint" />
      <Contact />
      <ScrollCharm />
    </>
  );
}
