import { STAMPS, LOCATIONS, RESIDENTS, UPGRADES, RESTORATIONS, NAV } from "./data.js";
import {
  loadGame, saveGame, deliverMail, buyUpgrade, restoreBuilding,
  claimQuest, meetResident, unlocked
} from "./state.js";
import { renderGame } from "./ui.js";

const root = document.getElementById("app");
let state = loadGame();
state.currentPanel = null;
state.toast = "";
state.panX = Number(state.panX) || 0;
state.panY = Number(state.panY) || 0;
let toastTimer = 0;
let audioContext = null;
let drag = null;
let sdkReady = false;

function safeSave() {
  const ok = saveGame(state);
  if (!ok) state.toast = "Browser save unavailable — try allowing site storage.";
  return ok;
}

function render() {
  root.innerHTML = renderGame(state);
  const world = document.getElementById("worldLayer");
  if (world) world.style.transform = "translate(" + state.panX + "px," + state.panY + "px) scale(" + state.mapZoom + ")";
}

function notify(message, persist = false) {
  state.toast = message || "";
  if (toastTimer) clearTimeout(toastTimer);
  render();
  if (!persist && message) {
    toastTimer = setTimeout(() => {
      state.toast = "";
      render();
    }, 1850);
  }
}

function chime(success = true) {
  if (!state.sound) return;
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const playNote = (frequency, delay, length) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const start = audioContext.currentTime + delay;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.04, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + length + 0.02);
    };
    playNote(success ? 620 : 230, 0, 0.1);
    if (success) playNote(870, 0.075, 0.14);
  } catch (error) {
    // Audio is decorative: unsupported or blocked audio must never block gameplay.
  }
}

function persistAndRender(message, good = true) {
  safeSave();
  chime(good);
  notify(message || state.lastDelivery?.message || "The valley grows a little brighter.");
}

function changePanel(panel) {
  state.currentPanel = panel === "map" ? null : panel;
  state.activeTab = panel;
  render();
}

function visitLocation(locationId) {
  const location = LOCATIONS.find(item => item.id === locationId);
  if (!location) return;
  state.selectedLocation = locationId;
  state.activeTab = "map";
  state.currentPanel = "location";
  if (unlocked(location, state)) state.discovered[locationId] = true;
  safeSave();
  render();
}

function performAction(action, id) {
  switch (action) {
    case "nav":
      changePanel(id);
      return;
    case "location":
      visitLocation(id);
      return;
    case "close-panel":
      state.currentPanel = null;
      render();
      return;
    case "deliver": {
      const result = deliverMail(state, id);
      if (!result.ok) {
        chime(false);
        notify(result.message);
      } else {
        persistAndRender(result.message, true);
        if (result.levelUp) notify("⭐ Postal level " + state.level + "! The valley knows your name.");
        else if (state.lastDelivery?.discovery) notify(state.lastDelivery.discovery);
      }
      return;
    }
    case "claim-quest": {
      const result = claimQuest(state, id);
      if (result.ok) persistAndRender(result.message, true);
      else notify(result.message, false);
      return;
    }
    case "buy-upgrade": {
      const result = buyUpgrade(state, id);
      if (result.ok) persistAndRender(result.message, true);
      else notify(result.message, false);
      return;
    }
    case "restore": {
      const result = restoreBuilding(state, id);
      if (result.ok) {
        persistAndRender(result.message, true);
        if (state.lastDelivery?.discovery) notify(state.lastDelivery.discovery);
      } else notify(result.message, false);
      return;
    }
    case "meet-resident": {
      const result = meetResident(state, id);
      if (!result.ok) notify(result.message, false);
      else {
        state.residentsMet[id] = true;
        safeSave();
        notify(result.alreadyMet ? result.resident.name + " waves hello again. " + result.resident.reward : result.resident.name + " joins your story! " + result.resident.reward, true);
      }
      return;
    }
    case "zoom-in":
      state.mapZoom = Math.min(1.34, Math.round((state.mapZoom + 0.08) * 100) / 100);
      state.panX = Math.max(-110, Math.min(110, state.panX));
      safeSave(); render(); return;
    case "zoom-out":
      state.mapZoom = Math.max(0.94, Math.round((state.mapZoom - 0.08) * 100) / 100);
      if (state.mapZoom <= 1) { state.panX = 0; state.panY = 0; }
      safeSave(); render(); return;
    case "fullscreen":
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => notify("Fullscreen isn't available in this browser."));
      } else document.exitFullscreen?.().catch(() => {});
      return;
    case "toggle-sound":
      state.sound = !state.sound;
      if (state.sound) chime(true);
      safeSave(); render(); return;
    case "save-now":
      if (safeSave()) notify("Your village has been saved safely. 🌿", true);
      else notify("The browser could not save this village.", false);
      return;
    case "confirm-reset":
      if (window.confirm("Start a new village? This clears this game's saved progress in this browser.")) {
        try { localStorage.removeItem("mosslight-map-save-v2"); } catch (error) {}
        state = loadGame();
        state.currentPanel = "map";
        state.activeTab = "map";
        state.toast = "A new little adventure begins.";
        render();
      }
      return;
    default:
      return;
  }
}

