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

## Store links

Android is in closed beta: the Google Play button on `sector-defence/index.html` links to the [beta group](https://groups.google.com/g/sector-defence-beta), with a note under the buttons and a quick answer on the support page.

The App Store version is out: `<body class="launched">` on `index.html` and `sector-defence/index.html` shows the home page's red and gold "Out now" sash and the App Store button linking to the store.

When Android goes public, point the Google Play button at the Play Store listing, change its label to "Get it on Google Play", and remove the beta note and the support answer.

## Preview locally

```bash
python3 -m http.server 8173
```

Then open http://localhost:8173.

## Deploying

GitHub Pages serves the `main` branch from the repository root. `CNAME` sets the custom domain. `.nojekyll` turns off Jekyll processing.
