import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Lesson = {
  day: number;

  category: string;

  title: string;

  intro: string;

  points: string[];

  question: string;

  options: string[];

  answer: number;

  feedback: string;

  action: string;
};

type Progress = {
  completed: number[];

  lastCompletedDate?: string;

  streak: number;
};

const KEY = "caatoai-daily-lessons-v1";

const today = () => new Date().toISOString().slice(0, 10);

const lessonSeeds = [
  [
    "Faham jirkaaga",

    "Gaajo dhab ah mise rabitaan cunto?",

    "Baro farqiga u dhexeeya gaajada jirka iyo rabitaanka cuntada.",

    "Gaajada jirku badanaa si tartiib ah ayey u timaadaa.|Rabitaanku mararka qaar si kedis ah ayuu ugu xirmaa cunto gaar ah.|Ka hor cuntada, is weydii waxa jirkaagu kuu sheegayo.",

    "Kee inta badan tilmaamaya rabitaan?",

    "Gaajo si tartiib ah u kordheysa|Rabitaan kedis ah oo cunto gaar ah|Calool madhan dhowr saacadood kadib",

    1,

    "Rabitaan kedis ah oo cunto gaar ah mararka qaar wuxuu la xiriiraa caado ama dareen.",

    "Hal mar maanta sug 5 daqiiqo oo magacaab waxa aad dareemayso ka hor cuntada.",
  ],

  [
    "Faham jirkaaga",

    "Maxaan u gaajoodaa habeenkii?",

    "Gaajada habeenkii waxay la xiriiri kartaa cunto yar maalintii, caado, hurdo ama walbahaar.",

    "Hubi waxaad maalintii cuntay.|Biyo cab oo sug dhowr daqiiqo.|Haddii aad dhab ahaan gaajaysan tahay, dooro cunto qorshaysan.",

    "Maxaa fiican inaad marka hore samayso?",

    "Iska mamnuuc cuntada|Hubi gaajadaada iyo cuntadii maalinta|Cun wax kasta oo kuu dhow",

    1,

    "Fahamka sababta gaajada ayaa ka fiican xeer adag.",

    "Qor waqtiga aad caawa gaajootid iyo waxa aad dareemaysay.",
  ],

  [
    "Faham jirkaaga",

    "Protein iyo dhereg",

    "Protein-ku waa qayb ka mid ah cunto dheellitiran wuxuuna taageeri karaa dheregga.",

    "Ku dar il protein ah cuntooyinka waaweyn.|Dooro waxa ku habboon qorshahaaga.|La soco dhereggaaga.",

    "Fikradda ugu fiican?",

    "Protein keliya cun|Ku dar protein qayb ka mid ah cunto dheellitiran|Ka saar khudaarta",

    1,

    "Ujeeddadu waa cunto dheellitiran, ma aha hal nafaqo oo keliya.",

    "Hubi in qadada ama cashada maanta ay leedahay il protein ah.",
  ],

  [
    "Faham jirkaaga",

    "Biyaha iyo calaamadaha jirka",

    "Harraadka iyo gaajadu mararka qaar way isku dhex muuqan karaan.",

    "Biyo si joogto ah u cab.|Ha sugin ilaa aad aad u harraaddo.|Baahida biyuhu qof walba isku mid ma aha.",

    "Maxaa habboon?",

    "Biyo joogto ah maalinta|Hal mar oo keliya biyo badan|Biyaha iska dhaaf",

    0,

    "Joogteyntu waa muhiim.",

    "Ku dar hal koob biyo ah caadadaada maanta.",
  ],

  [
    "Faham jirkaaga",

    "Qaybaha cuntada",

    "Qaybta cuntadu waxay saameyn kartaa tamarta aad qaadato adigoon cunto gaar ah mamnuucin.",

    "Bilow qayb macquul ah.|Si tartiib ah u cun.|Ku dar khudaar marka ay kuu habboon tahay.",

    "Maxaa caawin kara qaybaha?",

    "Si degdeg ah u cun|Bilow qayb macquul ah oo tartiib u cun|Ka bood dhammaan cuntada",

    1,

    "Tani waxay kuu oggolaanaysaa inaad dareento dheregga.",

    "Hal cunto maanta si tartiib ah u cun.",
  ],

  [
    "Faham jirkaaga",

    "Goorma ayaan dhergaa?",

    "Barashada calaamadaha dheregga waxay kaa caawin kartaa inaad joojiso marka aad ku qanacdo.",

    "Hakado yar samee.|Qiimee gaajadaada 1–10.|Uma baahnid inaad saxanka mar walba dhamayso.",

    "Maxaad samayn kartaa inta aad cunayso?",

    "Hakado oo hubi dheregga|Had iyo jeer saxanka dhammee|Ha fiirin calaamadaha jirka",

    0,

    "Hakadku wuxuu ku siinayaa fursad aad ku maqasho jirkaaga.",

    "Bartamaha hal cunto, hakad 30 ilbiriqsi ah samee.",
  ],

  [
    "Dib-u-eegis",

    "Toddobaadkaaga koowaad",

    "Horumarku ma aha kaamilnimo. Eeg waxa shaqeeyay iyo waxa aad sii wadi karto.",

    "Xusuuso hal guul.|Aqoonso hal caqabad.|Dooro hal caado oo aad sii wadayso.",

    "Horumarka waara badanaa wuxuu ka yimaadaa?",

    "Kaamilnimo maalin kasta|Caadooyin yaryar oo joogto ah|Is-ciqaab",

    1,

    "Joogteynta ayaa ka muhiimsan kaamilnimada.",

    "Qor hal caado oo aad ku faanayso.",
  ],

  [
    "Caadooyinka",

    "Cunista dareenka",

    "Dareenno kala duwan ayaa mararka qaar kicin kara cunis aan gaajo jir ahayn.",

    "Magacaab dareenka.|Samee hakad gaaban.|Dooro jawaab ku habboon.",

    "Tallaabada koowaad?",

    "Magacaab dareenka|Is canaan|Cunto mamnuuc",

    0,

    "Ogaanshaha waxa socda ayaa kuu abuura doorasho.",

    "Haddii rabitaan yimaado, magacaab dareenka hal eray.",
  ],

  [
    "Caadooyinka",

    "Ogow waxa ku kiciya",

    "Trigger-ku wuxuu noqon karaa waqti, meel, qof, ur, daal ama dareen.",

    "La soco goorta rabitaanku yimaado.|Ha xukumin naftaada.|Raadi qaab soo noqnoqda.",

    "Trigger waa maxay?",

    "Wax kicin kara caado ama rabitaan|Cunto caafimaad leh oo keliya|Miisaankaaga",

    0,

    "Marka aad trigger-ka taqaan, waxaad qorsheyn kartaa jawaab kale.",

    "Qor hal trigger oo aad maanta aragtay.",
  ],

  [
    "Caadooyinka",

    "Si tartiib ah u cun",

    "Cunista tartiibta ahi waxay kuu sahlaysaa inaad dareento dhereg iyo dhadhanka.",

    "Qaniinyada dhexdeeda hakad samee.|Shaashadda meel dhig marka ay suurtagal tahay.|U fiirso dhadhanka.",

    "Maxaa caawin kara cunista miyirka leh?",

    "Shaashad badan|Degdeg|Hakad iyo fiiro",

    2,

    "Fiiro yar ayaa beddeli karta sida aad cuntada ula dhaqanto.",

    "10 daqiiqo oo hal cunto ah si aan shaashad lahayn u cun.",
  ],

  [
    "Caadooyinka",

    "Qorshee ka hor gaajada",

    "Marka gaajadu aad u xoog badato, doorashada cuntadu way adkaan kartaa.",

    "Ogow cuntada xigta.|Hayso ikhtiyaar fudud.|Isticmaal grocery list-kaaga.",

    "Maxay qorshayntu kaa caawin kartaa?",

    "Sug ilaa gaajo daran|Yeelo doorasho diyaar ah|Mamnuuc cuntooyinka",

    1,

    "Qorshe yar wuxuu yareyn karaa go'aamada degdegga ah.",

    "Go'aami qadada ama cashada berri maanta.",
  ],

  [
    "Caadooyinka",

    "Dukaameysi qorshaysan",

    "Liis wax iibsasho wuxuu kaa caawin karaa inaad guriga ku haysato waxa qorshahaagu u baahan yahay.",

    "Eeg weekly grocery list-ka.|Calaamadee waxa aad haysato.|Iibso waxa loo baahan yahay.",

    "Maxaa fiican ka hor dukaanka?",

    "Liis samee|Wax walba random u iibso|Qorshaha iska ilow",

    0,

    "Liiska wuxuu taageeraa qorshahaaga.",

    "Calaamadee 3 shay oo aad guriga ku haysato.",
  ],

  [
    "Caadooyinka",

    "Cunista bannaanka",

    "Makhaayad ama marti ma burburiso qorshahaaga. Doorasho dabacsan samee.",

    "Eeg menu-ga ka hor.|Dooro protein iyo khudaar ku habboon.|Ku raaxayso cuntada adigoon xukumin.",

    "Cunista bannaanka micnaheedu ma yahay qorshaha waa dhammaaday?",

    "Haa|Maya",

    1,

    "Hal cunto waa qayb ka mid ah nolosha.",

    "Qorshee hal doorasho oo kuu shaqayn karta markaad bannaanka wax ka cunto.",
  ],

  [
    "Dib-u-eegis",

    "Toddobaadka 2aad",

    "Dib u eeg waxa kuu fudud iyo waxa weli adag.",

    "Hal caado oo fudud.|Hal trigger oo aad baratay.|Hal isbeddel oo aad tijaabin doonto.",

    "Dib-u-eegistu maxay kuu qabataa?",

    "Waxay kaa caawisaa inaad barato waxa kuu shaqeeya|Waxay kaa dhigtaa kaamil|Waxba",

    0,

    "Qorshaha wanaagsan wuxuu wax ka bartaa noloshaada dhabta ah.",

    "Dooro hal wax oo aad toddobaadka dambe hagaajinayso.",
  ],

  [
    "Maskaxda",

    "Maalin qorshaha kaa baxday",

    "Hal maalin ma qeexdo safarkaaga. Tallaabada xigta ayaa muhiim ah.",

    "Ha isku ciqaabin.|Ku noqo cuntada xigta ee caadiga ah.|Wax ka baro waxa dhacay.",

    "Maxaa fiican maalinta xigta?",

    "Gaajo isku rid|Ku noqo qorshaha caadiga ah|Jooji qorshaha",

    1,

    "Soo noqoshada ayaa ka muhiimsan ciqaab.",

    "Qor weedh naxariis leh oo aad naftaada ku oran lahayd.",
  ],

  [
    "Maskaxda",

    "Miisaanku maalin walba wuu dhaqaaqaa",

    "Biyo, milix iyo dheefshiid waxay beddeli karaan miisaanka maalinba maalinta ka dambaysa.",

    "Eeg jihada guud.|Ha ku xukumin hal cabbir.|Caadooyinka sidoo kale waa horumar.",

    "Hal maalin oo miisaanku kordho waxay caddeyneysaa?",

    "Qorshuhu fashilmay|Wax yar; jihada guud ayaa muhiim ah|Cuntada jooji",

    1,

    "Hal cabbir wuxuu leeyahay macluumaad kooban.",

    "Eeg horumarka 1M halkii aad hal maalin ku xukumi lahayd.",
  ],

  [
    "Maskaxda",

    "Joogteyn ka badan kaamilnimo",

    "Wax yar oo aad badanaa samayso ayaa ka waxtar badan qorshe adag oo aan sii socon.",

    "Samee yool la fulin karo.|Dib u bilow markaad seegto.|U dabaaldeg joogteynta.",

    "Kee ayaa waara?",

    "100% ama waxba|Tallaabooyin la fulin karo oo soo noqnoqda",

    1,

    "Caado la celin karo ayaa muhiim ah.",

    "Dooro hal yool oo aad maanta dhab ahaan qaban karto.",
  ],

  [
    "Maskaxda",

    "Hurdada iyo caadooyinka",

    "Hurdo yari waxay saameyn kartaa tamarta, niyadda iyo doorashada cuntada.",

    "Samee waqti hurdo oo joogto ah.|Yaree mashquulka habeenkii.|U fiirso xiriirka hurdada iyo rabitaanka.",

    "Hurdadu waxay la xiriiri kartaa?",

    "Tamarta iyo doorashada cuntada|Waxba|Miisaanka oo keliya",

    0,

    "Hurdadu waa qayb ka mid ah caadooyinka guud.",

    "Caawa isku day waqti hurdo oo aad horay u qorshaysay.",
  ],

  [
    "Maskaxda",

    "Walbahaarka",

    "Walbahaarku wuxuu beddeli karaa rabitaanka cuntada iyo tamarta.",

    "Neef qoto dheer qaado.|Socod gaaban samee haddii aad awooddo.|Raadi taageero markaad u baahan tahay.",

    "Jawaab aan cunto ahayn oo walbahaar ah?",

    "Socod gaaban|Is canaan|Ka bood cuntada",

    0,

    "Waxaad dhisan kartaa dhowr hab oo aad walbahaar uga jawaabto.",

    "Samee 5 daqiiqo oo nasasho ama socod ah.",
  ],

  [
    "Maskaxda",

    "Dhaqdhaqaaq yar ayaa xisaabtamaya",

    "Dhaqdhaqaaqu ma aha inuu mar walba noqdo jimicsi dheer.",

    "Socod gaaban waa dhaqdhaqaaq.|Tallaabooyin yaryar ku dar.|Dooro wax aad ku raaxaysato.",

    "Kee ayaa sax ah?",

    "Kaliya gym ayaa xisaabtamaya|Dhaqdhaqaaqyo yaryar sidoo kale way xisaabtamaan",

    1,

    "Dhaqdhaqaaqa la samayn karo ayaa fudud in la joogteeyo.",

    "Ku dar 500 tallaabo maanta haddii ay kuu habboon tahay.",
  ],

  [
    "Dib-u-eegis",

    "Ka fogow 'dhammaan ama waxba'",

    "Hal doorasho ma qeexdo maalinta, hal maalinina ma qeexdo toddobaadka.",

    "Hal doorasho ma qeexdo maalinta.|Dib ayaad u bilaabi kartaa.|Tallaabada xigta ayaa muhiim ah.",

    "Haddii qadadu qorshaha kaa baxdo?",

    "Cashada ku noqo qorshaha|Toddobaadka oo dhan jooji",

    0,

    "Waxaad dib u bilaabi kartaa cuntada xigta.",

    "Xusuuso: Tallaabada xigta ayaan dooran karaa.",
  ],

  [
    "Guul waarta",

    "Weekend-ka",

    "Weekend-ku wuxuu yeelan karaa jadwal ka duwan maalmaha kale, sidaas darteed qorshe dabacsan ayaa caawin kara.",

    "Qorshee hal ama laba cunto.|Dhaqdhaqaaqa ha ilaawin.|Dabacsanaan u oggolow nolosha.",

    "Weekend-ka qorshaha ugu fiican?",

    "Wax qorshe ah ma jiro|Qorshe fudud oo dabacsan",

    1,

    "Dabacsanaan iyo qorshe ayaa wada shaqayn kara.",

    "Qorshee hal cunto weekend-ka.",
  ],

  [
    "Guul waarta",

    "Cuntada qoyska",

    "Uma baahnid inaad qoyskaaga ka go'do si aad yoolkaaga u raacdo.",

    "Cunto wadaag ah qaybteeda hagaaji.|Ku dar protein iyo khudaar.|Dhaqankaaga cuntada waa muhiim.",

    "Qorshe waara waa inuu?",

    "Ka gooyaa qoyska|La jaanqaadaa noloshaada marka ay suurtagal tahay",

    1,

    "Qorshaha waa inuu ku shaqeeyaa nolosha dhabta ah.",

    "Dooro hal cunto qoys oo qaybteeda si fudud loo hagaajin karo.",
  ],

  [
    "Guul waarta",

    "Xafladaha iyo munaasabadaha",

    "Munaasabaduhu waa qayb nolosha ka mid ah. Hal dhacdo ma burburiso horumarka.",

    "Dooro waxa aad dhab ahaan rabto.|Si tartiib ah u cun.|Ku noqo caadadaada cuntada xigta.",

    "Xaflad kadib maxaa fiican?",

    "Is ciqaab|Ku noqo caadadaada",

    1,

    "Soo noqoshadu waa xirfad muhiim ah.",

    "Samee qorshe fudud munaasabadda xigta.",
  ],

  [
    "Guul waarta",

    "La shaqee rabitaanka cuntada",

    "Rabitaanku wuu imaan karaa wuuna tagi karaa. Uma baahnid inaad ka baqdo.",

    "Ogow waxa aad rabto.|Sug dhowr daqiiqo haddii aad rabto.|Dooro si miyir leh.",

    "Rabitaanku mar walba ma yahay amar?",

    "Haa|Maya",

    1,

    "Rabitaan waa dareen, waxaadna leedahay doorasho.",

    "Marka rabitaan yimaado, qiimee xooggiisa 1–10.",
  ],

  [
    "Guul waarta",

    "Markaad qorshaha seegto",

    "Soo kabashadu waa qayb qorshaha ka mid ah, ma aha calaamad guuldarro.",

    "Aqoonso waxa dhacay.|Ha samayn magdhow xad-dhaaf ah.|Ku noqo tallaabada xigta.",

    "Soo kabasho caafimaad leh?",

    "Tallaabada xigta ku noqo|Cunto ka bood maalinta oo dhan",

    0,

    "Joogteynta waxaa ka mid ah dib u soo noqoshada.",

    "Qor qorshahaaga: haddii aan seego, markaas...",
  ],

  [
    "Guul waarta",

    "Guul aan miisaan ahayn",

    "Horumarka waxaa ka mid noqon kara tamar, socod, biyo, hurdo iyo sida dharkaagu kuu dareemo.",

    "Miisaanku waa hal xog.|Caadooyinku sidoo kale waa horumar.|U dabaaldeg waxa aad dhistay.",

    "Kee ayaa noqon kara guul aan miisaan ahayn?",

    "Socod badan|Kaliya lambarka scale-ka",

    0,

    "Horumarku wuxuu leeyahay wejiyo badan.",

    "Qor hal guul oo aan miisaan ahayn.",
  ],

  [
    "Guul waarta",

    "Deegaankaaga kuu shaqaysii",

    "Waxa kuu dhow oo kuu fudud ayaa saameyn kara doorashooyinkaaga.",

    "Cunto qorshaysan meel sahlan dhig.|Grocery list isticmaal.|Diyaari waxyaabo fudud.",

    "Deegaan taageera yoolkaaga?",

    "Qorshaha ka dhig mid fudud in la raaco|Wax walba ku tiirsan rabitaan xooggan",

    0,

    "Deegaan wanaagsan wuxuu yareeyaa culayska go'aan qaadashada.",

    "Hal shay oo qorshahaaga fududaynaya diyaari.",
  ],

  [
    "Guul waarta",

    "Qorshahaaga adiga ayuu kuu shaqeeyaa",

    "Qorshe waara wuxuu la jaanqaadaa dhaqankaaga, miisaaniyaddaada iyo jadwalkaaga.",

    "Wax ka beddel waxa aan kuu shaqayn.|Ilaali waxa kuu fudud.|Ha barbar dhigin safarkaaga qof kale.",

    "Qorshaha ugu fiican waa?",

    "Mid qof kale u shaqeeyay|Mid adiga kuu shaqayn kara muddo dheer",

    1,

    "Shakhsiyeyntu waa muhiim.",

    "Qor hal qayb oo kuu shaqaynaysa iyo hal aad rabto inaad hagaajiso.",
  ],

  [
    "Dhammaad & bilow cusub",

    "30 maalmood — maxaa xiga?",

    "Waxaad dhammaysay bil waxbarasho. Hadda diiradda saar caadooyinka aad rabto inay kula sii socdaan.",

    "Dib u eeg guulahaaga.|Dooro 2–3 caado muhiim ah.|Sii wad adigoon raadin kaamilnimo.",

    "Kadib 30 maalmood maxaa ugu muhiimsan?",

    "Jooji wax walba|Sii wad caadooyinka kuu shaqeeyay",

    1,

    "Ujeeddadu waa caadooyin sii jiri kara.",

    "Dooro saddex caado oo aad bisha xigta sii wadi doonto.",
  ],
];

