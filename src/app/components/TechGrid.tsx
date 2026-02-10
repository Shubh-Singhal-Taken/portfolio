export function TechGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Hexagon pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
              <polygon 
                points="25,0 50,12.5 50,37.5 25,50 0,37.5 0,12.5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-cyan-500"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <line x1="0" y1="50" x2="50" y2="50" stroke="currentColor" className="text-cyan-500" strokeWidth="2" />
          <line x1="50" y1="0" x2="50" y2="50" stroke="currentColor" className="text-cyan-500" strokeWidth="2" />
          <circle cx="50" cy="50" r="4" fill="currentColor" className="text-cyan-400 animate-pulse" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <line x1="150" y1="50" x2="200" y2="50" stroke="currentColor" className="text-purple-500" strokeWidth="2" />
          <line x1="150" y1="0" x2="150" y2="50" stroke="currentColor" className="text-purple-500" strokeWidth="2" />
          <circle cx="150" cy="50" r="4" fill="currentColor" className="text-purple-400 animate-pulse" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <line x1="0" y1="150" x2="50" y2="150" stroke="currentColor" className="text-purple-500" strokeWidth="2" />
          <line x1="50" y1="150" x2="50" y2="200" stroke="currentColor" className="text-purple-500" strokeWidth="2" />
          <circle cx="50" cy="150" r="4" fill="currentColor" className="text-purple-400 animate-pulse" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <line x1="150" y1="150" x2="200" y2="150" stroke="currentColor" className="text-cyan-500" strokeWidth="2" />
          <line x1="150" y1="150" x2="150" y2="200" stroke="currentColor" className="text-cyan-500" strokeWidth="2" />
          <circle cx="150" cy="150" r="4" fill="currentColor" className="text-cyan-400 animate-pulse" />
        </svg>
      </div>
    </div>
  );
}
