import { SAVE_KEY, STAMPS, LOCATIONS, RESIDENTS, UPGRADES, RESTORATIONS, QUESTS } from "./data.js";

const MAIL_ROUTES = {
  mushroom: ["Post Office", "Bramble Cottage", "Poppy's Home"],
  leaf: ["The Great Tree", "Willow Grove", "Fern & Fable Garden"],
  acorn: ["General Store", "Riverside Market", "Marlo's Shop"],
  moon: ["Starfall Observatory", "Moonlit Ruins", "Luna's Garden"],
  star: ["Frostpeak Watch", "Mountain Pass", "Aster's Observatory"],
  bloom: ["Village Square", "Sunny Fields", "Juniper's Archive"]
};

export function freshGame() {
  const state = {
    acorns: 65, stars: 0, experience: 0, level: 1,
    delivered: 0, streak: 0, bestStreak: 0, perfectDeliveries: 0,
    upgrades: Object.fromEntries(UPGRADES.map(u => [u.id, 0])),
    restorations: Object.fromEntries(RESTORATIONS.map(r => [r.id, false])),
    stampCounts: Object.fromEntries(Object.keys(STAMPS).map(k => [k, 0])),
    stampsFound: {}, residentsMet: { pip: true },
    questsClaimed: {}, discovered: { "post-office": true },
    currentMail: null, lastDelivery: null, activeTab: "map",
    selectedLocation: "post-office", sound: true, mapZoom: 1,
    tutorialStep: 0, totalSessions: 1, createdAt: Date.now()
  };
  state.currentMail = makeMail(state);
  return state;
}

export function loadGame() {
  const base = freshGame();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return base;
    const state = {
      ...base, ...saved,
      upgrades: { ...base.upgrades, ...(saved.upgrades || {}) },
      restorations: { ...base.restorations, ...(saved.restorations || {}) },
      stampCounts: { ...base.stampCounts, ...(saved.stampCounts || {}) },
      stampsFound: { ...(saved.stampsFound || {}) },
      residentsMet: { ...base.residentsMet, ...(saved.residentsMet || {}) },
      questsClaimed: { ...(saved.questsClaimed || {}) },
      discovered: { ...base.discovered, ...(saved.discovered || {}) },
      currentMail: saved.currentMail && STAMPS[saved.currentMail.stampType] ? saved.currentMail : base.currentMail
    };
    state.acorns = Math.max(0, Number(state.acorns) || 0);
    state.delivered = Math.max(0, Number(state.delivered) || 0);
    state.level = Math.max(1, Number(state.level) || 1);
    state.experience = Math.max(0, Number(state.experience) || 0);
    state.streak = Math.max(0, Number(state.streak) || 0);
    return state;
  } catch (error) {
    console.warn("Mosslight save could not be read; starting with a fresh village.", error);
    return base;
  }
}

export function saveGame(state) {
  try {
    const { lastDelivery, ...safeState } = state;
    localStorage.setItem(SAVE_KEY, JSON.stringify(safeState));
    return true;
  } catch (error) {
    console.warn("Mosslight save could not be written.", error);
    return false;
  }
}

function chooseWeighted(entries) {
  const total = entries.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of entries) {
    roll -= item.weight;
    if (roll <= 0) return item.id;
  }
  return entries[entries.length - 1].id;
}

export function makeMail(state) {
  const bell = state.upgrades?.bell || 0;
  const available = [
    { id: "mushroom", weight: 23 },
    { id: "leaf", weight: 22 },
    { id: "acorn", weight: 22 },
    { id: "bloom", weight: 23 }
  ];
  if (state.delivered >= 8) available.push({ id: "moon", weight: 3 + bell * 2 });
  if (state.delivered >= 15) available.push({ id: "star", weight: 2 + bell * 2 });
  const stampType = chooseWeighted(available);
  const routes = MAIL_ROUTES[stampType];
  const recipient = routes[Math.floor(Math.random() * routes.length)];
  const resident = RESIDENTS[Math.min(RESIDENTS.length - 1, Math.floor(state.delivered / 5))];
  return {
    id: Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e7).toString(36),
    stampType, recipient, sender: resident.name,
    code: String(state.delivered + 1).padStart(3, "0"),
    special: stampType === "moon" || stampType === "star",
    note: stampType === "moon" ? "The moonlight has a message for you." : stampType === "star" ? "A rare parcel from the mountains." : "A little kindness, folded and sealed."
  };
}

