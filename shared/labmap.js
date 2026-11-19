/* LabMap — simple interactive maps for history, geography and social studies (canvas; loads its own libraries).
   Made for middle-school students: tap a place → an info card (with 🔊), big buttons, optional timeline and "Find it!" game.
   Base maps: 'world' (world-atlas countries-110m, China drawn from shared/chinamap.js = mainland standard map incl. 台湾省、南海诸岛),
              'us' (us-atlas states-10m, Albers USA with Alaska & Hawaii), 'china' (shared/chinamap.js provinces).
   ------------------------------------------------------------------------------------------------------------------------
   <div id="map1"></div>
   const map = LabMap.create('#map1', {
     base:'world',                                   // 'world' | 'us' | 'china'
     extent:[[lonW, latS], [lonE, latN]],            // optional view (world default: whole world; us/china: whole country)
     height:440,                                     // optional (phones get ~75 %)
     pins:[{ id:'rome', ll:[12.5, 41.9], en:'Rome', zh:'罗马', icon:'🏛️', color:'#c2410c',
             info:{en:'Capital of the Roman Empire…', zh:'罗马帝国的首都……'}, photo:{…LabPhotos item…}, from:-753, to:476 }],
     regions:{ 'France':{ color:'#4f7fc6', info:{en:'…', zh:'…'}, from:1789 } },   // key = country / state / province name (en or zh) or adcode
     routes:[{ id:'silk', pts:[[108.9,34.3],[75.9,39.5],[44.4,33.3]], color:'#d4a017', dash:[6,4], en:'Silk Road', zh:'丝绸之路', info:{…}, from:-130 }],
     legend:[{ color:'#4f7fc6', en:'Allies', zh:'同盟国' }],
     timeline:{ min:1500, max:1900, step:10, value:1500, label:{en:'Year', zh:'年份'}, fmt:y => y < 0 ? `${-y} BCE` : y },   // items with from/to show only in their years
     quiz:{ items:[{ target:'rome', q:{en:'Find the capital of the Roman Empire', zh:'找出罗马帝国的首都'} }, { target:'France' }], count:8 },
     regionLabels:true,                              // write names on the regions listed in `regions` (default true)
     fill:name => colour|null,                       // optional: colour any base region by its (English) name
     overlay:(g, M) => {},                           // optional custom drawing: M.xy([lon,lat]) -> [x,y], M.line(pts, colour, width, dash), M.dot(ll, r, fill, stroke), M.text(t, x, y, {s, c, a})
     hint:{en:'…', zh:'…'},                          // text in the info card before anything is tapped
     onSelect:item => {}, onYear:y => {}
   });
   map.set({ pins, regions, routes, legend });  map.select('rome');  map.setYear(1600);  map.year();  map.redraw();
   Every name / info is bilingual {en, zh}; info may contain simple HTML (<b>, <br>). Nothing autoplays. */
