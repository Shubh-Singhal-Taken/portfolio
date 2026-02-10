import { Calendar } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  organization: string;
  period: string;
  description: string;
  icon: React.ReactNode;
}

export function ExperienceCard({ title, organization, period, description, icon }: ExperienceCardProps) {
  return (
    <div className="relative pl-10 pb-12 border-l-2 border-cyan-500/30 last:pb-0 group">
      {/* Glowing line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
      
      {/* Icon */}
      <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-opacity"></div>
        <div className="relative">{icon}</div>
      </div>
      
      {/* Content */}
      <div className="relative group/card">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-xl opacity-0 group-hover/card:opacity-20 transition-opacity duration-500"></div>
        <div className="relative bg-[#0f0f23]/80 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400 transition-all duration-300">
          {/* Title and organization */}
          <div className="mb-3">
            <h3 className="text-lg text-white mb-1 group-hover/card:text-cyan-400 transition-colors">{title}</h3>
            <p className="text-cyan-400 text-sm font-mono">{organization}</p>
          </div>
          
          {/* Period */}
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-4 font-mono">
            <Calendar className="w-3 h-3" />
            <span>{period}</span>
            <div className="ml-auto flex gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

          {/* Corner decoration */}
          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <line x1="100" y1="100" x2="100" y2="70" stroke="currentColor" className="text-cyan-500" strokeWidth="2" />
              <line x1="70" y1="100" x2="100" y2="100" stroke="currentColor" className="text-cyan-500" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
