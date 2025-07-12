interface GroovyLogoProps {
  className?: string;
  showText?: boolean;
}

export function GroovyLogo({ className = "h-8 w-8", showText = true }: GroovyLogoProps) {
  return (
    <div className="flex items-center">
      <img
        src="/transparent_logo.png"
        alt="Groovy Logo"
        className={className}
      />
      {showText && (
        <img
          src="/textonly_nobuffer.png"
          alt="Groovy Security"
          className="ml-3 h-6 md:h-8 object-contain"
        />
      )}
    </div>
  );
}
