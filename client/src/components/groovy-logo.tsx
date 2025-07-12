interface GroovyLogoProps {
  className?: string;
  showText?: boolean;
}

export function GroovyLogo({ className = "h-8 w-8", showText = true }: GroovyLogoProps) {
  return (
    <div className="flex items-center">
      <svg 
        className={className} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring - Blue */}
        <circle cx="50" cy="50" r="45" fill="#1E88E5" />
        
        {/* Middle ring - Green */}
        <circle cx="50" cy="50" r="30" fill="#4CAF50" />
        
        {/* Inner ring - Orange */}
        <circle cx="50" cy="50" r="15" fill="#FF9800" />
        
        {/* Center dot - White */}
        <circle cx="50" cy="50" r="6" fill="white" />
        
        {/* Geometric pattern */}
        <g transform="translate(50,50)">
          {/* Blue triangles */}
          <path d="M0,-35 L10,-25 L-10,-25 Z" fill="white" opacity="0.3" />
          <path d="M0,35 L10,25 L-10,25 Z" fill="white" opacity="0.3" />
          <path d="M35,0 L25,10 L25,-10 Z" fill="white" opacity="0.3" />
          <path d="M-35,0 L-25,10 L-25,-10 Z" fill="white" opacity="0.3" />
          
          {/* Green triangles */}
          <path d="M0,-20 L6,-14 L-6,-14 Z" fill="white" opacity="0.4" />
          <path d="M0,20 L6,14 L-6,14 Z" fill="white" opacity="0.4" />
          <path d="M20,0 L14,6 L14,-6 Z" fill="white" opacity="0.4" />
          <path d="M-20,0 L-14,6 L-14,-6 Z" fill="white" opacity="0.4" />
        </g>
      </svg>
      {showText && (
        <div className="ml-3 text-xl font-bold text-slate-900">
          Groovy Security
        </div>
      )}
    </div>
  );
}
