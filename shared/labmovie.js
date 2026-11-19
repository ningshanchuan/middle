/* LabMovie — our own narrated animations that play like a short video (canvas scenes + bilingual captions + the site's read-aloud voice).
   Use it when no real video explains an idea well enough: a 45–120 s "explainer" made of 5–10 scenes.
   ------------------------------------------------------------------------------------------------------------
   <div id="movie1"></div>
   LabMovie.create('#movie1', {
     title:{en:'How oxygen reaches your cells', zh:'氧气怎样到达细胞'},
     scenes:[
       { dur:7,                                           // seconds (the scene also waits until its narration has finished)
         cap:{en:'You breathe in. Air rushes down into millions of tiny sacs called alveoli.', zh:'你吸气，空气冲进成千上万个叫“肺泡”的小囊里。'},
         draw:(g, p, W, H, M) => { … }                    // p = 0…1 progress through this scene; W×H canvas size in CSS px (16:9);
       }, …                                               // M = helpers: M.t (seconds into scene), M.ease(x), M.lerp(a,b,x), M.text(str,x,y,{s,c,a,w}), M.css('--brand')
     ],
     poster:{en:'▶ Watch the 1-minute animation', zh:'▶ 看 1 分钟动画'}   // optional label on the start screen
   });
   Controls: big ▶ / ⏸, a scene timeline you can tap (jump to any scene), ⟲ replay, CC captions (always on), 🔊 narration on/off
   (default on: each caption is read with Lab.speak, so it uses the pre-recorded OpenAI voice when one exists), fullscreen ⤢.
   Nothing autoplays. Draw only with the canvas (no DOM in scenes); use the site's CSS colours via M.css() so dark mode works.
   The TTS collector records every caption automatically (window.__cap hook below). */
