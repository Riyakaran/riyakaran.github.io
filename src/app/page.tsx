import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Nav from "@/components/Nav";
import Portfolio from "@/components/Portfolio";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Portfolio />
        <Contact />
      </main>
    </>
  );
}
