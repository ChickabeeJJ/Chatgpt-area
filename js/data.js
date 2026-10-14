export const SAVE_KEY = "mosslight-map-save-v2";

export const STAMPS = {
  mushroom: { name: "Mushroom", icon: "🍄", color: "#d47757", description: "For homes tucked beneath the old trees." },
  leaf: { name: "Leaf", icon: "🍃", color: "#70a96b", description: "For garden paths and green little places." },
  acorn: { name: "Acorn", icon: "🌰", color: "#c99a55", description: "For the river traders and market folk." },
  moon: { name: "Moonflower", icon: "🌙", color: "#9d8ad9", description: "A rare stamp carried only by special letters." },
  star: { name: "Starling", icon: "⭐", color: "#e9b957", description: "A golden postmark for extraordinary deliveries." },
  bloom: { name: "Sunpetal", icon: "🌼", color: "#e7bd57", description: "A cheerful stamp for the sunny side of town." }
};

export const LOCATIONS = [
  { id:"post-office", name:"Post Office", x:9.5, y:62.5, icon:"📮", biome:"Village heart", unlockedBy:0, resident:"Pip", short:"Your home base for sorting mail, meeting neighbours and planning the next route.", detail:"The lantern above the door never quite goes out. Pip keeps the incoming mail in neat piles, even when a parcel is larger than he is.", quest:"Sort your first batch of letters", feature:"mail" },
  { id:"village-square", name:"Village Square", x:18.5, y:27.5, icon:"🏘️", biome:"Old town", unlockedBy:0, resident:"Juniper", short:"The cobbled square is full of little stories. Its noticeboard has been empty for years.", detail:"Bring the noticeboard back to life and the villagers will begin leaving requests, rumours and tiny thank-you notes.", quest:"Restore the noticeboard", feature:"restoration" },
  { id:"general-store", name:"General Store", x:38, y:24, icon:"🧺", biome:"Market lane", unlockedBy:0, resident:"Marlo", short:"A warm little shop for postal tools, satchels and exceedingly nice string.", detail:"Marlo trades useful kit for acorns. Better tools make every shift more generous, but the shop has no patience for unpaid tabs.", quest:"Upgrade your postal kit", feature:"upgrades" },
  { id:"great-tree", name:"The Great Tree", x:62, y:20, icon:"🌳", biome:"Elderwood", unlockedBy:8, resident:"Luna", short:"An ancient tree glows at the centre of the woods. Someone has left a letter at its roots.", detail:"The oldest tree in Mosslight remembers every path. Restore its lanterns to reveal a route to stranger places.", quest:"Deliver 8 letters to awaken the lanterns", feature:"restoration" },
  { id:"starfall-ruins", name:"Starfall Ruins", x:91.5, y:20, icon:"🌌", biome:"Starlit highlands", unlockedBy:25, resident:"Aster", short:"A ruined observatory where moonlit letters are said to find their own way home.", detail:"The old postmarks here use constellations instead of addresses. Only experienced postkeepers can read them.", quest:"Deliver 25 letters to discover the ruins", feature:"collection" },
  { id:"riverside", name:"Riverside", x:55, y:51, icon:"🌊", biome:"Waterfall crossing", unlockedBy:5, resident:"Marlo", short:"A broken bridge strands the riverfolk on the far bank.", detail:"Repair the bridge and river deliveries become available. The ferry keeper promises a rare stamp to anyone who brings the first parcel across.", quest:"Repair the old bridge", feature:"restoration" },
  { id:"mountain-pass", name:"Mountain Pass", x:90, y:61.5, icon:"🏔️", biome:"Frostpeak trail", unlockedBy:15, resident:"Brin", short:"A snowy shortcut through the peaks, hidden behind a wind-bent gate.", detail:"Express routes cross the pass in half the time. It is beautiful, cold, and absolutely full of letters that smell like pine.", quest:"Open the mountain route", feature:"restoration" },
  { id:"willow-grove", name:"Willow Grove", x:80, y:86, icon:"🌸", biome:"Moonlit garden", unlockedBy:12, resident:"Luna", short:"Willow branches trail into a pond full of reflected stars.", detail:"The grove is a quiet place to find rare stamps and hear residents' stories after sunset.", quest:"Meet a new resident", feature:"residents" }
];

