/* LabPinyin — in Chinese mode, puts small pinyin (ruby) over hard-to-read words, site-wide. Auto-loaded by lab.js.
   - Only words in the dictionary below get pinyin (rare characters, place/person names, polyphonic characters, science terms).
   - Each word is annotated once per paragraph/item, so the text stays calm.
   - A "拼" button in the top bar (Chinese mode only) turns it on/off; the choice is remembered (localStorage labPinyin).
   - Skips code, inputs, SVG, KaTeX math, the nav bar and anything inside [data-nopy].
   - To add words: put  '词语':'cí yǔ'  in DICT (use tone marks). Longer words win over shorter ones.
   - 多音字: never add a polyphonic character on its own (行, 重, 长, 藏, 都, 燕, 血, 处 …) — add whole words, and add the
     other reading's common words too (e.g. 倒数第 dàoshǔ vs 倒数 dàoshù), so the longest match picks the right reading.  */
(function(){
  if (window.LabPinyin) return;
  const DICT = {
  // ---------- China history ----------
  '禅让':'shànràng','尧舜禹':'Yáo Shùn Yǔ','尧':'Yáo','舜':'Shùn','河姆渡':'Hémǔdù','干栏':'gānlán','粟':'sù','耒耜':'lěisì',
  '盘庚':'Pán Gēng','殷墟':'Yīnxū','司母戊鼎':'Sīmǔwù dǐng','后母戊鼎':'Hòumǔwù dǐng','四羊方尊':'Sì Yáng fāngzūn','鼎':'dǐng',
  '镐京':'Hàojīng','犬戎':'Quǎnróng','齐桓公':'Qí Huángōng','商鞅':'Shāng Yāng','都江堰':'Dūjiāngyàn','飞沙堰':'Fēishāyàn',
  '嬴政':'Yíng Zhèng','郡县制':'jùnxiànzhì','三公九卿':'sān gōng jiǔ qīng','小篆':'xiǎozhuàn','度量衡':'dùliànghéng',
  '匈奴':'Xiōngnú','张骞':'Zhāng Qiān','西域都护':'Xīyù dūhù','西域':'Xīyù','华佗':'Huà Tuó','官渡':'Guāndù','鲜卑':'Xiānbēi',
  '贾思勰':'Jiǎ Sīxié','齐民要术':'Qímín Yàoshù','王羲之':'Wáng Xīzhī','顾恺之':'Gù Kǎizhī','淝水':'Féi Shuǐ',
  '涿郡':'Zhuōjùn','贞观':'Zhēnguān','吐蕃':'Tǔbō','松赞干布':'Sōngzàn Gànbù','玄奘':'Xuánzàng','澶渊':'Chányuān',
  '契丹':'Qìdān','党项':'Dǎngxiàng','澎湖':'Pénghú','毕昇':'Bì Shēng','行省':'xíngshěng','忽必烈':'Hūbìliè',
  '戚继光':'Qī Jìguāng','倭寇':'wōkòu','雅克萨':'Yǎkèsà','准噶尔':'Zhǔngá’ěr','噶尔丹':'Gá’ěrdān','金瓶掣签':'jīnpíng chèqiān',
  '驻藏大臣':'zhù Zàng dàchén','达赖':'Dálài','班禅':'Bānchán','鸦片':'yāpiàn','林则徐':'Lín Zéxú','甲午':'Jiǎwǔ',
  '戊戌':'Wùxū','辛丑':'Xīnchǒu','辛亥':'Xīnhài','遵义':'Zūnyì','泸定桥':'Lúdìng Qiáo','井冈山':'Jǐnggāng Shān',
  '淞沪':'Sōng-Hù','台儿庄':'Tái’érzhuāng','鸭绿江':'Yālù Jiāng','焦裕禄':'Jiāo Yùlù','邓稼先':'Dèng Jiàxiān',
  '浦东':'Pǔdōng','蛟龙':'Jiāolóng','嫦娥':'Cháng’é','羲和':'Xīhé','祝融':'Zhùróng','万隆':'Wànlóng','秦桧':'Qín Huì',
  '岳飞':'Yuè Fēi','隋炀帝':'Suí Yángdì','李渊':'Lǐ Yuān','武则天':'Wǔ Zétiān','曌':'zhào','诸葛亮':'Zhūgě Liàng',
  '孙权':'Sūn Quán','刘禅':'Liú Shàn','蜀':'Shǔ','爵':'jué','觚':'gū','钺':'yuè','编钟':'biānzhōng','埙':'xūn',
  '兵马俑':'bīngmǎyǒng','俑':'yǒng','骊山':'Lí Shān','咸阳':'Xiányáng','洛邑':'Luòyì','亳':'Bó','二里头':'Èrlǐtou',
  // ---------- China geography ----------
  '塔里木':'Tǎlǐmù','柴达木':'Cháidámù','喀斯特':'kāsītè','喀什':'Kāshí','乌鲁木齐':'Wūlǔmùqí','呼和浩特':'Hūhéhàotè',
  '雅鲁藏布江':'Yǎlǔzàngbù Jiāng','澜沧江':'Láncāng Jiāng','珠穆朗玛峰':'Zhūmùlǎngmǎ Fēng','昆仑':'Kūnlún','祁连':'Qílián',
  '贺兰山':'Hèlán Shān','太行':'Tàiháng','大兴安岭':'Dà Xīng’ān Lǐng','坎儿井':'kǎn’érjǐng','窑洞':'yáodòng',
  '桃花峪':'Táohuāyù','胡焕庸':'Hú Huànyōng','瑷珲':'Àihuī','陕西':'Shǎnxī','淮河':'Huái Hé','秦岭':'Qín Lǐng',
  '冀':'Jì','皖':'Wǎn','闽':'Mǐn','赣':'Gàn','豫':'Yù','鄂':'È','粤':'Yuè','琼':'Qióng','渝':'Yú','黔':'Qián',
  '滇':'Diān','陇':'Lǒng','沪':'Hù','邕':'Yōng','漯':'Luò','涪':'Fú','崂':'Láo','汶':'Wèn','岷':'Mín','嘉陵':'Jiālíng',
  '鄱阳湖':'Póyáng Hú','洞庭':'Dòngtíng','青藏':'Qīng-Zàng','藏族':'Zàngzú','维吾尔':'Wéiwú’ěr','傣':'Dǎi','畲':'Shē',
  '佤':'Wǎ','羌':'Qiāng','仡佬':'Gēlǎo','鄂温克':'Èwēnkè','赫哲':'Hèzhé','裕固':'Yùgù','蒙古包':'měnggǔbāo',
  '哈尼':'Hāní','梯田':'tītián','垦':'kěn','冶':'yě','沼泽':'zhǎozé','冲积':'chōngjī','汛':'xùn','涝':'lào',
  // ---------- Civics ----------
  '颁布':'bānbù','仲裁':'zhòngcái','诉讼':'sùsòng','赡养':'shànyǎng','弘扬':'hóngyáng','贿赂':'huìlù','拘留':'jūliú',
  '惩罚':'chéngfá','恪守':'kèshǒu','砥砺':'dǐlì','秉持':'bǐngchí','凝聚':'níngjù','肖像权':'xiàoxiàngquán','渎职':'dúzhí',
  '绿水青山':'lǜshuǐ qīngshān','罢免':'bàmiǎn','检察':'jiǎnchá','监察':'jiānchá','审判':'shěnpàn','犯罪':'fànzuì',
  '酌情':'zhuóqíng','褒奖':'bāojiǎng','敛财':'liǎncái','亵渎':'xièdú','诽谤':'fěibàng','侮辱':'wǔrǔ','逮捕':'dàibǔ',
  // ---------- Chemistry ----------
  '氢':'qīng','氦':'hài','锂':'lǐ','铍':'pí','硼':'péng','氮':'dàn','氟':'fú','氖':'nǎi','钠':'nà','镁':'měi','铝':'lǚ',
  '硅':'guī','磷':'lín','硫':'liú','氯':'lǜ','氩':'yà','钾':'jiǎ','钙':'gài','铬':'gè','锰':'měng','钴':'gǔ','镍':'niè',
  '锌':'xīn','镓':'jiā','溴':'xiù','碘':'diǎn','氙':'xiān','钛':'tài','钨':'wū','汞':'gǒng','铀':'yóu','铅':'qiān',
  '酚酞':'fēntài','石蕊':'shíruǐ','碱':'jiǎn','沉淀':'chéndiàn','蒸馏':'zhēngliú','凝华':'nínghuá','熔化':'rónghuà',
  '熔点':'róngdiǎn','沸点':'fèidiǎn','沸腾':'fèiténg','溶质':'róngzhì','溶剂':'róngjì','饱和':'bǎohé','氧化':'yǎnghuà',
  '催化剂':'cuīhuàjì','铁锈':'tiěxiù','坩埚':'gānguō','烧瓶':'shāopíng','试剂':'shìjì','醋':'cù','酵':'jiào',
  // ---------- Physics ----------
  '摩擦':'mócā','杠杆':'gànggǎn','楔':'xiē','焦耳':'jiāo’ěr','赫兹':'hèzī','惯性':'guànxìng','折射':'zhéshè',
  '棱镜':'léngjìng','凹':'āo','凸':'tū','频率':'pínlǜ','振幅':'zhènfú','振动':'zhèndòng','磁':'cí','螺线管':'luóxiànguǎn',
  '伏特':'fútè','欧姆':'ōumǔ','砝码':'fǎmǎ','滑轮':'huálún','轴':'zhóu',
  // ---------- Biology ----------
  '线粒体':'xiànlìtǐ','叶绿体':'yèlǜtǐ','叶绿素':'yèlǜsù','内质网':'nèizhìwǎng','高尔基体':'Gāo’ěrjītǐ','溶酶体':'róngméitǐ',
  '液泡':'yèpào','核糖体':'hétángtǐ','染色体':'rǎnsètǐ','脱氧核糖核酸':'tuōyǎng hétáng hésuān','减数分裂':'jiǎnshù fēnliè',
  '有丝分裂':'yǒusī fēnliè','草履虫':'cǎolǚchóng','酵母':'jiàomǔ','孢子':'bāozǐ','苔藓':'táixiǎn','蕨':'jué',
  '裸子植物':'luǒzǐ zhíwù','雌蕊':'círuǐ','雄蕊':'xióngruǐ','胚胎':'pēitāi','胚':'pēi','哺乳':'bǔrǔ','脊椎':'jǐzhuī',
  '鳃':'sāi','腺':'xiàn','嘌呤':'piàolìng','嘧啶':'mìdìng','鸟嘌呤':'niǎopiàolìng','胞嘧啶':'bāomìdìng','胸腺':'xiōngxiàn',
  '藻':'zǎo','细菌':'xìjūn','真菌':'zhēnjūn','菌类':'jūnlèi','霉':'méi','蚯蚓':'qiūyǐn','蜥蜴':'xīyì','鲸':'jīng','蝙蝠':'biānfú','雀':'què','蛹':'yǒng',
  '卵':'luǎn','蕊':'ruǐ','萼':'è','茎':'jīng','韧':'rèn','咀嚼':'jǔjué','渗透':'shèntòu','血红蛋白':'xuèhóng dànbái',
  // ---------- Earth science & astronomy ----------
  '彗星':'huìxīng','陨石':'yǔnshí','陨星':'yǔnxīng','盈凸':'yíngtū','亏凸':'kuītū','蛾眉月':'éméiyuè','峨眉月':'éméiyuè',
  '朔':'shuò','日冕':'rìmiǎn','日晷':'rìguǐ','潮汐':'cháoxī','岩浆':'yánjiāng','熔岩':'róngyán','玄武岩':'xuánwǔyán',
  '花岗岩':'huāgāngyán','砾':'lì','页岩':'yèyán','沉积':'chénjī','侵蚀':'qīnshí','风化':'fēnghuà','冰川':'bīngchuān',
  '褶皱':'zhězhòu','断层':'duàncéng','震源':'zhènyuán','海啸':'hǎixiào','飓风':'jùfēng','龙卷风':'lóngjuǎnfēng',
  '平流层':'píngliúcéng','对流层':'duìliúcéng','臭氧':'chòuyǎng','霾':'mái','冰雹':'bīngbáo','霜':'shuāng',
  '珊瑚':'shānhú','腐殖质':'fǔzhízhì','化石':'huàshí','琥珀':'hǔpò','三叶虫':'sānyèchóng','菊石':'júshí',
  // astronomy (宿 in star names is xiù; 参 in 参宿 is shēn)
  '二十八宿':'èrshíbā xiù','参宿四':'Shēnxiù sì','参宿七':'Shēnxiù qī','参宿':'Shēnxiù','心宿二':'Xīnxiù èr','毕宿五':'Bìxiù wǔ',
  '角宿一':'Jiǎoxiù yī','昴星团':'Mǎo xīngtuán','昴':'mǎo','猎户座':'Lièhù zuò','蟹状星云':'Xièzhuàng xīngyún','奇点':'qídiǎn',
  '坍缩':'tānsuō','偏心率':'piānxīnlǜ','摄动':'shèdòng','秒差距':'miǎochājù','朔望月':'shuòwàngyuè','卡戎':'Kǎróng',
  '鹊桥':'Quèqiáo','夸父':'Kuāfù','氦闪':'hàishǎn','脉冲星':'màichōngxīng','类星体':'lèixīngtǐ','引力透镜':'yǐnlì tòujìng',
  '彗发':'huìfà','彗核':'huìhé','彗尾':'huìwěi','阋神星':'Xìshénxīng','妊神星':'Rènshénxīng','柯伊伯带':'Kēyībó dài',
  '希克苏鲁伯':'Xīkèsūlǔbó','车里雅宾斯克':'Chēlǐyǎbīnsīkè','耶泽罗':'Yēzéluó','丽姬亚海':'Lìjīyà Hǎi','法厄同':'Fǎ’ètóng',
  '隼鸟':'Sǔnniǎo','造父变星':'Zàofù biànxīng','造父一':'Zàofù yī','勒维特':'Lèwéitè','亨丽埃塔':'Hēnglì’āità','暴胀':'bàozhàng',
  '夸克':'kuākè','氘':'dāo','彭齐亚斯':'Péngqíyàsī','中微子':'zhōngwēizǐ','依巴谷':'Yībāgǔ','比邻星':'Bǐlínxīng',
  '巴纳德星':'Bānàdé xīng','船尾座':'Chuánwěi zuò','后发座':'Hòufà zuò','室女座':'Shìnǚ zuò','麦哲伦云':'Màizhélún yún',
  '勾陈一':'Gōuchén yī','轩辕十四':'Xuānyuán shísì','昴宿六':'Mǎoxiù liù','辇道增七':'Niǎndào zēng qī','娄宿三':'Lóuxiù sān',
  '壁宿二':'Bìxiù èr','箕宿三':'Jīxiù sān','斗宿四':'Dǒuxiù sì','危宿三':'Wēixiù sān','室宿一':'Shìxiù yī','右枢':'Yòushū',
  '弧矢七':'Húshǐ qī','尾宿八':'Wěixiù bā','土司空':'Tǔsīkōng','奎宿九':'Kuíxiù jiǔ','天苑四':'Tiānyuàn sì','天仓五':'Tiāncāng wǔ',
  '蒭藁增二':'Chúgǎo zēng èr','弧矢增二十二':'Húshǐ zēng èrshí’èr','五帝座一':'Wǔdìzuò yī','星宿一':'Xīngxiù yī','水委一':'Shuǐwěi yī',
  '摇光':'Yáoguāng','天枢':'Tiānshū','大陵五':'Dàlíng wǔ','河鼓二':'Hégǔ èr','赫罗图':'Hè-Luó tú','斯特藩':'Sītèfān',
  '干涉仪':'gānshèyí','焦比':'jiāobǐ','出瞳':'chūtóng','查南托':'Chánántuō',
  // rare element characters (periodic table)
  '钪':'kàng','钒':'fán','锗':'zhě','砷':'shēn','硒':'xī','氪':'kè','铷':'rú','锶':'sī','钇':'yǐ','锆':'gào','铌':'ní','钼':'mù',
  '锝':'dé','钌':'liǎo','铑':'lǎo','钯':'bǎ','镉':'gé','铟':'yīn','锑':'tī','碲':'dì','铯':'sè','钡':'bèi','镧':'lán','铈':'shì',
  '镨':'pǔ','钕':'nǚ','钷':'pǒ','钐':'shān','铕':'yǒu','钆':'gá','铽':'tè','镝':'dī','钬':'huǒ','铒':'ěr','铥':'diū','镱':'yì',
  '镥':'lǔ','铪':'hā','钽':'tǎn','铼':'lái','锇':'é','铱':'yī','铊':'tā','铋':'bì','钋':'pō','砹':'ài','氡':'dōng','钫':'fāng',
  '镭':'léi','锕':'ā','钍':'tǔ','镤':'pú','镎':'ná','钚':'bù','铂':'bó','锡':'xī',
  '质心':'zhìxīn','反照率':'fǎnzhàolǜ','极昼':'jízhòu','天平动':'tiānpíngdòng','岁差':'suìchā','蛇夫座':'Shéfū zuò',
  '抛射':'pāoshè','棒旋':'bàngxuán','黄白交角':'huáng-bái jiāojiǎo','沙罗周期':'Shāluó zhōuqī','引潮力':'yǐncháolì',
  '涌潮':'yǒngcháo','钱塘江':'Qiántáng Jiāng','芬迪湾':'Fēndí Wān','阿耳忒弥斯':'Ā’ěrtèmísī',
  '翟志刚':'Zhái Zhìgāng','晕轨道':'yùn guǐdào','各拉丹冬':'Gèlādāndōng','沱沱河':'Tuótuó Hé','瞿塘峡':'Qútáng Xiá',
  '夔门':'Kuí Mén','三斗坪':'Sāndǒupíng','葛洲坝':'Gězhōubà','中华鲟':'Zhōnghuá xún','船闸':'chuánzhá','升船机':'shēngchuánjī',
  '防洪调度':'fánghóng diàodù','调度':'diàodù','白鹤梁':'Báihèliáng',
  '榫卯':'sǔnmǎo','斗拱':'dǒugǒng','栌斗':'lúdǒu','散斗':'sàndǒu','挑檐檩':'tiǎoyánlǐn','额枋':'éfāng','柱础':'zhùchǔ',
  '漕运':'cáoyùn','纤夫':'qiànfū','敞肩拱':'chǎngjiān gǒng','拱券':'gǒngxuàn','蟾蜍':'chánchú','都柱':'dūzhù','割圆术':'gēyuánshù',
  '算筹':'suànchóu','缀术':'Zhuìshù','浑仪':'húnyí','惊蛰':'jīngzhé','处暑':'chǔshǔ','芒种':'mángzhòng','霜降':'shuāngjiàng',
  '汶川':'Wènchuān','库布其':'Kùbùqí','塞罕坝':'Sàihǎnbà','雅丹':'yǎdān','钙华':'gàihuá','石钟乳':'shízhōngrǔ','石笋':'shísǔn',
  '溶蚀':'róngshí','节理':'jiélǐ','漓江':'Lí Jiāng','芦笛岩':'Lúdí Yán','张掖':'Zhāngyè','绒布寺':'Róngbù Sì','龙门山':'Lóngmén Shān',
  '赤尾屿':'Chìwěi Yǔ','火烧寮':'Huǒshāoliáo','邵族':'Shàozú','红桧':'hóngguì','太鲁阁':'Tàilǔgé','瑞穗':'Ruìsuì','湄洲':'Méizhōu',
  '氹仔':'Dàngzǎi','路氹':'Lùdàng','赤鱲角':'Chìlièjiǎo','屯门':'Túnmén','将军澳':'Jiāngjūn’ào','大屿山':'Dàyǔ Shān','竹篙湾':'Zhúgāo Wān',
  '社稷坛':'Shèjì Tán','什刹海':'Shíchàhǎi','倒座房':'dàozuòfáng','厢房':'xiāngfáng','钓鱼岛':'Diàoyú Dǎo',
  '庞涓':'Páng Juān','孙膑':'Sūn Bìn','许攸':'Xǔ Yōu','朝歌':'Zhāogē','纣王':'Zhòu wáng','苻坚':'Fú Jiān','洛涧':'Luòjiàn',
  '倒戈':'dǎogē','虎贲':'hǔbēn','辎重':'zīzhòng','诡道':'guǐdào','百战不殆':'bǎi zhàn bú dài','以佚待劳':'yǐ yì dài láo','弩机':'nǔjī',
  '堂邑父':'Tángyì Fǔ','鄯善':'Shànshàn','莫贺延碛':'Mòhèyán Qì','飒秣建':'Sàmòjiàn','缚喝':'Fúhè','梵衍那':'Fànyǎnnà',
  '犍陀罗':'Jiāntuóluó','迦湿弥罗':'Jiāshīmíluó','那烂陀寺':'Nàlàntuó Sì','苏门答剌':'Sūméndálà','苜蓿':'mùxu','粟特':'Sùtè',
  '麒麟':'qílín','于阗':'Yútián','大月氏':'Dà Yuèzhī','邺城':'Yèchéng',
  '伶仃洋':'Língdīng Yáng','格尔木':'Gé’ěrmù','那曲':'Nàqū','当雄':'Dāngxióng','德令哈':'Délìnghā','藏羚羊':'zànglíngyáng',
  '霍尔果斯':'Huò’ěrguǒsī','鄂尔多斯':'È’ěrduōsī','兆帕':'zhàopà','莺歌海':'Yīnggē Hǎi','曾母暗沙':'Zēngmǔ Ànshā','长芦':'Chánglú',
  '伏季休渔':'fújì xiūyú','乌贼':'wūzéi','唐古拉山口':'Tánggǔlā Shānkǒu','热棒':'rèbàng',
  '夯土':'hāngtǔ','版筑':'bǎnzhù','垛口':'duǒkǒu','垛墙':'duǒqiáng','烽燧长':'fēngsuìzhǎng','烽燧':'fēngsuì','戍卒':'shùzú',
  '界壕':'jièháo','关隘':'guān’ài','嘉峪关':'Jiāyù Guān','慕田峪':'Mùtiányù','临洮':'Líntáo','蒙恬':'Méng Tián','阿保机':'Ābǎojī',
  '燕云十六州':'Yān-Yún shíliù zhōu','郾城':'Yǎnchéng','颐和园':'Yíhé Yuán','尼布楚':'Níbùchǔ',
  '佃农':'diànnóng','分成佃农':'fēnchéng diànnóng','赊账':'shēzhàng','赊购':'shēgòu','弹劾':'tánhé','砷酸钙':'shēnsuāngài','疏浚':'shūjùn',
  '种地':'zhòngdì','种子':'zhǒngzi','查塔姆':'Chátǎmǔ','棉铃象甲':'miánlíng xiàngjiǎ',
  '背影':"bèiyǐng",'蹒跚':"pánshān",'马褂':"mǎguà",'月台':"yuètái",'拭干':"shìgān",'菜畦':"càiqí",'皂荚':"zàojiá",'桑椹':"sāngshèn",'叫天子':"jiàotiānzi",'云霄':"yúnxiāo",'拗过去':"ǎo guòqu",'揣了':"chuāi le",'怦怦':"pēngpēng",'梧桐':"wútóng",'咧开嘴':"liěkāi zuǐ",'突如其来':"tūrú-qílái",'伞骨':"sǎngǔ",'透湿':"tòushī",'赌气':"dǔqì",'除夕':"chúxī",'倒叙':"dàoxù",'插叙':"chāxù",'首尾呼应':"shǒuwěi hūyìng",'铺垫':"pūdiàn",'朝花夕拾':"Zhāohuā Xīshí",'三味书屋':"Sānwèi Shūwū",'洨河':"Xiáo Hé",'砌成':"qìchéng",'跨度':"kuàdù",'拙政园':"Zhuōzhèng Yuán",'漏窗':"lòuchuāng",'计成':"Jì Chéng",'园冶':"Yuányě",'宛自天开':"wǎn zì tiān kāi",'洼地':"wādì",'射电':"shèdiàn",'阿雷西博':"Āléixībó",'摹状貌':"mó zhuàngmào",'作诠释':"zuò quánshì",'蜕皮':"tuìpí",'结茧':"jiéjiǎn",'梦溪笔谈':"Mèngxī Bǐtán",'沈括':"Shěn Kuò",'蜿蜒':"wānyán",'花蕊':"huāruǐ",'散射':"sǎnshè",'靛':"diàn",'锲而不舍':"qiè'érbùshě",'金石可镂':"jīnshí kě lòu",'资治通鉴':"Zīzhì Tōngjiàn",'屠呦呦':"Tú Yōuyōu",'青蒿素':"qīnghāosù",'黄花蒿':"huánghuāhāo",'疟疾':"nüèji",'歧路':"qílù",'培根':"Péigēn",'昆虫记':"Kūnchóng Jì",'苟日新':"gǒu rì xīn",'跬步':"kuǐbù",'司马迁':"Sīmǎ Qiān",'忍辱负重':"rěnrǔ-fùzhòng",'论据':"lùnjù",'劝学':"Quànxué",'三天打鱼两天晒网':"sān tiān dǎ yú liǎng tiān shài wǎng",
  '陶渊明':"Táo Yuānmíng",'范仲淹':"Fàn Zhòngyān",'欧阳修':"Ōuyáng Xiū",'周敦颐':"Zhōu Dūnyí",'柳宗元':"Liǔ Zōngyuán",'滕子京':"Téng Zǐjīng",'刘禹锡':"Liú Yǔxī",'岑参':"Cén Shēn",'朱熹':"Zhū Xī",'陈洪绶':"Chén Hóngshòu",'汪伦':"Wāng Lún",'巴陵':"Bālíng",'滁州':"Chúzhōu",'琅琊':"Lángyá",'庐陵':"Lúlíng",'武陵':"Wǔlíng",'永州':"Yǒngzhōu",'潇湘':"Xiāoxiāng",'巫峡':"Wūxiá",'邓州':"Dèngzhōu",'洞庭湖':"Dòngtíng Hú",'君山':"Jūnshān",'百草园':"Bǎicǎo Yuán",'子云亭':"Zǐyún Tíng",'浩浩汤汤':"hàohào shāngshāng",'属予':"zhǔ yú",'怒号':"nùháo",'豁然开朗':"huòrán kāilǎng",'鲜有':"xiǎnyǒu",'参差':"cēncī",'卷石':"quǎnshí",'斗折蛇行':"dǒuzhé shéxíng",'犬牙差互':"quǎnyá cīhù",'射者中':"shè zhě zhòng",'宁有种乎':"nìng yǒu zhǒng hū",'王侯将相':"wánghóu jiàngxiàng",'淫雨霏霏':"yínyǔ fēifēi",'樯倾楫摧':"qiáng qīng jí cuī",'静影沉璧':"jìng yǐng chén bì",'宠辱偕忘':"chǒng rǔ xié wàng",'觥筹交错':"gōngchóu jiāocuò",'伛偻':"yǔlǚ",'阡陌':"qiānmò",'黄发垂髫':"huángfà chuítiáo",'俨然':"yǎnrán",'濯':"zhuó",'亵玩':"xièwán",'淤泥':"yūní",'佁然':"yǐrán",'俶尔':"chù'ěr",'翕忽':"xīhū",'篁竹':"huángzhú",'坻':"chí",'嵁':"kān",'悄怆幽邃':"qiǎochuàng yōusuì",'酿泉':"Niàngquán",'林壑':"línhè",'蔚然':"wèirán",'山肴野蔌':"shānyáo yěsù",'洌':"liè",'弈':"yì",'颓然':"tuírán",'阴翳':"yīnyì",'谪守':"zhéshǒu",'衔':"xián",'油蛉':"yóulíng",'鸿儒':"hóngrú",'案牍':"àndú",'鞍鞯':"ānjiān",'辔头':"pèitou",'苔痕':"táihén",'设问':"shèwèn",'对偶':"duì'ǒu",'喻体':"yùtǐ",'赶趟儿':"gǎntàngr",'互文':"hùwén",
  '徐光启':"Xú Guāngqǐ",'利玛窦':"Lì Mǎdòu",'皇太极':"Huáng Tàijí",'郑成功':"Zhèng Chénggōng",'雍正':"Yōngzhèng",'军机处':"Jūnjīchù",'乾隆':"Qiánlóng",'四库全书':"Sìkù Quánshū",'金川':"Jīnchuān",'奥格尔索普':"Àogé'ěrsuǒpǔ",'托莫奇奇':"Tuōmòqíqí",'亚马克劳':"Yàmǎkèláo",'马斯科吉':"Mǎsīkējí",'豪德诺索尼':"Háodénuòsuǒní",'易洛魁':"Yìluòkuí",'莱纳佩':"Láinàpèi",'万帕诺亚格':"Wànpànuòyàgé",'纳拉甘西特':"Nàlāgānxītè",'佩科特':"Pèikētè",'萨斯奎汉诺克':"Sàsīkuíhànnuòkè",'波瓦坦':"Bōwǎtǎn",'切罗基':"Qiēluójī",'塔斯卡罗拉':"Tǎsīkǎluólā",'卡托巴':"Kǎtuōbā",'靛蓝':"diànlán",'契约仆役':"qìyuē púyì",'效忠派':"xiàozhōngpài",'黑森':"Hēisēn",'康华利':"Kānghuálì",'格威内特':"Géwēinèitè",'施托伊本':"Shītuōyīběn",'拉法耶特':"Lāfǎyētè",'马戛尔尼':"Mǎjiá'ěrní",'徽班':"Huībān",'邦联':"bānglián",'否决':"fǒujué",'制衡':"zhìhéng",'联邦党人':"Liánbāng Dǎngrén",'普布利乌斯':"Pǔbùlìwūsī",'谢斯':"Xièsī",'斯普林菲尔德':"Sīpǔlínfēi'ěrdé",'佩特森':"Pèitèsēn",'谢尔曼':"Xiè'ěrmàn",'鲍德温':"Bàodéwēn",'费尤':"Fèiyóu",'黑兹尔伍德':"Hēizī'ěrwǔdé",'吉迪恩':"Jídí'ēn",'冗长辩论':"rǒngcháng biànlùn",'驻兵':"zhùbīng",'陪审团':"péishěntuán",
  '马斯格罗夫':"Mǎsīgéluófū",'萨尔茨堡':"Sà'ěrcíbǎo",'埃比尼泽':"Āibǐnízé",'达里恩':"Dálǐ'ēn",'弗雷德里卡':"Fúléidélǐkǎ",'奥克弗诺基':"Àokèfúnuòjī",'塔卢拉':"Tǎlúlā",'埃托瓦':"Āituōwǎ",'科洛莫基':"Kēluòmòjī",'奥克马尔吉':"Àokèmǎ'ěrjí",'查塔胡奇':"Chátǎhúqí",'阿尔塔马霍':"Ā'ěrtǎmǎhuò",'瓜莱':"Guālái",'韦斯托':"Wéisītuō",'德索托':"Désuǒtuō",'斯托林斯':"Sītuōlínsī",'萨佩洛':"Sàpèiluò",'堰洲岛':"yànzhōudǎo",'叠压':"diéyā",'酋邦':"qiúbāng",'贝丘':"bèiqiū",'胸饰':"xiōngshì",'编条抹泥':"biāntiáo mǒní",'投矛器':"tóumáoqì",
  '沃尔顿':"Wò'ěrdùn",'普瓦斯基':"Pǔwǎsījī",'德斯坦':"Désītǎn",'麦金托什':"Màijīntuōshí",'菲尤':"Fēiyóu",'以利亚':"Yǐlìyà",'达布尼':"Dábùní",'森伯里':"Sēnbólǐ",'米利奇维尔':"Mǐlìqíwéi'ěr",'奥吉奇':"Àojíqí",'奥科尼':"Àokēní",'奥尔塔马霍':"Ào'ěrtǎmǎhuò",'弗林特':"Fúlíntè",'塞阔亚':"Sàikuòyà",'埃乔塔':"Āiqiáotǎ",'布迪诺特':"Bùdínuòtè",'达洛尼加':"Dáluòníjiā",'塔勒阔':"Tǎlèkuò",'麦吉利夫雷':"Màijílìfūléi",'布雷肯里奇':"Bùléikěnlǐqí",'图姆斯':"Túmǔsī",'斯蒂芬斯':"Sīdìfēnsī",'奇克莫加':"Qíkèmòjiā",'安德森维尔':"Āndésēnwéi'ěr",'黑曾':"Hēizēng",'欧文维尔':"Ōuwénwéi'ěr",'围栏':"wéilán",'重建':"chóngjiàn",'割让':"gēràng",'地契':"dìqì",
  '晁盖':"Cháo Gài",'李逵':"Lǐ Kuí",'鲁智深':"Lǔ Zhìshēn",'公孙胜':"Gōngsūn Shèng",'高俅':"Gāo Qiú",'吴用':"Wú Yòng",'罗刹女':"Luóchà Nǚ",'六耳猕猴':"liù'ěr míhóu",'紧箍咒':"jǐngūzhòu",'老鼋':"lǎo yuán",'阿傩':"Ānuó",'伽叶':"Jiāyè",'哪吒':"Nézhā",'九齿钉耙':"jiǔchǐ dīngpá",'筋斗云':"jīndǒuyún",'傅聪':"Fù Cōng",'严监生':"Yán jiānshēng",'胡屠户':"Hú túhù",'阿长':"Ā Cháng",'大堰河':"Dàyànhé",'蒋海澄':"Jiǎng Hǎichéng",'尼摩':"Nímó",'冬妮娅':"Dōngnīyà",'朱赫来':"Zhūhèlái",'虎妞':"Hǔniū",'解缙':"Xiè Jìn",'顾宪成':"Gù Xiànchéng",'鹳雀楼':"Guànquè Lóu",'刻舟求剑':"kè zhōu qiú jiàn",'卧薪尝胆':"wò xīn cháng dǎn",'破釜沉舟':"pò fǔ chén zhōu",'塞翁失马':"sài wēng shī mǎ",'塞翁':"sài wēng",'杯弓蛇影':"bēi gōng shé yǐng",'罄竹难书':"qìng zhú nán shū",'差强人意':"chā qiáng rén yì",'不刊之论':"bù kān zhī lùn",'美轮美奂':"měi lún měi huàn",'首当其冲':"shǒu dāng qí chōng",'万人空巷':"wàn rén kōng xiàng",'伯乐相马':"Bólè xiàng mǎ",'相马':"xiàng mǎ",'炙手可热':"zhì shǒu kě rè",'平仄':"píngzè",'对仗':"duìzhàng",'横批':"héngpī",'屠苏':"túsū",'婵娟':"chánjuān",'茱萸':"zhūyú",'粽子':"zòngzi",'腊八':"làbā",'乞巧':"qǐqiǎo",'审题':"shěntí",'题眼':"tíyǎn",'卒章显志':"zú zhāng xiǎn zhì",'详略得当':"xiáng lüè dé dàng",'凤头豹尾':"fèng tóu bào wěi",'蒙汗药':"ménghànyào",'绰号':"chuòhào",'勤为径':"qín wéi jìng",
  '小岗村':"Xiǎogǎng Cūn",'大包干':"dàbāogān",'凤阳':"Fèngyáng",'汕头':"Shàntóu",'粮票':"liángpiào",'配给':"pèijǐ",'因纽特':"Yīnniǔtè",'均衡':"jūnhéng",'宏观调控':"hóngguān tiáokòng",'互补品':"hùbǔpǐn",'替代品':"tìdàipǐn",'禽流感':"qínliúgǎn",'倒卖':"dǎomài",'汇率':"huìlǜ",'关税':"guānshuì",'配额':"pèi'é",'禁运':"jìnyùn",'义乌':"Yìwū",'洋山':"Yángshān",'萨凡纳':"Sàfánnà",'哈茨菲尔德':"Hācífēi'ěrdé",'并轨':"bìngguǐ",'转嫁':"zhuǎnjià",'交子':"jiāozǐ",'魏玛':"Wèimǎ",'津巴布韦':"Jīnbābùwéi",'资本品':"zīběnpǐn",'收益递减':"shōuyì dìjiǎn",'识字率':"shízìlǜ",'压岁钱':"yāsuìqián",'复利':"fùlì",'反诈':"fǎnzhà",'滞纳金':"zhìnàjīn",'量入为出':"liàng rù wéi chū",
  '宫商角徵羽':"gōng shāng jué zhǐ yǔ",'调式':"diàoshì",'大调':"dàdiào",'小调':"xiǎodiào",'宫调式':"gōngdiàoshì",'调音':"tiáoyīn",'散板':"sǎnbǎn",'工尺谱':"gōngchěpǔ",'弹拨':"tánbō",'华彦钧':"Huà Yànjūn",'曾侯乙':"Zēng Hóu Yǐ",'琵琶':"pípa",'古筝':"gǔzhēng",'二胡':"èrhú",'古琴':"gǔqín",'笙':"shēng",'堂鼓':"tánggǔ",'锣鼓经':"luógǔjīng",'板眼':"bǎnyǎn",'笛膜':"dímó",'琴码':"qínmǎ",'揉弦':"róuxián",'伯牙':"Bóyá",'钟子期':"Zhōng Zǐqī",'十面埋伏':"shí miàn mái fú",'垓下':"Gāixià",'阿炳':"Ā Bǐng",'冼星海':"Xiǎn Xīnghǎi",'聂耳':"Niè Ěr",'梁祝':"Liáng Zhù",'何占豪':"Hé Zhànháo",'管平湖':"Guǎn Pínghú",'梨园':"Líyuán",'贾湖':"Jiǎhú",'神奇秘谱':"Shénqí Mìpǔ",'巩金瓯':"Gǒng Jīn'ōu",'迪亚士':"Díyàshì",'伽马':"Gāmǎ",'麦哲伦':"Màizhélún",'埃尔卡诺':"Āi'ěrkǎnuò",'斐迪南':"Fěidínán",'鲁登道夫':"Lǔdēngdàofū",'李宗仁':"Lǐ Zōngrén",'重光葵':"Chóngguāng Kuí",'恩克鲁玛':"Ēnkèlǔmǎ",'肯雅塔':"Kěnyǎtǎ",'赫鲁晓夫':"Hèlǔxiǎofū",'加加林':"Jiājiālín",'捷列什科娃':"Jiélièshíkēwá",'戈尔巴乔夫':"Gē'ěrbāqiáofū",'耶格尔':"Yēgé'ěr",'尼赫鲁':"Níhèlǔ",'吴努':"Wú Nǔ",'玻利瓦尔':"Bōlìwǎ'ěr",'卢维杜尔':"Lúwéidù'ěr",'纽科门':"Niǔkēmén",'刘家港':"Liújiāgǎng",'长乐':"Chánglè",'卡利卡特':"Kǎlìkǎtè",'马林迪':"Mǎlíndí",'虎门':"Hǔmén",'萨拉热窝':"Sàlārèwō",'卢沟桥':"Lúgōuqiáo",'斯大林格勒':"Sīdàlíngélè",'阿拉曼':"Ālāmàn",'奥斯维辛':"Àosīwéixīn",'比克瑙':"Bǐkènǎo",'长崎':"Chángqí",'马斯特里赫特':"Mǎsītèlǐhètè",'苏伊士':"Sūyīshì",'蒙巴萨':"Méngbāsà",'一条鞭法':"yì tiáo biān fǎ",'海禁':"hǎijìn",'坏血病':"huàixuèbìng",'珍妮机':"Zhēnníjī",'堑壕':"qiànháo",'徐进弹幕':"xújìn dànmù",'驼峰航线':"Tuófēng hángxiàn",'求同存异':"qiú tóng cún yì",'长赐号':"Chángcì Hào",'申根':"Shēngēn",
  '身毒':"Juāndú",'刹帝利':"chàdìlì",'迦腻色伽':"Jiānìsèjiā",'羯陵伽':"Jiélíngqié",'楔形':"xiēxíng",'嚈哒':"Yàndā",'祆教':"Xiānjiào",'呾叉始罗':"Dáchāshǐluó",'窣堵坡':"sūdǔpō",'疏勒':"Shūlè",'木鹿':"Mùlù",'泰西封':"Tàixīfēng",'亚述巴尼拔':"Yàshùbānībá",'尼布甲尼撒':"Níbùjiǎnísā",'冈比西斯':"Gāngbǐxīsī",'塞琉古':"Sàiliúgǔ",'托勒密':"Tuōlèmì",'图坦卡蒙':"Tútǎnkǎméng",'吉尔伽美什':"Jí'ěrjiāměishí",'沙马什':"Shāmǎshí",'伯罗奔尼撒':"Bóluóbēnnísā",'提洛同盟':"Tíluò Tóngméng",'黑劳士':"Hēiláoshì",'克里斯提尼':"Kèlǐsītíní",'迦太基':"Jiātàijī",'布匿战争':"Bùnì Zhànzhēng",'汉尼拔':"Hànníbá",'恺撒':"Kǎisā",'屋大维':"Wūdàwéi",'甘英':"Gān Yīng",'摩亨佐':"Móhēngzuǒ",'哈拉帕':"Hālāpà",'婆罗门':"Póluómén",'吠舍':"Fèishè",'首陀罗':"Shǒutuóluó",'悉达多':"Xīdáduō",'释迦牟尼':"Shìjiāmóuní",'旃陀罗笈多':"Zhāntuóluójíduō",'贵霜':"Guìshuāng",'琐罗亚斯德':"Suǒluóyàsīdé",'怛罗斯':"Dáluósī",'花剌子米':"Huālázǐmǐ",'伊本·西拿':"Yīběn Xīná",'阿拔斯':"Ābásī",'倭马亚':"Wōmǎyà",'查士丁尼':"Cháshìdīngní",'采邑':"cǎiyì",'什一税':"shíyīshuì",'马穆鲁克':"Mǎmùlǔkè",'伊儿汗国':"Yī'ér Hánguó",'旭烈兀':"Xùlièwù",'薄伽丘':"Bójiāqiū",'彼特拉克':"Bǐtèlākè",'布鲁内莱斯基':"Bùlǔnèiláisījī",'美第奇':"Měidìqí",'谷登堡':"Gǔdēngbǎo",'美因茨':"Měiyīncí",'维登堡':"Wéidēngbǎo",'加尔文':"Jiā'ěrwén",'赎罪券':"shúzuìquàn",'威斯特伐利亚':"Wēisītèfálìyà",'胡格诺':"Húgénuò",'伊拉斯谟':"Yīlāsīmó",'马基雅维利':"Mǎjīyǎwéilì",'宋应星':"Sòng Yìngxīng",
  '第谷':'Dìgǔ','半长轴':'bàncháng zhóu','齐奥尔科夫斯基':'Qí’ào’ěrkēfūsījī','卡门线':'Kǎmén xiàn','推重比':'tuīzhòngbǐ',
  '液氢':'yèqīng','戈达德':'Gēdádé','曼加里安':'Mànjiālǐ’ān','灰背隼':'huībèisǔn','日行迹':'rìxíngjì','会合周期':'huìhé zhōuqī',
  '角动量':'jiǎodòngliàng','拱极':'gǒngjí','赤纬':'chìwěi','拉尼亚凯亚':'Lāníyàkǎiyà','猛犸象':'měngmǎxiàng','啁啾':'zhōujiū','铃宕':'língdàng','史瓦西':'Shǐwǎxī','吸积盘':'xījīpán','凌星':'língxīng',
  '日冕仪':'rìmiǎnyí','绘架座':'Huìjià zuò','偏振':'piānzhèn','视向速度':'shìxiàng sùdù','勒梅特':'Lèméitè','谱线':'pǔxiàn','摩羯座':'Mójié zuò','双子座':'Shuāngzǐ zuò','渐近':'jiànjìn','旋臂':'xuánbì','椭圆':'tuǒyuán','椭圆轨道':'tuǒyuán guǐdào',
  // ---------- Math ----------
  '勾股定理':'gōugǔ dìnglǐ','弦':'xián','概率':'gàilǜ','系数':'xìshù','截距':'jiéjù','斜率':'xiélǜ','棱柱':'léngzhù',
  '棱锥':'léngzhuī','圆锥':'yuánzhuī','扇形':'shànxíng','众数':'zhòngshù','倒数第':'dàoshǔ dì','倒数':'dàoshù','数轴':'shùzhóu','乘方':'chéngfāng',
  '幂':'mì','绝对值':'juéduìzhí','象限':'xiàngxiàn','全等':'quánděng','位似':'wèisì','邻补角':'línbǔjiǎo','对顶角':'duìdǐngjiǎo'
  ,
  // ---------- 多音字 / polyphonic: always list the whole WORD, never the single character ----------
  // history names
  '单于':'chányú','月氏':'Yuèzhī','龟兹':'Qiūcí','可汗':'kèhán','吐谷浑':'Tǔyùhún','冒顿':'Mòdú','会稽':'Kuàijī',
  '番禺':'Pānyú','大宛':'Dàyuān','阿房宫':'Ēpáng Gōng','燕国':'Yānguó','燕长城':'Yān Chángchéng','燕昭王':'Yān Zhāowáng','燕山':'Yān Shān','燕京':'Yānjīng','燕赵':'Yān Zhào',
  '燕子':'yànzi','家燕':'jiāyàn','高句丽':'Gāogōulí','曾国藩':'Zēng Guófān','洪仁玕':'Hóng Réngān','谭嗣同':'Tán Sìtóng',
  '詹天佑':'Zhān Tiānyòu','朝鲜':'Cháoxiǎn','尉迟':'Yùchí','万俟':'Mòqí','乐毅':'Yuè Yì','乐府':'yuèfǔ',
  // places
  '重庆':'Chóngqìng','厦门':'Xiàmén','蚌埠':'Bèngbù','六安':'Lù’ān','丽水':'Líshuǐ','台州':'Tāizhōu','吐鲁番':'Tǔlǔfān',
  '喀喇昆仑':'Kālǎkūnlún','铅山':'Yánshān','乐亭':'Làotíng','东阿':'Dōng’ē','大埔':'Dàbù',
  // civics
  '处罚':'chǔfá','处分':'chǔfèn','供给':'gōngjǐ','给予':'jǐyǔ','为人民服务':'wèi rénmín fúwù','强迫':'qiǎngpò',
  // science
  '弹力':'tánlì','弹簧':'tánhuáng','弹性':'tánxìng','色散':'sèsàn','散热':'sànrè','载人':'zàirén','运载':'yùnzài',
  '着陆':'zhuólù','着火':'zháohuǒ','血液':'xuèyè','血管':'xuèguǎn','血细胞':'xuèxìbāo','血压':'xuèyā','畜牧':'xùmù',
  '家畜':'jiāchù','牲畜':'shēngchù','薄膜':'báomó','削弱':'xuēruò','着色':'zhuósè'
  };
  const LP = window.LabPinyin = { dict:DICT };
  const st = (() => { try { return localStorage.getItem('labPinyin'); } catch(e){ return null; } })();
  let on = st !== '0';
  const words = Object.keys(DICT).sort((a, b) => b.length - a.length);
  const RE = new RegExp(words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  const CJK = /[㐀-鿿]/;
  const SKIP = 'script,style,textarea,input,select,option,code,pre,svg,math,ruby,rt,title,.katex,.ma-label,.lab-nav,.lp-jin,[data-nopy],[contenteditable]';
  const BLOCK = 'p,li,h1,h2,h3,h4,h5,h6,td,th,figcaption,summary,blockquote,dd,dt,button,label,.opt,.chip,.qtext,.explain,.feedback,.lp-cap';
  const css = document.createElement('style');
  css.textContent = `ruby.lpy{ruby-position:over;ruby-align:center}
ruby.lpy rt{font-size:.7em;font-weight:700;line-height:1.1;color:color-mix(in srgb,var(--ink,#14213d) 70%,var(--brand,#0f9d8a));letter-spacing:0;font-family:Nunito,system-ui,sans-serif;user-select:none}
ruby.lpy{line-height:2}
:is(p,li,dd,.explain,.qtext,figcaption):has(ruby.lpy){line-height:2.2}   /* room for the bigger pinyin so lines don't touch */
/* small UI text (chips, labels, captions): keep pinyin from crowding */

.lab-py{font-weight:800;font-size:15px}.lab-py.off{opacity:.45;text-decoration:line-through}`;
  document.head.appendChild(css);
  const isZh = () => (window.Lab ? Lab.lang === 'zh' : (document.documentElement.lang || '').startsWith('zh'));
  const active = () => on && isZh();

  function annotateText(node, seen){
    const text = node.nodeValue; if (!text || !CJK.test(text)) return;
    RE.lastIndex = 0; let m, last = 0, frag = null;
    while ((m = RE.exec(text))){
      const w = m[0]; if (seen.has(w)) continue;
      seen.add(w); frag = frag || document.createDocumentFragment();
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const r = document.createElement('ruby'); r.className = 'lpy'; r.appendChild(document.createTextNode(w));
      const rt = document.createElement('rt'); rt.textContent = DICT[w]; r.appendChild(rt); frag.appendChild(r);
      last = m.index + w.length;
    }
    if (!frag) return;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    // inside a flex/grid box every child becomes its own item and the line breaks apart: keep the pieces in one span
    const pd = getComputedStyle(node.parentNode).display;
    if (/flex|grid/.test(pd)){
      const w = document.createElement('span'); w.className = 'lpy-wrap'; w.appendChild(frag); node.parentNode.replaceChild(w, node); return; }
    node.parentNode.replaceChild(frag, node);
  }
  const seenMap = new WeakMap();
  function process(root){
    if (!active() || !root) return;
    if (root.nodeType === 3){ root = root.parentElement; if (!root) return; }
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n =>
      (n.nodeValue && CJK.test(n.nodeValue) && n.parentElement && !n.parentElement.closest(SKIP)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
    const list = []; while (tw.nextNode()) list.push(tw.currentNode);
    list.forEach(n => {
      if (!n.parentNode) return;
      const box = n.parentElement.closest(BLOCK) || n.parentElement;
      const seen = new Set(); box.querySelectorAll('ruby.lpy').forEach(r => seen.add(r.firstChild.nodeValue));   // fresh: boxes can be re-filled with new text
      annotateText(n, seen);
    });
  }
  function strip(){
    document.querySelectorAll('ruby.lpy').forEach(r => { const p = r.parentNode; if (!p) return; p.replaceChild(document.createTextNode(r.firstChild.nodeValue), r); p.normalize(); });
  }
  LP.refresh = () => { strip(); if (active()) process(document.body); syncBtn(); };

  // re-annotate content that pages render later (quiz questions, info panels, galleries)
  let queue = new Set(), raf = 0;
  const mo = new MutationObserver(ms => {
    if (!active()) return;
    for (const m of ms){
      if (m.type === 'characterData') queue.add(m.target);
      else m.addedNodes.forEach(n => { if (!(n.nodeType === 1 && n.matches('ruby.lpy'))) queue.add(n); });
    }
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; const q = [...queue]; queue.clear(); q.forEach(n => { if (n.isConnected) process(n); }); });
  });

  // "拼" toggle in the top bar (Chinese mode only)
  function syncBtn(){
    let b = document.querySelector('.lab-py');
    const seg = document.querySelector('.lab-lang');
    if (!b && seg){
      b = document.createElement('button'); b.className = 'icon-btn lab-py'; b.textContent = '拼'; b.type = 'button';
      b.onclick = () => { on = !on; try { localStorage.setItem('labPinyin', on ? '1' : '0'); } catch(e){} LP.refresh(); };
      seg.insertAdjacentElement('afterend', b);
    }
    if (b){ b.hidden = !isZh(); b.classList.toggle('off', !on); b.title = on ? '隐藏难字拼音' : '显示难字拼音'; b.setAttribute('aria-pressed', on); }
  }

  function start(){
    mo.observe(document.body, { childList:true, subtree:true, characterData:true });
    // language switches: Lab re-renders text; refresh after it has done so
    new MutationObserver(() => setTimeout(LP.refresh, 0)).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
    LP.refresh();
  }
  if (window.Lab && Lab.ready) Lab.ready(() => setTimeout(start, 0));
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
