/* LabGaz — the shared place book, 📍 place links and the lesson map (history · geography · social studies · 语文).
   Goal: every place a lesson mentions can be seen on a map, with a real photo — without making pages busier.
     1. 📍 Place links: in lesson text the first mention of a known place (per paragraph / card) gets a dotted underline.
        Tapping it opens a small place card: mini locator map, then/today names, a real photo (◀ ▶ if more), 1–2 sentences, 🔊.
     2. Lesson map: <div class="lab-atlas"></div> (optionally data-places="id1,id2" and data-base="world|us|china")
        → one LabMap with every place the lesson mentions, a Then/Today name switch and the 🎯 Find-it game.
   Place book data: shared/places/<file>.js (list in G.FILES below) — each calls LabGaz.add({ id:{…}, … }). Before adding a place, search ALL files for it and reuse its id:
     { en:'Chang’an', zh:'长安',                       // name as the lessons use it (then-name for historic places)
       names:['长安','Chang’an',"Chang'an"],            // optional extra text forms to link (default: en + zh). Avoid everyday words.
       ll:[108.94, 34.27],                              // [longitude, latitude]
       today:{ en:'Xi’an, Shaanxi', zh:'今陕西西安' },   // modern place (omit when the name is still the same)
       kind:'capital',                                   // capital city site battle river mountain lake sea region pass canal port building cave park
       era:{ en:'Capital of the Western Han and Tang', zh:'西汉、唐朝的都城' },   // optional one-liner
       info:{ en:'…', zh:'…' },                          // 1–2 short sentences for a 12-year-old
       photos:[ { src, en, zh, credit, license, page } ],   // LabPhotos items (Wikimedia Commons, free licence), 1–3
       base:'china' | 'world' | 'us',                    // which mini map (default: china inside China, us inside the USA, else world)
       subjects:['china','worldhistory'] }               // optional: only link the text in these subjects (for ambiguous names)
   Loaded automatically by lab.js on pages whose <body data-subject> is in SUBJECTS below, or that contain .lab-atlas.
   Opt out of linking inside an element with class "no-places". */
