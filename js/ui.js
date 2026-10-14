import { STAMPS, LOCATIONS, RESIDENTS, UPGRADES, RESTORATIONS, QUESTS, NAV } from "./data.js";
import { unlocked, questProgress, questComplete, upgradeCost } from "./state.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const fmt = n => Math.floor(Number(n)||0).toLocaleString();
const icon = key => STAMPS[key]?.icon || "✉️";
const foundCount = state => Object.values(state.stampsFound).filter(Boolean).length;
const bar = (pct) => '<div class="progress-track"><i style="width:'+Math.min(100,Math.max(0,pct))+'%"></i></div>';
const button = (act,id,label,disabled=false,cls="card-button") => '<button class="'+cls+'" data-act="'+act+'" data-id="'+esc(id)+'" '+(disabled?"disabled":"")+'>'+label+'</button>';

function renderHotspots(state) {
  return LOCATIONS.map(location => {
    const open=unlocked(location,state);
    return '<button class="hotspot '+(open?"":"locked")+'" data-act="location" data-id="'+location.id+'" aria-label="'+esc(location.name)+(open?"":", locked")+'" style="left:'+location.x+'%;top:'+location.y+'%">'+
      '<span class="spot-icon">'+(open?location.icon:"🔒")+'</span><span class="spot-copy"><b>'+esc(location.name)+'</b><small>'+(open?esc(location.biome):"Unlock at "+location.unlockedBy+" letters")+'</small></span></button>';
  }).join("");
}
function renderNavigation(state) {
  return NAV.map(item=>'<button class="navbtn '+(state.activeTab===item.id?"active":"")+'" data-act="nav" data-id="'+item.id+'" aria-label="'+esc(item.label)+'" title="'+esc(item.label)+'"><span class="ico">'+item.icon+'</span><span>'+esc(item.label)+'</span></button>').join("");
}
function renderTop(state) {
  return '<header class="topbar"><div class="brand"><div class="brand-mark">✉️</div><div><h1>Mosslight Mail</h1><p>Every letter brings a little more magic home.</p></div></div>'+
    '<div class="topright"><div class="resources">'+
      '<div class="resource"><span class="ico">🌰</span><div><small>Acorns</small><b>'+fmt(state.acorns)+'</b></div></div>'+
      '<div class="resource"><span class="ico">⭐</span><div><small>Stars</small><b>'+fmt(state.stars)+'</b></div></div>'+
      '<div class="resource"><span class="ico">🎟️</span><div><small>Stamps</small><b>'+foundCount(state)+'/6</b></div></div>'+
      '<div class="resource"><span class="ico">🪶</span><div><small>Level</small><b>'+state.level+'</b></div></div></div>'+
      '<div class="top-actions">'+button("zoom-out","","−",false,"ornate-btn")+button("zoom-in","","＋",false,"ornate-btn")+button("fullscreen","","⛶",false,"ornate-btn")+button("nav","settings","⚙️",false,"ornate-btn")+'</div></div></header>';
}
function renderQuestCard(state) {
  const q=QUESTS.find(item=>!state.questsClaimed[item.id]);
  const total=QUESTS.filter(item=>state.questsClaimed[item.id]).length;
  if(!q) return '<aside class="quest-card"><div class="quest-header"><h2>Village Journal</h2><span>🌟</span></div><div class="quest-title">Every little task is complete!</div><div class="quest-description">Explore the map for another adventure.</div><div class="claim-row"><span>'+total+'/'+QUESTS.length+' quests</span>'+button("nav","quests","Read Journal ↗")+'</div></aside>';
  const progress=questProgress(q,state),target=(q.kind==="restore"||q.kind==="resident")?1:q.target,done=questComplete(q,state);
  return '<aside class="quest-card"><div class="quest-header"><h2>Current Quest</h2><span>'+q.icon+'</span></div>'+
    '<div class="quest-title">'+esc(q.title)+'</div><div class="quest-description">'+esc(q.description)+'</div>'+
    '<div class="quest-progress"><span>Quest progress</span><span>'+progress+'/'+target+'</span></div>'+bar(progress/target*100)+
    '<div class="claim-row"><span>🎁 '+q.reward+' acorns · '+(q.stars||0)+'★</span>'+button("claim-quest",q.id,done?"Claim":"In progress",!done,"claim-btn")+'</div></aside>';
}
function renderDialogue(state) {
  let speaker="Pip the Postkeeper",text="The letters keep arriving, and the village keeps waiting. Shall we help?";
  if(state.lastDelivery?.discovery){text=state.lastDelivery.discovery+" "+(state.lastDelivery.discoveryText||"");}
  else if(state.lastDelivery) text=state.lastDelivery.message;
  if(state.selectedLocation&&state.selectedLocation!=="post-office"){
    const loc=LOCATIONS.find(l=>l.id===state.selectedLocation);
    if(loc&&unlocked(loc,state)){speaker=loc.resident+" · "+loc.name;text=loc.short;}
  }
  return '<section class="dialogue"><div class="speaker">'+esc(speaker)+'</div><p>'+esc(text)+'</p><div class="dialogue-actions">'+button("nav","quests","📜 Journal",false,"text-btn")+button("nav","mail","✉️ Sort letters",false,"text-btn")+'</div></section>';
}
function renderDock(state) {
  const mail=state.currentMail, stamp=STAMPS[mail?.stampType]||STAMPS.mushroom;
  const chutes=Object.entries(STAMPS).map(([key,s])=>'<button class="chute '+(mail?.stampType===key?"hinted":"")+'" data-act="deliver" data-id="'+key+'" aria-label="Deliver with '+esc(s.name)+' stamp" title="'+esc(s.name+": "+s.description)+'"><span class="icon">'+s.icon+'</span><b>'+esc(s.name)+'</b></button>').join("");
  return '<section class="dock" aria-label="Mail delivery desk"><div class="mail-card"><div class="envelope-art"><span class="mail-symbol">'+icon(mail?.stampType)+'</span><span class="mail-ribbon">'+(mail?.special?"✦":"✉")+'</span></div>'+
    '<div class="mail-info"><h2>Incoming letter <span class="mail-code">#'+(mail?.code||"000")+'</span></h2><p><b>To:</b> '+esc(mail?.recipient||"A woodland friend")+'<br><b>From:</b> '+esc(mail?.sender||"Pip")+'</p><small>'+(mail?.special?"✦ Rare mail · bonus stars!":"Match the envelope stamp")+'</small></div></div>'+
    '<div class="chute-area"><div class="chute-heading"><b>📮 Choose the matching postmark</b><small>'+(state.streak?"🔥 "+state.streak+" delivery streak":"A perfect streak earns bonus acorns")+'</small></div><div class="chutes">'+chutes+'</div></div>'+
    '<div class="dock-footer"><span>📜 '+state.delivered+' letters safely delivered</span><span>🌿 Wrong stamps only reset the streak — progress is safe.</span><span>✦ Lv. '+state.level+' · '+(state.experience%100)+'% to next level</span></div></section>';
}
function contentCard(ico,title,desc,extra="") {
  return '<div class="content-card"><div class="card-icon">'+ico+'</div><div class="card-body"><b>'+esc(title)+'</b><small>'+esc(desc)+'</small>'+extra+'</div></div>';
}
function restorationCard(r,state) {
  const done=!!state.restorations[r.id],ready=state.delivered>=r.need&&state.acorns>=r.cost;
  const status=done?"Restored and shining":state.delivered<r.need?"Needs "+r.need+" deliveries":"Costs "+r.cost+" acorns";
  return contentCard(done?"✨":r.icon,r.name,r.desc,'<span class="tag">'+status+'</span>'+button("restore",r.id,done?"Restored":ready?"Restore · 🌰 "+r.cost:"Keep delivering",done||!ready));
}
function questsPanel(state) {
  return '<p>Small deeds light up the valley. Finish a quest and claim its rewards.</p><div class="cards">'+QUESTS.map(q=>{
    const n=questProgress(q,state),goal=(q.kind==="restore"||q.kind==="resident")?1:q.target,complete=questComplete(q,state),claimed=!!state.questsClaimed[q.id];
    const extra='<div class="bar-row"><span class="bar-title">'+n+'/'+goal+'</span>'+bar(n/goal*100)+'</div><small>Reward: 🌰 '+q.reward+' · ⭐ '+(q.stars||0)+'</small>'+button("claim-quest",q.id,claimed?"Reward claimed":complete?"Claim reward":"Keep going",claimed||!complete);
    return contentCard(q.icon,q.title,q.description,extra);
  }).join("")+'</div>';
}
function residentsPanel(state) {
  return '<p>Every resident has a story, a request, and perhaps a curious letter to deliver.</p><div class="cards">'+RESIDENTS.map(r=>{
    const ready=state.delivered>=r.unlockAt,met=!!state.residentsMet[r.id];
    const extra='<p class="modal-copy">'+esc(met?r.reward:ready?r.line:"More letters will bring this resident to your doorstep.")+'</p>'+button("meet-resident",r.id,met?"Say hello":ready?"Meet "+r.name:"Not yet",!ready);
    return contentCard(ready?r.icon:"🔒",r.name,r.species+" · "+(met?"Known friend":ready?"Ready to meet":"Meet after "+r.unlockAt+" deliveries"),extra);
  }).join("")+'</div>';
}
function upgradesPanel(state) {
  return '<p>The General Store turns everyday acorns into better kit. Choose an upgrade for your next shift.</p><div class="cards">'+UPGRADES.map(u=>{
    const level=state.upgrades[u.id]||0,cost=upgradeCost(u,state),max=level>=u.max;
    const extra='<div class="bar-row"><span class="bar-title">Level '+level+'/'+u.max+'</span>'+bar(level/u.max*100)+'</div>'+button("buy-upgrade",u.id,max?"Fully upgraded":"Upgrade · 🌰 "+cost,max||state.acorns<cost);
    return contentCard(u.icon,u.name,u.desc,extra);
  }).join("")+'</div><p class="modal-copy">Postal level '+state.level+' · '+state.experience+' XP · best streak '+state.bestStreak+'.</p>';
}
function albumPanel(state) {
  return '<p>'+foundCount(state)+'/6 designs discovered. Rare moon and star postmarks begin appearing after 8 and 15 deliveries.</p><div class="cards">'+Object.entries(STAMPS).map(([key,s])=>{
    const has=!!state.stampsFound[key];
    return contentCard(has?s.icon:"❔",has?s.name:"Undiscovered stamp",has?s.description:"Keep delivering letters to find this design.",'<span class="tag">'+(has?(state.stampCounts[key]||0)+" collected":"Unfound")+'</span>');
  }).join("")+'</div>';
}
function mailPanel(state) {
  const mail=state.currentMail;
  return '<p>Match the envelope to its postmark. Correct deliveries earn acorns and experience; long streaks are more rewarding.</p>'+
    contentCard(icon(mail?.stampType),"Letter #"+(mail?.code||"000")+" for "+(mail?.recipient||"a friend"),"Sent by "+(mail?.sender||"Pip")+" · "+(mail?.note||""),'<p class="modal-copy">Choose the '+esc(STAMPS[mail?.stampType]?.name||"matching")+' stamp on your delivery desk.</p>')+
    '<div class="cards">'+Object.entries(STAMPS).map(([key,s])=>contentCard(s.icon,s.name,s.description,button("deliver",key,"Use postmark"))).join("")+'</div>';
}
function mapPanel(state) {
  return '<p>Wander the valley, meet its woodland residents, and deliver mail to wake the old places from their sleep.</p><div class="cards">'+LOCATIONS.map(l=>{
    const open=unlocked(l,state);
    return contentCard(open?l.icon:"🔒",l.name,open?l.short:"Discover after "+l.unlockedBy+" successful deliveries.",button("location",l.id,open?"Explore":"Journey locked"));
  }).join("")+'</div>';
}
function restorationPanel(state) {
  const done=Object.values(state.restorations).filter(Boolean).length;
  return '<p>Bring Mosslight back to life one useful little place at a time.</p><div class="bar-row"><span class="bar-title">Valley restored</span>'+bar(done/RESTORATIONS.length*100)+'<b>'+done+'/'+RESTORATIONS.length+'</b></div><div class="cards">'+RESTORATIONS.map(r=>restorationCard(r,state)).join("")+'</div>';
}
function settingsPanel(state) {
  return '<p>Make the postal desk comfortable for your next shift.</p>'+
    '<div class="setting-row"><div><b>Delivery chimes</b><div class="modal-copy">Tiny notes for successful deliveries.</div></div>'+button("toggle-sound","",state.sound?"🔔 Sound on":"🔕 Sound off",false,"setting-toggle")+'</div>'+
    '<div class="setting-row"><div><b>Map zoom</b><div class="modal-copy">Adjust the world view.</div></div>'+button("zoom-out","","−",false,"card-button")+' <b>'+Math.round((state.mapZoom||1)*100)+'%</b> '+button("zoom-in","","＋",false,"card-button")+'</div>'+
    '<div class="setting-row"><div><b>Save progress</b><div class="modal-copy">Progress saves automatically in this browser.</div></div>'+button("save-now","","Save now",false,"setting-toggle")+'</div>'+
    '<div class="setting-row"><div><b>Start over</b><div class="modal-copy">Clear the saved village and start fresh.</div></div>'+button("confirm-reset","","Reset game",false,"setting-toggle")+'</div>';
}
function locationPanel(state) {
  const loc=LOCATIONS.find(l=>l.id===state.selectedLocation);
  if(!loc) return {title:"Unknown place",icon:"🗺️",body:"<p>This part of the map is hidden by the mist.</p>"};
  if(!unlocked(loc,state)) return {title:loc.name,icon:"🔒",body:contentCard("🌫️","A path hidden in mist",loc.short,"<p class='modal-copy'>Deliver "+Math.max(0,loc.unlockedBy-state.delivered)+" more letters to discover this place.</p>")};
  const r=RESTORATIONS.filter(item=>item.location===loc.id);
  const resident=RESIDENTS.find(person=>person.name===loc.resident);
  let body=contentCard(loc.icon,loc.biome+" · "+loc.name,loc.short,"<p class='modal-copy'>"+esc(loc.detail)+"</p><span class='tag'>Discovered</span>");
  if(resident) body+='<div style="margin-top:9px">'+contentCard(resident.icon,resident.name+" · "+resident.species,resident.line,button("meet-resident",resident.id,"Talk to "+resident.name))+'</div>';
  if(r.length) body+='<h3 style="font:700 17px Georgia,serif;margin:16px 0 7px">Restoration nearby</h3>'+r.map(item=>restorationCard(item,state)).join("");
  body+='<div class="cards">'+contentCard("✉️","Postal progress",state.delivered+" letters · best streak "+state.bestStreak,button("nav","mail","Sort mail"))+contentCard("📜","Local request",loc.quest,button("nav","quests","Quest journal"))+'</div>';
  return {title:loc.name,icon:loc.icon,body};
}
function renderPanel(state) {
  if(!state.currentPanel) return '<div class="modal-shade hidden" aria-hidden="true"></div>';
  let title="",ico="📜",body="";
  if(state.currentPanel==="location"){const p=locationPanel(state);title=p.title;ico=p.icon;body=p.body;}
  else if(state.currentPanel==="map"){title="The Lands of Mosslight";ico="🗺️";body=mapPanel(state);}
  else if(state.currentPanel==="mail"){title="The Post Office";ico="✉️";body=mailPanel(state);}
  else if(state.currentPanel==="quests"){title="Quest Journal";ico="📜";body=questsPanel(state);}
  else if(state.currentPanel==="residents"){title="Woodland Residents";ico="🐾";body=residentsPanel(state);}
  else if(state.currentPanel==="album"){title="The Stamp Album";ico="🎟️";body=albumPanel(state);}
  else if(state.currentPanel==="upgrades"){title="The General Store";ico="🛠️";body=upgradesPanel(state);}
  else if(state.currentPanel==="restoration"){title="Village Restoration";ico="🏡";body=restorationPanel(state);}
  else if(state.currentPanel==="settings"){title="Postkeeper Settings";ico="⚙️";body=settingsPanel(state);}
  else {title="A Little Note";body="<p>There is nothing here yet.</p>";}
  return '<div class="modal-shade" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-header"><h2 id="modalTitle">'+ico+' '+esc(title)+'</h2><button class="modal-close" data-act="close-panel" aria-label="Close">✕</button></div><div class="modal-body">'+body+'</div></section></div>';
}
export function renderGame(state) {
  const fires=Array.from({length:18},(_,i)=>'<i class="firefly" style="left:'+((i*53+7)%98)+'%;top:'+((i*37+11)%88)+'%;animation-delay:-'+((i%7)*.7)+'s"></i>').join("");
  const toast=state.toast?'<div class="toast">'+esc(state.toast)+'</div>':"";
  return '<main class="game"><div class="world-viewport"><div class="world-layer" id="worldLayer" style="transform:translate('+(state.panX||0)+'px,'+(state.panY||0)+'px) scale('+(state.mapZoom||1)+')"><div class="world-art" role="img" aria-label="A hand-painted magical woodland village with rivers, waterfalls, bridges and lantern-lit cottages"></div><div class="hotspots">'+renderHotspots(state)+'</div></div><div class="world-vignette"></div><div class="ambient">'+fires+'</div></div>'+
    renderTop(state)+'<nav class="sidebar" aria-label="Game menu">'+renderNavigation(state)+'</nav>'+
    '<div class="world-status">DAY '+(Math.floor(state.delivered/10)+1)+' · '+(state.level===1?"A NEW POSTKEEPER":state.level<4?"RESTORING THE VALLEY":"THE MAGIC IS RETURNING")+'</div>'+
    renderQuestCard(state)+renderDialogue(state)+renderDock(state)+renderPanel(state)+'<div id="toastSlot" aria-live="polite">'+toast+'</div></main>';
}