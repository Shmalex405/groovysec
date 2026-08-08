// Everything the site says about the current Maestro build, in one place.
//
// The numbers in maestro-release.json are generated, not authored: the Maestro
// release workflow runs `scripts/maestro-facts.mjs` against the tree it just
// shipped and commits the result here. Do not hand-edit the JSON — a release
// overwrites it, so a manual correction is silently reverted on the next one. If a
// figure looks wrong, the fix belongs in the Maestro repo's config.
//
// This exists because the same four numbers were previously restated by hand in
// six files, and went stale in all of them: the site advertised 21 agents / 213
// tools / 232 tests for several releases while the real figures were 24 / 227 /
// 234, including a heading that read "21 Specialized AI Agents" directly above a
// list of 24. Anything a release changes must be derived from here, not retyped.
//
// scripts/build-docs.mjs imports this JSON too, so per-route meta descriptions
// stay in step — that file keeps its own copy of each route's meta and was one of
// the places the stale counts survived.

import release from "./maestro-release.json";

export const MAESTRO_VERSION = release.version;

/** Worker agents, excluding the orchestrating team lead. This is the figure the
 *  site quotes; `agentsTotal` includes the lead, which is why both exist. */
export const MAESTRO_AGENTS = release.agents;
export const MAESTRO_AGENTS_TOTAL = release.agentsTotal;
export const MAESTRO_TOOLS = release.tools;
export const MAESTRO_TESTS = release.tests;

export const MAESTRO_REPO = "https://github.com/Shmalex405/maestro";

/** The open-core build. The `latest` channel on the same host is the commercial
 *  build and expects an org login — never link a free download at it. */
const CDN = "https://updates.maestro.groovysec.com/maestro/free";

/** Kali toolkit image. Pinned to the app version deliberately: Maestro resolves
 *  its image BY TAG, so `:latest` leaves a byte-identical image under a name the
 *  app never looks up, and it reports the toolkit missing. */
export const MAESTRO_TOOLKIT_IMAGE = `ghcr.io/shmalex405/docker-kali:v${MAESTRO_VERSION}`;

export type MaestroPlatform = {
  id: "macos" | "windows" | "linux";
  name: string;
  detail: string;
  ext: string;
  url: string;
  testid: string;
};

/** Filenames are produced by the Tauri bundler, so their shape is fixed by the
 *  release workflow rather than chosen here. Verified against the live CDN on
 *  every release by the sync job. */
export const MAESTRO_PLATFORMS: MaestroPlatform[] = [
  {
    id: "macos",
    name: "macOS",
    detail: "Apple Silicon",
    ext: ".dmg",
    url: `${CDN}/macos-aarch64/Maestro_${MAESTRO_VERSION}_aarch64.dmg`,
    testid: "link-install-macos",
  },
  {
    id: "windows",
    name: "Windows",
    detail: "x64",
    ext: ".msi",
    url: `${CDN}/windows-x64/Maestro_${MAESTRO_VERSION}_x64_en-US.msi`,
    testid: "link-install-windows",
  },
  {
    id: "linux",
    name: "Linux",
    detail: "x64 · Debian / Ubuntu",
    ext: ".deb",
    url: `${CDN}/linux-x64/Maestro_${MAESTRO_VERSION}_amd64.deb`,
    testid: "link-install-linux",
  },
];
