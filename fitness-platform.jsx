import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const weightHistory = [
  { day: "Mar 1", w: 70.2 }, { day: "Mar 3", w: 69.8 }, { day: "Mar 5", w: 69.5 },
  { day: "Mar 7", w: 69.1 }, { day: "Mar 9", w: 68.7 }, { day: "Mar 11", w: 68.2 }, { day: "Mar 13", w: 68.0 },
];
const calorieData = [
  { day: "M", cal: 1780 }, { day: "T", cal: 1820 }, { day: "W", cal: 1650 },
  { day: "T", cal: 1900 }, { day: "F", cal: 1800 }, { day: "S", cal: 2100 }, { day: "S", cal: 1750 },
];
const clients = [
  { id: 1, name: "Aria Solano", goal: "Fat Loss", weight: 68.2, streak: 12, initials: "AS", color: "#C9973A", checkins: 18, progress: 76 },
  { id: 2, name: "Marcus Holt", goal: "Muscle Gain", weight: 84.5, streak: 7, initials: "MH", color: "#3a8c6e", checkins: 22, progress: 54 },
  { id: 3, name: "Priya Nair", goal: "Endurance", weight: 59.1, streak: 21, initials: "PN", color: "#a06b4a", checkins: 14, progress: 88 },
];
const mealPlans = [
  { name: "High Protein Cut", cal: 1800, p: 180, c: 120, f: 60, tag: "Fat Loss", color: "#C9973A" },
  { name: "Lean Bulk Blueprint", cal: 2600, p: 200, c: 280, f: 85, tag: "Muscle Gain", color: "#3a8c6e" },
  { name: "Endurance Fuel", cal: 2200, p: 140, c: 300, f: 70, tag: "Performance", color: "#a06b4a" },
];
const HABITS = [
  { id: 1, icon: "🏋️", label: "Morning Workout", points: 30 },
  { id: 2, icon: "💧", label: "2L Water Intake", points: 20 },
  { id: 3, icon: "🌙", label: "8 Hours Sleep", points: 25 },
  { id: 4, icon: "🥗", label: "Clean Nutrition", points: 20 },
  { id: 5, icon: "🚶", label: "10,000 Steps", points: 15 },
  { id: 6, icon: "🧘", label: "5 min Mindfulness", points: 10 },
];

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #FAF7F2;
  --cream2: #F4EFE6;
  --cream3: #EAE3D6;
  --forest: #1A3328;
  --forest2: #234438;
  --forest3: #2D5848;
  --gold: #C9973A;
  --gold2: #E4B35A;
  --gold-pale: rgba(201,151,58,0.12);
  --gold-glow: rgba(201,151,58,0.25);
  --terra: #A06B4A;
  --text: #1A1810;
  --text2: #4A4535;
  --text3: #8A8070;
  --green: #3a8c6e;
  --red: #C0544A;
  --border: rgba(26,35,24,0.08);
  --border2: rgba(26,35,24,0.14);
  --glass: rgba(255,255,255,0.72);
  --shadow: 0 2px 20px rgba(26,35,40,0.08);
  --shadow-lg: 0 8px 40px rgba(26,35,40,0.14);
}

html, body, #root { min-height: 100%; font-family: 'Outfit', sans-serif; background: var(--cream); color: var(--text); -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 5px; background: var(--cream2); }
::-webkit-scrollbar-thumb { background: var(--cream3); border-radius: 4px; }

/* ORBS */
.orb-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.orb { position: absolute; border-radius: 50%; filter: blur(90px); }
.orb1 { width: 560px; height: 560px; background: radial-gradient(circle, rgba(228,179,90,0.32) 0%, transparent 70%); top: -140px; left: -120px; animation: float 14s ease-in-out infinite; }
.orb2 { width: 440px; height: 440px; background: radial-gradient(circle, rgba(58,140,110,0.22) 0%, transparent 70%); bottom: -100px; right: -80px; animation: float 10s ease-in-out infinite; animation-delay: -4s; }
.orb3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(160,107,74,0.18) 0%, transparent 70%); top: 45%; left: 35%; animation: float 16s ease-in-out infinite; animation-delay: -9s; }
@keyframes float { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(24px,-28px) scale(1.04)} 66%{transform:translate(-16px,18px) scale(0.97)} }

/* SHELL */
.shell { display: flex; min-height: 100vh; position: relative; z-index: 1; }

/* SIDEBAR */
.sidebar {
  width: 80px; background: var(--forest); position: fixed; left: 0; top: 0; bottom: 0;
  display: flex; flex-direction: column; align-items: center; padding: 28px 0 24px;
  z-index: 100; transition: width 0.32s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 4px 0 32px rgba(0,0,0,0.14);
}
.sidebar.open { width: 228px; align-items: flex-start; padding: 28px 14px 24px; }
.sb-logo {
  width: 44px; height: 44px; border-radius: 14px;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 22px; color: var(--forest); font-weight: 700;
  flex-shrink: 0; margin-bottom: 32px; box-shadow: 0 4px 20px rgba(201,151,58,0.45);
}
.sidebar.open .sb-logo { margin-left: 4px; }
.sb-sec { font-size: 9px; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(255,255,255,0.22); margin: 14px 0 5px 4px; display: none; white-space: nowrap; }
.sidebar.open .sb-sec { display: block; }
.sb-btn {
  width: 48px; height: 48px; border-radius: 14px; border: none; background: transparent;
  color: rgba(255,255,255,0.42); cursor: pointer; display: flex; align-items: center; justify-content: center;
  gap: 12px; font-size: 19px; transition: all 0.2s; flex-shrink: 0; position: relative;
}
.sidebar.open .sb-btn { width: 100%; height: 44px; justify-content: flex-start; padding: 0 12px; }
.sb-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); }
.sb-btn.act { background: rgba(201,151,58,0.16); color: var(--gold2); }
.sb-lbl { font-size: 13px; font-weight: 500; white-space: nowrap; display: none; }
.sidebar.open .sb-lbl { display: block; }
.sb-div { width: 40px; height: 1px; background: rgba(255,255,255,0.08); margin: 10px 0; flex-shrink: 0; }
.sidebar.open .sb-div { width: 100%; }
.sb-foot { margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; }
.sidebar.open .sb-foot { align-items: flex-start; }
.sb-av { width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, var(--terra), var(--gold)); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
.sb-tog {
  width: 44px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45); cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 15px; transition: all 0.2s;
}
.sidebar.open .sb-tog { width: 100%; gap: 10px; padding: 0 12px; font-size: 12px; justify-content: flex-start; }
.sb-tog:hover { background: rgba(255,255,255,0.12); color: #fff; }

/* MAIN */
.main { margin-left: 80px; flex: 1; padding: 36px 40px; min-height: 100vh; }

/* TOPBAR */
.topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 34px; }
.greeting { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 500; color: var(--forest); line-height: 1.1; animation: fadeUp 0.5s ease both; }
.greeting em { font-style: italic; color: var(--gold); }
.subline { font-size: 13px; color: var(--text3); margin-top: 6px; letter-spacing: 0.04em; animation: fadeUp 0.5s 0.1s ease both; }
.top-r { display: flex; align-items: center; gap: 12px; animation: fadeUp 0.5s 0.12s ease both; }

