// Internationalization data for quiz
// Provides English (en) and Arabic (ar) versions of:
// - UI strings
// - Questions (text + answers)
// - Character display metadata (names / titles / descriptions / traits)
// Scoring keys remain the same so logic does not change.

export const uiTranslations = {
  en: {
    personalityTest: 'Personality Test',
    discoverLine: 'Discover which Straw Hat Pirate matches your personality!',
    startAdventure: 'Start Your Adventure',
    joinCrew: "Join Luffy's crew and find your place on the Thousand Sunny! ⚓",
    howItWorks: 'HOW IT WORKS',
    howItWorksDesc: 'Answer 32 scenario-based questions crafted to map your choices to the core traits of each Straw Hat pirate.',
    whatYouGet: 'WHAT YOU GET',
    whatYouGetDesc: 'A primary match, full ranking of all crew members, personality trait breakdown, and a dynamic poster view.',
    accuracyFocus: 'ACCURACY FOCUS',
    accuracyFocusDesc: 'Balanced scoring weights prevent ties and ensure each answer pushes you toward the most authentic match.',
    statsQuestions: '32 QUESTIONS',
    statsCharacters: '10 CHARACTERS',
    statsReplays: 'UNLIMITED REPLAYS',
    questionUpper: 'QUESTION',
    bestMatch: 'Best Match',
    yourCharacterIs: 'Your One Piece Character is',
    match: 'Match',
    completeAnalysis: 'Complete Personality Analysis',
    seeHowYouMatch: 'See how you match with all One Piece characters',
    personalityTraits: 'Your Personality Traits',
    takeAgain: 'Take Quiz Again',
    shareResult: 'Share Result',
    viewPoster: 'View Wanted Poster',
    language: 'Language',
    arabic: 'العربية',
    english: 'English'
  },
  ar: {
    personalityTest: 'اختبار الشخصية',
    discoverLine: 'اكتشف أي فرد من قراصنة قبعة القش يشبه شخصيتك!',
    startAdventure: 'ابدأ مغامرتك',
    joinCrew: 'انضم إلى طاقم لوفي وابحث عن مكانك على الألف ساني! ⚓',
    howItWorks: 'كيف يعمل',
    howItWorksDesc: 'أجب عن ٣٢ سؤالًا مبنيًا على مواقف لتحديد الصفات الأقرب لشخصيتك بين أفراد الطاقم.',
    whatYouGet: 'ماذا ستحصل',
    whatYouGetDesc: 'نتيجة شخصية أساسية، ترتيب كامل لكل أفراد الطاقم، تحليل للسمات، وعرض ملصق تفاعلي.',
    accuracyFocus: 'دقة التحليل',
    accuracyFocusDesc: 'أوزان متوازنة تقلل التعادلات وتضمن تطابقًا أكثر واقعية.',
    statsQuestions: '٣٢ سؤال',
    statsCharacters: '١٠ شخصيات',
    statsReplays: 'محاولات غير محدودة',
    questionUpper: 'السؤال',
    bestMatch: 'أفضل تطابق',
    yourCharacterIs: 'شخصيتك الأقرب هي',
    match: 'تطابق',
    completeAnalysis: 'التحليل الكامل للشخصيات',
    seeHowYouMatch: 'شاهد نسبة توافقك مع جميع الشخصيات',
    personalityTraits: 'سماتك الشخصية',
    takeAgain: 'أعد الاختبار',
    shareResult: 'مشاركة النتيجة',
    viewPoster: 'عرض الملصق',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
    partialNotice: 'تمت ترجمة جزء من الأسئلة – بقية الأسئلة ستظهر بالإنجليزية مؤقتًا.',
    partialNoticeShort: 'بعض الأسئلة لم تُترجم بعد.'
  }
};

// English questions imported from existing file (kept separate to avoid duplication)
import { questions as questionsEnOriginal, characters as charactersEnOriginal } from './questions';

