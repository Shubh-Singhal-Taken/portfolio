export function CircuitBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Horizontal lines */}
            <line x1="0" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
            <line x1="70" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
            
            {/* Vertical lines */}
            <line x1="30" y1="0" x2="30" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
            <line x1="70" y1="20" x2="70" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
            <line x1="30" y1="50" x2="30" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
            
            {/* More lines */}
            <line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
            <line x1="0" y1="80" x2="30" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
            <line x1="70" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
            
            {/* Circuit nodes */}
            <circle cx="30" cy="20" r="2" fill="currentColor" className="text-cyan-400" />
            <circle cx="70" cy="20" r="2" fill="currentColor" className="text-cyan-400" />
            <circle cx="30" cy="50" r="2" fill="currentColor" className="text-purple-400" />
            <circle cx="70" cy="50" r="2" fill="currentColor" className="text-purple-400" />
            <circle cx="30" cy="80" r="2" fill="currentColor" className="text-cyan-400" />
            <circle cx="70" cy="80" r="2" fill="currentColor" className="text-cyan-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
}
