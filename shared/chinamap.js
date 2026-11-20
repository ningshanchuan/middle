/* ChinaMap — loads mainland-standard province boundaries (incl. 南海诸岛) and helps draw them in 2D or 3D.
   Source: Alibaba DataV GeoAtlas (areas_v3, 100000_full) — fallback: ECharts 4.9 china.json (decoded).
   ---------------------------------------------------------------------------------------------------
   const geo = await ChinaMap.load();                // GeoJSON FeatureCollection; feature.properties: {name, adcode, center:[lon,lat], ...}
   ChinaMap.NAMES[adcode] -> {zh, en, short}         // 34 provincial-level divisions (Chinese / English / abbreviation 简称)
   const P = ChinaMap.projector({ center:[104.5, 36], scale:1 });   // lon/lat -> plane x,y (equirectangular with cos(lat0) correction)
   ChinaMap.draw2D(ctx, geo, toScreen, { fill:f => '#...', stroke:'#...', lineWidth:1 });  // toScreen([x,y]) -> [px,py]
   ChinaMap.shapes3D(THREE, feature, P) -> THREE.Shape[]  // use with ExtrudeGeometry for 3D provinces (x = east, y = north)
   ChinaMap.hit(geo, lon, lat) -> feature | null     // point-in-polygon picking
   Use a graceful fallback message if loading fails (offline).                                                       */
