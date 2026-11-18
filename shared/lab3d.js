/* Science Lab — shared Three.js helper (classic script; THREE is passed in from the page's module script).
   Usage in a page:
     <script type="module">
       import * as THREE from 'three';
       import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
       const ctx = Lab3D.stage('#stage', { THREE, OrbitControls, camera:[0,4,14], autoRotate:true });
       ...build into ctx.scene...
     </script>
   ctx: { THREE, scene, camera, renderer, controls, el, onFrame(fn(dt,t)), pickable(obj,key), onPick(fn(key,hit)),
          hoverText(fn(key)->string), flyTo(target,dist,ms), home(), label(textOrFn, objOrVec, {cls}), caption(text),
          mat(color, opacity, extra), setHover(enabled) }
   Lab3D.story(stageEl, steps, onStep(i, step), onEnd) -> {start(), stop(), go(i)} ; step = {en, zh, ...} */
(function(){
  const Lab3D = window.Lab3D = {};
  const q = s => typeof s === 'string' ? document.querySelector(s) : s;

  Lab3D.stage = (el, o = {}) => {
    el = q(el);
    const THREE = o.THREE;
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, preserveDrawingBuffer: !!o.preserve });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    el.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(o.fov || 40, 1, o.near || .1, o.far || 2000);
    const HOME = new THREE.Vector3(...(o.camera || [0, 4, 14])), HOME_T = new THREE.Vector3(...(o.target || [0,0,0]));
    camera.position.copy(HOME);
    const controls = new o.OrbitControls(camera, renderer.domElement);
    Object.assign(controls, { enableDamping:true, dampingFactor:.08, autoRotate: !!o.autoRotate, autoRotateSpeed: o.autoRotateSpeed || .7,
      minDistance: o.minDistance || 2, maxDistance: o.maxDistance || 60, enablePan: o.pan !== false });
    controls.target.copy(HOME_T);
    if (o.lights !== false){
      scene.add(new THREE.HemisphereLight(0xffffff, 0x7799bb, 1.3));
      const d = new THREE.DirectionalLight(0xffffff, 1.6); d.position.set(6, 10, 8); scene.add(d);
      const r = new THREE.DirectionalLight(0x99ccff, .6); r.position.set(-8, -4, -6); scene.add(r);
    }
    function resize(){ const b = el.getBoundingClientRect(); if (!b.width || !b.height) return; renderer.setSize(b.width, b.height, false); camera.aspect = b.width / b.height; camera.updateProjectionMatrix(); }
    new ResizeObserver(resize).observe(el); resize();

    const frames = [], picks = [], pickFns = []; let hoverFn = null, hoverOn = true, fly = null;
    const ctx = { THREE, scene, camera, renderer, controls, el };
    ctx.onFrame = fn => frames.push(fn);
    ctx.pickable = (obj, key) => { obj.traverse ? obj.traverse(c => { if (c.isMesh || c.isInstancedMesh || c.isPoints) { c.userData.pickKey = key; picks.push(c); } }) : null; return obj; };
    ctx.unpickable = obj => obj.traverse(c => { const i = picks.indexOf(c); if (i >= 0) picks.splice(i, 1); });
    ctx.onPick = fn => pickFns.push(fn);
    ctx.hoverText = fn => hoverFn = fn;
    ctx.setHover = on => hoverOn = on;
    ctx.mat = (color, opacity = 1, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness:.45, clearcoat:.4, clearcoatRoughness:.4, transparent: opacity < 1, opacity, ...extra });

    /* camera flights */
    ctx.flyTo = (target, dist, ms = 1100) => {
      const t = Array.isArray(target) ? new THREE.Vector3(...target) : target.clone();
      const dir = camera.position.clone().sub(controls.target).normalize();
      fly = { t0:performance.now(), dur:ms, fT:controls.target.clone(), tT:t, fP:camera.position.clone(), tP: t.clone().add(dir.multiplyScalar(dist ?? camera.position.distanceTo(controls.target))) };
    };
    ctx.flyToPose = (pos, target, ms = 1100) => { fly = { t0:performance.now(), dur:ms, fT:controls.target.clone(), tT:new THREE.Vector3(...target), fP:camera.position.clone(), tP:new THREE.Vector3(...pos) }; };
    ctx.home = () => { fly = { t0:performance.now(), dur:1100, fT:controls.target.clone(), tT:HOME_T.clone(), fP:camera.position.clone(), tP:HOME.clone() }; };

    /* picking */
    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
    ctx.raycast = e => {
      const b = renderer.domElement.getBoundingClientRect();
      ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      return ray.intersectObjects(picks.filter(p => { let v = true; p.traverseAncestors(a => { if (!a.visible) v = false; }); return v && p.visible; }), false);
    };
    const cv = renderer.domElement; let down = null, pend = false;
    const tag = document.createElement('div'); tag.className = 'lab-hover'; el.appendChild(tag);
    cv.addEventListener('pointerdown', e => down = { x:e.clientX, y:e.clientY });
    cv.addEventListener('pointerup', e => {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6){
        const h = ctx.raycast(e)[0]; pickFns.forEach(fn => fn(h ? h.object.userData.pickKey : null, h || null, e));
      }
      down = null;
    });
    cv.addEventListener('pointermove', e => {
      if (pend || e.pointerType === 'touch' || !hoverOn) return; pend = true;
      requestAnimationFrame(() => {
        pend = false; const h = down ? null : ctx.raycast(e)[0], key = h ? h.object.userData.pickKey : null;
        ctx.hoverKey = key;
        const txt = key != null && hoverFn ? hoverFn(key, h) : '';
        const b = el.getBoundingClientRect();
        tag.style.left = (e.clientX - b.left) + 'px'; tag.style.top = (e.clientY - b.top) + 'px';
        tag.textContent = txt || ''; tag.style.opacity = txt ? 1 : 0; cv.style.cursor = key != null ? 'pointer' : 'grab';
      });
    });
    cv.addEventListener('pointerleave', () => { tag.style.opacity = 0; ctx.hoverKey = null; });

    /* HTML labels that follow 3D points */
    const labels = [];
    ctx.label = (text, at, opt = {}) => {
      const d = document.createElement('div'); d.className = 'lab-label3d ' + (opt.cls || ''); el.appendChild(d);
      const L = { el:d, text, at, visible:true, offset: opt.offset ? new THREE.Vector3(...opt.offset) : null };
      L.set = t => { L.text = t; L.el.textContent = typeof t === 'function' ? t() : (window.Lab ? Lab.L(t) : t); };
      L.set(text); labels.push(L);
      L.remove = () => { d.remove(); labels.splice(labels.indexOf(L), 1); };
      return L;
    };
    if (window.Lab) Lab.onLang(() => labels.forEach(L => L.set(L.text)));
    const tmp = new THREE.Vector3();
    function placeLabels(){
      const b = el.getBoundingClientRect();
      for (const L of labels){
        if (L.at.isObject3D){ L.at.getWorldPosition(tmp); let v = L.visible; L.at.traverseAncestors(a => { if (!a.visible) v = false; }); if (!L.at.visible) v = false; if (!v){ L.el.style.display = 'none'; continue; } }
        else tmp.copy(L.at);
        if (L.offset) tmp.add(L.offset);
        tmp.project(camera);
        const show = L.visible && tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1;
        L.el.style.display = show ? '' : 'none';
        if (show){ L.el.style.left = ((tmp.x + 1) / 2 * b.width) + 'px'; L.el.style.top = ((1 - tmp.y) / 2 * b.height) + 'px'; }
      }
    }

    /* caption */
    let cap = el.querySelector('.lab-caption'); if (!cap){ cap = document.createElement('div'); cap.className = 'lab-caption'; el.appendChild(cap); }
    ctx.caption = t => { cap.textContent = t ? (window.Lab ? Lab.L(t) : t) : ''; cap.classList.toggle('show', !!t); ctx._cap = t; };
    if (window.Lab) Lab.onLang(() => { if (ctx._cap) ctx.caption(ctx._cap); });

    /* loop */
    let last = performance.now(), first = true;
    ctx.paused = false;
    function loop(){
      requestAnimationFrame(loop);
      const now = performance.now(), dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now;
      if (fly){
        const u = Math.max(0, Math.min(1, (now - fly.t0) / fly.dur)), e = u < .5 ? 2*u*u : 1 - Math.pow(-2*u + 2, 2) / 2;
        controls.target.lerpVectors(fly.fT, fly.tT, e); camera.position.lerpVectors(fly.fP, fly.tP, e); if (u >= 1) fly = null;
      }
      controls.update();
      if (!ctx.paused) for (const f of frames) f(dt, now / 1000);
      renderer.render(scene, camera);
      placeLabels();
      if (first){ first = false; const l = el.querySelector('.lab-loading'); if (l) l.remove(); el.dataset.ready = '1'; }
    }
    requestAnimationFrame(loop);
    el._lab3d = ctx;
    return ctx;
  };

  /* Texture loader with graceful fallback (returns null texture on failure; call cb(tex) when loaded) */
  Lab3D.texture = (THREE, url, cb) => {
    const l = new THREE.TextureLoader(); l.setCrossOrigin('anonymous');
    return l.load(url, t => { t.colorSpace = THREE.SRGBColorSpace; cb && cb(t); }, undefined, () => cb && cb(null));
  };
  Lab3D.TEX = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/';  // planets/earth_atmos_2048.jpg, planets/moon_1024.jpg, etc.

  /* Guided story bar: Back / step / Next / Replay / Close, with caption */
  Lab3D.story = (stageEl, steps, onStep, onEnd) => {
    stageEl = q(stageEl);
    let bar = stageEl.querySelector('.storybar');
    if (!bar){ bar = document.createElement('div'); bar.className = 'storybar'; stageEl.appendChild(bar); }
    let cap = stageEl.querySelector('.lab-caption'); if (!cap){ cap = document.createElement('div'); cap.className = 'lab-caption'; stageEl.appendChild(cap); }
    const zh = () => window.Lab && Lab.lang === 'zh';
    const S = { i:0, on:false };
    function render(){
      const last = S.i === steps.length - 1;
      bar.innerHTML = `<button data-a="prev">${zh() ? '◀ 上一步' : '◀ Back'}</button><span>${S.i + 1}/${steps.length}</span><button data-a="next">${last ? (zh() ? '完成 ✓' : 'Finish ✓') : (zh() ? '下一步 ▶' : 'Next ▶')}</button><button data-a="replay" title="Replay">↺</button><button data-a="close" title="Close">✕</button>`;
      bar.querySelectorAll('button').forEach(b => b.onclick = () => act(b.dataset.a));
      cap.textContent = window.Lab ? Lab.L(steps[S.i]) : steps[S.i].en; cap.classList.add('show');
    }
    function go(i){ S.i = Math.max(0, Math.min(steps.length - 1, i)); S.on = true; bar.classList.add('show'); render(); onStep && onStep(S.i, steps[S.i]); }
    function stop(){ if (!S.on) return; S.on = false; bar.classList.remove('show'); cap.classList.remove('show'); onEnd && onEnd(); }
    function act(a){ if (a === 'prev') go(S.i - 1); if (a === 'next') S.i < steps.length - 1 ? go(S.i + 1) : stop(); if (a === 'replay') go(S.i); if (a === 'close') stop(); }
    if (window.Lab) Lab.onLang(() => { if (S.on) render(); });
    return { start:() => go(0), go, stop, get active(){ return S.on; }, get index(){ return S.i; } };
  };

  /* Offline / slow-network fallback for every .stage */
  function watch(){
    document.querySelectorAll('.stage[data-3d]').forEach(st => {
      if (!st.querySelector('.lab-loading')){ const d = document.createElement('div'); d.className = 'lab-loading'; d.textContent = (window.Lab && Lab.lang === 'zh') ? '正在加载 3D 场景…' : 'Loading 3D scene…'; st.appendChild(d); }
      setTimeout(() => { const l = st.querySelector('.lab-loading'); if (l && !st.dataset.ready) l.textContent = window.Lab ? Lab.L(Lab.UI.need3d) : 'The 3D scene needs an internet connection.'; }, 15000);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
})();