export function unlocked(location, state) {
  return state.delivered >= (location.unlockedBy || 0);
}

export function unlockedLocations(state) {
  return LOCATIONS.filter(location => unlocked(location, state));
}

export function questProgress(quest, state) {
  if (quest.kind === "deliveries") return Math.min(state.delivered, quest.target);
  if (quest.kind === "restore") return state.restorations[quest.target] ? 1 : 0;
  if (quest.kind === "stamps") return Math.min(Object.values(state.stampsFound).filter(Boolean).length, quest.target);
  if (quest.kind === "resident") return state.residentsMet[quest.target] ? 1 : 0;
  return 0;
}

export function questComplete(quest, state) {
  return questProgress(quest, state) >= (quest.kind === "restore" || quest.kind === "resident" ? 1 : quest.target);
}

export function currentQuest(state) {
  return QUESTS.find(q => !state.questsClaimed[q.id]) || null;
}

export function availableResidents(state) {
  return RESIDENTS.filter(resident => (resident.unlockAt || 0) <= state.delivered);
}

function checkDiscoveries(state) {
  for (const resident of RESIDENTS) {
    if (state.delivered >= resident.unlockAt && !state.residentsMet[resident.id]) {
      state.residentsMet[resident.id] = true;
      state.lastDelivery = {
        ...(state.lastDelivery || {}),
        discovery: resident.icon + " " + resident.name + " has joined your postal story!",
        discoveryText: resident.reward
      };
      break;
    }
  }
  for (const location of LOCATIONS) {
    if (unlocked(location, state) && !state.discovered[location.id]) {
      state.discovered[location.id] = true;
      state.lastDelivery = {
        ...(state.lastDelivery || {}),
        discovery: "🗺️ " + location.name + " discovered!",
        discoveryText: location.short
      };
    }
  }
}

export function deliverMail(state, chuteType) {
  const mail = state.currentMail;
  if (!mail) return { ok: false, message: "No letters are waiting right now." };
  if (mail.stampType !== chuteType) {
    state.streak = 0;
    state.lastDelivery = { ok: false, message: "That stamp doesn't match. Have another look at the envelope." };
    return { ok: false, message: state.lastDelivery.message };
  }
  state.delivered += 1;
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.perfectDeliveries += 1;
  state.stampCounts[chuteType] = (state.stampCounts[chuteType] || 0) + 1;
  state.stampsFound[chuteType] = true;
  const satchel = state.upgrades.satchel || 0;
  const ink = state.upgrades.ink || 0;
  const boots = state.upgrades.boots || 0;
  const base = 5 + satchel * 2 + (mail.special ? 14 : 0);
  const comboBonus = state.streak >= 3 ? Math.floor(state.streak / 3) * (3 + ink * 2) : 0;
  const reward = base + comboBonus;
  const xpGained = 12 + boots * 4 + (mail.special ? 12 : 0);
  state.acorns += reward;
  state.experience += xpGained;
  const priorLevel = state.level;
  state.level = 1 + Math.floor(state.experience / 100);
  const extraStars = mail.special ? 1 : (state.streak > 0 && state.streak % 10 === 0 ? 1 : 0);
  state.stars += extraStars;
  const message = mail.special
    ? "Rare delivery! +" + reward + " acorns · +" + xpGained + " XP"
    : state.streak >= 3
      ? "Lovely streak ×" + state.streak + "! +" + reward + " acorns · +" + xpGained + " XP"
      : "Letter delivered! +" + reward + " acorns · +" + xpGained + " XP";
  state.lastDelivery = {
    ok: true, message, reward, xpGained, stampType: chuteType,
    special: mail.special, levelUp: state.level > priorLevel,
    discovery: null, recipient: mail.recipient, streak: state.streak
  };
  checkDiscoveries(state);
  state.currentMail = makeMail(state);
  return { ok: true, message, reward, xpGained, levelUp: state.level > priorLevel, mail };
}

