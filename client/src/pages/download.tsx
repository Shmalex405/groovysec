import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  PageTransition,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
  HeroTextReveal,
  HeroLine,
} from "@/components/motion";
import {
  Download,
  Monitor,
  Shield,
  Globe,
  Code,
  Package,
  Apple,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";

// ── Download configuration ──────────────────────────────────────────────
// CloudFront CDN base for all update artifacts
const CDN_BASE = "https://updates.groovysec.com";

// Current versions — update these when new releases are published
const VERSIONS = {
  desktop: "2.0.39",
  interceptor: "1.0.56",
  desktopGuardWindows: "1.0.57",
  windowsDesktop: "1.0.84",
  bundledInstaller: "1.0.0",
};

const DOWNLOADS = {
  "whiteout-desktop": {
    name: "Whiteout AI",
    description: "The secure AI platform with built-in governance, policy enforcement, and an isolated internal AI source for sensitive prompts.",
    icon: Monitor,
    color: "blue",
    platforms: {
      "macos-arm64": {
        label: "macOS (Apple Silicon)",
        url: `${CDN_BASE}/latest/WhiteoutAI-mac-arm64-${VERSIONS.desktop}.dmg`,
        ext: ".dmg",
      },
      "macos-x64": {
        label: "macOS (Intel)",
        url: `${CDN_BASE}/latest/WhiteoutAI-mac-arm64-${VERSIONS.desktop}.dmg`,
        ext: ".dmg",
      },
      "windows-x64": {
        label: "Windows",
        url: `${CDN_BASE}/latest/WhiteoutAI-Setup-${VERSIONS.windowsDesktop}.exe`,
        ext: ".exe",
      },
    },
  },
  "desktop-guard": {
    name: "Desktop Guard",
    description: "Real-time overlay monitoring for desktop AI applications. Scans prompts against your organization's policies before they're sent.",
    icon: Shield,
    color: "green",
    platforms: {
      "macos-arm64": {
        label: "macOS",
        url: `${CDN_BASE}/interceptor/Whiteout%20Interceptor-${VERSIONS.interceptor}-arm64.dmg`,
        ext: ".dmg",
      },
      "windows-x64": {
        label: "Windows",
        url: `${CDN_BASE}/interceptor-windows/latest/Whiteout.DesktopGuard-Setup-${VERSIONS.desktopGuardWindows}.exe`,
        ext: ".exe",
      },
    },
  },
  "browser-extension": {
    name: "Browser Extension",
    description: "Real-time prompt scanning for web-based AI tools. Enforces policies directly in your browser across ChatGPT, Claude, Gemini, and more.",
    icon: Globe,
    color: "purple",
    stores: {
      chrome: {
        label: "Chrome Web Store",
        url: "https://chromewebstore.google.com/detail/whiteout-ai/dcbndpnolggjgmclalpdcogigpedlhpn",
        available: true,
      },
      firefox: {
        label: "Firefox Add-ons",
        url: "https://addons.mozilla.org/en-US/firefox/addon/whiteout-ai/",
        available: true,
      },
      edge: {
        label: "Edge Add-ons",
        url: "https://microsoftedge.microsoft.com/addons",
        available: false,
      },
      safari: {
        label: "Safari Extensions",
        url: "https://apps.apple.com",
        available: false,
      },
    },
  },
  "ide-extension": {
    name: "IDE Extension",
    description: "AI governance for your development environment. Monitor and enforce policies on AI coding assistants like Copilot, Cursor, and Claude Code.",
    icon: Code,
    color: "orange",
    stores: {
      vscode: {
        label: "VS Code Marketplace",
        url: "vscode:extension/groovysecurity.whiteout-ai-governance",
        webUrl: "https://marketplace.visualstudio.com/items?itemName=groovysecurity.whiteout-ai-governance",
        available: true,
      },
      jetbrains: {
        label: "JetBrains Marketplace",
        url: "https://plugins.jetbrains.com/plugin/com.groovysecurity.whiteout",
        available: true,
      },
    },
  },
  "bundled-installer": {
    name: "Bundled Setup",
    description: "Install everything at once. Downloads and installs Whiteout AI, Desktop Guard, and opens links for browser and IDE extensions.",
    icon: Package,
    color: "slate",
    platforms: {
      "macos-arm64": {
        label: "macOS (Apple Silicon)",
        url: `${CDN_BASE}/installer/latest/WhiteoutAI-Bundled-Setup-mac-${VERSIONS.bundledInstaller}.dmg`,
        ext: ".dmg",
      },
      "macos-x64": {
        label: "macOS (Intel)",
        url: `${CDN_BASE}/installer/latest/WhiteoutAI-Bundled-Setup-mac-${VERSIONS.bundledInstaller}.dmg`,
        ext: ".dmg",
      },
      "windows-x64": {
        label: "Windows",
        url: `${CDN_BASE}/installer/latest/Whiteout%20AI%20Bundled%20Setup.exe`,
        ext: ".exe",
      },
    },
  },
} as const;

// ── OS Detection ────────────────────────────────────────────────────────
type Platform = "macos-arm64" | "macos-x64" | "windows-x64";

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows-x64";
  // Default to arm64 for modern Macs — users can switch via dropdown
  return "macos-arm64";
}