(function(){
  if (window.LabGaz) return;
  const G = window.LabGaz = { P:{}, ready:null };
  const SUBJECTS = ['china', 'worldhistory', 'ushistory', 'georgia', 'geography', 'politics', 'economics', 'yuwen'];
  const L = o => window.Lab ? Lab.L(o) : (o && o.en) || '';
  const T = (en, zh) => ({ en, zh });
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const strip = s => String(s ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const UI = { today:T('Today: ', '今天：'), map:T('🗺️ Lesson map', '🗺️ 本课地图'), then:T('Names then', '当时的名字'), now:T('Names today', '今天的名字'),
    tip:T('Tip: tap a dotted place name anywhere in the lesson to see its map and photo.', '小提示：点课文里带虚线的地名，就能看到地图和照片。'),
    close:T('Close', '关闭'), more:T('More photos', '更多照片'), none:T('No places from this lesson are in the place book yet.', '本课的地点还没有收进地名库。') };
  const ICON = { capital:'⭐', battle:'⚔️', mountain:'⛰️', river:'🌊', lake:'💧', sea:'🌊', pass:'🚩', canal:'🚢', port:'⚓', building:'🏛️', site:'🏛️', cave:'🪨', park:'🌳' };
  const here = (() => { try { return new URL('.', (document.currentScript && document.currentScript.src) || location.href).href; } catch(e){ return '../shared/'; } })();
  G.STOP = ['\u7F57\u9A6C\u5C3C\u4E9A', '\u5317\u6D77\u9053', '\u5927\u90FD\u5E02', '\u8FD9\u91CC\u6D77\u62D4', '\u5F17\u96F7\u5FB7\u91CC\u514B', '\u8499\u5FB7\u91CC\u5B89', '\u5165\u6D77\u53E3', '\u51FA\u6D77\u53E3', '\u4E1C\u6D77\u5CB8', '\u897F\u6D77\u5CB8', 'Romania', 'Romanian'];   // + 入海口 出海口 东海岸 西海岸   // 罗马尼亚 北海道 大都市 这里海拔 弗雷德里克 蒙德里安
  // the sentence read aloud for a place (place card and lesson-map card use the same one, so it is recorded once per language)
  G.sayOf = (p, lang) => { const LL = o => o == null ? '' : typeof o === 'string' ? o : (o[lang] ?? o.en ?? ''); return [LL({ en:p.en, zh:p.zh }), p.today ? (lang === 'zh' ? '今天：' : 'Today: ') + LL(p.today).replace(/^今/, '') : '', strip(LL(p.info || ''))].filter(Boolean).join(lang === 'zh' ? '。' : '. '); };
  G.add = obj => { for (const id in obj){ if (G.P[id]) continue; const p = obj[id]; p.id = id; G.P[id] = p; } index = null; };   // first file loaded wins for a duplicate id
  const load = src => new Promise(ok => { const s = document.createElement('script'); s.src = src; s.onload = s.onerror = () => ok(); document.head.appendChild(s); });
  const loadMap = () => window.LabMap ? Promise.resolve() : load(here + 'labmap.js');
  // one file per group of lessons (so several people can add places at once); same id in two files -> the earlier file wins
  G.FILES = ['china', 'china2', 'yuwen', 'world', 'us', 'civics'];
  G.ready = Promise.all(G.FILES.map(n => load(here + 'places/' + n + '.js')));

  const subject = () => (document.body && document.body.dataset.subject) || (window.Lab && Lab.subject && Lab.subject.id) || '';
  const inChina = ([x, y]) => x > 73 && x < 135.5 && y > 17 && y < 53.6;
  const inUS = ([x, y]) => (x > -125 && x < -66.5 && y > 24 && y < 49.5) || (x > -170 && x < -129 && y > 51 && y < 72) || (x > -161 && x < -154 && y > 18.5 && y < 22.5);
  const baseOf = p => p.base || (inChina(p.ll) ? 'china' : inUS(p.ll) ? 'us' : 'world');

  /* ---------- text linking ---------- */
  let index = null;   // { re, byName }
  function buildIndex(){
    const sub = subject(), byName = new Map();
    for (const id in G.P){ const p = G.P[id]; if (!p.ll) continue; if (p.subjects && !p.subjects.includes(sub)) continue;
      const names = p.names || [p.zh, p.en]; names.forEach(n => { if (n && n.length >= 2 && !byName.has(n)) byName.set(n, p); }); }
    G.STOP.forEach(w => { if (!byName.has(w)) byName.set(w, null); });   // longer words that contain a place name but are not that place: matched first, never linked
    const keys = [...byName.keys()].sort((a, b) => b.length - a.length);
    if (!keys.length) return (index = { re:null, byName });
    const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = keys.map(k => /^[\x00-\x7F’'.\- ]+$/.test(k) ? '(?<![A-Za-z])' + reEsc(k) + '(?![A-Za-z])' : reEsc(k));
    index = { re:new RegExp(parts.join('|'), 'g'), byName };
    return index;
  }
  const SKIP = '.lp-jin,.lp-head,h2,.lead,script,style,textarea,input,select,option,button,a,canvas,svg,rt,h1,.no-places,.pl-link,.pl-card,.lm,.lab-nav,#lab-nav,.lab-footer,footer,.lab-vpanel,.lp-gallery,.lp-view,.lp-cap,.lab-lang,.quiz,.opts,.pool,.bins,code,pre,[contenteditable]';
  const linkedIn = (blk, id) => !!(blk && blk.querySelector('.pl-link[data-place="' + id + '"]'));   // first mention per paragraph / card only
  const blockOf = n => n.parentElement && n.parentElement.closest('p,li,td,th,dd,dt,blockquote,figcaption,h2,h3,h4,summary,.card,section,div');
  function linkNode(tn){
    const ix = index || buildIndex(); if (!ix.re) return;
    const txt = tn.nodeValue; if (!txt || txt.length < 2) return;
    ix.re.lastIndex = 0; let m, last = 0, frag = null;
    const blk = blockOf(tn), set = new Set();
    while ((m = ix.re.exec(txt))){
      const p = ix.byName.get(m[0]); if (!p || set.has(p.id) || linkedIn(blk, p.id)) continue;
      set.add(p.id);
      frag = frag || document.createDocumentFragment();
      frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
      const s = document.createElement('span'); s.className = 'pl-link'; s.dataset.place = p.id; s.tabIndex = 0; s.setAttribute('role', 'button'); s.textContent = m[0];
      frag.appendChild(s); last = m.index + m[0].length;
    }
    if (!frag) return;
    frag.appendChild(document.createTextNode(txt.slice(last)));
    tn.parentNode.replaceChild(frag, tn);
  }
  function linkRuby(rb){   // pinyin.js turns names into <ruby>长安<rt>…</rt></ruby>: link the whole ruby when its base text is a place
    const ix = index || buildIndex(); if (!ix.re || rb.closest('.pl-link') || rb.closest(SKIP)) return;
    const base = [...rb.childNodes].filter(n => n.nodeType === 3 || (n.nodeType === 1 && n.tagName !== 'RT' && n.tagName !== 'RP')).map(n => n.textContent).join('').trim();
    const p = ix.byName.get(base); if (!p) return;
    if (linkedIn(blockOf(rb), p.id)) return;
    const s = document.createElement('span'); s.className = 'pl-link'; s.dataset.place = p.id; s.tabIndex = 0; s.setAttribute('role', 'button');
    rb.parentNode.insertBefore(s, rb); s.appendChild(rb);
  }
  function scan(root){
    if (!root || !root.querySelectorAll) return;
    const main = root === document ? document.body : root; if (!main) return;
    if (main.closest && main.closest(SKIP)) return;
    const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, { acceptNode: n => (!n.parentElement || n.parentElement.closest(SKIP) || n.parentElement.closest('ruby')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach(linkNode);
    main.querySelectorAll('ruby').forEach(linkRuby);
  }
  let pend = null, busy = false;
  function watch(){
    const mo = new MutationObserver(ms => { if (busy) return; if (!ms.some(m => [...m.addedNodes].some(n => n.nodeType === 1 ? !n.classList.contains('pl-link') : n.nodeType === 3))) return;
      clearTimeout(pend); pend = setTimeout(() => { busy = true; try { scan(document); } finally { setTimeout(() => { busy = false; }, 0); } }, 250); });
    mo.observe(document.body, { childList:true, subtree:true, characterData:true });
  }

  /* ---------- place card ---------- */
  let card = null, cardFor = null;
  function closeCard(){ if (card){ card.remove(); card = null; cardFor = null; } }
  G.open = (id, anchor) => {
    const p = G.P[id]; if (!p) return;
    if (cardFor === id && card){ closeCard(); return; }
    closeCard(); cardFor = id;
    card = document.createElement('div'); card.className = 'pl-card card'; card.setAttribute('role', 'dialog');
    const photos = (p.photos || []).filter(Boolean); let pi = 0;
    const render = () => {
      const ph = photos[pi], today = p.today ? `<div class="pl-today">${esc(L(UI.today))}${esc(L(p.today).replace(/^今/, ''))}</div>` : '';
      card.innerHTML = `<button type="button" class="pl-x" aria-label="${esc(L(UI.close))}">×</button>
        <h4>${ICON[p.kind] ? ICON[p.kind] + ' ' : '📍 '}${esc(L(p))}</h4>${today}${p.era ? `<div class="pl-era">${esc(L(p.era))}</div>` : ''}
        <div class="pl-mini"></div>
        ${ph ? `<figure class="pl-ph"><img src="${esc(ph.src)}" alt="${esc(L(ph))}" loading="lazy"><figcaption>${esc(L(ph))} <span class="pl-cr">· ${esc(ph.credit || '')}${ph.license ? ', ' + esc(ph.license) : ''}${ph.page ? ` · <a href="${esc(ph.page)}" target="_blank" rel="noopener">${window.Lab && Lab.lang === 'zh' ? '来源' : 'source'}</a>` : ''}</span></figcaption>${photos.length > 1 ? `<div class="pl-nav"><button type="button" data-d="-1" aria-label="${esc(L(UI.more))}">◀</button><span>${pi + 1}/${photos.length}</span><button type="button" data-d="1" aria-label="${esc(L(UI.more))}">▶</button></div>` : ''}</figure>` : ''}
        ${p.info ? `<p>${L(p.info)}</p>` : ''}
        ${window.Lab && Lab.speak ? `<button type="button" class="speak pl-say">${esc(L(Lab.UI.listen))}</button>` : ''}`;
      card.querySelector('.pl-x').onclick = closeCard;
      card.querySelectorAll('.pl-nav button').forEach(b => b.onclick = e => { e.stopPropagation(); pi = (pi + +b.dataset.d + photos.length) % photos.length; render(); });
      const img = card.querySelector('.pl-ph img'); if (img && window.LabPhotos) img.onclick = () => LabPhotos.open(photos, pi);
      const sb = card.querySelector('.pl-say'); if (sb) sb.onclick = () => Lab.speak(G.sayOf(p, Lab.lang));
      loadMap().then(() => { const box = card && card.querySelector('.pl-mini'); if (!box || !window.LabMap) return; const b = baseOf(p), span = p.zoom || (b === 'world' ? 22 : b === 'china' ? 9 : 7);
        LabMap.create(box, { mini:true, height:150, base:b, extent:b === 'us' && !p.zoom ? null : [[p.ll[0] - span * 1.4, p.ll[1] - span * .75], [p.ll[0] + span * 1.4, p.ll[1] + span * .75]],
          pins:[{ id:p.id, ll:p.ll, en:p.en, zh:p.zh, icon:ICON[p.kind] }], regionLabels:false, note:false }); });
    };
    render();
    document.body.appendChild(card);
    // position: under the link on wide screens, bottom sheet on phones
    if (innerWidth >= 700 && anchor){ const r = anchor.getBoundingClientRect(), w = 360; let x = Math.min(innerWidth - w - 12, Math.max(12, r.left + r.width / 2 - w / 2)), y = r.bottom + 8;
      card.style.left = x + 'px'; card.style.top = (y + scrollY) + 'px'; card.style.position = 'absolute';
      requestAnimationFrame(() => { if (!card) return; const h = card.getBoundingClientRect().height; if (r.bottom + 8 + h > innerHeight && r.top - h - 8 > 0) card.style.top = (r.top - h - 8 + scrollY) + 'px'; }); }
    else card.classList.add('pl-sheet');
  };
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('.pl-link');
    if (a){ e.preventDefault(); G.open(a.dataset.place, a); return; }
    if (card && !e.target.closest('.pl-card') && !e.target.closest('.lp-view')) closeCard();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); const a = e.target.closest && e.target.closest('.pl-link'); if (a && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); G.open(a.dataset.place, a); } });

  /* ---------- lesson map ---------- */
  function found(){ const ids = []; document.querySelectorAll('.pl-link').forEach(a => { if (!ids.includes(a.dataset.place)) ids.push(a.dataset.place); }); return ids; }
  function atlas(el){
    if (el.dataset.built) return; el.dataset.built = '1';
    const want = (el.dataset.places || '').split(/[,\s]+/).filter(Boolean);
    const ids = (want.length ? want : found()).filter(id => G.P[id] && G.P[id].ll);
    if (!ids.length){ el.innerHTML = `<p class="muted">${esc(L(UI.none))}</p>`; return; }
    const ps = ids.map(id => G.P[id]);
    const base = el.dataset.base || (ps.every(p => inChina(p.ll)) ? 'china' : ps.every(p => inUS(p.ll)) ? 'us' : 'world');
    let names = 'then';
    el.innerHTML = `<div class="pl-atlas-top"><span class="lab-mode pl-names"><button type="button" data-n="then" class="on"></button><button type="button" data-n="now"></button></span><small class="muted pl-tip"></small></div><div class="pl-atlas-map"></div>`;
    const hasToday = ps.some(p => p.today);
    if (!hasToday) el.querySelector('.pl-names').hidden = true;
    const lab = p => names === 'now' && p.today ? { en:L({ en:p.today.en, zh:p.today.en }), zh:(p.today.zh || '').replace(/^今/, '') } : { en:p.en, zh:p.zh };
    const pins = () => ps.map(p => ({ id:p.id, ll:p.ll, ...lab(p), icon:ICON[p.kind], photo:(p.photos || [])[0], say:{ en:G.sayOf(p, 'en'), zh:G.sayOf(p, 'zh') },
      info:{ en:[p.era && p.era.en, p.today && names === 'then' ? 'Today: ' + p.today.en : '', p.info && p.info.en].filter(Boolean).join('<br>'), zh:[p.era && p.era.zh, p.today && names === 'then' ? '今天：' + (p.today.zh || '').replace(/^今/, '') : '', p.info && p.info.zh].filter(Boolean).join('<br>') } }));
    let ext = null;   // fit the map to the lesson's places, keeping enough surroundings for context
    { const xs = ps.map(p => p.ll[0]), ys = ps.map(p => p.ll[1]); let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const local = (x1 - x0) < 4 && (y1 - y0) < 3;   // e.g. every place inside one city (Beijing): zoom to city level
      const minW = local ? 2.2 : base === 'china' ? 22 : base === 'us' ? 7 : 40, minH = local ? 1.4 : base === 'china' ? 13 : base === 'us' ? 5 : 24, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const w = Math.max(minW, (x1 - x0) * 1.35), h = Math.max(minH, (y1 - y0) * 1.4);
      ext = [[Math.max(-180, cx - w / 2), Math.max(-60, cy - h / 2)], [Math.min(180, cx + w / 2), Math.min(80, cy + h / 2)]]; }
    loadMap().then(() => {
      const m = LabMap.create(el.querySelector('.pl-atlas-map'), { base, extent:ext, height:+el.dataset.height || 460, pins:pins(), regionLabels:false,
        quiz:ps.length >= 3 ? { items:ps.map(p => ({ target:p.id })), count:Math.min(8, ps.length) } : null });
      const relabel = () => { el.querySelectorAll('.pl-names button').forEach(b => { b.textContent = L(b.dataset.n === 'then' ? UI.then : UI.now); b.classList.toggle('on', b.dataset.n === names); }); el.querySelector('.pl-tip').textContent = L(UI.tip); };
      el.querySelectorAll('.pl-names button').forEach(b => b.onclick = () => { names = b.dataset.n; relabel(); m.set({ pins:pins() }); });
      relabel(); if (window.Lab) Lab.onLang(() => { relabel(); m.set({ pins:pins() }); });
    });
  }

  /* ---------- styles ---------- */
  const st = document.createElement('style'); st.textContent = `
.pl-link{border-bottom:1.5px dotted var(--brand);cursor:pointer;border-radius:2px}
.pl-link:hover,.pl-link:focus{background:color-mix(in srgb, var(--brand) 12%, transparent);outline:none}
.pl-card{position:fixed;z-index:9000;width:360px;max-width:calc(100vw - 24px);padding:14px 16px;border-radius:16px;background:var(--surface);border:1px solid var(--line);box-shadow:0 12px 40px rgba(10,20,40,.22)}
.pl-card.pl-sheet{left:12px;right:12px;bottom:12px;width:auto;max-height:80vh;overflow:auto}
.pl-card h4{margin:0 26px 2px 0;font:700 19px Fredoka,Nunito,sans-serif}
.pl-card .pl-today{font-weight:800;color:var(--brand);font-size:14px}
.pl-card .pl-era{color:var(--ink-2);font-size:13.5px}
.pl-card .pl-x{position:absolute;right:8px;top:6px;width:32px;height:32px;border:0;background:transparent;font-size:24px;color:var(--ink-2);cursor:pointer}
.pl-card .pl-mini{margin:8px 0}
.pl-card .pl-ph{margin:0 0 6px}
.pl-card .pl-ph img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:10px;display:block;cursor:zoom-in;background:#0e1422}
.pl-card figcaption{font-size:13px;line-height:1.35;margin-top:4px}
.pl-card .pl-cr{color:var(--ink-2);font-size:11px}.pl-card .pl-cr a{color:inherit}
.pl-card .pl-nav{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:4px;font-size:13px;color:var(--ink-2)}
.pl-card .pl-nav button{border:1px solid var(--line);background:var(--surface-2);border-radius:999px;width:34px;height:30px;cursor:pointer;color:var(--ink)}
.pl-card p{margin:6px 0 0;line-height:1.5;font-size:15px}
.pl-card .speak{margin-top:8px}
.pl-atlas-top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:8px}`;
  document.head.appendChild(st);

  /* ---------- start ---------- */
  function start(){
    const atl = document.querySelectorAll('.lab-atlas');
    if (!SUBJECTS.includes(subject()) && !atl.length) return;
    G.ready.then(() => { index = null; scan(document); watch(); document.querySelectorAll('.lab-atlas').forEach(atlas); });
  }
  if (window.Lab && Lab.ready) Lab.ready(() => setTimeout(start, 60)); else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  G.scan = scan; G.atlas = atlas;
})();
