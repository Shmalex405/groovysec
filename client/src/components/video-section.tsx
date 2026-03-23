import * as React from "react";

export function VideoSection() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = React.useState(false);

  const handlePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      v.muted = false;
      v.volume = 1;
      v.controls = true;
      await v.play();
      setStarted(true);
    } catch {
      v.controls = true;
      setStarted(true);
    }
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          See Whiteout AI in Action
        </h2>

        <p className="text-slate-400 text-base mb-10 max-w-lg mx-auto">
          AI governance, prompt security, and auditability — built for enterprises in the modern world
        </p>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 shadow-2xl shadow-black/40">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-transparent to-emerald-500/10 rounded-2xl blur-xl pointer-events-none" />

          <div className="relative">
            <video
              ref={videoRef}
              src="/video/whiteout-ai.mp4"
              poster="/video/whiteout-poster.png"
              preload="metadata"
              playsInline
              className="w-full bg-black"
              onPlay={() => setStarted(true)}
            />

            {!started && (
              <button
                type="button"
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all duration-300 group"
                aria-label="Play video"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-white ml-0.5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600">

        </p>
      </div>
    </section>
  );
}
