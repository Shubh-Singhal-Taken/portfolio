import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import LoadingScreen from "./components/fx/LoadingScreen";
import NeuralField from "./components/fx/NeuralField";
import CursorGlow from "./components/fx/CursorGlow";
import CommandPalette from "./components/CommandPalette";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Marquee from "./components/sections/Marquee";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Achievements from "./components/sections/Achievements";
import Journey from "./components/sections/Journey";
import Contact from "./components/sections/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <LoadingScreen done={!loading} />
      <Toaster position="top-right" theme="dark" richColors />
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

      <div className="app-bg" aria-hidden="true">
        <NeuralField />
        <div className="bg-ambient" />
        <div className="bg-grain" />
        <div className="bg-vignette" />
      </div>
      <CursorGlow />

      <div className="shell">
        <Header onOpenCommand={() => setCmdOpen(true)} />
        <main id="main">
          <Hero />
          <Marquee />
          <About />
          <Skills />
          <Projects />
          <Achievements />
          <Journey />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
