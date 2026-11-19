/* LabPhotos — real-world photos & micrographs next to the 3D models (self-contained; auto-loaded by lab.js).
   Every photo MUST be freely licensed (public domain / CC0 / CC BY / CC BY-SA) and show its credit + licence + source link.
   item = { src:'https://upload.wikimedia.org/...800px-...jpg',      // thumbnail URL from the Commons API (thumburl)
            en:'Caption', zh:'说明',                                 // what the student is looking at
            kind:{en:'Electron micrograph', zh:'电子显微镜照片'},      // optional badge (photo type)
            scale:{en:'about 1 µm long', zh:'约 1 微米长'},           // optional real size / magnification
            credit:'Louisa Howard (Dartmouth)', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:...' }
   VIDEO / AUDIO items: add type:'video' | 'audio' and media:'<Commons file URL: .webm/.ogv/.mp4 or .ogg/.oga/.mp3/.wav>'
            (+ optional poster:'<image URL>' for video, src:'<image URL>' as cover for audio). Same credit/licence rules. Nothing autoplays.
   LabPhotos.render(el, items, {title, sub})  -> gallery grid (re-renders on language switch)
   LabPhotos.figure(item)                    -> HTML string for an info panel ("📷 The real thing"); click opens the viewer
   LabPhotos.open(item | items, index)       -> full-screen viewer with ◀ ▶ and Esc                                  */