/* CLOCK */
.clock-chip {
  background: var(--glass); backdrop-filter: blur(14px);
  border: 1px solid var(--border2); border-radius: 14px; padding: 10px 18px;
  display: flex; flex-direction: column; align-items: flex-end; box-shadow: var(--shadow);
}
.clock-t { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--forest); font-weight: 500; line-height: 1; }
.clock-t sup { font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--text3); }
.clock-d { font-size: 11px; color: var(--text3); margin-top: 2px; letter-spacing: 0.06em; }

/* VIEW TOGGLE */
.vtog { background: var(--glass); backdrop-filter: blur(14px); border: 1px solid var(--border2); border-radius: 14px; padding: 5px; display: flex; box-shadow: var(--shadow); }
.vt { padding: 8px 18px; border-radius: 10px; border: none; background: transparent; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text3); transition: all 0.22s; }
.vt.act { background: var(--forest); color: #fff; box-shadow: 0 2px 12px rgba(26,35,40,0.2); }

@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.a0{animation:fadeUp 0.44s ease both} .a1{animation:fadeUp 0.44s 0.07s ease both} .a2{animation:fadeUp 0.44s 0.14s ease both} .a3{animation:fadeUp 0.44s 0.21s ease both}

/* STAT GRID */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
.stat-tile {
  background: var(--glass); backdrop-filter: blur(16px); border: 1px solid var(--border2);
  border-radius: 20px; padding: 20px 22px; box-shadow: var(--shadow); transition: all 0.25s;
  position: relative; overflow: hidden; cursor: default;
}
.stat-tile::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2.5px; background:linear-gradient(90deg, var(--gold), transparent); transform:scaleX(0); transform-origin:left; transition:transform 0.3s; border-radius:0 0 20px 20px; }
.stat-tile:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
.stat-tile:hover::after { transform: scaleX(1); }
.st-ico { font-size: 22px; margin-bottom: 10px; }
.st-v { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 500; color: var(--forest); line-height: 1; margin-bottom: 4px; }
.st-v sup { font-size: 13px; color: var(--text3); font-family: 'Outfit',sans-serif; }
.st-l { font-size: 12px; color: var(--text3); }
.st-d { font-size: 11px; font-weight: 600; margin-top: 6px; }
.st-d.up { color: var(--green); } .st-d.dn { color: var(--red); } .st-d.nu { color: var(--text3); }

/* TABS */
.nav-tabs { display:flex; gap:4px; background:var(--glass); backdrop-filter:blur(14px); border:1px solid var(--border); border-radius:16px; padding:5px; margin-bottom:26px; box-shadow:var(--shadow); width:fit-content; }
.nt { padding:9px 22px; border-radius:12px; border:none; background:transparent; font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; cursor:pointer; color:var(--text3); transition:all 0.22s; white-space:nowrap; }
.nt.act { background:var(--forest); color:#fff; box-shadow:0 2px 14px rgba(26,35,40,0.18); }

/* CARDS */
.card {
  background: var(--glass); backdrop-filter: blur(16px);
  border: 1px solid var(--border2); border-radius: 20px; padding: 24px;
  box-shadow: var(--shadow); transition: all 0.24s; position: relative; overflow: hidden;
}
.card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent); }
.card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.card-forest { background: var(--forest); border-color: var(--forest2); }
.card-forest::before { background: linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); }
.c-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--text3); margin-bottom: 14px; font-weight: 600; }
.c-lbl-w { color: rgba(255,255,255,0.45); }

