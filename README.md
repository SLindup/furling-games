# furling.games

The Furling Games website: plain HTML and CSS, served by GitHub Pages at [furling.games](https://furling.games). There is no build step.

## Pages

| Path | File |
| --- | --- |
| `/` | `index.html` |
| `/sector-defence/` | `sector-defence/index.html` |
| `/sector-defence/support/` | `sector-defence/support/index.html` (the App Store support URL) |
| `/sector-defence/privacy/` | `sector-defence/privacy/index.html` (the privacy policy URL for both stores) |

The home page uses `assets/css/home.css`; the Sector Defence pages use `assets/css/sector-defence.css`. Fonts are self-hosted (`assets/fonts/`), so no page loads anything from a third party.

## When Sector Defence launches

1. In `sector-defence/index.html`, replace the two `href="#"` store links with the real App Store and Google Play URLs.
2. Add `class="launched"` to `<body>` in `index.html` and `sector-defence/index.html`. The home page sash switches to the red and gold "Out now", and the store buttons become links.

## Preview locally

```bash
python3 -m http.server 8173
```

Then open http://localhost:8173.

## Deploying

GitHub Pages serves the `main` branch from the repository root. `CNAME` sets the custom domain. `.nojekyll` turns off Jekyll processing.
