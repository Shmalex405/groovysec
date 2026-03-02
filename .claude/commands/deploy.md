Build the site for GitHub Pages deployment and verify the output.

Steps:
1. Run `npm run build:docs`
2. Verify the `docs/` directory exists and contains `index.html` and `404.html`
3. Verify CNAME file exists at `docs/CNAME`
4. Verify SPA fallback directories exist:
   - `docs/whiteout-ai/index.html`
   - `docs/whiteout-ai/government/index.html`
   - `docs/whiteout-ai/academic-integrity/index.html`
   - `docs/whiteout-ai/security-whitepaper/index.html`
   - `docs/maestro/index.html`
   - `docs/about/index.html`
   - `docs/demo/index.html`
   - `docs/privacy-policy/index.html`
   - `docs/terms-of-service/index.html`
5. Report success or any missing files
