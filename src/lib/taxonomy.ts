export type Opt = { value: string; en: string; ta: string };

export const STATES: Opt[] = [
  { value: "Tamil Nadu", en: "Tamil Nadu", ta: "தமிழ்நாடு" },
  { value: "Other", en: "Another state / UT", ta: "வேறு மாநிலம்" },
];

export const AGE_GROUPS: (Opt & { age: number })[] = [
  { value: "under18", age: 15, en: "Below 18", ta: "18க்கு கீழ்" },
  { value: "18-24", age: 21, en: "18 – 24", ta: "18 – 24" },
  { value: "25-40", age: 32, en: "25 – 40", ta: "25 – 40" },
  { value: "41-59", age: 50, en: "41 – 59", ta: "41 – 59" },
  { value: "60plus", age: 65, en: "60 and above", ta: "60 மற்றும் மேல்" },
];

export const OCCUPATIONS: Opt[] = [
  { value: "student", en: "Student", ta: "மாணவர்" },
  { value: "farmer", en: "Farmer", ta: "விவசாயி" },
  { value: "business", en: "Business Owner", ta: "தொழில் முனைவோர்" },
  { value: "employed", en: "Employed", ta: "பணியில் உள்ளவர்" },
  { value: "unemployed", en: "Unemployed", ta: "வேலையில்லாதவர்" },
  { value: "homemaker", en: "Homemaker", ta: "இல்லத்தரசி" },
  { value: "other", en: "Other", ta: "மற்றவை" },
];

export const PURPOSES: Opt[] = [
  { value: "education", en: "Education", ta: "கல்வி" },
  { value: "scholarship", en: "Scholarship", ta: "உதவித்தொகை" },
  { value: "business", en: "Business", ta: "தொழில்" },
  { value: "agriculture", en: "Agriculture", ta: "விவசாயம்" },
  { value: "housing", en: "Housing", ta: "வீட்டுவசதி" },
  { value: "employment", en: "Employment", ta: "வேலைவாய்ப்பு" },
  { value: "women", en: "Women Welfare", ta: "மகளிர் நலன்" },
  { value: "financial", en: "Financial Assistance", ta: "நிதி உதவி" },
  { value: "health", en: "Health", ta: "சுகாதாரம்" },
  { value: "pension", en: "Pension", ta: "ஓய்வூதியம்" },
  { value: "other", en: "Other", ta: "மற்றவை" },
];

export const INCOMES: (Opt & { amount: number | null })[] = [
  { value: "lt1", amount: 90000, en: "Below ₹1 lakh", ta: "₹1 லட்சத்துக்குக் கீழ்" },
  { value: "1-2.5", amount: 200000, en: "₹1 – 2.5 lakh", ta: "₹1 – 2.5 லட்சம்" },
  { value: "2.5-5", amount: 400000, en: "₹2.5 – 5 lakh", ta: "₹2.5 – 5 லட்சம்" },
  { value: "5-8", amount: 700000, en: "₹5 – 8 lakh", ta: "₹5 – 8 லட்சம்" },
  { value: "gt8", amount: 1000000, en: "Above ₹8 lakh", ta: "₹8 லட்சத்துக்கு மேல்" },
  { value: "skip", amount: null, en: "Prefer not to say", ta: "சொல்ல விரும்பவில்லை" },
];

export const EDUCATION: Opt[] = [
  { value: "school", en: "School (up to Class 10)", ta: "பள்ளி (10ம் வகுப்பு வரை)" },
  { value: "higher_secondary", en: "Class 11 – 12", ta: "11 – 12ம் வகுப்பு" },
  { value: "diploma", en: "Diploma / ITI", ta: "டிப்ளமோ / ஐடிஐ" },
  { value: "ug", en: "Undergraduate degree", ta: "இளநிலை பட்டம்" },
  { value: "pg", en: "Postgraduate", ta: "முதுநிலை" },
  { value: "phd", en: "PhD / Research", ta: "முனைவர்" },
];

export const GENDERS: Opt[] = [
  { value: "female", en: "Female", ta: "பெண்" },
  { value: "male", en: "Male", ta: "ஆண்" },
  { value: "other", en: "Other", ta: "மற்றவை" },
  { value: "skip", en: "Prefer not to say", ta: "சொல்ல விரும்பவில்லை" },
];

export const COMMUNITIES: Opt[] = [
  { value: "sc", en: "SC", ta: "ஆதிதிராவிடர் (SC)" },
  { value: "st", en: "ST", ta: "பழங்குடியினர் (ST)" },
  { value: "bc", en: "BC", ta: "பிற்படுத்தப்பட்டோர் (BC)" },
  { value: "mbc", en: "MBC / DNC", ta: "மிகப் பிற்படுத்தப்பட்டோர் (MBC)" },
  { value: "obc", en: "OBC (central list)", ta: "OBC" },
  { value: "minority", en: "Minority community", ta: "சிறுபான்மையினர்" },
  { value: "general", en: "General", ta: "பொது" },
  { value: "skip", en: "Prefer not to say", ta: "சொல்ல விரும்பவில்லை" },
];

export const CATEGORIES: Opt[] = [
  { value: "education", en: "Education & Scholarships", ta: "கல்வி & உதவித்தொகை" },
  { value: "agriculture", en: "Agriculture", ta: "விவசாயம்" },
  { value: "business", en: "Business & Entrepreneurs", ta: "தொழில்" },
  { value: "employment", en: "Employment & Skills", ta: "வேலை & திறன்" },
  { value: "women", en: "Women & Child", ta: "மகளிர் & குழந்தைகள்" },
  { value: "housing", en: "Housing", ta: "வீட்டுவசதி" },
  { value: "health", en: "Health", ta: "சுகாதாரம்" },
  { value: "pension", en: "Senior Citizens & Pension", ta: "மூத்த குடிமக்கள்" },
  { value: "financial", en: "Financial Inclusion", ta: "நிதி" },
  { value: "other", en: "Other", ta: "மற்றவை" },
];

export function label(list: Opt[], value: string | null | undefined, lang: "en" | "ta") {
  const o = list.find((x) => x.value === value);
  return o ? o[lang] : value ?? "";
}
