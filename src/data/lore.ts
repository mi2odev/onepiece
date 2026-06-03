import type { CharacterKey, Lang } from '../types';

// Rich character intro content (bilingual). Drawn from each Straw Hat's canon
// spirit — used by the result reveal's "character intro" section.

interface Bi {
  en: string;
  ar: string;
}
interface BiList {
  en: string[];
  ar: string[];
}

export interface Lore {
  quote: Bi;
  dream: Bi;
  fightingStyle: Bi;
  strengths: BiList;
  weaknesses: BiList;
}

export const lore: Record<CharacterKey, Lore> = {
  luffy: {
    quote: { en: "I'm gonna be King of the Pirates!", ar: 'سأصبح ملك القراصنة!' },
    dream: { en: 'Find the One Piece and become the Pirate King.', ar: 'إيجاد الون بيس وأن يصبح ملك القراصنة.' },
    fightingStyle: { en: 'Gum-Gum brawling & Gear transformations', ar: 'قتال المطاط وتحولات الغيَر' },
    strengths: { en: ['Boundless optimism', 'Inspires loyalty', 'Fearless'], ar: ['تفاؤل لا حدود له', 'يلهم الولاء', 'لا يعرف الخوف'] },
    weaknesses: { en: ['Reckless', 'Oblivious to danger', 'Hopeless navigator'], ar: ['متهور', 'يتجاهل الخطر', 'ملاح فاشل'] },
  },
  zoro: {
    quote: { en: 'Nothing happened.', ar: 'لم يحدث شيء.' },
    dream: { en: "Become the world's greatest swordsman.", ar: 'أن يصبح أعظم سيّاف في العالم.' },
    fightingStyle: { en: 'Three-Sword Style (Santoryu)', ar: 'أسلوب الثلاثة سيوف (سانتوريو)' },
    strengths: { en: ['Iron discipline', 'Unshakeable loyalty', 'Immense willpower'], ar: ['انضباط حديدي', 'ولاء لا يتزعزع', 'إرادة هائلة'] },
    weaknesses: { en: ['Hopeless sense of direction', 'Stubborn', 'Blunt'], ar: ['حس اتجاه معدوم', 'عنيد', 'حاد الطباع'] },
  },
  nami: {
    quote: { en: 'I can draw a map of the entire world!', ar: 'أستطيع رسم خريطة للعالم بأكمله!' },
    dream: { en: 'Draw a complete map of the world.', ar: 'رسم خريطة كاملة للعالم.' },
    fightingStyle: { en: 'Clima-Tact weather manipulation', ar: 'التحكم بالطقس عبر الكليما-تاكت' },
    strengths: { en: ['Sharp strategy', 'Resourceful', 'Reads any situation'], ar: ['استراتيجية حادة', 'واسعة الحيلة', 'تقرأ كل موقف'] },
    weaknesses: { en: ['Greedy for treasure', 'Short-tempered', 'Self-preserving'], ar: ['جشعة للكنوز', 'سريعة الغضب', 'تحب النجاة'] },
  },
  sanji: {
    quote: { en: 'A real cook never wastes food.', ar: 'الطبّاخ الحقيقي لا يهدر الطعام أبدًا.' },
    dream: { en: 'Find the All Blue, the legendary sea of every fish.', ar: 'إيجاد الأول بلو، بحر كل الأسماك الأسطوري.' },
    fightingStyle: { en: 'Black Leg kicks (hands stay for cooking)', ar: 'ركلات الساق السوداء (يداه للطبخ)' },
    strengths: { en: ['Selfless & chivalrous', 'Refined skill', 'Big-hearted'], ar: ['إيثار ونُبل', 'مهارة راقية', 'قلب كبير'] },
    weaknesses: { en: ['Weak to a pretty face', 'Hot-headed', 'Self-sacrificing'], ar: ['يضعف أمام الجمال', 'متهور', 'يضحّي بنفسه'] },
  },
  usopp: {
    quote: { en: 'I have a disease that only courage can cure!', ar: 'لديّ داء لا يشفيه إلا الشجاعة!' },
    dream: { en: 'Become a brave warrior of the sea.', ar: 'أن يصبح محاربًا شجاعًا للبحار.' },
    fightingStyle: { en: 'Trick-shot slingshot & inventions', ar: 'مقلاع بضربات ماكرة واختراعات' },
    strengths: { en: ['Inventive', 'Brave when it counts', 'Master storyteller'], ar: ['مبتكر', 'شجاع وقت الحاجة', 'راوٍ بارع'] },
    weaknesses: { en: ['Anxious', 'Prone to exaggeration', 'Self-doubt'], ar: ['قلِق', 'يميل للمبالغة', 'يشك بنفسه'] },
  },
  chopper: {
    quote: { en: 'Being called a monster is a compliment!', ar: 'وصفي بالوحش إطراء!' },
    dream: { en: 'Become a doctor who can cure any disease.', ar: 'أن يصبح طبيبًا يشفي أي داء.' },
    fightingStyle: { en: 'Rumble Ball transformations', ar: 'تحولات كرة الرامبل' },
    strengths: { en: ['Deeply caring', 'Brilliant doctor', 'Pure-hearted'], ar: ['حنون جدًا', 'طبيب بارع', 'نقي القلب'] },
    weaknesses: { en: ['Naive', 'Easily flattered', 'Timid'], ar: ['ساذج', 'يُجامَل بسهولة', 'خجول'] },
  },
  robin: {
    quote: { en: 'I want to live.', ar: 'أريد أن أعيش.' },
    dream: { en: 'Uncover the true history of the world.', ar: 'كشف التاريخ الحقيقي للعالم.' },
    fightingStyle: { en: 'Flower-Flower bloomed limbs', ar: 'أطراف متفتّحة بقوة فاكهة الزهرة' },
    strengths: { en: ['Brilliant intellect', 'Composed', 'Endless knowledge'], ar: ['عقل لامع', 'رابطة الجأش', 'معرفة لا تنضب'] },
    weaknesses: { en: ['Guarded', 'Morbid humor', 'Carries old wounds'], ar: ['متحفّظة', 'فكاهة قاتمة', 'تحمل جراحًا قديمة'] },
  },
  franky: {
    quote: { en: "SUPER!", ar: 'سوبر!' },
    dream: { en: 'Build a dream ship that sails to the end of the world.', ar: 'بناء سفينة أحلام تبحر إلى نهاية العالم.' },
    fightingStyle: { en: 'Cyborg weaponry & cola power', ar: 'أسلحة السايبورغ وطاقة الكولا' },
    strengths: { en: ['Master shipwright', 'Boundless energy', 'Loyal heart'], ar: ['بنّاء سفن بارع', 'طاقة لا تنضب', 'قلب وفي'] },
    weaknesses: { en: ['Over-the-top', 'Emotional crier', 'Stubborn pride'], ar: ['مبالغ', 'سريع البكاء', 'كبرياء عنيد'] },
  },
  brook: {
    quote: { en: 'Yohohoho! May I see your panties?', ar: 'يوهوهوهو! هل أرى ملابسك الداخلية؟' },
    dream: { en: 'Reunite with Laboon, the whale who waits for him.', ar: 'لقاء لابون، الحوت الذي ينتظره.' },
    fightingStyle: { en: 'Soul-infused swift sword & song', ar: 'سيف خاطف ممزوج بالروح والغناء' },
    strengths: { en: ['Eternal optimism', 'Lifts every spirit', 'Soulful musician'], ar: ['تفاؤل أبدي', 'يرفع المعنويات', 'موسيقي روحاني'] },
    weaknesses: { en: ['Eccentric', 'Inappropriate jokes', 'Haunted past'], ar: ['غريب الأطوار', 'نكات غير لائقة', 'ماضٍ موجع'] },
  },
  jinbe: {
    quote: { en: 'I will repay this debt with my life.', ar: 'سأرد هذا الدين بحياتي.' },
    dream: { en: 'See harmony between fish-men and humans.', ar: 'رؤية وئام بين الأسماك البشرية والبشر.' },
    fightingStyle: { en: 'Fish-Man Karate & water manipulation', ar: 'كاراتيه الإنسان السمكة والتحكم بالماء' },
    strengths: { en: ['Wise & honorable', 'Calm anchor', 'Unbreakable resolve'], ar: ['حكيم وشريف', 'مرساة هادئة', 'عزيمة لا تُكسر'] },
    weaknesses: { en: ['Burdened by duty', 'Overly serious', 'Self-blaming'], ar: ['مثقل بالواجب', 'جاد للغاية', 'يلوم نفسه'] },
  },
};

