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
        <h2 className="text-3xl font-bold text-[#0F1B2D] mb-3 tracking-tight">
          See Whiteout AI in Action
        </h2>

        <p className="text-[#51617A] text-base mb-10 max-w-lg mx-auto">
          AI governance, prompt security, and auditability — built for enterprises in the modern world
        </p>

        <div className="relative overflow-hidden rounded-xl border border-[#0F1B2D]/10 bg-[#0B1218] shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]">
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
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/15 border border-white/25 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 shadow-lg">
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

      </div>
    </section>
  );
}