/* FORM */
.fl { margin-bottom: 16px; }
.flbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text3); margin-bottom: 7px; font-weight: 600; }
input[type=number], input[type=text], textarea, select {
  width: 100%; background: var(--cream); border: 1.5px solid var(--border2); border-radius: 12px;
  font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--text); padding: 11px 14px;
  outline: none; transition: all 0.2s; -webkit-appearance: none;
}
input:focus, textarea:focus, select:focus { border-color: var(--gold); background: #fff; box-shadow: 0 0 0 4px rgba(201,151,58,0.1); }
textarea { resize: none; line-height: 1.65; }

/* MOOD */
.mood-row { display: flex; gap: 8px; }
.mood-btn { flex: 1; padding: 12px 4px; border-radius: 14px; border: 1.5px solid var(--border2); background: var(--cream); cursor: pointer; text-align: center; transition: all 0.22s; display: flex; flex-direction: column; align-items: center; gap: 5px; }
.mood-e { font-size: 22px; }
.mood-l { font-size: 10px; color: var(--text3); font-family: 'Outfit',sans-serif; font-weight: 600; letter-spacing: 0.04em; }
.mood-btn:hover { border-color: var(--gold); background: #fff; transform: translateY(-2px); }
.mood-btn.sel { border-color: var(--gold); background: var(--gold-pale); }
.mood-btn.sel .mood-l { color: var(--gold); }

/* TOGGLE */
.trow { display: flex; gap: 6px; }
.tbtn { flex: 1; padding: 10px 6px; border-radius: 11px; border: 1.5px solid var(--border2); background: var(--cream); font-family: 'Outfit',sans-serif; font-size: 12px; color: var(--text3); cursor: pointer; transition: all 0.2s; text-align: center; font-weight: 500; }
.tbtn:hover { border-color: var(--forest); color: var(--forest); }
.tbtn.sel { background: var(--forest); border-color: var(--forest); color: #fff; }

/* BUTTONS */
.btn { border: none; border-radius: 13px; cursor: pointer; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px; transition: all 0.22s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
.btn-g { background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%); color: var(--forest); padding: 12px 28px; box-shadow: 0 4px 18px rgba(201,151,58,0.3); }
.btn-g:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,151,58,0.4); }
.btn-f { background: var(--forest); color: #fff; padding: 12px 28px; }
.btn-f:hover { background: var(--forest2); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,35,40,0.2); }
.btn-o { background: transparent; border: 1.5px solid var(--border2); color: var(--text2); padding: 10px 20px; font-size: 13px; border-radius: 11px; }
.btn-o:hover { border-color: var(--forest); color: var(--forest); }
.btn-sm { padding: 8px 16px !important; font-size: 12px !important; border-radius: 10px !important; }

/* AI PANEL */
.ai-panel { background: linear-gradient(140deg, var(--forest) 0%, var(--forest3) 100%); border-radius: 20px; padding: 24px; color: #fff; position: relative; overflow: hidden; box-shadow: 0 8px 40px rgba(26,35,40,0.2); }
.ai-panel::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle,rgba(201,151,58,0.22) 0%,transparent 70%); }
.ai-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(201,151,58,0.18); border:1px solid rgba(201,151,58,0.38); border-radius:20px; padding:5px 13px; font-size:10px; text-transform:uppercase; letter-spacing:0.14em; color:var(--gold2); font-weight:700; margin-bottom:16px; }
.ai-pulse { width:7px; height:7px; border-radius:50%; background:var(--gold2); animation:pulse 2s infinite; }
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(1.45)}}
.ai-txt { font-size:14px; line-height:1.75; color:rgba(255,255,255,0.8); font-weight:300; }
.ai-load { display:flex; gap:5px; align-items:center; padding:8px 0; }
.ai-dot { width:7px; height:7px; border-radius:50%; background:var(--gold2); animation:ablink 1.3s infinite; }
.ai-dot:nth-child(2){animation-delay:.22s} .ai-dot:nth-child(3){animation-delay:.44s}
@keyframes ablink{0%,80%,100%{opacity:0.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}

/* HABIT */
.hpb { height: 7px; background: var(--cream3); border-radius: 4px; overflow: hidden; margin-bottom: 18px; }
.hpf { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 4px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
.hitem { display:flex; align-items:center; gap:13px; padding:12px 15px; border-radius:14px; border:1.5px solid var(--border); background:var(--cream2); cursor:pointer; transition:all 0.22s; margin-bottom:8px; user-select:none; }
.hitem:hover { background:#fff; border-color:var(--border2); box-shadow:0 4px 16px rgba(26,35,40,0.07); }
.hitem.don { background:var(--gold-pale); border-color:rgba(201,151,58,0.3); }
.hico { font-size:19px; width:38px; height:38px; border-radius:11px; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.07); flex-shrink:0; }
.hitem.don .hico { background:var(--gold); }
.hnm { flex:1; font-size:14px; font-weight:500; color:var(--text2); }
.hitem.don .hnm { color:var(--forest); }
.hpt { font-size:11px; color:var(--text3); font-weight:600; }
.hitem.don .hpt { color:var(--gold); }
.hchk { width:26px; height:26px; border-radius:8px; border:1.5px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:13px; background:#fff; transition:all 0.2s; flex-shrink:0; color:transparent; }
.hitem.don .hchk { background:var(--forest); border-color:var(--forest); color:#fff; }

/* WEEK GRID */
.wgrid { display:grid; grid-template-columns:repeat(7,1fr); gap:5px; }
.wgd { text-align:center; }
.wgl { font-size:10px; color:var(--text3); font-weight:700; text-transform:uppercase; margin-bottom:5px; }
.wgc { width:100%; aspect-ratio:1; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:12px; border:1.5px solid var(--border); background:var(--cream2); transition:all 0.2s; }
.wgc.full { background:var(--forest); border-color:var(--forest); color:#fff; }
.wgc.part { background:var(--gold-pale); border-color:rgba(201,151,58,0.4); }
.wgc.now { box-shadow:0 0 0 2px var(--gold); }

/* MEAL */
.meal-c { background:var(--glass); backdrop-filter:blur(16px); border:2px solid var(--border); border-radius:20px; padding:22px; cursor:pointer; transition:all 0.25s; position:relative; overflow:hidden; }
.meal-c:hover { transform:translateY(-3px); box-shadow:var(--shadow-lg); }
.meal-c.sel { border-color:var(--gold); background:var(--gold-pale); }
.meal-bdg { display:inline-block; font-size:9px; text-transform:uppercase; letter-spacing:0.14em; font-weight:700; background:var(--forest); color:var(--gold2); border-radius:20px; padding:4px 10px; margin-bottom:12px; }
.meal-ttl { font-family:'Playfair Display',serif; font-size:21px; font-weight:500; color:var(--forest); margin-bottom:6px; line-height:1.2; }
.meal-cal { font-size:13px; color:var(--text3); margin-bottom:14px; }
.mbar { display:flex; border-radius:8px; overflow:hidden; height:5px; margin-bottom:14px; }
.mseg { height:100%; }
.mrow { display:flex; }
.mitm { flex:1; text-align:center; }
.mv { font-size:17px; font-weight:600; color:var(--forest); font-family:'Playfair Display',serif; }
.ml { font-size:10px; text-transform:uppercase; letter-spacing:0.08em; color:var(--text3); margin-top:2px; }

/* CLIENT */
.cc { background:var(--glass); backdrop-filter:blur(16px); border:1.5px solid var(--border2); border-radius:20px; padding:20px; transition:all 0.25s; cursor:pointer; }
.cc:hover { box-shadow:var(--shadow-lg); transform:translateY(-2px); }
.cc.sel { border-color:var(--gold); background:var(--gold-pale); }
.cav { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; flex-shrink:0; }
.cn { font-size:15px; font-weight:600; color:var(--forest); }
.cm { font-size:12px; color:var(--text3); margin-top:2px; }
.cst { display:inline-flex; align-items:center; gap:4px; background:var(--gold-pale); border:1px solid rgba(201,151,58,0.3); border-radius:20px; padding:3px 10px; font-size:11px; color:var(--gold); font-weight:700; }
.cpb { height:4px; background:var(--cream3); border-radius:2px; margin-top:12px; overflow:hidden; }
.cpf { height:100%; border-radius:2px; transition:width 0.6s ease; }

/* FB */
.fbc { background:var(--cream2); border:1px solid var(--border); border-radius:14px; padding:15px; margin-bottom:10px; transition:all 0.2s; }
.fbc:hover { background:#fff; box-shadow:var(--shadow); }
.fbf { font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:var(--gold); font-weight:700; margin-bottom:5px; }
.fbt { font-size:13px; color:var(--text2); line-height:1.65; }
.fbd { font-size:11px; color:var(--text3); margin-top:6px; }

/* RING */
.ring-wrap { position:relative; display:inline-block; }

/* PHOTO */
.pzone { border:2px dashed var(--cream3); border-radius:16px; padding:34px 20px; text-align:center; cursor:pointer; transition:all 0.25s; background:var(--cream2); }
.pzone:hover { border-color:var(--gold); background:var(--gold-pale); }
input[type=file] { display:none; }

/* MEAS */
.mr { display:flex; align-items:center; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--border); }
.mr:last-child { border-bottom:none; }

/* DIVIDER */
.dvd { height:1px; background:var(--border); margin:18px 0; }

/* SUCCESS */
.ok { text-align:center; padding:28px 16px; }
@keyframes pop{from{transform:scale(0.4);opacity:0}to{transform:scale(1);opacity:1}}
.ok-ico { font-size:48px; margin-bottom:12px; animation:pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }

/* GRIDS */
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
.g64 { display:grid; grid-template-columns:1.55fr 1fr; gap:16px; }
.g46 { display:grid; grid-template-columns:1fr 1.55fr; gap:16px; }
.mb16 { margin-bottom:16px; }
.mb24 { margin-bottom:24px; }

/* CHART OVERRIDES */
.recharts-cartesian-axis-tick text { fill:var(--text3)!important; font-size:10px!important; font-family:'Outfit',sans-serif!important; }
.custom-tip { background:var(--forest); color:#fff; border-radius:10px; padding:8px 14px; font-size:13px; font-family:'Outfit',sans-serif; box-shadow:0 4px 20px rgba(0,0,0,0.14); }
.tip-v { font-family:'Playfair Display',serif; font-size:18px; }
.tip-l { font-size:10px; opacity:0.55; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:1px; }

/* RESPONSIVE */
@media(max-width:960px){.stat-grid{grid-template-columns:repeat(2,1fr)} .g64,.g46,.g2{grid-template-columns:1fr} .g3{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.main{padding:20px 16px;margin-left:60px} .greeting{font-size:28px} .g3{grid-template-columns:1fr}}
`;

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */
function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const pad = n => String(n).padStart(2, "0");
  return (
    <div className="clock-chip">
      <div className="clock-t">{pad(t.getHours())}:{pad(t.getMinutes())}<sup>:{pad(t.getSeconds())}</sup></div>
      <div className="clock-d">{t.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
    </div>
  );
}

function Ring({ pct, size = 84, stroke = 8, color = "#C9973A", children }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--cream3)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

const CTip = ({ active, payload, suf = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tip">
      <div className="tip-l">{payload[0].payload.day ?? payload[0].payload.cal ? "" : ""}</div>
      <div className="tip-v">{payload[0].value}{suf}</div>
    </div>
  );
};

function AISummary({ data }) {
  const [st, setSt] = useState("idle");
  const [txt, setTxt] = useState("");
  const run = async () => {
    setSt("loading"); setTxt("");
    const p = `You are a warm, expert fitness coach. Write a motivating 2-3 sentence daily summary for a client based on their check-in. Be specific and personal, end with one actionable tip. Under 70 words. Start directly.

Check-in: Mood: ${data.mood || "Good"} | Energy: ${data.energy || 7}/10 | Sleep: ${data.sleep || 7.5}h | Workout: ${data.workout || "Completed"} | Weight: ${data.weight || 68.2}kg | Notes: "${data.notes || "Felt solid today"}"`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: p }] })
      });
      const d = await r.json();
      setTxt(d.content?.find(b => b.type === "text")?.text || "Could not generate summary.");
    } catch { setTxt("Connection error. Please try again."); }
    setSt("done");
  };
  return (
    <div className="ai-panel">
      <div className="ai-badge"><span className="ai-pulse" />AI Coach · Daily Summary</div>
      {st === "idle" && <>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.7, marginBottom: 18 }}>Fill in your check-in and receive a personalised AI coaching message.</p>
        <button className="btn btn-g btn-sm" onClick={run}>✦ Generate My Summary</button>
      </>}
      {st === "loading" && <div className="ai-load"><div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" /></div>}
      {st === "done" && <>
        <p className="ai-txt">{txt}</p>
        <button style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.38)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "Outfit,sans-serif", padding: 0 }} onClick={run}>Regenerate</button>
      </>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CLIENT VIEW
───────────────────────────────────────────── */
function ClientView() {
  const [tab, setTab] = useState("checkin");
  const [mood, setMood] = useState(null);
  const [ci, setCi] = useState({ energy: "", sleep: "", weight: "", notes: "", workout: null });
  const [done, setDone] = useState(false);
  const [habits, setHabits] = useState(HABITS.map(h => ({ ...h, done: [3].includes(h.id) })));
  const [meal, setMeal] = useState(0);
  const moods = [{ e: "😩", l: "Rough" }, { e: "😐", l: "Okay" }, { e: "😊", l: "Good" }, { e: "🔥", l: "Fire" }];
  const dH = habits.filter(h => h.done).length;
  const pts = habits.filter(h => h.done).reduce((a, h) => a + h.points, 0);
  const totPts = habits.reduce((a, h) => a + h.points, 0);
  const toggle = id => setHabits(hs => hs.map(h => h.id === id ? { ...h, done: !h.done } : h));
  const TABS = { checkin: "📋 Check-In", habits: "✓ Habits", nutrition: "🥗 Nutrition", progress: "📈 Progress" };

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="greeting">Good morning, <em>Aria</em>.</div>
          <div className="subline">Week 8 · Fat Loss Program · 12-day streak 🔥</div>
        </div>
        <div className="top-r"><Clock /></div>
      </div>

      <div className="stat-grid mb24">
        {[
          { ico: "⚖️", v: "68.2", sup: "kg", l: "Current Weight", d: "↓ 2.0kg this month", dir: "up" },
          { ico: "🔥", v: "12", sup: "days", l: "Active Streak", d: "Personal best!", dir: "up" },
          { ico: "✓", v: `${dH}/6`, sup: "", l: "Habits Today", d: dH === 6 ? "🌟 Perfect!" : `${6 - dH} remaining`, dir: dH === 6 ? "up" : "nu" },
          { ico: "🎯", v: "1,800", sup: "kcal", l: "Daily Target", d: "High Protein Cut", dir: "nu" },
        ].map((s, i) => (
          <div className="stat-tile a0" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="st-ico">{s.ico}</div>
            <div className="st-v">{s.v} <sup>{s.sup}</sup></div>
            <div className="st-l">{s.l}</div>
            <div className={`st-d ${s.dir}`}>{s.d}</div>
          </div>
        ))}
      </div>

      <div className="nav-tabs a1">
        {Object.entries(TABS).map(([k, v]) => (
          <button key={k} className={`nt ${tab === k ? "act" : ""}`} onClick={() => setTab(k)}>{v}</button>
        ))}
      </div>

      {tab === "checkin" && (
        <div className="g64 a2">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="c-lbl">Daily Check-In</div>
              {done ? (
                <div className="ok">
                  <div className="ok-ico">✅</div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: "var(--forest)", marginBottom: 6 }}>Submitted for today!</div>
                  <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}>Your coach has been notified.</div>
                  <button className="btn btn-o" onClick={() => setDone(false)}>Edit Entry</button>
                </div>
              ) : (
                <>
                  <div className="fl">
                    <div className="flbl">How are you feeling today?</div>
                    <div className="mood-row">
                      {moods.map((m, i) => (
                        <button key={i} className={`mood-btn ${mood === i ? "sel" : ""}`} onClick={() => setMood(i)}>
                          <span className="mood-e">{m.e}</span><span className="mood-l">{m.l}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }} className="fl">
                    {[["Energy (1–10)", "energy", "8"], ["Sleep (hrs)", "sleep", "7.5"], ["Weight (kg)", "weight", "68.2"]].map(([l, k, p]) => (
                      <div key={k}>
                        <div className="flbl">{l}</div>
                        <input type="number" placeholder={p} value={ci[k]} onChange={e => setCi({ ...ci, [k]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                  <div className="fl">
                    <div className="flbl">Workout Completed?</div>
                    <div className="trow">
                      {["✅ Yes", "❌ No", "😴 Rest Day"].map(o => (
                        <button key={o} className={`tbtn ${ci.workout === o ? "sel" : ""}`} onClick={() => setCi({ ...ci, workout: o })}>{o}</button>
                      ))}
                    </div>
                  </div>
                  <div className="fl">
                    <div className="flbl">Notes for your coach</div>
                    <textarea rows={3} placeholder="How did training feel? Any wins or struggles?" value={ci.notes} onChange={e => setCi({ ...ci, notes: e.target.value })} />
                  </div>
                  <button className="btn btn-g" style={{ width: "100%" }} onClick={() => { if (ci.energy || mood !== null) setDone(true); }}>
                    Submit Check-In →
                  </button>
                </>
              )}
            </div>

            <div className="card">
              <div className="c-lbl">Latest Coach Feedback</div>
              {[
                { t: "Fantastic week Aria! Your morning workout consistency is really showing. Keep protein above 140g on rest days for recovery.", d: "Mar 11" },
                { t: "Sleep improving to 7.5h average — this will pay dividends on recovery and fat loss rate. Keep it up!", d: "Mar 8" },
              ].map((f, i) => (
                <div className="fbc" key={i}>
                  <div className="fbf">Coach Marcus</div>
                  <div className="fbt">{f.t}</div>
                  <div className="fbd">{f.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AISummary data={{ ...ci, mood: moods[mood]?.l }} />

            <div className="card">
              <div className="c-lbl">Weight Trend — March</div>
              <ResponsiveContainer width="100%" height={175}>
                <AreaChart data={weightHistory} margin={{ top: 6, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9973A" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#C9973A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis domain={[67.5, 70.5]} axisLine={false} tickLine={false} />
                  <Tooltip content={<CTip suf=" kg" />} />
                  <Area type="monotone" dataKey="w" stroke="#C9973A" strokeWidth={2.5} fill="url(#wg)" dot={{ fill: "#C9973A", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#C9973A" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <Ring pct={(dH / 6) * 100} size={90} stroke={8}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--forest)", fontWeight: 500 }}>{dH}</span>
                <span style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>/ 6</span>
              </Ring>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "var(--forest)", marginBottom: 4 }}>Today's Habits</div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 8 }}>{pts} / {totPts} points</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: dH === 6 ? "var(--green)" : "var(--gold)" }}>
                  {dH === 6 ? "🌟 Perfect day!" : `${6 - dH} left to complete`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "habits" && (
        <div className="g64 a2">
          <div>
            <div className="card mb16">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div className="c-lbl" style={{ margin: 0 }}>Today — {dH} of 6 Done</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--gold)" }}>{pts} pts</div>
              </div>
              <div className="hpb"><div className="hpf" style={{ width: `${(dH / 6) * 100}%` }} /></div>
              {habits.map(h => (
                <div key={h.id} className={`hitem ${h.done ? "don" : ""}`} onClick={() => toggle(h.id)}>
                  <div className="hico">{h.icon}</div>
                  <div className="hnm">{h.label}</div>
                  <div className="hpt">+{h.points} pts</div>
                  <div className="hchk">{h.done ? "✓" : ""}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="c-lbl">This Week</div>
              <div className="wgrid mb16">
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div className="wgd" key={i}>
                    <div className="wgl">{d}</div>
                    <div className={`wgc ${i < 4 ? "full" : i === 4 ? "part now" : ""}`}>
                      {i < 4 ? "✓" : i === 4 ? "…" : ""}
                    </div>
                  </div>
                ))}
              </div>
              <div className="c-lbl">Last 28 Days</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {Array.from({ length: 28 }).map((_, i) => {
                  const v = i < 4 ? 0.9 : i < 8 ? 0.7 : Math.random();
                  return <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: v > 0.35 ? `rgba(26,51,40,${0.15 + v * 0.75})` : "var(--cream3)" }} />;
                })}
              </div>
            </div>
            <div className="card">
              <div className="c-lbl">Weekly Calories</div>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={calorieData} margin={{ top: 6, right: 4, left: -26, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3a8c6e" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#3a8c6e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[1400, 2200]} />
                  <Tooltip content={<CTip suf=" kcal" />} />
                  <Area type="monotone" dataKey="cal" stroke="#3a8c6e" strokeWidth={2} fill="url(#cg)" dot={{ fill: "#3a8c6e", r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "nutrition" && (
        <div className="a2">
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 18 }}>Select your active meal plan or request a custom one from your coach.</div>
          <div className="g3 mb24">
            {mealPlans.map((m, i) => (
              <div key={i} className={`meal-c ${meal === i ? "sel" : ""}`} onClick={() => setMeal(i)}>
                <div className="meal-bdg">{m.tag}</div>
                <div className="meal-ttl">{m.name}</div>
                <div className="meal-cal">{m.cal} calories · daily</div>
                <div className="mbar">
                  <div className="mseg" style={{ flex: m.p, background: "#3a8c6e" }} />
                  <div className="mseg" style={{ flex: m.c, background: "#5b9bd5" }} />
                  <div className="mseg" style={{ flex: m.f, background: "#C9973A" }} />
                </div>
                <div className="mrow">
                  {[["Protein", m.p, "#3a8c6e"], ["Carbs", m.c, "#5b9bd5"], ["Fat", m.f, "#C9973A"]].map(([l, v, c], j) => (
                    <div className="mitm" key={j}>
                      <div className="mv" style={{ color: c }}>{v}g</div>
                      <div className="ml">{l}</div>
                    </div>
                  ))}
                </div>
                {meal === i && <div style={{ marginTop: 12, fontSize: 11, color: "var(--gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>✓ Active Plan</div>}
              </div>
            ))}
          </div>
          <div className="card">
            <div className="c-lbl">Sample Day — {mealPlans[meal].name}</div>
            {[
              { time: "7:00 AM", name: "Breakfast", detail: "Greek yogurt 200g · Blueberries · Oats 50g · Honey drizzle", kcal: 380 },
              { time: "12:30 PM", name: "Lunch", detail: "Chicken breast 200g · Basmati rice 120g · Steamed broccoli · Olive oil", kcal: 560 },
              { time: "4:00 PM", name: "Snack", detail: "Protein shake · Apple · Almonds 20g", kcal: 290 },
              { time: "7:30 PM", name: "Dinner", detail: "Salmon fillet 180g · Sweet potato 150g · Mixed greens · Lemon dressing", kcal: 490 },
            ].map((m, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 20, padding: "15px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 72, fontSize: 12, color: "var(--gold)", fontWeight: 600, flexShrink: 0, paddingTop: 2 }}>{m.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--forest)", marginBottom: 4 }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.55 }}>{m.detail}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text2)", flexShrink: 0 }}>{m.kcal}<span style={{ fontSize: 10, color: "var(--text3)", marginLeft: 2 }}>kcal</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "progress" && (
        <div className="g2 a2">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="c-lbl">Weight Trend</div>
              <ResponsiveContainer width="100%" height={195}>
                <AreaChart data={weightHistory} margin={{ top: 6, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3328" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#1A3328" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis domain={[67.5, 70.5]} axisLine={false} tickLine={false} />
                  <Tooltip content={<CTip suf=" kg" />} />
                  <Area type="monotone" dataKey="w" stroke="#1A3328" strokeWidth={2.5} fill="url(#wg2)" dot={{ fill: "#1A3328", r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="c-lbl">Measurements</div>
              {[["Waist","72 cm","↓ 3cm","dn"],["Hips","94 cm","↓ 1cm","dn"],["Chest","88 cm","stable","nu"],["Thigh","55 cm","↓ 2cm","dn"]].map(([l,v,d,dir],i) => (
                <div className="mr" key={i}>
                  <span style={{ fontSize: 14, color: "var(--text2)" }}>{l}</span>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--forest)" }}>{v}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: dir === "dn" ? "var(--green)" : "var(--text3)" }}>{d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="c-lbl">Progress Photos</div>
              <div className="g2" style={{ marginBottom: 14 }}>
                {["Week 1 · Start","Week 4 · Latest"].map((w, i) => (
                  <div key={i} style={{ background: "var(--cream2)", borderRadius: 14, border: "1.5px solid var(--border)", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{w}</div>
                  </div>
                ))}
              </div>
              <label htmlFor="pup" className="pzone">
                <div style={{ fontSize: 26, marginBottom: 8 }}>+</div>
                <div style={{ fontSize: 13, color: "var(--text3)" }}>Upload today's photo</div>
                <div style={{ fontSize: 11, color: "var(--text3)", opacity: 0.7, marginTop: 3 }}>Private · Coach only</div>
              </label>
              <input type="file" id="pup" accept="image/*" />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[["2.2 kg","Total Lost"],["8 wks","Active"],["87%","Compliance"]].map(([v,l],i) => (
                <div key={i} className="stat-tile" style={{ flex: 1 }}>
                  <div className="st-v" style={{ fontSize: 24 }}>{v}</div>
                  <div className="st-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COACH VIEW
───────────────────────────────────────────── */
function CoachView() {
  const [tab, setTab] = useState("clients");
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState("");
  const [msel, setMsel] = useState(null);
  const sc = clients.find(c => c.id === sel);
  const TABS = { clients: "👥 Clients", "meal plans": "🥗 Meal Plans", feedback: "💬 Feedback", analytics: "📊 Analytics" };

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="greeting">Coach <em>Dashboard</em></div>
          <div className="subline">3 active clients · Week of March 13, 2026</div>
        </div>
        <div className="top-r">
          <Clock />
          <button className="btn btn-f">+ Add Client</button>
        </div>
      </div>

      <div className="stat-grid mb24">
        {[
          { ico: "👥", v: "3", sup: "", l: "Active Clients", d: "All checked in", dir: "up" },
          { ico: "📋", v: "54", sup: "", l: "Total Check-ins", d: "+11 this week", dir: "up" },
          { ico: "🔥", v: "21", sup: "d", l: "Longest Streak", d: "Priya Nair", dir: "up" },
          { ico: "📈", v: "87", sup: "%", l: "Avg Compliance", d: "Excellent team", dir: "up" },
        ].map((s, i) => (
          <div className="stat-tile a0" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="st-ico">{s.ico}</div>
            <div className="st-v">{s.v}<sup>{s.sup}</sup></div>
            <div className="st-l">{s.l}</div>
            <div className={`st-d ${s.dir}`}>{s.d}</div>
          </div>
        ))}
      </div>

      <div className="nav-tabs a1">
        {Object.entries(TABS).map(([k, v]) => (
          <button key={k} className={`nt ${tab === k ? "act" : ""}`} onClick={() => setTab(k)}>{v}</button>
        ))}
      </div>

      {tab === "clients" && (
        <div className="g46 a2">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {clients.map(c => (
              <div key={c.id} className={`cc ${sel === c.id ? "sel" : ""}`} onClick={() => setSel(sel === c.id ? null : c.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div className="cav" style={{ background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}99 100%)` }}>{c.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div className="cn">{c.name}</div>
                    <div className="cm">{c.goal} · {c.weight} kg</div>
                  </div>
                  <div className="cst">🔥 {c.streak}d</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>
                  <span>{c.checkins} check-ins</span><span>{c.progress}% complete</span>
                </div>
                <div className="cpb"><div className="cpf" style={{ width: `${c.progress}%`, background: c.color }} /></div>
              </div>
            ))}
          </div>
          <div>
            {sc ? (
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div className="cav" style={{ width: 56, height: 56, fontSize: 17, background: `linear-gradient(135deg, ${sc.color} 0%, ${sc.color}99 100%)` }}>{sc.initials}</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--forest)" }}>{sc.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text3)" }}>{sc.goal} · {sc.streak}d streak · {sc.weight}kg</div>
                  </div>
                </div>
                <div className="c-lbl">Latest Check-In</div>
                <div style={{ background: "var(--cream2)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    {[["Mood","🔥 Fire"],["Energy","8/10"],["Sleep","7.5h"],["Workout","Done ✅"]].map(([l,v]) => (
                      <div key={l} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{l}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--forest)" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text2)", fontStyle: "italic", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                    "Felt really strong today — hit a new PR on deadlifts."
                  </div>
                </div>
                <div className="c-lbl">Send Feedback</div>
                <textarea rows={4} placeholder={`Write personalised feedback for ${sc.name}...`} value={fb} onChange={e => setFb(e.target.value)} style={{ marginBottom: 12 }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-g" style={{ flex: 1 }} onClick={() => setFb("")}>Send Feedback</button>
                  <button className="btn btn-o">Schedule Call</button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ height: "100%", minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 36 }}>👈</div>
                <div style={{ fontSize: 14, color: "var(--text3)" }}>Select a client to view their profile</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "meal plans" && (
        <div className="a2">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>Manage and assign meal plans to clients</div>
            <button className="btn btn-f btn-sm">+ Create New Plan</button>
          </div>
          <div className="g3">
            {mealPlans.map((m, i) => (
              <div key={i} className={`meal-c ${msel === i ? "sel" : ""}`} onClick={() => setMsel(i === msel ? null : i)}>
                <div className="meal-bdg">{m.tag}</div>
                <div className="meal-ttl">{m.name}</div>
                <div className="meal-cal">{m.cal} kcal/day</div>
                <div className="mbar">
                  <div className="mseg" style={{ flex: m.p, background: "#3a8c6e" }} />
                  <div className="mseg" style={{ flex: m.c, background: "#5b9bd5" }} />
                  <div className="mseg" style={{ flex: m.f, background: "#C9973A" }} />
                </div>
                <div className="mrow" style={{ marginBottom: 16 }}>
                  {[["Protein",m.p,"#3a8c6e"],["Carbs",m.c,"#5b9bd5"],["Fat",m.f,"#C9973A"]].map(([l,v,c],j) => (
                    <div className="mitm" key={j}>
                      <div className="mv" style={{ color: c }}>{v}g</div>
                      <div className="ml">{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-o btn-sm" style={{ flex: 1 }}>Edit</button>
                  <button className="btn btn-f btn-sm" style={{ flex: 1 }}>Assign →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "feedback" && (
        <div className="g2 a2">
          <div className="card">
            <div className="c-lbl">Send Message</div>
            <div className="fl">
              <div className="flbl">Recipient</div>
              <select><option>All Clients (3)</option>{clients.map(c=><option key={c.id}>{c.name}</option>)}</select>
            </div>
            <div className="fl">
              <div className="flbl">Message</div>
              <textarea rows={5} placeholder="Week 8 check in! Log your Sunday weigh-in before 10am. You're all crushing it 💪" />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="btn btn-g" style={{ flex: 1 }}>Send Now</button>
              <button className="btn btn-o">Schedule</button>
            </div>
          </div>
          <div>
            <div className="c-lbl" style={{ marginBottom: 10 }}>Recent Sent</div>
            {[
              { to: "Aria Solano", msg: "Fantastic week! Consistency with morning workouts is showing in your numbers.", date: "Mar 11" },
              { to: "All Clients", msg: "Week 7 wrap-up — incredible work from everyone. Check your updated meal plans.", date: "Mar 8" },
              { to: "Marcus Holt", msg: "Bump carbs to 350g on leg day — you need that fuel for the heavy squats.", date: "Mar 6" },
              { to: "Priya Nair", msg: "Endurance numbers are exceptional. You're ready to push the long run to 18km.", date: "Mar 4" },
            ].map((f, i) => (
              <div className="fbc" key={i}>
                <div className="fbf">To: {f.to}</div>
                <div className="fbt">{f.msg}</div>
                <div className="fbd">{f.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div className="a2">
          <div className="card mb16">
            <div className="c-lbl">Client Weight Trends — March</div>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart margin={{ top: 6, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="day" data={weightHistory} axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                {[
                  { d: weightHistory, c: "#C9973A", n: "Aria" },
                  { d: weightHistory.map(x=>({...x,w:x.w+16})), c: "#3a8c6e", n: "Marcus" },
                  { d: weightHistory.map(x=>({...x,w:x.w-9.2})), c: "#a06b4a", n: "Priya" },
                ].map((l, i) => (
                  <Line key={i} data={l.d} type="monotone" dataKey="w" stroke={l.c} strokeWidth={2.5} dot={false} name={l.n} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="g3">
            {clients.map(c => (
              <div key={c.id} className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div className="cav" style={{ width: 40, height: 40, fontSize: 13, background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}88 100%)` }}>{c.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--forest)" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{c.goal}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Ring pct={c.progress} size={72} stroke={7} color={c.color}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "var(--forest)" }}>{c.progress}%</span>
                  </Ring>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: "var(--forest)" }}>{c.checkins}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 5 }}>check-ins</div>
                    <div className="cst">🔥 {c.streak}d</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOGIN SCREEN
───────────────────────────────────────────── */

// Demo credentials
const ACCOUNTS = [
  { email: "aria@vitara.app",   password: "client123", role: "client", name: "Aria Solano",   initials: "AS" },
  { email: "marcus@vitara.app", password: "client123", role: "client", name: "Marcus Holt",   initials: "MH" },
  { email: "coach@vitara.app",  password: "coach123",  role: "coach",  name: "Marcus Reid",   initials: "MR" },
];

const LOGIN_CSS = `
/* LOGIN PAGE */
.login-shell {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1; padding: 24px;
}
.login-box {
  width: 100%; max-width: 420px;
  background: var(--glass); backdrop-filter: blur(20px);
  border: 1px solid var(--border2); border-radius: 28px;
  padding: 44px 40px 40px; box-shadow: 0 24px 80px rgba(26,35,40,0.16);
  animation: loginPop 0.5s cubic-bezier(0.34,1.4,0.64,1) both;
  position: relative; overflow: hidden;
}
.login-box::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
}
@keyframes loginPop {
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
.login-logo {
  width: 52px; height: 52px; border-radius: 16px;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 26px; color: var(--forest);
  font-weight: 700; margin: 0 auto 22px;
  box-shadow: 0 6px 24px rgba(201,151,58,0.4);
}
.login-title {
  font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 500;
  color: var(--forest); text-align: center; line-height: 1.2; margin-bottom: 6px;
}
.login-sub {
  font-size: 13px; color: var(--text3); text-align: center; margin-bottom: 32px;
  letter-spacing: 0.03em;
}
.login-field { margin-bottom: 14px; }
.login-lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text3); font-weight: 600; margin-bottom: 6px; }
.login-input {
  width: 100%; background: var(--cream); border: 1.5px solid var(--border2);
  border-radius: 13px; font-family: 'Outfit', sans-serif; font-size: 14px;
  color: var(--text); padding: 12px 16px; outline: none; transition: all 0.2s;
}
.login-input:focus { border-color: var(--gold); background: #fff; box-shadow: 0 0 0 4px rgba(201,151,58,0.1); }
.login-input.err { border-color: #C0544A; background: rgba(192,84,74,0.04); }
.login-err { font-size: 12px; color: #C0544A; margin-top: 4px; font-weight: 500; }
.login-btn {
  width: 100%; margin-top: 8px; padding: 13px; border: none; border-radius: 13px;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
  color: var(--forest); font-family: 'Outfit', sans-serif; font-weight: 700;
  font-size: 15px; cursor: pointer; transition: all 0.22s;
  box-shadow: 0 4px 18px rgba(201,151,58,0.3); letter-spacing: 0.02em;
}
.login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,151,58,0.4); }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.login-hint {
  margin-top: 24px; padding: 14px 16px; background: var(--cream2);
  border: 1px solid var(--border); border-radius: 12px; font-size: 12px; color: var(--text3); line-height: 1.7;
}
.login-hint strong { color: var(--text2); font-weight: 600; }
.login-hint .hint-row { display: flex; justify-content: space-between; gap: 8px; padding: 3px 0; border-bottom: 1px solid var(--border); }
.login-hint .hint-row:last-child { border-bottom: none; }
.login-loading { display: flex; gap: 5px; align-items: center; justify-content: center; }
.login-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--forest); animation: ablink 1.2s infinite; }
.login-dot:nth-child(2){animation-delay:.2s} .login-dot:nth-child(3){animation-delay:.4s}

/* SIDEBAR — no mode toggle */
.sb-user-badge {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 10px 12px; border-radius: 14px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
}
.sb-user-name { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; }
.sb-user-role { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.08em; }
.sb-logout {
  width: 100%; padding: 10px 12px; border-radius: 12px;
  background: rgba(192,84,74,0.12); border: 1px solid rgba(192,84,74,0.22);
  color: rgba(255,120,100,0.85); font-family: 'Outfit', sans-serif; font-size: 12px;
  font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;
}
.sb-logout:hover { background: rgba(192,84,74,0.22); color: #ff8070; }
`;

function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate auth delay
    const match = ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (match) {
      onLogin(match);
    } else {
      setError("Incorrect email or password. Try the demo credentials below.");
    }
    setLoading(false);
  };

  return (
    <div className="login-shell">
      <div className="login-box">
        <div className="login-logo">V</div>
        <div className="login-title">Welcome back</div>
        <div className="login-sub">Sign in to your Vitara account</div>

        <div className="login-field">
          <div className="login-lbl">Email</div>
          <input
            className={`login-input ${error ? "err" : ""}`}
            type="text" placeholder="you@vitara.app"
            value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div className="login-field">
          <div className="login-lbl">Password</div>
          <input
            className={`login-input ${error ? "err" : ""}`}
            type="password" placeholder="••••••••"
            value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          {error && <div className="login-err">⚠ {error}</div>}
        </div>

        <button className="login-btn" onClick={handleSubmit} disabled={loading}>
          {loading
            ? <div className="login-loading"><div className="login-dot"/><div className="login-dot"/><div className="login-dot"/></div>
            : "Sign In →"
          }
        </button>

        <div className="login-hint">
          <div style={{ fontWeight: 600, color: "var(--text2)", marginBottom: 8, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Demo Credentials</div>
          {[
            ["Client", "aria@vitara.app", "client123"],
            ["Coach",  "coach@vitara.app", "coach123"],
          ].map(([role, em, pw]) => (
            <div className="hint-row" key={role}
              style={{ cursor: "pointer" }}
              onClick={() => { setEmail(em); setPassword(pw); setError(""); }}>
              <span><strong>{role}</strong> — {em}</span>
              <span style={{ fontFamily: "monospace", fontSize: 11 }}>{pw}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, marginTop: 6, color: "var(--text3)" }}>Click a row to auto-fill.</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
const CLIENT_NAV = [
  { ico: "⊞", lbl: "Dashboard" }, { ico: "✓", lbl: "Check-In" },
  { ico: "🥗", lbl: "Nutrition" }, { ico: "📈", lbl: "Progress" },
];
const COACH_NAV = [
  { ico: "⊞", lbl: "Dashboard" }, { ico: "👥", lbl: "Clients" },
  { ico: "🥗", lbl: "Meal Plans" }, { ico: "📊", lbl: "Analytics" },
];

export default function App() {
  const [user, setUser] = useState(null); // null = logged out
  const [open, setOpen] = useState(false);

  const logout = () => { setUser(null); setOpen(false); };

  const nav = user?.role === "coach" ? COACH_NAV : CLIENT_NAV;

  if (!user) {
    return (
      <>
        <style>{CSS}{LOGIN_CSS}</style>
        <div className="orb-bg">
          <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        </div>
        <LoginScreen onLogin={setUser} />
      </>
    );
  }

  return (
    <>
      <style>{CSS}{LOGIN_CSS}</style>
      <div className="orb-bg">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      </div>
      <div className="shell">
        {/* SIDEBAR — no role toggle visible */}
        <div className={`sidebar ${open ? "open" : ""}`}>
          <div className="sb-logo">V</div>

          <span className="sb-sec">Navigation</span>
          {nav.map((n, i) => (
            <button key={i} className="sb-btn" title={n.lbl}>
              <span>{n.ico}</span><span className="sb-lbl">{n.lbl}</span>
            </button>
          ))}

          <div className="sb-foot">
            <div className="sb-div" />
            {open ? (
              <div className="sb-user-badge">
                <div className="sb-av">{user.initials}</div>
                <div>
                  <div className="sb-user-name">{user.name}</div>
                  <div className="sb-user-role">{user.role}</div>
                </div>
              </div>
            ) : (
              <div className="sb-av" title={user.name}>{user.initials}</div>
            )}
            <button className="sb-tog" onClick={() => setOpen(o => !o)}>
              <span>{open ? "←" : "→"}</span>
              {open && <span style={{ fontSize: 12, fontFamily: "Outfit,sans-serif" }}>Collapse</span>}
            </button>
            {open && (
              <button className="sb-logout" onClick={logout}>
                <span>⎋</span> Sign Out
              </button>
            )}
          </div>
        </div>

        <div className="main">
          {user.role === "client" ? <ClientView /> : <CoachView />}
        </div>
      </div>
    </>
  );
}