function detectBrowser(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("edg/")) return "edge";
  if (ua.includes("firefox")) return "firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "safari";
  return "chrome";
}

// ── Color helpers ───────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; text: string; iconBg: string; border: string; hoverBorder: string }> = {
  blue: {
    bg: "bg-blue-600",
    text: "text-blue-400",
    iconBg: "bg-blue-500/10",
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-400",
  },
  green: {
    bg: "bg-emerald-600",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-400",
  },
  purple: {
    bg: "bg-purple-600",
    text: "text-purple-400",
    iconBg: "bg-purple-500/10",
    border: "border-purple-500/20",
    hoverBorder: "hover:border-purple-400",
  },
  orange: {
    bg: "bg-orange-600",
    text: "text-orange-400",
    iconBg: "bg-orange-500/10",
    border: "border-orange-500/20",
    hoverBorder: "hover:border-orange-400",
  },
  slate: {
    bg: "bg-slate-800",
    text: "text-slate-300",
    iconBg: "bg-slate-500/10",
    border: "border-white/[0.08]",
    hoverBorder: "hover:border-slate-500",
  },
};

// ── Component ───────────────────────────────────────────────────────────
export default function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>("macos-arm64");
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const browser = useMemo(() => detectBrowser(), []);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const platformLabel =
    platform === "macos-arm64"
      ? "macOS (Apple Silicon)"
      : platform === "macos-x64"
        ? "macOS (Intel)"
        : "Windows";

  const isMac = platform.startsWith("macos");

  return (
    <PageTransition>
      <AuroraBackground variant="bluegreen" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                  Download{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    Whiteout AI
                  </span>
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-xl text-slate-300 max-w-2xl mb-8">
                  Get your entire organization set up with secure AI governance.
                  Install individually or use the bundled setup to get everything at once.
                </p>
              </HeroLine>
            </HeroTextReveal>

            <ScrollReveal>
              {/* Platform selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm text-slate-400">Detected platform:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowPlatformMenu(!showPlatformMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/15 transition-colors"
                  >
                    {isMac ? (
                      <Apple className="w-4 h-4" />
                    ) : (
                      <Monitor className="w-4 h-4" />
                    )}
                    {platformLabel}
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showPlatformMenu && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-50">
                      {(
                        [
                          ["macos-arm64", "macOS (Apple Silicon)"],
                          ["macos-x64", "macOS (Intel)"],
                          ["windows-x64", "Windows"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setPlatform(key);
                            setShowPlatformMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            platform === key
                              ? "text-blue-400 bg-blue-600/10"
                              : "text-slate-300 hover:bg-white/5"
                          }`}
                        >
                          {platform === key && (
                            <CheckCircle2 className="w-3.5 h-3.5 inline mr-2" />
                          )}
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bundled installer CTA */}
              <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/30 rounded-2xl p-6 max-w-2xl">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Install Everything at Once
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                      The bundled setup installs Whiteout AI and Desktop Guard, then
                      guides you through browser and IDE extension setup.
                    </p>
                    <a
                      href={
                        DOWNLOADS["bundled-installer"].platforms[
                          platform === "macos-x64" ? "macos-x64" : platform
                        ]?.url ??
                        DOWNLOADS["bundled-installer"].platforms["macos-arm64"].url
                      }
                      className="inline-flex"
                    >
                      <GradientButton variant="blue">
                        <Download className="w-4 h-4 mr-2" />
                        Download Bundled Setup
                        <span className="ml-2 text-xs opacity-75">
                          {isMac ? ".dmg" : ".exe"}
                        </span>
                      </GradientButton>
                    </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Individual Downloads */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Individual Downloads
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Prefer to install components separately? Download each one individually below.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8">
              {/* Whiteout AI Desktop */}
              <StaggerItem>
                <DesktopDownloadCard
                  product={DOWNLOADS["whiteout-desktop"]}
                  platform={platform}
                />
              </StaggerItem>

              {/* Desktop Guard */}
              <StaggerItem>
                <DesktopDownloadCard
                  product={DOWNLOADS["desktop-guard"]}
                  platform={platform}
                />
              </StaggerItem>

              {/* Browser Extension */}
              <StaggerItem>
                <ExtensionCard
                  product={DOWNLOADS["browser-extension"]}
                  detectedStore={browser}
                />
              </StaggerItem>

              {/* IDE Extension */}
              <StaggerItem>
                <IdeExtensionCard product={DOWNLOADS["ide-extension"]} />
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-white mb-3">
                  System Requirements
                </h2>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <StaggerItem>
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                  <div className="flex items-center gap-3 mb-4">
                    <Apple className="w-5 h-5 text-slate-300" />
                    <h3 className="font-semibold text-white">macOS</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>macOS 12 (Monterey) or later</li>
                    <li>Apple Silicon (M1+) or Intel processor</li>
                    <li>4 GB RAM minimum</li>
                    <li>500 MB available disk space</li>
                  </ul>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                  <div className="flex items-center gap-3 mb-4">
                    <Monitor className="w-5 h-5 text-slate-300" />
                    <h3 className="font-semibold text-white">Windows</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>Windows 10 (64-bit) or later</li>
                    <li>x64 processor</li>
                    <li>4 GB RAM minimum</li>
                    <li>500 MB available disk space</li>
                  </ul>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        {/* Help CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-white mb-3">
                Need Help Getting Set Up?
              </h2>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                Our documentation covers installation, configuration, and troubleshooting
                for all platforms.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/docs">
                  <GradientButton variant="default">
                    View Documentation
                  </GradientButton>
                </a>
                <a href="mailto:support@groovysec.com">
                  <GradientButton variant="blue">
                    Contact Support
                  </GradientButton>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────

function DesktopDownloadCard({
  product,
  platform,
}: {
  product: typeof DOWNLOADS["whiteout-desktop"] | typeof DOWNLOADS["desktop-guard"];
  platform: Platform;
}) {
  const colors = colorMap[product.color];
  const Icon = product.icon;

  // Find the best matching platform download
  const platformKey =
    platform in product.platforms
      ? platform
      : platform === "macos-x64" && "macos-arm64" in product.platforms
        ? "macos-arm64"
        : Object.keys(product.platforms)[0];

  const download = (product.platforms as Record<string, { label: string; url: string; ext: string }>)[platformKey];

  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-xl rounded-2xl border ${colors.border} ${colors.hoverBorder} p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1`}
    >
      <div>
          <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
          <p className="text-sm text-slate-400 mb-4">{product.description}</p>
          <a href={download.url}>
            <GradientButton variant={product.color === "green" ? "default" : "blue"}>
              <Download className="w-4 h-4 mr-2" />
              Download for {download.label}
              <span className="ml-2 text-xs opacity-75">{download.ext}</span>
            </GradientButton>
          </a>
      </div>
    </div>
  );
}

function ExtensionCard({
  product,
  detectedStore,
}: {
  product: typeof DOWNLOADS["browser-extension"];
  detectedStore: string;
}) {
  const colors = colorMap[product.color];
  const Icon = product.icon;

  const stores = Object.entries(product.stores);
  const primaryStore =
    stores.find(([key]) => key === detectedStore) ?? stores[0];

  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-xl rounded-2xl border ${colors.border} ${colors.hoverBorder} p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1`}
    >
      <div>
          <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
          <p className="text-sm text-slate-400 mb-4">{product.description}</p>

          {/* Primary store button */}
          {primaryStore[1].available ? (
            <a
              href={primaryStore[1].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GradientButton variant="purple">
                <ExternalLink className="w-4 h-4 mr-2" />
                Add to {primaryStore[0].charAt(0).toUpperCase() + primaryStore[0].slice(1)}
              </GradientButton>
            </a>
          ) : (
            <Button disabled className="bg-slate-800 text-slate-500 cursor-not-allowed">
              Coming Soon — {primaryStore[1].label}
            </Button>
          )}

          {/* Other stores */}
          <div className="mt-3 flex flex-wrap gap-2">
            {stores
              .filter(([key]) => key !== primaryStore[0])
              .map(([key, store]) => (
                <span
                  key={key}
                  className="text-xs text-slate-400 bg-white/[0.03] px-2 py-1 rounded"
                >
                  {store.label} — {store.available ? "Available" : "Coming Soon"}
                </span>
              ))}
          </div>
      </div>
    </div>
  );
}

function IdeExtensionCard({
  product,
}: {
  product: typeof DOWNLOADS["ide-extension"];
}) {
  const colors = colorMap[product.color];
  const Icon = product.icon;

  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-xl rounded-2xl border ${colors.border} ${colors.hoverBorder} p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1`}
    >
      <div>
          <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
          <p className="text-sm text-slate-400 mb-4">{product.description}</p>

          {/* VS Code */}
          <div className="space-y-2">
            {Object.entries(product.stores).map(([key, store]) => (
              <div key={key}>
                {store.available ? (
                  <a
                    href={store.url}
                    target={store.url.startsWith("http") ? "_blank" : undefined}
                    rel={store.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <GradientButton variant="orange" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {store.label}
                    </GradientButton>
                  </a>
                ) : (
                  <Button
                    disabled
                    className="bg-slate-800 text-slate-500 cursor-not-allowed w-full justify-start"
                  >
                    {store.label} — Coming Soon
                  </Button>
                )}
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