(function(){
  if (window.LabMap) return;
  const LM = window.LabMap = {};
  const L = o => window.Lab ? Lab.L(o) : (o && typeof o === 'object' ? (o.en ?? '') : String(o ?? ''));
  const T = (en, zh) => ({ en, zh });
  const UI = { load:T('Loading map…', '地图加载中…'), off:T('The map needs an internet connection.', '地图需要联网才能加载。'),
    hint:T('Tap a place on the map to learn about it.', '点一点地图上的地方，看看介绍。'), explore:T('🗺️ Explore', '🗺️ 探索'), find:T('🎯 Find it!', '🎯 找一找'),
    zin:T('Zoom in', '放大'), zout:T('Zoom out', '缩小'), reset:T('Reset view', '复位'), play:T('Play', '播放'), pause:T('Pause', '暂停'),
    findq:T('Find: ', '请找出：'), right:T('✔ Right!', '✔ 找对了！'), wrong:T('Not there — try again.', '不是这里，再试一次。'), shown:T('Here it is — look!', '在这里，看一看！'),
    done:T('You found {n} of {t}!', '你找对了 {n} / {t} 个！'), again:T('Play again', '再玩一次'), back:T('Back to exploring', '回到探索'),
    listen:T('🔊 Listen', '🔊 听一听'), note:T('Schematic map · modern borders', '示意图 · 现代国界'), drag:T('Drag to move · tap to choose', '拖动移动 · 点击选择') };
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const strip = s => String(s ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  /* ---------- libraries (loaded once, only when a map is made) ---------- */
  const here = (() => { try { return new URL('.', (document.currentScript && document.currentScript.src) || location.href).href; } catch(e){ return '../shared/'; } })();
  const scripts = {};
  const need = (test, src) => test() ? Promise.resolve() : (scripts[src] || (scripts[src] = new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('load ' + src)); document.head.appendChild(s); })));
  const libs = () => need(() => window.d3 && d3.max, 'https://cdn.jsdelivr.net/npm/d3-array@3.2.4/dist/d3-array.min.js')
    .then(() => need(() => window.d3 && d3.geoPath, 'https://cdn.jsdelivr.net/npm/d3-geo@3.1.0/dist/d3-geo.min.js'))
    .then(() => need(() => window.topojson, 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js'));
  const chinaLib = () => need(() => window.ChinaMap, here + 'chinamap.js');

  /* ---------- names ---------- */
  const WN = 'Kazakhstan:哈萨克斯坦|Uzbekistan:乌兹别克斯坦|Indonesia:印度尼西亚|Timor-Leste:东帝汶|Israel:以色列|Lebanon:黎巴嫩|Palestine:巴勒斯坦|Jordan:约旦|United Arab Emirates:阿联酋|Qatar:卡塔尔|Kuwait:科威特|Iraq:伊拉克|Oman:阿曼|Cambodia:柬埔寨|Thailand:泰国|Laos:老挝|Myanmar:缅甸|Vietnam:越南|North Korea:朝鲜|South Korea:韩国|Mongolia:蒙古|India:印度|Bangladesh:孟加拉国|Bhutan:不丹|Nepal:尼泊尔|Pakistan:巴基斯坦|Afghanistan:阿富汗|Tajikistan:塔吉克斯坦|Kyrgyzstan:吉尔吉斯斯坦|Turkmenistan:土库曼斯坦|Iran:伊朗|Syria:叙利亚|Armenia:亚美尼亚|Sri Lanka:斯里兰卡|China:中国|Taiwan:中国台湾省|Azerbaijan:阿塞拜疆|Georgia:格鲁吉亚|Philippines:菲律宾|Malaysia:马来西亚|Brunei:文莱|Japan:日本|Yemen:也门|Saudi Arabia:沙特阿拉伯|N. Cyprus:北塞浦路斯|Cyprus:塞浦路斯|Turkey:土耳其'
    + '|Tanzania:坦桑尼亚|W. Sahara:西撒哈拉|Dem. Rep. Congo:刚果(金)|Somalia:索马里|Kenya:肯尼亚|Sudan:苏丹|Chad:乍得|South Africa:南非|Lesotho:莱索托|Zimbabwe:津巴布韦|Botswana:博茨瓦纳|Namibia:纳米比亚|Senegal:塞内加尔|Mali:马里|Mauritania:毛里塔尼亚|Benin:贝宁|Niger:尼日尔|Nigeria:尼日利亚|Cameroon:喀麦隆|Togo:多哥|Ghana:加纳|Côte d\'Ivoire:科特迪瓦|Guinea:几内亚|Guinea-Bissau:几内亚比绍|Liberia:利比里亚|Sierra Leone:塞拉利昂|Burkina Faso:布基纳法索|Central African Rep.:中非|Congo:刚果(布)|Gabon:加蓬|Eq. Guinea:赤道几内亚|Zambia:赞比亚|Malawi:马拉维|Mozambique:莫桑比克|eSwatini:斯威士兰|Angola:安哥拉|Burundi:布隆迪|Madagascar:马达加斯加|Gambia:冈比亚|Tunisia:突尼斯|Algeria:阿尔及利亚|Eritrea:厄立特里亚|Morocco:摩洛哥|Egypt:埃及|Libya:利比亚|Ethiopia:埃塞俄比亚|Djibouti:吉布提|Somaliland:索马里兰地区|Uganda:乌干达|Rwanda:卢旺达|S. Sudan:南苏丹'
    + '|Russia:俄罗斯|Norway:挪威|France:法国|Sweden:瑞典|Belarus:白俄罗斯|Ukraine:乌克兰|Poland:波兰|Austria:奥地利|Hungary:匈牙利|Moldova:摩尔多瓦|Romania:罗马尼亚|Lithuania:立陶宛|Latvia:拉脱维亚|Estonia:爱沙尼亚|Germany:德国|Bulgaria:保加利亚|Greece:希腊|Albania:阿尔巴尼亚|Croatia:克罗地亚|Switzerland:瑞士|Luxembourg:卢森堡|Belgium:比利时|Netherlands:荷兰|Portugal:葡萄牙|Spain:西班牙|Ireland:爱尔兰|Italy:意大利|Denmark:丹麦|United Kingdom:英国|Iceland:冰岛|Slovenia:斯洛文尼亚|Finland:芬兰|Slovakia:斯洛伐克|Czechia:捷克|Bosnia and Herz.:波黑|Macedonia:北马其顿|Serbia:塞尔维亚|Montenegro:黑山|Kosovo:科索沃'
    + '|Canada:加拿大|United States of America:美国|Haiti:海地|Dominican Rep.:多米尼加|Bahamas:巴哈马|Greenland:格陵兰岛|Mexico:墨西哥|Panama:巴拿马|Costa Rica:哥斯达黎加|Nicaragua:尼加拉瓜|Honduras:洪都拉斯|El Salvador:萨尔瓦多|Guatemala:危地马拉|Belize:伯利兹|Puerto Rico:波多黎各|Jamaica:牙买加|Cuba:古巴|Trinidad and Tobago:特立尼达和多巴哥'
    + '|Argentina:阿根廷|Chile:智利|Falkland Is.:马尔维纳斯群岛(福克兰群岛)|Uruguay:乌拉圭|Brazil:巴西|Bolivia:玻利维亚|Peru:秘鲁|Colombia:哥伦比亚|Venezuela:委内瑞拉|Guyana:圭亚那|Suriname:苏里南|Ecuador:厄瓜多尔|Paraguay:巴拉圭'
    + '|Australia:澳大利亚|New Zealand:新西兰|Papua New Guinea:巴布亚新几内亚|Fiji:斐济|Vanuatu:瓦努阿图|New Caledonia:新喀里多尼亚|Solomon Is.:所罗门群岛|Antarctica:南极洲|Fr. S. Antarctic Lands:法属南部领地';
  const WZH = {}; WN.split('|').forEach(s => { const i = s.lastIndexOf(':'); WZH[s.slice(0, i)] = s.slice(i + 1); });
  const WEN = { 'United States of America':'United States', 'Dem. Rep. Congo':'DR Congo', 'Central African Rep.':'Central African Republic', 'Bosnia and Herz.':'Bosnia & Herzegovina', 'Taiwan':'Taiwan Province of China', 'Dominican Rep.':'Dominican Republic', 'Eq. Guinea':'Equatorial Guinea', 'S. Sudan':'South Sudan', 'W. Sahara':'Western Sahara', 'Solomon Is.':'Solomon Islands', 'Falkland Is.':'Falkland Islands (Malvinas)', 'Macedonia':'North Macedonia' };
  const SZH = 'Alabama:亚拉巴马州|Alaska:阿拉斯加州|Arizona:亚利桑那州|Arkansas:阿肯色州|California:加利福尼亚州|Colorado:科罗拉多州|Connecticut:康涅狄格州|Delaware:特拉华州|District of Columbia:哥伦比亚特区|Florida:佛罗里达州|Georgia:佐治亚州|Hawaii:夏威夷州|Idaho:爱达荷州|Illinois:伊利诺伊州|Indiana:印第安纳州|Iowa:艾奥瓦州|Kansas:堪萨斯州|Kentucky:肯塔基州|Louisiana:路易斯安那州|Maine:缅因州|Maryland:马里兰州|Massachusetts:马萨诸塞州|Michigan:密歇根州|Minnesota:明尼苏达州|Mississippi:密西西比州|Missouri:密苏里州|Montana:蒙大拿州|Nebraska:内布拉斯加州|Nevada:内华达州|New Hampshire:新罕布什尔州|New Jersey:新泽西州|New Mexico:新墨西哥州|New York:纽约州|North Carolina:北卡罗来纳州|North Dakota:北达科他州|Ohio:俄亥俄州|Oklahoma:俄克拉何马州|Oregon:俄勒冈州|Pennsylvania:宾夕法尼亚州|Rhode Island:罗得岛州|South Carolina:南卡罗来纳州|South Dakota:南达科他州|Tennessee:田纳西州|Texas:得克萨斯州|Utah:犹他州|Vermont:佛蒙特州|Virginia:弗吉尼亚州|Washington:华盛顿州|West Virginia:西弗吉尼亚州|Wisconsin:威斯康星州|Wyoming:怀俄明州|Puerto Rico:波多黎各';
  const UZH = {}; SZH.split('|').forEach(s => { const [en, zh] = s.split(':'); UZH[en] = zh; });

  /* ---------- base data (cached per base) ---------- */
  const DATA = {};
  function loadBase(base){
    if (DATA[base]) return DATA[base];
    let p;
    if (base === 'us') p = libs().then(() => fetch('https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json')).then(r => r.json()).then(t => ({
      feats: topojson.feature(t, t.objects.states).features.map(f => { const n = f.properties.name; f.key = { name:n, en:n, zh:UZH[n] || n, id:f.id }; return f; }),
      mesh: topojson.mesh(t, t.objects.states, (a, b) => a !== b) }));
    else if (base === 'china') p = libs().then(chinaLib).then(() => ChinaMap.load()).then(geo => ({ cn:geo }));
    else p = libs().then(() => fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')).then(r => r.json()).then(t => ({
      feats: topojson.feature(t, t.objects.countries).features.filter(f => f.geometry).map(f => { const n = f.properties.name; f.key = { name:n, en:WEN[n] || n, zh:WZH[n] || n, id:f.id }; return f; }) }))
      .then(d => chinaLib().then(() => ChinaMap.load()).then(cn => (d.cn = cn, d), () => d));   // world map still works if the China map can't load
    DATA[base] = p.catch(e => { delete DATA[base]; throw e; });
    return DATA[base];
  }
  const CHINA = { name:'China', en:'China', zh:'中国', id:'156' };
  const cnKey = f => { const a = f.properties && f.properties.adcode, n = window.ChinaMap && ChinaMap.NAMES[a]; return n ? { name:n.en, en:n.en, zh:n.zh, id:String(a), short:n.short } : { name:(f.properties && f.properties.name) || '', en:(f.properties && f.properties.name) || '', zh:(f.properties && f.properties.name) || '', id:String(a || '') }; };

  /* ---------- styles ---------- */
  const STYLE = `
.lm{display:flex;flex-direction:column;gap:10px}
.lm-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.lm-top .lm-tabs{display:inline-flex;gap:4px;background:var(--surface-2);border-radius:999px;padding:3px}
.lm-top .lm-tabs button{border:0;background:transparent;border-radius:999px;padding:7px 14px;font:inherit;font-weight:800;cursor:pointer;color:var(--ink-2)}
.lm-top .lm-tabs button.on{background:var(--brand);color:var(--brand-ink)}
.lm-stage{position:relative;border:1px solid var(--line);border-radius:var(--radius,16px);overflow:hidden;background:var(--surface-2);touch-action:none;user-select:none}
.lm-stage canvas{display:block;width:100%;height:100%;cursor:pointer}
.lm-zoom{position:absolute;right:12px;top:58px;display:flex;flex-direction:column;gap:6px}
.lm-zoom button{width:40px;height:40px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:800 20px/1 Nunito,sans-serif;cursor:pointer;box-shadow:var(--shadow)}
.lm-zoom button.lm-r{font-size:16px}
.lm-quiz{position:absolute;left:10px;right:60px;top:10px;background:var(--surface);border:2px solid var(--brand);border-radius:14px;padding:8px 12px;font-weight:800;box-shadow:var(--shadow);display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.lm-quiz .lm-msg{font-weight:700;color:var(--ink-2)}
.lm-quiz .lm-msg.good{color:var(--good)}.lm-quiz .lm-msg.bad{color:var(--bad)}
.lm-quiz button{border:0;background:var(--brand);color:var(--brand-ink);border-radius:999px;padding:6px 12px;font:inherit;font-weight:800;cursor:pointer}
.lm-time{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:8px 12px}
.lm-time button{width:44px;height:44px;border-radius:50%;border:0;background:var(--brand);color:var(--brand-ink);font-size:18px;cursor:pointer;flex:none}
.lm-time input{flex:1;accent-color:var(--brand);height:28px}
.lm-time b{font:700 22px Fredoka,Nunito,sans-serif;min-width:5.5em;text-align:right}
.lm-legend{display:flex;flex-wrap:wrap;gap:8px 14px;font-size:14px;color:var(--ink-2)}
.lm-legend span{display:inline-flex;align-items:center;gap:6px}
.lm-legend i{width:14px;height:14px;border-radius:4px;display:inline-block;border:1px solid rgba(0,0,0,.12)}
.lm-legend i.lm-line{height:4px;border-radius:2px;width:22px;border:0}
.lm-info{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 16px;min-height:64px}
.lm-info h4{margin:0 0 4px;font:700 20px Fredoka,Nunito,sans-serif}
.lm-info p{margin:0;line-height:1.55}
.lm-info .lm-hint{color:var(--ink-2)}
.lm-info .speak{margin-top:8px}
.lm-info .lp-fig{margin-top:10px;max-width:420px}
.lm-mini{gap:0}.lm-mini .lm-top,.lm-mini .lm-zoom,.lm-mini .lm-time,.lm-mini .lm-legend,.lm-mini .lm-info{display:none !important}.lm-mini .lm-stage{border-radius:12px}.lm-mini canvas{cursor:default}`;
  function addStyle(){ if (document.getElementById('lm-style')) return; const s = document.createElement('style'); s.id = 'lm-style'; s.textContent = STYLE; document.head.appendChild(s); }

  /* ---------- create ---------- */
  LM.create = (host, opt = {}) => {
    addStyle();
    const el = typeof host === 'string' ? document.querySelector(host) : host;
    const base = opt.base || 'world';
    const S = { pins:opt.pins || [], regions:opt.regions || {}, routes:opt.routes || [], legend:opt.legend || [], year:opt.timeline ? (opt.timeline.value ?? opt.timeline.min) : null,
      sel:null, mode:'explore', data:null, failed:false, k:1, ox:0, oy:0, quiz:null, flash:null, timer:null };
    el.classList.add('lm'); if (opt.mini) el.classList.add('lm-mini');   // mini = small static locator map (place cards): no controls, no info card
    el.innerHTML = `<div class="lm-top"></div><div class="lm-stage"><canvas></canvas><div class="lm-zoom"><button type="button" data-z="in">+</button><button type="button" data-z="out">−</button><button type="button" class="lm-r" data-z="reset">⟲</button></div></div><div class="lm-time" hidden></div><div class="lm-legend"></div><div class="lm-info"></div>`;
    const top = el.querySelector('.lm-top'), stage = el.querySelector('.lm-stage'), cv = stage.querySelector('canvas'), g = cv.getContext('2d');
    if (opt.mini) stage.setAttribute('data-nofs', ''); else stage.setAttribute('data-fs', '');   // fullscreen.js adds its ⤢ button to the map
    const timeEl = el.querySelector('.lm-time'), legEl = el.querySelector('.lm-legend'), info = el.querySelector('.lm-info');
    let W = 0, H = 0, D = 1, proj = null, path = null, s0 = 1, t0 = [0, 0];
    const M = {};   // drawing helpers handed to opt.overlay
    M.xy = ll => { if (!proj) return null; const p = proj(ll); return p && isFinite(p[0]) ? p : null; };
    M.inv = (x, y) => proj && proj.invert ? proj.invert([x, y]) : null;
    M.text = (t, x, y, o = {}) => { g.font = `${o.w || 800} ${o.s || 12}px Nunito, "PingFang SC", "Microsoft YaHei", sans-serif`; g.textAlign = o.a || 'center'; g.textBaseline = 'middle';
      g.lineWidth = 3.4; g.strokeStyle = o.halo || css('--surface') || '#fff'; g.lineJoin = 'round'; g.strokeText(t, x, y); g.fillStyle = o.c || css('--ink'); g.fillText(t, x, y); };
    M.line = (pts, stroke, lw = 2, dash) => { const p = pts.map(M.xy); g.beginPath(); let on = false, prev = null;
      p.forEach(q => { if (!q){ on = false; return; } if (on && prev && Math.abs(q[0] - prev[0]) < W * .6) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); on = true; prev = q; });
      g.setLineDash(dash || []); g.strokeStyle = stroke; g.lineWidth = lw; g.lineJoin = g.lineCap = 'round'; g.stroke(); g.setLineDash([]); return p.filter(Boolean); };
    M.dot = (ll, r, fill, stroke) => { const p = M.xy(ll); if (!p) return null; g.beginPath(); g.arc(p[0], p[1], r, 0, 7); g.fillStyle = fill; g.fill(); if (stroke){ g.lineWidth = 2; g.strokeStyle = stroke; g.stroke(); } return p; };
    M.g = g;

    const visible = it => S.year == null || ((it.from == null || S.year >= it.from) && (it.to == null || S.year <= it.to));
    const keyOf = k => k && (k.name || k.en);
    // find the regions entry for a base feature key (accepts en / zh / Natural-Earth name / id / adcode as keys)
    const regOf = k => { if (!k) return null; const R = S.regions; for (const c of [k.name, k.en, k.zh, k.id, k.short]) if (c != null && R[c] && visible(R[c])) return R[c];
      return null; };
    const pal = () => ({ land:css('--surface') || '#fff', sea:css('--surface-2') || '#eef3f9', ink:css('--ink') || '#14213d', ink2:css('--ink-2') || '#4a5878', brand:css('--brand') || '#0f9d8a', good:css('--good') || '#1aa36b', bad:css('--bad') || '#e0475b', accent:css('--accent') || '#ff7a59' });

    function fit(){
      const r = stage.getBoundingClientRect(); if (!r.width) return false;
      D = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * D; cv.height = H * D;
      const box = [[10, 10], [W - 56, H - 26]];
      if (base === 'us'){ proj = d3.geoAlbersUsa(); proj.fitExtent(box, opt.extent ? { type:'MultiPoint', coordinates:corners(opt.extent) } : { type:'FeatureCollection', features:S.data.feats }); }
      else if (base === 'china'){ const ex = opt.extent || [[73, 17], [135.5, 53.6]]; proj = d3.geoConicEqualArea().parallels([25, 47]).rotate([-((ex[0][0] + ex[1][0]) / 2), 0]).fitExtent(box, { type:'MultiPoint', coordinates:corners(ex) }); }
      else { const ex = opt.extent || [[-170, -58], [180, 78]]; proj = d3.geoNaturalEarth1().rotate([-(opt.rot ?? (ex[0][0] + ex[1][0]) / 2), 0]).fitExtent(box, { type:'MultiPoint', coordinates:corners(ex) }); }
      s0 = proj.scale(); t0 = proj.translate(); applyView(); return true;
    }
    const corners = ([[a, b], [c, e]]) => { const pts = []; for (let i = 0; i <= 48; i++){ const lo = a + (c - a) * i / 48; pts.push([lo, b], [lo, e], [lo, (b + e) / 2]); } return pts; };
    function applyView(){ proj.scale(s0 * S.k).translate([t0[0] * S.k + S.ox, t0[1] * S.k + S.oy]); path = d3.geoPath(proj, g); }

    function drawChina(P, fill, ink2, land){
      const polys = { features:S.data.cn.features.filter(f => f.geometry.type !== 'MultiLineString') }, toS = ll => P(ll);
      S.data.cn.features.forEach(f => { if (f.geometry.type === 'MultiLineString') return; const fc = fill(cnKey(f)); ChinaMap.draw2D(g, { features:[f] }, toS, { fill:fc || land }); });
      g.globalAlpha = .75; ChinaMap.draw2D(g, polys, toS, { stroke:ink2, lineWidth:base === 'china' ? .9 : .6 }); g.globalAlpha = 1;
      ChinaMap.draw2D(g, { features:S.data.cn.features.filter(f => f.geometry.type === 'MultiLineString') }, toS, { stroke:ink2, lineWidth:.8 });
    }
    function draw(){
      const c = pal();
      g.setTransform(D, 0, 0, D, 0, 0); g.clearRect(0, 0, W, H);
      if (!S.data){ g.fillStyle = c.sea; g.fillRect(0, 0, W, H); M.text(L(S.failed ? UI.off : UI.load), W / 2, H / 2, { s:16, c:c.ink2 }); return; }
      if (!proj && !fit()) return;
      g.fillStyle = c.sea; g.fillRect(0, 0, W, H);
      const regFill = k => { const r = regOf(k); return (r && (r.color || c.brand)) || (opt.fill && opt.fill(k.name, k)) || null; };
      if (base === 'world'){ g.beginPath(); path({ type:'Sphere' }); g.fillStyle = c.sea; g.fill(); g.beginPath(); path(d3.geoGraticule10()); g.strokeStyle = c.ink2; g.globalAlpha = .1; g.lineWidth = .6; g.stroke(); g.globalAlpha = 1; }
      if (S.data.feats){
        const useCN = base === 'world' && !!S.data.cn, skip = f => useCN && (f.key.name === 'China' || f.key.name === 'Taiwan');
        S.data.feats.forEach(f => { if (skip(f)) return; g.beginPath(); path(f); g.fillStyle = regFill(f.key) || c.land; g.fill(); });
        g.beginPath(); S.data.feats.forEach(f => { if (!skip(f) && f.key.name !== 'Antarctica') path(f); }); g.strokeStyle = c.ink2; g.lineWidth = base === 'us' ? .8 : .5; g.globalAlpha = .7; g.stroke(); g.globalAlpha = 1;
        if (useCN){ const cf = regFill(CHINA); drawChina(proj, () => cf, c.ink2, c.land); }
        else if (base === 'world'){ const tw = S.data.feats.find(f => f.key.name === 'Taiwan'), cf = regFill(CHINA); if (tw && cf){ g.beginPath(); path(tw); g.fillStyle = cf; g.fill(); } }
      } else if (S.data.cn){ drawChina(proj, regFill, c.ink2, c.land);
        if (opt.baseLabels !== false && !opt.mini){ g.globalAlpha = .55; S.data.cn.features.forEach(f => { if (f.geometry.type === 'MultiLineString') return; const k = cnKey(f), ll = f.properties && (f.properties.centroid || f.properties.center); const p = ll && M.xy(ll);
          if (p && p[0] > 0 && p[0] < W && p[1] > 0 && p[1] < H) M.text(window.Lab && Lab.lang === 'zh' ? k.zh.replace(/(省|市|自治区|壮族|回族|维吾尔|特别行政区)+$/, '').replace(/(壮族|回族|维吾尔)$/, '') : k.en, p[0], p[1], { s:10.5, w:700, c:c.ink2 }); }); g.globalAlpha = 1; } }
      // selected region outline
      const sk = S.sel && S.sel.kind === 'region' ? S.sel.base : null;
      if (sk){ g.lineWidth = 2.4; g.strokeStyle = c.ink;
        if (S.data.feats && !(base === 'world' && S.data.cn && sk.name === 'China')){ const f = S.data.feats.find(f => f.key.name === sk.name); if (f){ g.beginPath(); path(f); g.stroke(); } }
        else if (S.data.cn){ const fs = sk.name === 'China' ? S.data.cn.features : S.data.cn.features.filter(f => cnKey(f).id === sk.id); ChinaMap.draw2D(g, { features:fs.filter(f => f.geometry.type !== 'MultiLineString') }, ll => proj(ll), { stroke:c.ink, lineWidth:2.2 }); } }
      if (S.flash && S.flash.kind === 'region' && S.flash.until > performance.now()){ const fk = S.flash.base; g.lineWidth = 4; g.strokeStyle = S.flash.ok ? c.good : c.accent;
        if (S.data.feats && !(base === 'world' && S.data.cn && fk.name === 'China')){ const f = S.data.feats.find(f => f.key.name === fk.name); if (f){ g.beginPath(); path(f); g.stroke(); } }
        else if (S.data.cn){ const fs = fk.name === 'China' ? S.data.cn.features : S.data.cn.features.filter(f => cnKey(f).id === fk.id); ChinaMap.draw2D(g, { features:fs.filter(f => f.geometry.type !== 'MultiLineString') }, ll => proj(ll), { stroke:S.flash.ok ? c.good : c.accent, lineWidth:4 }); } }
      if (opt.overlay){ g.save(); try { opt.overlay(g, M, S.year); } catch(e){ console.error(e); } g.restore(); }
      // routes
      S.routes.filter(visible).forEach(rt => { const on = S.sel && S.sel.item === rt; const p = M.line(rt.pts, rt.color || c.accent, on ? 5 : 3.2, rt.dash);
        if (p.length > 1 && rt.arrow !== false){ const a = p[p.length - 2], b = p[p.length - 1], an = Math.atan2(b[1] - a[1], b[0] - a[0]), s = on ? 12 : 10;
          g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(b[0] - s * Math.cos(an - .45), b[1] - s * Math.sin(an - .45)); g.lineTo(b[0] - s * Math.cos(an + .45), b[1] - s * Math.sin(an + .45)); g.closePath(); g.fillStyle = rt.color || c.accent; g.fill(); }
        if (rt.label !== false && p.length){ const m = p[Math.floor(p.length / 2)]; M.text(L(rt), m[0], m[1] - 12, { s:12, c:rt.color || c.ink }); } });
      // region labels
      if (opt.regionLabels !== false){ for (const key in S.regions){ const r = S.regions[key]; if (!visible(r) || r.label === false) continue; const ll = r.ll || centerOf(key); const p = ll && M.xy(ll); if (p) M.text(L(r.en || r.zh ? r : nameOf(key)), p[0], p[1], { s:base === 'world' ? 11 : 12, w:800 }); } }
      // pins — pins closer than ~18 px merge into a numbered cluster bubble (tap it to zoom in); the selected pin is always drawn
      const lbls = [], vp = S.pins.filter(visible).map(pn => ({ pn, p:M.xy(pn.ll) })).filter(o => o.p), CL = [];
      vp.forEach(o => { const c0 = S.k < 12 && CL.find(q => Math.hypot(q.x - o.p[0], q.y - o.p[1]) < 30); if (c0){ const n = c0.items.length; c0.x = (c0.x * n + o.p[0]) / (n + 1); c0.y = (c0.y * n + o.p[1]) / (n + 1); c0.items.push(o); } else CL.push({ x:o.p[0], y:o.p[1], items:[o] }); });
      for (let merged = true; merged;){ merged = false;   // bubbles that still touch become one bubble
        for (let i = 0; i < CL.length && !merged; i++) for (let j = i + 1; j < CL.length && !merged; j++){ const a = CL[i], b = CL[j]; if (a.items.length + b.items.length > 2 && Math.hypot(a.x - b.x, a.y - b.y) < 40){ const na = a.items.length, nb = b.items.length; a.x = (a.x * na + b.x * nb) / (na + nb); a.y = (a.y * na + b.y * nb) / (na + nb); a.items.push(...b.items); CL.splice(j, 1); merged = true; } } }
      S.clusters = CL.filter(q => q.items.length > 1);
      const inCluster = new Set(); S.clusters.forEach(q => q.items.forEach(o => inCluster.add(o.pn)));
      S.clusters.forEach(q => { const n = q.items.length, r = n > 9 ? 17 : 15;
        g.beginPath(); g.arc(q.x, q.y, r + 4, 0, 7); g.fillStyle = c.brand; g.globalAlpha = .22; g.fill(); g.globalAlpha = 1;
        g.beginPath(); g.arc(q.x, q.y, r, 0, 7); g.fillStyle = c.brand; g.fill(); g.lineWidth = 2.5; g.strokeStyle = c.land; g.stroke();
        g.font = '800 13px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText(String(n), q.x, q.y + .5); });
      S.pins.filter(visible).forEach(pn => { const p = M.xy(pn.ll); if (!p) return; const on = S.sel && S.sel.item === pn, fl = S.flash && S.flash.item === pn && S.flash.until > performance.now();
        if (inCluster.has(pn) && !on && !fl) return;
        if (fl){ g.beginPath(); g.arc(p[0], p[1], 20, 0, 7); g.fillStyle = S.flash.ok ? c.good : c.accent; g.globalAlpha = .35; g.fill(); g.globalAlpha = 1; }
        if (pn.icon){ g.beginPath(); g.arc(p[0], p[1], on ? 16 : 13, 0, 7); g.fillStyle = c.land; g.fill(); g.lineWidth = on ? 3 : 2; g.strokeStyle = pn.color || c.brand; g.stroke();
          g.font = `${on ? 17 : 15}px "Segoe UI Emoji","Apple Color Emoji",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(pn.icon, p[0], p[1] + 1); }
        else { g.beginPath(); g.arc(p[0], p[1], on ? 10 : 7.5, 0, 7); g.fillStyle = pn.color || c.brand; g.fill(); g.lineWidth = 2.5; g.strokeStyle = c.land; g.stroke(); if (on){ g.lineWidth = 2; g.strokeStyle = c.ink; g.beginPath(); g.arc(p[0], p[1], 13, 0, 7); g.stroke(); } }
        if (opt.labels !== false && S.mode !== 'quiz') lbls.push({ t:L(pn), x:p[0] + (pn.icon ? 17 : 12), y:p[1], on }); });
      // pin labels: selected first, then skip any label that would overlap one already drawn
      g.font = '800 12.5px Nunito, "PingFang SC", "Microsoft YaHei", sans-serif'; const boxes = S.clusters.map(q => [q.x - 21, q.y - 21, q.x + 21, q.y + 21]);   // labels never cover a cluster bubble
      lbls.sort((a, b) => b.on - a.on).forEach(l => { const w = g.measureText(l.t).width, b = [l.x - 2, l.y - 9, l.x + w + 2, l.y + 9];
        if (boxes.some(o => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])) return; boxes.push(b); M.text(l.t, l.x, l.y, { s:12.5, a:'left' }); });
      if (S.flash && S.flash.until > performance.now()) requestAnimationFrame(draw);
      if (base === 'world' && opt.note !== false && !opt.mini) M.text(L(UI.note), 10, H - 11, { s:10, a:'left', c:c.ink2, w:700 });
    }
    const nameOf = key => { const k = findKey(key); return k ? { en:k.en, zh:k.zh } : { en:key, zh:key }; };
    function findKey(key){ if (!S.data) return null; const m = k => [k.name, k.en, k.zh, k.id, k.short].some(v => v != null && String(v) === String(key));
      if (base === 'world' && S.data.cn && m(CHINA)) return CHINA;
      if (S.data.feats){ const f = S.data.feats.find(f => m(f.key)); if (f) return f.key; }
      if (S.data.cn){ const f = S.data.cn.features.find(f => f.geometry.type !== 'MultiLineString' && m(cnKey(f))); if (f) return cnKey(f); }
      return null; }
    const cent = {};
    function centerOf(key){ if (cent[key] !== undefined) return cent[key]; let ll = null; const k = findKey(key);
      if (k){ if (k === CHINA) ll = [104, 35]; else if (S.data.feats && S.data.feats.find(f => f.key === k)) { const f = S.data.feats.find(f => f.key === k); ll = f.properties.labelLL || d3.geoCentroid(f); if (k.name === 'United States of America') ll = [-98, 39]; if (k.name === 'Russia') ll = [95, 62]; if (k.name === 'Canada') ll = [-105, 58]; if (k.name === 'France') ll = [2.5, 46.6]; if (k.name === 'Norway') ll = [9, 61]; }
        else if (S.data.cn){ const f = S.data.cn.features.find(f => cnKey(f) && cnKey(f).id === k.id); ll = f && f.properties && (f.properties.centroid || f.properties.center) || null; } }
      return (cent[key] = ll); }

    // ---------- picking ----------
    function pick(x, y){
      const q = (S.clusters || []).find(q => Math.hypot(q.x - x, q.y - y) < 20);
      if (q) return { kind:'cluster', x:q.x, y:q.y };
      const pins = S.pins.filter(visible);
      let best = null, bd = 20; pins.forEach(pn => { const p = M.xy(pn.ll); if (!p) return; const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd){ bd = d; best = pn; } });
      if (best) return { kind:'pin', item:best, id:best.id };
      let rb = null, rd = 9; S.routes.filter(visible).forEach(rt => { const p = rt.pts.map(M.xy); for (let i = 1; i < p.length; i++){ if (!p[i] || !p[i - 1]) continue; const d = segDist(x, y, p[i - 1], p[i]); if (d < rd){ rd = d; rb = rt; } } });
      if (rb) return { kind:'route', item:rb, id:rb.id };
      const ll = M.inv(x, y); if (!ll || !S.data) return null;
      let k = null;
      if (base === 'world' && S.data.cn && ChinaMap.hit(S.data.cn, ll[0], ll[1])) k = CHINA;
      else if (S.data.feats){ const f = S.data.feats.find(f => d3.geoContains(f, ll)); if (f) k = f.key.name === 'Taiwan' && base === 'world' ? CHINA : f.key; }
      else if (S.data.cn){ const f = ChinaMap.hit(S.data.cn, ll[0], ll[1]); if (f) k = cnKey(f); }
      if (!k) return null;
      const r = regOf(k);
      return { kind:'region', base:k, item:r, id:k.name };
    }
    const segDist = (x, y, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy; let t = l ? ((x - a[0]) * dx + (y - a[1]) * dy) / l : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); };

    // ---------- info card ----------
    function showInfo(){
      const h = S.sel;
      if (!h){ info.innerHTML = `<p class="lm-hint">${esc(L(opt.hint || UI.hint))}</p>`; return; }
      const it = h.item || {}, title = (it.en || it.zh) ? L(it) : L(nameOf(h.id)), body = it.info ? L(it.info) : '';
      info.innerHTML = `<h4>${it.icon ? it.icon + ' ' : ''}${esc(title)}</h4>${body ? `<p>${body}</p>` : ''}${(body || title) && window.Lab && Lab.speak ? `<button type="button" class="speak lm-say">${esc(L(UI.listen))}</button>` : ''}${it.photo && window.LabPhotos ? LabPhotos.figure(it.photo) : ''}`;
      const b = info.querySelector('.lm-say'); if (b) b.onclick = () => Lab.speak(it.say ? L(it.say) : title + (Lab.lang === 'zh' ? '。' : '. ') + strip(body));   // it.say: a fixed sentence (e.g. from the place book) that has a recording
    }
    function select(h){ S.sel = h && (h.item || h.kind === 'region') ? h : (h && h.kind === 'region' ? h : null); showInfo(); draw(); if (S.sel && opt.onSelect) opt.onSelect(S.sel.item || { id:S.sel.id, base:S.sel.base }); }

    // ---------- quiz ("Find it!") ----------
    let qEl = null;
    function quizStart(){
      const items = (opt.quiz && opt.quiz.items || []).filter(q => { const pn = S.pins.find(p => p.id === q.target); return pn ? visible(pn) : !!findKey(q.target); });
      S.quiz = { list:(window.Lab ? Lab.shuffle(items) : items).slice(0, opt.quiz.count || 8), i:0, n:0, tries:0 };
      S.mode = 'quiz'; S.sel = null; info.innerHTML = ''; tabs(); quizShow(); draw();
    }
    function quizLabel(q){ if (q.q) return L(q.q); const pn = S.pins.find(p => p.id === q.target); return L(UI.findq) + (pn ? L(pn) : L(nameOf(q.target))); }
    function quizShow(msg, cls){
      if (!qEl){ qEl = document.createElement('div'); qEl.className = 'lm-quiz'; stage.appendChild(qEl); }
      const Q = S.quiz;
      if (Q.i >= Q.list.length){ qEl.innerHTML = `<span>⭐ ${esc(L(UI.done).replace('{n}', Q.n).replace('{t}', Q.list.length))}</span><button type="button" data-q="again">${esc(L(UI.again))}</button><button type="button" data-q="back">${esc(L(UI.back))}</button>`; }
      else qEl.innerHTML = `<span>🎯 ${esc(quizLabel(Q.list[Q.i]))}</span><span class="lm-msg ${cls || ''}">${esc(msg || '')}</span><span style="margin-left:auto">${Q.i + 1}/${Q.list.length} · ⭐ ${Q.n}</span>`;
      qEl.onclick = e => { const b = e.target.closest('button[data-q]'); if (!b) return; if (b.dataset.q === 'again') quizStart(); else setMode('explore'); };
    }
    function quizTap(h){
      const Q = S.quiz; if (!Q || Q.i >= Q.list.length) return;
      const tgt = Q.list[Q.i].target, k = findKey(tgt);
      const ok = !!h && (h.id === tgt || (h.kind === 'region' && k && h.base && h.base.name === k.name));
      const pn = S.pins.find(p => p.id === tgt);
      if (ok){ Q.n += Q.tries === 0 ? 1 : 0; S.flash = pn ? { item:pn, ok:true, until:performance.now() + 900 } : { kind:'region', base:k, ok:true, until:performance.now() + 900 }; Q.i++; Q.tries = 0; quizShow(L(UI.right), 'good'); draw(); setTimeout(() => { if (S.mode === 'quiz') quizShow(); }, 900); return; }
      Q.tries++;
      if (Q.tries >= 2){ S.flash = pn ? { item:pn, ok:false, until:performance.now() + 1600 } : { kind:'region', base:k, ok:false, until:performance.now() + 1600 }; Q.i++; Q.tries = 0; quizShow(L(UI.shown), 'bad'); draw(); setTimeout(() => { if (S.mode === 'quiz') quizShow(); }, 1600); }
      else quizShow(L(UI.wrong), 'bad');
    }
    function setMode(m){ S.mode = m; if (m !== 'quiz' && qEl){ qEl.remove(); qEl = null; S.quiz = null; } tabs(); if (m === 'explore') showInfo(); draw(); }
    function tabs(){
      const hasQ = opt.quiz && opt.quiz.items && opt.quiz.items.length;
      top.innerHTML = (opt.title ? `<b style="font:700 18px Fredoka,Nunito,sans-serif">${esc(L(opt.title))}</b>` : '') + (hasQ ? `<span class="lm-tabs"><button type="button" data-m="explore" class="${S.mode === 'explore' ? 'on' : ''}">${esc(L(UI.explore))}</button><button type="button" data-m="quiz" class="${S.mode === 'quiz' ? 'on' : ''}">${esc(L(UI.find))}</button></span>` : '') + `<small style="color:var(--ink-2)">${esc(L(UI.drag))}</small>`;
      top.querySelectorAll('button[data-m]').forEach(b => b.onclick = () => b.dataset.m === 'quiz' ? quizStart() : setMode('explore'));
    }

    // ---------- timeline ----------
    const fmtY = y => opt.timeline && opt.timeline.fmt ? opt.timeline.fmt(y) : (y < 0 ? (window.Lab && Lab.lang === 'zh' ? `公元前${-y}年` : `${-y} BCE`) : (window.Lab && Lab.lang === 'zh' ? `${y}年` : String(y)));
    function timeline(){
      const tl = opt.timeline; if (!tl){ timeEl.hidden = true; return; }
      timeEl.hidden = false;
      timeEl.innerHTML = `${tl.play !== false ? `<button type="button" class="lm-play" title="${esc(L(UI.play))}">▶</button>` : ''}<input type="range" min="${tl.min}" max="${tl.max}" step="${tl.step || 1}" value="${S.year}" aria-label="${esc(L(tl.label || T('Year', '年份')))}"><b>${esc(fmtY(S.year))}</b>`;
      const r = timeEl.querySelector('input'), pb = timeEl.querySelector('.lm-play');
      r.oninput = () => { stopPlay(); setYear(+r.value); };
      if (pb) pb.onclick = () => { if (S.timer){ stopPlay(); return; } if (S.year >= tl.max) setYear(tl.min); pb.textContent = '⏸'; S.timer = setInterval(() => { const n = Math.min(tl.max, S.year + (tl.step || 1)); setYear(n); if (n >= tl.max) stopPlay(); }, tl.ms || 450); };
    }
    function stopPlay(){ if (S.timer){ clearInterval(S.timer); S.timer = null; } const pb = timeEl.querySelector('.lm-play'); if (pb) pb.textContent = '▶'; }
    function setYear(y){ S.year = y; const r = timeEl.querySelector('input'), b = timeEl.querySelector('b'); if (r && +r.value !== y) r.value = y; if (b) b.textContent = fmtY(y);
      if (S.sel && S.sel.item && !visible(S.sel.item)){ S.sel = null; showInfo(); } draw(); if (opt.onYear) opt.onYear(y); }

    function legend(){ legEl.innerHTML = (S.legend || []).map(l => `<span><i class="${l.line ? 'lm-line' : ''}" style="background:${esc(l.color)}"></i>${esc(L(l))}</span>`).join(''); legEl.hidden = !S.legend.length; }

    // ---------- pointer: drag to pan, tap to choose, wheel / buttons to zoom ----------
    let drag = null;
    cv.addEventListener('pointerdown', e => { if (opt.mini) return; drag = { x:e.clientX, y:e.clientY, ox:S.ox, oy:S.oy, moved:false }; try { cv.setPointerCapture(e.pointerId); } catch(_){} });
    cv.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (!drag.moved && Math.hypot(dx, dy) < 6) return; drag.moved = true; if (!proj) return; S.ox = drag.ox + dx; S.oy = drag.oy + dy; applyView(); draw(); });
    cv.addEventListener('pointerup', e => { const d = drag; drag = null; if (!d || d.moved) return; tap(e); });
    cv.addEventListener('pointercancel', () => { drag = null; });
    cv.addEventListener('click', e => { if (e.isTrusted === false && !e.pointerId) tap(e); });   // synthetic clicks (tests, keyboard)
    function tap(e){ if (!proj || opt.mini) return; const r = cv.getBoundingClientRect(), h = pick(e.clientX - r.left, e.clientY - r.top);
      if (h && h.kind === 'cluster'){ zoom(2.5, h.x, h.y); return; }   // a numbered bubble: zoom in so its places separate
      if (S.mode === 'quiz') quizTap(h); else select(h); }
    cv.addEventListener('wheel', e => { if (!proj || opt.mini) return; e.preventDefault(); const r = cv.getBoundingClientRect(); zoom(e.deltaY < 0 ? 1.25 : 0.8, e.clientX - r.left, e.clientY - r.top); }, { passive:false });
    function zoom(f, cx = W / 2, cy = H / 2){ const k = Math.max(1, Math.min(12, S.k * f)); f = k / S.k; if (f === 1 && k === 1){ S.ox = S.oy = 0; }
      S.ox = cx - (cx - S.ox) * f; S.oy = cy - (cy - S.oy) * f; S.k = k; if (k === 1){ S.ox = 0; S.oy = 0; } applyView(); draw(); }
    stage.querySelector('.lm-zoom').onclick = e => { const b = e.target.closest('button[data-z]'); if (!b || !proj) return; if (b.dataset.z === 'reset'){ S.k = 1; S.ox = S.oy = 0; applyView(); draw(); } else zoom(b.dataset.z === 'in' ? 1.5 : 1 / 1.5); };
    function labels(){ const z = stage.querySelectorAll('.lm-zoom button'); z[0].title = L(UI.zin); z[1].title = L(UI.zout); z[2].title = L(UI.reset); }

    // ---------- size ----------
    function size(){ const w = el.getBoundingClientRect().width || 600, h = opt.height || 440; stage.style.height = Math.round(opt.mini ? h : w < 560 ? Math.max(260, Math.min(h * .78, w * .95)) : h) + 'px'; proj = null; if (S.data) fit(); draw(); }
    if (window.ResizeObserver){ let last = 0; new ResizeObserver(() => { const w = Math.round(el.getBoundingClientRect().width); if (w && w !== last){ last = w; size(); } }).observe(el);
      let sw = 0, sh = 0; new ResizeObserver(() => { const r = stage.getBoundingClientRect(); if (Math.round(r.width) !== sw || Math.round(r.height) !== sh){ sw = Math.round(r.width); sh = Math.round(r.height); if (S.data){ proj = null; fit(); draw(); } } }).observe(stage); }
    else addEventListener('resize', size);

    const api = {
      el, set(o = {}){ if (o.pins) S.pins = o.pins; if (o.regions) S.regions = o.regions; if (o.routes) S.routes = o.routes; if (o.legend){ S.legend = o.legend; legend(); } for (const k in cent) delete cent[k]; if (S.sel && !(S.sel.kind === 'region') && ![...S.pins, ...S.routes].includes(S.sel.item)){ S.sel = null; showInfo(); } draw(); return api; },
      select(id){ const pn = S.pins.find(p => p.id === id) || S.routes.find(r => r.id === id); if (pn) select({ kind:S.pins.includes(pn) ? 'pin' : 'route', item:pn, id }); else { const k = findKey(id); if (k) select({ kind:'region', base:k, item:regOf(k), id:k.name }); } return api; },
      setYear(y){ setYear(y); return api; }, year:() => S.year, redraw(){ draw(); return api; }, xy:M.xy, helpers:M
    };
    const relang = () => { tabs(); timeline(); legend(); labels(); if (S.mode === 'quiz' && S.quiz) quizShow(); else showInfo(); draw(); };
    tabs(); timeline(); legend(); labels(); showInfo(); size();
    if (window.Lab && Lab.onLang) Lab.onLang(relang);
    loadBase(base).then(d => { S.data = d; proj = null; fit(); draw(); }, e => { console.warn('LabMap: base map unavailable', e); S.failed = true; draw(); });
    return api;
  };
})();
