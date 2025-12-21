import * as React from "react";

export function VideoSection() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = React.useState(false);

  const handlePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      // Standard playback: sound + controls
      v.muted = false;
      v.volume = 1;
      v.controls = true;

      await v.play();
      setStarted(true);
    } catch {
      // Even if play() is blocked for some reason, showing controls lets user start
      v.controls = true;
      setStarted(true);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-semibold text-slate-900 mb-3">
          See Whiteout AI in Action
        </h2>

        <p className="text-slate-600 text-lg mb-10">
          AI governance, prompt security, and auditability -- Built for enterprises in the moden world
        </p>

        <div className="relative overflow-hidden rounded-xl shadow-2xl">
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
              className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition"
              aria-label="Play video"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 shadow">
                <svg
                  viewBox="0 0 24 24"
                  className="w-9 h-9 text-slate-900 ml-1"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-500">
        
        </p>
      </div>
    </section>
  );
}