export const RESIDENTS = [
  { id:"pip", name:"Pip", species:"Hedgehog postkeeper", icon:"🦔", home:"post-office", unlockAt:0, line:"The letters keep arriving, and the village keeps waiting. Shall we help?", reward:"The first letter is always the most important one." },
  { id:"juniper", name:"Juniper", species:"Rabbit archivist", icon:"🐇", home:"village-square", unlockAt:3, line:"I can pin every little request to the noticeboard — if we can find enough paper.", reward:"Juniper's notes reveal the next village project." },
  { id:"marlo", name:"Marlo", species:"Raccoon shopkeeper", icon:"🦝", home:"general-store", unlockAt:5, line:"A good satchel is worth its weight in acorns. Mine is worth at least two weights.", reward:"Marlo's shop offers practical upgrades." },
  { id:"brin", name:"Brin", species:"Fox courier", icon:"🦊", home:"mountain-pass", unlockAt:15, line:"The mountain route is clear. Bring me a letter and I'll show you the quick way.", reward:"Brin opens the express route." },
  { id:"luna", name:"Luna", species:"Moth gardener", icon:"🦋", home:"willow-grove", unlockAt:12, line:"A rare stamp glows softly when it has somewhere important to go.", reward:"Luna knows where moonflower stamps are found." },
  { id:"aster", name:"Aster", species:"Owl astronomer", icon:"🦉", home:"starfall-ruins", unlockAt:25, line:"Stars are just very old letters that forgot their envelopes.", reward:"Aster shares the Starfall stamp set." }
];

export const UPGRADES = [
  { id:"satchel", name:"Bigger satchel", icon:"🎒", desc:"+2 acorns on each correct delivery.", base:35, max:5, stat:"reward" },
  { id:"ink", name:"Golden postmark ink", icon:"✨", desc:"Streak bonuses are more generous.", base:55, max:4, stat:"combo" },
  { id:"boots", name:"Express courier boots", icon:"🥾", desc:"Gain extra experience on every delivery.", base:70, max:4, stat:"xp" },
  { id:"bell", name:"Welcome bell", icon:"🔔", desc:"Find more bonus letters and rare stamps.", base:90, max:3, stat:"rare" }
];

export const RESTORATIONS = [
  { id:"noticeboard", name:"Village noticeboard", icon:"📋", desc:"Open residents' requests and village rumours.", cost:25, need:0, location:"village-square", reward:35 },
  { id:"bridge", name:"Riverside bridge", icon:"🌉", desc:"Reconnect the riverfolk and unlock Riverside.", cost:55, need:5, location:"riverside", reward:60 },
  { id:"lanterns", name:"Great Tree lanterns", icon:"🏮", desc:"Wake the ancient tree and light a new trail.", cost:80, need:8, location:"great-tree", reward:85 },
  { id:"cottage", name:"Pip's cosy cottage", icon:"🏡", desc:"Give Pip a home filled with warm lights.", cost:95, need:10, location:"post-office", reward:100 },
  { id:"mountain-gate", name:"Mountain pass gate", icon:"❄️", desc:"Open a faster postal route through Frostpeak.", cost:120, need:15, location:"mountain-pass", reward:130 },
  { id:"moon-gate", name:"Moonlit observatory", icon:"🌙", desc:"Restore the Starfall route and discover moonflower mail.", cost:180, need:25, location:"starfall-ruins", reward:200 }
];

export const QUESTS = [
  { id:"first-shift", title:"The first post run", icon:"✉️", description:"Deliver 10 letters around Mosslight.", kind:"deliveries", target:10, reward:65, stars:1, always:true },
  { id:"noticeboard", title:"Pin it to the board", icon:"📋", description:"Restore the village noticeboard.", kind:"restore", target:"noticeboard", reward:35, stars:1, always:true },
  { id:"bridge", title:"Across the river", icon:"🌉", description:"Deliver five letters and repair Riverside Bridge.", kind:"restore", target:"bridge", reward:60, stars:1, always:true },
  { id:"great-tree", title:"Lanterns in the leaves", icon:"🏮", description:"Deliver eight letters and relight the Great Tree.", kind:"restore", target:"lanterns", reward:85, stars:2, always:true },
  { id:"stamp-hunt", title:"A page of memories", icon:"📖", description:"Collect three different stamp designs.", kind:"stamps", target:3, reward:55, stars:1, always:true },
  { id:"homecoming", title:"A place to call home", icon:"🏡", description:"Help Pip restore a cosy cottage.", kind:"restore", target:"cottage", reward:100, stars:2, always:true }
];

export const NAV = [
  { id:"map", icon:"🗺️", label:"World Map" },
  { id:"mail", icon:"✉️", label:"Post Office" },
  { id:"quests", icon:"📜", label:"Quest Journal" },
  { id:"residents", icon:"🐾", label:"Residents" },
  { id:"album", icon:"🎟️", label:"Stamp Album" },
  { id:"upgrades", icon:"🛠️", label:"Upgrades" }
];