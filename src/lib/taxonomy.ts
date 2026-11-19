export type Opt = { value: string; en: string; ta: string; ml: string; hi: string };

export const STATES: Opt[] = [
  { value: "Tamil Nadu",  en: "Tamil Nadu",           ta: "தமிழ்நாடு",   ml: "തമിഴ്‌നാട്",    hi: "तमिलनाडु" },
  { value: "Other",       en: "Another state / UT",   ta: "வேறு மாநிலம்", ml: "മറ്റൊരു സംസ്ഥാനം", hi: "अन्य राज्य/UT" },
];

export const AGE_GROUPS: (Opt & { age: number })[] = [
  { value: "under18", age: 15, en: "Below 18",    ta: "18க்கு கீழ்",     ml: "18-ൽ താഴെ",       hi: "18 से कम" },
  { value: "18-24",   age: 21, en: "18 – 24",     ta: "18 – 24",         ml: "18 – 24",          hi: "18 – 24" },
  { value: "25-40",   age: 32, en: "25 – 40",     ta: "25 – 40",         ml: "25 – 40",          hi: "25 – 40" },
  { value: "41-59",   age: 50, en: "41 – 59",     ta: "41 – 59",         ml: "41 – 59",          hi: "41 – 59" },
  { value: "60plus",  age: 65, en: "60 and above", ta: "60 மற்றும் மேல்", ml: "60 ഉം മேലും",     hi: "60 और ऊपर" },
];

export const OCCUPATIONS: Opt[] = [
  { value: "student",    en: "Student",        ta: "மாணவர்",          ml: "വിദ്യാർഥി",        hi: "छात्र" },
  { value: "farmer",     en: "Farmer",         ta: "விவசாயி",         ml: "കർഷകൻ",            hi: "किसान" },
  { value: "business",   en: "Business Owner", ta: "தொழில் முனைவோர்", ml: "ബിസിനസ് ഉടമ",     hi: "व्यवसायी" },
  { value: "employed",   en: "Employed",       ta: "பணியில் உள்ளவர்", ml: "ജോലിക്കാരൻ",       hi: "नौकरीपेशा" },
  { value: "unemployed", en: "Unemployed",     ta: "வேலையில்லாதவர்",  ml: "തൊഴിൽ ഇല്ലാത്തവർ", hi: "बेरोज़गार" },
  { value: "homemaker",  en: "Homemaker",      ta: "இல்லத்தரசி",     ml: "ഗൃഹിണി",           hi: "गृहिणी" },
  { value: "other",      en: "Other",          ta: "மற்றவை",          ml: "മറ്റുള്ളവ",          hi: "अन्य" },
];

export const PURPOSES: Opt[] = [
  { value: "education",   en: "Education",            ta: "கல்வி",             ml: "വിദ്യാഭ്യാസം",      hi: "शिक्षा" },
  { value: "scholarship", en: "Scholarship",          ta: "உதவித்தொகை",        ml: "സ്കോളർഷിപ്പ്",     hi: "छात्रवृत्ति" },
  { value: "business",    en: "Business",             ta: "தொழில்",            ml: "ബിസിനസ്",          hi: "व्यवसाय" },
  { value: "agriculture", en: "Agriculture",          ta: "விவசாயம்",          ml: "കൃഷി",              hi: "कृषि" },
  { value: "housing",     en: "Housing",              ta: "வீட்டுவசதி",        ml: "ഭവനം",              hi: "आवास" },
  { value: "employment",  en: "Employment",           ta: "வேலைவாய்ப்பு",     ml: "തൊഴിൽ",             hi: "रोज़गार" },
  { value: "women",       en: "Women Welfare",        ta: "மகளிர் நலன்",      ml: "വനിതാ ക്ഷേമം",     hi: "महिला कल्याण" },
  { value: "financial",   en: "Financial Assistance", ta: "நிதி உதவி",         ml: "സാമ്പത്തിക സഹായം",  hi: "वित्तीय सहायता" },
  { value: "health",      en: "Health",               ta: "சுகாதாரம்",         ml: "ആരോഗ്യം",           hi: "स्वास्थ्य" },
  { value: "pension",     en: "Pension",              ta: "ஓய்வூதியம்",        ml: "പെൻഷൻ",             hi: "पेंशन" },
  { value: "other",       en: "Other",                ta: "மற்றவை",            ml: "മറ്റുള്ളവ",           hi: "अन्य" },
];

