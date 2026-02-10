import { ExternalLink, Github, Zap } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export function ProjectCard({ title, description, image, tags, githubUrl, liveUrl }: ProjectCardProps) {
  return (
    <div className="group relative h-full">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
      
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#0f0f23]/80 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 flex flex-col">
        {/* Image with overlay */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Tech grid overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent"></div>
          
          {/* Status indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-mono">ACTIVE</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title with icon */}
          <div className="flex items-start gap-2 mb-3">
            <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
            <h3 className="text-xl text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
          </div>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-md font-mono hover:bg-cyan-500/20 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Links */}
          <div className="flex gap-3 pt-4 border-t border-cyan-500/20">
            {githubUrl && (
              <a
                href={githubUrl}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono group/link"
              >
                <Github className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                Code
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors font-mono group/link"
              >
                <ExternalLink className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                Demo
              </a>
            )}
            {!githubUrl && !liveUrl && (
              <span className="flex-1 text-xs text-gray-500 font-mono">In Development</span>
            )}
          </div>
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <line x1="100" y1="0" x2="100" y2="30" stroke="currentColor" className="text-cyan-500" strokeWidth="2" />
            <line x1="70" y1="0" x2="100" y2="0" stroke="currentColor" className="text-cyan-500" strokeWidth="2" />
            <circle cx="100" cy="0" r="3" fill="currentColor" className="text-cyan-400" />
          </svg>
        </div>
      </div>
    </div>
  );
}
