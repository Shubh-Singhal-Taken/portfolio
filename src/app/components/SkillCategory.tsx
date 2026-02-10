import { LucideIcon } from "lucide-react";

interface Skill {
  name: string;
  icon: LucideIcon;
}

interface SkillCategoryProps {
  title: string;
  skills: Skill[];
}

export function SkillCategory({ title, skills }: SkillCategoryProps) {
  return (
    <div className="relative group h-full">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      
      <div className="relative bg-[#0f0f23]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-purple-400 transition-all duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-white font-mono">{title}</h3>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="relative group/skill"
            >
              {/* Skill card glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-md opacity-0 group-hover/skill:opacity-40 transition-opacity duration-300"></div>
              
              <div className="relative flex flex-col items-center gap-2 p-4 rounded-xl bg-black/30 border border-cyan-500/20 hover:border-cyan-400 hover:bg-black/50 transition-all group-hover/skill:scale-105 duration-300">
                <div className="relative">
                  <skill.icon className="w-8 h-8 text-cyan-400 group-hover/skill:scale-110 transition-transform" />
                  {/* Icon glow */}
                  <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-0 group-hover/skill:opacity-50 transition-opacity"></div>
                </div>
                <span className="text-xs text-center text-gray-300 group-hover/skill:text-white transition-colors font-mono">{skill.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
}
