# RYS - Extended

A personal fork of [RYS — Remove YouTube Suggestions](https://github.com/lawrencehook/remove-youtube-suggestions)
by [Lawrence Hook](https://lawrencehook.com). All credit for the extension goes
to the original project; if you just want to use RYS, install the official
version from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/remove-youtube-s-suggestions)
or the [Chrome Web Store](https://chrome.google.com/webstore/detail/remove-youtube-suggestion/cdhdichomdnlaadbndgmagohccgpejae)
and support its author.

This fork is not affiliated with or endorsed by the original author.

---

### What's different

- **No premium, sign-in or analytics.** Every feature is available, and nothing
  is sent anywhere.
- **Wait before turning things off.** Set a delay (gear menu → *Wait to turn
  off*). Turning RYS or any option off, removing a blocked word, editing the
  schedule, removing the password or importing settings only works once the
  menu has been open that long. Turning things on is never delayed.
- **Speed through ads works with speed-control extensions.** The 10x ad speed
  no longer carries over into the video.

---

### Install (Firefox)

The add-on is signed as an unlisted add-on on addons.mozilla.org:

```bash
npm install --global web-ext
export WEB_EXT_API_KEY='...'      # from https://addons.mozilla.org/developers/addon/api/key/
export WEB_EXT_API_SECRET='...'
./firefox-sign.sh                 # signed .xpi lands in web-ext-artifacts/
```

Then open the `.xpi` in Firefox. See [RELEASE.md](RELEASE.md) for new versions.

### Development

```bash
./dev.sh firefox     # opens Firefox with the extension loaded
./dev.sh chrome      # builds dist/chrome/ — load as unpacked in chrome://extensions
cd tests && npm test # unit tests
```

### Pulling in updates from the original project

```bash
git remote add upstream https://github.com/lawrencehook/remove-youtube-suggestions.git  # once
git fetch upstream
git merge upstream/main
```

---

### License

[Mozilla Public License 2.0](LICENSE), the same as the original project.
