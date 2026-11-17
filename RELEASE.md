# Releasing a new version

1. Start from a clean, up-to-date `main`; run the tests (`cd tests && npm test`).
2. Bump `version` to the same new value in `src/firefox_manifest.json` and
   `src/chrome_manifest.json`. It must be higher than every version already
   signed (see `web-ext-artifacts/`) and, after merging upstream, higher than
   the original project's.
3. Commit and push the bump.
4. Sign the Firefox build: `./firefox-sign.sh` (needs `WEB_EXT_API_KEY` and
   `WEB_EXT_API_SECRET`). The signed `.xpi` lands in `web-ext-artifacts/`.
5. Open the `.xpi` in Firefox to install the update.

AMO never accepts the same version twice; a fix after signing needs a new version.