export const INCOMES: (Opt & { amount: number | null })[] = [
  { value: "lt1",   amount: 90000,   en: "Below ₹1 lakh",    ta: "₹1 லட்சத்துக்குக் கீழ்", ml: "₹1 ലക്ഷത്തിൽ താഴെ",    hi: "₹1 लाख से कम" },
  { value: "1-2.5", amount: 200000,  en: "₹1 – 2.5 lakh",   ta: "₹1 – 2.5 லட்சம்",        ml: "₹1 – 2.5 ലക്ഷം",       hi: "₹1 – 2.5 लाख" },
  { value: "2.5-5", amount: 400000,  en: "₹2.5 – 5 lakh",   ta: "₹2.5 – 5 லட்சம்",        ml: "₹2.5 – 5 ലക്ഷം",       hi: "₹2.5 – 5 लाख" },
  { value: "5-8",   amount: 700000,  en: "₹5 – 8 lakh",     ta: "₹5 – 8 லட்சம்",          ml: "₹5 – 8 ലക്ഷം",         hi: "₹5 – 8 लाख" },
  { value: "gt8",   amount: 1000000, en: "Above ₹8 lakh",   ta: "₹8 லட்சத்துக்கு மேல்",   ml: "₹8 ലക്ഷത്തിൽ കൂടുതൽ", hi: "₹8 लाख से अधिक" },
  { value: "skip",  amount: null,    en: "Prefer not to say",ta: "சொல்ல விரும்பவில்லை",     ml: "പറയാൻ ഇഷ്ടമില്ല",     hi: "बताना नहीं चाहते" },
];

export const EDUCATION: Opt[] = [
  { value: "school",          en: "School (up to Class 10)", ta: "பள்ளி (10ம் வகுப்பு வரை)", ml: "സ്കൂൾ (10-ാം ക്ലാസ്സ് വരെ)", hi: "स्कूल (कक्षा 10 तक)" },
  { value: "higher_secondary",en: "Class 11 – 12",           ta: "11 – 12ம் வகுப்பு",         ml: "11 – 12 ക്ലാസ്സ്",           hi: "कक्षा 11 – 12" },
  { value: "diploma",         en: "Diploma / ITI",           ta: "டிப்ளமோ / ஐடிஐ",           ml: "ഡിപ്ലോമ / ITI",              hi: "डिप्लोमा / ITI" },
  { value: "ug",              en: "Undergraduate degree",    ta: "இளநிலை பட்டம்",             ml: "ബിരുദം",                     hi: "स्नातक डिग्री" },
  { value: "pg",              en: "Postgraduate",            ta: "முதுநிலை",                  ml: "ബിരുദാനന്തര ബിരുദം",         hi: "परास्नातक" },
  { value: "phd",             en: "PhD / Research",          ta: "முனைவர்",                   ml: "PhD / ഗവേഷണം",               hi: "PhD / शोध" },
];

export const GENDERS: Opt[] = [
  { value: "female", en: "Female",          ta: "பெண்",              ml: "സ്ത്രീ",          hi: "महिला" },
  { value: "male",   en: "Male",            ta: "ஆண்",               ml: "പുരുഷൻ",          hi: "पुरुष" },
  { value: "other",  en: "Other",           ta: "மற்றவை",            ml: "മറ്റുള്ളവ",        hi: "अन्य" },
  { value: "skip",   en: "Prefer not to say",ta: "சொல்ல விரும்பவில்லை", ml: "പറയാൻ ഇഷ്ടമില്ല", hi: "बताना नहीं चाहते" },
];

