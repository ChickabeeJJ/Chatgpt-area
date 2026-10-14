# Mosslight Mail — map build QA

## Checks for this update

- [x] Game starts directly in the fullscreen map with no title screen.
- [x] Painted map art is used as the scene; CSS shapes are limited to interface elements and clickable markers.
- [x] Mouse/touch landmark hotspots open location panels, and progress gates locked locations.
- [x] Post Office panel sorts mushroom, acorn and leaf letters; incorrect choices keep the same letter and break the streak only.
- [x] Deliveries award acorns and stamp progress, including rare starlight mail.
- [x] Market upgrades, four village restorations, resident discovery, quests, stamp album and save migration are wired.
- [x] JavaScript compiles successfully.
- [x] No missing static DOM ID references or duplicate IDs in the main HTML.

## Manual release checklist

- [ ] Play using mouse clicks in Chrome, Firefox and Safari.
- [ ] Test touchscreen map dragging and each landmark on a narrow portrait viewport.
- [ ] Confirm art tiles load over HTTP and the map does not show seams or blank areas at common aspect ratios.
- [ ] Reload and verify saved progress and upgrades.
- [ ] Test the core game with network access to the CrazyGames SDK blocked.
- [ ] Verify the platform SDK behavior within CrazyGames before public release.
- [ ] Check readability and hotspot placement at 100%, 125% and mobile zoom.

Automated checks are script/DOM smoke tests; manual visual and device testing remain necessary before release.