(function(){
  if (window.LabMovie) return;
  const LMV = window.LabMovie = {};
  const L = o => window.Lab ? Lab.L(o) : (o && o.en) || '';
  const T = (en, zh) => ({ en, zh });
  const UI = { play:T('Play', '播放'), pause:T('Pause', '暂停'), replay:T('Replay', '重播'), voice:T('Narration on/off', '旁白开/关'), scene:T('Scene', '第'), start:T('▶ Watch the animation', '▶ 观看动画') };
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const STYLE = `
.lmv{display:flex;flex-direction:column;gap:8px}
.lmv-stage{position:relative;aspect-ratio:16/9;border-radius:var(--radius,16px);overflow:hidden;background:var(--stage-2,#e1ebf3);border:1px solid var(--line)}
.lmv-stage canvas{display:block;width:100%;height:100%}
.lmv-start{position:absolute;inset:0;display:grid;place-items:center;background:rgba(10,20,40,.28);cursor:pointer;border:0;width:100%;color:#fff;font:800 20px Nunito,sans-serif}
.lmv-start span{background:var(--brand);color:var(--brand-ink);padding:12px 22px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.lmv-cap{min-height:3.2em;font-size:17px;line-height:1.5;padding:8px 14px;border-radius:12px;background:var(--surface);border:1px solid var(--line)}
.lmv-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.lmv-bar button{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:12px;min-width:42px;height:40px;font-size:17px;cursor:pointer}
.lmv-bar button.on{background:var(--brand);color:var(--brand-ink);border-color:var(--brand)}
.lmv-tl{flex:1;display:flex;gap:3px;min-width:160px;height:14px;cursor:pointer}
.lmv-tl i{flex:1;border-radius:4px;background:var(--surface-2);position:relative;overflow:hidden;border:1px solid var(--line)}
.lmv-tl i b{position:absolute;inset:0 auto 0 0;width:0;background:var(--brand)}
.lmv-n{font-size:13px;color:var(--ink-2);font-weight:800;min-width:3.5em;text-align:right}`;
  const addStyle = () => { if (document.getElementById('lmv-style')) return; const s = document.createElement('style'); s.id = 'lmv-style'; s.textContent = STYLE; document.head.appendChild(s); };

  LMV.create = (host, opt = {}) => {
    addStyle();
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    const scenes = opt.scenes || [];
    el.classList.add('lmv');
    el.innerHTML = `${opt.title ? `<b class="lmv-title" style="font:700 18px Fredoka,Nunito,sans-serif"></b>` : ''}<div class="lmv-stage" data-fs><canvas></canvas><button type="button" class="lmv-start"><span></span></button></div>
      <div class="lmv-cap" aria-live="polite"></div>
      <div class="lmv-bar"><button type="button" class="lmv-pp">▶</button><button type="button" class="lmv-re">⟲</button><div class="lmv-tl">${scenes.map(() => '<i><b></b></i>').join('')}</div><span class="lmv-n"></span><button type="button" class="lmv-vo on">🔊</button></div>`;
    const cv = el.querySelector('canvas'), g = cv.getContext('2d'), cap = el.querySelector('.lmv-cap'), start = el.querySelector('.lmv-start');
    const S = { i:0, t:0, playing:false, voice:true, spoken:-1, speechDone:true, last:0, raf:0, started:false };
    let W = 0, H = 0;
    // the TTS collector (tools/tts/pre.js) defines window.__cap: hand it every caption so the narration gets recorded
    try { if (window.__cap && __cap.add) scenes.forEach(s => __cap.add(L(s.cap), (window.Lab && Lab.lang) || 'en', 'movie')); } catch(e){}
    const M = { ease:x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2, lerp:(a, b, x) => a + (b - a) * x, css,
      text:(t, x, y, o = {}) => { g.font = `${o.w || 800} ${o.s || 16}px Nunito, "PingFang SC", "Microsoft YaHei", sans-serif`; g.textAlign = o.a || 'center'; g.textBaseline = 'middle';
        if (o.halo !== false){ g.lineWidth = 4; g.strokeStyle = o.halo || css('--surface') || '#fff'; g.lineJoin = 'round'; g.strokeText(t, x, y); } g.fillStyle = o.c || css('--ink'); g.fillText(t, x, y); } };
    function size(){ const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); if (!r.width) return; W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); draw(); }
    function draw(){
      if (!W) return; const sc = scenes[S.i]; if (!sc) return;
      g.save(); g.clearRect(0, 0, W, H); g.fillStyle = css('--stage-2') || '#e1ebf3'; g.fillRect(0, 0, W, H);
      M.t = S.t; try { sc.draw(g, Math.min(1, S.t / (sc.dur || 6)), W, H, M); } catch(e){ console.error(e); if (Array.isArray(window.__labErr)) window.__labErr.push('movie: ' + e.message); }
      g.restore();
      el.querySelectorAll('.lmv-tl i b').forEach((b, k) => { b.style.width = (k < S.i ? 100 : k > S.i ? 0 : Math.min(100, S.t / (sc.dur || 6) * 100)) + '%'; });
      el.querySelector('.lmv-n').textContent = `${S.i + 1}/${scenes.length}`;
    }
    function caption(){ const sc = scenes[S.i]; cap.textContent = sc ? L(sc.cap) : ''; }
    function speak(){
      if (!S.voice || !window.Lab || !Lab.speak || S.spoken === S.i) return;
      S.spoken = S.i; S.speechDone = false; const my = S.i;
      Lab.speak(L(scenes[S.i].cap), { onend:() => { if (S.i === my) S.speechDone = true; } });
      setTimeout(() => { if (S.i === my) S.speechDone = true; }, 30000);   // never wait forever
    }
    function go(i, keepPlaying){ S.i = Math.max(0, Math.min(scenes.length - 1, i)); S.t = 0; S.spoken = -1; S.speechDone = true; if (window.Lab && Lab.stopSpeech) Lab.stopSpeech(); caption(); draw(); if (keepPlaying && S.playing) speak(); }
    function tick(now){
      if (!S.playing) return;
      const dt = Math.min(.1, (now - S.last) / 1000); S.last = now;
      const sc = scenes[S.i]; S.t += dt;
      if (S.t >= (sc.dur || 6) && (S.speechDone || !S.voice)){
        if (S.i < scenes.length - 1){ go(S.i + 1, true); } else { S.t = sc.dur || 6; pause(); draw(); return; }
      }
      draw(); S.raf = requestAnimationFrame(tick);
    }
    function play(){ if (!S.started){ S.started = true; start.hidden = true; } if (S.i === scenes.length - 1 && S.t >= (scenes[S.i].dur || 6)) go(0); S.playing = true; S.last = performance.now(); el.querySelector('.lmv-pp').textContent = '⏸'; el.querySelector('.lmv-pp').title = L(UI.pause); speak(); cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(tick); }
    function pause(){ S.playing = false; cancelAnimationFrame(S.raf); el.querySelector('.lmv-pp').textContent = '▶'; el.querySelector('.lmv-pp').title = L(UI.play); if (window.Lab && Lab.stopSpeech) Lab.stopSpeech(); S.spoken = -1; }
    start.onclick = play;
    el.querySelector('.lmv-pp').onclick = () => S.playing ? pause() : play();
    el.querySelector('.lmv-re').onclick = () => { go(0); play(); };
    el.querySelector('.lmv-vo').onclick = e => { S.voice = !S.voice; e.currentTarget.classList.toggle('on', S.voice); if (!S.voice && window.Lab && Lab.stopSpeech) Lab.stopSpeech(); else if (S.playing){ S.spoken = -1; speak(); } };
    el.querySelectorAll('.lmv-tl i').forEach((n, k) => n.onclick = () => { if (!S.started){ S.started = true; start.hidden = true; } go(k, true); if (!S.playing) draw(); });
    const labels = () => { const t = el.querySelector('.lmv-title'); if (t) t.textContent = L(opt.title); start.querySelector('span').textContent = L(opt.poster || UI.start); el.querySelector('.lmv-re').title = L(UI.replay); el.querySelector('.lmv-vo').title = L(UI.voice); caption(); draw(); };
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv); else addEventListener('resize', size);
    // stop when scrolled far away (keeps CPU and speech calm)
    if (window.IntersectionObserver) new IntersectionObserver(es => es.forEach(x => { if (!x.isIntersecting && S.playing) pause(); })).observe(el);
    labels(); size();
    if (window.Lab && Lab.onLang) Lab.onLang(() => { if (S.playing){ if (Lab.stopSpeech) Lab.stopSpeech(); S.spoken = -1; speak(); } labels(); });
    return { play, pause, go, el };
  };
})();
