/* MathAnim — a tiny animation engine for intuitive, step-by-step math explainers (classic script, no build step).
   Dark canvas, smooth eased tweens, stroke "draw-on", morphs, number lines, axes, function graphs, HTML/KaTeX labels.
   ------------------------------------------------------------------------------------------------------------------
   const S = MathAnim.scene('#cv', { x:[-8,8], y:[-4.5,4.5] });          // world coordinates (y up)
   const a = S.line(-3,0,3,0,{color:MathAnim.C.blue});  await S.create(a, 1);
   const c = S.circle(0,0,2,{color:MathAnim.C.yellow, fill:'rgba(255,209,102,.15)'}); await S.fadeIn(c);
   await S.to(c, {r:3, x:1}, 1.2);                                       // tween any numeric props (also arrays: points)
   const t = S.text({en:'area', zh:'面积'}, 0, 3, {size:.5});             // bilingual text (uses Lab.L)
   const L = S.tex('a^2+b^2=c^2', 0, -3, {size:28});                       // KaTeX label positioned in world coords
   await S.wait(.5);  await S.all([S.fadeOut(a), S.to(c,{opacity:.3})]);
   S.onFrame((dt,t) => {...}) for live/interactive drawing; S.clear() removes everything.
   Lesson player (steps with narration, Prev/Next/Replay/Play-all, speed, read-aloud):
   MathAnim.lesson({ el:'#lesson', scene:S, steps:[ {en:'… $x^2$ …', zh:'…', run: async S => {...}} ] });
   Each step's run() must create/animate everything it needs ON TOP OF the state left by previous steps;
   jumping to step i replays steps 0..i-1 instantly, so runs must be deterministic.                          */
