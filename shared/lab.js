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
      <button class="icon-btn lab-theme" title="${UI.theme.en}" aria-label="${UI.theme.en}">🌓</button>
    </div></nav>`;
    $$('.lab-lang button').forEach(b => b.onclick = () => setLang(b.dataset.lang));
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
    host.outerHTML = `<footer class="lab-footer wrap">${pn}<p>${std}<span data-zh="${UI.note.zh}">${UI.note.en}</span></p></footer>`;
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
  function setLang(l){ Lab.lang = l; store.set('labLang', l); if (window.speechSynthesis) speechSynthesis.cancel(); Lab.applyLang(); }
  Lab.setLang = setLang;

  /* ---------- speech ---------- */
  Lab.speak = text => {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = Lab.lang === 'zh' ? 'zh-CN' : 'en-US'; u.rate = .95; speechSynthesis.speak(u);
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
    findTopic(); buildNav(); buildFooter();
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
