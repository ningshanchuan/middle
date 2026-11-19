/* Place book — world (outside China and the USA). Format: see shared/places.js. Photos: Wikimedia Commons, free licences.
   (src = thumb URL exactly as the Commons API returns it). Ancient sites use the archaeological site; "today" names the modern place.
   Places mostly from the World History lessons (worldhistory/wh-*.html). Ambiguous names carry subjects:['worldhistory']. */
LabGaz.add({
  /* ---------- First civilizations: Mesopotamia & Egypt ---------- */
  euphrates:{ en:'Euphrates River', zh:'幼发拉底河', names:['Euphrates','幼发拉底河'], ll:[43.3, 33.4], kind:'river',
    era:{ en:'The western river of Mesopotamia', zh:'两河流域西边的大河' },
    info:{ en:'It flows about 2,800 km from the mountains of Türkiye through Syria and Iraq to the Persian Gulf. Ur, Uruk and Babylon stood beside it.', zh:'它从土耳其的山区流出，经叙利亚、伊拉克注入波斯湾，全长约2800千米。乌尔、乌鲁克和巴比伦都建在它的岸边。' },
    photos:[
      { src:'https://upload.wikimedia.org/wikipedia/commons/1/1a/Euphrates_river_in_Hillah.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'The Euphrates at Hillah, close to the ruins of Babylon', zh:'流经希拉的幼发拉底河，附近就是巴比伦遗址', credit:'احمد منذر', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Euphrates_river_in_Hillah.JPG' } ] },
  tigris:{ en:'Tigris River', zh:'底格里斯河', names:['Tigris','底格里斯河'], ll:[43.9, 34.2], kind:'river',
    era:{ en:'The eastern river of Mesopotamia', zh:'两河流域东边的大河' },
    info:{ en:'Faster and wilder than the Euphrates. Nineveh, the Assyrian capital, and later Baghdad were built on its banks.', zh:'它比幼发拉底河水流更急。亚述的都城尼尼微，后来的巴格达，都建在它的岸边。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/The_Old_Bridge_and_The_Tigris_River-Mosul_01.jpg/960px-The_Old_Bridge_and_The_Tigris_River-Mosul_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Tigris at Mosul — the ruins of Nineveh lie on the far bank', zh:'流经摩苏尔的底格里斯河——对岸就是尼尼微遗址', credit:'Abdulsalam Al Dabbagh', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:The_Old_Bridge_and_The_Tigris_River-Mosul_01.jpg' } ] },
  nile:{ en:'Nile River', zh:'尼罗河', names:['Nile','尼罗河'], ll:[31.2, 27.2], kind:'river',
    era:{ en:'The river that made Egypt', zh:'孕育古埃及文明的大河' },
    info:{ en:'At about 6,650 km it is one of the two longest rivers on Earth. Every summer it flooded and left rich black mud on the fields — “Egypt is the gift of the Nile”.', zh:'全长约6650千米，是世界上最长的河流之一。它每年夏天泛滥，给田地留下肥沃的黑泥——“埃及是尼罗河的赠礼”。' },
    photos:[
      { src:'https://upload.wikimedia.org/wikipedia/commons/d/de/Nile_River_and_delta_from_orbit.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'The Nile and its delta from orbit (NASA, February 2003): a green ribbon through the desert.', zh:'从太空看尼罗河及其三角洲（美国国家航空航天局，2003年2月）：沙漠中的一条绿带。', credit:'Jacques Descloitres, MODIS Rapid Response Team, NASA', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Nile_River_and_delta_from_orbit.jpg' } ] },
  uruk:{ en:'Uruk', zh:'乌鲁克', names:['Uruk','乌鲁克'], ll:[45.64, 31.32], kind:'site', subjects:['worldhistory'],
    today:{ en:'Warka, Iraq', zh:'今伊拉克瓦尔卡' }, era:{ en:'One of the first cities, c. 3500 BCE', zh:'世界上最早的城市之一，约公元前3500年' },
    info:{ en:'Around 3000 BCE perhaps 40,000 people lived inside its walls. Some of the oldest writing ever found comes from its temples.', zh:'约公元前3000年，城墙里可能住着4万人。人类最早的文字有一些就出土于这里的神庙。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Pergamon_Museum_Cone_mosaics_from_temple_district_facade_of_Eanna_in_Uruk_8054.jpg/960px-Pergamon_Museum_Cone_mosaics_from_temple_district_facade_of_Eanna_in_Uruk_8054.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Clay-cone mosaics from a temple wall at Uruk (Pergamon Museum, Berlin)', zh:'乌鲁克神庙墙上的泥锥镶嵌装饰（柏林佩加蒙博物馆藏）', credit:'Dosseman', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Pergamon_Museum_Cone_mosaics_from_temple_district_facade_of_Eanna_in_Uruk_8054.jpg' } ] },
  ur:{ en:'Ur', zh:'乌尔', names:['Ur','乌尔'], ll:[46.10, 30.96], kind:'site', subjects:['worldhistory'],
    today:{ en:'near Nasiriyah, Iraq', zh:'今伊拉克纳西里耶附近' }, era:{ en:'Sumerian city; Ziggurat built c. 2100 BCE', zh:'苏美尔城市；塔庙建于约公元前2100年' },
    info:{ en:'A rich port city of Sumer near the old coast of the Persian Gulf. Its great stepped temple, the Ziggurat of Ur, still stands.', zh:'苏美尔的一座富庶港口城市，当年靠近波斯湾海岸。它的阶梯式神庙“乌尔塔庙”至今还屹立着。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Ancient_ziggurat_at_Ali_Air_Base_Iraq_2005.jpg/960px-Ancient_ziggurat_at_Ali_Air_Base_Iraq_2005.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'An ancient ziggurat beside Ali Air Base in southern Iraq — the Ziggurat of Ur (photo 2005).', zh:'伊拉克南部阿里空军基地旁的古代塔庙——乌尔塔庙（2005年摄）。', credit:'Hardnfast', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:Ancient_ziggurat_at_Ali_Air_Base_Iraq_2005.jpg' } ] },
  lagash:{ en:'Lagash', zh:'拉格什', names:['Lagash','拉格什'], ll:[46.41, 31.41], kind:'site', subjects:['worldhistory'],
    today:{ en:'Tell al-Hiba, Iraq', zh:'今伊拉克希巴丘' }, era:{ en:'Sumerian city-state, 3rd millennium BCE', zh:'苏美尔城邦，公元前三千纪' },
    info:{ en:'One of the many independent Sumerian city-states, each with its own king and god. It often fought its neighbour Umma over water.', zh:'苏美尔众多独立城邦之一，各城邦有自己的国王和神。它常为争夺水源与邻城温马打仗。' } },
  babylon:{ en:'Babylon', zh:'巴比伦', names:['Babylon','巴比伦城','巴比伦'], ll:[44.42, 32.54], kind:'capital',
    today:{ en:'near Hillah, Iraq', zh:'今伊拉克希拉附近' }, era:{ en:'Hammurabi’s capital (c. 1750 BCE); rebuilt by Nebuchadnezzar II', zh:'汉谟拉比的都城（约公元前1750年）；尼布甲尼撒二世重建' },
    info:{ en:'Hammurabi ruled from here and set up his law code. Around 600 BCE it was the biggest city in the world, entered through the blue Ishtar Gate.', zh:'汉谟拉比在这里统治并颁布法典。约公元前600年，它是世界上最大的城市，蓝色的伊什塔尔门是它的城门。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Ruins_of_the_ancient_city_of_Babylon%2C_Babel%2C_Iraq%2C_6th_century_BC.jpg/960px-Ruins_of_the_ancient_city_of_Babylon%2C_Babel%2C_Iraq%2C_6th_century_BC.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ruins of Babylon from the time of Nebuchadnezzar II', zh:'尼布甲尼撒二世时期的巴比伦遗址', credit:'Osama Shukir Muhammed Amin FRCP(Glasg)', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Ruins_of_the_ancient_city_of_Babylon,_Babel,_Iraq,_6th_century_BC.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Ishtar_Gate_in_the_Pergamon_Museum_-.jpg/960px-Ishtar_Gate_in_the_Pergamon_Museum_-.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Ishtar Gate of Babylon (about 575 BCE), rebuilt from its original blue glazed bricks in the Pergamon Museum, Berlin — lions, bulls and dragons decorate the walls.', zh:'巴比伦的伊什塔尔城门（约公元前575年），用原来的蓝色釉砖在柏林佩加蒙博物馆重建——墙上装饰着狮子、公牛和神龙。', credit:'Kurt Kaiser', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Ishtar_Gate_in_the_Pergamon_Museum_-.jpg' } ] },
  nineveh:{ en:'Nineveh', zh:'尼尼微', names:['Nineveh','尼尼微'], ll:[43.15, 36.36], kind:'capital',
    today:{ en:'Mosul, Iraq', zh:'今伊拉克摩苏尔' }, era:{ en:'Capital of the Assyrian Empire; fell in 612 BCE', zh:'亚述帝国的都城；公元前612年陷落' },
    info:{ en:'King Ashurbanipal kept a library of thousands of clay tablets here, including the Epic of Gilgamesh. Its ruins lie across the Tigris from Mosul.', zh:'亚述巴尼拔国王在这里收藏了数以千计的泥板书，其中有《吉尔伽美什史诗》。遗址就在摩苏尔城对面的底格里斯河东岸。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Nineveh_-_Mashki_Gate.jpg/960px-Nineveh_-_Mashki_Gate.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The rebuilt Mashki Gate of Nineveh', zh:'重建的尼尼微马什基城门', credit:'Omar Siddeeq Yousif', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Nineveh_-_Mashki_Gate.jpg' } ] },
  memphis:{ en:'Memphis', zh:'孟菲斯', names:['Memphis','孟菲斯'], ll:[31.25, 29.85], kind:'capital', subjects:['worldhistory'],
    today:{ en:'Mit Rahina, near Cairo', zh:'今埃及开罗附近的米特拉希纳' }, era:{ en:'First capital of united Egypt, c. 3100 BCE', zh:'统一后古埃及的第一个都城，约公元前3100年' },
    info:{ en:'It stood where the Nile valley opens into the delta, so it could watch over both Upper and Lower Egypt. The pyramids of Giza and Saqqara were its royal cemeteries.', zh:'它建在尼罗河谷与三角洲的交界处，可以同时控制上埃及和下埃及。吉萨和萨卡拉的金字塔就是它的王家墓地。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Sphinx_of_Memphis_II.jpg/960px-Sphinx_of_Memphis_II.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Alabaster Sphinx at Memphis', zh:'孟菲斯的雪花石膏狮身人面像', credit:'Bilal Detailz', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Sphinx_of_Memphis_II.jpg' } ] },
  saqqara:{ en:'Saqqara', zh:'萨卡拉', names:['Saqqara','萨卡拉'], ll:[31.22, 29.87], kind:'site',
    era:{ en:'Step Pyramid of Djoser, c. 2650 BCE', zh:'左塞尔阶梯金字塔，约公元前2650年' },
    info:{ en:'The cemetery of Memphis. Here the architect Imhotep built the Step Pyramid — the oldest large stone building in the world.', zh:'孟菲斯的墓地。建筑师伊姆霍特普在这里建成阶梯金字塔——世界上最早的大型石头建筑。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Pyramid_of_Djoser_2010.jpg/960px-Pyramid_of_Djoser_2010.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Step Pyramid of Djoser at Saqqara — the first pyramid.', zh:'萨卡拉的左塞尔阶梯金字塔——最早的金字塔。', credit:'Wknight94', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Pyramid_of_Djoser_2010.jpg' } ] },
  thebes:{ en:'Thebes', zh:'底比斯', names:['Thebes (Luxor)','底比斯（今卢克索）','Luxor','卢克索','Karnak','卡纳克'], ll:[32.64, 25.70], kind:'capital',
    today:{ en:'Luxor, Egypt', zh:'今埃及卢克索' }, era:{ en:'Capital of the Middle and New Kingdoms', zh:'中王国和新王国的都城' },
    info:{ en:'The great temples of Karnak and Luxor stand here on the east bank of the Nile. On the west bank, pharaohs were buried in the Valley of the Kings.', zh:'尼罗河东岸有宏伟的卡纳克神庙和卢克索神庙；西岸的帝王谷是法老们的墓地。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Luxor_Temple_R04.jpg/960px-Luxor_Temple_R04.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Luxor Temple, in the heart of ancient Thebes', zh:'卢克索神庙，位于古代底比斯城的中心', credit:'Marc Ryckaert', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:Luxor_Temple_R04.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Karnak_temple_wall_hieroglyphic_script.jpg/960px-Karnak_temple_wall_hieroglyphic_script.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Hieroglyphs carved on a temple wall at Karnak (Luxor).', zh:'卡纳克神庙（卢克索）墙上刻的象形文字。', credit:'Mmelouk', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Karnak_temple_wall_hieroglyphic_script.jpg' } ] },
  valleykings:{ en:'Valley of the Kings', zh:'帝王谷', names:['Valley of the Kings','帝王谷'], ll:[32.60, 25.74], kind:'site',
    era:{ en:'Royal tombs of the New Kingdom, c. 1500–1070 BCE', zh:'新王国的王陵，约公元前1500—前1070年' },
    info:{ en:'Pharaohs were buried in tombs cut deep into the rock of this desert valley. Tutankhamun’s tomb, found almost untouched in 1922, is here.', zh:'法老们被葬在这条沙漠山谷的岩石深处。1922年发现的几乎未被盗掘的图坦卡蒙墓就在这里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Thebes%2C_Luxor%2C_Egypt%2C_Valley_of_the_Kings_from_above.jpg/960px-Thebes%2C_Luxor%2C_Egypt%2C_Valley_of_the_Kings_from_above.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Valley of the Kings from above', zh:'俯瞰帝王谷', credit:'Vyacheslav Argenberg', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Thebes,_Luxor,_Egypt,_Valley_of_the_Kings_from_above.jpg' } ] },
  zagros:{ en:'Zagros Mountains', zh:'扎格罗斯山脉', names:['Zagros','扎格罗斯'], ll:[47.0, 34.0], kind:'mountain',
    era:{ en:'The mountain wall east of Mesopotamia', zh:'两河流域东边的山地屏障' },
    info:{ en:'A long chain of mountains between Mesopotamia and the Iranian plateau. Snow melting here every spring fills the Tigris.', zh:'横亘在两河流域与伊朗高原之间的长长山脉。每年春天这里的融雪汇入底格里斯河。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Zagros_mountains.jpg/960px-Zagros_mountains.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Zagros Mountains in western Iran', zh:'伊朗西部的扎格罗斯山脉', credit:'ninara', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Zagros_mountains.jpg' } ] },
  sinai:{ en:'Sinai Peninsula', zh:'西奈半岛', names:['Sinai','西奈半岛','西奈'], ll:[33.97, 28.54], kind:'region',
    era:{ en:'Copper and turquoise mines of the pharaohs', zh:'法老们的铜矿和绿松石矿' },
    info:{ en:'A rocky, dry triangle of land that joins Africa to Asia. Egyptians came here for copper and turquoise, not to farm.', zh:'连接非洲和亚洲的一块干燥多山的三角形陆地。古埃及人来这里开采铜和绿松石，而不是种地。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Mount_Sinai_Egypt.jpg/960px-Mount_Sinai_Egypt.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Mount Sinai and the rocky mountains of the Sinai Peninsula', zh:'西奈山和西奈半岛的岩石山地', credit:'Tamerlan at Polish Wikipedia', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Mount_Sinai_Egypt.jpg' } ] },
  anatolia:{ en:'Anatolia (Asia Minor)', zh:'小亚细亚', names:['Anatolia','Asia Minor','小亚细亚'], ll:[33.0, 39.0], kind:'region',
    today:{ en:'Asian part of Türkiye', zh:'今土耳其的亚洲部分' }, era:{ en:'Home of the Hittites; later Lydia, Persia, Rome, Byzantium, the Seljuks and Ottomans', zh:'赫梯人的故乡；后来属吕底亚、波斯、罗马、拜占庭、塞尔柱和奥斯曼' },
    info:{ en:'A big peninsula between the Black Sea and the Mediterranean — a bridge between Asia and Europe crossed by armies and traders for thousands of years.', zh:'黑海与地中海之间的大半岛，是连接亚洲和欧洲的桥梁，几千年来军队和商人不断从这里经过。' } },
  nubia:{ en:'Nubia (Kush)', zh:'努比亚', names:['Nubia','努比亚','Kush','库施'], ll:[32.4, 20.5], kind:'region', subjects:['worldhistory'],
    today:{ en:'Sudan and southern Egypt', zh:'今苏丹和埃及南部' }, era:{ en:'Kingdom of Kush; its kings ruled Egypt c. 744–656 BCE', zh:'库施王国；其国王约公元前744—前656年统治埃及' },
    info:{ en:'The land up the Nile, south of Egypt, rich in gold. Its kings later built more than 200 steep pyramids at Meroë — more than Egypt has.', zh:'埃及南面尼罗河上游的土地，盛产黄金。后来这里的国王在麦罗埃建了200多座陡峭的金字塔，比埃及的还多。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Meroe_Pyramids_-_33110830438.jpg/960px-Meroe_Pyramids_-_33110830438.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Pyramids of the kings of Kush at Meroë, Sudan', zh:'苏丹麦罗埃的库施国王金字塔', credit:'Laurent de Walick', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Meroe_Pyramids_-_33110830438.jpg' } ] },
  kadesh:{ en:'Kadesh', zh:'卡迭石', names:['Kadesh','卡迭石'], ll:[36.51, 34.56], kind:'battle',
    today:{ en:'near Homs, Syria', zh:'今叙利亚霍姆斯附近' }, era:{ en:'Battle of Egypt and the Hittites, c. 1274 BCE', zh:'埃及与赫梯之战，约公元前1274年' },
    info:{ en:'Ramesses II fought the Hittites here in one of the biggest chariot battles ever. Neither side won, and later they signed one of the oldest known peace treaties.', zh:'拉美西斯二世在这里与赫梯人进行了历史上规模最大的战车战之一。双方都没有取胜，后来签订了已知最早的和约之一。' } ,
    photos:[
      { src:'https://upload.wikimedia.org/wikipedia/commons/4/49/Relief_Kadesh_Breasted.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'Drawing of Ramesses II’s temple carving of the Battle of Kadesh', zh:'拉美西斯二世神庙中卡迭石战役浮雕的线描图', credit:'James Henry Breasted (1865-1935)', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Relief_Kadesh_Breasted.jpg' } ] },
  alexandria:{ en:'Alexandria', zh:'亚历山大里亚', names:['Alexandria (Egypt)','Alexandria','亚历山大里亚城','亚历山大里亚','亚历山大港'], ll:[29.92, 31.20], kind:'city', subjects:['worldhistory'],
    era:{ en:'Founded by Alexander the Great, 331 BCE', zh:'亚历山大大帝建于公元前331年' },
    info:{ en:'Its Library held hundreds of thousands of scrolls and its Lighthouse was one of the Seven Wonders. The Qaitbay fort now stands where the lighthouse was.', zh:'城中的图书馆藏书几十万卷，灯塔是世界七大奇迹之一。今天的盖贝依城堡就建在灯塔的旧址上。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Citadel_of_Qaitbay%2C_Alexandria%2C_Egypt.jpg/960px-Citadel_of_Qaitbay%2C_Alexandria%2C_Egypt.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Citadel of Qaitbay, built where the famous Lighthouse once stood', zh:'盖贝依城堡，建在著名灯塔的旧址上', credit:'Argenberg', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Citadel_of_Qaitbay,_Alexandria,_Egypt.jpg' } ] },
  mohenjodaro:{ en:'Mohenjo-daro', zh:'摩亨佐·达罗', names:['Mohenjo-daro','Mohenjo Daro','摩亨佐·达罗','摩亨佐-达罗'], ll:[68.14, 27.33], kind:'site',
    today:{ en:'Sindh, Pakistan', zh:'今巴基斯坦信德省' }, era:{ en:'Indus city, c. 2600–1900 BCE', zh:'印度河流域城市，约公元前2600—前1900年' },
    info:{ en:'A planned city with straight streets, covered drains and a “Great Bath”. Perhaps 40,000 people lived here 4,500 years ago.', zh:'一座经过规划的城市，街道笔直，有带盖的排水沟和“大浴池”。4500年前这里可能住着4万人。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Mohenjo-daro.jpg/960px-Mohenjo-daro.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The excavated ruins of Mohenjo-daro, with the Great Bath in the foreground and the granary mound behind.', zh:'摩亨佐·达罗遗址：前面是“大浴池”，后面是粮仓所在的土丘。', credit:'Saqib Qayyum', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Mohenjo-daro.jpg' } ] },
  harappa:{ en:'Harappa', zh:'哈拉帕', names:['Harappa','哈拉帕'], ll:[72.86, 30.63], kind:'site',
    today:{ en:'Punjab, Pakistan', zh:'今巴基斯坦旁遮普省' }, era:{ en:'Indus city, c. 2600–1900 BCE', zh:'印度河流域城市，约公元前2600—前1900年' },
    info:{ en:'The first Indus city that archaeologists dug up (1920s), so the whole civilization is also called “Harappan”. It had large granaries and brick houses.', zh:'考古学家最早发掘的印度河城市（20世纪20年代），所以这一文明也叫“哈拉帕文明”。城里有大粮仓和砖房。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Harappa_Ruins_-_I.jpg/960px-Harappa_Ruins_-_I.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Brick ruins of Harappa, Pakistan', zh:'巴基斯坦哈拉帕的砖砌遗址', credit:'Hassan Nasir', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Harappa_Ruins_-_I.jpg' } ] },
  /* ---------- Ancient India & Persia ---------- */
  lothal:{ en:'Lothal', zh:'洛塔尔', names:['Lothal','洛塔尔'], ll:[72.25, 22.52], kind:'port',
    era:{ en:'Indus trading port, c. 2400–1900 BCE', zh:'印度河文明的贸易港口，约公元前2400—前1900年' },
    info:{ en:'A small port town with a big brick basin that many archaeologists think was a dock for ships. Beads and cotton went from here as far as Mesopotamia.', zh:'一座小港口城镇，有一个巨大的砖砌水池，很多考古学家认为它是船坞。这里的珠子和棉布一直运到两河流域。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Lothal_Dockyard.jpg/960px-Lothal_Dockyard.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The brick basin at Lothal that may have been a dock for ships', zh:'洛塔尔的砖砌水池，可能是停船的船坞', credit:'Raveesh Vyas', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Lothal_Dockyard.jpg' } ] },
  ganges:{ en:'Ganges River', zh:'恒河', names:['Ganges','恒河'], ll:[83.0, 25.3], kind:'river',
    era:{ en:'Heartland of the Mauryan and Gupta empires', zh:'孔雀王朝和笈多王朝的中心地区' },
    info:{ en:'A sacred river for Hindus, about 2,500 km long. The Buddha taught, and great Indian empires grew, in the Ganges plain.', zh:'印度教徒心中的圣河，全长约2500千米。佛陀在恒河平原传教，印度的大帝国也在这里兴起。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Varanasi%2C_India%2C_Ganges_River%2C_ghats%2C_temples_and_embankments.jpg/960px-Varanasi%2C_India%2C_Ganges_River%2C_ghats%2C_temples_and_embankments.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ghats (riverside steps) on the Ganges at Varanasi', zh:'瓦拉纳西恒河边的河坛（台阶）', credit:'Vyacheslav Argenberg', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Varanasi,_India,_Ganges_River,_ghats,_temples_and_embankments.jpg' } ] },
  bodhgaya:{ en:'Bodh Gaya', zh:'菩提伽耶', names:['Bodh Gaya','菩提伽耶'], ll:[84.99, 24.70], kind:'site',
    era:{ en:'Where the Buddha reached enlightenment, c. 500s BCE', zh:'佛陀悟道之地，约公元前6—前5世纪' },
    info:{ en:'Buddhist tradition says Siddhartha Gautama sat under a tree here until he became the Buddha. The Mahabodhi Temple marks the spot.', zh:'佛教传说乔达摩·悉达多在这里的菩提树下静坐，最终悟道成佛。摩诃菩提寺就建在这个地方。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Votive_Stupas_-_Mahabodhi_Temple_Complex_-_Bodh_Gaya_%2813%29.jpg/960px-Votive_Stupas_-_Mahabodhi_Temple_Complex_-_Bodh_Gaya_%2813%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Small stupas at the Mahabodhi Temple complex in Bodh Gaya, India — where the Buddha is said to have reached enlightenment under a tree. Ashoka built the first shrine here.', zh:'印度菩提伽耶摩诃菩提寺建筑群里的小佛塔——相传佛陀就是在这里的一棵树下悟道的。阿育王在这里修建了最早的佛殿。', credit:'Sumitsurai', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Votive_Stupas_-_Mahabodhi_Temple_Complex_-_Bodh_Gaya_(13).jpg' } ] },
  sarnath:{ en:'Sarnath', zh:'鹿野苑', names:['Sarnath','鹿野苑','萨尔纳特'], ll:[83.02, 25.38], kind:'site',
    era:{ en:'The Buddha’s first teaching', zh:'佛陀初次说法之地' },
    info:{ en:'In a deer park here the Buddha gave his first teaching. Ashoka’s lion pillar from Sarnath is now India’s national emblem.', zh:'佛陀在这里的鹿苑第一次说法。阿育王在这里立的狮子柱头，今天是印度的国徽图案。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Dhamek_Stupa%2C_2025.jpg/960px-Dhamek_Stupa%2C_2025.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Dhamek Stupa at Sarnath, where the Buddha is said to have first taught', zh:'鹿野苑的达美克佛塔，相传佛陀在这里初次说法', credit:'Hardy Explorer', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Dhamek_Stupa,_2025.jpg' } ] },
  vaishali:{ en:'Vaishali', zh:'吠舍离', names:['Vaishali','吠舍离'], ll:[85.13, 25.99], kind:'site',
    era:{ en:'Ancient city visited by the Buddha; Ashoka pillar', zh:'佛陀到过的古城；有阿育王石柱' },
    info:{ en:'An old city of the Ganges plain often visited by the Buddha. One of Ashoka’s polished stone pillars, topped by a lion, still stands here.', zh:'恒河平原上的古城，佛陀常来这里。阿育王立的一根顶上有狮子的磨光石柱至今还立在这里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Ashoka_pillar_at_Vaishali%2C_Bihar%2C_India.jpg/960px-Ashoka_pillar_at_Vaishali%2C_Bihar%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'An Ashoka pillar still standing at Vaishali, Bihar, India — polished stone topped by a single lion.', zh:'至今仍立在印度比哈尔邦吠舍离的阿育王石柱，柱顶有一只狮子。', credit:'Bpilgrim', license:'CC BY-SA 2.5', page:'https://commons.wikimedia.org/wiki/File:Ashoka_pillar_at_Vaishali,_Bihar,_India.jpg' } ] },
  pataliputra:{ en:'Pataliputra', zh:'华氏城', names:['Pataliputra','华氏城'], ll:[85.14, 25.61], kind:'capital',
    today:{ en:'Patna, India', zh:'今印度巴特那' }, era:{ en:'Capital of the Mauryan and Gupta empires', zh:'孔雀王朝和笈多王朝的都城' },
    info:{ en:'Ashoka ruled his huge empire from here. A Greek visitor described its wooden walls with 570 towers.', zh:'阿育王在这里统治他庞大的帝国。一位希腊使节记载，它的木城墙上有570座塔楼。' },
    photos:[
      { src:'https://upload.wikimedia.org/wikipedia/commons/6/6f/Mauryan_Hall_pillar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'A polished stone pillar from a Mauryan hall excavated at Pataliputra (Patna)', zh:'华氏城（今巴特那）出土的孔雀王朝大厅磨光石柱', credit:'Manoj nav', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Mauryan_Hall_pillar.jpg' } ] },
  kalinga:{ en:'Kalinga', zh:'羯陵伽', names:['Kalinga','羯陵伽'], ll:[85.84, 20.19], kind:'battle',
    today:{ en:'Odisha, India (Dhauli hill)', zh:'今印度奥里萨邦（道利山）' }, era:{ en:'Ashoka’s war, c. 261 BCE', zh:'阿育王征服羯陵伽之战，约公元前261年' },
    info:{ en:'After conquering Kalinga, Ashoka was so sorry for the suffering that he turned to Buddhism and peace. His edicts are carved on a rock at Dhauli.', zh:'征服羯陵伽后，阿育王为战争带来的苦难深感悔恨，从此皈依佛教、主张和平。他的诏令刻在道利山的岩石上。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Shanti_Stupa%2C_Dhauli_01.jpg/960px-Shanti_Stupa%2C_Dhauli_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Peace Pagoda on Dhauli hill, above the Kalinga battlefield', zh:'羯陵伽古战场旁道利山上的和平塔', credit:'Bernard Gagnon', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Shanti_Stupa,_Dhauli_01.jpg' } ] },
  sanchi:{ en:'Sanchi', zh:'桑奇', names:['Sanchi','桑奇'], ll:[77.74, 23.48], kind:'site',
    era:{ en:'Great Stupa begun by Ashoka, 3rd century BCE', zh:'阿育王开始修建的大佛塔，公元前3世纪' },
    info:{ en:'Its Great Stupa is a giant dome holding relics of the Buddha, with four carved stone gateways. It is one of the oldest stone buildings in India.', zh:'这里的大佛塔是一个存放佛舍利的巨大圆顶，四面有雕刻精美的石门，是印度最古老的石头建筑之一。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Sanchi_Stupa_from_Eastern_gate%2C_Madhya_Pradesh.jpg/960px-Sanchi_Stupa_from_Eastern_gate%2C_Madhya_Pradesh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Great Stupa at Sanchi seen from its eastern gate. The dome holds relics of the Buddha.', zh:'从东门看桑奇大佛塔，圆顶里供奉着佛陀的舍利。', credit:'chromatic_aberration (Flickr)', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Sanchi_Stupa_from_Eastern_gate,_Madhya_Pradesh.jpg' } ] },
  taxila:{ en:'Taxila', zh:'塔克西拉', names:['Taxila','塔克西拉'], ll:[72.83, 33.75], kind:'site',
    era:{ en:'Crossroads city of Persia, Alexander and the Mauryas', zh:'波斯、亚历山大和孔雀王朝时期的交通要地' },
    info:{ en:'A city where roads from Persia, Central Asia and India met, famous for its teachers. Chinese pilgrims called it 呾叉始罗.', zh:'来自波斯、中亚和印度的道路在这里交会，以名师众多著称。中国求法僧称它为“呾叉始罗”。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Dharmarajika_Stupa%2C_Taxila.jpg/960px-Dharmarajika_Stupa%2C_Taxila.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Dharmarajika Stupa at Taxila', zh:'塔克西拉的达摩拉吉卡佛塔', credit:'SpeakingArch', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Dharmarajika_Stupa,_Taxila.jpg' } ] },
  pasargadae:{ en:'Pasargadae', zh:'帕萨尔加德', names:['Pasargadae','帕萨尔加德'], ll:[53.17, 30.20], kind:'capital',
    era:{ en:'First capital of Cyrus the Great, c. 550 BCE', zh:'居鲁士大帝的第一座都城，约公元前550年' },
    info:{ en:'Cyrus the Great built gardens and palaces here. His simple stone tomb still stands on six giant steps.', zh:'居鲁士大帝在这里修建了花园和宫殿。他朴素的石头陵墓至今还立在六级巨大的台阶上。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/CyrustheGreatTomb_22059.jpg/960px-CyrustheGreatTomb_22059.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The tomb of Cyrus the Great at Pasargadae, Iran — a simple stone house on six giant steps, built for the founder of the Persian Empire around 530 BCE.', zh:'伊朗帕萨尔加德的居鲁士大帝陵墓——六级巨大台阶上的一座朴素石屋，约公元前530年为波斯帝国的创立者修建。', credit:'Truth Seeker', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:CyrustheGreatTomb_22059.jpg' } ] },
  persepolis:{ en:'Persepolis', zh:'波斯波利斯', names:['Persepolis','波斯波利斯'], ll:[52.89, 29.93], kind:'capital',
    today:{ en:'near Shiraz, Iran', zh:'今伊朗设拉子附近' }, era:{ en:'Ceremonial capital of Darius I, begun c. 518 BCE; burned 330 BCE', zh:'大流士一世的礼仪都城，约公元前518年动工；公元前330年被焚' },
    info:{ en:'Peoples from all over the Persian Empire came here with gifts for the king — you can still see them carved on the stairs. Alexander’s army burned it.', zh:'波斯帝国各地的人带着礼物来这里朝见国王——台阶上至今还能看到他们的浮雕。亚历山大的军队焚毁了这座城。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Persepolis_Gate_of_All_Nations.jpg/960px-Persepolis_Gate_of_All_Nations.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Gate of All Nations at Persepolis, the ceremonial capital begun by Darius I.', zh:'波斯波利斯的“万国门”。波斯波利斯是大流士一世开始修建的礼仪性都城。', credit:'Shahrokhphoto', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Persepolis_Gate_of_All_Nations.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/The_Apadana_Staircase_with_the_Procession_of_the_Vassals_%284686171639%29.jpg/960px-The_Apadana_Staircase_with_the_Procession_of_the_Vassals_%284686171639%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Apadana staircase at Persepolis, carved with a procession of peoples from across the empire.', zh:'波斯波利斯阿帕达纳宫的台阶，上面刻着帝国各地民族的朝贡行列。', credit:'A.Davey', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:The_Apadana_Staircase_with_the_Procession_of_the_Vassals_(4686171639).jpg' } ] },
  susa:{ en:'Susa', zh:'苏萨', names:['Susa','苏萨'], ll:[48.26, 32.19], kind:'capital', subjects:['worldhistory'],
    today:{ en:'Shush, Iran', zh:'今伊朗舒什' }, era:{ en:'Persian royal capital; east end of the Royal Road', zh:'波斯王都之一；御道的东端' },
    info:{ en:'One of the oldest cities in the world and a capital of the Persian kings. Royal messengers rode 2,500 km from Sardis to Susa in about a week.', zh:'世界上最古老的城市之一，也是波斯国王的都城。御道上的信使从萨迪斯到苏萨约2500千米，只用一周左右。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Palace_of_Darius_in_Susa2.jpg/960px-Palace_of_Darius_in_Susa2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ruins of the Palace of Darius at Susa', zh:'苏萨的大流士宫殿遗址', credit:'Saeedhamedian', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Palace_of_Darius_in_Susa2.jpg' } ] },
  sardis:{ en:'Sardis', zh:'萨迪斯', names:['Sardis','萨迪斯'], ll:[28.04, 38.49], kind:'capital',
    today:{ en:'near Salihli, Türkiye', zh:'今土耳其萨利赫利附近' }, era:{ en:'Capital of Lydia; west end of the Royal Road', zh:'吕底亚王国的都城；御道的西端' },
    info:{ en:'Rich King Croesus ruled here, and some of the first coins in the world were made here. Cyrus took it in about 546 BCE.', zh:'富有的克罗伊斯国王在这里统治，世界上最早的钱币有一些就是在这里铸造的。约公元前546年被居鲁士攻占。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Temple_of_Artemis_Sardis_Turkey.jpg/960px-Temple_of_Artemis_Sardis_Turkey.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Columns of the Temple of Artemis at Sardis', zh:'萨迪斯的阿耳忒弥斯神庙石柱', credit:'simonjenkins’ photos', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Temple_of_Artemis_Sardis_Turkey.jpg' } ] },
  marathon:{ en:'Marathon', zh:'马拉松', names:['Marathon','马拉松'], ll:[23.98, 38.12], kind:'battle', subjects:['worldhistory'],
    era:{ en:'Athens defeats Persia, 490 BCE', zh:'雅典打败波斯，公元前490年' },
    info:{ en:'Athenian soldiers beat a much bigger Persian army on this plain. The story of a runner carrying the news 40 km to Athens gave us the marathon race.', zh:'雅典士兵在这片平原上打败了人数多得多的波斯军队。一位士兵跑约40千米回雅典报捷的故事，就是马拉松赛跑的由来。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/The_tumulus_%28tomb%29_of_the_Athenians_at_Marathon.jpg/960px-The_tumulus_%28tomb%29_of_the_Athenians_at_Marathon.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The burial mound of the Athenians who fell at Marathon', zh:'马拉松战役中阵亡雅典人的坟丘', credit:'George E. Koronaios', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:The_tumulus_(tomb)_of_the_Athenians_at_Marathon.jpg' } ] },
  merv:{ en:'Merv', zh:'木鹿', names:['Merv','木鹿'], ll:[61.84, 37.66], kind:'site',
    today:{ en:'near Mary, Turkmenistan', zh:'今土库曼斯坦马雷附近' }, era:{ en:'Silk Road oasis city', zh:'丝绸之路上的绿洲城市' },
    info:{ en:'A great oasis city on the Silk Road where caravans rested between Persia and Central Asia. In the 1100s it may have been the biggest city in the world.', zh:'丝绸之路上的大绿洲城市，往来于波斯和中亚之间的商队在这里歇脚。12世纪时，它可能是世界上最大的城市。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Sultan_Sanjar_Mausoleum%2C_Merv%2C_Turkmenistan_2019_01.jpg/960px-Sultan_Sanjar_Mausoleum%2C_Merv%2C_Turkmenistan_2019_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Mausoleum of Sultan Sanjar at Merv', zh:'木鹿的桑贾尔苏丹陵墓', credit:'Dr. Alexey Yakovlev', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Sultan_Sanjar_Mausoleum,_Merv,_Turkmenistan_2019_01.jpg' } ] },
  antioch:{ en:'Antioch', zh:'安条克', names:['Antioch','安条克'], ll:[36.16, 36.20], kind:'city',
    today:{ en:'Antakya, Türkiye', zh:'今土耳其安塔基亚' }, era:{ en:'Great Hellenistic and Roman city', zh:'希腊化时代和罗马时代的大城市' },
    info:{ en:'Founded by one of Alexander’s generals, it became one of the biggest cities of the Roman East and an end point of the Silk Road trade.', zh:'由亚历山大的一位部将建立，后来成为罗马帝国东部最大的城市之一，也是丝绸之路贸易的西端终点之一。' } ,
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Antioch_on_the_Orontes%2C_Antakya%2C_Turkey_%2835863345530%29.jpg/960px-Antioch_on_the_Orontes%2C_Antakya%2C_Turkey_%2835863345530%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Antakya (ancient Antioch) on the Orontes River', zh:'奥龙特斯河畔的安塔基亚（古安条克）', credit:'Carole Raddato', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Antioch_on_the_Orontes,_Antakya,_Turkey_(35863345530).jpg' } ] },
  ctesiphon:{ en:'Ctesiphon', zh:'泰西封', names:['Ctesiphon','泰西封'], ll:[44.58, 33.09], kind:'capital',
    today:{ en:'near Baghdad, Iraq', zh:'今伊拉克巴格达附近' }, era:{ en:'Capital of Parthian and Sasanian Persia', zh:'安息和萨珊波斯的都城' },
    info:{ en:'On the Tigris, this was the capital of the Persian kings who traded with Han and Tang China. Its giant brick arch still stands.', zh:'它位于底格里斯河畔，是与汉朝、唐朝通商的波斯王朝的都城。巨大的砖砌拱门至今还屹立着。' } ,
    photos:[
      { src:'https://upload.wikimedia.org/wikipedia/commons/3/32/The_Arch_of_Ctesiphon_%28Taq_Kasra%29%2C_capital_of_the_Sassanids.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'The great brick arch of Ctesiphon (Taq Kasra)', zh:'泰西封的巨大砖拱（塔克基思拉宫）', credit:'Tesiyeyodish', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:The_Arch_of_Ctesiphon_(Taq_Kasra),_capital_of_the_Sassanids.jpg' } ] },
  /* ---------- Ancient Greece & Rome ---------- */
  athens:{ en:'Athens', zh:'雅典', names:['Athens','雅典城','雅典'], ll:[23.73, 37.98], kind:'city', subjects:['worldhistory','china','geography','yuwen','politics','economics'],
    era:{ en:'Birthplace of democracy, 500s–400s BCE', zh:'民主政治的诞生地，公元前6—前5世纪' },
    info:{ en:'Here citizens met on a hill called the Pnyx to vote on laws themselves. Under Pericles the city built the Parthenon on the Acropolis.', zh:'公民们在一座叫普尼克斯的山丘上集会，亲自投票决定法律。伯里克利时代，雅典在卫城上建起了帕特农神庙。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Attica_06-13_Athens_50_View_from_Philopappos_-_Acropolis_Hill.jpg/960px-Attica_06-13_Athens_50_View_from_Philopappos_-_Acropolis_Hill.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Acropolis (“high city”) of Athens seen from Philopappos Hill — the rocky hilltop where Athenians built their temples, with the Parthenon on top.', zh:'从菲洛帕波斯山眺望雅典卫城（“高处的城”）——雅典人在这座岩石山顶上修建神庙，最高处就是帕特农神庙。', credit:'A.Savin', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Attica_06-13_Athens_50_View_from_Philopappos_-_Acropolis_Hill.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Lascar_Stoa_of_Attalos_-_Ancient_Agora_of_Athens_%284517779606%29.jpg/960px-Lascar_Stoa_of_Attalos_-_Ancient_Agora_of_Athens_%284517779606%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The rebuilt Stoa of Attalos in the Agora, the market square where Athenians met', zh:'重建的阿塔罗斯柱廊，位于雅典人聚会的市场广场', credit:'Jorge Láscar from Australia', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Lascar_Stoa_of_Attalos_-_Ancient_Agora_of_Athens_(4517779606).jpg' } ] },
  acropolis:{ en:'Acropolis & Parthenon', zh:'雅典卫城与帕特农神庙', names:['Acropolis','Parthenon','雅典卫城','帕特农神庙'], ll:[23.726, 37.971], kind:'building',
    era:{ en:'Parthenon built 447–432 BCE', zh:'帕特农神庙建于公元前447—前432年' },
    info:{ en:'The “high city” is a rocky hill in the middle of Athens. The Parthenon on top was a marble temple for the goddess Athena.', zh:'“卫城”是雅典城中央的一座岩石山丘。山顶的帕特农神庙是献给雅典娜女神的大理石神庙。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/960px-The_Parthenon_in_Athens.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Parthenon in Athens (photo taken in 1978).', zh:'雅典的帕特农神庙（1978年拍摄）。', credit:'Steve Swayne', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:The_Parthenon_in_Athens.jpg' } ] },
  sparta:{ en:'Sparta', zh:'斯巴达', names:['Sparta','斯巴达'], ll:[22.43, 37.07], kind:'city',
    today:{ en:'Sparti, Greece', zh:'今希腊斯巴达' }, era:{ en:'Military city-state; beat Athens in 404 BCE', zh:'军事城邦；公元前404年打败雅典' },
    info:{ en:'Boys left home at 7 to train as soldiers. Sparta had almost no city walls — its soldiers were its walls.', zh:'男孩7岁离家接受军事训练。斯巴达几乎没有城墙——它的士兵就是城墙。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/The_ruins_of_the_ancient_Theatre_of_Sparta_on_May_15%2C_2019.jpg/960px-The_ruins_of_the_ancient_Theatre_of_Sparta_on_May_15%2C_2019.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ruins of the ancient theatre of Sparta', zh:'古斯巴达剧场遗址', credit:'George E. Koronaios', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:The_ruins_of_the_ancient_Theatre_of_Sparta_on_May_15,_2019.jpg' } ] },
  peloponnese:{ en:'Peloponnese', zh:'伯罗奔尼撒半岛', names:['Peloponnese','伯罗奔尼撒半岛'], ll:[22.2, 37.5], kind:'region',
    era:{ en:'Home of Sparta and Olympia', zh:'斯巴达和奥林匹亚所在地' },
    info:{ en:'The big southern peninsula of Greece, almost an island. Sparta led its cities in the Peloponnesian League against Athens.', zh:'希腊南部的大半岛，几乎是一座岛。斯巴达率领这里的城邦组成伯罗奔尼撒同盟，与雅典对抗。' } },
  olympia:{ en:'Olympia', zh:'奥林匹亚', names:['Olympia','奥林匹亚'], ll:[21.63, 37.64], kind:'site', subjects:['worldhistory'],
    era:{ en:'Olympic Games from 776 BCE', zh:'公元前776年起举行奥运会' },
    info:{ en:'Every four years Greeks gathered here for games in honour of Zeus. The Olympic flame for today’s Games is still lit here.', zh:'希腊人每四年在这里举行祭祀宙斯的运动会。今天奥运会的圣火仍在这里点燃。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Ancient_Olympia_Stadium_in_Greece_%2851224128585%29.jpg/960px-Ancient_Olympia_Stadium_in_Greece_%2851224128585%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The stadium at ancient Olympia, where the first Olympic Games were held (traditionally from 776 BCE). Runners raced on this dirt track; tens of thousands of fans sat on the grassy banks.', zh:'古奥林匹亚的体育场——相传从公元前776年起，最早的奥运会就在这里举行。运动员在这条土跑道上赛跑，数万名观众坐在两旁的草坡上。', credit:'dronepicr', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Ancient_Olympia_Stadium_in_Greece_(51224128585).jpg' } ] },
  thermopylae:{ en:'Thermopylae', zh:'温泉关', names:['Thermopylae','温泉关'], ll:[22.54, 38.80], kind:'pass',
    era:{ en:'Spartans hold the pass against Persia, 480 BCE', zh:'斯巴达人坚守关口抵抗波斯，公元前480年' },
    info:{ en:'A narrow path between mountains and the sea. King Leonidas and his 300 Spartans held off the huge Persian army here for three days.', zh:'一条夹在山与海之间的狭窄通道。斯巴达国王列奥尼达率300名斯巴达勇士在这里抵挡波斯大军三天。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Leonidas_Statue.jpg/960px-Leonidas_Statue.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The statue of King Leonidas at Thermopylae', zh:'温泉关的列奥尼达国王雕像', credit:'Pimpinellus', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Leonidas_Statue.jpg' } ] },
  salamis:{ en:'Salamis', zh:'萨拉米斯', names:['Salamis','萨拉米斯'], ll:[23.55, 37.95], kind:'battle',
    era:{ en:'Greek navy beats Persia, 480 BCE', zh:'希腊海军打败波斯，公元前480年' },
    info:{ en:'In this narrow strait the Athenian navy trapped and sank the Persian fleet. Sea power made Athens the leader of Greece.', zh:'雅典海军在这道狭窄的海峡里围住并击沉了波斯舰队。海上力量让雅典成为希腊的领袖。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Athens%2C_Piraeus_and_Salamis_from_Mount_Hymettus_on_September_28%2C_2019.jpg/960px-Athens%2C_Piraeus_and_Salamis_from_Mount_Hymettus_on_September_28%2C_2019.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Athens, the port of Piraeus and the island of Salamis seen from Mount Hymettus', zh:'从伊米托斯山眺望雅典、比雷埃夫斯港和萨拉米斯岛', credit:'George E. Koronaios', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Athens,_Piraeus_and_Salamis_from_Mount_Hymettus_on_September_28,_2019.jpg' } ] },
  corinth:{ en:'Corinth', zh:'科林斯', names:['Corinth','科林斯'], ll:[22.88, 37.91], kind:'city',
    era:{ en:'Trading city-state; destroyed by Rome 146 BCE', zh:'商业城邦；公元前146年被罗马摧毁' },
    info:{ en:'A rich trading city on the narrow neck of land joining the Peloponnese to mainland Greece. Its people founded Syracuse.', zh:'位于连接伯罗奔尼撒半岛和希腊本土的狭窄地峡上的富庶商业城市，叙拉古就是科林斯人建立的。' } ,
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Korinth_BW_2017-10-10_10-48-10.jpg/960px-Korinth_BW_2017-10-10_10-48-10.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ruins of ancient Corinth', zh:'古科林斯遗址', credit:'Berthold Werner', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Korinth_BW_2017-10-10_10-48-10.jpg' } ] },
  syracuse:{ en:'Syracuse', zh:'叙拉古', names:['Syracuse','叙拉古'], ll:[15.29, 37.08], kind:'city', subjects:['worldhistory'],
    today:{ en:'Siracusa, Sicily', zh:'今意大利西西里岛锡拉库萨' }, era:{ en:'Greek colony founded c. 733 BCE', zh:'约公元前733年建立的希腊殖民城邦' },
    info:{ en:'The richest Greek city on Sicily and home of Archimedes, who designed machines to defend it against Rome.', zh:'西西里岛上最富庶的希腊城市，阿基米德的家乡，他设计了许多机械来抵御罗马的进攻。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Greek_theater_of_Syracuse_AvL.JPG/960px-Greek_theater_of_Syracuse_AvL.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Greek theatre of Syracuse, carved into the rock', zh:'叙拉古在岩石上开凿的希腊剧场', credit:'AlexanderVanLoon', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Greek_theater_of_Syracuse_AvL.JPG' } ] },
  marseille:{ en:'Massalia (Marseille)', zh:'马西利亚（马赛）', names:['Massalia','Massilia','Marseille','马西利亚','马赛'], ll:[5.37, 43.30], kind:'port', subjects:['worldhistory'],
    today:{ en:'Marseille, France', zh:'今法国马赛' }, era:{ en:'Greek colony c. 600 BCE; later France’s great Mediterranean port', zh:'约公元前600年建立的希腊殖民城邦；后来是法国最大的地中海港口' },
    info:{ en:'Greek sailors founded Massalia about 2,600 years ago. In 1347 the Black Death arrived here by ship and spread into France.', zh:'约2600年前希腊水手建立了马西利亚。1347年，黑死病由船只传到这里，再蔓延到法国各地。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Marseille_Old_Port.jpg/960px-Marseille_Old_Port.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Old Port of Marseille, where Greek Massalia began', zh:'马赛老港，希腊人的马西利亚城就从这里开始', credit:'Ingo Mehling', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Marseille_Old_Port.jpg' } ] },
  pella:{ en:'Pella', zh:'佩拉', names:['Pella','佩拉'], ll:[22.52, 40.76], kind:'capital', subjects:['worldhistory'],
    era:{ en:'Capital of Macedon; Alexander born 356 BCE', zh:'马其顿王国的都城；亚历山大公元前356年生于此' },
    info:{ en:'Alexander the Great grew up here, taught by the philosopher Aristotle. Beautiful pebble mosaics have been found in its houses.', zh:'亚历山大大帝在这里长大，老师是哲学家亚里士多德。这里的房屋中出土了精美的卵石镶嵌画。' },
    photos:[
      { src:'https://upload.wikimedia.org/wikipedia/commons/1/1b/8._The_Stag_Hunt_mosaic_from_Pella.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'The Stag Hunt mosaic, made of pebbles, from a house in Pella', zh:'佩拉一座房屋里用卵石拼成的《猎鹿图》镶嵌画', credit:'inharecherche', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:8._The_Stag_Hunt_mosaic_from_Pella.jpg' } ] },
  chaeronea:{ en:'Chaeronea', zh:'喀罗尼亚', names:['Chaeronea','喀罗尼亚'], ll:[22.84, 38.49], kind:'battle',
    era:{ en:'Macedon defeats Athens and Thebes, 338 BCE', zh:'马其顿打败雅典和底比斯，公元前338年' },
    info:{ en:'Philip II of Macedon and his 18-year-old son Alexander won here, ending the independence of the Greek city-states. A stone lion marks the battlefield.', zh:'马其顿的腓力二世和他18岁的儿子亚历山大在这里获胜，希腊城邦从此失去独立。战场上立着一尊石狮。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Lion_of_Chaeronea%2C_September_2022_01.jpg/960px-Lion_of_Chaeronea%2C_September_2022_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The stone Lion of Chaeronea guarding the battlefield', zh:'守护喀罗尼亚古战场的石狮', credit:'Calistemon', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Lion_of_Chaeronea,_September_2022_01.jpg' } ] },
  tiber:{ en:'Tiber River', zh:'台伯河', names:['Tiber','台伯河'], ll:[12.47, 41.89], kind:'river',
    era:{ en:'Rome’s river', zh:'流经罗马城的河' },
    info:{ en:'Legend says the twins Romulus and Remus were left in a basket on the Tiber and saved by a she-wolf. Rome grew where the river could be crossed.', zh:'传说双胞胎罗慕路斯和雷穆斯被放在篮子里丢进台伯河，后来被一只母狼救下。罗马城就建在河流便于渡过的地方。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Castel_Sant%27Angelo_at_dusk%2C_Rome%2C_Italy.jpg/960px-Castel_Sant%27Angelo_at_dusk%2C_Rome%2C_Italy.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Tiber and Castel Sant’Angelo in Rome at dusk', zh:'黄昏时分罗马的台伯河与圣天使堡', credit:'Jebulon', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Castel_Sant%27Angelo_at_dusk,_Rome,_Italy.jpg' } ] },
  forum:{ en:'Roman Forum', zh:'古罗马广场', names:['Roman Forum','古罗马广场','罗马广场'], ll:[12.485, 41.892], kind:'site',
    era:{ en:'Heart of Rome for about 1,000 years', zh:'约一千年里罗马城的中心' },
    info:{ en:'Romans came here to shop, hear speeches, go to court and watch the Senate. Now its broken columns stand among the ruins of temples.', zh:'罗马人来这里购物、听演讲、打官司、看元老院开会。如今只剩神庙废墟和断柱。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Forum_romanum_6k_%285760x2097%29.jpg/960px-Forum_romanum_6k_%285760x2097%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Roman Forum — the center of the city of Rome, with temples, law courts and the Senate house, where citizens met, shopped and heard speeches.', zh:'古罗马广场——罗马城的中心，有神庙、法院和元老院议事堂，市民在这里聚会、购物、听演讲。', credit:'BeBo86', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Forum_romanum_6k_(5760x2097).jpg' } ] },
  colosseum:{ en:'Colosseum', zh:'罗马大斗兽场', names:['Colosseum','大斗兽场','斗兽场'], ll:[12.492, 41.890], kind:'building', subjects:['worldhistory'],
    era:{ en:'Opened 80 CE', zh:'公元80年落成' },
    info:{ en:'About 50,000 people could watch gladiator fights here. Its arches and vaults are still copied in stadiums today.', zh:'这里可以容纳约5万名观众观看角斗士搏斗。它的拱券结构至今还被现代体育场借鉴。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/960px-Colosseo_2020.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Colosseum in Rome, 2020.', zh:'罗马大斗兽场，2020年。', credit:'FeaturedPics', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg' } ] },
  carthage:{ en:'Carthage', zh:'迦太基', names:['Carthage','迦太基'], ll:[10.32, 36.85], kind:'city',
    today:{ en:'near Tunis, Tunisia', zh:'今突尼斯首都突尼斯附近' }, era:{ en:'Rome’s rival in the Punic Wars; destroyed 146 BCE', zh:'布匿战争中罗马的对手；公元前146年被毁' },
    info:{ en:'A Phoenician trading city whose general Hannibal crossed the Alps with elephants to attack Rome. Romans later rebuilt it as a Roman city.', zh:'腓尼基人的商业城市，它的统帅汉尼拔曾带着战象翻越阿尔卑斯山进攻罗马。后来罗马人在原址重建了城市。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Antonine_Baths.jpg/960px-Antonine_Baths.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ruins of the Roman baths at Carthage, by the sea', zh:'迦太基海边的罗马浴场遗址', credit:'Bernard Gagnon', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Antonine_Baths.jpg' } ] },
  appianway:{ en:'Appian Way', zh:'阿庇亚大道', names:['Appian Way','Via Appia','阿庇亚大道'], ll:[12.53, 41.85], kind:'site',
    era:{ en:'Begun 312 BCE', zh:'公元前312年开始修建' },
    info:{ en:'The “queen of roads” ran from Rome to Brundisium (Brindisi). Its paving stones are still there after more than 2,300 years.', zh:'这条“道路女王”从罗马通到布隆迪西乌姆（今布林迪西）。2300多年过去了，路面的石板仍在原处。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Appian_Way.jpg/960px-Appian_Way.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Appian Way (Via Appia) near Casal Rotondo, outside Rome.', zh:'罗马城外卡萨尔罗通多附近的阿庇亚大道。', credit:'Livioandronico2013', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Appian_Way.jpg' } ] },
  pompeii:{ en:'Pompeii', zh:'庞贝', names:['Pompeii','庞贝古城','庞贝'], ll:[14.48, 40.75], kind:'site',
    era:{ en:'Buried by Mount Vesuvius, 79 CE', zh:'公元79年被维苏威火山掩埋' },
    info:{ en:'When Vesuvius erupted, ash buried the whole town. Digging it out shows us Roman streets, shops, bakeries and paintings just as they were.', zh:'维苏威火山爆发时，火山灰掩埋了整座城。发掘出来的街道、商店、面包房和壁画让我们看到罗马人当年的生活。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Pompeii_Ruins_%26_Mt._Vesuvius_%2848442337717%29.jpg/960px-Pompeii_Ruins_%26_Mt._Vesuvius_%2848442337717%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The ruins of Pompeii with Mount Vesuvius behind. The volcano buried this Roman town in ash in 79 CE, preserving its streets, shops and houses.', zh:'庞贝古城遗址，背后是维苏威火山。公元79年火山喷发，火山灰掩埋了这座罗马小城，也把街道、商店和房屋保存了下来。', credit:'Gary Todd', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Pompeii_Ruins_%26_Mt._Vesuvius_(48442337717).jpg' } ] },
  pontdugard:{ en:'Pont du Gard', zh:'加尔桥', names:['Pont du Gard','加尔桥'], ll:[4.535, 43.947], kind:'building',
    era:{ en:'Roman aqueduct bridge, 1st century CE', zh:'罗马引水桥，公元1世纪' },
    info:{ en:'Three rows of stone arches carry an aqueduct 49 m above the river. The water channel drops only about 2.5 cm in the whole bridge.', zh:'三层石拱把引水渠架在高出河面49米的地方。整座桥上的水渠只下降了约2.5厘米。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Pont_du_Gard_BLS.jpg/960px-Pont_du_Gard_BLS.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Pont du Gard in southern France — the most famous part of the Roman aqueduct that carried water from near Uzès to Nîmes.', zh:'法国南部的加尔桥——从于泽斯附近向尼姆输水的罗马引水渠中最著名的一段。', credit:'Benh LIEU SONG (Flickr)', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Pont_du_Gard_BLS.jpg' } ] },
  hadrianswall:{ en:'Hadrian’s Wall', zh:'哈德良长城', names:['Hadrian’s Wall','Hadrian’s Wall','哈德良长城'], ll:[-2.33, 55.01], kind:'site',
    era:{ en:'Built from 122 CE', zh:'公元122年开始修建' },
    info:{ en:'A stone wall about 118 km long across northern Britain, guarding the edge of the Roman Empire. Soldiers lived in forts along it.', zh:'横贯不列颠北部、长约118千米的石墙，守卫着罗马帝国的边界。士兵们驻扎在沿线的堡垒里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Hadrian%27s_Wall_on_Housesteads_Crags_-_06.jpg/960px-Hadrian%27s_Wall_on_Housesteads_Crags_-_06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Hadrian’s Wall running along the crags at Housesteads', zh:'沿着豪斯斯特兹山崖延伸的哈德良长城', credit:'Benjamin Smith', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Hadrian%27s_Wall_on_Housesteads_Crags_-_06.jpg' } ] },
  ravenna:{ en:'Ravenna', zh:'拉文纳', names:['Ravenna','拉文纳'], ll:[12.20, 44.42], kind:'capital',
    era:{ en:'Last capital of the Western Roman Empire, 402–476', zh:'西罗马帝国最后的都城，402—476年' },
    info:{ en:'The last Western Roman emperor, Romulus Augustulus, was removed here in 476. Its churches glitter with Byzantine mosaics of Emperor Justinian.', zh:'476年，西罗马最后一位皇帝罗慕路斯·奥古斯都路斯在这里被废黜。这里的教堂里有闪闪发光的查士丁尼皇帝镶嵌画。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Justinian_mosaic%2C_San_Vitale%2C_consecrated_547%2C_Ravenna%2C_Italy.jpg/960px-Justinian_mosaic%2C_San_Vitale%2C_consecrated_547%2C_Ravenna%2C_Italy.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Emperor Justinian in the mosaic of San Vitale, Ravenna', zh:'拉文纳圣维塔莱教堂镶嵌画中的查士丁尼皇帝', credit:'Steven Zucker', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Justinian_mosaic,_San_Vitale,_consecrated_547,_Ravenna,_Italy.jpg' } ] },
  /* ---------- Middle Ages: Byzantium, Islam, Western Europe ---------- */
  hagiasophia:{ en:'Hagia Sophia', zh:'圣索菲亚大教堂', names:['Hagia Sophia','圣索菲亚大教堂'], ll:[28.980, 41.008], kind:'building',
    era:{ en:'Built 532–537 for Emperor Justinian', zh:'532—537年为查士丁尼皇帝修建' },
    info:{ en:'For almost 1,000 years its dome was the biggest in the world. It was a church, then a mosque after 1453; the minarets were added by the Ottomans.', zh:'近一千年里，它的穹顶是世界上最大的。它先是教堂，1453年后改为清真寺，宣礼塔是奥斯曼人加建的。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/960px-Hagia_Sophia_Mars_2013.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Hagia Sophia in Istanbul (once Constantinople), built 532–537 for Emperor Justinian. The minarets were added later, after 1453.', zh:'伊斯坦布尔（昔日的君士坦丁堡）的圣索菲亚大教堂，532—537年为查士丁尼皇帝修建。宣礼塔是1453年以后加建的。', credit:'Arild Vågen', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Mars_2013.jpg' } ] },
  mecca:{ en:'Mecca', zh:'麦加', names:['Mecca','麦加'], ll:[39.83, 21.42], kind:'city',
    era:{ en:'Birthplace of Muhammad, c. 570', zh:'穆罕默德约570年生于此' },
    info:{ en:'The holiest city of Islam. Every year millions of Muslims come here on the pilgrimage (hajj) to the Kaaba.', zh:'伊斯兰教第一圣地。每年有数百万穆斯林来这里的克尔白朝觐。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Masjid_al-Haram_2022.jpg/960px-Masjid_al-Haram_2022.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Great Mosque of Mecca, with the Kaaba in its courtyard', zh:'麦加大清真寺，庭院中央是克尔白', credit:'مريم محمد الغلبان', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Masjid_al-Haram_2022.jpg' } ] },
  medina:{ en:'Medina', zh:'麦地那', names:['Medina','麦地那'], ll:[39.61, 24.47], kind:'city',
    era:{ en:'Muhammad moved here in 622 (the Hijra)', zh:'622年穆罕默德迁到这里（“希吉拉”）' },
    info:{ en:'Muhammad and his followers moved here from Mecca in 622 — year 1 of the Islamic calendar. His tomb is in the Prophet’s Mosque.', zh:'622年穆罕默德和追随者从麦加迁到这里——这一年是伊斯兰历的元年。他的陵墓在先知清真寺里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg/960px-Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Green Dome of the Prophet’s Mosque in Medina', zh:'麦地那先知清真寺的绿色圆顶', credit:'TheHadiRahim', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_(Al_Masjid-e-Nabawi).jpg' } ] },
  damascus:{ en:'Damascus', zh:'大马士革', names:['Damascus','大马士革'], ll:[36.31, 33.51], kind:'capital',
    era:{ en:'Capital of the Umayyad Caliphate, 661–750', zh:'倭马亚王朝的都城，661—750年' },
    info:{ en:'One of the oldest cities in the world that people still live in. The Umayyad caliphs built its Great Mosque in the early 700s.', zh:'世界上至今仍有人居住的最古老城市之一。倭马亚王朝的哈里发在8世纪初修建了这里的大清真寺。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Umayyad_Mosque%2C_Damascus.jpg/960px-Umayyad_Mosque%2C_Damascus.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Umayyad Mosque in Damascus, built in the early 700s', zh:'大马士革的倭马亚清真寺，建于8世纪初', credit:'Bernard Gagnon', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Umayyad_Mosque,_Damascus.jpg' } ] },
  cordoba:{ en:'Córdoba', zh:'科尔多瓦', names:['Córdoba','Cordoba','科尔多瓦'], ll:[-4.78, 37.88], kind:'capital',
    era:{ en:'Capital of Muslim Spain (al-Andalus)', zh:'穆斯林统治的西班牙（安达卢斯）的都城' },
    info:{ en:'Around the year 1000 it was one of the biggest cities in Europe, with paved streets, street lamps and huge libraries. Its Great Mosque has red-and-white arches.', zh:'约公元1000年，它是欧洲最大的城市之一，有铺石街道、路灯和大型图书馆。大清真寺里有红白相间的拱门。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Mezquita_cordoba_arco_interior.jpg/960px-Mezquita_cordoba_arco_interior.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Red-and-white striped arches inside the Great Mosque of Córdoba, Spain, begun in 785 when Muslim rulers governed al-Andalus.', zh:'西班牙科尔多瓦大清真寺里红白相间的拱门——始建于785年，当时穆斯林统治着安达卢斯。', credit:'Alvaro.vinuela.carnicero', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Mezquita_cordoba_arco_interior.jpg' } ] },
  granada:{ en:'Granada', zh:'格拉纳达', names:['Granada','Alhambra','格拉纳达','阿尔罕布拉宫'], ll:[-3.59, 37.18], kind:'city',
    era:{ en:'Last Muslim kingdom in Spain, until 1492', zh:'西班牙最后一个穆斯林王国，到1492年' },
    info:{ en:'The Alhambra palace, with its fountains and carved ceilings, looks down on the city. In 1492 Spain’s Catholic monarchs took Granada.', zh:'有喷泉和精美雕刻天花板的阿尔罕布拉宫俯瞰着全城。1492年，西班牙的天主教国王攻占了格拉纳达。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Alhambra_in_the_evening.jpg/960px-Alhambra_in_the_evening.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Alhambra palace above Granada at evening', zh:'傍晚格拉纳达城上方的阿尔罕布拉宫', credit:'Jebulon', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Alhambra_in_the_evening.jpg' } ] },
  tours:{ en:'Tours (Poitiers)', zh:'图尔（普瓦捷）', names:['Battle of Tours','Tours','图尔战役','普瓦提埃战役'], ll:[0.42, 46.72], kind:'battle', subjects:['worldhistory'],
    era:{ en:'Franks stop an Arab army, 732', zh:'法兰克人阻挡阿拉伯军队，732年' },
    info:{ en:'Charles Martel and the Franks defeated an Umayyad army from Spain here. After this, Muslim armies did not push further into France.', zh:'查理·马特率领法兰克人在这里打败了从西班牙北上的倭马亚军队，此后穆斯林军队没有再深入法国。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Baron_Charles_de_Steuben_-_Battle_of_Poitiers%2C_25_October_732_-_1916.957_-_Cleveland_Museum_of_Art.tif/lossy-page1-960px-Baron_Charles_de_Steuben_-_Battle_of_Poitiers%2C_25_October_732_-_1916.957_-_Cleveland_Museum_of_Art.tif.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The battle of 732 as imagined by the painter Charles de Steuben (1837)', zh:'画家斯托本想象中的732年之战（1837年）', credit:'Baron Charles de Steuben', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Baron_Charles_de_Steuben_-_Battle_of_Poitiers,_25_October_732_-_1916.957_-_Cleveland_Museum_of_Art.tif' } ] },
  aachen:{ en:'Aachen', zh:'亚琛', names:['Aachen','亚琛'], ll:[6.08, 50.78], kind:'capital',
    era:{ en:'Charlemagne’s capital, c. 800', zh:'查理曼的都城，约800年' },
    info:{ en:'Charlemagne built a palace and a domed chapel here and is buried in it. German kings were crowned in Aachen for 600 years.', zh:'查理曼在这里修建了宫殿和圆顶礼拜堂，死后也葬在这里。此后600年，德意志国王都在亚琛加冕。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Aachen%2C_Dom_--_2022_--_5106.jpg/960px-Aachen%2C_Dom_--_2022_--_5106.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Aachen Cathedral, with Charlemagne’s chapel at its heart', zh:'亚琛大教堂，中心是查理曼的礼拜堂', credit:'Dietmar Rabich', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Aachen,_Dom_--_2022_--_5106.jpg' } ] },
  verdun:{ en:'Verdun', zh:'凡尔登', names:['Verdun','凡尔登'], ll:[5.38, 49.16], kind:'city', subjects:['worldhistory'],
    era:{ en:'Treaty of Verdun splits Charlemagne’s empire, 843', zh:'843年《凡尔登条约》三分查理曼帝国' },
    info:{ en:'Charlemagne’s grandsons divided his empire here into three kingdoms — the beginnings of France and Germany.', zh:'查理曼的孙子们在这里把帝国一分为三，这是法国和德国的雏形。' } ,
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Verdun_-_cath%C3%A9drale_Notre-Dame_%2802%29.JPG/960px-Verdun_-_cath%C3%A9drale_Notre-Dame_%2802%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Verdun Cathedral', zh:'凡尔登大教堂', credit:'Fab5669', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Verdun_-_cath%C3%A9drale_Notre-Dame_(02).JPG' } ] },
  hastings:{ en:'Hastings', zh:'黑斯廷斯', names:['Battle of Hastings','Hastings','黑斯廷斯'], ll:[0.49, 50.91], kind:'battle',
    era:{ en:'Norman Conquest of England, 1066', zh:'诺曼征服英格兰，1066年' },
    info:{ en:'William of Normandy defeated King Harold here and became king of England. The town that grew on the battlefield is simply called “Battle”.', zh:'诺曼底公爵威廉在这里打败哈罗德国王，成为英格兰国王。战场上后来形成的小镇就叫“巴特尔”（意思是“战斗”）。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Battle_Abbey_2018.jpg/960px-Battle_Abbey_2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Battle Abbey, built by William the Conqueror on the battlefield', zh:'征服者威廉在战场上修建的巴特尔修道院', credit:'WikJonah', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Battle_Abbey_2018.jpg' } ] },
  bayeux:{ en:'Bayeux', zh:'巴约', names:['Bayeux Tapestry','Bayeux','巴约挂毯','巴约'], ll:[-0.70, 49.28], kind:'city',
    era:{ en:'Home of the Bayeux Tapestry (1070s)', zh:'巴约挂毯的收藏地（11世纪70年代）' },
    info:{ en:'A 70-metre embroidered cloth kept here tells the story of the Norman Conquest like a comic strip.', zh:'这里收藏的一幅约70米长的刺绣，像连环画一样讲述了诺曼征服的故事。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Bayeux_Tapestry_scene23_Harold_sacramentum_fecit_Willelmo_duci.jpg/960px-Bayeux_Tapestry_scene23_Harold_sacramentum_fecit_Willelmo_duci.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Bayeux Tapestry, scene 23: Harold swears an oath on holy relics to William, Duke of Normandy — a promise at the heart of the 1066 Norman Conquest.', zh:'贝叶挂毯第23幕：哈罗德手按圣物向诺曼底公爵威廉宣誓——这个誓言是1066年诺曼征服的起因之一。', credit:'Myrabella', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Bayeux_Tapestry_scene23_Harold_sacramentum_fecit_Willelmo_duci.jpg' } ] },
  london:{ en:'London', zh:'伦敦', names:['London','伦敦'], ll:[-0.13, 51.51], kind:'capital',
    era:{ en:'English capital since the Middle Ages', zh:'中世纪以来英格兰的首都' },
    info:{ en:'William the Conqueror began the Tower of London. Later London was the heart of the English Revolution, the Industrial Revolution and a huge empire.', zh:'征服者威廉开始修建伦敦塔。后来伦敦成为英国革命、工业革命和一个庞大帝国的中心。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Tower_of_London_viewed_from_the_River_Thames.jpg/960px-Tower_of_London_viewed_from_the_River_Thames.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Tower of London beside the River Thames', zh:'泰晤士河畔的伦敦塔', credit:'Bob Collowan', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Tower_of_London_viewed_from_the_River_Thames.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Ve_Day_Celebrations_in_London%2C_8_May_1945_TR2876.jpg/960px-Ve_Day_Celebrations_in_London%2C_8_May_1945_TR2876.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'VE Day (Victory in Europe), 8 May 1945: huge crowds fill Whitehall in London to celebrate the end of the war in Europe.', zh:'1945年5月8日欧洲胜利日：伦敦白厅街挤满了庆祝欧洲战争结束的人群。', credit:'British official photographer (Imperial War Museums)', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Ve_Day_Celebrations_in_London,_8_May_1945_TR2876.jpg' } ] },
  paris:{ en:'Paris', zh:'巴黎', names:['Paris','巴黎'], ll:[2.35, 48.86], kind:'capital',
    era:{ en:'Capital of the French kings; city of the French Revolution', zh:'法国国王的都城；法国大革命的发生地' },
    info:{ en:'Notre-Dame cathedral was begun here in 1163 and its university grew around 1200. In 1789 Parisians stormed the Bastille fortress.', zh:'巴黎圣母院1163年动工，巴黎大学约1200年形成。1789年，巴黎人民攻占了巴士底狱。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Notre-Dame_de_Paris_2013-07-24.jpg/960px-Notre-Dame_de_Paris_2013-07-24.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Notre-Dame de Paris, west front (2013). This Gothic cathedral was begun in 1163.', zh:'巴黎圣母院西立面（2013年摄）。这座哥特式大教堂始建于1163年。', credit:'P e z i', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris_2013-07-24.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/01_vue_Paris_depuis_Notre-Dame.jpg/960px-01_vue_Paris_depuis_Notre-Dame.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Paris and the Seine seen from the towers of Notre-Dame', zh:'从巴黎圣母院塔楼上眺望巴黎和塞纳河', credit:'Myrabella', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:01_vue_Paris_depuis_Notre-Dame.jpg' } ] },
  chartres:{ en:'Chartres Cathedral', zh:'沙特尔大教堂', names:['Chartres','沙特尔'], ll:[1.487, 48.448], kind:'building',
    era:{ en:'Gothic cathedral, 1194–1220s', zh:'哥特式大教堂，1194—13世纪20年代' },
    info:{ en:'It still has most of its original stained-glass windows from the 1200s — Bible stories in coloured light for people who could not read.', zh:'它至今保留着大部分13世纪的原装彩色玻璃窗——用彩色的光给不识字的人讲圣经故事。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Chartres_-_cath%C3%A9drale_-_rosace_nord.jpg/960px-Chartres_-_cath%C3%A9drale_-_rosace_nord.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The north rose window of Chartres Cathedral, France (1200s). Stained-glass windows told Bible stories in pictures to people who could not read.', zh:'法国沙特尔大教堂的北玫瑰窗（13世纪）。彩色玻璃窗用图画讲述《圣经》故事，给不识字的人看。', credit:'Eusebius', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Chartres_-_cath%C3%A9drale_-_rosace_nord.jpg' } ] },
  bologna:{ en:'Bologna', zh:'博洛尼亚', names:['Bologna','博洛尼亚'], ll:[11.34, 44.49], kind:'city',
    era:{ en:'University founded 1088', zh:'大学建于1088年' },
    info:{ en:'Its university is often called the oldest in Europe. Students came from all over Europe to study Roman law here.', zh:'博洛尼亚大学常被称为欧洲最古老的大学，欧洲各地的学生来这里学习罗马法。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Archiginnasio_di_Bologna.jpg/960px-Archiginnasio_di_Bologna.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Archiginnasio, an old home of the University of Bologna', zh:'阿尔基金纳西奥宫，博洛尼亚大学的旧校舍', credit:'Anita.malina', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Archiginnasio_di_Bologna.jpg' } ] },
  carcassonne:{ en:'Carcassonne', zh:'卡尔卡松', names:['Carcassonne','卡尔卡松'], ll:[2.36, 43.21], kind:'building',
    era:{ en:'Walled medieval city', zh:'中世纪城堡式古城' },
    info:{ en:'A whole hilltop town wrapped in two rings of walls with 52 towers — what a medieval fortress city looked like.', zh:'一整座山顶小城被两圈城墙和52座塔楼包围，让我们看到中世纪城堡城市的样子。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/1_carcassonne_aerial_2016.jpg/960px-1_carcassonne_aerial_2016.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Aerial view of the walled Cité de Carcassonne in southern France, with its double ring of walls and towers.', zh:'法国南部卡尔卡松城堡（卡尔卡松古城）航拍，可以看到两道城墙和许多塔楼。', credit:'Chensiyuan', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:1_carcassonne_aerial_2016.jpg' } ] },
  bodiam:{ en:'Bodiam Castle', zh:'博迪亚姆城堡', names:['Bodiam Castle','Bodiam','博迪亚姆城堡','博迪亚姆'], ll:[0.543, 51.002], kind:'building',
    era:{ en:'Built 1385', zh:'1385年建成' },
    info:{ en:'A square castle standing in a wide moat, with round towers at the corners and a gatehouse reached by a bridge.', zh:'一座矗立在宽阔护城河中的方形城堡，四角有圆塔，要过桥才能到达门楼。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Bodiam_Castle_from_the_north_2019-05-28.jpg/960px-Bodiam_Castle_from_the_north_2019-05-28.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Bodiam Castle, a 14th-century moated castle in East Sussex, England, seen from the north over its drawbridge.', zh:'英格兰东萨塞克斯郡的博迪亚姆城堡，一座14世纪的护城河城堡，从北面隔着吊桥拍摄。', credit:'August Schwerdfeger', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Bodiam_Castle_from_the_north_2019-05-28.jpg' } ] },
  dublin:{ en:'Dublin', zh:'都柏林', names:['Dublin','都柏林'], ll:[-6.26, 53.34], kind:'city', subjects:['worldhistory','geography','economics','politics','china','yuwen'],   // not georgia: Dublin, GA
    era:{ en:'Home of the Book of Kells (Trinity College)', zh:'《凯尔经》收藏于这里的三一学院' },
    info:{ en:'The Book of Kells, painted by Irish monks around 800, is kept in the library of Trinity College here. In 1348 the Black Death crossed the sea to Dublin.', zh:'约800年由爱尔兰修士绘制的《凯尔经》收藏在这里的三一学院图书馆。1348年，黑死病越海传到都柏林。' },
    photos:[
      { src:'https://upload.wikimedia.org/wikipedia/commons/9/98/Book_of_Kells_ChiRho_Folio_34R.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'The Chi Rho page of the Book of Kells, made by Irish monks around 800 — every letter was painted by hand on calfskin, with tiny animals hidden in the swirls.', zh:'《凯尔经》中的“基督名号”页，约公元800年由爱尔兰修士制作——每个字母都是在小牛皮上手绘的，漩涡花纹里还藏着小动物。', credit:'Irish or Scottish monks (Trinity College Dublin)', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Book_of_Kells_ChiRho_Folio_34R.png' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Long_Room_Interior%2C_Trinity_College_Dublin%2C_Ireland_-_Diliff.jpg/960px-Long_Room_Interior%2C_Trinity_College_Dublin%2C_Ireland_-_Diliff.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Long Room library of Trinity College Dublin, where the Book of Kells is kept', zh:'都柏林三一学院的长厅图书馆，《凯尔经》就收藏在这里', credit:'Diliff', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Long_Room_Interior,_Trinity_College_Dublin,_Ireland_-_Diliff.jpg' } ] },
  jerusalem:{ en:'Jerusalem', zh:'耶路撒冷', names:['Jerusalem','耶路撒冷'], ll:[35.23, 31.78], kind:'city',
    era:{ en:'Holy city of three religions; taken by Crusaders 1099, by Saladin 1187', zh:'三大宗教的圣城；1099年被十字军攻占，1187年被萨拉丁收复' },
    info:{ en:'A holy city for Jews, Christians and Muslims. Its Old City holds the Western Wall, the Church of the Holy Sepulchre and the Dome of the Rock.', zh:'犹太教、基督教和伊斯兰教共同的圣城。老城里有西墙（哭墙）、圣墓教堂和圆顶清真寺（金顶清真寺）。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg/960px-Jerusalem-2013%282%29-Temple_Mount-Dome_of_the_Rock_%28SE_exposure%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Dome of the Rock on the Temple Mount in Jerusalem’s Old City', zh:'耶路撒冷老城圣殿山上的圆顶清真寺', credit:'Godot13', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Jerusalem-2013(2)-Temple_Mount-Dome_of_the_Rock_(SE_exposure).jpg' } ] },
  manzikert:{ en:'Manzikert', zh:'曼齐刻尔特', names:['Manzikert','曼齐刻尔特'], ll:[42.54, 39.14], kind:'battle',
    today:{ en:'Malazgirt, Türkiye', zh:'今土耳其马拉兹吉尔特' }, era:{ en:'Seljuk Turks defeat Byzantium, 1071', zh:'塞尔柱突厥人打败拜占庭，1071年' },
    info:{ en:'The Seljuk Turks defeated and captured the Byzantine emperor here. Byzantium lost most of Anatolia and asked western Europe for help — leading to the Crusades.', zh:'塞尔柱突厥人在这里打败并俘虏了拜占庭皇帝。拜占庭失去了小亚细亚的大部分土地，向西欧求援，引发了十字军东征。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/131_Bataille_de_Malazgirt.jpg/960px-131_Bataille_de_Malazgirt.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Battle of Manzikert in a 15th-century French manuscript', zh:'15世纪法国手抄本中的曼齐刻尔特之战', credit:'Rohan Master', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:131_Bataille_de_Malazgirt.jpg' } ] },
  acre:{ en:'Acre', zh:'阿卡', names:['Acre'], ll:[35.07, 32.92], kind:'port', subjects:['worldhistory'],
    today:{ en:'Akko, Israel', zh:'今以色列阿卡' }, era:{ en:'Crusader port; fell to the Mamluks 1291', zh:'十字军的港口；1291年被马穆鲁克攻占' },
    info:{ en:'The Crusaders’ main port and last big stronghold in the Holy Land. When it fell in 1291, the Crusades in the East were over.', zh:'十字军在圣地的主要港口和最后一个大据点。1291年它陷落后，东方的十字军时代就结束了。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Acre_City_Walls_%28S%29_and_Arches_on_Magistrate%27s_Ct._Acre%2C_Old_City_%28SRF_5%3B_284%29.jpg/960px-Acre_City_Walls_%28S%29_and_Arches_on_Magistrate%27s_Ct._Acre%2C_Old_City_%28SRF_5%3B_284%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The old sea walls of Acre', zh:'阿卡古老的海边城墙', credit:'The Israel Antiquities Authority scienti', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Acre_City_Walls_(S)_and_Arches_on_Magistrate%27s_Ct._Acre,_Old_City_(SRF_5;_284).jpg' } ] },
  cairo:{ en:'Cairo', zh:'开罗', names:['Cairo','开罗'], ll:[31.24, 30.04], kind:'capital',
    era:{ en:'Founded 969; Mamluk capital', zh:'969年建城；马穆鲁克王朝的都城' },
    info:{ en:'Saladin built its Citadel on a hill in the 1170s. In the Middle Ages it was one of the biggest trading cities in the world.', zh:'萨拉丁在12世纪70年代在山上修建了开罗城堡。中世纪时，开罗是世界上最大的商业城市之一。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_%D9%82%D9%84%D8%B9%D8%A9_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D8%A7%D9%84%D8%A3%D9%8A%D9%88%D8%A8%D9%8A_%D9%88%D9%85%D8%B3%D8%AC%D8%AF_%D9%85%D8%AD%D9%85%D8%AF_%D8%B9%D9%84%D9%8A_-_Cairo_-_Egypt_-_17_04_2010_%284%29.jpg/960px-thumbnail.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Citadel of Saladin above Cairo, with the later Muhammad Ali Mosque', zh:'开罗萨拉丁城堡，城堡上是后来修建的穆罕默德·阿里清真寺', credit:'Ahmed Al.Badawy', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_%D9%82%D9%84%D8%B9%D8%A9_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D8%A7%D9%84%D8%A3%D9%8A%D9%88%D8%A8%D9%8A_%D9%88%D9%85%D8%B3%D8%AC%D8%AF_%D9%85%D8%AD%D9%85%D8%AF_%D8%B9%D9%84%D9%8A_-_Cairo_-_Egypt_-_17_04_2010_(4).jpg' } ] },
  aynjalut:{ en:'Ain Jalut', zh:'艾因贾鲁特', names:['Ain Jalut','艾因贾鲁特'], ll:[35.36, 32.55], kind:'battle',
    today:{ en:'Harod spring, Israel', zh:'今以色列哈罗德泉' }, era:{ en:'Mamluks stop the Mongols, 1260', zh:'马穆鲁克阻挡蒙古军队，1260年' },
    info:{ en:'Two years after the Mongols destroyed Baghdad, the Mamluks of Egypt beat a Mongol army here — one of the first big Mongol defeats.', zh:'蒙古人攻破巴格达两年后，埃及的马穆鲁克军队在这里打败了一支蒙古军队，这是蒙古军最早遭遇的大败之一。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Ma%27ayan_Harod_National_Park%2C_Harod_Valley%2C_Israel_04.jpg/960px-Ma%27ayan_Harod_National_Park%2C_Harod_Valley%2C_Israel_04.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Harod spring (Ain Jalut) in northern Israel', zh:'以色列北部的哈罗德泉（艾因贾鲁特）', credit:'Hoshvilim', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Ma%27ayan_Harod_National_Park,_Harod_Valley,_Israel_04.jpg' } ] },
  talas:{ en:'Talas', zh:'怛罗斯', names:['Battle of Talas','Talas','怛罗斯'], ll:[71.4, 42.6], kind:'battle',
    today:{ en:'Taraz area, Kazakhstan', zh:'今哈萨克斯坦塔拉兹一带' }, era:{ en:'Tang and Abbasid armies meet, 751', zh:'唐朝与阿拔斯王朝军队交战，751年' },
    info:{ en:'The only big battle between Tang China and the Abbasid Caliphate. The traditional story says captured Chinese papermakers then spread paper-making west.', zh:'唐朝与阿拔斯王朝之间唯一的一次大战。传统说法认为，被俘的唐朝造纸工匠把造纸术传到了西方。' } },
  caffa:{ en:'Caffa', zh:'卡法', names:['Caffa','卡法'], ll:[35.38, 45.03], kind:'port',
    today:{ en:'Feodosia, Crimea', zh:'今克里米亚费奥多西亚' }, era:{ en:'Genoese trading port; plague siege 1346', zh:'热那亚人的贸易港；1346年鼠疫围城' },
    info:{ en:'A Genoese port on the Black Sea besieged by a Mongol army that had the plague. Ships escaping from here helped carry the Black Death to Europe.', zh:'热那亚人在黑海边的港口，被染上鼠疫的蒙古军队围攻。从这里逃出的船只把黑死病带到了欧洲。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/THE_GENOESE_FORTRESS_IN_CAFFA.jpg/960px-THE_GENOESE_FORTRESS_IN_CAFFA.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The walls of the Genoese fortress at Caffa (Feodosia)', zh:'卡法（费奥多西亚）热那亚要塞的城墙', credit:'Qypchak', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:THE_GENOESE_FORTRESS_IN_CAFFA.jpg' } ] },
  messina:{ en:'Messina', zh:'墨西拿', names:['Messina','墨西拿'], ll:[15.55, 38.19], kind:'port',
    era:{ en:'Plague arrives in western Europe, October 1347', zh:'1347年10月，鼠疫传入西欧' },
    info:{ en:'Twelve Genoese galleys docked here in 1347 with sick sailors on board — the Black Death’s doorway into western Europe.', zh:'1347年，12艘载着病倒水手的热那亚桨帆船停靠在这里——黑死病由此进入西欧。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Harbour_of_Messina_-_Sicily_-_Italy_-_15_Aug._2009.jpg/960px-Harbour_of_Messina_-_Sicily_-_Italy_-_15_Aug._2009.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The harbour of Messina, Sicily', zh:'西西里岛墨西拿港', credit:'Jacopo Werther', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Harbour_of_Messina_-_Sicily_-_Italy_-_15_Aug._2009.jpg' } ] },
  genoa:{ en:'Genoa', zh:'热那亚', names:['Genoa','Genua','热那亚'], ll:[8.93, 44.41], kind:'port',
    era:{ en:'Sea-trading republic; Columbus’s home town', zh:'海上贸易共和国；哥伦布的家乡' },
    info:{ en:'Its merchants traded from the Black Sea to England. Christopher Columbus was born here around 1451.', zh:'热那亚商人的贸易从黑海一直做到英格兰。克里斯托弗·哥伦布约1451年出生在这里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Harbour_with_cranes_and_Lanterna_Lighthouse_Genova_%28IT%29.jpg/960px-Harbour_with_cranes_and_Lanterna_Lighthouse_Genova_%28IT%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The harbour of Genoa and its old lighthouse, the Lanterna', zh:'热那亚港和古老的灯塔', credit:'Mariojan photo', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Harbour_with_cranes_and_Lanterna_Lighthouse_Genova_(IT).jpg' } ] },
  florence:{ en:'Florence', zh:'佛罗伦萨', names:['Florence','佛罗伦萨'], ll:[11.25, 43.77], kind:'city',
    era:{ en:'Birthplace of the Renaissance, 1400s', zh:'文艺复兴的发源地，15世纪' },
    info:{ en:'Rich from wool and banking, the Medici family paid artists such as Leonardo, Michelangelo and Brunelleschi, whose dome still crowns the cathedral.', zh:'靠毛纺业和银行业致富的美第奇家族资助了达·芬奇、米开朗琪罗和布鲁内莱斯基等艺术家，布鲁内莱斯基设计的穹顶至今还耸立在大教堂上。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Florence_Duomo_from_Michelangelo_hill.jpg/960px-Florence_Duomo_from_Michelangelo_hill.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Florence Cathedral (the Duomo) and Brunelleschi’s dome, seen from the Michelangelo hill.', zh:'从米开朗琪罗山上看佛罗伦萨大教堂和布鲁内莱斯基设计的穹顶。', credit:'Petar Milošević', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Florence_Duomo_from_Michelangelo_hill.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Ponte_Vecchio_Arno_Florence.jpg/960px-Ponte_Vecchio_Arno_Florence.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Ponte Vecchio over the Arno, Florence', zh:'佛罗伦萨阿诺河上的老桥', credit:'Jebulon', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Ponte_Vecchio_Arno_Florence.jpg' } ] },
  orleans:{ en:'Orléans', zh:'奥尔良', names:['Orléans','Orleans','奥尔良'], ll:[1.91, 47.90], kind:'city', subjects:['worldhistory'],
    era:{ en:'Joan of Arc ends the siege, 1429', zh:'贞德解围，1429年' },
    info:{ en:'In the Hundred Years’ War, 17-year-old Joan of Arc led a French army that broke the English siege of Orléans.', zh:'百年战争中，17岁的贞德率领法军解除了英军对奥尔良的围困。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Orl%C3%A9ans_Cathedral%2C_West_view_20170609_1.jpg/960px-Orl%C3%A9ans_Cathedral%2C_West_view_20170609_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Orléans Cathedral', zh:'奥尔良大教堂', credit:'DXR', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Orl%C3%A9ans_Cathedral,_West_view_20170609_1.jpg' } ] },
  lubeck:{ en:'Lübeck', zh:'吕贝克', names:['Lübeck','吕贝克'], ll:[10.69, 53.87], kind:'port',
    era:{ en:'“Queen” of the Hanseatic League', zh:'汉萨同盟的“女王”' },
    info:{ en:'The leading city of the Hanseatic League, a group of trading towns around the North Sea and the Baltic. Its brick city gate, the Holstentor, still stands.', zh:'汉萨同盟（北海和波罗的海沿岸商业城市的联盟）的领头城市。砖砌的荷尔斯滕城门至今还在。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/L%C3%BCbeck%2C_Holstentor_--_2017_--_0295.jpg/960px-L%C3%BCbeck%2C_Holstentor_--_2017_--_0295.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Holstentor, Lübeck’s brick city gate', zh:'吕贝克的砖砌城门——荷尔斯滕门', credit:'Dietmar Rabich', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:L%C3%BCbeck,_Holstentor_--_2017_--_0295.jpg' } ] },
  moscow:{ en:'Moscow', zh:'莫斯科', names:['Moscow','莫斯科'], ll:[37.62, 55.75], kind:'capital',
    era:{ en:'Capital of Russia and of the Soviet Union', zh:'俄罗斯和苏联的首都' },
    info:{ en:'Its fortress, the Kremlin, and Red Square are at the centre. In 1941 the German army was stopped just outside the city.', zh:'城中心是克里姆林宫和红场。1941年，德国军队在莫斯科城外被挡住。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Moscow_Kremlin%2C_Red_Square.jpg/960px-Moscow_Kremlin%2C_Red_Square.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Kremlin and Red Square in Moscow', zh:'莫斯科的克里姆林宫和红场', credit:'Юрий Д.К.', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Moscow_Kremlin,_Red_Square.jpg' } ] },
  /* ---------- Renaissance & Reformation ---------- */
  milan:{ en:'Milan', zh:'米兰', names:['Milan','米兰'], ll:[9.19, 45.46], kind:'city', subjects:['worldhistory'],
    era:{ en:'Rich duchy; Leonardo’s Last Supper, 1490s', zh:'富庶的公国；达·芬奇的《最后的晚餐》，15世纪90年代' },
    info:{ en:'Leonardo da Vinci worked here for the Duke of Milan as painter and engineer. His Last Supper is on a wall of a convent dining hall here.', zh:'达·芬奇曾在这里为米兰公爵担任画家和工程师。他的《最后的晚餐》就画在这里一座修道院餐厅的墙上。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Milan_Duomo_with_tourists_in_Piazza.jpg/960px-Milan_Duomo_with_tourists_in_Piazza.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Milan Cathedral, one of the biggest Gothic churches in the world', zh:'米兰大教堂，世界上最大的哥特式教堂之一', credit:'Daniel Case', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Milan_Duomo_with_tourists_in_Piazza.jpg' } ] },
  vatican:{ en:'Vatican & Sistine Chapel', zh:'梵蒂冈与西斯廷礼拜堂', names:['Sistine Chapel','西斯廷礼拜堂','西斯廷教堂'], ll:[12.454, 41.903], kind:'building',
    era:{ en:'Ceiling painted by Michelangelo, 1508–1512', zh:'米开朗琪罗绘制天顶画，1508—1512年' },
    info:{ en:'The pope’s own chapel. Michelangelo spent four years painting its ceiling, much of it standing on scaffolding with his head tipped back.', zh:'教皇的礼拜堂。米开朗琪罗花了四年绘制它的天顶画，多数时间站在脚手架上仰着头作画。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Sistine_Chapel_ceiling%2C_Creation_of_Adam.jpg/960px-Sistine_Chapel_ceiling%2C_Creation_of_Adam.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'“The Creation of Adam” on the Sistine Chapel ceiling in Rome, painted by Michelangelo (1508–1512) while standing on scaffolding high above the floor.', zh:'罗马西斯廷礼拜堂天顶上的《创造亚当》，米开朗琪罗于1508—1512年站在高高的脚手架上绘制。', credit:'Michelangelo', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Sistine_Chapel_ceiling,_Creation_of_Adam.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Ingres_-_Interior_of_the_Sistine_Chapel%2C_lot-5970546.jpg/960px-Ingres_-_Interior_of_the_Sistine_Chapel%2C_lot-5970546.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Sistine Chapel, painted by Jean-Auguste-Dominique Ingres (1814)', zh:'安格尔笔下的西斯廷礼拜堂（1814年）', credit:'Jean-Auguste-Dominique Ingres', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Ingres_-_Interior_of_the_Sistine_Chapel,_lot-5970546.jpg' } ] },
  mainz:{ en:'Mainz', zh:'美因茨', names:['Mainz','美因茨'], ll:[8.27, 50.00], kind:'city',
    era:{ en:'Gutenberg’s printing press, c. 1450', zh:'古腾堡的印刷机，约1450年' },
    info:{ en:'Johannes Gutenberg printed his famous Bible here around 1455 with metal movable type. The Gutenberg Museum still shows how it worked.', zh:'约1455年，约翰内斯·古腾堡在这里用金属活字印出了著名的《古腾堡圣经》。古腾堡博物馆至今还在演示它的印刷方法。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/20180825_Mainz_Cathedral_01.jpg/960px-20180825_Mainz_Cathedral_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Mainz Cathedral, which has stood for about 1,000 years', zh:'矗立了约一千年的美因茨大教堂', credit:'Flocci Nivis', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:20180825_Mainz_Cathedral_01.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/960px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Gutenberg Bible (Mainz, about 1455) — the Lenox copy at the New York Public Library.', zh:'《谷登堡圣经》（约1455年，美因茨）——纽约公共图书馆收藏的“雷诺克斯本”。', credit:'NYC Wanderer (Kevin Eng)', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Gutenberg_Bible,_Lenox_Copy,_New_York_Public_Library,_2009._Pic_01.jpg' } ] },
  strasbourg:{ en:'Strasbourg', zh:'斯特拉斯堡', names:['Strasbourg','斯特拉斯堡'], ll:[7.75, 48.58], kind:'city',
    era:{ en:'Early printing town; seat of the European Parliament', zh:'早期的印刷业城市；今天是欧洲议会所在地' },
    info:{ en:'Gutenberg first experimented with printing here before returning to Mainz. Today the European Parliament meets in Strasbourg.', zh:'古腾堡回美因茨之前曾在这里试验印刷术。今天，欧洲议会在斯特拉斯堡开会。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Strasbourg_Cathedral_Exterior_-_Diliff.jpg/960px-Strasbourg_Cathedral_Exterior_-_Diliff.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Strasbourg Cathedral, built of pink sandstone', zh:'用粉红色砂岩建造的斯特拉斯堡大教堂', credit:'Diliff', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Strasbourg_Cathedral_Exterior_-_Diliff.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/European_Parliament_Strasbourg_Hemicycle_-_Diliff.jpg/960px-European_Parliament_Strasbourg_Hemicycle_-_Diliff.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The European Parliament in Strasbourg during a plenary session (2014). EU citizens elect its members.', zh:'欧洲议会在斯特拉斯堡举行全体会议（2014年）。议员由欧盟公民选举产生。', credit:'Diliff', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:European_Parliament_Strasbourg_Hemicycle_-_Diliff.jpg' } ] },
  nuremberg:{ en:'Nuremberg', zh:'纽伦堡', names:['Nuremberg','纽伦堡'], ll:[11.08, 49.45], kind:'city',
    era:{ en:'Printing and art centre; home of Albrecht Dürer', zh:'印刷业和艺术中心；阿尔布雷希特·丢勒的家乡' },
    info:{ en:'A rich trading city full of printers and craftsmen. The artist Albrecht Dürer lived here; after World War II, Nazi leaders were tried here.', zh:'一座满是印刷商和工匠的富庶商业城市。画家丢勒住在这里；第二次世界大战后，纳粹头目在这里受审。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Albrecht-D%C3%BCrer-Haus_-_Tierg%C3%A4rtnerplatz_-_Nuremberg%2C_Germany_-_DSC02033.jpg/960px-Albrecht-D%C3%BCrer-Haus_-_Tierg%C3%A4rtnerplatz_-_Nuremberg%2C_Germany_-_DSC02033.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The house of the artist Albrecht Dürer in Nuremberg', zh:'纽伦堡画家丢勒的故居', credit:'Daderot', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Albrecht-D%C3%BCrer-Haus_-_Tierg%C3%A4rtnerplatz_-_Nuremberg,_Germany_-_DSC02033.jpg' } ] },
  wittenberg:{ en:'Wittenberg', zh:'维登堡', names:['Wittenberg','维登堡'], ll:[12.65, 51.87], kind:'city',
    era:{ en:'Luther’s 95 Theses, 1517', zh:'马丁·路德发表《九十五条论纲》，1517年' },
    info:{ en:'Martin Luther taught at the university here. In 1517 he posted his 95 Theses — the story says on the door of the Castle Church.', zh:'马丁·路德在这里的大学任教。1517年，他发表《九十五条论纲》——传说是贴在城堡教堂的大门上。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Wittenberg%2C_Schlosskirche_%28Juni_2026%29_1.jpg/960px-Wittenberg%2C_Schlosskirche_%28Juni_2026%29_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Castle Church in Wittenberg', zh:'维登堡的城堡教堂', credit:'Romzig', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Wittenberg,_Schlosskirche_(Juni_2026)_1.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Wittenberg_Castle_Church_Door%2C_Where_Luther_Posted_His_95_Theses_%289813300413%29.jpg/960px-Wittenberg_Castle_Church_Door%2C_Where_Luther_Posted_His_95_Theses_%289813300413%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The doors of the Castle Church, now cast in bronze with the 95 Theses', zh:'城堡教堂的大门，今天的铜门上铸着《九十五条论纲》', credit:'Gary Todd from Xinzheng, China', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Wittenberg_Castle_Church_Door,_Where_Luther_Posted_His_95_Theses_(9813300413).jpg' } ] },
  worms:{ en:'Worms', zh:'沃尔姆斯', names:['Diet of Worms','Worms','沃尔姆斯'], ll:[8.36, 49.63], kind:'city', subjects:['worldhistory'],
    era:{ en:'Luther refuses to take back his writings, 1521', zh:'1521年路德拒绝收回自己的言论' },
    info:{ en:'At a great meeting (the Diet of Worms) the emperor ordered Luther to take back his books. Luther said no, and was declared an outlaw.', zh:'在沃尔姆斯帝国会议上，皇帝命令路德收回他的著作。路德拒绝了，被宣布为不受法律保护的人。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Lutherdenkmal_Worms_01.jpg/960px-Lutherdenkmal_Worms_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Luther Monument in Worms', zh:'沃尔姆斯的路德纪念碑', credit:'Immanuel Giel', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Lutherdenkmal_Worms_01.jpg' } ] },
  wartburg:{ en:'Wartburg Castle', zh:'瓦特堡', names:['Wartburg Castle','Wartburg','瓦特堡'], ll:[10.306, 50.966], kind:'building',
    era:{ en:'Luther translates the New Testament, 1521–1522', zh:'路德在这里翻译《新约》，1521—1522年' },
    info:{ en:'Friends hid Luther in this hilltop castle. In about ten weeks he translated the New Testament from Greek into German.', zh:'朋友们把路德藏在这座山顶城堡里。他用大约十周时间把《新约》从希腊文译成德文。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Outside_view_of_Wartburg_Castle_%284%29.jpg/960px-Outside_view_of_Wartburg_Castle_%284%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Wartburg Castle on its hill above Eisenach', zh:'爱森纳赫城外山上的瓦特堡', credit:'Krzysztof Golik', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Outside_view_of_Wartburg_Castle_(4).jpg' } ] },
  augsburg:{ en:'Augsburg', zh:'奥格斯堡', names:['Peace of Augsburg','Augsburg','奥格斯堡'], ll:[10.90, 48.37], kind:'city',
    era:{ en:'Peace of Augsburg, 1555', zh:'1555年《奥格斯堡和约》' },
    info:{ en:'Here in 1555 the German princes agreed that each ruler could choose whether his land would be Catholic or Lutheran.', zh:'1555年，德意志诸侯在这里约定：每位统治者可以决定自己的领地信奉天主教还是路德宗。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Rathaus_Augsburg_Januar_2011.jpg/960px-Rathaus_Augsburg_Januar_2011.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Augsburg’s Renaissance town hall', zh:'奥格斯堡文艺复兴时期的市政厅', credit:'Felix König', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:Rathaus_Augsburg_Januar_2011.jpg' } ] },
  trent:{ en:'Trent', zh:'特伦托', names:['Council of Trent','Trent','特伦托'], ll:[11.12, 46.07], kind:'city', subjects:['worldhistory'],
    today:{ en:'Trento, Italy', zh:'今意大利特伦托' }, era:{ en:'Council of Trent, 1545–1563', zh:'特伦托宗教会议，1545—1563年' },
    info:{ en:'Catholic bishops met here on and off for 18 years to answer the Protestants and reform their own Church.', zh:'天主教的主教们在这里断断续续开了18年会，回应新教，并改革天主教会本身。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Trento_-_Duomo_di_San_Vigilio_05.JPG/960px-Trento_-_Duomo_di_San_Vigilio_05.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Trento Cathedral, where the Council of Trent met', zh:'特伦托大教堂，特伦托宗教会议就在这里召开', credit:'Casalmaggiore Provincia', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Trento_-_Duomo_di_San_Vigilio_05.JPG' } ] },
  bruges:{ en:'Bruges (Flanders)', zh:'布鲁日（佛兰德）', names:['Bruges','Flanders','布鲁日','佛兰德'], ll:[3.22, 51.21], kind:'city',
    era:{ en:'Trading and painting centre of the Northern Renaissance', zh:'北方文艺复兴的商业和绘画中心' },
    info:{ en:'Rich cloth merchants lived in this canal city in Flanders. Painters here, like Jan van Eyck, mastered oil paint.', zh:'这座佛兰德运河城市里住着富有的呢绒商人。扬·凡·艾克等画家在这里把油画技法发展到了很高的水平。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Rozenhoedkaai_%28canal%29_and_Belfry_of_Bruges%2C_Bruges%2C_Belgium_%28Ank_Kumar%2C_Infosys_Limited%29_01.jpg/960px-Rozenhoedkaai_%28canal%29_and_Belfry_of_Bruges%2C_Bruges%2C_Belgium_%28Ank_Kumar%2C_Infosys_Limited%29_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A canal and the medieval belfry of Bruges', zh:'布鲁日的运河和中世纪钟楼', credit:'Ank Kumar', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Rozenhoedkaai_(canal)_and_Belfry_of_Bruges,_Bruges,_Belgium_(Ank_Kumar,_Infosys_Limited)_01.jpg' } ] },
  westminster:{ en:'Westminster', zh:'威斯敏斯特', names:['Westminster','威斯敏斯特'], ll:[-0.128, 51.499], kind:'building',
    era:{ en:'Caxton’s press, 1476; Parliament', zh:'卡克斯顿的印刷所，1476年；议会所在地' },
    info:{ en:'William Caxton set up England’s first printing press next to Westminster Abbey. The Houses of Parliament stand here too.', zh:'威廉·卡克斯顿在威斯敏斯特教堂旁开设了英格兰第一家印刷所。英国议会大厦也在这里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Westminster_Abbey_-_02.jpg/960px-Westminster_Abbey_-_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Westminster Abbey, London', zh:'伦敦威斯敏斯特教堂', credit:'Carlos Delgado', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Westminster_Abbey_-_02.jpg' } ] },
  krakow:{ en:'Kraków', zh:'克拉科夫', names:['Kraków','Krakow','克拉科夫'], ll:[19.94, 50.06], kind:'city',
    era:{ en:'Royal capital of Poland; Copernicus studied here', zh:'波兰王国的都城；哥白尼曾在这里求学' },
    info:{ en:'The old capital of Poland, with one of Europe’s biggest medieval market squares. Young Copernicus studied at its university.', zh:'波兰的古都，有欧洲最大的中世纪广场之一。年轻的哥白尼曾在这里的大学读书。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Krak%C3%B3w_Cloth_Hall%2C_3_Main_Market_Square%2C_Old_Town%2C_Krak%C3%B3w%2C_Poland.jpg/960px-Krak%C3%B3w_Cloth_Hall%2C_3_Main_Market_Square%2C_Old_Town%2C_Krak%C3%B3w%2C_Poland.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Cloth Hall in Kraków’s Main Market Square', zh:'克拉科夫中央广场上的纺织会馆', credit:'Igor123121', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Krak%C3%B3w_Cloth_Hall,_3_Main_Market_Square,_Old_Town,_Krak%C3%B3w,_Poland.jpg' } ] },
  toledo:{ en:'Toledo', zh:'托莱多', names:['Toledo','托莱多'], ll:[-4.03, 39.86], kind:'city', subjects:['worldhistory'],
    era:{ en:'City of translators and of Spanish kings', zh:'翻译家之城，也是西班牙国王的城市' },
    info:{ en:'In the Middle Ages, scholars here translated Arabic books into Latin. The old city sits on a hill wrapped by the Tagus River.', zh:'中世纪时，这里的学者把阿拉伯文书籍译成拉丁文。老城建在一座被塔霍河环绕的山丘上。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Toledo_Skyline_Panorama%2C_Spain_-_Dec_2006.jpg/960px-Toledo_Skyline_Panorama%2C_Spain_-_Dec_2006.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Toledo on its hill above the Tagus River', zh:'塔霍河畔山丘上的托莱多古城', credit:'Diliff', license:'CC BY 2.5', page:'https://commons.wikimedia.org/wiki/File:Toledo_Skyline_Panorama,_Spain_-_Dec_2006.jpg' } ] },
  seville:{ en:'Seville', zh:'塞维利亚', names:['Seville','Sevilla','塞维利亚'], ll:[-5.99, 37.39], kind:'port',
    era:{ en:'Spain’s gateway to the Americas, 1500s', zh:'16世纪西班牙通往美洲的门户' },
    info:{ en:'Magellan’s fleet left from here in 1519, and the only ship to return, the Victoria, came back here in 1522. American silver poured in through its port.', zh:'1519年麦哲伦船队从这里出发，1522年唯一返航的“维多利亚号”也回到这里。美洲的白银经这里的港口源源流入。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/La_Giralda%2C_Seville%2C_Spain_-_Sep_2009.jpg/960px-La_Giralda%2C_Seville%2C_Spain_-_Sep_2009.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'La Giralda, the bell tower of Seville Cathedral', zh:'塞维利亚大教堂的钟楼“吉拉达塔”', credit:'Diliff', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:La_Giralda,_Seville,_Spain_-_Sep_2009.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Nao_Victoria_%28Sevilla%29.jpg/960px-Nao_Victoria_%28Sevilla%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A replica of the Victoria, the only ship of Magellan’s fleet to sail all the way around the world, in Seville, Spain.', zh:'西班牙塞维利亚的“维多利亚号”复原船——麦哲伦船队中唯一完成环球航行的船。', credit:'CarlosVdeHabsburgo', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Nao_Victoria_(Sevilla).jpg' } ] },
  lisbon:{ en:'Lisbon', zh:'里斯本', names:['Lisbon','里斯本'], ll:[-9.14, 38.71], kind:'port',
    era:{ en:'Vasco da Gama sails for India, 1497', zh:'1497年达·伽马从这里起航前往印度' },
    info:{ en:'Vasco da Gama set out from Lisbon’s Belém harbour. The pepper and spices his ships brought back made Lisbon one of Europe’s richest ports.', zh:'达·伽马从里斯本的贝伦港起航。他的船队运回的胡椒和香料，让里斯本成为欧洲最富裕的港口之一。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Torre_Bel%C3%A9m_April_2009-4a.jpg/960px-Torre_Bel%C3%A9m_April_2009-4a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Belém Tower, which guarded the harbour the explorers sailed from', zh:'贝伦塔，守卫着航海家们出发的港口', credit:'Alvesgaspar', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Torre_Bel%C3%A9m_April_2009-4a.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Belem_-_Padrao_dos_Descobrimentos.jpg/960px-Belem_-_Padrao_dos_Descobrimentos.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Monument to the Discoveries in Lisbon, Portugal, shaped like a caravel’s prow — Prince Henry the Navigator leads the line of explorers, mapmakers and sailors.', zh:'葡萄牙里斯本的发现者纪念碑，形状像一艘卡拉维尔帆船的船头——“航海家”恩里克王子站在最前面，身后是探险家、制图师和水手。', credit:'Ingo Mehling', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Belem_-_Padrao_dos_Descobrimentos.jpg' } ] },
  /* ---------- Age of Exploration ---------- */
  lagos:{ en:'Lagos (Portugal)', zh:'拉古什（葡萄牙）', names:['Lagos, Portugal'], ll:[-8.67, 37.10], kind:'port',
    era:{ en:'Base of Portuguese voyages to Africa, 1400s', zh:'15世纪葡萄牙远航非洲的基地' },
    info:{ en:'Prince Henry the Navigator’s ships sailed down the African coast from this harbour. Sadly it also had Europe’s first market for enslaved Africans (1444).', zh:'“航海家”亨利王子的船队从这个港口出发，沿非洲海岸南下。可悲的是，欧洲第一个贩卖非洲奴隶的市场（1444年）也在这里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Boa_Esperan%C3%A7a_caravel_replica_moored_in_Lagos_-_Portugal_-_2015-08-06.jpg/960px-Boa_Esperan%C3%A7a_caravel_replica_moored_in_Lagos_-_Portugal_-_2015-08-06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The caravel replica Boa Esperança in Lagos, Portugal — the kind of small, quick ship Portuguese explorers sailed down Africa’s coast.', zh:'葡萄牙拉古什港的轻快帆船复原船“博阿埃斯佩兰萨号”——葡萄牙探险者沿非洲海岸南下时用的就是这种小而灵活的船。', credit:'Norbert Nagel', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Boa_Esperan%C3%A7a_caravel_replica_moored_in_Lagos_-_Portugal_-_2015-08-06.jpg' } ] },
  capegoodhope:{ en:'Cape of Good Hope', zh:'好望角', names:['Cape of Good Hope','Cape of Storms','好望角'], ll:[18.47, -34.36], kind:'site',
    era:{ en:'Rounded by Bartolomeu Dias, 1488', zh:'1488年迪亚士绕过这里' },
    info:{ en:'Dias first called it the “Cape of Storms”. The king of Portugal renamed it “Good Hope” — hope of a sea road to India.', zh:'迪亚士最初叫它“风暴角”，葡萄牙国王把它改名为“好望角”——意思是有希望找到通往印度的海路。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Cape_Town_%28ZA%29%2C_Cape_Peninsula_National_Park%2C_Cape_of_Good_Hope_--_2024_--_3276.jpg/960px-Cape_Town_%28ZA%29%2C_Cape_Peninsula_National_Park%2C_Cape_of_Good_Hope_--_2024_--_3276.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The rocky Cape of Good Hope near Africa’s southern tip', zh:'非洲南端附近岩石嶙峋的好望角', credit:'Dietmar Rabich', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Cape_Peninsula_National_Park,_Cape_of_Good_Hope_--_2024_--_3276.jpg' } ] },
  mosselbay:{ en:'Mossel Bay', zh:'莫塞尔湾', names:['Mossel Bay','莫塞尔湾'], ll:[22.14, -34.18], kind:'port',
    era:{ en:'Dias lands here, 1488', zh:'1488年迪亚士在这里登陆' },
    info:{ en:'After rounding Africa’s tip, Dias landed here before his tired crew made him turn back. A full-size copy of his caravel is in the town museum.', zh:'绕过非洲南端后，迪亚士在这里登陆，之后疲惫的船员逼他返航。镇上的博物馆里有一艘他的卡拉维尔帆船的原大复制品。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Life_Size_Replica_of_Bartolomeu_Dias_Caravel_..._%2852659163964%29.jpg/960px-Life_Size_Replica_of_Bartolomeu_Dias_Caravel_..._%2852659163964%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A life-size replica of Bartolomeu Dias’s caravel at the Bartolomeu Dias Museum in Mossel Bay, South Africa.', zh:'南非莫塞尔湾迪亚士博物馆里的迪亚士轻快帆船等大复原船。', credit:'Bernard DUPONT from FRANCE', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Life_Size_Replica_of_Bartolomeu_Dias_Caravel_..._(52659163964).jpg' } ] },
  palos:{ en:'Palos de la Frontera', zh:'帕洛斯', names:['Palos','La Rábida','帕洛斯','拉拉维达'], ll:[-6.89, 37.23], kind:'port',
    era:{ en:'Columbus sets sail, 3 August 1492', zh:'1492年8月3日哥伦布从这里起航' },
    info:{ en:'Columbus left from this small river port with the Niña, the Pinta and the Santa María. Copies of the three ships float at nearby La Rábida.', zh:'哥伦布率“尼尼亚号”“平塔号”和“圣玛丽亚号”从这个小河港出发。附近的拉拉维达停泊着这三艘船的复制品。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Palos_de_la_Frontera_2.jpg/960px-Palos_de_la_Frontera_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Palos de la Frontera, the small port Columbus sailed from', zh:'帕洛斯，哥伦布出发的小港口', credit:'Draceane', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Palos_de_la_Frontera_2.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Muelle_de_la_Carabelas_-_Replica_of_Columbus_Ship_Santa_Maria_-_La_Rabida_-_Spain.jpg/960px-Muelle_de_la_Carabelas_-_Replica_of_Columbus_Ship_Santa_Maria_-_La_Rabida_-_Spain.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A replica of Columbus’s Santa María at the Muelle de las Carabelas, La Rábida, Spain.', zh:'西班牙拉拉维达“帆船码头”的哥伦布“圣玛利亚号”复原船。', credit:'Adam63', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Muelle_de_la_Carabelas_-_Replica_of_Columbus_Ship_Santa_Maria_-_La_Rabida_-_Spain.jpg' } ] },
  canaries:{ en:'Canary Islands', zh:'加那利群岛', names:['Canary Islands','Canaries','加那利群岛'], ll:[-17.11, 28.09], kind:'region',
    era:{ en:'Columbus’s last stop before the Atlantic, 1492', zh:'1492年哥伦布横渡大西洋前的最后一站' },
    info:{ en:'Columbus took on water and food at La Gomera, then let the trade winds blow him west. About 36 days later he sighted land.', zh:'哥伦布在戈梅拉岛补充淡水和食物，然后借着信风向西航行。约36天后，他看到了陆地。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/San_Sebasti%C3%A1n_de_la_Gomera%2C_La_Gomera%2C_Espa%C3%B1a%2C_2012-12-14%2C_DD_06.jpg/960px-San_Sebasti%C3%A1n_de_la_Gomera%2C_La_Gomera%2C_Espa%C3%B1a%2C_2012-12-14%2C_DD_06.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'San Sebastián de La Gomera, Columbus’s last stop before crossing the Atlantic', zh:'戈梅拉岛的圣塞瓦斯蒂安，哥伦布横渡大西洋前的最后一站', credit:'Diego Delso', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:San_Sebasti%C3%A1n_de_la_Gomera,_La_Gomera,_Espa%C3%B1a,_2012-12-14,_DD_06.jpg' } ] },
  bahamas:{ en:'San Salvador (Bahamas)', zh:'圣萨尔瓦多岛（巴哈马）', names:['Bahamas','巴哈马群岛','巴哈马'], ll:[-74.48, 24.05], kind:'site', subjects:['worldhistory'],
    era:{ en:'Columbus lands, 12 October 1492', zh:'1492年10月12日哥伦布登陆' },
    info:{ en:'Columbus landed on an island of the Taíno people that he named San Salvador. He thought he had reached islands near Asia.', zh:'哥伦布在泰诺人居住的一座岛上登陆，把它命名为圣萨尔瓦多。他以为自己到了亚洲附近的岛屿。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Bahamas_1989_%28721%29_San_Salvador_Cockburn_Town_%2825487908493%29.jpg/960px-Bahamas_1989_%28721%29_San_Salvador_Cockburn_Town_%2825487908493%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Cockburn Town on San Salvador Island, Bahamas', zh:'巴哈马圣萨尔瓦多岛上的科伯恩镇', credit:'Rüdiger Stehn', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Bahamas_1989_(721)_San_Salvador_Cockburn_Town_(25487908493).jpg' } ] },
  tordesillas:{ en:'Tordesillas', zh:'托尔德西里亚斯', names:['Tordesillas','托尔德西里亚斯'], ll:[-5.00, 41.50], kind:'city',
    era:{ en:'Treaty of Tordesillas, 1494', zh:'1494年《托尔德西里亚斯条约》' },
    info:{ en:'Spain and Portugal drew a line down the Atlantic here and split the newly reached lands between them — without asking anyone who lived there.', zh:'西班牙和葡萄牙在这里沿大西洋画了一条线，瓜分新到达的土地——却从没问过当地居民。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Casas_del_Tratado_de_Tordesillas.jpg/960px-Casas_del_Tratado_de_Tordesillas.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Houses of the Treaty in Tordesillas, where the treaty was signed', zh:'托尔德西里亚斯签约的“条约之家”', credit:'Julio García', license:'CC BY-SA 3.0 es', page:'https://commons.wikimedia.org/wiki/File:Casas_del_Tratado_de_Tordesillas.jpg' } ] },
  straitmagellan:{ en:'Strait of Magellan', zh:'麦哲伦海峡', names:['Strait of Magellan','麦哲伦海峡'], ll:[-71.0, -53.5], kind:'sea',
    era:{ en:'Magellan’s ships pass through, 1520', zh:'1520年麦哲伦船队穿过' },
    info:{ en:'A twisting, stormy channel between South America and Tierra del Fuego. Magellan’s ships needed 38 days to get through to the Pacific.', zh:'南美大陆与火地岛之间一条曲折多风暴的水道。麦哲伦的船队花了38天才穿过它进入太平洋。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/StraitOfMagellan.jpg/960px-StraitOfMagellan.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Strait of Magellan at the tip of South America, seen by a NASA satellite. Magellan’s ships spent 38 days in 1520 threading through these twisting channels to reach the Pacific.', zh:'NASA 卫星拍摄的南美洲南端麦哲伦海峡。1520 年，麦哲伦的船队花了 38 天穿过这些弯弯曲曲的水道，才驶入太平洋。', credit:'Jacques Descloitres, MODIS Rapid Response Team (NASA/GSFC)', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:StraitOfMagellan.jpg' } ] },
  guam:{ en:'Guam', zh:'关岛', names:['Guam','关岛'], ll:[144.79, 13.44], kind:'site',
    era:{ en:'Magellan’s first landfall after the Pacific, 1521', zh:'1521年麦哲伦横渡太平洋后第一次靠岸' },
    info:{ en:'After about 98 days on the open ocean, Magellan’s starving crew reached this island of the Chamorro people. Later Manila galleons stopped here.', zh:'在大洋上航行约98天后，饥饿的船员到达查莫罗人居住的这座岛。后来马尼拉大帆船也在这里停靠。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Umatac_Bay%2C_Guam_-_DSC00954.JPG/960px-Umatac_Bay%2C_Guam_-_DSC00954.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Umatac Bay, Guam, where Magellan is thought to have landed', zh:'关岛乌马塔克湾，人们认为麦哲伦曾在这里登岸', credit:'Daderot', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Umatac_Bay,_Guam_-_DSC00954.JPG' } ] },
  mactan:{ en:'Mactan', zh:'马克坦岛', names:['Mactan','马克坦岛','马克坦'], ll:[124.0, 10.31], kind:'battle',
    era:{ en:'Magellan killed in battle, 1521', zh:'1521年麦哲伦在这里战死' },
    info:{ en:'The local chief Lapulapu refused to obey Magellan, and Magellan was killed in the fight. Filipinos remember Lapulapu as a hero.', zh:'当地首领拉普拉普拒绝服从麦哲伦，麦哲伦在战斗中被杀。菲律宾人把拉普拉普当作英雄纪念。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Mactan_Shrine_in_Lapu-Lapu_City.JPG/960px-Mactan_Shrine_in_Lapu-Lapu_City.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Mactan Shrine, with a statue of Lapulapu', zh:'马克坦岛纪念地和拉普拉普的雕像', credit:'Badz Patanag', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Mactan_Shrine_in_Lapu-Lapu_City.JPG' } ] },
  spiceislands:{ en:'Spice Islands (Moluccas)', zh:'香料群岛（马鲁古群岛）', names:['Spice Islands','香料群岛'], ll:[127.4, 0.8], kind:'region',
    today:{ en:'Maluku, Indonesia', zh:'今印度尼西亚马鲁古群岛' }, era:{ en:'The goal of Magellan’s voyage', zh:'麦哲伦航行的目的地' },
    info:{ en:'Cloves and nutmeg grew only on a few small islands here, so they were worth more than gold in Europe. Magellan’s fleet set out to reach them by sailing west.', zh:'丁香和肉豆蔻只生长在这里的几座小岛上，在欧洲比黄金还贵。麦哲伦的船队就是想向西航行到达这里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Sunset_at_Ternate_and_Tidore_Islands%2C_Maluku.jpg/960px-Sunset_at_Ternate_and_Tidore_Islands%2C_Maluku.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The volcanic islands of Ternate and Tidore, the home of cloves', zh:'丁香的故乡——火山岛特尔纳特岛和蒂多雷岛', credit:'Thiobedda', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Sunset_at_Ternate_and_Tidore_Islands,_Maluku.jpg' } ] },
  manila:{ en:'Manila', zh:'马尼拉', names:['Manila','马尼拉'], ll:[120.97, 14.59], kind:'port',
    era:{ en:'Spanish port of the Manila galleons, 1571–1815', zh:'西班牙马尼拉大帆船贸易的港口，1571—1815年' },
    info:{ en:'Chinese junks brought silk and porcelain here, and Spanish galleons brought silver from Mexico. Its walled old town, Intramuros, still stands.', zh:'中国帆船把丝绸和瓷器运到这里，西班牙大帆船从墨西哥运来白银。城墙围绕的老城“王城区”至今还在。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Manila%2C_Fort_Santiago%2C_Walled_city_of_Intramuros%2C_Philippines.jpg/960px-Manila%2C_Fort_Santiago%2C_Walled_city_of_Intramuros%2C_Philippines.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Fort Santiago in Intramuros, the old walled city of Manila', zh:'马尼拉老城“王城区”的圣地亚哥堡', credit:'Vyacheslav Argenberg', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Manila,_Fort_Santiago,_Walled_city_of_Intramuros,_Philippines.jpg' } ] },
  acapulco:{ en:'Acapulco', zh:'阿卡普尔科', names:['Acapulco','阿卡普尔科'], ll:[-99.91, 16.85], kind:'port',
    era:{ en:'American end of the Manila galleon route', zh:'马尼拉大帆船航线在美洲的终点' },
    info:{ en:'Once a year a galleon arrived here from Manila loaded with Chinese goods, then sailed back full of American silver.', zh:'每年有一艘大帆船从马尼拉满载中国货物到达这里，再装满美洲白银返航。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Fuerte_de_San_Diego%2C_Acapulco%2C_Guerreri_%2832450057624%29.jpg/960px-Fuerte_de_San_Diego%2C_Acapulco%2C_Guerreri_%2832450057624%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Fort San Diego, built to guard the galleon port of Acapulco', zh:'为保卫大帆船港口而建的阿卡普尔科圣迭戈要塞', credit:'Comisión Mexicana de Filmaciones', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Fuerte_de_San_Diego,_Acapulco,_Guerreri_(32450057624).jpg' } ] },
  redsea:{ en:'Red Sea', zh:'红海', names:['Red Sea','红海'], ll:[38.0, 20.0], kind:'sea',
    era:{ en:'Sea road between the Mediterranean world and the Indian Ocean', zh:'连接地中海世界和印度洋的海路' },
    info:{ en:'A long, narrow sea between Africa and Arabia. Zheng He’s ships reached its shores; today the Suez Canal links it to the Mediterranean.', zh:'非洲与阿拉伯半岛之间狭长的海。郑和船队到过红海沿岸；今天苏伊士运河把它和地中海连在一起。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/East_Egypt_and_the_Red_Sea_Coast.jpg/960px-East_Egypt_and_the_Red_Sea_Coast.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Red Sea coast of eastern Egypt', zh:'埃及东部的红海海岸', credit:'Yonas Kidane', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:East_Egypt_and_the_Red_Sea_Coast.jpg' } ] },
  /* ---------- Age of Revolutions ---------- */
  frombork:{ en:'Frombork', zh:'弗龙堡', names:['Frombork','弗龙堡'], ll:[19.68, 54.36], kind:'city',
    era:{ en:'Copernicus’s Sun-centred book, 1543', zh:'1543年哥白尼发表“日心说”著作' },
    info:{ en:'Nicolaus Copernicus worked at the cathedral of this small Baltic town and watched the sky from its walls. He is buried in the cathedral.', zh:'尼古拉·哥白尼在这座波罗的海边小城的大教堂任职，常在城墙上观测天空。他就葬在这座大教堂里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Frombork_2023_16_Cathedral.jpg/960px-Frombork_2023_16_Cathedral.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Frombork Cathedral, where Copernicus worked and is buried', zh:'弗龙堡大教堂，哥白尼曾在这里任职，也葬在这里', credit:'Scotch Mist', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Frombork_2023_16_Cathedral.jpg' } ] },
  padua:{ en:'Padua', zh:'帕多瓦', names:['Padua','帕多瓦'], ll:[11.88, 45.41], kind:'city',
    era:{ en:'Galileo’s telescope discoveries, 1609–1610', zh:'1609—1610年伽利略用望远镜作出发现' },
    info:{ en:'Galileo taught mathematics at the University of Padua for 18 years. Here he built telescopes and found four moons circling Jupiter.', zh:'伽利略在帕多瓦大学教了18年数学。他在这里制作望远镜，发现了绕木星运行的四颗卫星。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Padua%2C_Palazzo_del_Bo%2C_Cortile_Antico.jpg/960px-Padua%2C_Palazzo_del_Bo%2C_Cortile_Antico.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The old courtyard of the University of Padua (Palazzo del Bo), where Galileo taught', zh:'帕多瓦大学博宫的老庭院，伽利略曾在这里任教', credit:'Armin Kleiner', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Padua,_Palazzo_del_Bo,_Cortile_Antico.jpg' } ] },
  cambridge:{ en:'Cambridge', zh:'剑桥', names:['Cambridge','剑桥'], ll:[0.12, 52.20], kind:'city', subjects:['worldhistory'],
    era:{ en:'Newton’s Principia, 1687', zh:'1687年牛顿发表《自然哲学的数学原理》' },
    info:{ en:'Isaac Newton studied and taught at Trinity College here. His laws of motion and gravity explained why the planets move as they do.', zh:'艾萨克·牛顿在这里的三一学院学习和任教。他的运动定律和万有引力定律解释了行星为什么那样运动。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Trinity_College_-_Great_Court_01.jpg/960px-Trinity_College_-_Great_Court_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Great Court of Trinity College, Cambridge, Newton’s college', zh:'剑桥大学三一学院的大庭院，牛顿就在这个学院', credit:'Rafa Esteve', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Trinity_College_-_Great_Court_01.jpg' } ] },
  lexington:{ en:'Lexington and Concord', zh:'来克星顿和康科德', names:['Lexington and Concord','Lexington','来克星顿','列克星敦','康科德'], ll:[-71.23, 42.45], kind:'battle', subjects:['worldhistory','ushistory'],
    era:{ en:'First shots of the American Revolution, 19 April 1775', zh:'1775年4月19日，美国独立战争的第一枪' },
    info:{ en:'British soldiers marched out of Boston to seize weapons, and local militia fought them at Lexington and Concord. The war for independence had begun.', zh:'英军从波士顿出发去收缴武器，当地民兵在来克星顿和康科德与他们交火，独立战争由此开始。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Lexington_Battle_Green%2C_Lexington_MA.jpg/960px-Lexington_Battle_Green%2C_Lexington_MA.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Lexington Battle Green, where the first shots were fired in 1775', zh:'来克星顿战斗草坪，1775年第一枪在这里打响', credit:'John Phelan', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:Lexington_Battle_Green,_Lexington_MA.jpg' } ] },
  saratoga:{ en:'Saratoga', zh:'萨拉托加', names:['Saratoga','萨拉托加'], ll:[-73.64, 43.01], kind:'battle',
    era:{ en:'American victory, October 1777', zh:'1777年10月美军大捷' },
    info:{ en:'A whole British army surrendered here. The victory convinced France to join the war on the American side — the turning point of the Revolution.', zh:'一整支英国军队在这里投降。这场胜利让法国决定站在美国一边参战，是独立战争的转折点。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Saratoga_Battlefield.jpg/960px-Saratoga_Battlefield.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Saratoga Battlefield, New York', zh:'纽约州萨拉托加古战场', credit:'Nsausa', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Saratoga_Battlefield.jpg' } ] },
  bastille:{ en:'Bastille', zh:'巴士底狱', names:['Bastille','巴士底狱','巴士底'], ll:[2.369, 48.853], kind:'site',
    today:{ en:'Place de la Bastille, Paris', zh:'今巴黎巴士底广场' }, era:{ en:'Stormed 14 July 1789', zh:'1789年7月14日被攻占' },
    info:{ en:'Parisians stormed this old royal fortress-prison to seize gunpowder. 14 July is now France’s national day. The fortress was pulled down; a column stands in the square.', zh:'巴黎人民攻占了这座王室城堡监狱，夺取火药。7月14日成为法国国庆日。城堡后来被拆除，原址广场上立着一根纪念柱。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Prise_de_la_Bastille.jpg/960px-Prise_de_la_Bastille.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'“The Storming of the Bastille”, 14 July 1789 — a watercolour by Jean-Pierre Houël, who lived at the time.', zh:'《攻占巴士底狱》（1789年7月14日）——同时代画家让-皮埃尔·乌埃尔的水彩画。', credit:'Jean-Pierre Houël', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Prise_de_la_Bastille.jpg' } ] },
  versailles:{ en:'Versailles', zh:'凡尔赛', names:['Hall of Mirrors','Versailles','凡尔赛宫','凡尔赛'], ll:[2.12, 48.805], kind:'building',
    era:{ en:'Palace of the French kings; Treaty of Versailles, 1919', zh:'法国国王的王宫；1919年《凡尔赛和约》' },
    info:{ en:'Louis XIV built this giant palace. The French Revolution began with a meeting of the Estates-General here (1789), and the treaty ending World War I was signed in its Hall of Mirrors.', zh:'路易十四修建了这座宏大的王宫。1789年法国大革命从这里召开的三级会议开始；结束第一次世界大战的和约在宫中的镜厅签订。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Palace_of_Versailles_June_2010.jpg/960px-Palace_of_Versailles_June_2010.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Palace of Versailles', zh:'凡尔赛宫', credit:'King of Hearts', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Palace_of_Versailles_June_2010.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles.jpg/960px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'“The Signing of Peace in the Hall of Mirrors, Versailles, 28 June 1919” by William Orpen.', zh:'威廉·奥彭的画《1919年6月28日在凡尔赛宫镜厅签署和约》。', credit:'William Orpen', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors,_Versailles.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Chateau_Versailles_Galerie_des_Glaces.jpg/960px-Chateau_Versailles_Galerie_des_Glaces.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Hall of Mirrors at Versailles today', zh:'今天的凡尔赛宫镜厅', credit:'Myrabella', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Chateau_Versailles_Galerie_des_Glaces.jpg' } ] },
  saintdomingue:{ en:'Saint-Domingue (Haiti)', zh:'圣多明各（海地）', names:['Saint-Domingue','圣多明各'], ll:[-72.3, 19.0], kind:'region', subjects:['worldhistory'],
    today:{ en:'Haiti', zh:'今海地' }, era:{ en:'Haitian Revolution, 1791–1804', zh:'海地革命，1791—1804年' },
    info:{ en:'France’s richest sugar colony, worked by enslaved Africans. Led by Toussaint Louverture, they won their freedom and founded Haiti in 1804.', zh:'法国最富的蔗糖殖民地，靠被奴役的非洲人劳作。在杜桑·卢维杜尔的领导下，他们赢得自由，1804年建立海地。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Citadelle_Laferri%C3%A8re_Aerial_View.jpg/960px-Citadelle_Laferri%C3%A8re_Aerial_View.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Citadelle Laferrière, a huge fortress built after Haiti won independence', zh:'拉费里埃城堡——海地独立后修建的巨大要塞', credit:'SPC Gibran Torres, United States Army', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Citadelle_Laferri%C3%A8re_Aerial_View.jpg' } ] },
  manchester:{ en:'Manchester', zh:'曼彻斯特', names:['Manchester','曼彻斯特'], ll:[-2.24, 53.48], kind:'city', subjects:['worldhistory'],
    era:{ en:'“Cottonopolis” of the Industrial Revolution', zh:'工业革命时期的“棉都”' },
    info:{ en:'Steam-powered cotton mills made Manchester the first great industrial city. In 1830 the first inter-city railway linked it with Liverpool.', zh:'蒸汽动力的棉纺厂让曼彻斯特成为第一座大工业城市。1830年，世界上第一条城际铁路把它和利物浦连了起来。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/View_of_the_Manchester_Liverpool_Road_railway_station%2C_Manchester_from_a_building_under_renovation_to_south_of_track_02.jpg/960px-View_of_the_Manchester_Liverpool_Road_railway_station%2C_Manchester_from_a_building_under_renovation_to_south_of_track_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Liverpool Road station in Manchester, the end of the world’s first inter-city railway (1830)', zh:'曼彻斯特利物浦路车站，世界第一条城际铁路（1830年）的终点', credit:'Ridiculopathy', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:View_of_the_Manchester_Liverpool_Road_railway_station,_Manchester_from_a_building_under_renovation_to_south_of_track_02.jpg' } ] },
  liverpool:{ en:'Liverpool', zh:'利物浦', names:['Liverpool','利物浦'], ll:[-2.99, 53.41], kind:'port',
    era:{ en:'Port of the cotton trade; railway to Manchester, 1830', zh:'棉花贸易港口；1830年通往曼彻斯特的铁路' },
    info:{ en:'Raw cotton from America arrived at Liverpool’s docks and went by train to the Manchester mills. Earlier the port was deeply involved in the slave trade.', zh:'从美洲运来的原棉在利物浦码头卸下，再用火车运往曼彻斯特的工厂。更早时，这个港口深深卷入了奴隶贸易。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Liverpool_Pier_Head.jpg/960px-Liverpool_Pier_Head.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Pier Head on the River Mersey, Liverpool', zh:'利物浦默西河畔的码头区', credit:'The original uploader was Chowells at En', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Liverpool_Pier_Head.jpg' } ] },
  liege:{ en:'Liège', zh:'列日', names:['Liège','列日'], ll:[5.57, 50.63], kind:'city',
    era:{ en:'Coal and iron centre, 1820s', zh:'19世纪20年代的煤铁工业中心' },
    info:{ en:'Belgium was the first country on the European mainland to industrialise, using the coal and iron around Liège.', zh:'比利时是欧洲大陆最早开始工业化的国家，靠的就是列日一带的煤和铁。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/View_of_central_Li%C3%A8ge_from_the_Coteaux_de_la_Citadelle_viewpoint%2C_Li%C3%A8ge%2C_2026.jpg/960px-View_of_central_Li%C3%A8ge_from_the_Coteaux_de_la_Citadelle_viewpoint%2C_Li%C3%A8ge%2C_2026.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Liège on the River Meuse', zh:'默兹河畔的列日', credit:'DimiTalen', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:View_of_central_Li%C3%A8ge_from_the_Coteaux_de_la_Citadelle_viewpoint,_Li%C3%A8ge,_2026.jpg' } ] },
  lowell:{ en:'Lowell', zh:'洛厄尔', names:['Lowell','洛厄尔'], ll:[-71.31, 42.64], kind:'city', subjects:['worldhistory','ushistory'],
    era:{ en:'America’s first big factory town, 1820s', zh:'19世纪20年代美国第一座大型工厂城' },
    info:{ en:'Water-powered textile mills along the Merrimack River employed thousands of young women, the “mill girls”.', zh:'梅里马克河畔水力驱动的纺织厂雇用了成千上万的年轻女工，人们称她们为“工厂女孩”。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Boott_Cotton_Mills_complex%2C_Lowell%2C_Massachusetts_LCCN2011631235.tif/lossy-page1-960px-Boott_Cotton_Mills_complex%2C_Lowell%2C_Massachusetts_LCCN2011631235.tif.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Boott Cotton Mills in Lowell, Massachusetts', zh:'马萨诸塞州洛厄尔的布特棉纺厂', credit:'Carol M. Highsmith', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Boott_Cotton_Mills_complex,_Lowell,_Massachusetts_LCCN2011631235.tif' } ] },
  chengde:{ en:'Chengde Mountain Resort', zh:'承德避暑山庄', names:['承德避暑山庄','避暑山庄','承德','Chengde'], ll:[117.94, 40.99], kind:'building',
    era:{ en:'Summer palace of the Qing emperors; Macartney’s mission, 1793', zh:'清朝皇帝的夏宫；1793年马戛尔尼使团来访' },
    info:{ en:'Emperor Qianlong received the British envoy Lord Macartney here and turned down his requests for more trade.', zh:'乾隆皇帝在这里接见英国使节马戛尔尼，拒绝了他扩大通商的要求。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Chengde_Mountain_Resort_22686-Chengde_%2843552720970%29.jpg/960px-Chengde_Mountain_Resort_22686-Chengde_%2843552720970%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Chengde Mountain Resort, the Qing emperors’ summer palace', zh:'承德避暑山庄，清朝皇帝的夏宫', credit:'xiquinhosilva', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Chengde_Mountain_Resort_22686-Chengde_(43552720970).jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/LordMacartneyEmbassyToChina1793.jpg/960px-LordMacartneyEmbassyToChina1793.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Lord Macartney’s first meeting with Emperor Qianlong, 1793 — drawn by William Alexander, an artist with the embassy.', zh:'1793年马戛尔尼第一次觐见乾隆皇帝——使团画家威廉·亚历山大所绘。', credit:'William Alexander', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:LordMacartneyEmbassyToChina1793.jpg' } ] },
  humen:{ en:'Humen', zh:'虎门', names:['虎门销烟','虎门','Humen'], ll:[113.67, 22.82], kind:'site',
    era:{ en:'Lin Zexu destroys opium, 1839; Opium War forts', zh:'1839年林则徐虎门销烟；鸦片战争中的炮台' },
    info:{ en:'In 1839 Lin Zexu destroyed over a million kilograms of opium on the beach here. Its forts guarding the Pearl River were attacked in the Opium War.', zh:'1839年，林则徐在这里的海滩上销毁了一百多万千克鸦片。扼守珠江口的虎门炮台在鸦片战争中遭到英军进攻。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Humen-opium-war-museum-weiyuan-fort-and-humen-bridge.jpg/960px-Humen-opium-war-museum-weiyuan-fort-and-humen-bridge.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Weiyuan Fort at Humen, with the modern Humen Bridge behind', zh:'虎门威远炮台，后面是现代的虎门大桥', credit:'Guangzhou Private Tours by Janvi', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Humen-opium-war-museum-weiyuan-fort-and-humen-bridge.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Destroying_Chinese_war_junks%2C_by_E._Duncan_%281843%29.jpg/960px-Destroying_Chinese_war_junks%2C_by_E._Duncan_%281843%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The East India Company iron steamship Nemesis destroying Qing war junks in the First Opium War (painting by Edward Duncan, 1843).', zh:'鸦片战争中，东印度公司的铁壳蒸汽船“复仇女神号”摧毁清军战船（爱德华·邓肯绘，1843年）。', credit:'Edward Duncan', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Destroying_Chinese_war_junks,_by_E._Duncan_(1843).jpg' } ] },
  /* ---------- World Wars ---------- */
  sarajevo:{ en:'Sarajevo', zh:'萨拉热窝', names:['Sarajevo','萨拉热窝'], ll:[18.43, 43.86], kind:'city',
    era:{ en:'Archduke Franz Ferdinand shot, 28 June 1914', zh:'1914年6月28日斐迪南大公遇刺' },
    info:{ en:'The heir to Austria-Hungary was shot near the Latin Bridge here. Within weeks the alliances pulled Europe into World War I.', zh:'奥匈帝国皇位继承人在这里的拉丁桥附近遇刺。几周之内，各国结成的同盟把欧洲拖入了第一次世界大战。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/The_Latin_Bridge%2C_Sarajevo.jpg/960px-The_Latin_Bridge%2C_Sarajevo.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Latin Bridge in Sarajevo, near where the archduke was shot', zh:'萨拉热窝的拉丁桥，大公就是在这附近遇刺的', credit:'Đana Talić', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:The_Latin_Bridge,_Sarajevo.jpg' },
      { src:'https://upload.wikimedia.org/wikipedia/commons/3/38/Archduke_Franz_Ferdinand_in_Sarajevo%2C_June_1914_Q91848.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, in Sarajevo in June 1914 (Imperial War Museums).', zh:'1914年6月，奥匈帝国皇储斐迪南大公在萨拉热窝（英国帝国战争博物馆藏）。', credit:'Unknown author', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Archduke_Franz_Ferdinand_in_Sarajevo,_June_1914_Q91848.jpg' } ] },
  ypres:{ en:'Ypres', zh:'伊普尔', names:['Ypres','Menin Gate','伊普尔'], ll:[2.885, 50.85], kind:'battle',
    today:{ en:'Ieper, Belgium', zh:'今比利时伊珀尔' }, era:{ en:'Battles of Ypres, 1914–1918', zh:'伊普尔战役，1914—1918年' },
    info:{ en:'Five big battles were fought around this small Belgian town, and poison gas was first used on a large scale here. Every evening buglers play the Last Post at the Menin Gate.', zh:'这座比利时小城周围发生过五次大战役，大规模使用毒气就是从这里开始的。每天傍晚，号手都在梅宁门吹响《最后的岗位》。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Last_Post_ceremony_at_the_Menin_Gate_in_Ypres_%28DSCF9452%29.jpg/960px-Last_Post_ceremony_at_the_Menin_Gate_in_Ypres_%28DSCF9452%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Last Post ceremony at the Menin Gate in Ypres, Belgium. Buglers play here every evening for the soldiers of World War I who have no known grave — over 54,000 names are carved on its walls.', zh:'比利时伊普尔梅嫩门的“最后岗哨”仪式。每天傍晚，号手都在这里为一战中没有找到坟墓的士兵吹号——墙上刻着5.4万多个名字。', credit:'Trougnouf (Benoit Brummer)', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Last_Post_ceremony_at_the_Menin_Gate_in_Ypres_(DSCF9452).jpg' } ] },
  neuvechapelle:{ en:'Neuve Chapelle', zh:'新沙佩勒', names:['Neuve Chapelle','新沙佩勒'], ll:[2.78, 50.58], kind:'battle',
    era:{ en:'British and Indian attack, March 1915', zh:'1915年3月英军和印度军队的进攻' },
    info:{ en:'Many soldiers from India fought in this early trench battle. A memorial here remembers the Indian soldiers who died on the Western Front.', zh:'很多印度士兵参加了这场早期的堑壕战。这里的纪念碑纪念在西线阵亡的印度士兵。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Neuve-Chapelle_-_M%C3%A9morial_indien_-_1.JPG/960px-Neuve-Chapelle_-_M%C3%A9morial_indien_-_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Indian Memorial at Neuve-Chapelle', zh:'新沙佩勒的印度士兵纪念碑', credit:'Floflo62', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Neuve-Chapelle_-_M%C3%A9morial_indien_-_1.JPG' } ] },
  somme:{ en:'The Somme', zh:'索姆河', names:['The Somme','Somme','索姆河'], ll:[2.70, 50.02], kind:'battle',
    era:{ en:'Battle of the Somme, July–November 1916', zh:'索姆河战役，1916年7—11月' },
    info:{ en:'On the first day alone, about 57,000 British soldiers were killed or wounded. Tanks were used in battle for the first time here.', zh:'仅第一天，英军就伤亡约5.7万人。坦克第一次在这里投入战斗。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Cheshire_Regiment_trench_Somme_1916.jpg/960px-Cheshire_Regiment_trench_Somme_1916.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'British soldiers of the Cheshire Regiment in a captured German trench at the Somme, July 1916.', zh:'1916年7月，索姆河战役中，英军柴郡团士兵在一条占领的德军战壕里。', credit:'John Warwick Brooke', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Cheshire_Regiment_trench_Somme_1916.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/British_Mark_I_male_tank_Somme_25_September_1916.jpg/960px-British_Mark_I_male_tank_Somme_25_September_1916.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A British Mark I tank at the Somme, 25 September 1916 — tanks were brand new that year.', zh:'1916年9月25日，索姆河战场上的英国马克I型坦克——坦克在这一年刚刚问世。', credit:'Ernest Brooks', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:British_Mark_I_male_tank_Somme_25_September_1916.jpg' } ] },
  cambrai:{ en:'Cambrai', zh:'康布雷', names:['Cambrai','康布雷'], ll:[3.24, 50.18], kind:'battle',
    era:{ en:'First mass tank attack, November 1917', zh:'1917年11月首次大规模坦克进攻' },
    info:{ en:'Nearly 400 British tanks attacked together here, breaking through the German trenches for a short time.', zh:'近400辆英国坦克在这里一起发动进攻，一度突破了德军的堑壕防线。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Deborah%29_at_Cambrai_Tank_1917.jpg/960px-Deborah%29_at_Cambrai_Tank_1917.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'“Deborah”, a British tank knocked out at Cambrai in 1917, dug up in 1998 and now in a museum', zh:'1917年在康布雷被击毁的英国坦克“黛博拉号”，1998年被挖出，今天陈列在博物馆里', credit:'HawkeyeUK', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Deborah)_at_Cambrai_Tank_1917.jpg' } ] },
  amiens:{ en:'Amiens', zh:'亚眠', names:['Amiens','亚眠'], ll:[2.30, 49.89], kind:'battle',
    era:{ en:'Allied breakthrough, August 1918', zh:'1918年8月协约国突破' },
    info:{ en:'Allied tanks, planes and infantry worked together and broke the German lines. A German general called it “the black day of the German Army”.', zh:'协约国的坦克、飞机和步兵协同作战，突破了德军防线。一位德国将军称这一天是“德国陆军的黑暗日”。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Amiens_France_Cath%C3%A9drale-Notre-Dame-d-Amiens-02.jpg/960px-Amiens_France_Cath%C3%A9drale-Notre-Dame-d-Amiens-02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Amiens Cathedral, which survived both world wars', zh:'在两次世界大战中幸存的亚眠大教堂', credit:'CEphoto, Uwe Aranas', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Amiens_France_Cath%C3%A9drale-Notre-Dame-d-Amiens-02.jpg' } ] },
  warsaw:{ en:'Warsaw', zh:'华沙', names:['Warsaw','华沙'], ll:[21.01, 52.23], kind:'capital',
    era:{ en:'Invaded 1939; Warsaw Pact signed here, 1955', zh:'1939年遭入侵；1955年在这里签订华沙条约' },
    info:{ en:'German bombs destroyed most of the city in World War II; Poles rebuilt the Old Town brick by brick. In 1955 the Soviet bloc signed the Warsaw Pact here.', zh:'第二次世界大战中，德军的轰炸摧毁了华沙的大部分城区，波兰人一砖一瓦重建了老城。1955年，苏联阵营在这里签订了《华沙条约》。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/2018-07-08_Old_Town_Market_Square_in_Warsaw.jpg/960px-2018-07-08_Old_Town_Market_Square_in_Warsaw.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Warsaw’s Old Town Market Square, rebuilt after World War II', zh:'二战后重建的华沙老城广场', credit:'Maksym Kozlenko', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:2018-07-08_Old_Town_Market_Square_in_Warsaw.jpg' } ] },
  dunkirk:{ en:'Dunkirk', zh:'敦刻尔克', names:['Dunkirk','敦刻尔克'], ll:[2.38, 51.03], kind:'port',
    today:{ en:'Dunkerque, France', zh:'今法国敦刻尔克' }, era:{ en:'Evacuation, May–June 1940', zh:'1940年5—6月大撤退' },
    info:{ en:'Trapped by the German army, about 338,000 British and French soldiers were carried across the Channel by warships and hundreds of small boats.', zh:'被德军围困的约33.8万英法士兵，由军舰和数百艘小船接运，渡过英吉利海峡撤到英国。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Dunkirk_1940_HU1137.jpg/960px-Dunkirk_1940_HU1137.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'British soldiers wading out to a ship at Dunkirk, 1940', zh:'1940年，在敦刻尔克涉水登船的英国士兵', credit:'Unknown author', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Dunkirk_1940_HU1137.jpg' } ] },
  stalingrad:{ en:'Stalingrad', zh:'斯大林格勒', names:['Stalingrad','斯大林格勒'], ll:[44.52, 48.71], kind:'battle',
    today:{ en:'Volgograd, Russia', zh:'今俄罗斯伏尔加格勒' }, era:{ en:'Battle of Stalingrad, Aug 1942 – Feb 1943', zh:'斯大林格勒战役，1942年8月—1943年2月' },
    info:{ en:'The Red Army fought street by street on the Volga and trapped a whole German army. It was the turning point of the war in Europe.', zh:'苏联红军在伏尔加河畔逐街逐屋战斗，包围了一整支德国集团军。这是欧洲战场的转折点。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Mamayev_Kurgan_-_The_Motherland_Calls.JPG/960px-Mamayev_Kurgan_-_The_Motherland_Calls.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'“The Motherland Calls” memorial on Mamayev Kurgan, Volgograd', zh:'伏尔加格勒马马耶夫岗上的“祖国母亲在召唤”纪念像', credit:'Владимир Рябцев', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:Mamayev_Kurgan_-_The_Motherland_Calls.JPG' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Soldiers_with_Stalingrad_villages.jpg/960px-Soldiers_with_Stalingrad_villages.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Soviet infantry marching toward Stalingrad on the Southern Front, 1942 (photo by B. N. Yaroslavtsev, Moscow Main Archive).', zh:'1942年，苏联步兵在南方面军向斯大林格勒行进（雅罗斯拉夫采夫摄，莫斯科总档案馆藏）。', credit:'Moscow Main Archive (Главархив Москвы)', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Soldiers_with_Stalingrad_villages.jpg' } ] },
  pearlharbor:{ en:'Pearl Harbor', zh:'珍珠港', names:['Pearl Harbor','珍珠港'], ll:[-157.95, 21.36], kind:'port',
    era:{ en:'Japanese attack, 7 December 1941', zh:'1941年12月7日日本偷袭' },
    info:{ en:'Japan’s surprise air attack sank or damaged many US warships, and the next day the USA entered the war. The USS Arizona Memorial floats above the sunken ship.', zh:'日本的突然空袭击沉、击伤了许多美国军舰，第二天美国参战。“亚利桑那号”纪念馆就建在沉船的上方。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/USS_Arizona_Memorial_%28aerial_view%29.jpg/960px-USS_Arizona_Memorial_%28aerial_view%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The USS Arizona Memorial above the sunken battleship', zh:'建在沉没战列舰上方的“亚利桑那号”纪念馆', credit:'DoD photo by: PH3(AW/SW) JAYME PASTORIC,', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:USS_Arizona_Memorial_(aerial_view).jpg' } ] },
  washington:{ en:'Washington, D.C.', zh:'华盛顿', names:['Washington, D.C.','Washington','华盛顿特区','华盛顿'], ll:[-77.04, 38.90], kind:'capital', subjects:['worldhistory'],
    era:{ en:'Declaration by United Nations signed, 1 January 1942', zh:'1942年1月1日签署《联合国家宣言》' },
    info:{ en:'Twenty-six countries, including China, the USA, Britain and the USSR, signed the Declaration by United Nations here, promising to fight the Axis together.', zh:'中、美、英、苏等26个国家在这里签署《联合国家宣言》，保证共同对轴心国作战。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Capitol_at_Dusk_2.jpg/960px-Capitol_at_Dusk_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The US Capitol in Washington, D.C.', zh:'华盛顿特区的美国国会大厦', credit:'Martin Falbisoner', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Capitol_at_Dusk_2.jpg' } ] },
  midway:{ en:'Midway', zh:'中途岛', names:['Battle of Midway','Midway','中途岛'], ll:[-177.37, 28.21], kind:'battle', subjects:['worldhistory'],
    era:{ en:'Battle of Midway, June 1942', zh:'中途岛海战，1942年6月' },
    info:{ en:'US planes sank four Japanese aircraft carriers here in one day — the turning point of the war in the Pacific.', zh:'美国飞机在一天之内击沉了四艘日本航空母舰，这是太平洋战场的转折点。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Aerial_view_of_Midway_Atoll%2C_in_late_1942_%28314281627%29.jpg/960px-Aerial_view_of_Midway_Atoll%2C_in_late_1942_%28314281627%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Midway Atoll from the air in late 1942', zh:'1942年末从空中俯瞰中途岛环礁', credit:'U.S. Army Air Forces', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Aerial_view_of_Midway_Atoll,_in_late_1942_(314281627).jpg' } ] },
  kunming:{ en:'Kunming', zh:'昆明', names:['Kunming','昆明'], ll:[102.71, 25.04], kind:'city',
    era:{ en:'End of the Hump airlift; Flying Tigers base, 1941–1945', zh:'驼峰航线的终点；“飞虎队”基地，1941—1945年' },
    info:{ en:'American and Chinese pilots flew supplies here over the Himalayas (“the Hump”) from India, and the Flying Tigers fought from its airfields.', zh:'中美飞行员从印度飞越喜马拉雅山（“驼峰”）把物资运到这里，“飞虎队”也从这里的机场出击作战。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/20260222_Kunming_Dianchi_Lake.jpg/960px-20260222_Kunming_Dianchi_Lake.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Dian Lake (Dianchi) in Kunming', zh:'昆明滇池', credit:'Ngguls', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:20260222_Kunming_Dianchi_Lake.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Flying_Tiger_P-40_Kunming.jpg/960px-Flying_Tiger_P-40_Kunming.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ground crew service a P-40 fighter of the American Volunteer Group (“Flying Tigers”) in Kunming, China.', zh:'地勤人员在中国昆明维护美国志愿航空队（“飞虎队”）的P-40战斗机。', credit:'USAF', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Flying_Tiger_P-40_Kunming.jpg' } ] },
  elalamein:{ en:'El Alamein', zh:'阿拉曼', names:['El Alamein','Alamein','阿拉曼'], ll:[28.95, 30.83], kind:'battle',
    era:{ en:'Allied victory, October–November 1942', zh:'1942年10—11月盟军大胜' },
    info:{ en:'In the desert west of Alexandria, British and Commonwealth troops beat Rommel’s German and Italian army and saved the Suez Canal.', zh:'在亚历山大港以西的沙漠里，英国和英联邦军队打败了隆美尔指挥的德意军队，保住了苏伊士运河。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/ElAlameinCommonwealthWarCemetery.jpg/960px-ElAlameinCommonwealthWarCemetery.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Commonwealth War Cemetery at El Alamein', zh:'阿拉曼英联邦战争公墓', credit:'Ian Rose', license:'CC BY 2.5', page:'https://commons.wikimedia.org/wiki/File:ElAlameinCommonwealthWarCemetery.jpg' } ] },
  auschwitz:{ en:'Auschwitz-Birkenau', zh:'奥斯维辛—比克瑙', names:['Auschwitz-Birkenau','Auschwitz','奥斯维辛'], ll:[19.18, 50.03], kind:'site',
    today:{ en:'Oświęcim, Poland', zh:'今波兰奥斯维辛' }, era:{ en:'Nazi death camp, 1940–January 1945', zh:'纳粹灭绝营，1940年—1945年1月' },
    info:{ en:'The largest Nazi camp, where about 1.1 million people, most of them Jews, were murdered. It is now a memorial so that the world remembers.', zh:'最大的纳粹集中营，约110万人在这里被杀害，其中大多数是犹太人。今天它是一座纪念馆，让世界永远铭记。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Gatehouse_Auschwitz_II_%28Birkenau%29%2C_Poland.jpg/960px-Gatehouse_Auschwitz_II_%28Birkenau%29%2C_Poland.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The gatehouse of Auschwitz II-Birkenau in Poland, today a memorial and museum.', zh:'波兰奥斯维辛第二集中营（比克瑙）的大门，今天是纪念馆和博物馆。', credit:'Diego Delso', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Gatehouse_Auschwitz_II_(Birkenau),_Poland.jpg' } ] },
  normandy:{ en:'Normandy', zh:'诺曼底', names:['Normandy','诺曼底'], ll:[-0.6, 49.3], kind:'region',
    era:{ en:'William the Conqueror’s duchy; D-Day landings, 6 June 1944', zh:'征服者威廉的公国；1944年6月6日诺曼底登陆' },
    info:{ en:'In 1066 Duke William sailed from here to conquer England. On D-Day about 156,000 Allied troops landed on its beaches to free France.', zh:'1066年，威廉公爵从这里出发征服了英格兰。诺曼底登陆那天，约15.6万盟军在这里的海滩登陆，解放法国。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/1944_NormandyLST.jpg/960px-1944_NormandyLST.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Landing ships unloading on a Normandy beach, June 1944', zh:'1944年6月在诺曼底海滩卸载物资的登陆舰', credit:'Chief Photographer’s Mate (CPHOM) Robert', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:1944_NormandyLST.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Omaha_Beach_from_Dog_Red_sector.jpg/960px-Omaha_Beach_from_Dog_Red_sector.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Omaha Beach today', zh:'今天的奥马哈海滩', credit:'Jebulon', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Omaha_Beach_from_Dog_Red_sector.jpg' } ] },
  berlin:{ en:'Berlin', zh:'柏林', names:['Berlin','柏林'], ll:[13.40, 52.52], kind:'capital',
    era:{ en:'Falls 1945; divided city of the Cold War, 1945–1990', zh:'1945年被攻克；冷战时期的分裂城市，1945—1990年' },
    info:{ en:'The Soviet Red Army took Hitler’s capital in 1945. Then the city was split, the West kept alive by the 1948 airlift, and divided by a wall from 1961 to 1989.', zh:'1945年苏联红军攻克希特勒的首都。此后柏林被分裂：1948年靠空运维持西柏林，1961—1989年被一堵墙隔开。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Raising_a_flag_over_the_Reichstag_-_Restoration.jpg/960px-Raising_a_flag_over_the_Reichstag_-_Restoration.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A Soviet soldier raises a flag over the Reichstag, Berlin, May 1945 (photo by Yevgeny Khaldei)', zh:'1945年5月，一名苏联士兵在柏林国会大厦上升起旗帜（叶夫根尼·哈尔杰伊摄）', credit:'Yevgeny Khaldei / Adam Cuerden', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Raising_a_flag_over_the_Reichstag_-_Restoration.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Reichstagsgeb%C3%A4ude_von_Westen.jpg/960px-Reichstagsgeb%C3%A4ude_von_Westen.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Reichstag building in Berlin today', zh:'今天的柏林国会大厦', credit:'Jörg Braukmann', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Reichstagsgeb%C3%A4ude_von_Westen.jpg' } ] },
  hiroshima:{ en:'Hiroshima', zh:'广岛', names:['Hiroshima','广岛'], ll:[132.45, 34.39], kind:'city',
    era:{ en:'Atomic bomb, 6 August 1945', zh:'1945年8月6日遭原子弹轰炸' },
    info:{ en:'The first atomic bomb used in war destroyed the city. The ruined dome of one building was kept as a Peace Memorial.', zh:'战争中使用的第一颗原子弹摧毁了这座城市。一座建筑被炸毁的圆顶被保留下来，作为和平纪念碑。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Hiroshima_Peace_Memorial_%28Genbaku_Dome%29%2C_20240817_0823_4200.jpg/960px-Hiroshima_Peace_Memorial_%28Genbaku_Dome%29%2C_20240817_0823_4200.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Atomic Bomb Dome, Hiroshima Peace Memorial', zh:'广岛和平纪念碑（原爆圆顶）', credit:'Jakub Hałun', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Hiroshima_Peace_Memorial_(Genbaku_Dome),_20240817_0823_4200.jpg' } ] },
  nagasaki:{ en:'Nagasaki', zh:'长崎', names:['Nagasaki','长崎'], ll:[129.87, 32.75], kind:'city',
    era:{ en:'Atomic bomb, 9 August 1945', zh:'1945年8月9日遭原子弹轰炸' },
    info:{ en:'Three days after Hiroshima, a second atomic bomb hit Nagasaki. Its Peace Park calls for a world without nuclear weapons.', zh:'广岛被炸三天后，第二颗原子弹投到长崎。这里的和平公园呼吁建设没有核武器的世界。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/20190202_Nagasaki_Peace_Park_Peace_Statue-3.jpg/960px-20190202_Nagasaki_Peace_Park_Peace_Statue-3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Peace Statue in Nagasaki Peace Park', zh:'长崎和平公园的和平祈念像', credit:'Balon Greyjoy', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:20190202_Nagasaki_Peace_Park_Peace_Statue-3.jpg' } ] },
  tokyobay:{ en:'Tokyo Bay', zh:'东京湾', names:['Tokyo Bay','东京湾'], ll:[139.77, 35.35], kind:'sea',
    era:{ en:'Japan signs the surrender on USS Missouri, 2 September 1945', zh:'1945年9月2日日本在“密苏里号”上签署投降书' },
    info:{ en:'On the deck of the battleship USS Missouri, Japan signed the Instrument of Surrender. China’s representative signed for the Allies too.', zh:'日本在“密苏里号”战列舰甲板上签署投降书，中国代表也作为同盟国一方签了字。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Mamoru_Shigemitsu_signs_the_Instrument_of_Surrender%2C_officially_ending_the_Second_World_War.jpg/960px-Mamoru_Shigemitsu_signs_the_Instrument_of_Surrender%2C_officially_ending_the_Second_World_War.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'2 September 1945: Japan’s foreign minister Mamoru Shigemitsu signs the Instrument of Surrender aboard USS Missouri.', zh:'1945年9月2日：日本外相重光葵在“密苏里号”战列舰上签署投降书。', credit:'Army Signal Corps photographer LT. Stephen E. Korpanty; restored by Adam Cuerden', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Mamoru_Shigemitsu_signs_the_Instrument_of_Surrender,_officially_ending_the_Second_World_War.jpg' } ] },
  yalta:{ en:'Yalta', zh:'雅尔塔', names:['Yalta','雅尔塔'], ll:[34.14, 44.47], kind:'city',
    era:{ en:'Yalta Conference, February 1945', zh:'雅尔塔会议，1945年2月' },
    info:{ en:'Roosevelt, Churchill and Stalin met in the Livadia Palace here to plan the end of the war and the founding of the United Nations.', zh:'罗斯福、丘吉尔和斯大林在这里的里瓦几亚宫会谈，商定战争的结束和联合国的建立。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Yalta-_Livadia_Palace_%282744981408%29.jpg/960px-Yalta-_Livadia_Palace_%282744981408%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Livadia Palace in Yalta, where the Big Three met in 1945', zh:'雅尔塔的里瓦几亚宫，1945年三巨头在这里会晤', credit:'Jean & Nathalie', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Yalta-_Livadia_Palace_(2744981408).jpg' } ] },
  /* ---------- Cold War ---------- */
  tempelhof:{ en:'Tempelhof Airport', zh:'滕珀尔霍夫机场', names:['Tempelhof Airport','Tempelhof','滕珀尔霍夫机场','滕珀尔霍夫'], ll:[13.40, 52.47], kind:'site',
    today:{ en:'Tempelhofer Feld park, Berlin', zh:'今柏林滕珀尔霍夫公园' }, era:{ en:'Berlin Airlift, June 1948 – May 1949', zh:'柏林空运，1948年6月—1949年5月' },
    info:{ en:'When the USSR blocked the roads into West Berlin, Western planes landed here every few minutes with food and coal. Today the old runways are a huge park.', zh:'苏联封锁通往西柏林的道路后，西方的飞机每隔几分钟就在这里降落，运来食品和煤炭。今天旧跑道成了一座大公园。' },
    photos:[
      { src:'https://upload.wikimedia.org/wikipedia/commons/2/2a/C-54_landing_at_Tempelhof_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'Berliners watch a C-54 transport plane land at Tempelhof Airport during the Berlin Airlift, 1948.', zh:'1948年柏林空运期间，柏林人看着一架C-54运输机降落在滕珀尔霍夫机场。', credit:'Henry Ries / USAF', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:C-54_landing_at_Tempelhof_(cropped).jpg' } ] },
  berlinwall:{ en:'Berlin Wall', zh:'柏林墙', names:['Berlin Wall','柏林墙','Brandenburg Gate','勃兰登堡门'], ll:[13.377, 52.516], kind:'site',
    era:{ en:'Built 13 August 1961; opened 9 November 1989', zh:'1961年8月13日修建；1989年11月9日开放' },
    info:{ en:'East Germany built the wall overnight to stop its people escaping to the West. In 1989 crowds climbed on it at the Brandenburg Gate and began to knock it down.', zh:'东德一夜之间筑起这道墙，阻止民众逃往西方。1989年，人们在勃兰登堡门前登上墙头，开始拆除它。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/BerlinWall-BrandenburgGate.jpg/960px-BerlinWall-BrandenburgGate.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'People on top of the Berlin Wall near the Brandenburg Gate, 9 November 1989.', zh:'1989年11月9日，人们站在勃兰登堡门附近的柏林墙上。', credit:'Sue Ream, photographer (San Francisco, California)', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:BerlinWall-BrandenburgGate.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Berlin_Wall_near_East_Side_Gallery.JPG/960px-Berlin_Wall_near_East_Side_Gallery.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A surviving stretch of the Berlin Wall near the East Side Gallery, Berlin — today covered with paintings by artists from around the world.', zh:'柏林东区画廊附近保留下来的一段柏林墙——今天墙上画满了来自世界各地艺术家的壁画。', credit:'Pudelek (Marcin Szala)', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Berlin_Wall_near_East_Side_Gallery.JPG' } ] },
  checkpointcharlie:{ en:'Checkpoint Charlie', zh:'查理检查站', names:['Checkpoint Charlie','查理检查站'], ll:[13.390, 52.507], kind:'site',
    era:{ en:'US and Soviet tanks face off, October 1961', zh:'1961年10月美苏坦克对峙' },
    info:{ en:'The best-known crossing point between East and West Berlin. In 1961 American and Soviet tanks stood just metres apart here for 16 hours.', zh:'东西柏林之间最著名的过境点。1961年，美苏坦克在这里相距仅几米对峙了16个小时。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/U._S._Tanks_at_Checkpoint_Charlie_-_Flickr_-_The_Central_Intelligence_Agency.jpg/960px-U._S._Tanks_at_Checkpoint_Charlie_-_Flickr_-_The_Central_Intelligence_Agency.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'27 October 1961: US tanks face Soviet tanks at Checkpoint Charlie, Berlin, weeks after the Wall went up.', zh:'1961年10月27日：柏林墙建起几周后，美军坦克与苏军坦克在查理检查站对峙。', credit:'The Central Intelligence Agency', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:U._S._Tanks_at_Checkpoint_Charlie_-_Flickr_-_The_Central_Intelligence_Agency.jpg' } ] },
  frankfurt:{ en:'Frankfurt', zh:'法兰克福', names:['Frankfurt','法兰克福'], ll:[8.68, 50.11], kind:'city', subjects:['worldhistory'],
    today:{ en:'Frankfurt am Main, Germany', zh:'今德国美因河畔法兰克福' }, era:{ en:'Airlift base, 1948; European Central Bank since 1998', zh:'1948年空运基地；1998年起为欧洲中央银行所在地' },
    info:{ en:'Many Berlin Airlift flights took off from here. Today the European Central Bank, which looks after the euro, has its tower in Frankfurt.', zh:'柏林空运的许多航班从这里起飞。今天，负责管理欧元的欧洲中央银行总部大楼就在法兰克福。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/European_Central_Bank_Frankfurt_Germany_18_Feb_2023.jpg/960px-European_Central_Bank_Frankfurt_Germany_18_Feb_2023.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The European Central Bank tower in Frankfurt', zh:'法兰克福的欧洲中央银行大楼', credit:'Norbert Nagel', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:European_Central_Bank_Frankfurt_Germany_18_Feb_2023.jpg' } ] },
  panmunjom:{ en:'Panmunjom', zh:'板门店', names:['Panmunjom','板门店'], ll:[126.68, 37.96], kind:'site',
    era:{ en:'Korean War armistice signed, 27 July 1953', zh:'1953年7月27日朝鲜停战协定在这里签订' },
    info:{ en:'The armistice that stopped the fighting in the Korean War was signed here. Soldiers of North and South still stand face to face in its blue huts.', zh:'结束朝鲜战争战斗的停战协定在这里签订。至今南北双方的士兵仍在这里的蓝色小屋两侧面对面站岗。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Republic_of_Korea_Army_soldiers_stand_resolute_at_the_iconic_Joint_Security_Area_where_South_and_North_Korean_soldiers_stand_face_to_face_across_the_Korean_Demilitarized_Zone%2C_Panmunjom%2C_South_Korea%2C_June_19%2C_2018.jpg/960px-thumbnail.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Panmunjom, 2018: South Korean soldiers stand guard at the Joint Security Area in the Demilitarized Zone. The Korean War (1950–53) ended in a ceasefire, not a peace treaty, so Korea is still divided.', zh:'2018年板门店：韩国士兵在非军事区的共同警备区站岗。朝鲜战争（1950—1953）以停战而不是和平条约结束，所以朝鲜半岛至今仍然分裂。', credit:'Staff Sgt. Richard Colletta (U.S. Department of Defense)', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Republic_of_Korea_Army_soldiers_stand_resolute_at_the_iconic_Joint_Security_Area_where_South_and_North_Korean_soldiers_stand_face_to_face_across_the_Korean_Demilitarized_Zone,_Panmunjom,_South_Korea,_June_19,_2018.jpg' } ] },
  sancristobal:{ en:'San Cristóbal, Cuba', zh:'古巴圣克里斯托瓦尔', names:['San Cristóbal','圣克里斯托瓦尔'], ll:[-83.05, 22.72], kind:'site',
    era:{ en:'Soviet missile sites found, October 1962', zh:'1962年10月发现苏联导弹基地' },
    info:{ en:'A US spy plane photographed Soviet nuclear missile sites near this town. For 13 days the world feared a nuclear war.', zh:'美国侦察机在这座小城附近拍到了苏联的核导弹发射场。此后13天里，全世界都担心爆发核战争。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/U-2_photo_during_Cuban_Missile_Crisis.jpg/960px-U-2_photo_during_Cuban_Missile_Crisis.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A U-2 spy-plane photo of a Soviet missile convoy near San Cristóbal, Cuba, 14 October 1962.', zh:'1962年10月14日，U-2侦察机拍摄的古巴圣克里斯托瓦尔附近的苏联导弹车队。', credit:'USAF', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:U-2_photo_during_Cuban_Missile_Crisis.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/U-2_photo_during_Cuban_Missile_Crisis.jpg/960px-U-2_photo_during_Cuban_Missile_Crisis.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A U-2 spy-plane photo of a Soviet missile convoy near San Cristóbal, Cuba, 14 October 1962.', zh:'1962年10月14日，U-2侦察机拍摄的古巴圣克里斯托瓦尔附近的苏联导弹车队。', credit:'USAF', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:U-2_photo_during_Cuban_Missile_Crisis.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/MRBM_Launch_Site_1_San_Cristobal%2C_Cuba_25_October_1962_-_NARA_-_193928.tif/lossy-page1-960px-MRBM_Launch_Site_1_San_Cristobal%2C_Cuba_25_October_1962_-_NARA_-_193928.tif.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Missile launch site near San Cristóbal photographed from a US plane, 25 October 1962', zh:'1962年10月25日美国飞机拍摄的圣克里斯托瓦尔附近导弹发射场', credit:'Department of Defense. (09/18/1947 - ),', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:MRBM_Launch_Site_1_San_Cristobal,_Cuba_25_October_1962_-_NARA_-_193928.tif' } ] },
  saigon:{ en:'Saigon', zh:'西贡', names:['Saigon','西贡'], ll:[106.70, 10.78], kind:'city',
    today:{ en:'Ho Chi Minh City, Vietnam', zh:'今越南胡志明市' }, era:{ en:'Capital of South Vietnam; taken in 1975', zh:'南越的首都；1975年被攻占' },
    info:{ en:'North Vietnam took Saigon in 1975, ending the Vietnam War and reuniting the country. The city was renamed Ho Chi Minh City.', zh:'1975年北越攻占西贡，越南战争结束，国家重新统一。这座城市后来改名为胡志明市。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_03.JPG/960px-Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_03.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Notre-Dame Basilica in Ho Chi Minh City (old Saigon)', zh:'胡志明市（旧称西贡）的圣母大教堂', credit:'Diego Delso', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora,_Ciudad_Ho_Chi_Minh,_Vietnam,_2013-08-14,_DD_03.JPG' } ] },
  /* ---------- Our connected world ---------- */
  sanfrancisco:{ en:'San Francisco', zh:'旧金山', names:['San Francisco','旧金山'], ll:[-122.42, 37.78], kind:'city',
    era:{ en:'UN Charter signed, 26 June 1945', zh:'1945年6月26日签署《联合国宪章》' },
    info:{ en:'Delegates of 50 countries met here and signed the Charter of the United Nations. China was the first to sign.', zh:'50个国家的代表在这里开会，签署了《联合国宪章》，中国第一个签字。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/War_Memorial_Opera_House_%28San_Francisco%29.JPG/960px-War_Memorial_Opera_House_%28San_Francisco%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The War Memorial Opera House, where the UN founding conference met in 1945', zh:'战争纪念歌剧院，1945年联合国制宪会议在这里召开', credit:'Sanfranman59', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:War_Memorial_Opera_House_(San_Francisco).JPG' } ] },
  luxembourg:{ en:'Luxembourg', zh:'卢森堡', names:['Luxembourg','卢森堡'], ll:[6.13, 49.61], kind:'capital', subjects:['worldhistory'],
    era:{ en:'First seat of the European Coal and Steel Community, 1952', zh:'1952年欧洲煤钢共同体的首个驻地' },
    info:{ en:'Six countries put their coal and steel under one shared authority, which met here — the first step towards today’s European Union.', zh:'六个国家把煤炭和钢铁交给一个共同的机构管理，机构就设在这里——这是走向今天欧盟的第一步。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Luxembourg_City_Ville_Haute_seen_from_Rham_2013-08.JPG/960px-Luxembourg_City_Ville_Haute_seen_from_Rham_2013-08.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The old upper town of Luxembourg City', zh:'卢森堡市的老城上城区', credit:'Zinneke', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Luxembourg_City_Ville_Haute_seen_from_Rham_2013-08.JPG' } ] },
  maastricht:{ en:'Maastricht', zh:'马斯特里赫特', names:['Maastricht','马斯特里赫特'], ll:[5.69, 50.85], kind:'city',
    era:{ en:'Maastricht Treaty creates the European Union, 1992', zh:'1992年《马斯特里赫特条约》建立欧洲联盟' },
    info:{ en:'The treaty signed here created the European Union and planned a shared currency, the euro.', zh:'在这里签订的条约建立了欧洲联盟，并计划发行共同货币——欧元。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Maastricht_Vrijthof_15_BW_2017-08-19_12-06-24.jpg/960px-Maastricht_Vrijthof_15_BW_2017-08-19_12-06-24.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Vrijthof square in Maastricht', zh:'马斯特里赫特的弗赖特霍夫广场', credit:'Berthold Werner', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Maastricht_Vrijthof_15_BW_2017-08-19_12-06-24.jpg' } ] },
  doha:{ en:'Doha', zh:'多哈', names:['Doha','多哈'], ll:[51.53, 25.29], kind:'capital',
    era:{ en:'WTO approves China’s membership, November 2001', zh:'2001年11月世贸组织批准中国加入' },
    info:{ en:'At a WTO meeting here, members approved China joining the World Trade Organization. China became a member on 11 December 2001.', zh:'在这里召开的世贸组织会议批准中国加入。2001年12月11日，中国正式成为世贸组织成员。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Doha_Skyline_01.jpg/960px-Doha_Skyline_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The skyline of Doha, Qatar', zh:'卡塔尔多哈的城市天际线', credit:'Zairon', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Doha_Skyline_01.jpg' } ] },
  astana:{ en:'Astana', zh:'阿斯塔纳', names:['Astana','阿斯塔纳'], ll:[71.45, 51.17], kind:'capital',
    era:{ en:'Silk Road Economic Belt proposed, 2013', zh:'2013年在这里提出共建“丝绸之路经济带”' },
    info:{ en:'In a speech here in 2013, China proposed building a new “Silk Road Economic Belt” across Asia to Europe — the “Belt” of the Belt and Road.', zh:'2013年，中国在这里的演讲中提出共建横贯亚欧的“丝绸之路经济带”，也就是“一带一路”中的“一带”。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/View_from_Bayterek_tower.jpg/960px-View_from_Bayterek_tower.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Astana seen from the Bayterek tower', zh:'从巴伊杰列克观景塔俯瞰阿斯塔纳', credit:'Ken and Nyetta', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:View_from_Bayterek_tower.jpg' } ] },
  jakarta:{ en:'Jakarta', zh:'雅加达', names:['Jakarta','雅加达'], ll:[106.83, -6.18], kind:'capital',
    era:{ en:'21st-Century Maritime Silk Road proposed, 2013', zh:'2013年在这里提出共建“21世纪海上丝绸之路”' },
    info:{ en:'A month after Astana, China proposed a “21st-Century Maritime Silk Road” in Jakarta — the “Road” of the Belt and Road.', zh:'阿斯塔纳讲话一个月后，中国在雅加达提出共建“21世纪海上丝绸之路”，也就是“一带一路”中的“一路”。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Jakarta_-_National_Monument.jpg/960px-Jakarta_-_National_Monument.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The National Monument (Monas) in Jakarta', zh:'雅加达的民族独立纪念碑', credit:'Indies1', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Jakarta_-_National_Monument.jpg' } ] },
  suez:{ en:'Suez Canal', zh:'苏伊士运河', names:['Suez Canal','苏伊士运河'], ll:[32.55, 30.0], kind:'canal',
    era:{ en:'Opened 1869; blocked by the Ever Given, March 2021', zh:'1869年通航；2021年3月被“长赐号”堵塞' },
    info:{ en:'A 193-km canal joining the Mediterranean and the Red Sea, so ships between Europe and Asia need not sail around Africa. In 2021 one stuck ship held up about 400 others.', zh:'全长193千米的运河，连接地中海和红海，往来欧亚的船只不必再绕过非洲。2021年，一艘搁浅的大船堵住了约400艘船。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Ever_Given_in_Suez_Canal_viewed_from_ISS.jpg/960px-Ever_Given_in_Suez_Canal_viewed_from_ISS.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The giant ship Ever Given stuck in the Suez Canal, seen from the International Space Station, March 2021', zh:'2021年3月从国际空间站看到的搁浅在苏伊士运河里的“长赐号”巨轮', credit:'NASA JSC ISS image library', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Ever_Given_in_Suez_Canal_viewed_from_ISS.jpg' },
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Suez_Canal%2C_Suez%2C_Egypt.jpg/960px-Suez_Canal%2C_Suez%2C_Egypt.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ships in the Suez Canal', zh:'苏伊士运河里的船只', credit:'Vyacheslav Argenberg', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Suez_Canal,_Suez,_Egypt.jpg' } ] },
  panamacanal:{ en:'Panama Canal', zh:'巴拿马运河', names:['Panama Canal','巴拿马运河'], ll:[-79.68, 9.08], kind:'canal',
    era:{ en:'Opened 1914', zh:'1914年通航' },
    info:{ en:'Locks lift ships 26 m up over the hills of Panama and down again, linking the Pacific and the Atlantic. Many ships from Asia to Savannah pass through it.', zh:'船闸把船只抬高26米越过巴拿马的山地，再降下来，从而连通太平洋和大西洋。很多从亚洲开往萨凡纳的船都经过这里。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Panama_Canal_Miraflores_Locks.jpg/960px-Panama_Canal_Miraflores_Locks.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A ship in the Miraflores Locks of the Panama Canal', zh:'巴拿马运河米拉弗洛雷斯船闸中的船', credit:'User:Stan Shebs', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Panama_Canal_Miraflores_Locks.jpg' } ] },
  savannah:{ en:'Port of Savannah', zh:'萨凡纳港', names:['Port of Savannah','萨凡纳港','萨凡纳'], ll:[-81.09, 32.08], kind:'port', subjects:['worldhistory'],
    era:{ en:'One of the busiest container ports in the USA', zh:'美国最繁忙的集装箱港口之一' },
    info:{ en:'Giant ships from Asia unload containers here, and trucks and trains carry the goods on to Atlanta and across the South-East.', zh:'来自亚洲的巨轮在这里卸下集装箱，卡车和火车再把货物运到亚特兰大和美国东南部各地。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Savannah_Harbor%2C_Garden_City_Ocean_Terminal_%288147625003%29.jpg/960px-Savannah_Harbor%2C_Garden_City_Ocean_Terminal_%288147625003%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Container cranes at the Garden City Terminal, Port of Savannah', zh:'萨凡纳港花园城码头的集装箱起重机', credit:'U.S. Army Corps of Engineers Savannah Di', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Savannah_Harbor,_Garden_City_Ocean_Terminal_(8147625003).jpg' } ] },
  losangeles:{ en:'Port of Los Angeles', zh:'洛杉矶港', names:['Port of Los Angeles','洛杉矶港','洛杉矶'], ll:[-118.26, 33.73], kind:'port', subjects:['worldhistory'],
    era:{ en:'Busiest container port in the USA', zh:'美国最繁忙的集装箱港口' },
    info:{ en:'Together with its neighbour Long Beach, it handles a big share of the containers coming into the USA, many of them from China.', zh:'它和相邻的长滩港一起，处理着进入美国的很大一部分集装箱，其中很多来自中国。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Container_ship_NYK_Themis_at_the_Port_of_Los_Angeles.jpg/960px-Container_ship_NYK_Themis_at_the_Port_of_Los_Angeles.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The container ship NYK Themis at the Port of Los Angeles — a gateway for goods from Asia to the US.', zh:'洛杉矶港的“NYK忒弥斯号”集装箱船——亚洲货物进入美国的门户之一。', credit:'Downtowngal', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Container_ship_NYK_Themis_at_the_Port_of_Los_Angeles.jpg' } ] },
  atlanta:{ en:'Atlanta', zh:'亚特兰大', names:['Atlanta, GA','Atlanta','亚特兰大'], ll:[-84.39, 33.75], kind:'capital', subjects:['worldhistory'],
    era:{ en:'Final stop of the phone’s journey in this lesson', zh:'本课中手机旅程的最后一站' },
    info:{ en:'A transport hub of the American South-East with one of the world’s busiest airports. Goods from Savannah reach it by truck in about four hours.', zh:'美国东南部的交通枢纽，拥有世界上最繁忙的机场之一。货物从萨凡纳用卡车运到这里大约要四个小时。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Atlanta_skyline_from_Jackson_Street_Bridge_2020.jpg/960px-Atlanta_skyline_from_Jackson_Street_Bridge_2020.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Atlanta skyline', zh:'亚特兰大的城市天际线', credit:'Marc Merlin', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Atlanta_skyline_from_Jackson_Street_Bridge_2020.jpg' } ] },
  mombasa:{ en:'Mombasa', zh:'蒙巴萨', names:['Mombasa','蒙巴萨'], ll:[39.66, -4.05], kind:'port',
    era:{ en:'East Africa’s biggest port; railway to Nairobi, 2017', zh:'东非最大的港口；2017年通往内罗毕的铁路通车' },
    info:{ en:'Goods for much of East Africa arrive here. A new Chinese-built railway, opened in 2017, links the port to Nairobi.', zh:'东非许多地方的货物都从这里进出。2017年通车的中国承建的新铁路把港口和内罗毕连在一起。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Container_ship_exiting_Mombasa_port.jpg/960px-Container_ship_exiting_Mombasa_port.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A container ship leaving Mombasa, Kenya — East Africa’s biggest port.', zh:'一艘集装箱船驶离肯尼亚蒙巴萨港——东非最大的港口。', credit:'Ian Kiptoo', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Container_ship_exiting_Mombasa_port.jpg' } ] },
  longyangxia:{ en:'Longyangxia', zh:'龙羊峡', names:['Longyangxia','龙羊峡'], ll:[100.92, 36.12], kind:'site',
    era:{ en:'Hydropower dam and giant solar park', zh:'水电站和大型光伏电站' },
    info:{ en:'A dam on the upper Yellow River next to one of the biggest solar parks in the world — millions of panels on the Qinghai plateau.', zh:'黄河上游的水电站大坝旁边，是世界上最大的光伏电站之一——数百万块太阳能板铺在青海高原上。' },
    photos:[
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Longyangxia_solar_2017.jpg/960px-Longyangxia_solar_2017.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A giant solar park beside the Longyangxia Dam in Qinghai, China, seen from a Landsat satellite in 2017 — millions of panels turning sunlight into electricity.', zh:'2017年陆地卫星拍摄的中国青海龙羊峡水电站旁的大型光伏电站——数以百万计的太阳能板把阳光变成电。', credit:'USGS / NASA Landsat', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Longyangxia_solar_2017.jpg' } ] }
});
