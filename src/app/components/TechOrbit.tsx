import { Cpu, Wifi, Brain, Zap, Layers, Database } from "lucide-react";

export function TechOrbit() {
  const icons = [
    { Icon: Cpu, delay: "0s" },
    { Icon: Wifi, delay: "1s" },
    { Icon: Brain, delay: "2s" },
    { Icon: Zap, delay: "3s" },
    { Icon: Layers, delay: "4s" },
    { Icon: Database, delay: "5s" },
  ];

  return (
    <div className="relative w-[500px] h-[500px] mx-auto">
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
        <div className="w-28 h-28 bg-[#0a0a1a] rounded-full flex items-center justify-center">
          <Zap className="w-12 h-12 text-cyan-400" />
        </div>
      </div>

      {/* Orbiting circles */}
      {icons.map(({ Icon, delay }, index) => (
        <div
          key={index}
          className="absolute top-1/2 left-1/2 w-full h-full animate-spin"
          style={{
            animationDuration: "20s",
            animationDelay: delay,
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-xl rounded-full border border-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform">
            <Icon className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      ))}

      {/* Orbit rings */}
      <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
      <div className="absolute inset-8 border border-purple-500/20 rounded-full"></div>
      <div className="absolute inset-16 border border-cyan-500/10 rounded-full"></div>
    </div>
  );
}
