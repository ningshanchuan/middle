/* Science Lab — full-screen buttons for every 3D stage and simulation (self-contained; works with or without lab.js).
   Adds a ⤢ button to: .stage (3D scenes; the surrounding .explorer incl. the info panel goes full screen),
   .simbox (simulations), [data-fs] (any custom container), and other large canvases.
   Uses the Fullscreen API; falls back to a fixed full-window overlay where it is unavailable (e.g. iPhone Safari). */
(function(){
  if (window.LabFS) return;
  const LabFS = window.LabFS = {};
  const ICON_IN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  const ICON_OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  const css = `
.lab-fs-btn{position:absolute;top:12px;right:12px;z-index:9;width:38px;height:38px;border-radius:12px;border:1px solid var(--line,#d9e2ee);background:var(--surface,#fff);color:var(--ink,#14213d);display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.14);cursor:pointer;padding:0;opacity:.92;transition:transform .15s,border-color .15s,opacity .15s}
.lab-fs-btn:hover{opacity:1;transform:scale(1.06);border-color:var(--brand,#0f9d8a)}
.lab-fs-btn svg{width:20px;height:20px}
.lab-fs-host>.lab-fs-btn{top:6px;right:6px;width:28px;height:28px;border-radius:9px;box-shadow:none;opacity:.35}
.lab-fs-host>.lab-fs-btn svg{width:15px;height:15px}
.lab-fs-host:hover>.lab-fs-btn,.lab-fs-host>.lab-fs-btn:focus-visible{opacity:.95}
@media (hover:none){.lab-fs-host>.lab-fs-btn{opacity:.6}}
.stage .toolbar{right:60px !important}
.lab-fs-active{background:var(--bg,#f4f7fb) !important;width:100vw !important;height:100vh !important;max-width:none !important;margin:0 !important;border-radius:0 !important;box-sizing:border-box}
.lab-fs-pseudo{position:fixed !important;inset:0 !important;z-index:99999 !important}
.explorer.lab-fs-active{display:grid !important;grid-template-columns:minmax(0,1fr) 380px !important;gap:12px !important;padding:12px !important;overflow:hidden}
.explorer.full.lab-fs-active{grid-template-columns:minmax(0,1fr) !important}
.explorer.lab-fs-active>.stage{min-height:0 !important;height:calc(100vh - 24px) !important;max-height:none !important}
.explorer.lab-fs-active>.info{min-height:0 !important;max-height:calc(100vh - 24px) !important;overflow:auto !important}
.stage.lab-fs-active,.simbox.lab-fs-active,.lab-fs-host.lab-fs-active{min-height:0 !important;max-height:none !important;border:0 !important}
.lab-fs-host.lab-fs-active{display:flex;align-items:center;justify-content:center;padding:16px}
.lab-fs-host.lab-fs-active>canvas{max-width:100%;max-height:100%}
@media (max-width:980px){
  .explorer.lab-fs-active{grid-template-columns:minmax(0,1fr) !important;padding:0 !important;gap:0 !important}
  .explorer.lab-fs-active>.info{display:none !important}
  .explorer.lab-fs-active>.stage{height:100vh !important;border-radius:0 !important}
}`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const zh = () => (window.Lab && Lab.lang === 'zh') || (document.documentElement.lang || '').toLowerCase().startsWith('zh');
  const label = on => on ? (zh() ? '退出全屏' : 'Exit full screen') : (zh() ? '全屏' : 'Full screen');
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;
  const buttons = [];
  let pseudo = null;

  function targetFor(host){
    if (host.classList.contains('stage')){ const ex = host.closest('.explorer'); if (ex && ex.querySelectorAll('.stage').length === 1) return ex; }
    return host;
  }
  function refresh(){
    const cur = fsEl() || pseudo;
    buttons.forEach(b => {
      const on = cur === b._target;
      b._target.classList.toggle('lab-fs-active', on);
      b.innerHTML = on ? ICON_OUT : ICON_IN;
      b.title = label(on); b.setAttribute('aria-label', label(on));
    });
    if (!fsEl() && !pseudo) document.documentElement.style.overflow = '';
    // let canvases / renderers re-measure
    [30, 150, 400].forEach(ms => setTimeout(() => window.dispatchEvent(new Event('resize')), ms));
  }
  function enter(t){
    const req = t.requestFullscreen || t.webkitRequestFullscreen;
    if (req){
      try { const p = req.call(t); if (p && p.catch) p.catch(() => enterPseudo(t)); return; } catch(e){}
    }
    enterPseudo(t);
  }
  function enterPseudo(t){ pseudo = t; t.classList.add('lab-fs-pseudo'); document.documentElement.style.overflow = 'hidden'; refresh(); }
  function exit(){
    if (pseudo){ pseudo.classList.remove('lab-fs-pseudo'); pseudo = null; refresh(); return; }
    const ex = document.exitFullscreen || document.webkitExitFullscreen; if (ex && fsEl()) ex.call(document);
  }
  LabFS.toggle = host => { const t = targetFor(host); ((fsEl() || pseudo) === t) ? exit() : (fsEl() || pseudo ? (exit(), setTimeout(() => enter(t), 120)) : enter(t)); };

  function addButton(host){
    if (host._labFs) return; host._labFs = true;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'lab-fs-btn';
    b._target = targetFor(host); b.innerHTML = ICON_IN; b.title = label(false); b.setAttribute('aria-label', label(false));
    b.addEventListener('click', e => { e.stopPropagation(); LabFS.toggle(host); });
    host.appendChild(b); buttons.push(b);
  }
  function scan(){
    document.querySelectorAll('.stage, .simbox, [data-fs]').forEach(addButton);
    // other large stand-alone canvases (graphs, 2D sims) not already inside a host
    document.querySelectorAll('canvas').forEach(cv => {
      if (cv.closest('.stage, .simbox, [data-fs], .lab-fs-host, .lab-nav, [data-nofs]')) return;   // add data-nofs to a chart box to opt out
      const r = cv.getBoundingClientRect();
      if (r.width < 280 || r.height < 150) return;
      const host = cv.parentElement; if (!host || host === document.body) return;
      host.classList.add('lab-fs-host'); addButton(host);
    });
  }
  document.addEventListener('fullscreenchange', refresh);
  document.addEventListener('webkitfullscreenchange', refresh);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pseudo) exit(); });
  // keep tooltips in the current language
  new MutationObserver(refresh).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  function boot(){ scan(); setTimeout(scan, 1500); setTimeout(scan, 4000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