(function(){
  if (window.LabPhotos) return;
  const LP = window.LabPhotos = {};
  const zh = () => (window.Lab && Lab.lang === 'zh') || (document.documentElement.lang || '').toLowerCase().startsWith('zh');
  const L = o => o == null ? '' : typeof o === 'string' ? o : (zh() ? (o.zh ?? o.en) : (o.en ?? o.zh)) || '';
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const T = { real:{en:'📷 The real thing',zh:'📷 真实的样子'}, photo:{en:'Photo',zh:'图片'}, off:{en:'📷 Photo needs an internet connection',zh:'📷 照片需要联网加载'},
              src:{en:'source',zh:'来源'}, close:{en:'Close',zh:'关闭'}, zoom:{en:'Click to enlarge',zh:'点击放大'},
              ext:{en:'Open on Wikimedia Commons ↗',zh:'在维基共享资源打开 ↗'}, cant:{en:"This clip can't play here.",zh:'这个浏览器无法播放该片段。'},
              noimg:{en:"This photo didn't load.",zh:'图片没有加载出来。'},
              yt:{en:'Watch on YouTube ↗',zh:'在 YouTube 观看 ↗'}, sf:{en:'Open on Sketchfab ↗',zh:'在 Sketchfab 打开 ↗'}, load3d:{en:'▶ Load the 3D model',zh:'▶ 加载 3D 模型'}, m3d:{en:'3D model',zh:'3D 模型'}, drag3d:{en:'Drag to rotate · scroll to zoom · click the ⓘ hotspots',zh:'拖动旋转 · 滚轮缩放 · 点击 ⓘ 标注'}, ytnote:{en:"If the video doesn't start here, open it on YouTube.",zh:'如果视频在这里无法播放，请在 YouTube 打开。'},
              ytopen:{en:'Click the picture to watch it on YouTube (opens a new tab).',zh:'点击画面即可在 YouTube 观看（新标签页打开）。'} };
  const css = `
.lp-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px}
.lp-card{background:var(--surface,#fff);border:1px solid var(--line,#d9e2ee);border-radius:18px;overflow:hidden;box-shadow:var(--shadow,0 10px 30px rgba(20,33,61,.08));display:flex;flex-direction:column;cursor:zoom-in;transition:transform .15s,border-color .15s}
.lp-card:hover{transform:translateY(-3px);border-color:var(--brand,#0f9d8a)}
.lp-imgwrap{position:relative;aspect-ratio:4/3;background:#0e1422;overflow:hidden}
.lp-imgwrap img{width:100%;height:100%;object-fit:cover;display:block}
.lp-kind{position:absolute;left:10px;top:10px;font-size:11px;font-weight:800;letter-spacing:.04em;background:rgba(10,15,30,.72);color:#fff;padding:3px 8px;border-radius:999px}
.lp-cap{padding:10px 12px 12px;display:flex;flex-direction:column;gap:4px}
.lp-cap b{font-size:15px;line-height:1.35}
.lp-cap .lp-sc{font-size:13px;color:var(--brand,#0f9d8a);font-weight:800}
.lp-credit{font-size:11px;color:var(--ink-2,#4a5878);line-height:1.35}
.lp-credit a{color:inherit}
.lp-media{cursor:default}.lp-media video{width:100%;height:100%;object-fit:contain;display:block;background:#000}
.lp-audio audio{position:absolute;left:8px;right:8px;bottom:8px;width:calc(100% - 16px);height:36px}
.lp-note{position:absolute;inset:0 0 40px;display:grid;place-items:center;font-size:54px;color:#9fb0cc}
.lp-view video{max-width:min(1200px,96vw);max-height:76vh;border-radius:10px;background:#000}
.lp-yt{cursor:pointer}
.lp-3d{width:100%;height:100%;border:0;display:block;background:#0e1422}
.lp-3dbox{position:relative;margin:0;border:1px solid var(--line,#d9e2ee);border-radius:16px;overflow:hidden;background:#0e1422}
.lp-3dbox>img{width:100%;height:100%;object-fit:cover;opacity:.85}
.lp-3dbox .lp-3d{height:calc(100% - 56px)}
.lp-3dload{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);border:0;background:var(--brand,#0f9d8a);color:#fff;font:800 17px/1 Nunito,system-ui,sans-serif;padding:14px 22px;border-radius:999px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)}
.lp-3dbox figcaption{position:absolute;left:0;right:0;bottom:0;background:rgba(10,15,30,.82);color:#eef3fb;padding:8px 12px;display:flex;flex-direction:column;gap:2px;font-size:14px}
.lp-3dbox figcaption .lp-credit,.lp-3dbox figcaption a{color:#c6d4ee}
.lp-3dhint{position:absolute;bottom:66px;left:10px;background:rgba(10,15,30,.72);color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;pointer-events:none}.lp-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:58px;height:58px;border-radius:50%;background:rgba(10,15,30,.72);color:#fff;display:grid;place-items:center;font-size:22px;padding-left:4px;pointer-events:none}
.lp-card:hover .lp-play{background:#c4302b}
.lp-ytbox{width:min(1100px,94vw);aspect-ratio:16/9;max-height:72vh;background:#000;border-radius:10px;overflow:hidden}.lp-ytbox iframe{width:100%;height:100%;border:0}
.lp-ytlocal{position:relative;display:block}.lp-ytlocal img{width:100%;height:100%;object-fit:cover;max-width:none;max-height:none;border-radius:0;box-shadow:none}.lp-ytlocal .lp-play{width:84px;height:84px;font-size:32px;background:#c4302b}
.lp-view .ytlink{display:inline-block;margin-top:8px;color:#fff;background:rgba(255,255,255,.14);padding:6px 12px;border-radius:999px;text-decoration:none;font-size:14px}
.lp-off{position:absolute;inset:0;display:grid;place-items:center;color:#9fb0cc;font-size:13px;font-weight:700;text-align:center;padding:10px}
.lp-fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:#0e1422}
.lp-fallback .lp-ext{color:#fff;background:rgba(255,255,255,.14);padding:7px 12px;border-radius:999px;text-decoration:none}
.lp-cap .lp-ext{font-size:12.5px;font-weight:800;color:var(--brand,#0f9d8a);text-decoration:none}
.lp-cap .lp-ext:hover{text-decoration:underline}
.lp-fig{margin:0;border:1px solid var(--line,#d9e2ee);border-radius:14px;overflow:hidden;background:var(--surface-2,#eef3f9);cursor:zoom-in}
.lp-fig .lp-imgwrap{aspect-ratio:16/10}
.lp-fig figcaption{padding:8px 10px;font-size:13.5px;display:flex;flex-direction:column;gap:2px}
.lp-fig figcaption b{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--accent,#ff7a59)}
.lp-view{position:fixed;inset:0;z-index:100000;background:rgba(5,8,16,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;color:#eef3fb}
.lp-view img{max-width:min(1200px,96vw);max-height:76vh;object-fit:contain;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.lp-view .cap{max-width:900px;text-align:center;margin-top:14px;font-size:17px;line-height:1.5}
.lp-view .cap small{display:block;color:#9fb0cc;font-size:12.5px;margin-top:6px}
.lp-view .cap small a{color:#c6d4ee}
.lp-view button{position:absolute;border:0;background:rgba(255,255,255,.12);color:#fff;font-size:26px;width:48px;height:48px;border-radius:50%;cursor:pointer}
.lp-view button:hover{background:rgba(255,255,255,.24)}
.lp-view .x{top:16px;right:16px}.lp-view .pv{left:16px;top:50%}.lp-view .nx{right:16px;top:50%}
@media (max-width:560px){.lp-gallery{grid-template-columns:1fr 1fr;gap:10px}.lp-cap b{font-size:13.5px}.lp-view .pv,.lp-view .nx{top:auto;bottom:16px}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const reg = []; // registry so markup can reference items by index
  const idOf = it => { let i = reg.indexOf(it); if (i < 0){ reg.push(it); i = reg.length - 1; } return i; };
  const TL = { video:{en:'Video',zh:'视频'}, audio:{en:'Audio',zh:'音频'}, youtube:{en:'Video',zh:'视频'}, model3d:{en:'3D model',zh:'3D 模型'} };
  // 3D models (Sketchfab embeds): { type:'model3d', sketchfab:'UID', src:'<thumbnail URL>', en, zh, credit:'Author (Sketchfab)', license:'CC BY 4.0', page:'https://sketchfab.com/3d-models/...' }
  const sfId = it => String(it.sketchfab || '').replace(/[^\w]/g, '');
  const sfEmbed = (it, auto) => 'https://sketchfab.com/models/' + sfId(it) + '/embed?ui_theme=dark&dnt=1' + (auto ? '&autostart=1&preload=1' : '');
  const sfIframe = (it, auto) => `<iframe class="lp-3d" title="${esc(L(it))}" src="${sfEmbed(it, auto)}" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen loading="lazy"></iframe>`;
  // YouTube items: { type:'youtube', yt:'VIDEO_ID', start:30 (optional, seconds), en, zh, kind, credit:'NASA (YouTube)', license:'YouTube' }
  const ytId = it => String(it.yt || '').replace(/[^\w-]/g, '');
  const ytWatch = it => 'https://www.youtube.com/watch?v=' + ytId(it) + (it.start ? '&t=' + (+it.start) + 's' : '');
  const credit = it => `${esc(L(TL[it.type] || T.photo))}${zh() ? '：' : ': '}${esc(it.credit || '—')} · ${esc(it.license || '')}${it.page ? ` · <a href="${esc(it.page)}" target="_blank" rel="noopener">${esc(L(T.src))}</a>` : ''}`;
  const media = it => it.type === 'video'
    ? `<div class="lp-imgwrap lp-media">${it.kind ? `<span class="lp-kind">${esc(L(it.kind))}</span>` : ''}${canPlay(it) ? `<video controls preload="none" playsinline ${it.poster ? `poster="${esc(it.poster)}"` : ''} ${srcAttr(it)} onerror="LabPhotos._mediaErr(this)" onplay="this.dataset.wanted=1" data-page="${esc(extUrl(it))}"></video>` : fallback(it)}</div>`
    : `<div class="lp-imgwrap lp-media lp-audio">${it.kind ? `<span class="lp-kind">${esc(L(it.kind))}</span>` : ''}${it.src ? `<img loading="lazy" referrerpolicy="no-referrer" src="${esc(it.src)}" alt="">` : '<div class="lp-note">♪</div>'}${canPlay(it) ? `<audio controls preload="none" ${srcAttr(it)} onerror="LabPhotos._mediaErr(this)" onplay="this.dataset.wanted=1" data-page="${esc(extUrl(it))}"></audio>` : fallback(it)}</div>`;
  // Candidate sources for a clip, best first. Wikimedia keeps converted copies under /transcoded/…: VP9 WebM for video
  // (Chrome no longer plays Ogg Theora .ogv; smaller copies also load faster) and MP3 for audio (Safari/iPad can't play Ogg).
  function sources(it){ const u = String(it.media || ''), m = /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f])\/([0-9a-f]{2})\/([^/?#]+)/.exec(u);
    if (!m) return [u];
    const t = m[1] + 'transcoded/' + m[2] + '/' + m[3] + '/' + m[4] + '/' + m[4] + '.', ext = (m[4].match(/\.(\w+)$/) || [])[1] || '';
    if (it.type === 'audio'){ const ogg = document.createElement('audio').canPlayType('audio/ogg; codecs=vorbis') !== '';
      return /^(ogg|oga|opus|flac|wav)$/i.test(ext) ? (ogg ? [u, t + 'mp3'] : [t + 'mp3', u]) : [u]; }
    const list = [t + '720p.vp9.webm', t + '480p.vp9.webm', t + '360p.vp9.webm', t + '240p.vp9.webm'];
    return /^ogv$/i.test(ext) ? list : [list[1], u, ...list.slice(2)]; }
  const srcAttr = it => { const s = sources(it); return `src="${esc(s[0])}" data-srcs="${esc(JSON.stringify(s))}"`; };
  // which formats this browser can play (Safari / iPad cannot play WebM or Ogg from Wikimedia)
  function canPlay(it){ const ext = (String(it.media || '').split('?')[0].match(/\.(\w+)$/) || [])[1] || '';
    const el = document.createElement(it.type === 'audio' ? 'audio' : 'video');
    const mime = { webm:'video/webm', ogv:'video/ogg', mp4:'video/mp4', ogg:'audio/ogg', oga:'audio/ogg', opus:'audio/ogg; codecs=opus', mp3:'audio/mpeg', wav:'audio/wav', flac:'audio/flac' }[ext.toLowerCase()];
    if (sources(it).length > 1) return it.type === 'audio' || el.canPlayType('video/webm') !== '';
    return !mime || !el.canPlayType || el.canPlayType(mime) !== ''; }
  const extUrl = it => it.type === 'model3d' ? (it.page || 'https://sketchfab.com/3d-models/' + sfId(it)) : it.type === 'youtube' ? ytWatch(it) : (it.page || it.media || it.src || '');
  const extLink = it => `<a class="lp-ext" href="${esc(extUrl(it))}" target="_blank" rel="noopener">${esc(L(it.type === 'youtube' ? T.yt : it.type === 'model3d' ? T.sf : T.ext))}</a>`;
  // inline viewer for a lesson section: thumbnail + button; the heavy model loads only on click
  LP.embed3d = (it, height) => { const id = idOf(it);
    return `<figure class="lp-3dbox" data-lp3d="${id}" style="height:${height || 420}px"><img src="${esc(it.src || '')}" alt="${esc(L(it))}" referrerpolicy="no-referrer"><button type="button" class="lp-3dload">${esc(L(T.load3d))}</button>
      <figcaption><b>${esc(L(it))}</b><span class="lp-credit">${credit(it)} · ${extLink(it)}</span></figcaption></figure>`; };
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('.lp-3dload'); if (!b) return; const box = b.closest('[data-lp3d]'), it = reg[+box.dataset.lp3d];
    box.querySelector('img').remove(); b.remove(); box.insertAdjacentHTML('afterbegin', sfIframe(it, true) + `<span class="lp-3dhint">${esc(L(T.drag3d))}</span>`); }, true);
  const fallback = it => `<div class="lp-off lp-fallback"><span>${esc(L(T.cant))}</span>${extLink(it)}</div>`;
  LP._mediaErr = el => { let s = []; try { s = JSON.parse(el.dataset.srcs || '[]'); } catch(e){}
    const i = +(el.dataset.si || 0) + 1;
    if (i < s.length){ el.dataset.si = i; const play = el.dataset.wanted || el.autoplay; el.src = s[i]; el.load(); if (play) el.play().catch(() => {}); return; }
    const box = el.parentNode; if (!box || box.querySelector('.lp-fallback')) return;
    el.style.display = 'none'; box.insertAdjacentHTML('beforeend', `<div class="lp-off lp-fallback"><span>${esc(L(T.cant))}</span><a class="lp-ext" href="${esc(el.dataset.page)}" target="_blank" rel="noopener">${esc(L(T.ext))}</a></div>`); };
  const img = it => it.type === 'model3d'
    ? `<div class="lp-imgwrap lp-yt"><span class="lp-kind">🧊 ${esc(L(it.kind || T.m3d))}</span><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${esc(it.src || '')}" alt="${esc(L(it))}" data-page="${esc(extUrl(it))}" onerror="LabPhotos._err(this)"><span class="lp-play" aria-hidden="true">⟳</span></div>`
    : it.type === 'youtube'
    ? `<div class="lp-imgwrap lp-yt">${it.kind ? `<span class="lp-kind">${esc(L(it.kind))}</span>` : ''}<img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="https://i.ytimg.com/vi/${ytId(it)}/hqdefault.jpg" alt="${esc(L(it))}" data-page="${esc(extUrl(it))}" onerror="LabPhotos._err(this)"><span class="lp-play" aria-hidden="true">▶</span></div>`
    : (it.type === 'video' || it.type === 'audio') ? media(it) : `<div class="lp-imgwrap">${it.kind ? `<span class="lp-kind">${esc(L(it.kind))}</span>` : ''}<img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${esc(it.src)}" alt="${esc(L(it))}" data-page="${esc(extUrl(it))}" onerror="LabPhotos._err(this)"></div>`;
  // Commons sometimes throttles a burst of thumbnails: retry twice (2 s, 5 s) before showing the "needs internet" note
  // Wikimedia answers bursts with "429 Too many requests". Retry slowly (with jitter), and from the 2nd retry on use the
  // Special:FilePath address on commons.wikimedia.org, which is served separately.
  const filePath = (page, w) => { const m = /\/wiki\/File:([^?#]+)/.exec(page || ''); return m ? `https://commons.wikimedia.org/wiki/Special:FilePath/${m[1]}?width=${w}` : ''; };
  LP._err = im => { const n = +(im.dataset.try || 0), src = im.dataset.src || im.getAttribute('src');
    const alt = filePath(im.dataset.page, 960), waits = [3000, 8000, 20000, 40000];
    if (n < waits.length){ im.dataset.try = n + 1; im.dataset.src = src;
      setTimeout(() => { im.src = (n >= 1 && alt) ? alt + (n > 1 ? '&r=' + n : '') : src; }, waits[n] + Math.random() * 1500); return; }
    im.style.display = 'none';
    im.parentNode.insertAdjacentHTML('beforeend', '<div class="lp-off lp-fallback"><span>' + esc(L(T.noimg)) + '</span>' + (im.dataset.page ? '<a class="lp-ext" href="' + esc(im.dataset.page) + '" target="_blank" rel="noopener">' + esc(L(T.ext)) + '</a>' : '') + '</div>'); };
  LP._off = () => esc(L(T.off));

  const renders = [];
  LP.render = (el, items, o = {}) => {
    el = typeof el === 'string' ? document.querySelector(el) : el; if (!el) return;
    const r = { el, items, o }; renders.push(r); draw(r); return r;
  };
  function draw(r){
    const ids = r.items.map(idOf);
    r.el.innerHTML = (r.o.title ? `<div class="sec-head lp-head"><h2>${esc(L(r.o.title))}</h2>${r.o.sub ? `<p>${esc(L(r.o.sub))}</p>` : ''}</div>` : '') +
      `<div class="lp-gallery">${r.items.map((it, k) => `<div class="lp-card" data-lp-id="${ids[k]}" data-lp-set="${ids.join(',')}" title="${esc(L(T.zoom))}">${img(it)}
        <div class="lp-cap"><b>${esc(L(it))}</b>${it.scale ? `<span class="lp-sc">${esc(L(it.scale))}</span>` : ''}<span class="lp-credit">${credit(it)}</span>${it.type === 'video' || it.type === 'audio' || it.type === 'youtube' || it.type === 'model3d' ? extLink(it) : ''}</div></div>`).join('')}</div>`;
  }
  LP.figure = (it, label) => { const id = idOf(it);
    return `<figure class="lp-fig" data-lp-id="${id}" title="${esc(L(T.zoom))}">${img(it)}<figcaption><b>${esc(L(label || T.real))}</b><span>${esc(L(it))}${it.scale ? ' · ' + esc(L(it.scale)) : ''}</span><span class="lp-credit">${credit(it)}</span></figcaption></figure>`; };

  let view = null, cur = [], ci = 0;
  LP.open = (items, index = 0) => { cur = Array.isArray(items) ? items : [items]; ci = index; show(); };
  function show(){
    const it = cur[ci]; if (!it) return;
    if (!view){ view = document.createElement('div'); view.className = 'lp-view'; document.body.appendChild(view);
      view.addEventListener('click', e => { if (e.target === view) close(); }); }
    // YouTube refuses embedded playback on pages opened from disk (file://, "Error 153"): there, show a big thumbnail that opens YouTube
    view.innerHTML = `${it.type === 'model3d' ? `<div class="lp-ytbox">${sfIframe(it, true)}</div>` : ''}${it.type === 'youtube' && location.protocol === 'file:' ? `<a class="lp-ytbox lp-ytlocal" href="${esc(extUrl(it))}" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/${ytId(it)}/hqdefault.jpg" alt="${esc(L(it))}" referrerpolicy="no-referrer"><span class="lp-play">▶</span></a>` : ''}${it.type === 'youtube' && location.protocol !== 'file:' ? `<div class="lp-ytbox"><iframe src="https://www.youtube-nocookie.com/embed/${ytId(it)}?rel=0&amp;autoplay=1&amp;playsinline=1${it.start ? '&amp;start=' + (+it.start) : ''}" title="${esc(L(it))}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>` : ''}${it.type === 'youtube' ? '' : it.type === 'video' ? (canPlay(it) ? `<video controls autoplay playsinline ${srcAttr(it)} onerror="LabPhotos._mediaErr(this)" onplay="this.dataset.wanted=1" data-page="${esc(extUrl(it))}"></video>` : `<div style="position:relative;width:min(560px,90vw);height:220px">${fallback(it)}</div>`) : it.type === 'audio' ? (canPlay(it) ? `<audio controls autoplay ${srcAttr(it)} onerror="LabPhotos._mediaErr(this)" onplay="this.dataset.wanted=1" data-page="${esc(extUrl(it))}"></audio>` : `<div style="position:relative;width:min(560px,90vw);height:160px">${fallback(it)}</div>`) : `<img src="${esc(it.full || it.src)}" alt="${esc(L(it))}" referrerpolicy="no-referrer">`}
      <div class="cap"><b>${esc(L(it))}</b>${it.scale ? ` · ${esc(L(it.scale))}` : ''}${it.kind ? ` · ${esc(L(it.kind))}` : ''}<small>${credit(it)}</small>${it.type === 'youtube' ? `<a class="ytlink" href="${esc(extUrl(it))}" target="_blank" rel="noopener">${esc(L(T.yt))}</a><small>${esc(L(location.protocol === 'file:' ? T.ytopen : T.ytnote))}</small>` : ''}</div>
      <button class="x" aria-label="${esc(L(T.close))}">✕</button>${cur.length > 1 ? '<button class="pv" aria-label="prev">‹</button><button class="nx" aria-label="next">›</button>' : ''}`;
    view.querySelector('.x').onclick = close;
    if (cur.length > 1){ view.querySelector('.pv').onclick = () => { ci = (ci - 1 + cur.length) % cur.length; show(); }; view.querySelector('.nx').onclick = () => { ci = (ci + 1) % cur.length; show(); }; }
  }
  function close(){ if (view){ view.remove(); view = null; } }
  document.addEventListener('keydown', e => { if (!view) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft' && cur.length > 1){ ci = (ci - 1 + cur.length) % cur.length; show(); } if (e.key === 'ArrowRight' && cur.length > 1){ ci = (ci + 1) % cur.length; show(); } });
  document.addEventListener('click', e => {
    const c = e.target.closest && e.target.closest('[data-lp-id]'); if (!c || e.target.closest('a,video,audio,.lp-media')) return;
    const set = (c.dataset.lpSet || c.dataset.lpId).split(',').map(Number), id = +c.dataset.lpId;
    LP.open(set.map(i => reg[i]), Math.max(0, set.indexOf(id)));
  });
  // re-render galleries when the language changes
  new MutationObserver(() => { renders.forEach(draw); if (view) show(); }).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
})();
