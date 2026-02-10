import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const navItems = [
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Experience", id: "experience" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-cyan-500/20'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xl group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <span className="font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              shubhsinghal.in
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-gray-300 hover:text-cyan-400 transition-colors relative group"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 bg-cyan-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform"></div>
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300"
            >
              Hire Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-cyan-500/20">
            <div className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-3 text-left text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('contact')}
                className="mt-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-center hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300"
              >
                Hire Me
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}