(function(){
  const MA = window.MathAnim = {};
  MA.C = { bg:'#0f1420', blue:'#58c4dd', teal:'#5cd0b3', green:'#83c167', yellow:'#ffd166', gold:'#f0b44c', orange:'#ff9f43',
           red:'#fc6255', pink:'#f67fb3', purple:'#b48ef0', white:'#ece6e2', grey:'#8a93a6', dim:'#3a4256' };
  MA.ease = {
    linear: t => t,
    smooth: t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2,       // cubic in-out (default)
    out: t => 1 - Math.pow(1 - t, 3),
    in: t => t*t*t,
    back: t => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };
  const Abort = MA.Abort = function(){ this.abort = true; };
  // jumping between steps cancels running tweens; never report those cancellations as errors
  window.addEventListener('unhandledrejection', e => { if (e.reason instanceof Abort) e.preventDefault(); });
  const L = o => (window.Lab ? Lab.L(o) : (o && typeof o === 'object' ? (o.en ?? '') : String(o ?? '')));
  const lerp = (a, b, t) => a + (b - a) * t;
  function lerpVal(a, b, t){
    if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, t);
    if (Array.isArray(a) && Array.isArray(b)){
      const n = Math.max(a.length, b.length), out = [];
      for (let i = 0; i < n; i++) out.push(lerpVal(a[Math.min(i, a.length - 1)], b[Math.min(i, b.length - 1)], t));
      return out;
    }
    if (typeof a === 'string' && typeof b === 'string' && a[0] === '#' && b[0] === '#') return mixHex(a, b, t);
    return t < 1 ? a : b;
  }
  function hex2rgb(h){ h = h.replace('#',''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mixHex(a, b, t){ const A = hex2rgb(a), B = hex2rgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); }
  MA.mix = mixHex;
  function clone(v){ return Array.isArray(v) ? v.map(clone) : v; }

  /* ---------- KaTeX helper ---------- */
  MA.tex = (tex, display) => {
    if (window.katex){ try { return katex.renderToString(tex, { throwOnError:false, displayMode:!!display }); } catch(e){} }
    return '<span style="font-style:italic;font-family:Cambria Math,Times New Roman,serif">' + tex.replace(/[{}\\]/g, '') + '</span>';
  };
  /* render text containing $inline math$ and $$display math$$ */
  // text is escaped, then a small safe set of formatting tags is allowed back: <b> <i> <em> <strong> <u> <br> <sub> <sup>
  const SAFE = /&lt;(\/?)(b|i|em|strong|u|br|sub|sup)\s*\/?&gt;/gi;
  MA.rich = s => String(s).split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g).map(p => p.startsWith('$$') ? MA.tex(p.slice(2, -2), true) : p.startsWith('$') ? MA.tex(p.slice(1, -1)) : p.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(SAFE, '<$1$2>')).join('');

  /* ---------- scene ---------- */
  MA.scene = (el, o = {}) => {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    let cv = el.tagName === 'CANVAS' ? el : el.querySelector('canvas');
    if (!cv){ cv = document.createElement('canvas'); el.appendChild(cv); }
    const host = cv.parentElement; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const ctx = cv.getContext('2d');
    const S = { el:host, cv, ctx, objects:[], frames:[], speed:1, paused:false, instant:false, gen:0, bg:o.bg || MA.C.bg,
                xr:o.x || [-8, 8], yr:o.y || [-4.5, 4.5], W:0, H:0, k:1, ox:0, oy:0 };
    function resize(){
      const r = host.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      S.W = r.width; S.H = r.height || r.width * 9 / 16; cv.width = S.W * d; cv.height = S.H * d;
      cv.style.width = S.W + 'px'; cv.style.height = S.H + 'px'; ctx.setTransform(d, 0, 0, d, 0, 0);
      const xs = S.xr[1] - S.xr[0], ys = S.yr[1] - S.yr[0];
      S.k = Math.min(S.W / xs, S.H / ys); S.ox = S.W / 2 - (S.xr[0] + xs / 2) * S.k; S.oy = S.H / 2 + (S.yr[0] + ys / 2) * S.k;
    }
    new ResizeObserver(resize).observe(host); resize();
    S.setView = (x, y) => { S.xr = x; S.yr = y; resize(); };
    S.sx = x => S.ox + x * S.k;  S.sy = y => S.oy - y * S.k;          // world → screen
    S.wx = px => (px - S.ox) / S.k; S.wy = py => (S.oy - py) / S.k;   // screen → world
    S.px = v => v * S.k;                                              // world length → px

    /* ----- object model ----- */
    const base = (type, props) => Object.assign({ type, x:0, y:0, opacity:1, draw:1, scale:1, rot:0, color:MA.C.white, width:3, fill:null, dash:null, z:0, visible:true }, props);
    S.add = obj => { S.objects.push(obj); return obj; };
    S.remove = (...objs) => { objs.flat().forEach(ob => { const i = S.objects.indexOf(ob); if (i >= 0) S.objects.splice(i, 1); if (ob && ob.dom) ob.dom.remove(); if (ob && ob.children) S.remove(ob.children); }); };
    S.clear = () => { S.objects.slice().forEach(ob => S.remove(ob)); };
    const mk = (type, props, opts) => S.add(base(type, Object.assign(props, opts || {})));
    S.line   = (x1, y1, x2, y2, o) => mk('line', { pts:[[x1, y1], [x2, y2]] }, o);
    S.arrow  = (x1, y1, x2, y2, o) => mk('line', { pts:[[x1, y1], [x2, y2]], head:.25 }, o);
    S.path   = (pts, o) => mk('line', { pts }, o);
    S.poly   = (pts, o) => mk('line', { pts, closed:true }, o);
    S.rect   = (x, y, w, h, o) => mk('line', { pts:[[x, y], [x + w, y], [x + w, y + h], [x, y + h]], closed:true }, o);
    S.circle = (x, y, r, o) => mk('circle', { x, y, r, a0:0, a1:Math.PI * 2 }, o);
    S.arc    = (x, y, r, a0, a1, o) => mk('circle', { x, y, r, a0, a1, open:true }, o);
    S.sector = (x, y, r, a0, a1, o) => mk('circle', { x, y, r, a0, a1, sector:true }, o);
    S.dot    = (x, y, o) => mk('dot', { x, y, r:.09, fill:(o && o.color) || MA.C.white }, o);
    S.text   = (txt, x, y, o) => mk('text', { txt, x, y, size:.42, align:'center', baseline:'middle', weight:700, font:'Nunito, "PingFang SC", "Microsoft YaHei", sans-serif' }, o);
    S.graph  = (fn, o) => mk('graph', { fn, x0:S.xr[0], x1:S.xr[1], samples:300 }, o);
    S.custom = (drawFn, o) => mk('custom', { drawFn }, o);              // drawFn(ctx, S, obj)
    S.group  = (children, o) => { const g = mk('group', { children }, o); children.forEach(c => { const i = S.objects.indexOf(c); if (i >= 0) S.objects.splice(i, 1); }); return g; };
    S.tex    = (tex, x, y, o = {}) => {                                 // HTML/KaTeX overlay label
      const d = document.createElement('div'); d.className = 'ma-label'; d.style.display = 'none'; host.appendChild(d);   // shown once positioned
      const ob = mk('tex', { tex, x, y, size:o.size || 26, dom:d, html:!!o.html, anchor:o.anchor || 'center' }, o);
      ob.set = t => { ob.tex = t; render(ob); }; render(ob); return ob;
    };
    function render(ob){ const t = typeof ob.tex === 'object' ? L(ob.tex) : ob.tex; ob.dom.innerHTML = ob.html ? MA.rich(t) : MA.tex(t); ob._rendered = t; }
    if (window.Lab) Lab.onLang(() => S.objects.forEach(ob => { if (ob.type === 'tex' && typeof ob.tex === 'object') render(ob); }));

    S.axes = (o = {}) => {                                              // axes with ticks + numbers, returns a group
      const x = o.x || S.xr, y = o.y || S.yr, st = o.step || 1, ch = [];
      if (o.grid) for (let v = Math.ceil(x[0]); v <= x[1]; v += st) ch.push(base('line', { pts:[[v, y[0]], [v, y[1]]], color:MA.C.dim, width:1 }));
      if (o.grid) for (let v = Math.ceil(y[0]); v <= y[1]; v += st) ch.push(base('line', { pts:[[x[0], v], [x[1], v]], color:MA.C.dim, width:1 }));
      ch.push(base('line', { pts:[[x[0], 0], [x[1], 0]], color:o.color || MA.C.grey, width:2, head:.2 }));
      ch.push(base('line', { pts:[[0, y[0]], [0, y[1]]], color:o.color || MA.C.grey, width:2, head:.2 }));
      if (o.numbers !== false){
        for (let v = Math.ceil(x[0] / st) * st; v < x[1]; v += st) if (Math.abs(v) > 1e-9){ ch.push(base('line', { pts:[[v, -.08], [v, .08]], color:MA.C.grey, width:2 })); ch.push(base('text', { txt:String(+v.toFixed(2)), x:v, y:-.4, size:.3, color:MA.C.grey, align:'center', baseline:'middle', weight:600, font:'Nunito, sans-serif' })); }
        for (let v = Math.ceil(y[0] / st) * st; v < y[1]; v += st) if (Math.abs(v) > 1e-9){ ch.push(base('line', { pts:[[-.08, v], [.08, v]], color:MA.C.grey, width:2 })); ch.push(base('text', { txt:String(+v.toFixed(2)), x:-.35, y:v, size:.3, color:MA.C.grey, align:'right', baseline:'middle', weight:600, font:'Nunito, sans-serif' })); }
      }
      return mk('group', { children:ch }, o.opts);
    };
    S.numberLine = (a, b, o = {}) => {                                  // horizontal number line at height y
      const y = o.y || 0, st = o.step || 1, ch = [base('line', { pts:[[a - .4, y], [b + .4, y]], color:o.color || MA.C.grey, width:2.5, head:.2 })];
      for (let v = a; v <= b + 1e-9; v += st){ ch.push(base('line', { pts:[[v, y - .14], [v, y + .14]], color:o.color || MA.C.grey, width:2 })); if (o.numbers !== false) ch.push(base('text', { txt:o.fmt ? o.fmt(v) : String(+v.toFixed(3)), x:v, y:y - .5, size:o.size || .32, color:MA.C.white, align:'center', baseline:'middle', weight:700, font:'Nunito, sans-serif' })); }
      return mk('group', { children:ch }, o.opts);
    };

    /* ----- drawing ----- */
    function colorA(c, a){ if (!c) return c; if (c[0] === '#'){ const [r, g, b] = hex2rgb(c); return `rgba(${r},${g},${b},${a})`; } return c; }
    function strokePts(pts, closed, frac){
      const P = closed ? pts.concat([pts[0]]) : pts; let total = 0; const seg = [];
      for (let i = 1; i < P.length; i++){ const d = Math.hypot(S.px(P[i][0] - P[i - 1][0]), S.px(P[i][1] - P[i - 1][1])); seg.push(d); total += d; }
      let left = total * frac; ctx.beginPath(); ctx.moveTo(S.sx(P[0][0]), S.sy(P[0][1])); let end = P[0];
      for (let i = 1; i < P.length && left > 0; i++){
        const t = Math.min(1, left / (seg[i - 1] || 1)); end = [lerp(P[i - 1][0], P[i][0], t), lerp(P[i - 1][1], P[i][1], t)];
        ctx.lineTo(S.sx(end[0]), S.sy(end[1])); left -= seg[i - 1]; }
      return { end, prev:P[Math.max(0, P.length - 2)], total };
    }
    function drawObj(ob, pa){
      const a = ob.opacity * pa;
      if (!ob.visible || a <= .002){ if (ob.type === 'tex' && ob.dom) ob.dom.style.display = 'none';   // never leave an invisible label stranded
        else if (ob.type === 'group') ob.children.forEach(c => { if (c.type === 'tex' && c.dom) c.dom.style.display = 'none'; });
        return; }
      ctx.save(); ctx.globalAlpha = a;
      if (ob.rot || ob.scale !== 1 || ob.tx || ob.ty){
        const cx = S.sx(ob.ox ?? 0), cy = S.sy(ob.oy ?? 0); ctx.translate(cx + S.px(ob.tx || 0), cy - S.px(ob.ty || 0)); ctx.rotate(-(ob.rot || 0)); ctx.scale(ob.scale, ob.scale); ctx.translate(-cx, -cy);
      }
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = ob.width; ctx.strokeStyle = ob.color; if (ob.dash) ctx.setLineDash(ob.dash); else ctx.setLineDash([]);
      if (ob.type === 'line'){
        const pts = ob.pts.map(p => [p[0] + ob.x, p[1] + ob.y]);
        if (ob.fill && ob.closed){ ctx.save(); ctx.globalAlpha = a * Math.min(1, ob.draw * 1.3); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(S.sx(p[0]), S.sy(p[1])) : ctx.moveTo(S.sx(p[0]), S.sy(p[1]))); ctx.closePath(); ctx.fillStyle = ob.fill; ctx.fill(); ctx.restore(); }
        if (ob.width > 0 && ob.color){ const r = strokePts(pts, ob.closed, ob.draw); ctx.stroke();
          if (ob.head && ob.draw > .02){ const [ex, ey] = r.end, ang = Math.atan2(ey - (ob.draw < 1 ? pts[0][1] : r.prev[1]), ex - (ob.draw < 1 ? pts[0][0] : r.prev[0])), h = ob.head;
            ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(S.sx(ex), S.sy(ey)); ctx.lineTo(S.sx(ex - h * Math.cos(ang - .45)), S.sy(ey - h * Math.sin(ang - .45))); ctx.lineTo(S.sx(ex - h * Math.cos(ang + .45)), S.sy(ey - h * Math.sin(ang + .45))); ctx.closePath(); ctx.fillStyle = ob.color; ctx.fill(); } }
      } else if (ob.type === 'circle'){
        const a1 = ob.a0 + (ob.a1 - ob.a0) * ob.draw; ctx.beginPath();
        if (ob.sector) ctx.moveTo(S.sx(ob.x), S.sy(ob.y));
        ctx.arc(S.sx(ob.x), S.sy(ob.y), Math.max(0, S.px(ob.r)), -ob.a0, -a1, true);
        if (ob.sector) ctx.closePath();
        if (ob.fill && !ob.open){ ctx.fillStyle = ob.fill; ctx.fill(); }
        if (ob.width > 0 && ob.color) ctx.stroke();
      } else if (ob.type === 'dot'){
        ctx.beginPath(); ctx.arc(S.sx(ob.x), S.sy(ob.y), S.px(ob.r) * Math.max(.0001, ob.draw), 0, Math.PI * 2); ctx.fillStyle = ob.fill || ob.color; ctx.fill();
      } else if (ob.type === 'text'){
        const s = typeof ob.txt === 'function' ? ob.txt() : L(ob.txt);
        ctx.font = `${ob.italic ? 'italic ' : ''}${ob.weight} ${S.px(ob.size)}px ${ob.font}`; ctx.textAlign = ob.align; ctx.textBaseline = ob.baseline;
        ctx.fillStyle = ob.fill || ob.color; ctx.fillText(ob.draw < 1 ? s.slice(0, Math.ceil(s.length * ob.draw)) : s, S.sx(ob.x), S.sy(ob.y));
      } else if (ob.type === 'graph'){
        ctx.beginPath(); let started = false; const xe = lerp(ob.x0, ob.x1, ob.draw);
        for (let i = 0; i <= ob.samples; i++){ const xv = lerp(ob.x0, xe, i / ob.samples), yv = ob.fn(xv);
          if (!isFinite(yv) || Math.abs(yv) > 1e4){ started = false; continue; }
          const px = S.sx(xv), py = S.sy(yv); started ? ctx.lineTo(px, py) : ctx.moveTo(px, py); started = true; }
        ctx.stroke();
      } else if (ob.type === 'custom'){ ob.drawFn(ctx, S, ob); }
      else if (ob.type === 'group'){ ob.children.forEach(c => drawObj(c, a)); }
      ctx.restore();
      if (ob.type === 'tex'){
        const d = ob.dom; d.style.opacity = a; d.style.display = a <= .01 || !ob.visible ? 'none' : '';
        d.style.left = (S.sx(ob.x + (ob.tx || 0))) + 'px'; d.style.top = (S.sy(ob.y + (ob.ty || 0))) + 'px'; d.style.fontSize = (ob.size * (ob.scale || 1) * Math.max(.6, Math.min(1.6, S.k / 60))) + 'px'; d.style.color = ob.color;
        d.style.transform = ob.anchor === 'left' ? 'translate(0,-50%)' : ob.anchor === 'right' ? 'translate(-100%,-50%)' : 'translate(-50%,-50%)';
      }
    }
    function drawAll(){
      ctx.fillStyle = S.bg; ctx.fillRect(0, 0, S.W, S.H);
      S.objects.slice().sort((a, b) => a.z - b.z).forEach(ob => drawObj(ob, 1));
      S.objects.forEach(ob => { if (ob.type === 'group') ob.children.forEach(c => { if (c.type === 'tex') drawObj(c, ob.opacity); }); });
    }

    /* ----- animation ----- */
    const tweens = [];
    S.onFrame = fn => S.frames.push(fn);
    S.offFrame = fn => { const i = S.frames.indexOf(fn); if (i >= 0) S.frames.splice(i, 1); };
    const check = g => { if (g !== S.gen) throw new Abort(); };
    S.tween = (fn, dur = 1, ease = MA.ease.smooth) => {                // fn(eased t in 0..1)
      const g = S.gen; check(g);
      if (S.instant || dur <= 0){ fn(1); return Promise.resolve(); }
      return new Promise((res, rej) => tweens.push({ fn, dur, ease, t:0, g, res, rej }));
    };
    S.to = (ob, props, dur = 1, ease) => {
      const from = {}; for (const k in props) from[k] = clone(ob[k] ?? (k === 'opacity' || k === 'scale' ? 1 : 0));
      return S.tween(t => { for (const k in props) ob[k] = lerpVal(from[k], props[k], t); }, dur, ease);
    };
    S.create  = (ob, dur = 1, ease) => { ob.draw = 0; ob.opacity = ob.opacity || 1; return S.to(ob, { draw:1 }, dur, ease || MA.ease.smooth); };
    S.uncreate= (ob, dur = .8) => S.to(ob, { draw:0 }, dur).then(() => S.remove(ob));
    S.fadeIn  = (ob, dur = .7, ease) => { const op = ob._op ?? 1; ob.opacity = 0; return S.to(ob, { opacity:op }, dur, ease); };
    S.fadeOut = (ob, dur = .6, keep) => S.to(ob, { opacity:0 }, dur).then(() => { if (!keep) S.remove(ob); });
    S.pop     = (ob, dur = .5) => { ob.scale = 0; ob.ox = ob.ox ?? ob.x; ob.oy = ob.oy ?? ob.y; return S.to(ob, { scale:1 }, dur, MA.ease.back); };
    S.flash   = async (ob, color = MA.C.yellow, dur = .6) => { const c0 = ob.color; await S.to(ob, { color, width:(ob.width || 3) * 1.8 }, dur / 2); await S.to(ob, { color:c0, width:ob.width / 1.8 }, dur / 2); };
    S.wait    = (sec = 1) => S.tween(() => {}, sec, MA.ease.linear);
    S.all     = arr => Promise.all(arr);
    S.reset   = () => { S.gen++; tweens.splice(0).forEach(tw => tw.rej(new Abort())); S.clear(); };

    let last = performance.now();
    function loop(){
      requestAnimationFrame(loop);
      const now = performance.now(), dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now;
      if (!S.paused){
        for (const tw of tweens.slice()){
          if (tw.g !== S.gen){ tweens.splice(tweens.indexOf(tw), 1); tw.rej(new Abort()); continue; }
          tw.t = Math.min(1, tw.t + dt * S.speed / tw.dur); tw.fn(tw.ease(tw.t));
          if (tw.t >= 1){ tweens.splice(tweens.indexOf(tw), 1); tw.res(); }
        }
        S.frames.forEach(f => f(dt * S.speed, now / 1000));
      }
      drawAll();
    }
    requestAnimationFrame(loop);
    return S;
  };

  /* ---------- lesson player ---------- */
  // A narration step as it is read aloud: the $...$ TeX parts in words of the narration's language (Chinese: 乘, 除以,
  // b分之a, 的n次方 …). The read-aloud crawler (tools/tts/drive.js) calls this too, so the recorded text matches.
  const TEXW = {
    zh: { '\\times':'乘', '\\cdot':'乘', '\\div':'除以', '\\pm':'正负', '\\mp':'负正', '\\le':'小于等于', '\\leq':'小于等于', '\\ge':'大于等于', '\\geq':'大于等于',
          '\\neq':'不等于', '\\ne':'不等于', '\\approx':'约等于', '\\pi':'π', '\\degree':'度', '\\circ':'度', '\\infty':'无穷大', '\\%':'%' },
    en: { '\\times':'times', '\\cdot':'times', '\\div':'divided by', '\\pm':'plus or minus', '\\mp':'minus or plus', '\\le':'is less than or equal to', '\\leq':'is less than or equal to',
          '\\ge':'is greater than or equal to', '\\geq':'is greater than or equal to', '\\neq':'is not equal to', '\\ne':'is not equal to', '\\approx':'is about', '\\pi':'pi',
          '\\degree':'degrees', '\\circ':'degrees', '\\infty':'infinity', '\\%':'%' } };
  const texWords = (t, zh) => {
    const W = zh ? TEXW.zh : TEXW.en; let x = String(t);
    for (let k = 0; k < 3; k++){   // nested fractions / roots, inside out
      x = x.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, (m, a, b) => zh ? `${b.trim()}分之${a.trim()}` : `${a.trim()} over ${b.trim()}`);
      x = x.replace(/\\sqrt\s*\{([^{}]*)\}/g, (m, a) => zh ? `根号${a.trim()}` : `the square root of ${a.trim()}`);
    }
    x = x.replace(/\^\s*(?:\{([^{}]*)\}|([0-9a-zA-Z]))/g, (m, a, b) => { const n = (a != null ? a : b).trim().replace(/^-\s*/, zh ? '负' : 'negative ');
      return zh ? (n === '2' ? '的平方' : n === '3' ? '的立方' : `的${n}次方`) : (n === '2' ? ' squared' : n === '3' ? ' cubed' : ` to the power of ${n}`); });
    x = x.replace(/\\(left|right|,|;|!|quad|qquad|text|mathrm|mathbf)\b/g, ' ').replace(/\\[a-zA-Z]+|\\%/g, c => W[c] != null ? ` ${W[c]} ` : ' ');
    // signs inside the formula: subtraction (a minus after a number, letter or closing bracket) first, then a negative number, plus and equals
    x = x.replace(/(?<=[0-9a-zA-Z)\]])\s*-\s*(?=[0-9a-zA-Z(])/g, zh ? ' 减 ' : ' minus ');
    x = x.replace(/(^|[\s(\[=+,])-\s*(?=[0-9a-zA-Z(])/g, (m, p) => p + (zh ? '负' : 'negative '));
    x = x.replace(/\s*=\s*/g, zh ? ' 等于 ' : ' equals ').replace(/\s*\+\s*/g, zh ? ' 加 ' : ' plus ');
    return ' ' + x.replace(/[{}_\\]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  };
  MA.spoken = (text, zh) => String(text).replace(/\$\$?([^$]+)\$\$?/g, (m, t) => texWords(t, zh));
  MA.lesson = cfg => {
    const el = typeof cfg.el === 'string' ? document.querySelector(cfg.el) : cfg.el, S = cfg.scene, steps = cfg.steps;
    const zh = () => window.Lab && Lab.lang === 'zh';
    const bar = document.createElement('div'); bar.className = 'ma-player';
    const nar = document.createElement('div'); nar.className = 'ma-narration';
    el.appendChild(nar); el.appendChild(bar);
    const st = { i:-1, running:false, autoplay:false, voice:false };
    function T(en, z){ return zh() ? z : en; }
    function renderBar(){
      bar.innerHTML = `<button data-a="prev" title="${T('Previous step','上一步')}">⏮</button>
        <button data-a="play" class="main">${st.autoplay ? '⏸ ' + T('Pause','暂停') : '▶ ' + T(st.i < 0 ? 'Start' : 'Play all', st.i < 0 ? '开始' : '连续播放')}</button>
        <button data-a="next" title="${T('Next step','下一步')}">⏭</button>
        <button data-a="replay" title="${T('Replay step','重播本步')}">↺</button>
        <div class="ma-dots">${steps.map((_, k) => `<i data-k="${k}" class="${k === st.i ? 'on' : k < st.i ? 'done' : ''}"></i>`).join('')}</div>
        <select data-a="speed" title="${T('Speed','速度')}">${[.5, .75, 1, 1.5, 2].map(v => `<option value="${v}" ${S.speed === v ? 'selected' : ''}>${v}×</option>`).join('')}</select>
        <button data-a="voice" class="${st.voice ? 'on' : ''}" title="${T('Read narration aloud','朗读旁白')}">🔊</button>`;
      bar.querySelectorAll('button').forEach(b => b.onclick = () => act(b.dataset.a));
      bar.querySelector('select').onchange = e => S.speed = +e.target.value;
      bar.querySelectorAll('.ma-dots i').forEach(d => d.onclick = () => go(+d.dataset.k));
    }
    function renderNar(){
      if (st.i < 0){ nar.innerHTML = MA.rich(L(cfg.intro || { en:'Press ▶ Start to begin the animated lesson.', zh:'点击 ▶ 开始,播放动画讲解。' })); return; }
      const s = steps[st.i]; nar.innerHTML = `<span class="ma-step">${st.i + 1}/${steps.length}</span>` + MA.rich(L(s));
    }
    function speak(){ if (!st.voice || !window.speechSynthesis || st.i < 0) return; speechSynthesis.cancel();
      const txt = MA.spoken(L(steps[st.i]), zh());
      if (window.Lab && Lab.speak){ Lab.speak(txt, { lang: zh() ? 'zh' : 'en', rate: .95 * Math.min(1.3, S.speed) }); return; }   // best available voice
      const u = new SpeechSynthesisUtterance(txt); u.lang = zh() ? 'zh-CN' : 'en-US'; u.rate = .95 * Math.min(1.3, S.speed); speechSynthesis.speak(u); }
    async function go(i){
      i = Math.max(0, Math.min(steps.length - 1, i));
      S.reset(); st.i = i; renderBar(); renderNar(); const g = S.gen;
      S.instant = true;
      try { for (let k = 0; k < i; k++){ if (steps[k].run) await steps[k].run(S); } } catch(e){ if (!(e instanceof Abort)) console.error(e); }
      S.instant = false; if (g !== S.gen) return;
      speak(); st.running = true;
      try { if (steps[i].run) await steps[i].run(S); } catch(e){ if (!(e instanceof Abort)){ console.error(e); setTimeout(() => { throw e; }); } return; }   // surface real bugs to error monitors
      st.running = false;
      // read-aloud on: wait until the step's narration has ended (and while it is paused) before moving on
      if (g === S.gen && st.autoplay && st.voice && window.Lab && Lab.whenSpoken) await Lab.whenSpoken();
      // after the LAST step's narration: read this lesson's "⚠️ mix-up" box once (a box in the player's section that is not part of a card)
      if (g === S.gen && i === steps.length - 1 && st.voice && window.Lab && Lab.whenSpoken && Lab.mixText){
        await Lab.whenSpoken();
        const scope = el.closest('section') || el, CARD = '.info,.card,.panel,.box,.detail,.sidebar';
        // its "💡 memory tip" box, then its "⚠️ mix-up" box (boxes of the player's section that are not part of a card)
        for (const sel of ['.memory', '.mix']){
          const box = [...scope.querySelectorAll(sel)].find(b => { if (!b.getClientRects().length) return false; const c = b.closest(CARD); return !c || !!c.querySelector('.ma-player,.ma-narration'); });
          const m = box ? Lab.mixText(box, zh() ? 'zh' : 'en') : '';
          if (!m || g !== S.gen || !st.voice) continue;
          await new Promise(r => setTimeout(r, 1000)); if (g !== S.gen || !st.voice) break;
          Lab.speak(m, { lang: zh() ? 'zh' : 'en', inner: true }); await new Promise(r => setTimeout(r, 300)); await Lab.whenSpoken();
        }
      }
      // pause before the next step (user rule): about 2.5 s after a narration, 1 s when read-aloud is off
      const rest = st.voice ? 2500 : 1000 / S.speed;
      if (g === S.gen && st.autoplay){ if (i < steps.length - 1){ await new Promise(r => setTimeout(r, rest)); if (g === S.gen && st.autoplay) go(i + 1); } else { st.autoplay = false; renderBar(); } }
      if (cfg.onStep) cfg.onStep(i);
    }
    function act(a){
      if (a === 'prev') go(st.i - 1);
      if (a === 'next') go(st.i + 1);
      if (a === 'replay') go(Math.max(0, st.i));
      if (a === 'play'){ st.autoplay = !st.autoplay; renderBar(); if (st.autoplay) go(st.i < 0 || st.i >= steps.length - 1 ? 0 : st.i + (st.running ? 0 : 1)); }
      if (a === 'voice'){ st.voice = !st.voice; renderBar(); if (!st.voice && window.speechSynthesis) speechSynthesis.cancel(); else speak(); }
    }
    if (window.Lab) Lab.onLang(() => { renderBar(); renderNar(); });
    renderBar(); renderNar();
    if (cfg.preview) { S.instant = true; Promise.resolve(cfg.preview(S)).catch(() => {}).finally(() => S.instant = false); }
    return { go, get index(){ return st.i; } };
  };

  /* ---------- styles ---------- */
  const css = `
.ma-stage{position:relative;aspect-ratio:16/9;width:100%;background:${MA.C.bg};border-radius:20px;overflow:hidden;box-shadow:0 14px 40px rgba(5,10,25,.35)}
.ma-stage canvas{position:absolute;inset:0;display:block}
.ma-stage.lab-fs-active{aspect-ratio:auto}
.ma-label{position:absolute;pointer-events:none;white-space:nowrap;color:${MA.C.white};text-shadow:0 1px 6px rgba(0,0,0,.5)}
.ma-label .katex{font-size:1em}
.ma-narration{margin-top:14px;font-size:clamp(17px,1.9vw,20px);line-height:1.6;min-height:64px;padding:14px 18px;background:var(--surface,#fff);border:1px solid var(--line,#d9e2ee);border-radius:16px}
.ma-narration .ma-step{display:inline-block;font-family:Fredoka,sans-serif;font-weight:700;font-size:13px;color:var(--brand,#3b6fd6);background:color-mix(in srgb,var(--brand,#3b6fd6) 14%,transparent);border-radius:999px;padding:2px 9px;margin-right:10px;vertical-align:2px}
.ma-player{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px}
.ma-player button,.ma-player select{border:1px solid var(--line,#d9e2ee);background:var(--surface,#fff);color:var(--ink,#14213d);border-radius:12px;padding:8px 12px;font:inherit;font-weight:800;font-size:15px;cursor:pointer}
.ma-player button.main{background:var(--brand,#3b6fd6);color:#fff;border-color:transparent;min-width:120px}
.ma-player button.on{background:var(--ink,#14213d);color:var(--surface,#fff)}
.ma-dots{display:flex;gap:6px;flex:1;min-width:120px;flex-wrap:wrap}
.ma-dots i{width:14px;height:14px;border-radius:50%;background:var(--line,#d9e2ee);cursor:pointer;transition:transform .15s}
.ma-dots i.done{background:color-mix(in srgb,var(--brand,#3b6fd6) 45%,transparent)}
.ma-dots i.on{background:var(--brand,#3b6fd6);transform:scale(1.3)}
.ma-explore{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:18px;align-items:start}
.ma-explore .ctl{padding:20px;display:flex;flex-direction:column;gap:14px}
.ma-big{font-family:Fredoka,sans-serif;font-size:clamp(22px,3vw,30px);text-align:center;padding:10px;border-radius:14px;background:var(--surface-2,#eef3f9)}
@media (max-width:980px){.ma-explore{grid-template-columns:1fr}}`;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();