// Arabic translations for questions (parallel structure). Only text fields translated.
// NOTE: Score objects remain unchanged.
export const questionsAr = [
  { id: 1, question: 'ما الدور الذي تتخذه عادةً في المجموعة؟', answers: [
    { text: 'القائد الذي يلهم الجميع', scores: { luffy: 3, zoro: 1, jinbe: 1 } },
    { text: 'الداعم الوفي الذي يتبع القائد', scores: { zoro: 3, chopper: 2, jinbe: 1 } },
    { text: 'المخطط الذي يرص كل شيء بعناية', scores: { nami: 3, robin: 2, jinbe: 1 } },
    { text: 'المرح الذي يرفع معنويات الجميع', scores: { luffy: 2, brook: 3, franky: 1 } }
  ]},
  { id: 2, question: 'ما هي مغامرتك المثالية؟', answers: [
    { text: 'استكشاف أراضٍ غير معروفة', scores: { luffy: 3, robin: 2, franky: 1 } },
    { text: 'البحث عن الكنوز والثروات', scores: { nami: 3, luffy: 1, usopp: 1 } },
    { text: 'التعرف على شعوب وثقافات جديدة', scores: { luffy: 2, sanji: 2, brook: 2, jinbe: 1 } },
    { text: 'حل الألغاز والآثار القديمة', scores: { robin: 3, chopper: 1, brook: 1 } }
  ]},
  { id: 3, question: 'كيف تتصرف تحت الضغط؟', answers: [
    { text: 'أبقى هادئًا وأفكر بمنطقية', scores: { robin: 3, jinbe: 3, nami: 1 } },
    { text: 'أواجه الموقف بعزيمة وقوة', scores: { luffy: 3, zoro: 3, sanji: 1 } },
    { text: 'أرتبك أولاً ثم أجد شجاعتي', scores: { usopp: 3, chopper: 2, nami: 1 } },
    { text: 'أطلق النكات لتخفيف التوتر', scores: { brook: 3, luffy: 2, franky: 1 } }
  ]},
  { id: 4, question: 'اختر لونًا أو طابعًا مفضلًا:', answers: [
    { text: 'أحمر – جريء وحيوي', scores: { luffy: 3, franky: 1, sanji: 1 } },
    { text: 'أخضر – طبيعي وقوي', scores: { zoro: 3, chopper: 1, jinbe: 1 } },
    { text: 'برتقالي – مشرق ومبهج', scores: { nami: 3, usopp: 1, brook: 1 } },
    { text: 'أزرق – هادئ وغامض', scores: { robin: 3, jinbe: 2, brook: 1 } }
  ]},
  { id: 5, question: 'ما قوتك في الأزمات؟', answers: [
    { text: 'القوة البدنية والقتال', scores: { luffy: 2, zoro: 3, sanji: 2, jinbe: 1 } },
    { text: 'الذكاء وحل المشكلات', scores: { nami: 3, robin: 3, chopper: 1 } },
    { text: 'الإبداع والابتكار', scores: { usopp: 3, franky: 2, nami: 1 } },
    { text: 'الدعم العاطفي والشفاء', scores: { chopper: 3, sanji: 2, brook: 1, jinbe: 1 } }
  ]},
  { id: 6, question: 'ما الذي يحفزك أكثر؟', answers: [
    { text: 'الحرية والمغامرة', scores: { luffy: 3, brook: 2, franky: 1 } },
    { text: 'حماية الأحبة', scores: { zoro: 3, sanji: 3, chopper: 2, jinbe: 1 } },
    { text: 'تحقيق الأحلام الشخصية', scores: { nami: 3, usopp: 2, robin: 1, franky: 1 } },
    { text: 'المعرفة والفهم', scores: { robin: 3, chopper: 2, jinbe: 2 } }
  ]},
  { id: 7, question: 'كيف تتعامل مع الصراع؟', answers: [
    { text: 'أواجهه مباشرة بثقة', scores: { luffy: 3, zoro: 2, sanji: 1 } },
    { text: 'أبحث عن حل سلمي', scores: { jinbe: 3, chopper: 2, robin: 1 } },
    { text: 'أستخدم الحيلة والاستراتيجية', scores: { nami: 3, robin: 2, usopp: 1 } },
    { text: 'أتجنبه أو أُخففه بالمزاح', scores: { usopp: 2, brook: 3, chopper: 1 } }
  ]},
  { id: 8, question: 'ما نوع طعامك المفضل؟', answers: [
    { text: 'اللحم! الكثير منه!', scores: { luffy: 3, zoro: 1, franky: 1 } },
    { text: 'أطباق أنيقة بعرض متقن', scores: { sanji: 3, robin: 1, nami: 1 } },
    { text: 'حلويات ومسكرات', scores: { chopper: 3, brook: 1, usopp: 1 } },
    { text: 'وجبات صحية ومغذية', scores: { jinbe: 2, chopper: 2, robin: 1 } }
  ]},
  { id: 9, question: 'كيف تقضي وقت فراغك؟', answers: [
    { text: 'التدريب وزيادة القوة', scores: { zoro: 3, luffy: 2, sanji: 1 } },
    { text: 'قراءة الكتب والدراسة', scores: { robin: 3, chopper: 2, nami: 1 } },
    { text: 'ابتكار اختراعات أو فن', scores: { franky: 3, usopp: 2, nami: 1 } },
    { text: 'العزف والترفيه', scores: { brook: 3, luffy: 1, franky: 1 } }
  ]},
  { id: 10, question: 'ما أكبر مخاوفك؟', answers: [
    { text: 'عدم قدرتي على حماية أصدقائي', scores: { zoro: 3, sanji: 2, chopper: 2, jinbe: 1 } },
    { text: 'أن أُنسى أو أبقى وحيدًا', scores: { brook: 3, chopper: 2, usopp: 1 } },
    { text: 'ألا أحقق أحلامي', scores: { luffy: 3, nami: 2, usopp: 2, franky: 1 } },
    { text: 'فقدان معرفتي أو ذكرياتي', scores: { robin: 3, chopper: 1, brook: 1 } }
  ]},
  { id: 11, question: 'أي سلاح تختار؟', answers: [
    { text: 'قبضتاي— أنا السلاح!', scores: { luffy: 3, jinbe: 2, sanji: 1 } },
    { text: 'ثلاث سيوف لأقصى قوة', scores: { zoro: 3, luffy: 1 } },
    { text: 'نقافة بذخيرة مبتكرة', scores: { usopp: 3, nami: 1, franky: 1 } },
    { text: 'شيء أنيق ودقيق', scores: { robin: 2, sanji: 2, brook: 2 } }
  ]},
  { id: 12, question: 'كيف تتخذ القرارات المهمة؟', answers: [
    { text: 'أتبع حدسي الداخلي', scores: { luffy: 3, zoro: 2, brook: 1 } },
    { text: 'أحلل كل الحقائق بعناية', scores: { robin: 3, nami: 2, chopper: 1 } },
    { text: 'أفكر بما يناسب الجميع', scores: { jinbe: 3, sanji: 2, chopper: 2 } },
    { text: 'أبتكر حلاً مبدعًا', scores: { usopp: 3, franky: 2, nami: 1 } }
  ]},
  { id: 13, question: 'ما طقسُك المثالي؟', answers: [
    { text: 'مشمس ومشرق—مثالي للمغامرة!', scores: { luffy: 3, franky: 2, brook: 1 } },
    { text: 'هادئ وساكن', scores: { jinbe: 3, robin: 2, chopper: 1 } },
    { text: 'عاصف— أحب الحماس!', scores: { nami: 3, zoro: 1, luffy: 1 } },
    { text: 'بارد وضبابي— غموض لطيف', scores: { robin: 2, brook: 2, usopp: 1, zoro: 1 } }
  ]},
  { id: 14, question: 'كيف تُظهر اهتمامك بشخص ما؟', answers: [
    { text: 'أطبخ له وجبته المفضلة', scores: { sanji: 3, chopper: 1, jinbe: 1 } },
    { text: 'أحميه مهما حدث', scores: { zoro: 3, luffy: 2, jinbe: 1 } },
    { text: 'أساعده على تحقيق أحلامه', scores: { luffy: 3, nami: 1, franky: 1 } },
    { text: 'أستمع لهم وأعطي نصيحة', scores: { robin: 2, jinbe: 3, chopper: 2 } }
  ]},
  { id: 15, question: 'ما أسلوبك في التعلم؟', answers: [
    { text: 'أتعلم بالفعل وأخطاء الطريق', scores: { luffy: 3, franky: 2, usopp: 1 } },
    { text: 'أدرس الكتب والبحوث بعمق', scores: { robin: 3, chopper: 2, nami: 1 } },
    { text: 'أكرر نفس التقنية كثيرًا', scores: { zoro: 3, sanji: 1, brook: 1 } },
    { text: 'أتعلم من تجارب وقصص الآخرين', scores: { brook: 2, jinbe: 3, usopp: 2 } }
  ]},
  { id: 16, question: 'ما الذي يجعلك تستيقظ كل صباح؟', answers: [
    { text: 'حماس مغامرات جديدة!', scores: { luffy: 3, franky: 2, brook: 1 } },
    { text: 'مسؤوليتي تجاه الطاقم/الأصدقاء', scores: { zoro: 3, jinbe: 2, sanji: 2 } },
    { text: 'التقدم نحو أهدافي الخاصة', scores: { nami: 3, usopp: 2, robin: 2 } },
    { text: 'فرصة مساعدة الآخرين', scores: { chopper: 3, sanji: 2, jinbe: 1 } }
  ]},
  { id: 17, question: 'كيف تتعامل مع الانتقاد؟', answers: [
    { text: 'أتجاهله وأتابع ما أؤمن به', scores: { luffy: 3, zoro: 2, franky: 1 } },
    { text: 'أحلل إن كان فيه حق وأتحسن', scores: { robin: 3, nami: 2, chopper: 1 } },
    { text: 'أت Defensive ثم أفكر فيه لاحقًا', scores: { sanji: 2, usopp: 3, nami: 1 } },
    { text: 'أمزح لأخففه ثم أفكر لاحقًا', scores: { brook: 3, usopp: 2, luffy: 1 } }
  ]},
  { id: 18, question: 'ما عطلتك المثالية؟', answers: [
    { text: 'استكشاف جزيرة غامضة جديدة', scores: { luffy: 3, robin: 2, franky: 1 } },
    { text: 'الاسترخاء على شاطئ هادئ', scores: { jinbe: 3, brook: 2, chopper: 1 } },
    { text: 'التسوق والاستمتاع بالفخامة', scores: { nami: 3, sanji: 1, chopper: 1 } },
    { text: 'التدريب في بيئة صعبة', scores: { zoro: 3, luffy: 1, sanji: 1 } }
  ]},
  { id: 19, question: 'كيف تتعامل مع الفشل؟', answers: [
    { text: 'أقف فورًا وأحاول مجددًا', scores: { luffy: 3, zoro: 2, franky: 1 } },
    { text: 'أحلل الخطأ وأخطط أفضل', scores: { nami: 3, robin: 2, chopper: 1 } },
    { text: 'أشعر بالإحباط ثم أجد شجاعتي', scores: { usopp: 3, chopper: 2, brook: 1 } },
    { text: 'أتقبله بهدوء وأتعلم منه', scores: { jinbe: 3, robin: 2, brook: 1 } }
  ]},
  { id: 20, question: 'ما أسلوب تواصلك؟', answers: [
    { text: 'مباشر وصريح', scores: { luffy: 3, zoro: 2, franky: 1 } },
    { text: 'متفكر وغامض', scores: { robin: 3, jinbe: 1, brook: 1 } },
    { text: 'عاطفي وتعبيري', scores: { sanji: 3, chopper: 2, usopp: 1 } },
    { text: 'مرح وترفيهي', scores: { brook: 3, usopp: 2, luffy: 1 } }
  ]},
  { id: 21, question: 'ما أكبر قوة لديك؟', answers: [
    { text: 'إصرار لا يتزحزح', scores: { luffy: 3, zoro: 2, usopp: 1 } },
    { text: 'الذكاء والحكمة', scores: { robin: 3, nami: 2, jinbe: 2 } },
    { text: 'الولاء والتفاني', scores: { zoro: 3, chopper: 2, jinbe: 1 } },
    { text: 'الإبداع والابتكار', scores: { usopp: 3, franky: 2, nami: 1 } }
  ]},
  { id: 22, question: 'كيف تفضل حل المشكلات؟', answers: [
    { text: 'أخترقها بالقوة', scores: { luffy: 3, zoro: 2, franky: 1 } },
    { text: 'أفكر خطوة بخطوة', scores: { robin: 3, nami: 2, jinbe: 1 } },
    { text: 'أجد حلاً مبتكرًا', scores: { usopp: 3, franky: 2, brook: 1 } },
    { text: 'أطلب مساعدة الأصدقاء', scores: { chopper: 3, luffy: 1, brook: 1 } }
  ]},
  { id: 23, question: 'ما علاقتك بالمال؟', answers: [
    { text: 'مال؟ ما هذا؟ أريد المغامرة!', scores: { luffy: 3, zoro: 1, brook: 1 } },
    { text: 'مهم جدًا للأمان', scores: { nami: 3, usopp: 1, chopper: 1 } },
    { text: 'أنفقه على شغفي', scores: { franky: 3, sanji: 2, luffy: 1 } },
    { text: 'يجب استخدامه بحكمة ومسؤولية', scores: { jinbe: 3, robin: 2, chopper: 1 } }
  ]},
  { id: 24, question: 'كيف تتعامل مع التوتر؟', answers: [
    { text: 'أخذ قيلولة وسيُحل كل شيء', scores: { luffy: 3, brook: 2, zoro: 1 } },
    { text: 'أتدرّب بقوة لتفريغه', scores: { zoro: 3, sanji: 2, luffy: 1 } },
    { text: 'أخطط وأنظم لاستعادة السيطرة', scores: { nami: 3, robin: 2, jinbe: 1 } },
    { text: 'أتحدث مع الأصدقاء أو أساعد الآخرين', scores: { chopper: 3, sanji: 1, brook: 1 } }
  ]},
  { id: 25, question: 'ما دورك المثالي في الطاقم؟', answers: [
    { text: 'القائد – قيادة المغامرة', scores: { luffy: 3, zoro: 1, jinbe: 1 } },
    { text: 'الملاحة – إبقاء الجميع على المسار', scores: { nami: 3, robin: 1, jinbe: 1 } },
    { text: 'الطبيب – رعاية صحة الجميع', scores: { chopper: 3, sanji: 1, jinbe: 1 } },
    { text: 'الترفيه – رفع المعنويات', scores: { brook: 3, usopp: 2, franky: 1 } }
  ]},
  { id: 26, question: 'كيف تنظر إلى الماضي؟', answers: [
    { text: 'خلفي— أركز على الآن!', scores: { luffy: 3, franky: 2, brook: 1 } },
    { text: 'أتعلم من أخطاء الماضي', scores: { jinbe: 3, robin: 2, nami: 1 } },
    { text: 'ذكريات تؤرقني أحيانًا', scores: { robin: 2, brook: 3, sanji: 2, chopper: 1 } },
    { text: 'أُكرم الماضي لكن لا أعيش فيه', scores: { zoro: 3, jinbe: 2, usopp: 1 } }
  ]},
  { id: 27, question: 'ما طريقتك في الصداقة؟', answers: [
    { text: 'الأصدقاء أهم شيء!', scores: { luffy: 3, chopper: 2, brook: 1 } },
    { text: 'وفي بصمت وحامٍ', scores: { zoro: 3, robin: 2, jinbe: 1 } },
    { text: 'أظهر الاهتمام بالأفعال لا بالكلام', scores: { sanji: 3, chopper: 2, franky: 1 } },
    { text: 'أقدر الروابط العميقة ذات المعنى', scores: { robin: 3, jinbe: 2, brook: 1 } }
  ]},
  { id: 28, question: 'كيف تتصرف في المواقف غير المتوقعة؟', answers: [
    { text: 'أتحمس – هذا ممتع!', scores: { luffy: 3, franky: 2, brook: 1 } },
    { text: 'أبقى هادئًا وأقيّم الوضع', scores: { robin: 3, jinbe: 2, nami: 1 } },
    { text: 'أرتبك قليلًا ثم أتأقلم بسرعة', scores: { usopp: 3, chopper: 2, nami: 1 } },
    { text: 'أواجهه بثقة', scores: { zoro: 3, sanji: 2, luffy: 1 } }
  ]},
  { id: 29, question: 'ما فلسفتك في الحياة؟', answers: [
    { text: 'عش بحرية واتبع أحلامك!', scores: { luffy: 3, brook: 2, franky: 1 } },
    { text: 'الشرف والواجب وحماية الآخرين', scores: { zoro: 3, jinbe: 3, sanji: 1 } },
    { text: 'المعرفة أعظم كنز', scores: { robin: 3, chopper: 2, nami: 1 } },
    { text: 'كن صادقًا مع نفسك وأسعد الآخرين', scores: { brook: 3, chopper: 2, usopp: 1 } }
  ]},
  { id: 30, question: 'ما الإرث الذي تريد تركه؟', answers: [
    { text: 'أن أُذكر كأكثر شخص حر', scores: { luffy: 3, brook: 1, franky: 1 } },
    { text: 'أن أكون الأقوى والأكثر اعتمادًا عليه', scores: { zoro: 3, jinbe: 2, sanji: 1 } },
    { text: 'أن أساعد الآخرين في تحقيق أحلامهم', scores: { chopper: 3, sanji: 2, jinbe: 2 } },
    { text: 'أن أكشف حقائق مهمة', scores: { robin: 3, nami: 1, usopp: 1 } }
  ]},
  { id: 31, question: 'كيف تحتفل بالانتصارات؟', answers: [
    { text: 'حفل ضخم مع الكثير من الطعام!', scores: { luffy: 3, franky: 2, brook: 2 } },
    { text: 'أقدّر الإنجاز بهدوء', scores: { zoro: 3, robin: 2, jinbe: 1 } },
    { text: 'أشارك النجاح مع الجميع', scores: { chopper: 3, sanji: 2, usopp: 1 } },
    { text: 'أخطط للتحدي التالي', scores: { nami: 3, robin: 1, jinbe: 1 } }
  ]},
  { id: 32, question: 'ما أمنيتك العظمى؟', answers: [
    { text: 'العثور على الكنز الحرية المطلقة', scores: { luffy: 3, nami: 1, brook: 1 } },
    { text: 'أن أصبح الأعظم في مجالي', scores: { zoro: 3, sanji: 2, chopper: 1 } },
    { text: 'أن ألتقي مجددًا بمن هو ثمين لدي', scores: { brook: 3, chopper: 2, sanji: 1 } },
    { text: 'كشف حقيقة العالم', scores: { robin: 3, nami: 1, jinbe: 1 } }
  ]},
];