export function upgradeCost(upgrade, state) {
  const level = state.upgrades[upgrade.id] || 0;
  return Math.floor(upgrade.base * Math.pow(1.72, level));
}

export function buyUpgrade(state, upgradeId) {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return { ok: false, message: "That upgrade doesn't exist." };
  const level = state.upgrades[upgradeId] || 0;
  const cost = upgradeCost(upgrade, state);
  if (level >= upgrade.max) return { ok: false, message: "You've reached the best version of this upgrade." };
  if (state.acorns < cost) return { ok: false, message: "You need " + (cost - state.acorns) + " more acorns." };
  state.acorns -= cost;
  state.upgrades[upgradeId] = level + 1;
  state.lastDelivery = { ok: true, message: upgrade.name + " upgraded to level " + (level + 1) + "!", reward: 0 };
  return { ok: true, message: state.lastDelivery.message };
}

export function restoreBuilding(state, buildingId) {
  const building = RESTORATIONS.find(r => r.id === buildingId);
  if (!building) return { ok: false, message: "That restoration project could not be found." };
  if (state.restorations[buildingId]) return { ok: false, message: "This place has already been restored." };
  if (state.delivered < building.need) return { ok: false, message: "Deliver " + (building.need - state.delivered) + " more letters first." };
  if (state.acorns < building.cost) return { ok: false, message: "You need " + (building.cost - state.acorns) + " more acorns." };
  state.acorns -= building.cost;
  state.restorations[buildingId] = true;
  state.acorns += building.reward;
  const location = LOCATIONS.find(l => l.id === building.location);
  const resultMessage = building.name + " restored! +" + building.reward + " acorns";
  state.lastDelivery = {
    ok: true,
    message: resultMessage,
    discovery: building.icon + " " + building.name + " is full of life again!",
    discoveryText: building.desc,
    reward: building.reward,
    location: location?.id
  };
  if (buildingId === "noticeboard") {
    for (const resident of RESIDENTS) if (resident.unlockAt <= state.delivered) state.residentsMet[resident.id] = true;
  }
  checkDiscoveries(state);
  return { ok: true, message: resultMessage, building };
}

export function claimQuest(state, questId) {
  const quest = QUESTS.find(q => q.id === questId);
  if (!quest) return { ok: false, message: "Quest not found." };
  if (state.questsClaimed[questId]) return { ok: false, message: "You've already claimed this reward." };
  if (!questComplete(quest, state)) return { ok: false, message: "Keep going — this quest isn't finished yet." };
  state.questsClaimed[questId] = true;
  state.acorns += quest.reward;
  state.stars += quest.stars || 0;
  state.lastDelivery = { ok: true, message: "Quest complete: " + quest.title + "! +" + quest.reward + " acorns", reward: quest.reward, quest: quest.id };
  return { ok: true, message: state.lastDelivery.message, quest };
}

export function meetResident(state, residentId) {
  const resident = RESIDENTS.find(r => r.id === residentId);
  if (!resident) return { ok: false, message: "Couldn't find that resident." };
  if (state.delivered < resident.unlockAt) return { ok: false, message: "Deliver " + (resident.unlockAt - state.delivered) + " more letters to meet " + resident.name + "." };
  if (state.residentsMet[residentId]) return { ok: true, resident, alreadyMet: true };
  state.residentsMet[residentId] = true;
  return { ok: true, resident };
}
