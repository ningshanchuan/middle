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
