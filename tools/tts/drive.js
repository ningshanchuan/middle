/* Run once after the page has loaded (needs pre.js). Clicks through the lesson — info-panel prev/next, chips, cards,
   tabs, story/next buttons, sliders, drop-downs — and presses every visible 🔊 button after each change.
   window.__col = progress; captured texts are in window.__cap.t. Time cap: window.__colMax seconds. */
(async () => {
  if (window.__col) return;
  const C = window.__col = { done: false, clicks: 0, rounds: 0, err: [], phase: 'start' };
  const CAP = window.__cap;
  if (!CAP){ C.err.push('no capture hooks'); C.done = true; return; }
  if (!window.Lab) C.err.push('no Lab (standalone page)');
  const L = o => window.Lab ? Lab.L(o) : (o && typeof o === 'object' ? (o.zh ?? o.en ?? '') : String(o == null ? '' : o));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const T0 = Date.now(), MAXMS = (window.__colMax || 45) * 1000, MAXCLICKS = 2500;
  const timeUp = () => Date.now() - T0 > MAXMS || C.clicks > MAXCLICKS;
  const vis = el => el.isConnected && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const BAD = '.lab-nav,#lab-nav,.lab-footer,#lab-footer,footer,.lab-vpanel,.ma-player,.lp-gallery,.lp-fig,.lp-card,.lp-view,.lp-3dbox,.lab-fs-btn,.quiz,.opts,.qnext,.sreset,.pool,.bins,iframe,video,audio';
  const txt = el => (el.textContent || '').replace(/\s+/g, ' ').trim();
  const isSpeaker = el => {
    if (el.closest('.lab-nav,#lab-nav,.lab-vpanel,.ma-player')) return false;
    const id = el.id || '', tx = txt(el).slice(0, 30), ti = (el.title || '') + (el.getAttribute('aria-label') || '');
    return el.matches('.speak,.say,[data-a=speak],[data-say],[data-speak],#say,#sRead') || /speak|Say$|^say|read/i.test(id) || /🔊|朗读|读一读|听一听|Read aloud|Listen/i.test(tx + ti);
  };
  const click = el => {
    try { if (el instanceof HTMLElement) el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); }
    catch(e){ if (C.err.length < 20) C.err.push('click: ' + e.message); }
    C.clicks++;
  };
  const speakAll = src => {
    CAP.src = src;
    for (const el of document.querySelectorAll('button,[role=button],.speak,.say,a,[data-say],[data-speak]')) if (isSpeaker(el) && vis(el)) click(el);
  };
  const sig = el => {
    const d = Object.keys(el.dataset || {}).filter(k => !/^(en|zh|enHtml|zhHtml|ready|on|state)$/.test(k)).map(k => k + '=' + el.dataset[k]).join(',');
    const cls = (el.getAttribute('class') || '').replace(/\b(on|sel|active|selected|cur|current|done|good|bad|badc|open|is-\w+)\b/g, '').replace(/\s+/g, ' ').trim();
    let path = '', p = el.parentElement, k = 0; while (p && k < 3){ path = (p.id ? '#' + p.id : p.tagName) + '>' + path; p = p.parentElement; k++; }
    return path + el.tagName + '#' + (el.id || '') + '.' + cls + '[' + d + ']' + (d || el.id ? '' : txt(el).slice(0, 40));
  };
  const SEL = 'button,[role=button],[role=tab],[data-k],[data-key],[data-id],[data-i],[data-n],[data-idx],[data-step],[data-tab],[data-t],[data-p],[data-sel],[data-part],[data-name],[data-go],.chip,.tab,.pill,.card,summary,[onclick],[tabindex]';
  const NOPE = /全屏|⤢|fullscreen|下载|download|打印|print|重置|reset|再来|重新开始|restart|play again|清空|clear/i;
  const candidates = () => {
    const set = new Set(document.querySelectorAll(SEL));
    const all = document.body.querySelectorAll('*');   // delegated handlers: the outermost element styled cursor:pointer
    if (all.length < 15000) for (const el of all){ if (el.closest(BAD)) continue; if (getComputedStyle(el).cursor === 'pointer'){ const par = el.parentElement; if (!par || getComputedStyle(par).cursor !== 'pointer') set.add(el); } }
    return [...set].filter(el => {
      if (el.closest(BAD) || isSpeaker(el) || !vis(el)) return false;
      const a = el.closest('a[href]'); if (a && !/^#/.test(a.getAttribute('href'))) return false;
      if (el.matches('input,select,textarea,option,canvas,label,body,html') || el.closest('select')) return false;
      if (el.disabled) return false;
      if (NOPE.test(txt(el).slice(0, 24) + (el.title || ''))) return false;
      return true;
    });
  };
  const nextLike = el => { const t = txt(el).slice(0, 24) + ' ' + (el.title || ''), id = el.id || ''; return !/prev|上一|◀|‹|←|back|返回/i.test(t + id) && (/next|下一|▶|›|→|继续|翻页|开始/i.test(t) || /next|fwd|forward/i.test(id)); };
  const clicked = new Set();
  const settle = () => sleep(35);
  try {
    // 1. MathAnim narration (mathanim.js speaks each step through Lab.speak when its 🔊 is on) — same text transform as mathanim.js
    C.phase = 'mathanim'; CAP.src = 'mathanim';
    for (const cfg of (window.__maCfgs || [])){
      try {
        const zh = window.Lab ? Lab.lang === 'zh' : true;
        for (const s of cfg.steps || []){
          const t = L(s).replace(/\$\$?([^$]+)\$\$?/g, (m, t) => t.replace(/\\(frac|cdot|times)/g, m2 => ({ '\\frac':' over ', '\\cdot':' times ', '\\times':' times ' }[m2])).replace(/[{}\\^_]/g, ' '));
          CAP.add(t, zh ? 'zh' : 'en', 'mathanim', .95, L(s));   // raw step text (with TeX) lets gen.ps1 read the maths properly
        }
      } catch(e){ C.err.push('ma: ' + e.message); }
    }
    C.phase = 'initial'; speakAll('initial'); await settle();
    // 2. sliders and drop-downs
    C.phase = 'inputs'; const inputsUp = () => timeUp() || Date.now() - T0 > MAXMS * 0.35;   // leave most of the time for clicking
    for (const inp of [...document.querySelectorAll('input[type=range],select')].filter(el => vis(el) && !el.closest('.lab-nav,#lab-nav,.lab-vpanel,.ma-player,.lp-gallery'))){
      if (inputsUp()) break;
      const orig = inp.value; let vals = [];
      if (inp.tagName === 'SELECT') vals = [...inp.options].map(o => o.value).slice(0, 80);
      else { const mn = inp.min === '' ? 0 : +inp.min, mx = inp.max === '' ? 100 : +inp.max, st = +inp.step || 1, n = Math.max(1, Math.round((mx - mn) / st)), k = Math.min(n, 16); for (let i = 0; i <= k; i++) vals.push(String(+(mn + Math.round(i * n / k) * st).toFixed(6))); }
      for (const v of vals){ if (inputsUp()) break; inp.value = v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); await sleep(15); speakAll('input'); }
      inp.value = orig; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
    // 3. click everything clickable, round after round (new things appear after tabs / steps open)
    C.phase = 'explore'; if (window.__colLite) C.err.push('lite mode: explore phase skipped (page hung on the first try)');
    for (let round = 0; round < (window.__colLite ? 0 : 14) && !timeUp(); round++){
      C.rounds = round + 1;
      const list = candidates().filter(el => !clicked.has(sig(el)));
      if (!list.length) break;
      for (let el of list){
        if (timeUp()) break;
        if (!el.isConnected || !vis(el)) continue;          // re-rendered: picked up again next round (its signature is not marked yet)
        const s = sig(el); if (clicked.has(s)) continue;
        clicked.add(s);
        click(el); await settle(); speakAll('click');
        if (nextLike(el)){
          let still = 0;
          for (let k = 0; k < 150 && still < 4 && !timeUp(); k++){
            const before = CAP.t.length;
            if (!el.isConnected || !vis(el)){ el = candidates().find(x => sig(x) === s); if (!el) break; }
            click(el); await settle(); speakAll('next');
            still = CAP.t.length === before ? still + 1 : 0;
          }
        }
      }
    }
  } catch(e){ C.err.push('driver: ' + e.message); }
  C.phase = 'done'; C.done = true; C.ms = Date.now() - T0;
})();
