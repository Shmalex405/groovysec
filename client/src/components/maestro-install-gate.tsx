// The form in front of the Maestro download links.
//
// Worth being clear about what this is and is not. It is a courtesy ask, not an
// access control: Maestro's installers sit on a public CloudFront distribution and
// their exact URLs are documented in the public README, so anyone who would rather
// not fill this in can fetch them directly. Whatever it records is therefore a
// FLOOR on real installs, and calling the resulting number "installs" would
// overstate what we actually know. "Signups" is the honest word.
//
// Given that, the design leans away from adding friction that buys nothing:
//
//   - A completed signup is remembered locally, so a returning visitor is not
//     asked twice. That is not a bypass; they already told us.
//   - A failing endpoint reveals the links anyway. Losing a signup is a far better
//     outcome than a visitor who cannot download a free tool because our API is
//     having a bad day.

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Loader2, ShieldCheck } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { MAESTRO_VERSION } from "@/lib/maestro-release";

// Deployed by infra/terraform/platform-install-signup in the kali-mcp-pentest-infra
// repo; `terraform output endpoint` prints this exact URL.
const SIGNUP_ENDPOINT = "https://signup.maestro.groovysec.com/maestro/install-signup";

// Bumped only if the shape of what we ask for changes, which would make prior
// consent no longer cover it.
const CONSENT_KEY = "maestro-install-signup-v1";

function hasSignedUp(): boolean {
  // Private-mode Safari throws on localStorage rather than returning null, and an
  // exception here would blank the whole page.
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberSignup() {
  try {
    window.localStorage.setItem(CONSENT_KEY, "1");
  } catch {
    // Nothing to do — they will be asked again next visit, which is harmless.
  }
}

/** Best-effort platform label, stored so we know which build people take. Only
 *  used for reporting, so a wrong guess costs nothing and it is never used to
 *  decide what to show. */
function guessPlatform(): string {
  const ua = navigator.userAgent;
  if (/Mac/i.test(ua)) return "macos";
  if (/Win/i.test(ua)) return "windows";
  if (/Linux|X11/i.test(ua)) return "linux";
  return "unknown";
}

export function MaestroInstallGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read after mount rather than in useState's initialiser: this page is
  // pre-rendered to static HTML, so touching localStorage during the first render
  // would run before hydration.
  useEffect(() => {
    if (hasSignedUp()) setUnlocked(true);
  }, []);

  if (unlocked) return <>{children}</>;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          jobTitle: jobTitle.trim() || undefined,
          acceptedTerms: accepted,
          version: MAESTRO_VERSION,
          platform: guessPlatform(),
        }),
      });

      if (res.status === 400) {
        // The only validation the server rejects that the browser does not already
        // catch is address shape, so say that rather than echoing a field map.
        setError("That email address does not look right — please check it.");
        setSubmitting(false);
        return;
      }

      // Anything else, including a 5xx or a network failure, unlocks. See the note
      // at the top: a broken endpoint must not stop someone downloading.
      rememberSignup();
      setUnlocked(true);
    } catch {
      rememberSignup();
      setUnlocked(true);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="p-8 rounded-2xl bg-white border border-[#E4E9F0]"
        data-testid="form-install-signup"
      >
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-[#A05F00]" />
          <h3 className="font-bold text-[#0F1B2D]">Tell us where to send you</h3>
        </div>
        <p className="text-sm text-[#51617A] mb-6">
          Maestro is free and there is nothing to pay. We ask so we know who is using
          it and can tell you about releases that matter — nothing else.
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#0F1B2D]">Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={120}
              data-testid="input-signup-name"
              className="mt-1 w-full px-4 py-2.5 rounded-lg border border-[#E4E9F0] focus:border-[#A05F00] focus:outline-none focus:ring-1 focus:ring-[#A05F00]/30"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#0F1B2D]">Work email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={254}
              data-testid="input-signup-email"
              className="mt-1 w-full px-4 py-2.5 rounded-lg border border-[#E4E9F0] focus:border-[#A05F00] focus:outline-none focus:ring-1 focus:ring-[#A05F00]/30"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#0F1B2D]">
              Job title <span className="text-[#6E7B8C] font-normal">(optional)</span>
            </span>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              autoComplete="organization-title"
              maxLength={120}
              data-testid="input-signup-job-title"
              className="mt-1 w-full px-4 py-2.5 rounded-lg border border-[#E4E9F0] focus:border-[#A05F00] focus:outline-none focus:ring-1 focus:ring-[#A05F00]/30"
            />
          </label>
        </div>

        {/* Consent is a real checkbox rather than implied by submitting, because the
            server records that it was ticked and we should be able to stand behind
            that record. */}
        <label className="flex items-start gap-2.5 mt-6 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            data-testid="checkbox-signup-terms"
            className="mt-0.5 w-4 h-4 accent-[#A05F00] flex-shrink-0"
          />
          <span className="text-xs text-[#6E7B8C] leading-relaxed">
            I agree to the{" "}
            <Link href="/terms-of-service" className="text-[#A05F00] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-[#A05F00] hover:underline">
              Privacy Policy
            </Link>
            , and I will only use Maestro against systems I am authorized to test.
          </span>
        </label>

        {error && (
          <p className="mt-4 text-sm text-[#C62828]" data-testid="text-signup-error">
            {error}
          </p>
        )}

        <div className="mt-6">
          <GradientButton
            variant="orange"
            type="submit"
            disabled={submitting}
            className="w-full justify-center"
            data-testid="button-signup-submit"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                One moment…
              </>
            ) : (
              "Get the download"
            )}
          </GradientButton>
        </div>
      </form>
    </div>
  );
}
