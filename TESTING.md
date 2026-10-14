# Mosslight Mail - QA notes

## Automated smoke coverage

Validated against the current `feat/mosslight-mail` branch build:

- JavaScript parses successfully.
- All 42+ authored DOM IDs are unique, and every static `$('id')` reference points to an element in the page.
- Exactly three sorting destinations are present: mushroom, acorn and leaf.
- The wrong chute preserves the current letter and does not award a delivery.
- Five correct deliveries finish the opening goal and refresh the acorn counter with the goal bonus.
- The noticeboard and Pip's cottage restore in sequence; the village scene reflects both states.
- A deterministic rare-mail run after delivery 12 keeps a valid regular destination, awards the starlight bonus and records the rare album stamp.
- A 30-delivery run restored all four buildings, reached 100% restoration, opened the clock-tower milestone and persisted delivery/building/collection state to local storage.

These are lightweight script/DOM simulation checks, not a substitute for hands-on browser or CrazyGames QA.

## Manual release checklist

- [ ] Play on desktop using mouse clicks.
- [ ] Play on a narrow touchscreen and confirm all three chutes remain comfortable to tap.
- [ ] Toggle sound on and off; verify sound failure never blocks a delivery.
- [ ] Reload the same browser and confirm acorns, upgrades, buildings and collection persist.
- [ ] Test with the CrazyGames SDK blocked or unavailable and confirm the core loop still works.
- [ ] Confirm actual startup time and first-minute conversion in a real browser build before tuning progression.
- [ ] Review the full restoration scene and all responsive breakpoints at normal browser zoom.
