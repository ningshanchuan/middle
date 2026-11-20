/* Injected before every page script (Page.addScriptToEvaluateOnNewDocument). Captures every text the page would read
   aloud — through Lab.speak (shared/lab.js) and through direct speechSynthesis.speak (standalone pages, yuwen readers) —
   without playing anything. Results: window.__cap.t = [{key, lang, text, via, rate, src}] */
(() => {
  window.__labErr = [];
  addEventListener('error', e => __labErr.push(e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno));
  addEventListener('unhandledrejection', e => __labErr.push('promise: ' + (e.reason && e.reason.message || e.reason)));
  // must match Lab.speechNorm / Lab.speechKey in shared/lab.js exactly
  const norm = t => String(t == null ? '' : t).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const key = (n, lang) => { const s = lang + '|' + n; let h = 0x811c9dc5; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); };
  const C = window.__cap = { t: [], seen: new Set(), src: 'load', calls: 0, norm, key };
  C.add = (text, lang, via, rate, raw) => {
    C.calls++;
    const n = norm(String(text == null ? '' : text).replace(/<[^>]+>/g, '')); if (!n) return;
    const k = key(n, lang); if (C.seen.has(k)) return; C.seen.add(k);
    C.t.push(raw ? { key: k, lang, text: n, via, rate: rate || null, src: C.src, raw } : { key: k, lang, text: n, via, rate: rate || null, src: C.src });
  };
  // Lab.speak: trap the property on window.Lab so even calls made during page start-up are captured
  const capSpeak = (t, o = {}) => { try { const lg = o.lang || (window.Lab && Lab.lang) || 'en'; C.add(t, lg, 'lab', o.rate); const m = (!o.inner && window.Lab && Lab.mixFor) ? Lab.mixFor(norm(t), lg) : ''; if (m) C.add(m, lg, 'mix', o.rate); } catch(e){} return null; };   // a card's mix-up warning is its own clip (lab.js Lab.mixFor)
  let lab;
  try {
    Object.defineProperty(window, 'Lab', { configurable: true, get(){ return lab; }, set(v){
      lab = v;
      try { Object.defineProperty(v, 'speak', { configurable: true, get(){ return capSpeak; }, set(f){ C.realSpeak = f; } }); } catch(e){}
    } });
  } catch(e){}
  // direct speechSynthesis users: record, then report "end" at once so line-by-line readers keep going
  if (window.speechSynthesis){
    const ss = window.speechSynthesis;
    const capSS = u => {
      try { C.add(u.text, /^zh/i.test(u.lang || '') ? 'zh' : (/^en/i.test(u.lang || '') ? 'en' : ((window.Lab && Lab.lang) || 'en')), 'ss', u.rate); } catch(e){}
      setTimeout(() => { try { u.dispatchEvent(new Event('end')); } catch(e){} }, 0);
    };
    const noop = () => {};
    try { Object.defineProperty(ss, 'speak', { configurable: true, get(){ return capSS; }, set(){} }); } catch(e){}
    try { Object.defineProperty(ss, 'cancel', { configurable: true, get(){ return noop; }, set(){} }); } catch(e){}
  }
  // never load the recordings list here, so pages always go through speak paths we capture
  try { Object.defineProperty(window, 'LabAudioManifest', { configurable: true, get(){ return () => {}; }, set(){} }); } catch(e){}
  // MathAnim lessons: keep each lesson config (its narration steps are spoken through Lab.speak)
  window.__maCfgs = [];
  try {
    let ma;
    Object.defineProperty(window, 'MathAnim', { configurable: true, get(){ return ma; }, set(v){
      ma = v; let l;
      try { Object.defineProperty(v, 'lesson', { configurable: true, get(){ return l; }, set(f){ l = function(cfg){ try { window.__maCfgs.push(cfg); } catch(e){} return f.apply(this, arguments); }; } }); } catch(e){}
    } });
  } catch(e){}
  // keep the page here and quiet
  window.alert = window.confirm = window.prompt = () => null; window.open = () => null;
  addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href]'); if (a && !/^#/.test(a.getAttribute('href'))) e.preventDefault(); }, true);
  addEventListener('submit', e => e.preventDefault(), true);
  // 3D scenes render in software here: ~8 frames/s is plenty and leaves CPU for the other workers
  window.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 120);
  window.cancelAnimationFrame = id => clearTimeout(id);
})();