// Each Straw Hat's canonical signature power — used in place of a blanket
// "Devil Fruit" label (most of the crew are not Devil-Fruit users).
export const POWER_TYPE: Record<CharacterKey, { en: string; ar: string }> = {
  luffy: { en: 'Gum-Gum Fruit', ar: 'فاكهة المطاط' },
  zoro: { en: 'Three-Sword Style', ar: 'أسلوب الثلاثة سيوف' },
  nami: { en: 'Weather Mastery', ar: 'إتقان الطقس' },
  sanji: { en: 'Black-Leg Style', ar: 'أسلوب الساق السوداء' },
  usopp: { en: 'Marksmanship', ar: 'براعة التصويب' },
  chopper: { en: 'Human-Human Fruit', ar: 'فاكهة الإنسان' },
  robin: { en: 'Flower-Flower Fruit', ar: 'فاكهة الزهرة' },
  franky: { en: 'Cyborg Tech', ar: 'تقنية السايبورغ' },
  brook: { en: 'Revive-Revive Fruit', ar: 'فاكهة الإحياء' },
  jinbe: { en: 'Fish-Man Karate', ar: 'كاراتيه الإنسان السمكة' },
};

export const getPowerType = (key: CharacterKey, lang: Lang): string => POWER_TYPE[key][lang];

export function getLore(key: CharacterKey, lang: Lang) {
  const l = lore[key];
  return {
    quote: l.quote[lang],
    dream: l.dream[lang],
    fightingStyle: l.fightingStyle[lang],
    strengths: l.strengths[lang],
    weaknesses: l.weaknesses[lang],
  };
}
