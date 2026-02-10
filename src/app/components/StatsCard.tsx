import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatsCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function StatsCard({ icon: Icon, value, label, suffix = "", duration = 2000 }: StatsCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      <div className="relative bg-[#0f0f23]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl border border-cyan-500/30">
            <Icon className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
        <div className="text-3xl font-mono mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {count}{suffix}
        </div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  );
}
