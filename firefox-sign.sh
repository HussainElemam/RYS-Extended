#!/bin/bash
# Sign the Firefox build as an unlisted (private) add-on on addons.mozilla.org.
# Needs AMO API credentials in the environment:
#   export WEB_EXT_API_KEY='user:12345:67'
#   export WEB_EXT_API_SECRET='...'
# Bump "version" in src/firefox_manifest.json before each new upload.
# The signed .xpi lands in web-ext-artifacts/.
set -euo pipefail

cd "$(dirname "$0")"
: "${WEB_EXT_API_KEY:?Set WEB_EXT_API_KEY (from https://addons.mozilla.org/developers/addon/api/key/)}"
: "${WEB_EXT_API_SECRET:?Set WEB_EXT_API_SECRET}"

cp src/firefox_manifest.json src/manifest.json
trap 'rm -f src/manifest.json' EXIT
web-ext sign --source-dir src --artifacts-dir web-ext-artifacts --channel unlisted