// Provide a fallback if Arabic list not fully populated yet
export const getQuestions = (lang) => (lang === 'ar' ? (questionsAr.length ? questionsAr : questionsEnOriginal) : questionsEnOriginal);
export const isArabicQuestionsComplete = () => questionsAr.length === questionsEnOriginal.length;

// Character display metadata Arabic (keys unchanged)
export const charactersAr = {
  luffy: {
    name: 'مونكي دي لوفي',
    title: 'القائد والحالم',
    description: 'متفائل ومغامر وقائد بالفطرة! مثل لوفي تُلهم الآخرين بإصرارك وعدوى حماسك.',
    traits: ['شجاع','مرِح','قائد','مُصمم'],
    color: '#DC143C', image: './images/luffy.jpg', emoji: '👑'
  },
  zoro: {
    name: 'رورونوا زورو',
    title: 'السياف والرفيق الأول',
    description: 'وفيّ ومنضبط ومركّز بشدة. مثلك مثله يعتمد عليك الآخرون وستقاتل حتى النهاية.',
    traits: ['وفي','جاد','منضبط','قوي'],
    color: '#228B22', image: './images/zoro.jpg', emoji: '⚔️'
  },
  nami: {
    name: 'نامي',
    title: 'الملاحة والمخططة',
    description: 'ذكية وواسعة الحيلة وطموحة. تفكر بخطوات مسبقة وتعرف كيف توجه المسار.',
    traits: ['ذكية','واسعة الحيلة','طموحة','استراتيجية'],
    color: '#FF8C00', image: './images/nami.jpg', emoji: '🗺️'
  },
  sanji: {
    name: 'سانجي',
    title: 'الطباخ والفارس',
    description: 'نبيل وعاطفي وحنون. تضع احتياجات الآخرين قبل نفسك وتظهر مشاعرك بوضوح.',
    traits: ['نبيل','عاطفي','حنون','شغوف'],
    color: '#FFD700', image: './images/sanji.jpg', emoji: '👨‍🍳'
  },
  usopp: {
    name: 'أوسوب',
    title: 'القناص والقصاص',
    description: 'مبدع أحيانًا قَلِق لكنك شجاع حين يلزم. تلمع في اللحظات الحاسمة.',
    traits: ['مبدع','شجاع','راوٍ','مبتكر'],
    color: '#DEB887', image: './images/usoop.jpg', emoji: '🎯'
  },
  chopper: {
    name: 'توني توني تشوبر',
    title: 'الطبيب وقلب الطاقم',
    description: 'طيب ولطيف ويمتلك طبيعة علاجية. تنشر الدفء من حولك.',
    traits: ['طيب','لطيف','معالج','بريء'],
    color: '#FFB6C1', image: './images/chopper.jpg', emoji: '🩺'
  },
  robin: {
    name: 'نيكو روبين',
    title: 'عالمة الآثار والباحثة',
    description: 'غامضة وذكية وهادئة تحت الضغط. تقدّر المعرفة ولديك عمق فكري.',
    traits: ['غامضة','ذكية','هادئة','علمية'],
    color: '#9370DB', image: './images/robin.jpg', emoji: '📜'
  },
  franky: {
    name: 'فرانكي',
    title: 'البنّاء والمخترع',
    description: 'متحمس واستعراضي وتحب الصنع والإبداع. شغفك معدٍ!',
    traits: ['متحمس','استعراضي','مخترع','سوبر'],
    color: '#00CED1', image: './images/franky.jpg', emoji: '🔧'
  },
  brook: {
    name: 'بروك',
    title: 'الموسيقي وملك الأرواح',
    description: 'مرح وهادئ وتنشر البهجة. تجد الفكاهة في كل موقف.',
    traits: ['مرح','هادئ','موسيقي','متفائل'],
    color: '#2F4F4F', image: './images/brook.jpg', emoji: '🎵'
  },
  jinbe: {
    name: 'جينبي',
    title: 'الدفة والناصح الحكيم',
    description: 'حكيم وهادئ وشريف. صوت العقل ويعتمد عليك للاستقرار.',
    traits: ['حكيم','هادئ','شريف','موثوق'],
    color: '#4682B4', image: './images/jimbei.jpg', emoji: '⚓'
  }
};

export const getCharacters = (lang) => (lang === 'ar' ? charactersAr : charactersEnOriginal);
export const getUI = (lang) => uiTranslations[lang] || uiTranslations.en;
export const questionsEn = questionsEnOriginal;
export const charactersEn = charactersEnOriginal;
