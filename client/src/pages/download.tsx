import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
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

// ── Download configuration ──────────────────────────────────────────────
// CloudFront CDN base for all update artifacts
const CDN_BASE = "https://updates.groovysec.com";

const DOWNLOADS = {
  "whiteout-desktop": {
    name: "Whiteout AI",
    description: "The secure AI platform with built-in governance, policy enforcement, and an isolated internal AI source for sensitive prompts.",
    icon: Monitor,
    color: "blue",
    platforms: {
      "macos-arm64": {
        label: "macOS (Apple Silicon)",
        url: `${CDN_BASE}/latest/WhiteoutAI-macos-arm64-latest.dmg`,
        ext: ".dmg",
      },
      "macos-x64": {
        label: "macOS (Intel)",
        url: `${CDN_BASE}/latest/WhiteoutAI-macos-x64-latest.dmg`,
        ext: ".dmg",
      },
      "windows-x64": {
        label: "Windows",
        url: `${CDN_BASE}/latest/WhiteoutAI-Setup-latest.exe`,
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
        url: `${CDN_BASE}/interceptor/latest/WhiteoutInterceptor-latest.dmg`,
        ext: ".dmg",
      },
      "windows-x64": {
        label: "Windows",
        url: `${CDN_BASE}/interceptor-windows/latest/Whiteout.DesktopGuard-latest.exe`,
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
        url: "https://chromewebstore.google.com",
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
        url: "vscode:extension/groovysecurity.whiteout-ai",
        webUrl: "https://marketplace.visualstudio.com/items?itemName=groovysecurity.whiteout-ai",
        available: false, // placeholder
      },
      jetbrains: {
        label: "JetBrains Marketplace",
        url: "#",
        available: false,
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
        url: `${CDN_BASE}/installer/latest/WhiteoutAI-Bundled-Setup-macOS-latest.dmg`,
        ext: ".dmg",
      },
      "macos-x64": {
        label: "macOS (Intel)",
        url: `${CDN_BASE}/installer/latest/WhiteoutAI-Bundled-Setup-macOS-latest.dmg`,
        ext: ".dmg",
      },
      "windows-x64": {
        label: "Windows",
        url: `${CDN_BASE}/installer/latest/WhiteoutAI-Bundled-Setup-Windows-latest.exe`,
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
    text: "text-blue-600",
    iconBg: "bg-blue-600/10",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
  },
  green: {
    bg: "bg-green-600",
    text: "text-green-600",
    iconBg: "bg-green-600/10",
    border: "border-green-200",
    hoverBorder: "hover:border-green-400",
  },
  purple: {
    bg: "bg-purple-600",
    text: "text-purple-600",
    iconBg: "bg-purple-600/10",
    border: "border-purple-200",
    hoverBorder: "hover:border-purple-400",
  },
  orange: {
    bg: "bg-orange-600",
    text: "text-orange-600",
    iconBg: "bg-orange-600/10",
    border: "border-orange-200",
    hoverBorder: "hover:border-orange-400",
  },
  slate: {
    bg: "bg-slate-800",
    text: "text-slate-800",
    iconBg: "bg-slate-800/10",
    border: "border-slate-300",
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
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero */}
        <section className="pt-28 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

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
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
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
                      <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6">
                        <Download className="w-4 h-4 mr-2" />
                        Download Bundled Setup
                        <span className="ml-2 text-xs text-slate-500">
                          {isMac ? ".dmg" : ".exe"}
                        </span>
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Individual Downloads */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Individual Downloads
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  System Requirements
                </h2>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <StaggerItem>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Apple className="w-5 h-5 text-slate-700" />
                    <h3 className="font-semibold text-slate-900">macOS</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>macOS 12 (Monterey) or later</li>
                    <li>Apple Silicon (M1+) or Intel processor</li>
                    <li>4 GB RAM minimum</li>
                    <li>500 MB available disk space</li>
                  </ul>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Monitor className="w-5 h-5 text-slate-700" />
                    <h3 className="font-semibold text-slate-900">Windows</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
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
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Need Help Getting Set Up?
              </h2>
              <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                Our documentation covers installation, configuration, and troubleshooting
                for all platforms.
              </p>
              <div className="flex justify-center gap-4">
                <a href="/docs">
                  <Button variant="outline" className="border-slate-300">
                    View Documentation
                  </Button>
                </a>
                <a href="mailto:support@groovysec.com">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Contact Support
                  </Button>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
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
      className={`bg-white rounded-2xl border ${colors.border} ${colors.hoverBorder} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">{product.name}</h3>
          <p className="text-sm text-slate-600 mb-4">{product.description}</p>
          <a href={download.url}>
            <Button className={`${colors.bg} text-white hover:opacity-90`}>
              <Download className="w-4 h-4 mr-2" />
              Download for {download.label}
              <span className="ml-2 text-xs opacity-75">{download.ext}</span>
            </Button>
          </a>
        </div>
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
      className={`bg-white rounded-2xl border ${colors.border} ${colors.hoverBorder} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">{product.name}</h3>
          <p className="text-sm text-slate-600 mb-4">{product.description}</p>

          {/* Primary store button */}
          {primaryStore[1].available ? (
            <a
              href={primaryStore[1].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className={`${colors.bg} text-white hover:opacity-90`}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Add to {primaryStore[0].charAt(0).toUpperCase() + primaryStore[0].slice(1)}
              </Button>
            </a>
          ) : (
            <Button disabled className="bg-slate-200 text-slate-500 cursor-not-allowed">
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
                  className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded"
                >
                  {store.label} — {store.available ? "Available" : "Coming Soon"}
                </span>
              ))}
          </div>
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
      className={`bg-white rounded-2xl border ${colors.border} ${colors.hoverBorder} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">{product.name}</h3>
          <p className="text-sm text-slate-600 mb-4">{product.description}</p>

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
                    <Button className={`${colors.bg} text-white hover:opacity-90 w-full justify-start`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {store.label}
                    </Button>
                  </a>
                ) : (
                  <Button
                    disabled
                    className="bg-slate-200 text-slate-500 cursor-not-allowed w-full justify-start"
                  >
                    {store.label} — Coming Soon
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