root.addEventListener("click", event => {
  const button = event.target.closest("[data-act]");
  if (!button || !root.contains(button) || button.disabled) return;
  event.preventDefault();
  performAction(button.dataset.act, button.dataset.id || "");
});

root.addEventListener("pointerdown", event => {
  if (event.button !== 0 && event.pointerType !== "touch") return;
  if (event.target.closest("button, .dock, .quest-card, .dialogue, .topbar, .sidebar, .modal")) return;
  drag = {
    startX: event.clientX, startY: event.clientY,
    originX: state.panX, originY: state.panY,
    moved: false, pointerId: event.pointerId
  };
  root.classList.add("panning");
});
window.addEventListener("pointermove", event => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
  if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
  if (!drag.moved) return;
  state.panX = Math.max(-210, Math.min(210, drag.originX + dx));
  state.panY = Math.max(-115, Math.min(115, drag.originY + dy));
  const world = document.getElementById("worldLayer");
  if (world) world.style.transform = "translate(" + state.panX + "px," + state.panY + "px) scale(" + state.mapZoom + ")";
});
window.addEventListener("pointerup", () => {
  if (!drag) return;
  drag = null;
  root.classList.remove("panning");
  safeSave();
});
window.addEventListener("pointercancel", () => { drag = null; root.classList.remove("panning"); });
window.addEventListener("keydown", event => {
  if (event.key === "Escape" && state.currentPanel) {
    state.currentPanel = null; render();
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    safeSave();
    notify("Your village has been saved. 🌿", true);
  }
});
document.addEventListener("visibilitychange", () => {
  safeSave();
  try {
    if (sdkReady && window.CrazyGames?.SDK?.game) {
      if (document.hidden) window.CrazyGames.SDK.game.gameplayStop();
      else window.CrazyGames.SDK.game.gameplayStart();
    }
  } catch (error) { /* Optional SDK errors must not interrupt play. */ }
});

render();
safeSave();

// The game works as a regular web game if the platform SDK is not present.
(async () => {
  try {
    const script = document.createElement("script");
    script.src = "https://sdk.crazygames.com/crazygames-sdk-v3.js";
    script.async = true;
    script.onload = async () => {
      try {
        if (window.CrazyGames?.SDK?.init) {
          await window.CrazyGames.SDK.init();
          sdkReady = true;
          if (!document.hidden) window.CrazyGames.SDK.game.gameplayStart();
        }
      } catch (error) {
        console.info("Platform SDK unavailable; continuing as a normal browser game.");
      }
    };
    document.head.append(script);
  } catch (error) { /* Offline/browser preview mode */ }
})();
