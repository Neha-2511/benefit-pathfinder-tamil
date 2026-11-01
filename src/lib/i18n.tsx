import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ta";

const dict = {
  home: { en: "Home", ta: "முகப்பு" },
  browse: { en: "All Schemes", ta: "அனைத்து திட்டங்கள்" },
  docs: { en: "Document Help", ta: "ஆவண உதவி" },
  about: { en: "About", ta: "எங்களைப் பற்றி" },
  admin: { en: "Admin", ta: "நிர்வாகம்" },
  heroTitle: { en: "Government Benefits Made Simple.", ta: "அரசு நலத்திட்டங்கள் — எளிமையாக." },
  heroSub: {
    en: "Discover government schemes and scholarships you may be eligible for, understand the required documents, and find out how to apply.",
    ta: "நீங்கள் தகுதி பெறக்கூடிய அரசு திட்டங்கள் மற்றும் உதவித்தொகைகளைக் கண்டறிந்து, தேவையான ஆவணங்களையும் விண்ணப்பிக்கும் முறையையும் தெரிந்துகொள்ளுங்கள்.",
  },
  findCta: { en: "Find Schemes for Me", ta: "எனக்கான திட்டங்களைக் கண்டறி" },
  next: { en: "Next", ta: "அடுத்து" },
  back: { en: "Back", ta: "பின்செல்" },
  skip: { en: "Skip", ta: "தவிர்" },
  showResults: { en: "Show my schemes", ta: "திட்டங்களைக் காட்டு" },
  qState: { en: "Which state do you live in?", ta: "நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?" },
  qAge: { en: "What is your age group?", ta: "உங்கள் வயது பிரிவு என்ன?" },
  qOcc: { en: "What is your occupation?", ta: "உங்கள் தொழில் என்ன?" },
  qPurpose: { en: "What do you need help with?", ta: "எதற்கு உதவி தேவை?" },
  qGender: { en: "Your gender (some schemes are only for women or girls)", ta: "உங்கள் பாலினம் (சில திட்டங்கள் பெண்களுக்கு மட்டும்)" },
  qEdu: { en: "What are you studying now / highest education?", ta: "தற்போது படிப்பது / உயர்ந்த கல்வி?" },
  qCommunity: { en: "Your community (used only for reserved scholarships)", ta: "உங்கள் சமூகம் (இட ஒதுக்கீடு உதவித்தொகைகளுக்கு மட்டும்)" },
  qIncome: { en: "Approximate annual family income", ta: "தோராயமான ஆண்டு குடும்ப வருமானம்" },
  potentially: { en: "Potentially Eligible", ta: "தகுதி பெறலாம்" },
  moreInfo: { en: "More Information Required", ta: "கூடுதல் தகவல் தேவை" },
  notMeet: { en: "Does Not Meet a Known Eligibility Condition", ta: "அறியப்பட்ட தகுதி நிபந்தனை பூர்த்தியாகவில்லை" },
  apply: { en: "Apply on Official Website", ta: "அதிகாரப்பூர்வ இணையதளத்தில் விண்ணப்பிக்கவும்" },
  disclaimer: {
    en: "Civic Nexus is an information guide. It does not guarantee eligibility or approval. Applications, verification and approval are handled only by the respective government department.",
    ta: "சிவிக் நெக்சஸ் ஒரு தகவல் வழிகாட்டி மட்டுமே. தகுதி அல்லது ஒப்புதலுக்கு உத்தரவாதம் இல்லை. விண்ணப்பம், சரிபார்ப்பு மற்றும் ஒப்புதல் சம்பந்தப்பட்ட அரசுத் துறையால் மட்டுமே செய்யப்படும்.",
  },
  available: { en: "Available", ta: "உள்ளது" },
  notAvailable: { en: "Not Available", ta: "இல்லை" },
  notSure: { en: "Not Sure", ta: "தெரியவில்லை" },
  howToObtain: { en: "How to obtain this document", ta: "இந்த ஆவணத்தைப் பெறுவது எப்படி" },
} as const;

export type DictKey = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k].en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("cn-lang");
    if (saved === "ta" || saved === "en") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("cn-lang", l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[k][lang] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
