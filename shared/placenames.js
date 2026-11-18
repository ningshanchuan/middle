/* LabPlaces — adds the modern name after an ancient place name in China history lessons, e.g.
     中文: 长安（今陕西西安）     English: Chang’an (today’s Xi’an)
   Auto-loaded by lab.js on pages with <body data-subject="china">. Each name is glossed once per paragraph/item,
   and skipped when the text right after it already gives the modern name (“今…” / “today…”).
   Canvas/SVG map labels are drawn by the page itself — add modern names there by hand (e.g. “长安（今西安）”).
   To add a name: ZH['古名'] = '今省市'; EN['Pinyin'] = 'Modern'. Use names as in the 统编版 textbooks.        */
(function(){
  if (window.LabPlaces) return;
  // ancient (Chinese) -> modern location, as usually given in textbooks (今…)
  const ZH = {
    // prehistoric & early sites
    '周口店':'北京房山','河姆渡':'浙江余姚','半坡':'陕西西安','良渚':'浙江杭州余杭','陶寺':'山西襄汾','三星堆':'四川广汉',
    '二里头':'河南洛阳偃师','殷墟':'河南安阳',
    // capitals
    '镐京':'陕西西安西南','洛邑':'河南洛阳','咸阳城':'陕西咸阳东北','秦都咸阳':'陕西咸阳东北','长安':'陕西西安','大梁':'河南开封',
    '临淄':'山东淄博','郢都':'湖北荆州','蓟城':'北京','建康':'江苏南京','建业':'江苏南京','金陵':'江苏南京','平城':'山西大同',
    '江陵':'湖北荆州','大兴城':'陕西西安','辽上京':'内蒙古巴林左旗','兴庆府':'宁夏银川','会宁府':'黑龙江哈尔滨阿城','金中都':'北京西南部',
    '哈拉和林':'蒙古国哈尔和林','临洮':'甘肃岷县','辽东':'辽宁东南部','汴京':'河南开封','汴梁':'河南开封','东京开封府':'河南开封','临安':'浙江杭州','元大都':'北京','燕京':'北京',
    '应天府':'江苏南京','北平':'北京','盛京':'辽宁沈阳','逻些':'西藏拉萨','江宁':'江苏南京','天京':'江苏南京',
    '奉天':'辽宁沈阳','新京':'吉林长春','迪化':'新疆乌鲁木齐','归绥':'内蒙古呼和浩特','姑苏':'江苏苏州','钱塘':'浙江杭州',
    '会稽':'浙江绍兴','陇西郡':'甘肃一带','楚州':'江苏淮安','广陵':'江苏扬州','江都':'江苏扬州','番禺':'广东广州','寿春':'安徽寿县',
    // canals, passes & works
    '涿郡':'北京','余杭':'浙江杭州','玉门关':'甘肃敦煌西北','阳关':'甘肃敦煌西南','灵渠':'广西兴安','赵州':'河北赵县',
    '镇南关':'广西友谊关','云冈石窟':'山西大同','龙门石窟':'河南洛阳',
    // battles
    '牧野':'河南新乡','殷都':'河南安阳','城濮':'山东鄄城西南','巨鹿':'河北平乡西南','大泽乡':'安徽宿州东南','淝水':'安徽寿县一带',
    '赤壁':'湖北赤壁西北一带','澶州':'河南濮阳','牛庄':'辽宁营口','登州':'山东烟台','官渡':'河南中牟东北','长平':'山西高平','朝歌':'河南淇县','邺城':'河北临漳','黎阳':'河南浚县',
    '乌巢':'河南封丘、延津一带','许都':'河南许昌','乌林':'湖北洪湖','夏口':'湖北武汉','寿阳':'安徽寿县','洛涧':'安徽淮南一带',
    // regions
    '西域':'玉门关、阳关以西','中原':'黄河中下游一带','岭南':'广东、广西一带','关中':'陕西渭河平原','巴蜀':'四川、重庆一带',
    '漠北':'蒙古高原北部','交趾':'越南北部','吐蕃':'青藏高原','南诏':'云南一带','夷洲':'台湾','流求':'台湾','琼州':'海南海口一带',
    // Western Regions & Silk Road
    '乌垒':'新疆轮台东','楼兰':'新疆罗布泊西北','龟兹':'新疆库车','于阗':'新疆和田','疏勒':'新疆喀什','高昌':'新疆吐鲁番东南',
    '大宛':'中亚费尔干纳盆地','大月氏':'中亚阿姆河流域','安息国':'伊朗','大秦':'即罗马帝国','天竺':'印度','身毒':'印度','波斯':'伊朗',
    '大食':'即阿拉伯帝国','君士坦丁堡':'土耳其伊斯坦布尔','葱岭':'帕米尔高原','条支':'西亚一带','外兴安岭':'俄罗斯斯塔诺夫山脉','平城京':'日本奈良','康居':'哈萨克斯坦南部一带','鄯善国':'新疆若羌一带','伊吾':'新疆哈密',
    '凉州':'甘肃武威','沙州':'甘肃敦煌','素叶城':'吉尔吉斯斯坦托克马克','飒秣建':'乌兹别克斯坦撒马尔罕','缚喝':'阿富汗巴尔赫',
    '梵衍那':'阿富汗巴米扬','犍陀罗':'巴基斯坦白沙瓦一带','迦湿弥罗':'克什米尔','那烂陀寺':'印度比哈尔邦','明州':'浙江宁波',
    '振州':'海南三亚','萨摩':'日本鹿儿岛','上都':'内蒙古正蓝旗','倭国':'日本','新罗':'朝鲜半岛东南部',
    // Zheng He
    '刘家港':'江苏太仓','占城':'越南中南部','苏门答剌':'印度尼西亚苏门答腊岛北部','阿丹':'也门亚丁','麻林':'肯尼亚马林迪',
    '天方':'沙特阿拉伯麦加','古里':'印度卡利卡特','忽鲁谟斯':'伊朗霍尔木兹','满剌加':'马来西亚马六甲','锡兰山':'斯里兰卡','木骨都束':'索马里摩加迪沙',
    // Qing & modern
    '雅克萨':'俄罗斯阿尔巴津诺','尼布楚':'俄罗斯涅尔琴斯克','库页岛':'俄罗斯萨哈林岛','海参崴':'俄罗斯符拉迪沃斯托克',
    '广州湾':'广东湛江','威海卫':'山东威海'
  };
  // ancient (English / pinyin as written in the lessons) -> modern
  const EN = {
    'Zhoukoudian':'Fangshan, Beijing','Hemudu':'Yuyao, Zhejiang','Banpo':'Xi’an','Liangzhu':'Hangzhou','Taosi':'Xiangfen, Shanxi',
    'Sanxingdui':'Guanghan, Sichuan','Erlitou':'Yanshi, Luoyang','Yinxu':'Anyang','Haojing':'near Xi’an','Luoyi':'Luoyang',
    'Chang’an':'Xi’an','Daliang':'Kaifeng','Linzi':'Zibo, Shandong','Jiankang':'Nanjing','Jianye':'Nanjing','Jinling':'Nanjing',
    'Pingcheng':'Datong','Bianjing':'Kaifeng','Bianliang':'Kaifeng','Lin’an':'Hangzhou','Dadu':'Beijing','Khanbaliq':'Beijing',
    'Yanjing':'Beijing','Yingtian':'Nanjing','Beiping':'Beijing','Peiping':'Beijing','Shengjing':'Shenyang','Mukden':'Shenyang',
    'Fengtian':'Shenyang','Luoxie':'Lhasa','Jiangning':'Nanjing','Tianjing':'Nanjing','Hsinking':'Changchun','Xinjing':'Changchun',
    'Dihua':'Ürümqi','Guisui':'Hohhot','Gusu':'Suzhou','Kuaiji':'Shaoxing','Longxi':'Gansu','Guangling':'Yangzhou','Jiangdu':'Yangzhou',
    'Shouchun':'Shou County, Anhui','Zhuojun':'Beijing','Yuhang':'Hangzhou','Yumen Pass':'northwest of Dunhuang',
    'Yang Pass':'southwest of Dunhuang','Lingqu':'Xing’an, Guangxi','Zhennan Pass':'Friendship Pass, Guangxi','Muye':'Xinxiang, Henan',
    'Guandu':'near Zhongmou, Henan','Wulei':'near Luntai, Xinjiang','Loulan':'near Lop Nur, Xinjiang',
    'Qiuci':'Kuqa, Xinjiang','Yutian':'Hotan, Xinjiang','Khotan':'Hotan, Xinjiang','Shule':'Kashgar','Gaochang':'near Turpan',
    'Dayuan':'the Fergana Valley','Da Yuezhi':'the Amu Darya region','Parthia':'Iran','Daqin':'=the Roman Empire',
    'Tianzhu':'India','Persia':'Iran','Constantinople':'Istanbul','Calicut':'Kozhikode, India','Guli':'Kozhikode, India',
    'Albazin':'Albazino, Russia','Haishenwai':'Vladivostok','Guangzhouwan':'Zhanjiang',
    'Weihaiwei':'Weihai','Jiaozhi':'northern Vietnam','Zhaoge':'Qi County, Henan','Xiakou':'Wuhan',
    'Kangju':'southern Kazakhstan','Liangzhou':'Wuwei, Gansu','Suyab':'Tokmok, Kyrgyzstan','Gandhara':'around Peshawar, Pakistan',
    'Mingzhou':'Ningbo','Satsuma':'Kagoshima, Japan','Liujiagang':'Taicang, Jiangsu','Champa':'central and southern Vietnam',
    'Shangdu':'Zhenglan Banner, Inner Mongolia','Xanadu':'Zhenglan Banner, Inner Mongolia','Shazhou':'Dunhuang','Chengpu':'southwest of Juancheng, Shandong','Julu':'Pingxiang, Hebei','Dazexiang':'near Suzhou, Anhui',
    'Chanzhou':'Puyang, Henan','Niuzhuang':'Yingkou, Liaoning','Dengzhou':'Yantai, Shandong','Daxing City':'Xi’an','Xingqing':'Yinchuan','Karakorum':'Kharkhorin, Mongolia','Lintao':'Min County, Gansu'
  };
  // false-friend guards: text right before / after the match that means it is NOT the ancient place
  const NOT_AFTER = { '长安':/^街/, '北平':/^原/, '琼州':/^海峡/, '阳关':/^三叠/, '平城':/^[市区京]/, '波斯':/^湾/, '钱塘':/^[江潮]/,
    '西域':/^(都护|记|传)/, '中原':/^(解放区|野战军|大战|突围|军区)/, '占城':/^稻/, '赤壁':/^市/, '临安':/^[区市]/, 'Dadu':/^\s*River/i, 'Jiangning':/^\s*District/i };
  const NOT_BEFORE = { '北平':/华$/, '长安':/[西东]$/, '周口店':/北京$/ };
  const LP = window.LabPlaces = { zh:ZH, en:EN };
  const css = document.createElement('style');
  css.textContent = `.lp-jin{font-size:.82em;font-weight:600;color:var(--ink-2,#4a5878);white-space:nowrap}`;
  document.head.appendChild(css);
  const isZh = () => (window.Lab ? Lab.lang === 'zh' : (document.documentElement.lang || '').startsWith('zh'));
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const mk = (keys, en) => new RegExp((en ? '\\b(' : '(') + keys.sort((a, b) => b.length - a.length).map(k => en ? esc(k).replace(/’/g, "['’]") : esc(k)).join('|') + (en ? ')\\b' : ')'), 'g');
  const RZH = mk(Object.keys(ZH), false), REN = mk(Object.keys(EN), true);
  const norm = k => k.replace(/'/g, '’');
  const SKIP = 'script,style,textarea,input,select,option,code,pre,svg,title,.katex,.lab-nav,.lp-jin,rt,[data-noplace],[contenteditable],button,h1,h2,h3,.tbtn,.seg,.pill,.lab-label3d,.lab-hover,.eyebrow,.tag';
  const BLOCK = 'section,.card,.info,.qtext,.opts,.explain,.feedback,details,.lp-card,.lp-view,figure,li';
  const seenMap = new WeakMap();
  const gloss = (name, zh) => { const s = document.createElement('span'); s.className = 'lp-jin';
    const v = zh ? ZH[name] : EN[norm(name)];
    s.textContent = zh ? (v.startsWith('即') ? '（' + v + '）' : '（今' + v + '）') : (v.startsWith('=') ? ' (= ' + v.slice(1) + ')' : ' (today: ' + v + ')'); s.dataset.place = name; return s; };
  // already glossed by the author right after the name?
  const hasModern = (after, zh) => zh ? /^[^。；！？\n]{0,14}今/.test(after) : /^[^.;!?\n]{0,32}\b(today|now|modern)/i.test(after);
  // should this occurrence be skipped? (false friend, inside 《title》, modern name already nearby, author already glossed)
  function skip(key, before, after, zh){
    if ((NOT_AFTER[key] && NOT_AFTER[key].test(after)) || (NOT_BEFORE[key] && NOT_BEFORE[key].test(before))) return true;
    if (zh && before.lastIndexOf('《') > before.lastIndexOf('》')) return true;
    if (hasModern(after, zh)) return true;
    const v = (zh ? ZH[key] : EN[key]) || '', core = zh ? v.replace(/^即/, '').replace(/一带$/, '').slice(-2) : v.replace(/^=/, '').split(',')[0];
    return !!core && (before.slice(zh ? -10 : -40) + after.slice(0, zh ? 10 : 40)).includes(core);
  }
  const textBefore = n => { let s = ''; for (let p = n.previousSibling; p && s.length < 60; p = p.previousSibling) s = (p.textContent || '') + s; return s; };
  const textAfter = n => { let s = ''; for (let p = n.nextSibling; p && s.length < 60; p = p.nextSibling) s += (p.textContent || ''); return s; };
  function seenFor(box){ const s = new Set(); box.querySelectorAll('.lp-jin').forEach(g => s.add(g.dataset.place)); return s; }
  function doText(node, zh){
    const text = node.nodeValue, re = zh ? RZH : REN; if (!text) return;
    re.lastIndex = 0; if (!re.test(text)) return;   // fast path: no place name in this text
    // only in real sentences — not in short labels, chips or keyword buttons
    let host = node.parentElement;   // nearest non-inline box (a chip, summary, paragraph, card…)
    while (host && host !== document.body && getComputedStyle(host).display === 'inline') host = host.parentElement;
    host = host || node.parentElement;
    if ((host.textContent || '').trim().length < (zh ? 20 : 40)) return;
    const box = node.parentElement.closest(BLOCK) || node.parentElement, seen = seenFor(box);
    re.lastIndex = 0; let m, last = 0, frag = null;
    while ((m = re.exec(text))){
      const name = m[0], key = zh ? name : norm(name);
      const after = text.slice(m.index + name.length) + textAfter(node), before = textBefore(node) + text.slice(0, m.index);
      if (seen.has(key) || skip(key, before, after, zh)) continue;
      seen.add(key); frag = frag || document.createDocumentFragment();
      let end = m.index + name.length;
      if (zh){ const suf = /^(城|桥|宫|殿|寺|塔|楼|府|郡|县|港|湾|关|渠|窟|遗址|古城|城墙)/.exec(after); if (suf) end += suf[0].length; }
      else { const suf = /^\s+(City|Bridge|Palace|Temple|Pass|Prefecture|Commandery|site|ruins)\b/.exec(after); if (suf) end += suf[0].length; }
      frag.appendChild(document.createTextNode(text.slice(last, end)));
      frag.appendChild(gloss(key, zh)); last = end; re.lastIndex = Math.max(re.lastIndex, end);
    }
    if (!frag) return;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  // a place name that pinyin.js already wrapped in <ruby>: put the gloss after the ruby
  function doRuby(r, zh){
    const name = r.firstChild && r.firstChild.nodeValue; if (!zh || !name || !ZH[name]) return;
    const nx = r.nextSibling; if (nx && nx.nodeType === 1 && nx.classList.contains('lp-jin')) return;
    if (skip(name, textBefore(r), textAfter(r), true)) return;
    const box = r.parentElement.closest(BLOCK) || r.parentElement, seen = seenFor(box);
    if (seen.has(name)) return; seen.add(name); r.after(gloss(name, true));
  }
  function process(root){
    if (!root) return; const zh = isZh();
    if (root.nodeType === 3) root = root.parentElement; if (!root || root.nodeType !== 1 || root.closest(SKIP)) return;
    const test = zh ? /[一-鿿]/ : /[A-Z]/;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n =>
      (n.nodeValue && test.test(n.nodeValue) && n.parentElement && !n.parentElement.closest(SKIP + ',ruby')) ? 1 : 2 });
    const list = []; while (tw.nextNode()) list.push(tw.currentNode);
    list.forEach(n => { if (n.parentNode) doText(n, zh); });
    if (zh) root.querySelectorAll('ruby.lpy').forEach(r => doRuby(r, zh));
    if (zh && root.matches && root.matches('ruby.lpy')) doRuby(root, zh);
  }
  function strip(){ document.querySelectorAll('.lp-jin').forEach(g => { const p = g.parentNode; g.remove(); if (p) p.normalize(); }); }
  LP.refresh = () => { strip(); process(document.body); };
  let queue = new Set(), raf = 0;
  const mo = new MutationObserver(ms => {
    for (const m of ms){
      if (m.type === 'characterData') queue.add(m.target);
      else m.addedNodes.forEach(n => { if (!(n.nodeType === 1 && n.classList && n.classList.contains('lp-jin'))) queue.add(n); });
    }
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; const q = [...queue]; queue.clear(); q.forEach(n => { if (n.isConnected) process(n); }); });
  });
  function start(){
    if ((document.body.dataset.subject || '') !== 'china') return;
    mo.observe(document.body, { childList:true, subtree:true, characterData:true });
    new MutationObserver(() => setTimeout(LP.refresh, 0)).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
    LP.refresh();
  }
  if (window.Lab && Lab.ready) Lab.ready(() => setTimeout(start, 0));
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