(function(){
  const CM = window.ChinaMap = {};
  CM.SOURCES = [
    'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
    'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json'
  ];
  CM.NAMES = {
    110000:{zh:'北京市',en:'Beijing',short:'京'}, 120000:{zh:'天津市',en:'Tianjin',short:'津'}, 130000:{zh:'河北省',en:'Hebei',short:'冀'},
    140000:{zh:'山西省',en:'Shanxi',short:'晋'}, 150000:{zh:'内蒙古自治区',en:'Inner Mongolia',short:'内蒙古'}, 210000:{zh:'辽宁省',en:'Liaoning',short:'辽'},
    220000:{zh:'吉林省',en:'Jilin',short:'吉'}, 230000:{zh:'黑龙江省',en:'Heilongjiang',short:'黑'}, 310000:{zh:'上海市',en:'Shanghai',short:'沪'},
    320000:{zh:'江苏省',en:'Jiangsu',short:'苏'}, 330000:{zh:'浙江省',en:'Zhejiang',short:'浙'}, 340000:{zh:'安徽省',en:'Anhui',short:'皖'},
    350000:{zh:'福建省',en:'Fujian',short:'闽'}, 360000:{zh:'江西省',en:'Jiangxi',short:'赣'}, 370000:{zh:'山东省',en:'Shandong',short:'鲁'},
    410000:{zh:'河南省',en:'Henan',short:'豫'}, 420000:{zh:'湖北省',en:'Hubei',short:'鄂'}, 430000:{zh:'湖南省',en:'Hunan',short:'湘'},
    440000:{zh:'广东省',en:'Guangdong',short:'粤'}, 450000:{zh:'广西壮族自治区',en:'Guangxi',short:'桂'}, 460000:{zh:'海南省',en:'Hainan',short:'琼'},
    500000:{zh:'重庆市',en:'Chongqing',short:'渝'}, 510000:{zh:'四川省',en:'Sichuan',short:'川/蜀'}, 520000:{zh:'贵州省',en:'Guizhou',short:'黔/贵'},
    530000:{zh:'云南省',en:'Yunnan',short:'滇/云'}, 540000:{zh:'西藏自治区',en:'Tibet (Xizang)',short:'藏'}, 610000:{zh:'陕西省',en:'Shaanxi',short:'陕/秦'},
    620000:{zh:'甘肃省',en:'Gansu',short:'甘/陇'}, 630000:{zh:'青海省',en:'Qinghai',short:'青'}, 640000:{zh:'宁夏回族自治区',en:'Ningxia',short:'宁'},
    650000:{zh:'新疆维吾尔自治区',en:'Xinjiang',short:'新'}, 710000:{zh:'台湾省',en:'Taiwan',short:'台'}, 810000:{zh:'香港特别行政区',en:'Hong Kong SAR',short:'港'},
    820000:{zh:'澳门特别行政区',en:'Macao SAR',short:'澳'}
  };
  const ZH2CODE = {}; for (const k in CM.NAMES) ZH2CODE[CM.NAMES[k].zh] = +k;

  function decodeEcharts(json){                 // ECharts 4 "UTF8Encoding" compressed coordinates
    if (!json.UTF8Encoding) return json;
    const sc = json.UTF8Scale || 1024;
    const dec = (s, off) => { const out = []; let px = off[0], py = off[1];
      for (let i = 0; i < s.length; i += 2){ let x = s.charCodeAt(i) - 64, y = s.charCodeAt(i + 1) - 64;
        x = (x >> 1) ^ (-(x & 1)); y = (y >> 1) ^ (-(y & 1)); x += px; y += py; px = x; py = y; out.push([x / sc, y / sc]); }
      return out; };
    json.features.forEach(f => { const g = f.geometry; if (!g) return;
      if (g.type === 'Polygon') g.coordinates = g.coordinates.map((c, i) => dec(c, g.encodeOffsets[i]));
      else if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.map((p, j) => p.map((c, i) => dec(c, g.encodeOffsets[j][i])));
      const code = ZH2CODE[f.properties.name] || ZH2CODE[Object.keys(ZH2CODE).find(z => z.startsWith(f.properties.name))];
      if (code) f.properties.adcode = code;
    });
    json.UTF8Encoding = false; return json;
  }
  let cache = null;
  CM.load = () => cache || (cache = (async () => {
    let lastErr;
    for (const url of CM.SOURCES){
      try {
        const r = await fetch(url, { referrerPolicy: 'no-referrer' }); if (!r.ok) throw new Error(r.status);   // no referrer: DataV answers 403 to our site
        const j = decodeEcharts(await r.json());
        j.features = j.features.filter(f => f.geometry && (f.geometry.coordinates || []).length);
        j.features.forEach(f => { const p = f.properties; if (!p.adcode && ZH2CODE[p.name]) p.adcode = ZH2CODE[p.name];
          const n = CM.NAMES[p.adcode]; if (n){ p.zh = n.zh; p.en = n.en; p.short = n.short; }
          if (!p.center && !p.cp){ const b = CM.bbox(f); p.center = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]; } if (!p.center) p.center = p.cp; });
        return j;
      } catch(e){ lastErr = e; }
    }
    throw lastErr || new Error('China map unavailable');
  })());
  CM.rings = f => { const g = f.geometry; return g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : g.type === 'MultiLineString' ? [g.coordinates] : []; };
  CM.bbox = f => { let b = [180, 90, -180, -90]; CM.rings(f).forEach(poly => poly.forEach(ring => ring.forEach(([x, y]) => { b[0] = Math.min(b[0], x); b[1] = Math.min(b[1], y); b[2] = Math.max(b[2], x); b[3] = Math.max(b[3], y); }))); return b; };
  CM.projector = (o = {}) => { const c = o.center || [104.5, 36], k = o.scale || 1, cl = Math.cos(c[1] * Math.PI / 180);
    const P = ([lon, lat]) => [(lon - c[0]) * cl * k, (lat - c[1]) * k];
    P.inv = ([x, y]) => [x / (cl * k) + c[0], y / k + c[1]]; return P; };
  CM.draw2D = (ctx, geo, toScreen, o = {}) => {
    geo.features.forEach(f => {
      ctx.beginPath();
      CM.rings(f).forEach(poly => poly.forEach(ring => ring.forEach((pt, i) => { const [x, y] = toScreen(pt); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); })));
      if (f.geometry.type !== 'MultiLineString'){ const fill = typeof o.fill === 'function' ? o.fill(f) : o.fill; if (fill){ ctx.fillStyle = fill; ctx.fill('evenodd'); } }
      const st = typeof o.stroke === 'function' ? o.stroke(f) : o.stroke; if (st){ ctx.strokeStyle = st; ctx.lineWidth = o.lineWidth || 1; ctx.stroke(); }
    });
  };
  CM.shapes3D = (THREE, f, P) => {
    const shapes = [];
    CM.rings(f).forEach(poly => { if (!poly.length || poly[0].length < 3) return;
      const s = new THREE.Shape(poly[0].map(pt => new THREE.Vector2(...P(pt))));
      for (let h = 1; h < poly.length; h++) if (poly[h].length > 2) s.holes.push(new THREE.Path(poly[h].map(pt => new THREE.Vector2(...P(pt)))));
      shapes.push(s); });
    return shapes;
  };
  const inRing = (x, y, ring) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++){ const [xi, yi] = ring[i], [xj, yj] = ring[j]; if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  CM.hit = (geo, lon, lat) => geo.features.find(f => f.geometry.type !== 'MultiLineString' && CM.rings(f).some(poly => inRing(lon, lat, poly[0]) && !poly.slice(1).some(h => inRing(lon, lat, h)))) || null;
})();
