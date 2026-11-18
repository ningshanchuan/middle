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
  Lab.onLang = fn => { langFns.push(fn); if (isReady) fn(Lab.lang); };
  Lab.ready = fn => { if (isReady) fn(); else readyFns.push(fn); };
  const UI = {
    home:{en:'Genius Classroom',zh:'天才课堂'}, all:{en:'All topics',zh:'全部主题'}, prev:{en:'Previous topic',zh:'上一个主题'}, next:{en:'Next topic',zh:'下一个主题'},
    std:{en:'Georgia standard',zh:'佐治亚州课程标准'}, note:{en:'3D models are simplified and not to scale.',zh:'3D 模型经过简化，比例并不真实。'},
    q:{en:'Question {n} of {t}',zh:'第 {n} 题 / 共 {t} 题'}, right:{en:'✅ Correct!',zh:'✅ 答对了！'}, wrong:{en:'❌ Not quite. Answer: ',zh:'❌ 不对，正确答案：'},
    nextQ:{en:'Next question ▶',zh:'下一题 ▶'}, done:{en:'🎉 Finished! You got {s} of {t} right.',zh:'🎉 完成！你答对了 {s} / {t} 题。'}, again:{en:'Play again ↺',zh:'再来一轮 ↺'},
    sortGood:{en:'✅ Correct!',zh:'✅ 正确！'}, sortBad:{en:'❌ Try again!',zh:'❌ 再想想！'}, sortDone:{en:'🎉 All sorted! Mistakes: {m}',zh:'🎉 全部分对了！出错次数：{m}'}, reset:{en:'Play again',zh:'再玩一次'},
    theme:{en:'Toggle dark mode',zh:'切换深色模式'}, listen:{en:'🔊 Read aloud',zh:'🔊 朗读'}, need3d:{en:'⚠️ The 3D scene needs an internet connection to load.',zh:'⚠️ 3D 场景需要联网才能加载。'}
  };
  Lab.UI = UI;
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
    langFns.forEach(fn => { try { fn(Lab.lang); } catch(e){ console.error(e); } });
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
  /* Pre-recorded read-aloud (OpenAI gpt-4o-mini-tts): science-lab/audio/<lang>/<key>.<ext>, listed in
     audio/<lang>/manifest.js (a script, not JSON, so it also loads from file://; manifest.json holds the same list).
     key = FNV-1a 32-bit hex of  lang + '|' + Lab.speechNorm(text). A text without a recording is read by the browser
     voice. Recorded languages are listed in REC_LANGS (each needs audio/<lang>/manifest.js).
     Recordings play at  (o.rate||.95)/.95 × the reader's speed (🔊 panel), pitch preserved.
     Pages that drive speechSynthesis directly (zh utterances) get the recording too, with 'end' fired on the utterance.
     Regenerate with science-lab/tools/tts (see README.txt there) whenever lesson texts change. */
  const REC_LANGS = ['zh', 'en'];
  const audioBase = (() => { try { return new URL('../audio/', (document.currentScript && document.currentScript.src) || location.href).href; } catch(e){ return ''; } })();
  Lab.speechNorm = t => String(t == null ? '' : t).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  Lab.speechKey = (text, lang) => {
    const s = lang + '|' + Lab.speechNorm(text); let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  };
  const rec = {};   // lang -> {state:'loading'|'ready'|'none', ext, keys:Set, waits:[]}
  window.LabAudioManifest = m => { const r = rec[m.lang] || (rec[m.lang] = { waits:[] }); r.ext = m.ext || 'mp3'; r.keys = new Set(String(m.keys || '').split(/\s+/).filter(Boolean)); r.state = 'ready'; r.waits.splice(0).forEach(f => f()); };
  function loadRec(lang){   // loads the manifest once per language
    if (!REC_LANGS.includes(lang) || !audioBase) return null;
    let r = rec[lang]; if (r && r.state) return r;
    r = rec[lang] = r || { waits:[] }; r.state = 'loading';
    const s = document.createElement('script'); s.src = audioBase + lang + '/manifest.js'; s.async = true;
    s.onerror = () => { r.state = 'none'; r.waits.splice(0).forEach(f => f()); };
    (document.head || document.documentElement).appendChild(s); return r;
  }
  Lab.recordings = loadRec;
  const ss = window.speechSynthesis || null;
  const nativeSpeak = ss ? ss.speak.bind(ss) : () => {}, nativeCancel = ss ? ss.cancel.bind(ss) : () => {};
  let player = null, cur = null, gen = 0;   // one shared <audio> (stays unlocked on iOS after the first tap)
  const audioRate = rate => Math.max(.3, Math.min(2.5, (rate || .95) / .95 * Lab.speakRate()));
  Lab.stopSpeech = () => { gen++; const c = cur; cur = null; if (c){ try { player.pause(); } catch(e){} if (c.done) c.done(false); } nativeCancel(); };
  function withRec(lang, fn){   // fn(manifest or null); waits at most 1.5 s for a manifest that is still loading
    const r = loadRec(lang);
    if (!r || r.state !== 'loading') return fn(r && r.state === 'ready' ? r : null);
    const g = gen; let fired = false;
    const go = () => { if (fired) return; fired = true; if (g === gen) fn(r.state === 'ready' ? r : null); };
    r.waits.push(go); setTimeout(go, 1500);
  }
  function speakTTS(clean, lang, rate, done){
    if (!ss) return null;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    const v = Lab.voiceFor(lang); if (v){ u.voice = v; u.lang = v.lang; }
    u.rate = Math.max(.5, Math.min(1.6, (rate || .95) * Lab.speakRate()));
    if (done){ u.onend = () => done(true); u.onerror = () => done(false); }
    nativeSpeak(u); return u;
  }
  function playRec(r, key, lang, rate, fallback, done){
    const a = player || (player = new Audio()), c = cur = { rate, done, key };
    const fail = () => { if (cur !== c) return; cur = null; fallback(); };
    a.onended = () => { if (cur !== c) return; cur = null; if (done) done(true); };
    a.onerror = fail;
    a.src = audioBase + lang + '/' + key + '.' + r.ext;
    a.preservesPitch = a.mozPreservesPitch = a.webkitPreservesPitch = true;
    a.defaultPlaybackRate = a.playbackRate = audioRate(rate);
    const p = a.play(); if (p && p.catch) p.catch(e => { if (!e || e.name !== 'AbortError') fail(); });
    return a;
  }
  // o: {lang, rate (browser-voice rate, default .95), onend(ok)}. Returns the <audio> (recording) or the utterance.
  Lab.speak = (text, o = {}) => {
    if (!text) return null;
    const lang = o.lang || Lab.lang, clean = String(text).replace(/<[^>]+>/g, '');
    Lab.stopSpeech();
    let out = { pending:true };
    withRec(lang, r => {
      const k = r && Lab.speechKey(clean, lang);
      out = r && r.keys.has(k) ? playRec(r, k, lang, o.rate, () => speakTTS(clean, lang, o.rate, o.onend), o.onend) : speakTTS(clean, lang, o.rate, o.onend);
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
        withRec(ul, r => {
          const k = r && Lab.speechKey(u.text, ul);
          if (r && r.keys.has(k)){ Lab.stopSpeech(); playRec(r, k, ul, u.rate || 1, () => nativeSpeak(u), ev); }
          else nativeSpeak(u);
        });
      };
    } catch(e){}
  }
  if (window.speechSynthesis){ allVoices(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', () => {}); }
  // voice settings popover (opened from the 🔊 nav button)
  Lab.voicePanel = () => {
    let p = $('.lab-vpanel'); if (p){ p.remove(); return; }
    const lang = Lab.lang, vs = Lab.voices(lang), cur = Lab.voiceFor(lang);
    const T = { h:{en:'Read-aloud voice',zh:'朗读声音'}, rate:{en:'Speed',zh:'语速'}, test:{en:'▶ Test',zh:'▶ 试听'}, none:{en:'This browser has no voice for this language.',zh:'这个浏览器没有该语言的声音。'},
      tip:{en:'Tip: Microsoft Edge has the most natural voices (names with “Natural”). Chrome’s “Google” voices are good too.',zh:'提示：Microsoft Edge 浏览器的声音最自然（名字带 “Natural” 的）；Chrome 的 “Google” 声音也不错。'},
      sample:{en:'Hello! This is how I will read the lessons to you.',zh:'你好！我会用这个声音为你朗读课文。'} };
    const r = rec[lang], recNote = r && r.state === 'ready' && r.keys.size ? `<small>${Lab.L({ en:'Lessons are read with a pre-recorded voice; the voice list above is used only for text that has no recording.', zh:'课文使用预先录好的声音朗读；上面的声音选择只用于没有录音的内容。' })}</small>` : '';
    p = document.createElement('div'); p.className = 'lab-vpanel card';
    p.innerHTML = `<b>${Lab.L(T.h)}</b>${vs.length ? `<select class="lab-vsel">${vs.map(v => `<option value="${v.name.replace(/"/g, '&quot;')}" ${cur && v.name === cur.name ? 'selected' : ''}>${v.name}</option>`).join('')}</select>` : `<p>${Lab.L(T.none)}</p>`}
      <label>${Lab.L(T.rate)} <input type="range" class="lab-vrate" min=".5" max="1.5" step=".05" value="${Lab.speakRate()}"><output>${Lab.speakRate().toFixed(2)}×</output></label>
      <button type="button" class="btn lab-vtest">${Lab.L(T.test)}</button>${recNote}<small>${Lab.L(T.tip)}</small>`;
    document.body.appendChild(p);
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
  }
  // Boot as soon as the HTML is parsed ("interactive"), i.e. BEFORE deferred/module scripts run — so the nav,
  // footer and translations don't wait for three.js / CDN modules to download.
  let booted = false; const once = () => { if (!booted){ booted = true; boot(); } };
  if (document.readyState === 'loading'){
    document.addEventListener('readystatechange', () => { if (document.readyState !== 'loading') once(); });
    document.addEventListener('DOMContentLoaded', once);
  } else once();
})();