export const COMMUNITIES: Opt[] = [
  { value: "sc",       en: "SC",               ta: "ஆதிதிராவிடர் (SC)",           ml: "SC",                        hi: "SC (अनुसूचित जाति)" },
  { value: "st",       en: "ST",               ta: "பழங்குடியினர் (ST)",           ml: "ST",                        hi: "ST (अनुसूचित जनजाति)" },
  { value: "bc",       en: "BC",               ta: "பிற்படுத்தப்பட்டோர் (BC)",    ml: "BC",                        hi: "BC (पिछड़ा वर्ग)" },
  { value: "mbc",      en: "MBC / DNC",        ta: "மிகப் பிற்படுத்தப்பட்டோர் (MBC)", ml: "MBC / DNC",             hi: "MBC / DNC" },
  { value: "obc",      en: "OBC (central list)",ta: "OBC",                        ml: "OBC",                       hi: "OBC (केंद्रीय सूची)" },
  { value: "minority", en: "Minority community",ta: "சிறுபான்மையினர்",           ml: "ന്യൂനപക്ഷ സമുദായം",        hi: "अल्पसंख्यक समुदाय" },
  { value: "general",  en: "General",          ta: "பொது",                        ml: "ജനറൽ",                      hi: "सामान्य" },
  { value: "skip",     en: "Prefer not to say",ta: "சொல்ல விரும்பவில்லை",         ml: "പറയാൻ ഇഷ്ടമില്ല",         hi: "बताना नहीं चाहते" },
];

export const CATEGORIES: Opt[] = [
  { value: "education",  en: "Education & Scholarships", ta: "கல்வி & உதவித்தொகை",    ml: "വിദ്യാഭ്യാസം & സ്കോളർഷിപ്പ്", hi: "शिक्षा और छात्रवृत्ति" },
  { value: "agriculture",en: "Agriculture",              ta: "விவசாயம்",               ml: "കൃഷി",                          hi: "कृषि" },
  { value: "business",   en: "Business & Entrepreneurs", ta: "தொழில்",                 ml: "ബിസിനസ് & സംരംഭകർ",           hi: "व्यवसाय और उद्यमी" },
  { value: "employment", en: "Employment & Skills",      ta: "வேலை & திறன்",           ml: "തൊഴിൽ & കഴിവുകൾ",              hi: "रोज़गार और कौशल" },
  { value: "women",      en: "Women & Child",            ta: "மகளிர் & குழந்தைகள்",   ml: "വനിത & ശിശു",                  hi: "महिला और बाल" },
  { value: "housing",    en: "Housing",                  ta: "வீட்டுவசதி",             ml: "ഭവന",                           hi: "आवास" },
  { value: "health",     en: "Health",                   ta: "சுகாதாரம்",              ml: "ആരോഗ്യം",                       hi: "स्वास्थ्य" },
  { value: "pension",    en: "Senior Citizens & Pension",ta: "மூத்த குடிமக்கள்",      ml: "മുതിർന്ന പൗരർ & പെൻഷൻ",       hi: "वरिष्ठ नागरिक और पेंशन" },
  { value: "financial",  en: "Financial Inclusion",      ta: "நிதி",                   ml: "സാമ്പത്തിക ഉൾപ്പെടുത്തൽ",     hi: "वित्तीय समावेश" },
  { value: "other",      en: "Other",                    ta: "மற்றவை",                 ml: "മറ്റുള്ളവ",                      hi: "अन्य" },
];

export function label(list: Opt[], value: string | null | undefined, lang: "en" | "ta" | "ml" | "hi") {
  const o = list.find((x) => x.value === value);
  return o ? o[lang] : value ?? "";
}