const lessons: Lesson[] = lessonSeeds.map((x: any[], i) => ({
  day: i + 1,

  category: x[0],

  title: x[1],

  intro: x[2],

  points: x[3].split("|"),

  question: x[4],

  options: x[5].split("|"),

  answer: x[6],

  feedback: x[7],

  action: x[8],
}));

export default function DailyLessonScreen() {
  const params = useLocalSearchParams<{ day?: string }>();

  const [progress, setProgress] = useState<Progress>({
    completed: [],

    streak: 0,
  });

  const [open, setOpen] = useState(false);

  const [answer, setAnswer] = useState<number | null>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem(KEY);

        if (s) setProgress(JSON.parse(s));
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const nextDay = Math.min(progress.completed.length + 1, 30);

  const requestedDay = Number(
    Array.isArray(params.day) ? params.day[0] : params.day,
  );

  const canReviewRequestedDay =
    Number.isInteger(requestedDay) &&
    requestedDay >= 1 &&
    requestedDay <= 30 &&
    (progress.completed.includes(requestedDay) || requestedDay === nextDay);

  const viewDay = canReviewRequestedDay ? requestedDay : nextDay;

  const lesson = lessons[viewDay - 1];

  const reviewingCompleted = progress.completed.includes(viewDay);

  const finished = progress.completed.length >= 30;

  const percent = Math.round((progress.completed.length / 30) * 100);

  const complete = async () => {
    if (
      finished ||
      answer !== lesson.answer ||
      progress.completed.includes(lesson.day)
    )
      return;

    const t = today();

    const y = new Date();

    y.setDate(y.getDate() - 1);

    const yk = y.toISOString().slice(0, 10);

    const streak =
      progress.lastCompletedDate === t
        ? progress.streak
        : progress.lastCompletedDate === yk
          ? progress.streak + 1
          : 1;

    const next = {
      completed: [...progress.completed, lesson.day],

      lastCompletedDate: t,

      streak,
    };

    setProgress(next);

    await AsyncStorage.setItem(KEY, JSON.stringify(next));

    const ck = `caatoai-daily-checks-${t}`;

    const raw = await AsyncStorage.getItem(ck);

    const d = raw
      ? JSON.parse(raw)
      : {
          checks: { meal: false, water: false, lesson: false },

          waterCups: 0,

          steps: 0,
        };

    d.checks = { ...(d.checks || {}), lesson: true };

    await AsyncStorage.setItem(ck, JSON.stringify(d));

    setOpen(false);

    setAnswer(null);

    // Return to the main dashboard after the lesson is saved as completed.
    router.replace("/meal-plan");
  };

  if (!loaded)
    return (
      <View style={s.center}>
        <Text style={s.loading}>Casharrada waa la soo gelinayaa...</Text>
      </View>
    );

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.replace("/meal-plan")} style={s.back}>
        <Text style={s.backText}>‹ Dib u noqo</Text>
      </Pressable>

      <Text style={s.eyebrow}>CAATOAI • CASHARRADA</Text>

      <Text style={s.title}>
        {finished ? "30 maalmood waa dhammaadeen 🌿" : "Casharka maanta 🌿"}
      </Text>

      <Text style={s.subtitle}>
        Maalin kasta baro hal fikrad yar oo kaa caawin karta inaad dhisto
        caadooyin waara.
      </Text>

      <View style={s.progressCard}>
        <View style={s.progressTop}>
          <View>
            <Text style={s.big}>{progress.completed.length}/30</Text>

            <Text style={s.muted}>casharro dhammaatay</Text>
          </View>

          <View style={s.pill}>
            <Text style={s.pillText}>🔥 {progress.streak} maalmood</Text>
          </View>
        </View>

        <View style={s.track}>
          <View style={[s.fill, { width: `${percent}%` }]} />
        </View>

        <Text style={s.muted}>{percent}% safarka casharrada</Text>
      </View>

      {!finished || reviewingCompleted ? (
        <View style={s.card}>
          <Text style={s.tag}>
            MAALINTA {lesson.day} •{" "}
            {reviewingCompleted ? "DIB U EEGIS" : "3–5 DAQIIQO"}
          </Text>

          <Text style={s.category}>🌱 {lesson.category}</Text>

          <Text style={s.lessonTitle}>{lesson.title}</Text>

          <Text style={s.body}>{lesson.intro}</Text>

          {!open && !reviewingCompleted ? (
            <Pressable style={s.primary} onPress={() => setOpen(true)}>
              <Text style={s.primaryText}>Bilow casharka →</Text>
            </Pressable>
          ) : (
            <View style={{ marginTop: 18 }}>
              <Text style={s.section}>Waxa maanta muhiimka ah</Text>

              {lesson.points.map((p, i) => (
                <View key={i} style={s.point}>
                  <Text style={s.dot}>•</Text>

                  <Text style={s.pointText}>{p}</Text>
                </View>
              ))}

              <View style={s.questionBox}>
                <Text style={s.tag}>❓ SU'AAL DEGDEG AH</Text>

                <Text style={s.question}>{lesson.question}</Text>

                {lesson.options.map((o, i) => (
                  <Pressable
                    key={o}
                    onPress={() => setAnswer(i)}
                    style={[s.option, answer === i && s.optionOn]}
                  >
                    <Text
                      style={[s.optionText, answer === i && s.optionTextOn]}
                    >
                      {answer === i ? "✓ " : "○ "}

                      {o}
                    </Text>
                  </Pressable>
                ))}

                {answer !== null && (
                  <Text
                    style={[
                      s.feedback,

                      answer === lesson.answer ? s.good : s.try,
                    ]}
                  >
                    {answer === lesson.answer
                      ? "✓ " + lesson.feedback
                      : "🌿 Isku day mar kale. Ujeeddadu waa fahamka, ma aha kaamilnimo."}
                  </Text>
                )}
              </View>

              <View style={s.action}>
                <Text style={s.actionTag}>🎯 TALLAABADA MAANTA</Text>

                <Text style={s.actionText}>{lesson.action}</Text>
              </View>

              {reviewingCompleted ? (
                <Pressable
                  style={s.reviewDone}
                  onPress={() => router.push("/lesson-history")}
                >
                  <Text style={s.reviewDoneText}>
                    ✓ Casharkan waa la dhammeeyay • Ku noqo taariikhda
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  disabled={answer !== lesson.answer}
                  onPress={complete}
                  style={[s.primary, answer !== lesson.answer && s.disabled]}
                >
                  <Text style={s.primaryText}>
                    {answer === lesson.answer
                      ? "✓ Dhammee casharka"
                      : "Ka jawaab su'aasha si aad u dhamayso"}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={s.finish}>
          <Text style={{ fontSize: 48 }}>🏆</Text>

          <Text style={s.finishTitle}>Hambalyo!</Text>

          <Text style={s.body}>
            Waxaad dhammaysay 30-ka cashar. Sii wad caadooyinka kuu shaqeeyay.
          </Text>
        </View>
      )}

      <Pressable
        style={s.historyButton}
        onPress={() => router.push("/lesson-history")}
      >
        <Text style={s.historyButtonText}>📚 Eeg taariikhda casharrada →</Text>
      </Pressable>

      <Text style={s.heading}>Safarka 30-ka maalmood</Text>

      <View style={s.grid}>
        {lessons.map((l) => {
          const done = progress.completed.includes(l.day),
            cur = !finished && l.day === nextDay,
            locked = l.day > nextDay;

          return (
            <View
              key={l.day}
              style={[s.day, done && s.dayDone, cur && s.dayCurrent]}
            >
              <Text style={[s.dayNum, done && { color: "#166534" }]}>
                {done ? "✓" : l.day}
              </Text>

              <Text numberOfLines={1} style={s.dayLabel}>
                {locked ? "🔒" : l.category}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBF5" },

  center: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#FFFBF5",
  },

  content: {
    width: "100%",

    maxWidth: 680,

    alignSelf: "center",

    paddingHorizontal: 22,

    paddingTop: 22,

    paddingBottom: 60,
  },

  loading: { color: "#166534", fontWeight: "800" },

  back: {
    alignSelf: "flex-start",

    paddingVertical: 8,

    paddingRight: 20,

    marginBottom: 12,
  },

  backText: { fontSize: 16, fontWeight: "800", color: "#166534" },

  eyebrow: {
    fontSize: 11,

    fontWeight: "900",

    letterSpacing: 1.1,

    color: "#15803D",

    marginBottom: 7,
  },

  title: { fontSize: 30, fontWeight: "900", color: "#1F2937" },

  subtitle: {
    fontSize: 14,

    lineHeight: 21,

    color: "#6B7280",

    marginTop: 7,

    marginBottom: 18,
  },

  progressCard: {
    backgroundColor: "#FFF",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 22,

    padding: 18,

    marginBottom: 16,
  },

  progressTop: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  big: { fontSize: 24, fontWeight: "900", color: "#166534" },

  muted: { fontSize: 11, color: "#6B7280", marginTop: 4 },

  pill: {
    backgroundColor: "#F0FDF4",

    paddingHorizontal: 11,

    paddingVertical: 8,

    borderRadius: 999,
  },

  pillText: { fontSize: 11, fontWeight: "900", color: "#166534" },

  track: {
    height: 9,

    backgroundColor: "#DCFCE7",

    borderRadius: 999,

    overflow: "hidden",

    marginTop: 15,
  },

  fill: { height: "100%", backgroundColor: "#166534" },

  card: {
    backgroundColor: "#FFF",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 24,

    padding: 20,
  },

  tag: {
    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 0.7,

    color: "#15803D",
  },

  category: {
    fontSize: 12,

    fontWeight: "800",

    color: "#166534",

    marginTop: 10,
  },

  lessonTitle: {
    fontSize: 23,

    lineHeight: 29,

    fontWeight: "900",

    color: "#1F2937",

    marginTop: 8,
  },

  body: { fontSize: 14, lineHeight: 22, color: "#4B5563", marginTop: 9 },

  primary: {
    backgroundColor: "#166534",

    borderRadius: 15,

    paddingVertical: 15,

    alignItems: "center",

    marginTop: 18,
  },

  primaryText: { color: "#FFF", fontWeight: "900", fontSize: 14 },

  disabled: { backgroundColor: "#A8A29E" },

  section: {
    fontSize: 16,

    fontWeight: "900",

    color: "#1F2937",

    marginBottom: 9,
  },

  point: { flexDirection: "row", gap: 8, marginBottom: 8 },

  dot: { color: "#166534", fontSize: 18, fontWeight: "900" },

  pointText: { flex: 1, fontSize: 14, lineHeight: 21, color: "#4B5563" },

  questionBox: {
    backgroundColor: "#F0FDF4",

    borderRadius: 18,

    padding: 16,

    marginTop: 14,
  },

  question: {
    fontSize: 16,

    lineHeight: 22,

    fontWeight: "900",

    color: "#1F2937",

    marginTop: 7,

    marginBottom: 12,
  },

  option: {
    backgroundColor: "#FFF",

    borderWidth: 1,

    borderColor: "#D1D5DB",

    borderRadius: 13,

    padding: 13,

    marginBottom: 8,
  },

  optionOn: { borderColor: "#16A34A", backgroundColor: "#DCFCE7" },

  optionText: { fontSize: 13, fontWeight: "700", color: "#374151" },

  optionTextOn: { color: "#166534" },

  feedback: { fontSize: 12, lineHeight: 18, fontWeight: "700", marginTop: 7 },

  good: { color: "#166534" },

  try: { color: "#92400E" },

  action: {
    backgroundColor: "#FFFBEB",

    borderRadius: 18,

    padding: 16,

    marginTop: 15,
  },

  actionTag: { fontSize: 10, fontWeight: "900", color: "#92400E" },

  actionText: {
    fontSize: 14,

    lineHeight: 21,

    color: "#44403C",

    fontWeight: "700",

    marginTop: 6,
  },

  reviewDone: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    marginTop: 18,
  },
  reviewDoneText: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  historyButton: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: "center",
  },
  historyButtonText: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "900",
  },
  heading: {
    fontSize: 18,

    fontWeight: "900",

    color: "#1F2937",

    marginTop: 26,

    marginBottom: 12,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  day: {
    width: "18%",

    minWidth: 92,

    backgroundColor: "#FFF",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 14,

    padding: 10,
  },

  dayDone: { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" },

  dayCurrent: { borderColor: "#166534", borderWidth: 2 },

  dayNum: { fontSize: 15, fontWeight: "900", color: "#1F2937" },

  dayLabel: { fontSize: 9, color: "#78716C", marginTop: 4 },

  finish: {
    backgroundColor: "#FFF",

    borderWidth: 1,

    borderColor: "#BBF7D0",

    borderRadius: 24,

    padding: 26,

    alignItems: "center",
  },

  finishTitle: {
    fontSize: 26,

    fontWeight: "900",

    color: "#166534",

    marginTop: 8,
  },
});
