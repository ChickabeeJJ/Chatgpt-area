# Mosslight Mail — The Living Map

A full-screen, storybook-fantasy map adventure. Explore the painted woodland world, visit its landmarks, sort enchanted letters, collect rare stamps, restore the village and meet the creatures who live there.

## Play

Open `index.html` in a browser, or enable GitHub Pages for this repository. The world map fills the screen immediately; there is no title screen or sign-up.

- **Explore:** click a landmark or drag the map to pan around the world. Locked places explain the delivery milestone needed to reach them.
- **Deliver:** open the Mosslight Post Office and match each envelope's mushroom, acorn or leaf stamp to the correct chute.
- **Grow:** spend acorns on the Swift Satchel, Enchanted Sorting Tray and Firefly Lantern.
- **Restore:** repair the village noticeboard, Pip's cottage, the Mosslight lantern and the clock tower.
- **Discover:** collect stamps, meet residents and complete small quests. Starlight letters can appear after eight successful deliveries.
- **Keep progress:** your village autosaves to local storage in the same browser.

## Controls

Mouse/touch to activate landmarks and buttons. Drag the map to explore; arrow keys can also pan it. Press Escape to close a panel.

## Implementation

The game uses a painted map assembled from optimized WebP art tiles, with responsive clickable landmarks and illustrated parchment panels. The playable build lives in `index.html`; it uses the browser's local storage for saves and initializes the CrazyGames SDK v3 when available. The core loop continues if the platform SDK is unavailable.

See [TESTING.md](TESTING.md) for automated smoke coverage and release checks.
