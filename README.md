# Hook Roaster

Paste the opening line of a LinkedIn post. Hook Roaster scores it out of 100, roasts it with the gloves half on, and hands back three stronger ways to begin.

It is a portfolio piece by [Taha Ahsan](https://www.linkedin.com/in/taha-ahsan-832475270/), a freelance LinkedIn and blog writer. The app runs entirely in the browser: no account, no API key, and no backend, so it can live on GitHub Pages for free.

**Live site:** https://taha080.github.io/hook-roaster/

![Hook Roaster scoring a LinkedIn opener, with a breakdown and three rewrites](assets/preview.jpg)

## Features

- A score out of 100, with a breakdown for curiosity, clarity, specificity, emotion, and length / scannability
- A short roast that is sharp and still on your side
- Concrete tips aimed at the weakest signals
- Three rewrites — bold claim, story, and question — each with its own copy button
- Example hooks, from a foggy announcement to a specific proof line
- A fiery, mobile-friendly layout. Nothing you paste is uploaded

## How the score works

Each signal is worth 20 points. The heuristic looks at:

- **Curiosity** — questions, open loops, contrast, and power words such as *nobody*, *mistake*, and *truth*
- **Clarity** — sentence length, filler (*just*, *really*, *very*), and buzzwords
- **Specificity** — numbers, timeframes, named objects, and a penalty for vague language
- **Emotion** — feeling words, a first-person stake, and whether the reader shows up as “you”
- **Length / scannability** — word count, line breaks, all-caps shouting, and whether the point fits the LinkedIn preview

Clichés such as “excited to announce” and “believe in yourself” pull the score down. Rewrites are templates filled with the topic, role, and numbers found in your opener. Treat them as a first draft and change any scene so the story is actually yours.

## Run it locally

No install step. From the repo root:

```bash
python3 -m http.server 4173
```

Open http://localhost:4173

With Node, the same server and the scoring checks are:

```bash
npm test
npm start
```

`npm test` runs the heuristic against several sample hooks. Copy buttons are more reliable from the local server than from a `file://` tab.

Try the chips under the box, or paste your own first lines. ⌘/Ctrl + Enter roasts the draft.

## Deploy to GitHub Pages

Pushes to `main` run [`.github/workflows/pages.yml`](.github/workflows/pages.yml). The workflow publishes `index.html`, `css`, `js`, `fonts`, and `assets`.

One setting, the first time: in the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.

The site is then served at https://taha080.github.io/hook-roaster/

## Credits

Built by [Taha Ahsan](https://www.linkedin.com/in/taha-ahsan-832475270/). Source: [github.com/taha080](https://github.com/taha080).
