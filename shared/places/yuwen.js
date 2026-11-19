/* Place book — 语文 (poems, classical prose, modern essays and the classic novels). Format: see shared/places.js.
   Photos: Wikimedia Commons, free licences. Literary places: kind 'site' + info says what is real and what is imagined.
   Reused from other files (do not add again): fast jinan huoyanshan (china.js) changan luoyang xian dayanta wuhan zhenjiang hangzhou chengdu dunhuang mogao dongting wuxia
   changjiang huanghe yangzhou nanjing beijing shanghai qufu yinxu lanting gugong yiheyuan zhaozhou lugouqiao suzhou taihu greatwall
   qomolangma julu changping dengfeng atlanta (world.js). */
LabGaz.add({
  /* ---- Tang poems ---- */
  taishan:{ en:'Mount Tai', zh:'泰山', names:['泰山','岱宗','Mount Tai','Taishan'], ll:[117.10, 36.26], kind:'mountain',
    era:{ en:'First of the Five Great Mountains; Du Fu’s “Gazing at Mount Tai” (about 736)', zh:'五岳之首；杜甫《望岳》（约736年）' },
    info:{ en:'Mount Tai in Shandong is 1,545 m high. Emperors climbed it to honour Heaven, and Du Fu dreamed of standing on its summit: “一览众山小”.', zh:'泰山在今山东，海拔1545米，古代帝王在这里祭天。杜甫望着它，立志“会当凌绝顶，一览众山小”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Jade_Emperor_Peak_50346-Taishan_%2849055160718%29.jpg/960px-Jade_Emperor_Peak_50346-Taishan_%2849055160718%29.jpg', en:'Jade Emperor Peak, the summit of Mount Tai — the 绝顶 Du Fu dreamed of climbing', zh:'泰山极顶玉皇顶——杜甫“会当凌绝顶”的“绝顶”', credit:'xiquinhosilva', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Jade_Emperor_Peak_50346-Taishan_(49055160718).jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Mount_tai_south_gate_to_heaven_2006_09_1.jpg/960px-Mount_tai_south_gate_to_heaven_2006_09_1.jpg', en:'The South Gate to Heaven high on Mount Tai, at the top of the long stone stairway', zh:'泰山南天门，位于长长的十八盘石阶顶端', credit:'Rolf Müller', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Mount_tai_south_gate_to_heaven_2006_09_1.jpg' } ] },
  qilu:{ en:'Qi and Lu', zh:'齐鲁', names:['齐鲁','Qi and Lu'], ll:[117.6, 36.1], kind:'region',
    today:{ en:'Shandong', zh:'今山东' }, era:{ en:'Two states of the Zhou dynasty', zh:'周代的两个诸侯国' },
    info:{ en:'Qi lay north of Mount Tai and Lu (Confucius’s home state) to the south. Even today Shandong is called 齐鲁 for short.', zh:'齐国在泰山以北，鲁国（孔子的故乡）在泰山以南。今天山东省还常被称为“齐鲁大地”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Mount_tai_south_gate_to_heaven_2006_09_1.jpg/960px-Mount_tai_south_gate_to_heaven_2006_09_1.jpg', en:'Mount Tai, which stood between the old lands of Qi and Lu', zh:'泰山——古代齐、鲁两国就在它的南北两边', credit:'Rolf Müller', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Mount_tai_south_gate_to_heaven_2006_09_1.jpg' } ] },
  juyan:{ en:'Juyan', zh:'居延', names:['居延','Juyan'], ll:[101.07, 41.96], kind:'region',
    today:{ en:'Ejin Banner, Inner Mongolia', zh:'今内蒙古额济纳旗' }, era:{ en:'Han–Tang frontier; Wang Wei passed here in 737', zh:'汉唐边塞；737年王维出使经过这里' },
    info:{ en:'An oasis at the end of the Heihe River, in the desert far to the northwest. Han soldiers guarded it, and more than 10,000 of their wooden writing slips have been dug up here.', zh:'黑河尽头沙漠中的绿洲。汉代士兵在这里守边，这里出土了一万多枚“居延汉简”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Small_Dunes_of_Badain_Jaran_Desert.JPG/960px-Small_Dunes_of_Badain_Jaran_Desert.JPG', en:'Dunes of the Badain Jaran Desert, not far from ancient Juyan — the “great desert” of Wang Wei’s journey', zh:'离古居延不远的巴丹吉林沙漠——想象王维笔下的“大漠”', credit:'Sjoerd van Oort', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Small_Dunes_of_Badain_Jaran_Desert.JPG' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Han_Bamboo_Slips_Discovered_at_Juyan_%2810195000756%29.jpg/960px-Han_Bamboo_Slips_Discovered_at_Juyan_%2810195000756%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Han-dynasty wooden slips found at Juyan — letters and records written by frontier soldiers', zh:'居延出土的汉代简牍——守边士兵留下的文书和记录', credit:'Gary Todd', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Han_Bamboo_Slips_Discovered_at_Juyan_(10195000756).jpg' } ] },
  xiaoguan:{ en:'Xiao Pass', zh:'萧关', names:['萧关','Xiao Pass'], ll:[106.35, 35.95], kind:'pass',
    today:{ en:'southeast of Guyuan, Ningxia', zh:'今宁夏固原东南' }, era:{ en:'Gate on the road from Chang’an to the northwest frontier', zh:'从长安通往西北边塞的关口' },
    info:{ en:'A pass guarding the way from the northwest into the Chang’an plain. In Wang Wei’s poem he meets a mounted scout here.', zh:'守卫关中西北门户的关口。王维在诗里写“萧关逢候骑”，在这里遇到了侦察的骑兵。' } },
  yanran:{ en:'Mount Yanran', zh:'燕然山', names:['燕然山','燕然','Mount Yanran','Yanran'], ll:[100.5, 47.3], kind:'mountain', base:'world',
    today:{ en:'the Khangai Mountains, Mongolia', zh:'今蒙古国杭爱山' }, era:{ en:'Han victory inscription, 89 CE', zh:'公元89年东汉刻石记功' },
    info:{ en:'In 89 CE the Han general Dou Xian beat the Xiongnu and carved a record of victory on a cliff — 勒石燕然. Archaeologists found that inscription in Mongolia in 2017.', zh:'公元89年，东汉窦宪大破匈奴，在山崖上刻石记功，这就是“燕然勒石”。2017年，中蒙考古学家在蒙古国找到了这块摩崖石刻。' },
    photos:[ 
      { src:'https://upload.wikimedia.org/wikipedia/commons/d/d5/Mont_erkhet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled', en:'Mount Erkhet (3,535 m) in the Khangai Mountains, Mongolia', zh:'蒙古国杭爱山脉的额尔赫特峰（海拔3535米）', credit:'Imartin6', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Mont_erkhet.jpg' } ] },
  huanghelou:{ en:'Yellow Crane Tower', zh:'黄鹤楼', names:['黄鹤楼','Yellow Crane Tower'], ll:[114.302, 30.546], kind:'building',
    today:{ en:'Snake Hill, Wuchang, Wuhan', zh:'今湖北武汉武昌蛇山' }, era:{ en:'Cui Hao’s poem (8th century); rebuilt 1985', zh:'崔颢《黄鹤楼》（盛唐）；1985年重建' },
    info:{ en:'A tower on Snake Hill above the Yangtze, first built about 1,800 years ago. Legend says an immortal flew away from it on a yellow crane.', zh:'黄鹤楼在长江边的蛇山上，始建于约一千八百年前的三国时期。传说有仙人在这里乘黄鹤飞去。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/CN_-_Hubei_-_Wuhan_-_Kranichpagode.jpg/960px-CN_-_Hubei_-_Wuhan_-_Kranichpagode.jpg', en:'The Yellow Crane Tower in Wuhan today (rebuilt 1985)', zh:'今天的武汉黄鹤楼（1985年重建）', credit:'MonsieurRoi', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:CN_-_Hubei_-_Wuhan_-_Kranichpagode.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Wuhan%2C_Viewed_from_Yellow_Crane_Tower_3_%28G._Todd%29_-_Flickr.jpg/960px-Wuhan%2C_Viewed_from_Yellow_Crane_Tower_3_%28G._Todd%29_-_Flickr.jpg', en:'The view from the Yellow Crane Tower over the Yangtze and Wuhan', zh:'从黄鹤楼上俯瞰长江和武汉', credit:'Gary Todd', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Wuhan,_Viewed_from_Yellow_Crane_Tower_3_(G._Todd)_-_Flickr.jpg' } ] },
  hanyangcheng:{ en:'Hanyang', zh:'汉阳', names:['汉阳','Hanyang'], ll:[114.27, 30.555], kind:'city',
    today:{ en:'Hanyang District, Wuhan', zh:'今湖北武汉汉阳' }, era:{ en:'“晴川历历汉阳树” — Cui Hao’s view across the river', zh:'崔颢“晴川历历汉阳树”' },
    info:{ en:'Hanyang lies across the Yangtze from the Yellow Crane Tower. Its Qingchuan Pavilion (晴川阁) is named after Cui Hao’s line about the sunlit river.', zh:'汉阳在黄鹤楼对岸，是武汉三镇之一。江边的晴川阁，名字就取自崔颢的“晴川历历汉阳树”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Qingchuan_Pavilion%2C_Hubei%2C_China.jpg/960px-Qingchuan_Pavilion%2C_Hubei%2C_China.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Qingchuan Pavilion in Hanyang, named after Cui Hao’s line “晴川历历汉阳树”', zh:'汉阳晴川阁，名字取自崔颢的“晴川历历汉阳树”', credit:'Sherbet', license:'CC BY 2.5', page:'https://commons.wikimedia.org/wiki/File:Qingchuan_Pavilion,_Hubei,_China.jpg' } ] },
  yingwuzhou:{ en:'Parrot Isle', zh:'鹦鹉洲', names:['鹦鹉洲','Parrot Isle','Yingwuzhou'], ll:[114.262, 30.528], kind:'site',
    today:{ en:'Hanyang, Wuhan', zh:'今湖北武汉汉阳' }, era:{ en:'“芳草萋萋鹦鹉洲” (Cui Hao)', zh:'崔颢“芳草萋萋鹦鹉洲”' },
    info:{ en:'A grassy island in the Yangtze, named after a Han-dynasty poem about a parrot. The old island was washed away; a new sandbank by Hanyang took its name.', zh:'长江中的沙洲，因东汉祢衡的《鹦鹉赋》得名。古鹦鹉洲后来被江水冲没，今天汉阳江边的鹦鹉洲是后来淤积成的。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Yingwuzhou_Yangtze_River_Bridge1.JPG/960px-Yingwuzhou_Yangtze_River_Bridge1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Yingwuzhou Yangtze River Bridge in Wuhan, named after Parrot Isle', zh:'武汉鹦鹉洲长江大桥，因鹦鹉洲得名', credit:'Glabb', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Yingwuzhou_Yangtze_River_Bridge1.JPG' } ] },
  yueyanglou:{ en:'Yueyang Tower', zh:'岳阳楼', names:['岳阳楼','Yueyang Tower'], ll:[113.094, 29.385], kind:'building',
    today:{ en:'Yueyang, Hunan', zh:'今湖南岳阳' }, era:{ en:'Rebuilt by Teng Zijing in 1045; Fan Zhongyan’s essay, 1046', zh:'1045年滕子京重修；1046年范仲淹作《岳阳楼记》' },
    info:{ en:'A three-storey wooden tower on the city wall above Dongting Lake. Fan Zhongyan wrote “先天下之忧而忧，后天下之乐而乐” for it — without ever climbing it himself.', zh:'岳阳楼建在岳阳城墙上，俯瞰洞庭湖，是三层木结构的楼阁。范仲淹应滕子京之请写下《岳阳楼记》：“先天下之忧而忧，后天下之乐而乐。”' },
    photos:[ 
      { src:'https://upload.wikimedia.org/wikipedia/commons/1/1b/Frontal_view_of_Yueyang_Tower%2C_Hunan%2C_China1.jpg', en:'Yueyang Tower on the shore of Dongting Lake', zh:'濒临洞庭湖的岳阳楼', credit:'Huangdan2060', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Frontal_view_of_Yueyang_Tower,_Hunan,_China1.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Yueyang_Tower_in_1804.jpg/960px-Yueyang_Tower_in_1804.jpg', en:'Yueyang Tower in the county gazetteer of Baling, 1804 (Qing dynasty)', zh:'清嘉庆九年（1804年）《巴陵县志》中的岳阳楼图', credit:'Chen Yuyuan, Zhuang Shengwu', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Yueyang_Tower_in_1804.jpg' } ] },
  tengwangge:{ en:'Prince Teng’s Pavilion', zh:'滕王阁', names:['滕王阁','Prince Teng’s Pavilion','Tengwang Pavilion'], ll:[115.880, 28.684], kind:'building',
    today:{ en:'Nanchang, Jiangxi', zh:'今江西南昌' }, era:{ en:'Built 653; Wang Bo’s preface, 675; rebuilt 1989', zh:'653年始建；王勃作《滕王阁序》；1989年重建' },
    info:{ en:'One of the “three great towers south of the Yangtze”, with the Yellow Crane Tower and Yueyang Tower. The young poet Wang Bo made it famous.', zh:'江南三大名楼之一（另两座是黄鹤楼、岳阳楼）。唐代王勃的《滕王阁序》让它名扬天下。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Tengwang_pavilion_sunset.jpg/960px-Tengwang_pavilion_sunset.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Prince Teng’s Pavilion by the Gan River at sunset', zh:'夕阳下赣江边的滕王阁', credit:'UserAlbert', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Tengwang_pavilion_sunset.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Pavilion_of_Prince_Teng_2023021301.jpg/960px-Pavilion_of_Prince_Teng_2023021301.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Prince Teng’s Pavilion, Nanchang, rebuilt in 1989', zh:'南昌滕王阁（1989年重建）', credit:'Huangdan2060', license:'CC BY 4.0', page:'https://commons.wikimedia.org/wiki/File:Pavilion_of_Prince_Teng_2023021301.jpg' } ] },
  beigushan:{ en:'Beigu Mountain', zh:'北固山', names:['北固山','北固亭','Beigu Mountain'], ll:[119.478, 32.219], kind:'mountain',
    today:{ en:'Zhenjiang, Jiangsu', zh:'今江苏镇江' }, era:{ en:'Wang Wan moored here (Tang); Xin Qiji’s ci (Southern Song)', zh:'王湾《次北固山下》；辛弃疾登京口北固亭' },
    info:{ en:'A hill on the south bank of the Yangtze at Zhenjiang, where the river widens towards the sea. Wang Wan’s boat stopped below it at the turn of the year.', zh:'北固山在镇江的长江南岸，江面在这里变得开阔。王湾年末乘船东行，停泊在北固山下。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/%E5%8C%97%E5%9B%BA%E5%B1%B1_-_Beigu_Mountain_-_2015.04_-_panoramio.jpg/960px-%E5%8C%97%E5%9B%BA%E5%B1%B1_-_Beigu_Mountain_-_2015.04_-_panoramio.jpg', en:'Beigu Mountain in Zhenjiang, on the Yangtze', zh:'长江边的镇江北固山', credit:'rheins', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:%E5%8C%97%E5%9B%BA%E5%B1%B1_-_Beigu_Mountain_-_2015.04_-_panoramio.jpg' } ] },
  xihu:{ en:'West Lake', zh:'西湖', names:['西湖','钱塘湖','West Lake','Qiantang Lake'], ll:[120.145, 30.245], kind:'lake',
    today:{ en:'Hangzhou, Zhejiang', zh:'今浙江杭州' }, era:{ en:'Called Qiantang Lake in the Tang; World Heritage site (2011)', zh:'唐代称钱塘湖；世界文化遗产（2011年）' },
    info:{ en:'Bai Juyi (822–824) and Su Shi (1089–1091) both governed Hangzhou, wrote poems about the lake and built dykes — the Bai and Su Causeways carry their names.', zh:'白居易、苏轼都在杭州做过官，为西湖写诗，还修堤治水。湖上的白堤、苏堤就是用他们的姓命名的。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Hangzhou_China_West_Lake_2.jpg/960px-Hangzhou_China_West_Lake_2.jpg', en:'West Lake in Hangzhou — Bai Juyi’s “Qiantang Lake”', zh:'杭州西湖——白居易笔下的“钱塘湖”', credit:'Circa24', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Hangzhou_China_West_Lake_2.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/20260424_West_Lake_and_Hangzhou_Skyline.jpg/960px-20260424_West_Lake_and_Hangzhou_Skyline.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'West Lake and modern Hangzhou', zh:'西湖与今天的杭州城', credit:'Windmemories', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:20260424_West_Lake_and_Hangzhou_Skyline.jpg' } ] },
  gushan:{ en:'Gushan Island', zh:'孤山', names:['孤山寺','孤山','Gushan Temple','Gushan'], ll:[120.140, 30.258], kind:'mountain',
    today:{ en:'West Lake, Hangzhou', zh:'今杭州西湖' }, era:{ en:'“孤山寺北贾亭西” — where Bai Juyi’s walk begins', zh:'白居易“孤山寺北贾亭西”' },
    info:{ en:'The biggest island in West Lake, a small hill joined to the shore by the Bai Causeway. The Tang temple is gone; today there are gardens and a museum.', zh:'西湖中最大的岛，是一座小山，由白堤和岸边相连。唐代的孤山寺已经不在了，今天岛上有公园和博物馆。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Huayanjing_Pagoda_%28%E5%8D%8E%E4%B8%A5%E7%BB%8F%E5%A1%94%29_on_Gushan%2C_Hangzhou.jpg/960px-Huayanjing_Pagoda_%28%E5%8D%8E%E4%B8%A5%E7%BB%8F%E5%A1%94%29_on_Gushan%2C_Hangzhou.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A stone pagoda on Gushan, the island hill in West Lake', zh:'西湖孤山上的华严经塔', credit:'jaaron', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Huayanjing_Pagoda_(%E5%8D%8E%E4%B8%A5%E7%BB%8F%E5%A1%94)_on_Gushan,_Hangzhou.jpg' } ] },
  baiti:{ en:'Bai Causeway', zh:'白堤', names:['白沙堤','白堤','Bai Causeway'], ll:[120.150, 30.259], kind:'site',
    today:{ en:'West Lake, Hangzhou', zh:'今杭州西湖' }, era:{ en:'The “white sand dyke” of Bai Juyi’s poem (about 823)', zh:'白居易笔下的“白沙堤”（约823年）' },
    info:{ en:'A 1 km dyke lined with willows, from the Broken Bridge to Gushan. It was already there in Bai Juyi’s time; later people named it after him because he loved it so much.', zh:'从断桥到孤山、长约1千米的长堤，堤上桃柳成行。白居易来之前它就有了，后人为纪念这位喜爱西湖的诗人，称它“白堤”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/West_Lake_2025.06_01.jpg/960px-West_Lake_2025.06_01.jpg', en:'The Bai Causeway, lined with willows: “绿杨阴里白沙堤”', zh:'西湖白堤，垂柳成行：“绿杨阴里白沙堤”', credit:'Shujianyang', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:West_Lake_2025.06_01.jpg' } ] },
  suti:{ en:'Su Causeway', zh:'苏堤', names:['苏堤','Su Causeway'], ll:[120.139, 30.245], kind:'site',
    today:{ en:'West Lake, Hangzhou', zh:'今杭州西湖' }, era:{ en:'Built by Su Shi in 1090', zh:'1090年苏轼主持修筑' },
    info:{ en:'Su Shi dug the weeds and mud out of West Lake and piled them into this 2.8 km causeway with six bridges. “Spring dawn on the Su Causeway” is one of the lake’s Ten Views.', zh:'苏轼疏浚西湖，用挖出的葑草和淤泥筑成这条长约2.8千米、有六座桥的长堤。“苏堤春晓”是西湖十景之一。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Su_Causeway_%2839796928005%29.jpg/960px-Su_Causeway_%2839796928005%29.jpg', en:'The Su Causeway on West Lake, built when Su Shi governed Hangzhou', zh:'西湖苏堤，苏轼任杭州知州时修筑', credit:'David Stanley', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Su_Causeway_(39796928005).jpg' } ] },
  longbiao:{ en:'Longbiao', zh:'龙标', names:['龙标','Longbiao'], ll:[109.83, 27.20], kind:'city',
    today:{ en:'Hongjiang, Hunan', zh:'今湖南洪江' }, era:{ en:'Where Wang Changling was demoted (about 748)', zh:'约748年王昌龄被贬为龙标尉' },
    info:{ en:'A remote town in the hills of western Hunan. When Li Bai heard his friend Wang Changling was sent here, he “sent his worried heart to the moon”.', zh:'龙标在湘西的群山之中，十分偏远。李白听说好友王昌龄被贬到这里，写诗“我寄愁心与明月”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/%E8%B5%A4%E5%B3%B0%E5%A1%94%E5%92%8C%E9%BB%94%E5%9F%8E%E6%B2%85%E6%B1%9F%E5%A4%A7%E6%A1%A5.jpg/960px-%E8%B5%A4%E5%B3%B0%E5%A1%94%E5%92%8C%E9%BB%94%E5%9F%8E%E6%B2%85%E6%B1%9F%E5%A4%A7%E6%A1%A5.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The old town of Qiancheng (Longbiao) on the Yuan River, Hongjiang', zh:'洪江黔城（古龙标）外的沅江与赤峰塔', credit:'三猎', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:%E8%B5%A4%E5%B3%B0%E5%A1%94%E5%92%8C%E9%BB%94%E5%9F%8E%E6%B2%85%E6%B1%9F%E5%A4%A7%E6%A1%A5.jpg' } ] },
  wuxi5:{ en:'Five Streams', zh:'五溪', names:['五溪','Five Streams'], ll:[109.9, 28.0], kind:'river',
    today:{ en:'western Hunan and eastern Guizhou', zh:'今湘西、黔东一带' }, era:{ en:'“闻道龙标过五溪” (Li Bai)', zh:'李白“闻道龙标过五溪”' },
    info:{ en:'Five mountain streams that flow into the Yuan River. Crossing all five shows how far from home Wang Changling had to go.', zh:'流入沅江的五条溪流。要过五溪才能到龙标，可见贬地多么偏远。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Yuan_River_in_Yuanling_County_of_Huaihua%2C_Hunan%2C_picture2.jpg/960px-Yuan_River_in_Yuanling_County_of_Huaihua%2C_Hunan%2C_picture2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Yuan River in western Hunan, where the “Five Streams” flow together', zh:'湘西的沅江——“五溪”就汇入这条江', credit:'Huangdan2060', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Yuan_River_in_Yuanling_County_of_Huaihua,_Hunan,_picture2.jpg' } ] },
  yelang:{ en:'Yelang', zh:'夜郎', names:['夜郎','Yelang'], ll:[109.2, 27.4], kind:'region',
    today:{ en:'the western Hunan – eastern Guizhou area', zh:'今湘西、黔东一带' }, era:{ en:'An ancient kingdom; a Tang county', zh:'古国名，唐代设夜郎县' },
    info:{ en:'Yelang was an ancient kingdom in the southwest (the idiom 夜郎自大 comes from it); the Tang county of Yelang lay near Longbiao. Li Bai’s moon will follow his friend even “west of Yelang”.', zh:'夜郎原是西南的古国（成语“夜郎自大”就出自这里），唐代在龙标附近设夜郎县。李白要让明月一直陪友人到“夜郎西”。' } },
  dufucaotang:{ en:'Du Fu Thatched Cottage', zh:'杜甫草堂', names:['杜甫草堂','Du Fu Thatched Cottage'], ll:[104.034, 30.662], kind:'site',
    today:{ en:'Chengdu, Sichuan', zh:'今四川成都' }, era:{ en:'Du Fu’s home 759–765', zh:'759—765年间杜甫在这里居住' },
    info:{ en:'After years of war Du Fu built a thatched hut here and wrote about 240 poems, including the one about the autumn wind tearing off his roof (茅屋为秋风所破歌).', zh:'杜甫经历战乱后在成都浣花溪边建茅屋居住，写下二百四十多首诗，《茅屋为秋风所破歌》就写在这里。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Entry_-_Du_Fu_Thatched_Cottage_-_Chengdu%2C_Sichuan%2C_China_-_DSC04875.jpg/960px-Entry_-_Du_Fu_Thatched_Cottage_-_Chengdu%2C_Sichuan%2C_China_-_DSC04875.jpg', en:'Entrance to Du Fu Thatched Cottage, Chengdu — today a museum', zh:'成都杜甫草堂入口，今为博物馆', credit:'Daderot', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Entry_-_Du_Fu_Thatched_Cottage_-_Chengdu,_Sichuan,_China_-_DSC04875.jpg' } ] },

  /* ---- Song ci ---- */
  mizhou:{ en:'Mizhou', zh:'密州', names:['密州','Mizhou'], ll:[119.41, 35.99], kind:'city',
    today:{ en:'Zhucheng, Shandong', zh:'今山东诸城' }, era:{ en:'Su Shi was governor here, 1074–1076', zh:'1074—1076年苏轼任密州知州' },
    info:{ en:'Here Su Shi led the hunt of 《江城子·密州出猎》 (1075) and, on the Chaoran Terrace he rebuilt, wrote 《水调歌头》 for his brother at Mid-Autumn 1076.', zh:'苏轼在密州写下《江城子·密州出猎》（1075年），又在他修葺的超然台上，于1076年中秋写下怀念弟弟的《水调歌头》。' } },
  yanzhou:{ en:'Yanzhou', zh:'延州', names:['延州','Yanzhou'], ll:[109.49, 36.59], kind:'city', subjects:['yuwen'],
    today:{ en:'Yan’an, Shaanxi', zh:'今陕西延安' }, era:{ en:'Fan Zhongyan’s frontier command against Western Xia, 1040', zh:'1040年范仲淹在这里主持抵御西夏' },
    info:{ en:'A Song fortress city on the Loess Plateau facing the Western Xia. Fan Zhongyan’s 《渔家傲·秋思》 shows the soldiers’ lonely autumn here.', zh:'北宋在黄土高原上抵御西夏的边城。范仲淹的《渔家傲·秋思》写的就是这里将士的边塞秋景。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/%E5%BB%B6%E5%AE%89%E5%AE%9D%E5%A1%94.jpg/960px-%E5%BB%B6%E5%AE%89%E5%AE%9D%E5%A1%94.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The pagoda on Baota Hill above the Yan River, Yan’an', zh:'延安城边宝塔山上的宝塔', credit:'Sunatnight', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:%E5%BB%B6%E5%AE%89%E5%AE%9D%E5%A1%94.jpg' } ] },
  huiyanfeng:{ en:'Huiyan Peak, Hengyang', zh:'衡阳回雁峰', names:['回雁峰','衡阳','Hengyang','Huiyan Peak'], ll:[112.61, 26.88], kind:'mountain',
    today:{ en:'Hengyang, Hunan', zh:'今湖南衡阳' }, era:{ en:'Where geese were said to stop flying south', zh:'传说大雁南飞到这里为止' },
    info:{ en:'The first of the 72 peaks of Mount Heng. Legend says wild geese flying south go no further — so in 衡阳雁去 the geese go home, but the soldiers cannot.', zh:'南岳衡山七十二峰的第一峰。传说大雁南飞到回雁峰就不再往南。“衡阳雁去无留意”：大雁走了，将士却回不了家。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Huiyanfeng_20170210_08.jpg/960px-Huiyanfeng_20170210_08.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Huiyan Peak Park in Hengyang, Hunan', zh:'湖南衡阳回雁峰公园', credit:'凡尔礼', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Huiyanfeng_20170210_08.jpg' } ] },
  yunzhong:{ en:'Yunzhong', zh:'云中郡', names:['云中郡','Yunzhong'], ll:[111.25, 40.30], kind:'region',
    today:{ en:'around Togtoh, Inner Mongolia', zh:'今内蒙古托克托一带' }, era:{ en:'Han frontier commandery', zh:'汉代边郡' },
    info:{ en:'The general Wei Shang guarded Yunzhong against the Xiongnu; the emperor sent Feng Tang to pardon him. Su Shi’s “持节云中” hopes the court will call him back the same way.', zh:'汉代魏尚任云中太守抵御匈奴，汉文帝派冯唐持节赦免他。苏轼用这个典故，希望朝廷也能重新任用自己。' } },
  dongpochibi:{ en:'Dongpo Red Cliff, Huangzhou', zh:'黄州东坡赤壁', names:['东坡赤壁','黄州赤壁','赤壁怀古','赤壁赋','黄州','Huangzhou','Dongpo Red Cliff'], ll:[114.86, 30.46], kind:'site',
    today:{ en:'Huanggang, Hubei', zh:'今湖北黄冈' }, era:{ en:'Su Shi in exile here, 1080–1084', zh:'1080—1084年苏轼被贬黄州' },
    info:{ en:'Su Shi wrote 《念奴娇·赤壁怀古》, the two Red Cliff rhapsodies and 《记承天寺夜游》 here. This is <b>not</b> the battlefield of 208 (that is in today’s Chibi City, upstream) — Su Shi himself wrote “人道是” (people say…).', zh:'苏轼被贬黄州期间，在这里写下《念奴娇·赤壁怀古》、前后《赤壁赋》和《记承天寺夜游》。这里<b>不是</b>赤壁之战的战场（战场在上游的今湖北赤壁市），所以苏轼说“人道是”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/%E4%B8%9C%E5%9D%A1%E8%B5%A4%E5%A3%81%E5%BB%BA%E7%AD%91%E7%BE%A4.JPG/960px-%E4%B8%9C%E5%9D%A1%E8%B5%A4%E5%A3%81%E5%BB%BA%E7%AD%91%E7%BE%A4.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Dongpo Red Cliff in Huanggang, Hubei, where Su Shi wrote about the Red Cliff', zh:'湖北黄冈东坡赤壁，苏轼在这里写下赤壁诗文', credit:'北纬向南', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:%E4%B8%9C%E5%9D%A1%E8%B5%A4%E5%A3%81%E5%BB%BA%E7%AD%91%E7%BE%A4.JPG' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Su_shi-calligraphy.jpg/960px-Su_shi-calligraphy.jpg', en:'Su Shi’s “Cold Food Observance” scroll (寒食帖), written in Huangzhou in 1082', zh:'苏轼在黄州写的《寒食帖》（1082年）局部', credit:'Su Shi (National Palace Museum, Taipei)', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Su_shi-calligraphy.jpg' } ] },
  zhangqiu:{ en:'Zhangqiu, Jinan', zh:'济南章丘', names:['章丘','Zhangqiu'], ll:[117.53, 36.70], kind:'city',
    today:{ en:'Zhangqiu District, Jinan, Shandong', zh:'今山东济南章丘区' }, era:{ en:'Li Qingzhao’s home town (born 1084)', zh:'李清照的家乡（1084年生）' },
    info:{ en:'Li Qingzhao, the greatest woman poet of the Song, grew up here among springs, streams and lotus ponds — like the lotus flowers she rowed into in 《如梦令》.', zh:'宋代女词人李清照的家乡，泉水多、荷塘多。《如梦令》里“误入藕花深处”的情景，就让人想起这样的水乡。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/%E6%9D%8E%E6%B8%85%E7%85%A7%E5%A1%91%E5%83%8F.jpg/960px-%E6%9D%8E%E6%B8%85%E7%85%A7%E5%A1%91%E5%83%8F.jpg', en:'A statue of Li Qingzhao in Zhangqiu, her home town', zh:'章丘的李清照塑像', credit:'Vitsuha', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:%E6%9D%8E%E6%B8%85%E7%85%A7%E5%A1%91%E5%83%8F.jpg' } ] },

  /* ---- classical prose ---- */
  wuling:{ en:'Wuling', zh:'武陵', names:['武陵','Wuling'], ll:[111.70, 29.03], kind:'region', subjects:['yuwen'],
    today:{ en:'Changde, Hunan', zh:'今湖南常德一带' }, era:{ en:'A commandery of the Jin dynasty', zh:'晋代的郡名' },
    info:{ en:'The fisherman of 《桃花源记》 came from Wuling, by the Yuan River. Tao Yuanming chose a real place to start an imaginary journey.', zh:'《桃花源记》里的渔人是武陵人，武陵在沅江边。陶渊明从一个真实的地方开始，写了一次想象中的旅行。' } },
  taohuayuan:{ en:'Peach Blossom Spring (scenic area)', zh:'桃花源', names:['桃花源','Peach Blossom Spring'], ll:[111.45, 28.78], kind:'site', subjects:['yuwen'],
    today:{ en:'Taoyuan County, Changde, Hunan', zh:'今湖南常德桃源县' }, era:{ en:'Tao Yuanming’s story, about 421', zh:'陶渊明《桃花源记》（约421年）' },
    info:{ en:'The Peach Blossom Spring of the story is imaginary — nobody could find it again. This scenic area in Taoyuan County was named after it, and people have built temples and pavilions here for over a thousand years.', zh:'文中的桃花源是陶渊明虚构的理想社会，“后遂无问津者”。湖南常德桃源县的桃花源是后人依照文章命名的景区，一千多年来不断修建亭台庙宇。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/%E6%98%8E-%E6%B8%85_%E5%BC%B5%E5%AE%8F_%E6%A1%83%E6%BA%90%E5%8B%9D%E6%A6%82%E5%9C%96_%E5%8D%B7-Peach_Blossom_Spring_MET_S_L_4_2007_1_1_sec01.jpg/960px-%E6%98%8E-%E6%B8%85_%E5%BC%B5%E5%AE%8F_%E6%A1%83%E6%BA%90%E5%8B%9D%E6%A6%82%E5%9C%96_%E5%8D%B7-Peach_Blossom_Spring_MET_S_L_4_2007_1_1_sec01.jpg', en:'“Peach Blossom Spring”, a handscroll by Zhang Hong, 1638 — how a Ming painter imagined it', zh:'明代张宏《桃源胜概图》卷（1638年）——画家想象中的桃花源', credit:'Zhang Hong / The Met', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:%E6%98%8E-%E6%B8%85_%E5%BC%B5%E5%AE%8F_%E6%A1%83%E6%BA%90%E5%8B%9D%E6%A6%82%E5%9C%96_%E5%8D%B7-Peach_Blossom_Spring_MET_S_L_4_2007_1_1_sec01.jpg' } ] },
  nanyang:{ en:'Nanyang', zh:'南阳', names:['南阳','Nanyang'], ll:[112.53, 33.00], kind:'city',
    today:{ en:'Nanyang, Henan', zh:'今河南南阳' },
    info:{ en:'An old city in Henan: the hermit Liu Ziji of 《桃花源记》 came from here, and Zhuge Liang farmed here before Liu Bei visited him three times (三顾茅庐).', zh:'河南的古城。《桃花源记》里的隐士刘子骥是南阳人；诸葛亮出山前也“躬耕于南阳”，刘备三顾茅庐请他出山。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Wolong_Hill.jpg/960px-Wolong_Hill.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Wolonggang in Nanyang, Henan — said to be where Liu Bei visited Zhuge Liang three times', zh:'河南南阳卧龙岗——相传刘备在这里三顾茅庐', credit:'Gary Todd', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Wolong_Hill.jpg' } ] },
  yongzhou:{ en:'Yongzhou', zh:'永州', names:['永州','Yongzhou'], ll:[111.61, 26.22], kind:'city',
    today:{ en:'Yongzhou, Hunan', zh:'今湖南永州' }, era:{ en:'Liu Zongyuan in exile here, 805–815', zh:'805—815年柳宗元被贬永州' },
    info:{ en:'A remote place in southern Hunan in the Tang. During ten years of exile Liu Zongyuan explored its hills and streams and wrote the “Eight Records of Yongzhou” (永州八记).', zh:'唐代的永州偏僻荒凉。柳宗元被贬到这里十年，游山玩水，写下“永州八记”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Xiang_River%2C_Yongzhou%2C_Hunan%2C_China%2C_14_July_2019a.jpg/960px-Xiang_River%2C_Yongzhou%2C_Hunan%2C_China%2C_14_July_2019a.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Xiang River at Yongzhou', zh:'永州的湘江', credit:'Huangdan2060', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:Xiang_River,_Yongzhou,_Hunan,_China,_14_July_2019a.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Gate_of_Liuzi_Temple1.jpg/960px-Gate_of_Liuzi_Temple1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Gate of the Liuzi Temple in Lingling, Yongzhou, built in memory of Liu Zongyuan', zh:'永州零陵的柳子庙，为纪念柳宗元而建', credit:'Huangdan2060', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Gate_of_Liuzi_Temple1.jpg' } ] },
  xiaoshitan:{ en:'Little Stone Pool', zh:'小石潭', names:['小石潭','Little Stone Pool'], ll:[111.598, 26.225], kind:'site',
    today:{ en:'Lingling, Yongzhou, Hunan', zh:'今湖南永州零陵' }, era:{ en:'Liu Zongyuan’s 《小石潭记》 (809)', zh:'柳宗元《小石潭记》（809年）' },
    info:{ en:'A small pool on the Yu Stream (愚溪) west of old Yongzhou, with a rock bottom and fish that seem to “float in the air”. A small pool there is shown to visitors as the one in the essay.', zh:'在永州城西的愚溪边，潭底是一整块石头，鱼儿“皆若空游无所依”。今天愚溪边有一处小石潭供人游览。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Gate_of_Liuzi_Temple2.jpg/960px-Gate_of_Liuzi_Temple2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Liuzi Temple on the Yu Stream in Yongzhou, close to the Little Stone Pool', zh:'永州愚溪边的柳子庙，离小石潭不远', credit:'Huangdan2060', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Gate_of_Liuzi_Temple2.jpg' } ] },
  xiaoxiang:{ en:'Xiao and Xiang Rivers', zh:'潇湘', names:['潇湘','潇水','Xiao and Xiang'], ll:[111.64, 26.25], kind:'river',
    today:{ en:'where the Xiao meets the Xiang, Yongzhou, Hunan', zh:'今湖南永州潇水、湘江汇合处' },
    info:{ en:'The Xiao River joins the Xiang at Yongzhou; the Xiang then flows north into Dongting Lake. In poems 潇湘 means the lands of southern Hunan — “南极潇湘”.', zh:'潇水在永州汇入湘江，湘江再向北流入洞庭湖。诗文里的“潇湘”泛指湖南南部，《岳阳楼记》说洞庭湖“南极潇湘”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Hunan_Yongzhou_Xiaoshui_close_to_Liuzi_Temple.jpg/960px-Hunan_Yongzhou_Xiaoshui_close_to_Liuzi_Temple.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Xiao River at Yongzhou, near the Liuzi Temple', zh:'永州柳子庙附近的潇水', credit:'Wahsaw', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Hunan_Yongzhou_Xiaoshui_close_to_Liuzi_Temple.jpg' } ] },
  yueyang:{ en:'Baling (Yueyang)', zh:'巴陵郡', names:['巴陵郡','巴陵','岳阳','Baling','Yueyang'], ll:[113.13, 29.36], kind:'city',
    today:{ en:'Yueyang, Hunan', zh:'今湖南岳阳' }, era:{ en:'Teng Zijing was sent here in 1044', zh:'1044年滕子京“谪守巴陵郡”' },
    info:{ en:'A city where Dongting Lake meets the Yangtze. Demoted official Teng Zijing governed it so well that “政通人和” — and rebuilt its tower.', zh:'洞庭湖与长江交汇处的城市。被贬的滕子京在这里治理得“政通人和，百废具兴”，并重修了岳阳楼。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Yueyang_Tower_in_1804.jpg/960px-Yueyang_Tower_in_1804.jpg', en:'Yueyang Tower in the county gazetteer of Baling, 1804 (Qing dynasty)', zh:'清嘉庆九年（1804年）《巴陵县志》中的岳阳楼图', credit:'Chen Yuyuan, Zhuang Shengwu', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Yueyang_Tower_in_1804.jpg' } ] },
  junshan:{ en:'Junshan Island', zh:'君山', names:['君山岛','君山','Junshan'], ll:[113.00, 29.38], kind:'mountain',
    today:{ en:'Dongting Lake, Yueyang, Hunan', zh:'今湖南岳阳洞庭湖中' }, era:{ en:'“衔远山” — the distant hill held in the lake’s mouth', zh:'《岳阳楼记》“衔远山”' },
    info:{ en:'A small island in Dongting Lake opposite Yueyang Tower — the “distant mountain” the lake holds in its mouth. Liu Yuxi compared it to a green snail on a silver plate.', zh:'洞庭湖中与岳阳楼遥遥相对的小岛，就是“衔远山”的“远山”。刘禹锡把它比作“白银盘里一青螺”。' } },
  chuzhou:{ en:'Chuzhou', zh:'滁州', names:['滁州','Chuzhou'], ll:[118.32, 32.30], kind:'city',
    today:{ en:'Chuzhou, Anhui', zh:'今安徽滁州' }, era:{ en:'Ouyang Xiu was governor here, 1045–1048', zh:'1045—1048年欧阳修任滁州知州' },
    info:{ en:'“环滁皆山也” — the city is ringed by hills. Ouyang Xiu, demoted here at about 40, called himself the Old Drunkard and shared his joy with the people.', zh:'“环滁皆山也”，滁州城四面环山。欧阳修四十岁左右被贬到这里，自号“醉翁”，与民同乐。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/%E7%90%85%E7%90%8A%E5%B1%B14.jpg/960px-%E7%90%85%E7%90%8A%E5%B1%B14.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The wooded hills that ring Chuzhou — “环滁皆山也”', zh:'环绕滁州的青山——“环滁皆山也”', credit:'三猎', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:%E7%90%85%E7%90%8A%E5%B1%B14.jpg' } ] },
  langya:{ en:'Mount Langya', zh:'琅琊山', names:['琅琊山','琅琊','Mount Langya','Langya'], ll:[118.262, 32.292], kind:'mountain',
    today:{ en:'southwest of Chuzhou, Anhui', zh:'今安徽滁州西南' },
    info:{ en:'Wooded hills just southwest of Chuzhou — “蔚然而深秀者，琅琊也”. The Niang Spring and the Old Drunkard’s Pavilion are in its valleys.', zh:'滁州西南的山，“望之蔚然而深秀者，琅琊也”。酿泉和醉翁亭都在山中。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/%E7%90%85%E7%90%8A%E5%B1%B11.jpg/960px-%E7%90%85%E7%90%8A%E5%B1%B11.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Mount Langya, Chuzhou, Anhui', zh:'安徽滁州琅琊山', credit:'三猎', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:%E7%90%85%E7%90%8A%E5%B1%B11.jpg' } ] },
  zuiwengting:{ en:'Old Drunkard’s Pavilion', zh:'醉翁亭', names:['醉翁亭','Old Drunkard’s Pavilion','Zuiweng Pavilion'], ll:[118.276, 32.284], kind:'building',
    today:{ en:'Mount Langya, Chuzhou, Anhui', zh:'今安徽滁州琅琊山' }, era:{ en:'Built by the monk Zhixian; named by Ouyang Xiu, 1046', zh:'僧人智仙所建，1046年欧阳修命名并作记' },
    info:{ en:'The monk Zhixian built it and Ouyang Xiu named it after himself. With its wing-like roof corners (翼然) it is one of China’s four famous pavilions.', zh:'山中僧人智仙建亭，欧阳修用自己的号为它命名。亭角飞翘，“有亭翼然”，是中国四大名亭之一。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/%E6%9C%89%E4%BA%AD%E7%BF%BC%E7%84%B6.jpg/960px-%E6%9C%89%E4%BA%AD%E7%BF%BC%E7%84%B6.jpg', en:'The roof corners spread “like wings” (有亭翼然)', zh:'“有亭翼然”——亭角像鸟儿张开的翅膀', credit:'橙子木', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:%E6%9C%89%E4%BA%AD%E7%BF%BC%E7%84%B6.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/%E9%86%89%E7%BF%81%E4%BA%AD.jpg/960px-%E9%86%89%E7%BF%81%E4%BA%AD.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Old Drunkard’s Pavilion on Mount Langya', zh:'琅琊山醉翁亭', credit:'三猎', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:%E9%86%89%E7%BF%81%E4%BA%AD.jpg' } ] },
  luling:{ en:'Luling', zh:'庐陵', names:['庐陵','Luling'], ll:[114.99, 27.11], kind:'city',
    today:{ en:'Ji’an, Jiangxi', zh:'今江西吉安' }, era:{ en:'Ouyang Xiu’s family home', zh:'欧阳修的故乡' },
    info:{ en:'Ouyang Xiu’s family came from Luling, so he signed 《醉翁亭记》 “庐陵欧阳修也”. The Southern Song hero Wen Tianxiang was from here too.', zh:'欧阳修祖籍庐陵，所以《醉翁亭记》结尾说“庐陵欧阳修也”。南宋民族英雄文天祥也是庐陵人。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Ji%27an_Bailuzhou_Shuyuan_2018.05.15_17-39-28.jpg/960px-Ji%27an_Bailuzhou_Shuyuan_2018.05.15_17-39-28.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Bailuzhou Academy in Ji’an (old Luling), where Wen Tianxiang studied', zh:'吉安（古庐陵）的白鹭洲书院，文天祥曾在这里读书', credit:'Zhangzhugang', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Ji%27an_Bailuzhou_Shuyuan_2018.05.15_17-39-28.jpg' } ] },
  liuzhou:{ en:'Liuzhou', zh:'柳州', names:['柳州','Liuzhou'], ll:[109.41, 24.33], kind:'city',
    today:{ en:'Liuzhou, Guangxi', zh:'今广西柳州' }, era:{ en:'Liu Zongyuan governed here 815–819', zh:'815—819年柳宗元任柳州刺史' },
    info:{ en:'After Yongzhou, Liu Zongyuan was sent even further south to Liuzhou, where he dug wells, freed bond-servants and died. People still call him 柳柳州.', zh:'离开永州后，柳宗元又被派到更远的柳州做刺史，打井、解放奴婢，最后死在这里。人们称他“柳柳州”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Stone_Portrait_of_Liu_Zongyuan_in_Liuhou_Park.jpg/960px-Stone_Portrait_of_Liu_Zongyuan_in_Liuhou_Park.jpg', en:'A stone portrait of Liu Zongyuan in Liuhou Park, Liuzhou', zh:'柳州柳侯公园里的柳宗元石像', credit:'乌拉跨氪', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Stone_Portrait_of_Liu_Zongyuan_in_Liuhou_Park.jpg' } ] },

  /* ---- rhetoric / 陋室铭 ---- */
  lushi:{ en:'Humble Room', zh:'陋室', names:['Humble Room'], ll:[118.36, 31.71], kind:'site', subjects:['yuwen'],
    today:{ en:'He County, Anhui', zh:'今安徽和县' }, era:{ en:'Liu Yuxi in Hezhou, 824–826', zh:'824—826年刘禹锡任和州刺史' },
    info:{ en:'Tradition says Liu Yuxi wrote 《陋室铭》 while governor of Hezhou, where the town gave him only a tiny room. A rebuilt “humble room” stands in He County today.', zh:'相传刘禹锡任和州刺史时住在简陋的小屋里，写下了《陋室铭》。今天安徽和县有重建的陋室。' },
    photos:[ 
      { src:'https://upload.wikimedia.org/wikipedia/commons/d/d0/Tang_dynasty_poet_Liu_Yuxi.jpg', en:'Liu Yuxi (772–842), author of 《陋室铭》', zh:'《陋室铭》的作者刘禹锡（772—842）', credit:'attributed to Kanō Tsunenobu', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Tang_dynasty_poet_Liu_Yuxi.jpg' } ] },
  zhugelu:{ en:'Zhuge Liang’s Hut, Nanyang', zh:'南阳诸葛庐', names:['南阳诸葛庐','诸葛庐','卧龙岗','Wolonggang'], ll:[112.50, 32.99], kind:'site',
    today:{ en:'Wolonggang, Nanyang, Henan', zh:'今河南南阳卧龙岗' }, era:{ en:'Zhuge Liang farmed here before 207', zh:'207年以前诸葛亮在这里隐居躬耕' },
    info:{ en:'Zhuge Liang lived in a thatched hut until Liu Bei came three times to ask for his help. Both Nanyang (Henan) and Longzhong near Xiangyang (Hubei) claim the hut.', zh:'诸葛亮隐居的草庐，刘备“三顾茅庐”请他出山。诸葛庐的位置有河南南阳卧龙岗和湖北襄阳古隆中两种说法。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Wolong_Hill.jpg/960px-Wolong_Hill.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Wolonggang in Nanyang, Henan — said to be where Liu Bei visited Zhuge Liang three times', zh:'河南南阳卧龙岗——相传刘备在这里三顾茅庐', credit:'Gary Todd', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Wolong_Hill.jpg' } ] },
  ziyunting:{ en:'Ziyun Pavilion', zh:'子云亭', names:['西蜀子云亭','子云亭','Ziyun Pavilion'], ll:[104.70, 31.47], kind:'building',
    today:{ en:'Xishan Park, Mianyang, Sichuan', zh:'今四川绵阳西山' }, era:{ en:'In memory of Yang Xiong (53 BCE–18 CE)', zh:'纪念西汉文学家扬雄（字子云）' },
    info:{ en:'Yang Xiong, a great Han writer and scholar, studied in a simple pavilion in Shu (Sichuan). Liu Yuxi pairs it with Zhuge Liang’s hut: famous people lived in humble homes too.', zh:'西汉扬雄字子云，是蜀地的大文学家，曾在简朴的亭子里读书著述。刘禹锡把它和诸葛庐并举，说明简陋的居所也能住着了不起的人。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/%E7%BB%B5%E9%98%B3%E8%A5%BF%E5%B1%B1%E5%85%AC%E5%9B%AD%E5%AD%90%E4%BA%91%E4%BA%AD.jpg/960px-%E7%BB%B5%E9%98%B3%E8%A5%BF%E5%B1%B1%E5%85%AC%E5%9B%AD%E5%AD%90%E4%BA%91%E4%BA%AD.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Ziyun Pavilion in Xishan Park, Mianyang, Sichuan', zh:'四川绵阳西山公园的子云亭', credit:'沧海夜风', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:%E7%BB%B5%E9%98%B3%E8%A5%BF%E5%B1%B1%E5%85%AC%E5%9B%AD%E5%AD%90%E4%BA%91%E4%BA%AD.jpg' } ] },
  lushan:{ en:'Mount Lu', zh:'庐山', names:['庐山','Mount Lu','Lushan'], ll:[115.99, 29.55], kind:'mountain',
    today:{ en:'Jiujiang, Jiangxi', zh:'今江西九江' }, era:{ en:'World Heritage site (1996)', zh:'世界文化遗产（1996年）' },
    info:{ en:'A misty mountain by the Yangtze and Poyang Lake. Li Bai’s waterfall “飞流直下三千尺” and Su Shi’s “不识庐山真面目” were both written about it.', zh:'庐山在长江和鄱阳湖之间，云雾缭绕。李白的“飞流直下三千尺”、苏轼的“不识庐山真面目”写的都是它。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Sandiequan_Waterfall%2C_Lushan.jpg/960px-Sandiequan_Waterfall%2C_Lushan.jpg', en:'Sandiequan Waterfall on Mount Lu', zh:'庐山三叠泉瀑布', credit:'钉钉', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Sandiequan_Waterfall,_Lushan.jpg' } ] },
  baicaoyuan:{ en:'Hundred-Plant Garden & Three-Flavour Study', zh:'百草园和三味书屋', names:['百草园','三味书屋','Hundred-Plant Garden','Three-Flavour Study','Baicao Garden','Sanwei Study'], ll:[120.588, 29.995], kind:'site',
    today:{ en:'Lu Xun’s Native Place, Shaoxing, Zhejiang', zh:'今浙江绍兴鲁迅故里' }, era:{ en:'Lu Xun’s childhood in the 1880s–1890s; essay written 1926', zh:'鲁迅的童年（19世纪80—90年代）；1926年写成散文' },
    info:{ en:'The garden behind Lu Xun’s family home and, across a little river, the old private school where he studied. Both can still be visited — compare them with his essay!', zh:'百草园是鲁迅家后院的菜园，三味书屋是隔着一条小河的私塾，离得很近。今天都能参观，可以和课文对照着看。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/%E7%99%BE%E8%8D%89%E5%9B%AD.JPG/960px-%E7%99%BE%E8%8D%89%E5%9B%AD.JPG', en:'The Hundred-Plant Garden (百草园) at Lu Xun’s old family home', zh:'鲁迅故居的百草园', credit:'Gisling', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:%E7%99%BE%E8%8D%89%E5%9B%AD.JPG' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Sanwei_Study_Room.jpg/960px-Sanwei_Study_Room.jpg', en:'The Three-Flavour Study (三味书屋), where young Lu Xun went to school', zh:'少年鲁迅读书的私塾三味书屋', credit:'Yiwen122', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Sanwei_Study_Room.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Luxun_native_place.JPG/960px-Luxun_native_place.JPG', en:'Lu Xun’s Native Place, Shaoxing', zh:'绍兴鲁迅故里', credit:'Gisling', license:'CC BY 3.0', page:'https://commons.wikimedia.org/wiki/File:Luxun_native_place.JPG' } ] },
  shaoxing:{ en:'Shaoxing', zh:'绍兴', names:['绍兴','Shaoxing'], ll:[120.58, 30.01], kind:'city',
    today:{ en:'Shaoxing, Zhejiang', zh:'今浙江绍兴' }, era:{ en:'Lu Xun’s home town (born 1881)', zh:'鲁迅的故乡（1881年生）' },
    info:{ en:'A water town of canals and stone bridges south of Hangzhou. Lu Xun was born here, and many of his stories are set in places like it; Wang Xizhi’s Orchid Pavilion is nearby.', zh:'杭州南面的水乡，河道纵横、石桥众多。鲁迅出生在这里，他的许多小说都以这样的江南小镇为背景；王羲之的兰亭也在附近。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Shaoxing.jpg/960px-Shaoxing.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'A canal lined with white houses in Shaoxing', zh:'绍兴的水巷和白墙民居', credit:'Taco Witte', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Shaoxing.jpg' } ] },
  aiwanting:{ en:'Aiwan Pavilion', zh:'爱晚亭', names:['爱晚亭','Aiwan Pavilion'], ll:[112.93, 28.18], kind:'building',
    today:{ en:'Mount Yuelu, Changsha, Hunan', zh:'今湖南长沙岳麓山' }, era:{ en:'Built 1792; named after Du Mu’s 《山行》', zh:'1792年建，名字取自杜牧《山行》' },
    info:{ en:'A pavilion among maple trees on Mount Yuelu. Its name comes from Du Mu’s line “停车坐爱枫林晚” — every autumn the leaves turn red.', zh:'岳麓山枫林中的亭子，名字来自杜牧“停车坐爱枫林晚，霜叶红于二月花”。每到深秋，满山红叶。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Aiwan_Pavilion.jpg/960px-Aiwan_Pavilion.jpg', en:'The Aiwan Pavilion on Mount Yuelu, Changsha', zh:'长沙岳麓山爱晚亭', credit:'gongfu_king', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Aiwan_Pavilion.jpg' } ] },

  /* ---- modern essays ---- */
  pukou:{ en:'Pukou Railway Station', zh:'浦口火车站', names:['浦口火车站','浦口站','浦口','Pukou Railway Station','Pukou'], ll:[118.725, 32.104], kind:'building',
    today:{ en:'Pukou, Nanjing, Jiangsu', zh:'今江苏南京浦口' }, era:{ en:'Opened 1914; the setting of Zhu Ziqing’s 《背影》 (1917)', zh:'1914年通车；朱自清《背影》的故事发生地（1917年）' },
    info:{ en:'The southern end of the Tianjin–Pukou railway, on the north bank of the Yangtze opposite Nanjing. Here Zhu Ziqing’s father climbed across the tracks to buy him oranges.', zh:'津浦铁路的南端，在长江北岸，与南京城隔江相望。朱自清的父亲就是在这里爬过铁道、为儿子买橘子的。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Pukou_Railway_Station.jpg/960px-Pukou_Railway_Station.jpg', en:'Pukou Railway Station, Nanjing — the setting of 《背影》', zh:'南京浦口火车站——《背影》的故事发生地', credit:'Zhou Guanhuai', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Pukou_Railway_Station.jpg' } ] },
  huangshan:{ en:'Mount Huang', zh:'黄山', names:['黄山','Mount Huang','Huangshan'], ll:[118.17, 30.13], kind:'mountain',
    today:{ en:'Huangshan, Anhui', zh:'今安徽黄山' }, era:{ en:'World Heritage site (1990)', zh:'世界文化与自然双重遗产（1990年）' },
    info:{ en:'Granite peaks famous for strange pines, odd rocks, seas of cloud and hot springs. The highest, Lotus Peak, is 1,864 m.', zh:'以奇松、怪石、云海、温泉闻名的花岗岩山，最高峰莲花峰海拔1864米。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Mount-huangshan_53319729912.jpg/960px-Mount-huangshan_53319729912.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Granite peaks and pines of Mount Huang, Anhui', zh:'安徽黄山的花岗岩山峰和松树', credit:'xiquinhosilva', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Mount-huangshan_53319729912.jpg' } ] },

  /* ---- idioms & couplets ---- */
  guanquelou:{ en:'Stork Tower', zh:'鹳雀楼', names:['鹳雀楼','Stork Tower','Guanque Tower'], ll:[110.29, 34.84], kind:'building',
    today:{ en:'Yongji, Shanxi', zh:'今山西永济' }, era:{ en:'Wang Zhihuan’s poem (Tang); rebuilt 2002', zh:'王之涣《登鹳雀楼》（唐）；2002年重建' },
    info:{ en:'A tower by the Yellow River where storks used to nest. From the top Wang Zhihuan saw “白日依山尽，黄河入海流”; the old tower was lost in war and rebuilt in 2002.', zh:'黄河边的高楼，因常有鹳雀栖息而得名。王之涣登楼写下“白日依山尽，黄河入海流”。古楼毁于战火，2002年重建。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Stork_Tower%2C_6_October_2017.jpg/960px-Stork_Tower%2C_6_October_2017.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The rebuilt Stork Tower by the Yellow River, Yongji, Shanxi', zh:'山西永济黄河边重建的鹳雀楼', credit:'hwcmsb@126', license:'CC BY 2.5', page:'https://commons.wikimedia.org/wiki/File:Stork_Tower,_6_October_2017.jpg' } ] },

  /* ---- classic novels ---- */
  lingshan:{ en:'Vulture Peak', zh:'灵山（灵鹫山）', names:['灵山','灵鹫山','Vulture Peak'], ll:[85.44, 25.00], kind:'mountain', subjects:['yuwen'],
    today:{ en:'near Rajgir, Bihar, India', zh:'今印度比哈尔邦王舍城附近' }, era:{ en:'Where the Buddha taught', zh:'传说佛陀讲经的地方' },
    info:{ en:'In the novel Lingshan is Buddha’s magic mountain. It is based on a real hill in India where the Buddha preached; the real Xuanzang studied at Nalanda nearby.', zh:'小说里的灵山是如来佛祖所在的仙山，原型是印度王舍城附近佛陀讲经的灵鹫山。真实的玄奘曾在附近的那烂陀寺求学。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Ktoya%2C_Vulture_Peak%2C_Rajgir_88.jpg/960px-Ktoya%2C_Vulture_Peak%2C_Rajgir_88.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Vulture Peak near Rajgir, India, where the Buddha is said to have taught', zh:'印度王舍城附近的灵鹫山，相传佛陀在这里讲经', credit:'Ktoya', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Ktoya,_Vulture_Peak,_Rajgir_88.jpg' } ] },
  liangshanpo:{ en:'Liangshan Marsh', zh:'梁山泊', names:['梁山泊','Liangshan Marsh','Liangshan'], ll:[116.09, 35.78], kind:'site', subjects:['yuwen','china'],
    today:{ en:'Liangshan County, Shandong', zh:'今山东梁山一带' }, era:{ en:'Song-dynasty marshland; 《水浒传》', zh:'宋代的大湖泊；《水浒传》' },
    info:{ en:'In the Song, Yellow River floods made a huge marsh around Mount Liang — a perfect hide-out for outlaws. Most of it is farmland now; Dongping Lake is what is left of the water.', zh:'宋代黄河决口，在梁山周围形成了浩渺的大湖泊，正适合好汉聚义。如今大部分已成陆地，附近的东平湖是它的遗存。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Shuipo_Liangshan_%282910811675%29.jpg/960px-Shuipo_Liangshan_%282910811675%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Water Margin scenic area on Mount Liang, Shandong', zh:'山东梁山的水泊梁山风景区', credit:'kanegen', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Shuipo_Liangshan_(2910811675).jpg' } ] },
  jingyanggang:{ en:'Jingyang Ridge', zh:'景阳冈', names:['景阳冈','Jingyang Ridge'], ll:[115.86, 36.17], kind:'site',
    today:{ en:'Yanggu County, Shandong', zh:'今山东阳谷' }, era:{ en:'Where Wu Song kills the tiger (《水浒传》 ch. 23)', zh:'武松打虎的地方（《水浒传》第二十三回）' },
    info:{ en:'A low ridge in western Shandong where, in the novel, Wu Song kills a tiger with his bare hands after 18 bowls of wine. Today it is a park with a tiger statue.', zh:'鲁西的一道土岗。小说里武松喝了十八碗酒，在这里赤手空拳打死老虎。今天这里建成了景区。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Wusong_on_Jingyanggang_%28Long_Corridor%29.JPG/960px-Wusong_on_Jingyanggang_%28Long_Corridor%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'“Wu Song kills the tiger on Jingyang Ridge”, a painting on the Long Corridor of the Summer Palace', zh:'颐和园长廊彩画：武松景阳冈打虎', credit:'Long Corridor painting (photo: shizhao)', license:'Public domain', page:'https://commons.wikimedia.org/wiki/File:Wusong_on_Jingyanggang_(Long_Corridor).JPG' } ] },
  cangzhou:{ en:'Cangzhou', zh:'沧州', names:['沧州','Cangzhou'], ll:[116.84, 38.30], kind:'city',
    today:{ en:'Cangzhou, Hebei', zh:'今河北沧州' }, era:{ en:'A place of exile in the Song; Lin Chong is sent here', zh:'宋代流放犯人的地方；林冲“刺配沧州”' },
    info:{ en:'In the Song, criminals were sent to this remote coastal land. It is famous for martial arts and for a 40-tonne Iron Lion cast in 953.', zh:'宋代这里偏远荒凉，常是流放犯人的地方。沧州以武术之乡闻名，还有953年铸造、重约40吨的铁狮子。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Iron_Lion_of_Cangzhou_2007.jpg/960px-Iron_Lion_of_Cangzhou_2007.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Iron Lion of Cangzhou, cast in 953', zh:'沧州铁狮子，铸造于953年', credit:'Rolfmueller', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Iron_Lion_of_Cangzhou_2007.jpg' } ] },
  harmas:{ en:'The Harmas (Fabre’s garden)', zh:'荒石园', names:['荒石园','Harmas'], ll:[4.87, 44.19], kind:'site', base:'world',
    today:{ en:'Sérignan-du-Comtat, France', zh:'今法国塞利尼昂' }, era:{ en:'Fabre’s home 1879–1915', zh:'1879—1915年法布尔的家' },
    info:{ en:'A stony, weedy garden in Provence that Jean-Henri Fabre bought so he could watch insects at home. He wrote most of The Insect World (《昆虫记》) here.', zh:'法国南部普罗旺斯一片荒芜多石的园子。法布尔买下它，在家门口观察昆虫，《昆虫记》大部分是在这里写成的。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Harmas_de_Jean-Henri_Fabre_%C3%A0_S%C3%A9rignan.jpg/960px-Harmas_de_Jean-Henri_Fabre_%C3%A0_S%C3%A9rignan.jpg', en:'The Harmas, Fabre’s house and wild garden in Sérignan, southern France', zh:'法国南部塞利尼昂的“荒石园”——法布尔的家和花园', credit:'Renaud Camus', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Harmas_de_Jean-Henri_Fabre_%C3%A0_S%C3%A9rignan.jpg' } ] },

  /* ---- expository texts ---- */
  zhuozhengyuan:{ en:'Humble Administrator’s Garden', zh:'拙政园', names:['拙政园','Humble Administrator’s Garden',"Humble Administrator's Garden"], ll:[120.629, 31.325], kind:'park',
    today:{ en:'Suzhou, Jiangsu', zh:'今江苏苏州' }, era:{ en:'Begun about 1509 (Ming); World Heritage (1997)', zh:'始建于明代（约1509年）；世界文化遗产（1997年）' },
    info:{ en:'The largest classical garden in Suzhou, about 5.2 ha — half of it water. Paths, bridges and windows keep changing the view at every step (移步换景).', zh:'苏州现存最大的古典园林，约78亩，近一半是水面。走几步景色就变一次，这叫“移步换景”。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Humble_Administrator%27s_Garden_Suzhou_November_2017_001.jpg/960px-Humble_Administrator%27s_Garden_Suzhou_November_2017_001.jpg', en:'The Humble Administrator’s Garden, Suzhou', zh:'苏州拙政园', credit:'King of Hearts', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Humble_Administrator%27s_Garden_Suzhou_November_2017_001.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Humble_Administrator%27s_Garden_Suzhou_November_2017_002.jpg/960px-Humble_Administrator%27s_Garden_Suzhou_November_2017_002.jpg', en:'A pavilion in the Humble Administrator’s Garden', zh:'拙政园中的一座亭子', credit:'King of Hearts', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Humble_Administrator%27s_Garden_Suzhou_November_2017_002.jpg' } ] },
  liuyuan:{ en:'Lingering Garden', zh:'留园', names:['留园','Lingering Garden'], ll:[120.593, 31.317], kind:'park',
    today:{ en:'Suzhou, Jiangsu', zh:'今江苏苏州' }, era:{ en:'Begun 1593 (Ming); World Heritage (1997)', zh:'始建于明代（1593年）；世界文化遗产（1997年）' },
    info:{ en:'Famous for its long corridors, framed windows and the 6.5 m Cloud-Capped Peak, a giant Taihu rock.', zh:'以曲折的长廊、精巧的花窗和高约6.5米的太湖石“冠云峰”闻名。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/%E8%8B%8F%E5%B7%9E%E7%95%99%E5%9B%AD%E5%86%A0%E4%BA%91%E5%B3%B02019.jpg/960px-%E8%8B%8F%E5%B7%9E%E7%95%99%E5%9B%AD%E5%86%A0%E4%BA%91%E5%B3%B02019.jpg', en:'Cloud-Capped Peak (冠云峰), a giant Taihu rock in the Lingering Garden', zh:'留园的太湖石冠云峰', credit:'ScareCriterion12', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:%E8%8B%8F%E5%B7%9E%E7%95%99%E5%9B%AD%E5%86%A0%E4%BA%91%E5%B3%B02019.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Through_the_octagonal_window_%286508372507%29.jpg/960px-Through_the_octagonal_window_%286508372507%29.jpg', en:'Through an octagonal window in the Lingering Garden — the window frames the view like a picture', zh:'透过留园的八角窗看风景——窗就像画框', credit:'kevinmcgill', license:'CC BY-SA 2.0', page:'https://commons.wikimedia.org/wiki/File:Through_the_octagonal_window_(6508372507).jpg' } ] },
  wangshiyuan:{ en:'Master of the Nets Garden', zh:'网师园', names:['网师园','Master of the Nets Garden'], ll:[120.630, 31.300], kind:'park',
    today:{ en:'Suzhou, Jiangsu', zh:'今江苏苏州' }, era:{ en:'Rebuilt 1770s (Qing); World Heritage (1997)', zh:'清代乾隆年间重建；世界文化遗产（1997年）' },
    info:{ en:'One of the smallest famous gardens (about 0.5 ha), arranged around one pond. A copy of one of its courtyards stands in the Metropolitan Museum of Art in New York.', zh:'苏州名园中较小的一座（约8亩），围绕一池水布置。美国纽约大都会艺术博物馆里的“明轩”就是仿照它的一个庭院建的。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Master_of_the_Nets_Garden_Suzhou.jpg/960px-Master_of_the_Nets_Garden_Suzhou.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The pond in the Master of the Nets Garden, Suzhou', zh:'苏州网师园的水池', credit:'xiquinhosilva', license:'CC BY 2.0', page:'https://commons.wikimedia.org/wiki/File:Master_of_the_Nets_Garden_Suzhou.jpg' } ] },
  shizilin:{ en:'Lion Grove Garden', zh:'狮子林', names:['狮子林','Lion Grove Garden','Lion Grove'], ll:[120.626, 31.322], kind:'park',
    today:{ en:'Suzhou, Jiangsu', zh:'今江苏苏州' }, era:{ en:'Begun 1342 (Yuan); World Heritage (2000)', zh:'始建于元代（1342年）；世界文化遗产（2000年）' },
    info:{ en:'Its rockery is a maze of Taihu rocks shaped like lions, with tunnels to get lost in. In the 20th century it belonged to the family of the architect I. M. Pei.', zh:'园中的太湖石假山像一群狮子，洞穴曲折，像迷宫一样。20世纪这里曾属于建筑师贝聿铭的家族。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Lion_Grove_Garden_Suzhou_November_2017_007.jpg/960px-Lion_Grove_Garden_Suzhou_November_2017_007.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'Taihu rocks and a bridge in the Lion Grove Garden', zh:'狮子林里的太湖石假山和石桥', credit:'King of Hearts', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Lion_Grove_Garden_Suzhou_November_2017_007.jpg' } ] },
  arecibo:{ en:'Arecibo Observatory', zh:'阿雷西博望远镜', names:['阿雷西博望远镜','阿雷西博','Arecibo'], ll:[-66.753, 18.344], kind:'site', base:'world',
    today:{ en:'Puerto Rico, USA', zh:'今美国波多黎各' }, era:{ en:'1963–2020', zh:'1963—2020年' },
    info:{ en:'A 305 m radio dish hung in a sinkhole in Puerto Rico — the world’s largest for 53 years, until FAST. It collapsed in 2020.', zh:'建在波多黎各一个天然坑洞里的305米射电望远镜，曾经53年保持世界最大，直到FAST建成。2020年坍塌。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Arecibo_Radiotelescopio_SJU_06_2019_7472.jpg/960px-Arecibo_Radiotelescopio_SJU_06_2019_7472.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail', en:'The Arecibo radio telescope in Puerto Rico (2019, before it collapsed)', zh:'波多黎各的阿雷西博射电望远镜（2019年，坍塌前）', credit:'Mario Roberto Durán Ortiz', license:'CC BY-SA 4.0', page:'https://commons.wikimedia.org/wiki/File:Arecibo_Radiotelescopio_SJU_06_2019_7472.jpg' } ] },

  /* ---- 文言基础 ---- */
  guozijian:{ en:'Guozijian (Imperial Academy), Beijing', zh:'北京国子监', names:['国子监','北京孔庙','Guozijian'], ll:[116.410, 39.947], kind:'site',
    today:{ en:'Dongcheng, Beijing', zh:'今北京东城' }, era:{ en:'Highest school of the Yuan, Ming and Qing (from 1306)', zh:'元、明、清三代的最高学府（1306年起）' },
    info:{ en:'Next to Beijing’s Confucius Temple, students of the Imperial Academy learned the Analects by heart for the exams. Today it is a museum.', zh:'国子监与北京孔庙相邻，古代的太学生在这里诵读《论语》等经典、准备科举考试。今天是博物馆。' },
    photos:[ 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Glazed_Archway%2C_Beijing_Guozijian_1.jpg/960px-Glazed_Archway%2C_Beijing_Guozijian_1.jpg', en:'The glazed archway of the Guozijian, Beijing', zh:'北京国子监的琉璃牌坊', credit:'호고호', license:'CC0', page:'https://commons.wikimedia.org/wiki/File:Glazed_Archway,_Beijing_Guozijian_1.jpg' }, 
      { src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Confucius_Statue_at_the_Confucius_Temple.jpg/960px-Confucius_Statue_at_the_Confucius_Temple.jpg', en:'A statue of Confucius at the Confucius Temple next door', zh:'相邻的北京孔庙里的孔子像', credit:'Mr. Tickle', license:'CC BY-SA 3.0', page:'https://commons.wikimedia.org/wiki/File:Confucius_Statue_at_the_Confucius_Temple.jpg' } ] }
});
