# Mosslight Mail

A cozy click/tap arcade game about delivering magical mail and bringing a sleepy woodland village back to life. Built as a lightweight, single-page HTML5 game for desktop and mobile.

## Play

Open `index.html` in a browser, or enable GitHub Pages for this repository and use the repository's Pages URL. Gameplay begins immediately; there is no title screen, account or sign-up.

1. Read the stamp on the current letter.
2. Click/tap the matching mushroom, acorn or leaf chute (or click the letter to auto-deliver it).
3. Build a streak for bonus acorns. A wrong chute only resets the streak; it does not remove earned progress.
4. Spend acorns on mailroom upgrades and restore the noticeboard, Pip's cottage, the Mosslight lantern and the clock tower.
5. Discover rare starlight letters and complete the stamp album.

## Included

- Immediate, readable mail-sorting loop with a highlighted matching chute.
- Bounce-in letter, chute feedback, chimes, reward toasts, combo streaks and acorn currency.
- A responsive, illustrated woodland post office that visibly changes as village buildings are restored.
- Three upgrade tracks, four restoration milestones, a first-delivery goal, a stamp collection and Pip the hedgehog.
- Local autosave using `localStorage`; progress remains in the same browser.
- Touch-friendly controls, reduced-motion support, sound toggle and in-game help.
- Optional CrazyGames SDK v3 initialization and gameplay start/stop hooks. The game continues if the SDK is unavailable.

## Development notes

The game is intentionally dependency-light: the playable build lives in `index.html`. Google Fonts and the optional CrazyGames SDK are loaded externally; the core game does not require them to load. To verify locally, serve this folder over HTTP (for example, `python -m http.server`) and open the local page. Browser storage can be cleared to start a fresh village.

The design follows the attached *Crazygames Game Plan.pdf*: prove the sorting loop first, then layer upgrades, collection and visible restoration around it. The first ten minutes are a pacing target to playtest, not a guaranteed player outcome.
