/* Genius Classroom — shared runtime (classic script, works from file://).
   Bilingual: write English in the element and Chinese in data-zh (text) or data-zh-html (markup).
   Pages: <body data-subject="biology" data-topic="dna"> with <div id="lab-nav"></div> ... <div id="lab-footer"></div>
   API: Lab.lang, Lab.L({en,zh}), Lab.onLang(fn), Lab.ready(fn), Lab.speak(text), Lab.quiz(el, questions, opts),
        Lab.sort(el, cfg), Lab.shuffle(arr), Lab.$(sel), Lab.applyLang() */
(function(){
  const Lab = window.Lab = {};
  // load the shared full-screen helper (adds ⤢ buttons to every 3D stage / simulation)
  try {
    const base = ((document.currentScript && document.currentScript.src) || '').replace(/lab\.js(\?.*)?$/, '');
    if (base && !window.LabFS){ const s = document.createElement('script'); s.src = base + 'fullscreen.js'; document.head.appendChild(s); }
    // real-photo gallery helper (LabPhotos). Pages that use it should ALSO include <script src="../shared/photos.js"> so it is ready synchronously.
    if (base && !window.LabPhotos && !document.querySelector('script[src*="photos.js"]')){ const s = document.createElement('script'); s.src = base + 'photos.js'; document.head.appendChild(s); }
    // pinyin over hard-to-read words in Chinese mode (LabPinyin), with a 拼 on/off button in the nav
    if (base && !window.LabPinyin){ const s = document.createElement('script'); s.src = base + 'pinyin.js'; document.head.appendChild(s); }
    // modern names after ancient place names in China lessons: 长安（今陕西西安）
    // (placenames.js only acts on <body data-subject="china">)
    if (base && !window.LabPlaces){ const s = document.createElement('script'); s.src = base + 'placenames.js'; document.head.appendChild(s); }
    // 📍 place links + lesson maps (places.js decides itself whether the page needs them: body[data-subject] or .lab-atlas)
    if (base && !window.LabGaz){ const s = document.createElement('script'); s.src = base + 'places.js'; document.head.appendChild(s); }
  } catch(e){}
  const $ = Lab.$ = (s, r=document) => r.querySelector(s);
  const $$ = Lab.$$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const store = { get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };
  const params = new URLSearchParams(location.search);
  Lab.lang = params.get('lang') || store.get('labLang') || ((navigator.language||'').toLowerCase().startsWith('zh') ? 'zh' : 'en');
  if (Lab.lang !== 'zh') Lab.lang = 'en';
  const savedTheme = store.get('labTheme'); if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  Lab.L = o => o == null ? '' : (typeof o === 'string' ? o : (o[Lab.lang] ?? o.en ?? ''));
  Lab.shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.random()*(i+1)|0; [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const langFns = [], readyFns = []; let isReady = false;
  // errors inside onLang / onMode callbacks: log them and also report them to page checkers (window.__labErr)
  const cbErr = e => { console.error(e); try { if (Array.isArray(window.__labErr)) window.__labErr.push('callback: ' + (e && e.message || e)); } catch(_){} };
  Lab.onLang = fn => { langFns.push(fn); if (isReady) fn(Lab.lang); };
  Lab.ready = fn => { if (isReady) fn(); else readyFns.push(fn); };
  const UI = {
    home:{en:'Genius Classroom',zh:'天才课堂'}, all:{en:'All topics',zh:'全部主题'}, prev:{en:'Previous topic',zh:'上一个主题'}, next:{en:'Next topic',zh:'下一个主题'},
    std:{en:'Georgia standard',zh:'佐治亚州课程标准'}, note:{en:'3D models are simplified and not to scale.',zh:'3D 模型经过简化，比例并不真实。'},
    q:{en:'Question {n} of {t}',zh:'第 {n} 题 / 共 {t} 题'}, right:{en:'✅ Correct!',zh:'✅ 答对了！'}, wrong:{en:'❌ Not quite. Answer: ',zh:'❌ 不对，正确答案：'},
    nextQ:{en:'Next question ▶',zh:'下一题 ▶'}, done:{en:'🎉 Finished! You got {s} of {t} right.',zh:'🎉 完成！你答对了 {s} / {t} 题。'}, again:{en:'Play again ↺',zh:'再来一轮 ↺'},
    sortGood:{en:'✅ Correct!',zh:'✅ 正确！'}, sortBad:{en:'❌ Try again!',zh:'❌ 再想想！'}, sortDone:{en:'🎉 All sorted! Mistakes: {m}',zh:'🎉 全部分对了！出错次数：{m}'}, reset:{en:'Play again',zh:'再玩一次'},
    theme:{en:'Toggle dark mode',zh:'切换深色模式'}, listen:{en:'🔊 Read aloud',zh:'🔊 朗读'}, need3d:{en:'⚠️ The 3D scene needs an internet connection to load.',zh:'⚠️ 3D 场景需要联网才能加载。'},
    basic:{en:'🙂 Basic',zh:'🙂 基础'}, adv:{en:'🚀 Advanced',zh:'🚀 进阶'}, advTip:{en:'Advanced: more controls, real numbers and the science behind it',zh:'进阶：更多可调参数、真实数据和背后的原理'}
  };
  Lab.UI = UI;

  /* ---------- Basic / Advanced mode (STEM simulations) ----------
     Put <div class="lab-mode"></div> where the switch should appear (usually at the top of a simulation card).
     Elements with class "adv" are shown only in Advanced mode, "basic-only" only in Basic mode; ".adv-box" = a framed 🚀 panel.
     JS: Lab.adv() -> true/false · Lab.onMode(fn(adv)) runs at start-up and on every change · Lab.setAdv(true|false).
     The choice is remembered across lessons (localStorage labAdv); ?adv=1 or ?adv=0 in the URL overrides it. */
  let advOn = params.get('adv') != null ? params.get('adv') === '1' : store.get('labAdv') === '1';
  const modeFns = [];
  document.documentElement.classList.toggle('lab-adv', advOn);
  Lab.adv = () => advOn;
  Lab.onMode = fn => { modeFns.push(fn); if (isReady) try { fn(advOn); } catch(e){ console.error(e); } };
  function renderModes(root = document){
    $$('.lab-mode', root).forEach(el => {
      if (!el.dataset.built){ el.dataset.built = '1'; el.setAttribute('role', 'group');
        el.innerHTML = '<button type="button" data-m="0"></button><button type="button" data-m="1"></button>';
        el.addEventListener('click', e => { const b = e.target.closest('button[data-m]'); if (b) Lab.setAdv(b.dataset.m === '1'); }); }
      const [b0, b1] = el.querySelectorAll('button[data-m]');
      b0.textContent = Lab.L(UI.basic); b1.textContent = Lab.L(UI.adv); b1.title = Lab.L(UI.advTip); el.title = '';
      b0.classList.toggle('on', !advOn); b1.classList.toggle('on', advOn); b0.setAttribute('aria-pressed', String(!advOn)); b1.setAttribute('aria-pressed', String(advOn));
    });
  }
  Lab.modes = renderModes;   // call after inserting new .lab-mode placeholders
  Lab.setAdv = v => { advOn = !!v; store.set('labAdv', advOn ? '1' : '0'); document.documentElement.classList.toggle('lab-adv', advOn); renderModes(); modeFns.forEach(fn => { try { fn(advOn); } catch(e){ cbErr(e); } }); };
  const fmt = (o, v={}) => { let s = Lab.L(o); for (const k in v) s = s.replace('{'+k+'}', v[k]); return s; };
  Lab.fmt = fmt;

  /* ---------- catalog helpers ---------- */
  const cat = window.LAB_CATALOG || [];
  Lab.subject = null; Lab.topic = null;
  function findTopic(){
    const sid = document.body.dataset.subject, tid = document.body.dataset.topic;
    Lab.subject = cat.find(s => s.id === sid) || null;
    if (Lab.subject) Lab.topic = Lab.subject.topics.find(t => t.id === tid) || null;
    if (Lab.subject) document.documentElement.style.setProperty('--brand', Lab.subject.color);
    if (Lab.subject && Lab.topic){ try { const k = Lab.subject.id + '/' + Lab.topic.id, a = JSON.parse(store.get('labSeen') || '[]'); if (!a.includes(k)){ a.push(k); store.set('labSeen', JSON.stringify(a)); } } catch(e){} }   // hub shows ✓ on visited lessons
  }
  const withLang = href => href + (href.includes('?') ? '&' : '?') + 'lang=' + Lab.lang;

  /* ---------- nav + footer ---------- */
  function buildNav(){
    const host = $('#lab-nav'); if (!host) return;
    const S = Lab.subject, T = Lab.topic, inSub = !!S;
    const navLinks = $$('[data-nav]').map(s => `<a href="#${s.id}" data-zh="${s.dataset.navZh||s.dataset.nav}">${s.dataset.nav}</a>`).join('');
    host.outerHTML = `<nav class="lab-nav"><div class="wrap">
      <a class="home" href="${inSub ? '../index.html' : 'index.html'}" data-lab-link>🎓 <span data-zh="${UI.home.zh}">${UI.home.en}</span></a>
      ${S ? `<div class="crumb">/ <a href="../index.html#${S.id}" data-lab-link>${S.icon} <span data-zh="${S.zh}">${S.en}</span></a>${T ? `<span class="t">/ <span data-zh="${T.zh}">${T.en}</span></span>` : ''}</div>` : ''}
      <div class="links">${navLinks}</div>
      <div class="seg lab-lang ${navLinks ? '' : 'spacer'}"><button data-lang="en">EN</button><button data-lang="zh">中文</button></div>
      <button class="icon-btn lab-voice" title="Read-aloud voice / 朗读声音" aria-label="Read-aloud voice">🔊</button>
      <button class="icon-btn lab-theme" title="${UI.theme.en}" aria-label="${UI.theme.en}">🌓</button>
    </div></nav>`;
    $$('.lab-lang button').forEach(b => b.onclick = () => setLang(b.dataset.lang));
    const vb = $('.lab-voice'); if (vb){ vb.onclick = () => Lab.voicePanel(); if (!window.speechSynthesis && !REC_LANGS.includes(Lab.lang)) vb.hidden = true; }
    $('.lab-theme').onclick = () => {
      const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      r.dataset.theme = dark ? 'light' : 'dark'; store.set('labTheme', r.dataset.theme);
      window.dispatchEvent(new Event('labtheme'));
    };
  }
  function buildFooter(){
    const host = $('#lab-footer'); if (!host) return;
    let pn = '';
    if (Lab.subject && Lab.topic){
      const list = Lab.subject.topics, i = list.indexOf(Lab.topic), p = list[i-1], n = list[i+1];
      const link = (t, cls, lab) => t ? `<a class="card ${cls}" href="${t.id}.html" data-lab-link><small data-zh="${lab.zh}">${lab.en}</small><b data-zh="${t.zh}">${t.en}</b></a>` : `<a class="card ${cls}" href="../index.html#${Lab.subject.id}" data-lab-link><small data-zh="${UI.all.zh}">${UI.all.en}</small><b>${Lab.subject.icon} <span data-zh="${Lab.subject.zh}">${Lab.subject.en}</span></b></a>`;
      pn = `<div class="pn">${link(p,'prev',UI.prev)}${link(n,'next',UI.next)}</div>`;
    }
    const cn = Lab.topic && /[一-鿿]/.test(Lab.topic.std);   // China modules cite the mainland curriculum, not Georgia's
    const std = Lab.topic ? (cn ? `<span data-zh="对应教材：">Textbook unit: </span>` : `<span data-zh="${UI.std.zh}：">${UI.std.en}: </span>`) + `${Lab.topic.std} · ` : '';
    host.outerHTML = `<footer class="lab-footer wrap">${pn}<p>${std}${document.querySelector('script[src*="lab3d"],script[src*="three"]') ? `<span data-zh="${UI.note.zh}">${UI.note.en}</span>` : ''}</p></footer>`;   // 3D note only on pages that load a 3D engine
  }

  /* ---------- language ---------- */
  function applyStatic(root=document){
    $$('[data-zh]', root).forEach(el => { if (el.dataset.en == null) el.dataset.en = el.textContent; el.textContent = Lab.lang === 'zh' ? el.dataset.zh : el.dataset.en; });
    $$('[data-zh-html]', root).forEach(el => { if (el.dataset.enHtml == null) el.dataset.enHtml = el.innerHTML; el.innerHTML = Lab.lang === 'zh' ? el.dataset.zhHtml : el.dataset.enHtml; });
    $$('[data-zh-placeholder]', root).forEach(el => { if (el.dataset.enPh == null) el.dataset.enPh = el.placeholder; el.placeholder = Lab.lang === 'zh' ? el.dataset.zhPlaceholder : el.dataset.enPh; });
    $$('a[data-lab-link]', root).forEach(a => { const h = a.getAttribute('href').replace(/[?&]lang=\w+/, ''); a.setAttribute('href', h.includes('#') ? withLang(h.split('#')[0]) + '#' + h.split('#')[1] : withLang(h)); });
  }
  Lab.applyLang = () => {
    document.documentElement.lang = Lab.lang === 'zh' ? 'zh-CN' : 'en';
    applyStatic();
    $$('.lab-lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === Lab.lang));
    if (Lab.topic) document.title = (Lab.lang === 'zh' ? Lab.topic.zh : Lab.topic.en) + ' · ' + Lab.L(UI.home);
    // search engines: each language version is its own canonical page (same file, ?lang=zh for Chinese); hreflang is in the static <head>
    try { if (/(^|\.)shanchuan\.org$/.test(location.hostname)){ let c = document.querySelector('link[rel=canonical]');
      if (!c){ c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
      c.href = location.origin + location.pathname + (Lab.lang === 'zh' ? '?lang=zh' : ''); } } catch(e){}
    renderModes();
    langFns.forEach(fn => { try { fn(Lab.lang); } catch(e){ cbErr(e); } });
  };
  Lab.translate = applyStatic;  // call on dynamically inserted markup that uses data-zh
  function setLang(l){ Lab.lang = l; store.set('labLang', l); Lab.stopSpeech(); loadRec(l); Lab.applyLang(); }
  Lab.setLang = setLang;

  /* ---------- speech ---------- */
  /* Picks the most natural voice the browser has (Edge "Natural"/neural voices, Google voices, macOS premium voices)
     instead of the robotic system default. The 🔊 button in the nav lets the reader choose a voice and speed (remembered). */
  const allVoices = () => (window.speechSynthesis ? speechSynthesis.getVoices() : []);
  const vScore = (v, lang) => {
    const n = v.name, L2 = (v.lang || '').toLowerCase().replace('_', '-');
    if (!L2.startsWith(lang === 'zh' ? 'zh' : 'en')) return -1e9;
    let s = 0;
    if (lang === 'zh'){ if (/zh-(cn|hans)/.test(L2)) s += 30; if (/hk|tw|yue|mo/.test(L2) || /Cantonese|粤/.test(n)) s -= 60; }
    else { if (L2 === 'en-us') s += 20; else if (/en-(gb|au|ca)/.test(L2)) s += 8; }
    if (/Natural/i.test(n)) s += 100; if (/Neural/i.test(n)) s += 90; if (/Premium|Enhanced/i.test(n)) s += 70;
    if (/Google/i.test(n)) s += 60; if (/Online/i.test(n)) s += 30; if (v.localService === false) s += 5;
    if (/Xiaoxiao|Yunxi|Xiaoyi|Yunjian|Aria|Jenny|Guy|Ava|Andrew|Emma|Brian|Samantha|Tingting|Ting-Ting/i.test(n)) s += 15;
    if (/Huihui|Kangkang|Yaoyao|David|Zira|Mark/i.test(n)) s -= 25;
    return s;
  };
  Lab.voices = lang => allVoices().filter(v => vScore(v, lang) > -1e8).sort((a, b) => vScore(b, lang) - vScore(a, lang));
  Lab.voiceFor = lang => { const saved = store.get('labVoice_' + lang), vs = Lab.voices(lang); return (saved && vs.find(v => v.name === saved)) || vs[0] || null; };
  Lab.speakRate = () => +(store.get('labRate') || 1);
  /* Pre-recorded read-aloud (Qwen3-TTS, voice Serena), made on the TTS PC and served from the audio repos named in
     shared/audio-sources.js (see tools/readaloud/HANDOFF.md). The lesson subject/topic (= this page's path) has
       <repo url><subject>/<topic>/manifest.js  ->  LabAudioManifest({lesson, voice, en:'<key> …', zh:'<key> …'})
       <repo url><subject>/<topic>/<lang>/<key>.mp3
     and sentences no single lesson owns (place-book cards …) are in the lesson "_shared". Manifests are scripts, not
     JSON, so they also load from file://. key = FNV-1a 32-bit hex of  lang + '|' + Lab.speechNorm(text).
     A text without a recording is read by the browser voice, so the site works with no audio at all.
     Recordings play at  (o.rate||.95)/.95 × the reader's speed (🔊 panel), pitch preserved.
     Pages that drive speechSynthesis directly (zh utterances) get the recording too, with 'end' fired on the utterance.
     Transcripts for the TTS PC: run tools/readaloud/readaloud_sync.ps1 whenever lesson texts change. */
  const REC_LANGS = ['zh', 'en'];
  const siteBase = (() => { try { return new URL('../', (document.currentScript && document.currentScript.src) || location.href).href; } catch(e){ return ''; } })();
  Lab.speechNorm = t => String(t == null ? '' : t).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  Lab.speechKey = (text, lang) => {
    const s = lang + '|' + Lab.speechNorm(text); let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  };
  // this page's lesson id: <subject>/<topic> from its path below the site root ('' for hub / index pages)
  Lab.lessonId = (() => { try {
    const p = decodeURI(new URL(location.href).pathname), b = decodeURI(new URL(siteBase).pathname);
    const m = p.startsWith(b) && p.slice(b.length).match(/^([a-z0-9-]+)\/([a-z0-9-]+?)(?:\.html?)?$/i);
    return m && m[2] !== 'index' ? m[1] + '/' + m[2] : '';
  } catch(e){ return ''; } })();
  // rec.buckets: [{id, base, keys:{en:Set, zh:Set}}] - this lesson first, then _shared; state: ''|'loading'|'ready'
  const rec = { state: '', waits: [], buckets: [] };
  window.LabAudioManifest = m => {
    const b = m && rec.buckets.find(x => x.id === m.lesson); if (!b) return;
    REC_LANGS.forEach(l => { b.keys[l] = new Set(String(m[l] || '').split(/\s+/).filter(Boolean)); });
  };
  const addScript = (src, done) => {
    const s = document.createElement('script'); s.src = src; s.async = true;
    s.onload = s.onerror = () => done();
    (document.head || document.documentElement).appendChild(s);
  };
  function loadRec(){   // loads audio-sources.js (if the page has not), then this lesson's and the shared manifest, once
    if (rec.state) return rec;
    rec.state = 'loading';
    const finish = () => { rec.state = 'ready'; rec.waits.splice(0).forEach(f => f()); };
    const go = () => {
      const S = window.LAB_AUDIO_SOURCES; if (!S || !S.repos) return finish();
      const repoUrl = id => S.repos[id === '_shared' ? S.shared : (S.subjects[id.split('/')[0]] || S.fallback)];
      const ids = [Lab.lessonId, '_shared'].filter(Boolean);
      rec.buckets = ids.map(id => ({ id, base: (repoUrl(id) || '') + id + '/', keys: {} })).filter(b => /^https?:|^file:/.test(b.base));
      let left = rec.buckets.length; if (!left) return finish();
      rec.buckets.forEach(b => addScript(b.base + 'manifest.js', () => { if (--left === 0) finish(); }));
    };
    if (window.LAB_AUDIO_SOURCES || !siteBase) go(); else addScript(siteBase + 'shared/audio-sources.js', go);
    return rec;
  }
  // url of the recording of (lang, key), or '' (then the browser voice reads it)
  const recUrl = (lang, key) => { const b = rec.buckets.find(x => x.keys[lang] && x.keys[lang].has(key)); return b ? b.base + lang + '/' + key + '.mp3' : ''; };
  Lab.recordings = () => loadRec();
  Lab.recordingUrl = (text, lang) => recUrl(lang || Lab.lang, Lab.speechKey(String(text).replace(/<[^>]+>/g, ''), lang || Lab.lang));
  const ss = window.speechSynthesis || null;
  const nativeSpeak = ss ? ss.speak.bind(ss) : () => {}, nativeCancel = ss ? ss.cancel.bind(ss) : () => {};
  let player = null, cur = null, gen = 0;   // one shared <audio> (stays unlocked on iOS after the first tap)
  let speakHook = null;                     // set by the auto-read block: sees every Lab.speak call first
  const audioRate = rate => Math.max(.3, Math.min(2.5, (rate || .95) / .95 * Lab.speakRate()));
  Lab.stopSpeech = () => { gen++; const c = cur; cur = null; pend = null; pb.playing = pb.paused = false; pbRender(); if (c){ try { player.pause(); } catch(e){} if (c.done) c.done(false); } nativeCancel(); };
  /* floating read-aloud bar: ⏸ pause / ▶ resume (from the same place, so a teacher can stop and explain) and ⏹ stop.
     Shown while a longer clip plays, while it is paused, and while auto-play runs (its ⏹ then also ends auto-play). */
  const PB_T = { pause:{ en:'⏸ Pause', zh:'⏸ 暂停' }, resume:{ en:'▶ Resume', zh:'▶ 继续' }, stop:{ en:'⏹ Stop', zh:'⏹ 停止' }, stopAuto:{ en:'⏹ Stop auto-play', zh:'⏹ 停止自动播放' } };
  const pb = { el:null, playing:false, paused:false, chain:false, onStop:null };
  function pbRender(){
    if (!document.body) return;
    if (!(pb.playing || pb.paused || pb.chain)){ if (pb.el){ pb.el.remove(); pb.el = null; } return; }
    if (!pb.el){
      pb.el = document.createElement('div'); pb.el.className = 'lab-player'; document.body.appendChild(pb.el);
      pb.el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.a === 'pp'){ (pb.paused ? Lab.resumeSpeech : Lab.pauseSpeech)(); return; }
        const f = pb.onStop; Lab.stopSpeech(); if (f) f(); });
    }
    pb.el.innerHTML = (pb.playing || pb.paused ? `<button type="button" data-a="pp">${Lab.L(pb.paused ? PB_T.resume : PB_T.pause)}</button>` : '') +
      `<button type="button" data-a="st">${Lab.L(pb.chain ? PB_T.stopAuto : PB_T.stop)}</button>`;
  }
  const pbSet = (k, v) => { if (pb[k] !== v){ pb[k] = v; pbRender(); } };
  Lab.speechPaused = () => pb.paused;
  // Is anything being read (or about to be: a Lab.speak whose recording list is still loading), or paused?
  let pend = null;
  Lab.speaking = () => !!pend || !!cur || pb.paused || !!(ss && (ss.speaking || ss.pending));
  // Promise that resolves when the narration has ended or was stopped; waits while paused; resolves at once when
  // nothing is being read. Anything that moves on by itself (step players, tours, auto-play) awaits it, so the end of
  // a recording is never cut off. Safety cap (some browsers never report the end of a long utterance), not while paused.
  Lab.whenSpoken = (cap = 180000) => new Promise(res => {
    const t0 = Date.now(); let quiet = 0;
    const tick = () => {
      if (Lab.speaking()){ quiet = 0; if (!pb.paused && Date.now() - t0 > cap) return res(); }
      else if (++quiet >= 2) return res();        // two quiet checks: no gap between a failed clip and its browser-voice fallback
      setTimeout(tick, 150);
    };
    tick();
  });
  Lab.pauseSpeech = () => {
    if (!pb.playing) return;
    if (cur && player) try { player.pause(); } catch(e){}
    else if (ss) try { ss.pause(); } catch(e){}
    pb.playing = false; pb.paused = true; pbRender();
  };
  Lab.resumeSpeech = () => {
    if (!pb.paused) return;
    pb.paused = false; pb.playing = true;
    if (cur && player){ const p = player.play(); if (p && p.catch) p.catch(() => {}); }
    else if (ss) try { ss.resume(); } catch(e){}
    pbRender();
  };
  function withRec(lang, fn){   // fn(url getter or null); waits at most 2 s for manifests that are still loading
    if (!REC_LANGS.includes(lang)) return fn(null);
    const r = loadRec();
    if (r.state !== 'loading') return fn(recUrl);
    const g = gen; let fired = false;
    const go = () => { if (fired) return; fired = true; if (g === gen) fn(recUrl); };
    r.waits.push(go); setTimeout(go, 2000);
  }
  function speakTTS(clean, lang, rate, done){
    if (!ss) return null;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    const v = Lab.voiceFor(lang); if (v){ u.voice = v; u.lang = v.lang; }
    u.rate = Math.max(.5, Math.min(1.6, (rate || .95) * Lab.speakRate()));
    const g = gen;
    if (clean.length > 40) u.onstart = () => { if (g === gen) pbSet('playing', true); };   // the bar only for longer texts
    u.onend = () => { if (g === gen){ pb.playing = pb.paused = false; pbRender(); } if (done) done(true); };
    u.onerror = () => { if (g === gen){ pb.playing = pb.paused = false; pbRender(); } if (done) done(false); };
    nativeSpeak(u); return u;
  }
  // Wake the audio output with a short silent Web Audio buffer (started inside the tap). Bluetooth headsets and many
  // PCs drop the first ~0.2 s of sound after the output was idle; the context is kept, so the output stays awake.
  let actx = null, warmed = false;
  function wakeOutput(){
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      if (!actx) actx = new AC();
      if (actx.state === 'suspended') actx.resume();
      const s = actx.createBufferSource(); s.buffer = actx.createBuffer(1, actx.sampleRate * 0.4 | 0, actx.sampleRate);
      s.connect(actx.destination); s.start();
    } catch(e){}
  }
  // Play a recording without losing its first syllables: start it MUTED inside the tap (this also keeps the player
  // unlocked on iOS) so it buffers while the output wakes up; once it can play through and the lead-in time has
  // passed, rewind to 0, unmute and play.
  function playRec(url, key, rate, fallback, done){
    const a = player || (player = new Audio()), c = cur = { rate, done, key };
    const fail = () => { if (cur !== c) return; cur = null; a.muted = false; pb.playing = pb.paused = false; pbRender(); fallback(); };
    wakeOutput();
    let timeOk = false, ready = false, started = false;
    const begin = () => {
      if (started || cur !== c || !timeOk || !ready) return; started = true;
      try { a.pause(); a.currentTime = 0; } catch(e){}
      a.muted = false;
      a.defaultPlaybackRate = a.playbackRate = audioRate(rate);
      a.onended = () => { if (cur !== c) return; cur = null; pb.playing = pb.paused = false; pbRender(); if (done) done(true); };
      const p = a.play(); if (p && p.catch) p.catch(e => { if (!e || e.name !== 'AbortError') fail(); });
      if (!(a.duration > 0 && a.duration < 4)) pbSet('playing', true);   // the bar only for clips longer than a few seconds
    };
    a.onended = () => { ready = true; begin(); };            // a very short clip may end during the muted lead-in
    a.onerror = fail;
    a.oncanplaythrough = () => { ready = true; begin(); };
    a.preload = 'auto'; a.muted = true; a.src = url;
    a.preservesPitch = a.mozPreservesPitch = a.webkitPreservesPitch = true;
    setTimeout(() => { timeOk = true; begin(); }, warmed ? 120 : 350);
    setTimeout(() => { ready = true; begin(); }, 4000);      // slow network: start anyway, the player keeps buffering
    warmed = true;
    const p = a.play(); if (p && p.catch) p.catch(e => { if (e && e.name === 'NotAllowedError'){ ready = true; } else if (!e || e.name !== 'AbortError') fail(); });
    return a;
  }
  // o: {lang, rate (browser-voice rate, default .95), onend(ok)}. Returns the <audio> (recording) or the utterance.
  // A card's "⚠️ Common mix-up / 容易混淆 / 易错点" box (class "mix") is read right after the card's own text, as its own
  // short clip (so the card keeps its existing recording). mixFor finds the visible mix box whose card also shows the
  // first phrase of the spoken text and returns "label: text", or '' (no box, or the page already reads it).
  // Deterministic (same DOM → same text), so the read-aloud crawler (pre.js) captures exactly the same string.
  const mixFlat = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const mixPlain = el => { const c = el.cloneNode(true); c.querySelectorAll('rt,rp,.py,script,style').forEach(n => n.remove()); return mixFlat(c.textContent); };   // never the pinyin annotations
  // the spoken form of one mix-up box: "label: text" ('' if empty) — shared by mixFor, the step player (mathanim) and the crawler
  Lab.mixText = (box, lang) => {
    try {
      const b = box.querySelector('b'), label = b ? mixPlain(b) : '', body = mixPlain(box).slice(label.length).trim();
      if (!body) return '';
      const name = label.replace(/[^\p{L}\p{N}\s-]/gu, '').trim(), zh = (lang || Lab.lang) === 'zh';
      return (name ? name + (zh ? '：' : ': ') : '') + body;
    } catch(e){ return ''; }
  };
  // The boxes read after a card, in this order: "💡 memory tip" (class memory), then "⚠️ mix-up" (class mix).
  Lab.extrasFor = (text, lang) => {
    const out = [];
    try {
      const t = mixFlat(text), head = t.split(/[。．.!?！？:：;；,，]/)[0].trim();
      if (head.length < 2) return out;
      for (const sel of ['.memory', '.mix']){
        for (const box of document.querySelectorAll(sel)){
          if (!box.getClientRects().length) continue;
          const card = box.closest('.info,.card,.panel,.box,.detail,.sidebar') || box.parentElement;
          // only a real card: not a whole section, and not one holding a step player (the player reads its boxes once, at the end)
          if (!card || card.matches('section,main,article,body') || card.querySelector('.ma-player,.ma-narration')) continue;
          if (!mixPlain(card).includes(head)) continue;
          const b = box.querySelector('b'), body = mixPlain(box).slice(b ? mixPlain(b).length : 0).trim();
          if (body && !t.includes(body.slice(0, 15))) out.push(Lab.mixText(box, lang));   // skip empty boxes and ones the page already reads
          break;
        }
      }
    } catch(e){}
    return out.filter(Boolean);
  };
  Lab.mixFor = (text, lang) => Lab.extrasFor(text, lang).join(' ');   // kept for older callers
  // Pages that read texts one after another (poem lines, whole-poem units, passages …) list every such text here, so the
  // read-aloud crawler records all of them without stepping through the page: Lab.readAll(() => [[text, lang], …]).
  // The texts must be exactly the strings the page passes to Lab.speak / speechSynthesis.
  const readAllFns = [];
  Lab.readAll = fn => { if (typeof fn === 'function') readAllFns.push(fn); };
  Lab.readAllTexts = () => readAllFns.flatMap(f => { try { return (f() || []).filter(x => x && x[0]); } catch(e){ return []; } });
  Lab.speak = (text, o = {}) => {
    if (!text) return null;
    const lang = o.lang || Lab.lang, clean = String(text).replace(/<[^>]+>/g, '');
    if (speakHook && !o.inner){ const r = speakHook(clean, lang, o); if (r === false) return null; if (r) o = r; }   // auto-read / auto-play (below)
    const extras = o.inner ? [] : Lab.extrasFor(clean, lang);
    if (extras.length){   // card first, then (after a short breath each) its memory tip and mix-up warning; the caller's onend fires after all
      const done0 = o.onend, rate = o.rate;
      const next = k => ok => {
        if (!ok){ if (done0) done0(false); return; }
        if (k >= extras.length){ if (done0) done0(true); return; }
        const t2 = pend = {}, g2 = gen;
        setTimeout(() => { if (pend === t2) pend = null; if (g2 !== gen) return; Lab.speak(extras[k], { lang, rate, onend: next(k + 1), inner: true }); }, 450);
      };
      o = Object.assign({}, o, { onend: next(0) });
    }
    Lab.stopSpeech();
    let out = { pending:true };
    const tok = pend = {};
    withRec(lang, get => {
      if (pend === tok) pend = null;
      const k = Lab.speechKey(clean, lang), url = get && get(lang, k);
      out = url ? playRec(url, k, o.rate, () => speakTTS(clean, lang, o.rate, o.onend), o.onend) : speakTTS(clean, lang, o.rate, o.onend);
    });
    return out;
  };
  if (ss){
    try {
      // pages call speechSynthesis.cancel() to stop reading (topic change, voice off …): stop recordings too
      ss.cancel = () => Lab.stopSpeech();
      // pages that speak Chinese utterances themselves (e.g. line-by-line poem readers) also get the recording
      ss.speak = u => {
        const ul = u && (/^zh/i.test(u.lang || '') ? 'zh' : /^en/i.test(u.lang || '') ? 'en' : (!u.lang ? Lab.lang : ''));
        if (!ul || !REC_LANGS.includes(ul)) return nativeSpeak(u);
        const ev = ok => { try { u.dispatchEvent(new Event(ok ? 'end' : 'error')); } catch(e){} };
        withRec(ul, get => {
          const k = Lab.speechKey(u.text, ul), url = get && get(ul, k);
          if (url){ Lab.stopSpeech(); playRec(url, k, u.rate || 1, () => nativeSpeak(u), ev); }
          else nativeSpeak(u);
        });
      };
    } catch(e){}
  }
  if (window.speechSynthesis){ allVoices(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', () => {}); }

  /* ---------- auto-read and auto-play (settings in the 🔊 panel, remembered across lessons) ----------
     auto-read: when the student opens a card (chip, tab, "Next", map item …) the 🔊 button that appears — or whose
                panel text changed — is pressed for them.
     auto-play: after a card has been read, the "Next ▶" / "Start ▶" button of the same panel is pressed and the new
                card is read, until there is no next card or a card comes round again. Any click of the student's
                own, or the ⏹ pill, stops it. Works on every lesson without per-page code. */
  const AUTO_T = { read:{ en:'Read each card aloud when it opens', zh:'打开卡片时自动朗读' },
    next:{ en:'Auto-play: read, then turn to the next card', zh:'自动播放：读完自动翻到下一张' },
    stop:{ en:'⏹ Stop auto-play', zh:'⏹ 停止自动播放' } };
  const auto = (() => {
    const read = () => store.get('labAutoRead') === '1' || next(), next = () => store.get('labAutoNext') === '1';
    const SKIP = '.lab-nav,#lab-nav,.lab-vpanel,.ma-player,.lab-footer,footer,.quiz,.opts,.lab-player,.lab-hsay';
    const CONT = '.info,.card,.panel,.box,.detail,.sidebar,section';
    const isSpk = el => !!el && !el.closest(SKIP) && (el.matches('.speak,.say,[data-a=speak],[data-say],[data-speak]') ||
      /🔊|朗读|读一读|听一听|Read aloud|Listen/i.test(((el.textContent || '').trim().slice(0, 30)) + (el.title || '') + (el.getAttribute('aria-label') || '')));
    const vis = el => el.isConnected && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    const speakers = () => [...document.querySelectorAll('button,[role=button],.speak,.say,[data-say],[data-speak]')].filter(el => isSpk(el) && vis(el));
    const contOf = el => el.closest(CONT) || el.parentElement || el;
    const isNext = el => { const t = ((el.textContent || '').trim().slice(0, 24)) + ' ' + (el.title || '') + ' ' + (el.id || '');
      return !isSpk(el) && !el.disabled && !/上一|prev|◀|‹|←|back|返回|播放|play|试听|test|重新|again|reset|重置/i.test(t) && /下一|next|▶|›|→|继续|开始|start/i.test(t); };
    const isPrev = el => { const t = ((el.textContent || '').trim().slice(0, 24)) + ' ' + (el.title || '') + ' ' + (el.id || '');
      return !isSpk(el) && /上一|prev|◀|‹|←|earlier|更早/i.test(t) && !/播放|play|试听|test|重新|again|reset|重置/i.test(t); };
    let chain = null, pill = null, auto = false, gen2 = 0;
    const showPill = on => { pb.onStop = on ? stop : null; pbSet('chain', !!on); };   // the read-aloud bar's ⏹ ends auto-play
    const stop = () => { chain = null; gen2++; showPill(false); };
    // press a 🔊 button for the student; with auto-play on, its text joins the chain and its end turns the page
    const press = (btn, c) => {
      if (next()) chain = c || chain || { seen: new Set(), cont: contOf(btn), g: ++gen2 };
      if (chain) chain.cont = contOf(btn);
      auto = true; try { btn.click(); } finally { auto = false; }
    };
    speakHook = (clean, lang, o) => {
      if (!chain || !next()) return null;
      const k = lang + '|' + clean; if (chain.seen.has(k)){ stop(); return false; }   // came round again: done
      chain.seen.add(k); showPill(true);
      const c = chain, g = c.g, done0 = o.onend;
      return Object.assign({}, o, { onend: ok => { if (done0) done0(ok); if (ok && chain === c && c.g === g) setTimeout(() => turn(c, g), 2500); } });
    };
    // auto-play: press "Next" in the panel of the card just read, then read the card that opens
    const turn = (c, g) => {
      if (chain !== c || c.g !== g || !next()) return;
      if (pb.paused){ setTimeout(() => turn(c, g), 500); return; }   // paused: hold the page turn until resumed
      let box = c.cont, nb = null;
      for (let k = 0; k < 3 && box && !nb; k++){ nb = [...box.querySelectorAll('button,[role=button],a[href^="#"]')].find(el => vis(el) && isNext(el)); box = box.parentElement && box.parentElement.closest(CONT); }
      if (!nb){ stop(); return; }
      const snap = snapshot(); auto = true; try { nb.click(); } finally { auto = false; }
      setTimeout(() => { if (chain === c && c.g === g){ const b = changed(snap); if (b) press(b, c); else stop(); } }, 450);
    };
    // which 🔊 button belongs to what just opened: a new one, or one whose panel text changed
    const snapshot = () => { const m = new Map(); speakers().forEach(b => m.set(b, (contOf(b).textContent || '').length + '|' + (contOf(b).textContent || '').slice(0, 200))); return m; };
    const changed = (snap, picks = true) => {
      const now = speakers();
      return now.find(b => !snap.has(b)) || (picks && now.find(b => { const t = contOf(b).textContent || ''; return snap.get(b) !== t.length + '|' + t.slice(0, 200); })) || null;
    };
    // clicks that pick a card (not "play", "reset" …): only these may count a changed panel text as a new card
    const PICK = '[data-k],[data-key],[data-id],[data-i],[data-idx],[data-n],[data-step],[data-tab],[data-p],[data-part],[data-name],.chip,.tab,.pill,[role=tab],canvas,svg';
    // a silent clip played inside the first tap unlocks the shared player on iOS, so later auto-reads may play
    const unlock = () => { if (player) return; try { player = new Audio(); player.muted = true;
      player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='; const p = player.play(); if (p && p.catch) p.catch(() => {}); } catch(e){} };
    document.addEventListener('click', e => {
      if (!e.isTrusted || auto) return;
      const t = e.target.closest ? e.target : e.target.parentElement; if (!t) return;
      if (t.closest('.lab-player,.lab-vpanel,.lab-voice,.lab-hsay')) return;
      if (read()) unlock();
      const sp = t.closest('button,[role=button],.speak,.say,[data-say],[data-speak]');
      if (sp && isSpk(sp)){   // the student pressed 🔊 themselves: with auto-play on, a new chain starts here
        stop(); if (next()){ chain = { seen: new Set(), cont: contOf(sp), g: ++gen2 }; }
        return;
      }
      stop();                 // any other click of the student ends auto-play (a card it opens may start a new one)
      if (t.closest(SKIP) || t.closest('input,select,textarea,label')) return;
      // turning the card by hand (Next / Previous, a chip, a tab …) stops the narration at once, whatever the settings;
      // a click that turns out to open another card stops it too, unless the page itself started reading the new card
      const btn = t.closest('button,[role=button]') || t, pk = t.closest(PICK), nav = isNext(btn) || isPrev(btn) || !!(pk && !pk.matches('canvas,svg'));
      if (nav && Lab.speaking()) Lab.stopSpeech();
      const snap = snapshot(), picks = !!pk || isNext(btn) || isPrev(btn), was = Lab.speaking(), g0 = gen;
      setTimeout(() => { const b = changed(snap, picks); if (!b || chain) return;
        if (read()) press(b); else if (was && g0 === gen && Lab.speaking()) Lab.stopSpeech(); }, 350);
    }, true);
    return { read, next, stop };
  })();

  /* ---------- read any text on demand (TTS PC issue #4) ----------
     mouse: rest on a paragraph, list item, heading, table cell, quiz question or option … and a small 🔊 appears beside
     it; click the 🔊 to hear that text. Double-click on ordinary text reads it too (the word stays selected for copying).
     Touch: a long press shows the 🔊. Clickable items (quiz options, poem lines that read themselves …) get the 🔊 only:
     it sits outside the item, so pressing it never clicks the item. Long texts are read as sentence-sized clips.
     Lab.blockTexts() lists every visible text exactly as it would be read ([[text, lang], …]) for the crawler.
     Off switch in the 🔊 panel (labHoverRead = '0'). */
  const HOVER_T = { opt:{ en:'Rest the mouse on any text to hear it (🔊)', zh:'鼠标停在文字上可朗读（🔊）' }, say:{ en:'Read aloud', zh:'朗读' } };
  const ondemand = (() => {
    const on = () => store.get('labHoverRead') !== '0';
    const BLOCK = 'p,li,dd,dt,h1,h2,h3,h4,h5,td,th,figcaption,blockquote,caption,.job,.memory,.mix,.quote,.qtext,.explain,.opts>button,.pline';
    const NO = '.lab-nav,#lab-nav,.lab-vpanel,.lab-player,.lab-footer,#lab-footer,footer,.lab-hsay,.ma-player,.ma-narration,script,style,svg,canvas,input,select,textarea,code,pre,[aria-hidden=true],[data-noread]';
    const CLICKY = 'button,a[href],[role=button],[role=tab],[onclick],[data-k],[data-key],[data-i],[data-idx],[data-n],[data-id],[data-l],[data-step],.chip,.tab,.pill,.opt,.yc';
    const zhOf = t => { const han = (t.match(/\p{Script=Han}/gu) || []).length, lat = (t.match(/[A-Za-z]/g) || []).length; return han > 0 && han * 3 >= lat; };
    // the text exactly as it is read: no pinyin, no buttons, no emoji; maths as words where the step-player helper is loaded
    const textOf = el => {
      if (el.matches('.memory,.mix')) return Lab.mixText(el);
      const c = el.cloneNode(true);
      c.querySelectorAll('rt,rp,.py,button,.speak,.say,script,style,svg,canvas,[aria-hidden=true],.katex-mathml').forEach(n => n.remove());
      const kx = c.querySelectorAll('.katex');
      if (kx.length){
        if (!(window.MathAnim && MathAnim.spoken)) return '';
        const orig = el.querySelectorAll('.katex');
        kx.forEach((k, i) => { const a = orig[i] && orig[i].querySelector('annotation'); k.replaceWith(a ? '$' + a.textContent + '$' : ''); });
        return mixFlat(MathAnim.spoken(mixFlat(c.textContent), zhOf(c.textContent) || Lab.lang === 'zh'));
      }
      return mixFlat(c.textContent.replace(/[\p{Extended_Pictographic}️‍☆★✓✔✗✘●○◆◇■□▶◀►◄]/gu, ' '));   // emoji and decorative marks (☆ ✓ ● ▶ …)
    };
    const worth = t => (t.match(/\p{Script=Han}/gu) || []).length >= 2 || (t.match(/[A-Za-z]{2,}/g) || []).length >= 2;
    const vis = el => el.isConnected && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    const blockOf = t => { const b = t && t.closest && t.closest(BLOCK); return b && !b.closest(NO) && vis(b) ? b : null; };
    const chunk = (t, zh) => {   // sentence-sized clips (≤150 Chinese / ≤400 English characters)
      const max = zh ? 150 : 400; if (t.length <= max) return [t];
      const parts = t.match(zh ? /[^。！？；!?;]+[。！？；!?;]*[”’」』）)]*/g : /[^.!?;]+[.!?;]*["”’)]*\s*/g) || [t], out = []; let cur = '';
      for (const p of parts){ if (cur && (cur + p).length > max){ out.push(cur.trim()); cur = ''; } cur += p; }
      if (cur.trim()) out.push(cur.trim());
      return out.flatMap(s => s.length <= max ? [s] : s.match(new RegExp('[\\s\\S]{1,' + max + '}', 'g')));
    };
    const units = el => { const t = textOf(el); if (!worth(t)) return null; const zh = zhOf(t); return { lang: zh ? 'zh' : 'en', parts: chunk(t, zh) }; };
    let reading = null;
    const read = el => {
      const u = units(el); if (!u) return;
      auto.stop();
      if (reading) reading.classList.remove('lab-hreading');
      reading = el; el.classList.add('lab-hreading');
      let k = 0;
      const go = ok => {
        if (ok === false || k >= u.parts.length){ if (reading === el){ el.classList.remove('lab-hreading'); reading = null; } return; }
        Lab.speak(u.parts[k++], { lang: u.lang, inner: true, onend: go });
      };
      go(true);
    };
    // the floating 🔊 (one for the page, in <body>, so it is never inside the item it reads)
    let btn = null, cur = null, showT = 0, hideT = 0;
    const hide = () => { clearTimeout(showT); clearTimeout(hideT); cur = null; if (btn) btn.style.display = 'none'; };
    const show = (el, touch) => {
      if (!btn){
        btn = document.createElement('button'); btn.type = 'button'; btn.className = 'lab-hsay'; btn.textContent = '🔊';
        btn.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); });   // keep the text selection and focus
        btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); const el = cur; hide(); if (el) read(el); });
        btn.addEventListener('mouseleave', () => { clearTimeout(hideT); hideT = setTimeout(hide, 350); });
        btn.addEventListener('mouseenter', () => clearTimeout(hideT));
        document.body.appendChild(btn);
      }
      btn.title = Lab.L(HOVER_T.say); btn.setAttribute('aria-label', btn.title);
      const r = el.getBoundingClientRect(), s = touch ? 40 : 28;
      btn.classList.toggle('touch', !!touch);
      btn.style.display = 'block';
      btn.style.left = Math.max(4, Math.min(r.right + 4, innerWidth - s - 4)) + scrollX + 'px';
      btn.style.top = Math.max(4, r.top + (touch ? -s - 4 : 0)) + scrollY + 'px';
      cur = el;
    };
    document.addEventListener('mouseover', e => {
      if (!on() || e.target === btn) return;
      const el = blockOf(e.target);
      if (el === cur){ clearTimeout(hideT); return; }
      clearTimeout(showT);
      if (cur){ clearTimeout(hideT); hideT = setTimeout(hide, 350); }
      if (el && worth(textOf(el))) showT = setTimeout(() => { clearTimeout(hideT); show(el); }, 550);
    }, true);
    document.addEventListener('mouseout', e => { if (cur && !e.relatedTarget){ clearTimeout(hideT); hideT = setTimeout(hide, 350); } }, true);
    document.addEventListener('dblclick', e => {
      if (!on() || !e.isTrusted) return;
      const t = e.target.closest ? e.target : e.target.parentElement; if (!t || t.closest(CLICKY) || t.closest(NO)) return;
      const el = blockOf(t); if (el){ hide(); read(el); }
    }, true);
    // touch: a long press (finger still for ~0.55 s) shows a bigger 🔊 above the text
    let lp = null;
    document.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'touch' || e.target === btn) return;
      if (cur) hide();
      if (!on()) return;
      const el = blockOf(e.target); if (!el) return;
      const x = e.clientX, y = e.clientY;
      lp = { x, y, t: setTimeout(() => { lp = null; if (worth(textOf(el))) show(el, true); }, 550) };
    }, true);
    const cancelLp = e => { if (lp && (!e || e.type !== 'pointermove' || Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10)){ clearTimeout(lp.t); lp = null; } };
    ['pointerup', 'pointercancel', 'pointermove'].forEach(ev => document.addEventListener(ev, cancelLp, true));
    addEventListener('scroll', () => { if (cur && !(btn && btn.classList.contains('touch'))) hide(); }, { passive: true });
    Lab.onLang && Lab.onLang(hide);
    // every visible text as it would be read on demand, for the read-aloud crawler (tools/tts/drive.js)
    Lab.blockTexts = () => {
      const out = [], seen = new Set();
      for (const el of document.querySelectorAll(BLOCK)){
        if (el.closest(NO) || !vis(el)) continue;
        const u = units(el); if (!u) continue;
        for (const p of u.parts){ const k = u.lang + '|' + p; if (!seen.has(k)){ seen.add(k); out.push([p, u.lang]); } }
      }
      return out;
    };
    return { on, hide };
  })();
  // voice settings popover (opened from the 🔊 nav button)
  Lab.voicePanel = () => {
    let p = $('.lab-vpanel'); if (p){ p.remove(); return; }
    const lang = Lab.lang, vs = Lab.voices(lang), cur = Lab.voiceFor(lang);
    const T = { h:{en:'Read-aloud voice',zh:'朗读声音'}, rate:{en:'Speed',zh:'语速'}, test:{en:'▶ Test',zh:'▶ 试听'}, none:{en:'This browser has no voice for this language.',zh:'这个浏览器没有该语言的声音。'},
      tip:{en:'Tip: Microsoft Edge has the most natural voices (names with “Natural”). Chrome’s “Google” voices are good too.',zh:'提示：Microsoft Edge 浏览器的声音最自然（名字带 “Natural” 的）；Chrome 的 “Google” 声音也不错。'},
      sample:{en:'Hello! This is how I will read the lessons to you.',zh:'你好！我会用这个声音为你朗读课文。'} };
    const recNote = rec.state === 'ready' && rec.buckets.some(b => b.keys[lang] && b.keys[lang].size) ?`<small>${Lab.L({ en:'Lessons are read with a pre-recorded voice; the voice list above is used only for text that has no recording.', zh:'课文使用预先录好的声音朗读；上面的声音选择只用于没有录音的内容。' })}</small>` : '';
    p = document.createElement('div'); p.className = 'lab-vpanel card';
    p.innerHTML = `<b>${Lab.L(T.h)}</b>${vs.length ? `<select class="lab-vsel">${vs.map(v => `<option value="${v.name.replace(/"/g, '&quot;')}" ${cur && v.name === cur.name ? 'selected' : ''}>${v.name}</option>`).join('')}</select>` : `<p>${Lab.L(T.none)}</p>`}
      <label>${Lab.L(T.rate)} <input type="range" class="lab-vrate" min=".5" max="1.5" step=".05" value="${Lab.speakRate()}"><output>${Lab.speakRate().toFixed(2)}×</output></label>
      <button type="button" class="btn lab-vtest">${Lab.L(T.test)}</button>
      <label class="lab-vauto"><input type="checkbox" class="lab-vread" ${auto.read() ? 'checked' : ''}> ${Lab.L(AUTO_T.read)}</label>
      <label class="lab-vauto"><input type="checkbox" class="lab-vnext" ${auto.next() ? 'checked' : ''}> ${Lab.L(AUTO_T.next)}</label>
      <label class="lab-vauto"><input type="checkbox" class="lab-vhover" ${ondemand.on() ? 'checked' : ''}> ${Lab.L(HOVER_T.opt)}</label>
      ${recNote}<small>${Lab.L(T.tip)}</small>`;
    document.body.appendChild(p);
    $('.lab-vread', p).onchange = e => store.set('labAutoRead', e.target.checked ? '1' : '0');
    $('.lab-vhover', p).onchange = e => { store.set('labHoverRead', e.target.checked ? '1' : '0'); if (!e.target.checked) ondemand.hide(); };
    $('.lab-vnext', p).onchange = e => { store.set('labAutoNext', e.target.checked ? '1' : '0'); if (!e.target.checked) auto.stop(); };
    const sel = $('.lab-vsel', p), rate = $('.lab-vrate', p);
    if (sel) sel.onchange = () => { store.set('labVoice_' + lang, sel.value); Lab.speak(Lab.L(T.sample)); };
    rate.oninput = () => { store.set('labRate', rate.value); $('output', p).textContent = (+rate.value).toFixed(2) + '×'; if (cur && player) player.playbackRate = audioRate(cur.rate); };
    $('.lab-vtest', p).onclick = () => Lab.speak(Lab.L(T.sample));
    setTimeout(() => document.addEventListener('click', function off(e){ if (!e.target.closest('.lab-vpanel,.lab-voice')){ p.remove(); document.removeEventListener('click', off); } }), 0);
  };

  /* ---------- quiz ----------
     questions: [{q:{en,zh}, options:[{en,zh},...], answer:0, explain:{en,zh}}]   opts: {count:10} */
  Lab.quiz = (el, questions, opts={}) => {
    const st = { list:[], i:0, score:0, picked:null, order:[] };
    el.innerHTML = `<div class="qprog"><div></div></div><div class="qtext"></div><div class="opts"></div><div class="feedback"></div><div class="explain"></div><button class="btn qnext" style="display:none"></button>`;
    const bar = $('.qprog div', el), qt = $('.qtext', el), op = $('.opts', el), fb = $('.feedback', el), ex = $('.explain', el), nx = $('.qnext', el);
    function start(){ st.list = Lab.shuffle(questions).slice(0, opts.count || 10); st.i = 0; st.score = 0; load(); }
    function load(){ st.picked = null; const q = st.list[st.i]; st.order = q ? Lab.shuffle(q.options.map((_, k) => k)) : []; render(); }
    function render(){
      const n = st.list.length; bar.style.width = (st.i / n * 100) + '%';
      if (st.i >= n){ qt.innerHTML = fmt(UI.done, {s:st.score, t:n}); op.innerHTML = ''; fb.textContent = ''; ex.textContent = ''; nx.style.display = ''; nx.textContent = Lab.L(UI.again); return; }
      const q = st.list[st.i];
      qt.innerHTML = `<small>${fmt(UI.q, {n:st.i+1, t:n})}</small>${Lab.L(q.q)}`;
      op.innerHTML = st.order.map(k => `<button class="opt" data-k="${k}">${Lab.L(q.options[k])}</button>`).join('');
      $$('.opt', op).forEach(b => b.onclick = () => pick(+b.dataset.k));
      if (st.picked != null) mark(); else { fb.textContent = ''; ex.textContent = ''; nx.style.display = 'none'; }
    }
    function pick(k){ if (st.picked != null) return; st.picked = k; if (k === st.list[st.i].answer) st.score++; mark(); }
    function mark(){
      const q = st.list[st.i], ok = st.picked === q.answer;
      $$('.opt', op).forEach(b => { const k = +b.dataset.k; b.disabled = true; if (k === q.answer) b.classList.add('right'); else if (k === st.picked) b.classList.add('wrong'); });
      fb.textContent = ok ? Lab.L(UI.right) : Lab.L(UI.wrong) + Lab.L(q.options[q.answer]); fb.style.color = ok ? 'var(--good)' : 'var(--bad)';
      ex.textContent = q.explain ? Lab.L(q.explain) : ''; nx.style.display = ''; nx.textContent = Lab.L(UI.nextQ);
    }
    nx.onclick = () => { if (st.i >= st.list.length) return start(); st.i++; st.i >= st.list.length ? render() : load(); };
    start(); Lab.onLang(render);
    return { restart:start };
  };

  /* ---------- sort game ----------
     cfg: {bins:[{id, en, zh}], items:[{en, zh, bin, color}]} */
  Lab.sort = (el, cfg) => {
    let sel = null, mistakes = 0;
    function start(){
      sel = null; mistakes = 0;
      el.innerHTML = `<div class="pool"></div><div class="bins">${cfg.bins.map(b => `<div class="bin" data-bin="${b.id}"><h4 data-zh="${b.zh}">${b.en}</h4></div>`).join('')}</div><div class="result" style="margin-top:10px"></div><button class="btn ghost sreset" data-zh="${UI.reset.zh}">${UI.reset.en}</button>`;
      $('.pool', el).innerHTML = Lab.shuffle(cfg.items.map((it, i) => ({...it, i}))).map(it => `<span class="chip" draggable="true" data-i="${it.i}"><span data-zh="${it.zh}">${it.en}</span></span>`)  /* no colour dots: colours often matched bins and gave answers away */.join('');
      $$('.pool .chip', el).forEach(c => {
        c.onclick = () => { sel = sel === c ? null : c; $$('.pool .chip', el).forEach(x => x.classList.toggle('sel', x === sel)); ready(!!sel); };
        c.ondragstart = e => { e.dataTransfer.setData('text/plain', c.dataset.i); ready(true); };
        c.ondragend = () => ready(!!sel);
      });
      $$('.bin', el).forEach(b => {
        b.ondragover = e => e.preventDefault();
        b.ondrop = e => { e.preventDefault(); drop(b, e.dataTransfer.getData('text/plain')); };
        b.onclick = () => sel && drop(b, sel.dataset.i);
      });
      $('.sreset', el).onclick = start;
      applyStatic(el);
    }
    const ready = on => $$('.bin', el).forEach(b => b.classList.toggle('ready', on));
    function drop(bin, i){
      const chip = $(`.pool .chip[data-i="${i}"]`, el); if (!chip) return;
      const it = cfg.items[+i], res = $('.result', el); chip.classList.remove('sel', 'badc');
      if (it.bin === bin.dataset.bin){ chip.classList.add('good'); chip.draggable = false; chip.onclick = null; bin.appendChild(chip); res.textContent = Lab.L(UI.sortGood) + ' ' + Lab.L(it); res.className = 'result good'; }
      else { mistakes++; void chip.offsetWidth; chip.classList.add('badc'); res.textContent = Lab.L(UI.sortBad) + ' ' + Lab.L(it); res.className = 'result bad'; }
      sel = null; ready(false);
      if (!$('.pool .chip', el)){ res.textContent = fmt(UI.sortDone, {m:mistakes}); res.className = 'result good'; }
    }
    start();
    return { restart:start };
  };

  /* ---------- boot ---------- */
  function boot(){
    findTopic(); buildNav(); buildFooter(); setTimeout(() => loadRec(Lab.lang), 400);   // fetch the recordings list soon after start-up, so 🔊 plays at once
    isReady = true;
    readyFns.forEach(fn => { try { fn(); } catch(e){ console.error(e); } });
    Lab.applyLang();
    modeFns.forEach(fn => { try { fn(advOn); } catch(e){ cbErr(e); } });
  }
  // Boot as soon as the HTML is parsed ("interactive"), i.e. BEFORE deferred/module scripts run — so the nav,
  // footer and translations don't wait for three.js / CDN modules to download.
  let booted = false; const once = () => { if (!booted){ booted = true; boot(); } };
  if (document.readyState === 'loading'){
    document.addEventListener('readystatechange', () => { if (document.readyState !== 'loading') once(); });
    document.addEventListener('DOMContentLoaded', once);
  } else once();
})();
