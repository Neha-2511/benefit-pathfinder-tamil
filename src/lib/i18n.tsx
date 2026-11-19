import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ta" | "ml" | "hi";

const dict = {
  /* ── Navigation ─────────────────────────────────────────────────── */
  home:  { en: "Home",         ta: "முகப்பு",       ml: "ഹോം",        hi: "होम" },
  browse:{ en: "All Schemes",  ta: "அனைத்து திட்டங்கள்", ml: "എല്ലാ പദ്ധതികളും", hi: "सभी योजनाएँ" },
  docs:  { en: "Document Help",ta: "ஆவண உதவி",    ml: "ഡോക്യുമെന്റ് സഹായം", hi: "दस्तावेज़ सहायता" },
  about: { en: "About",        ta: "எங்களைப் பற்றி", ml: "ഞങ്ങളെക്കുറിച്ച്", hi: "हमारे बारे में" },
  admin: { en: "Admin",        ta: "நிர்வாகம்",     ml: "അഡ്മിൻ",      hi: "व्यवस्थापक" },

  /* ── Hero ───────────────────────────────────────────────────────── */
  heroTitle: {
    en: "Government Benefits Made Simple.",
    ta: "அரசு நலத்திட்டங்கள் — எளிமையாக.",
    ml: "സർക്കാർ ആനുകൂല്യങ്ങൾ — ലളിതമായി.",
    hi: "सरकारी योजनाएँ — आसान तरीके से।",
  },
  heroSub: {
    en: "Discover government schemes and scholarships you may be eligible for, understand the required documents, and find out how to apply.",
    ta: "நீங்கள் தகுதி பெறக்கூடிய அரசு திட்டங்கள் மற்றும் உதவித்தொகைகளைக் கண்டறிந்து, தேவையான ஆவணங்களையும் விண்ணப்பிக்கும் முறையையும் தெரிந்துகொள்ளுங்கள்.",
    ml: "നിങ്ങൾക്ക് അർഹതയുള്ള സർക്കാർ പദ്ധതികളും സ്കോളർഷിപ്പുകളും കണ്ടെത്തുക, ആവശ്യമായ രേഖകൾ മനസ്സിലാക്കുക, അപേക്ഷ എങ്ങനെ നൽകാമെന്ന് അറിയുക.",
    hi: "अपने लिए पात्र सरकारी योजनाएँ और छात्रवृत्तियाँ खोजें, जरूरी दस्तावेज़ समझें और आवेदन करने का तरीका जानें।",
  },
  heroTag: {
    en: "Central & Tamil Nadu schemes · Official links only",
    ta: "மத்திய & தமிழ்நாடு திட்டங்கள் · அதிகாரப்பூர்வ இணைப்புகள் மட்டும்",
    ml: "കേന്ദ്ര & തമിഴ്‌നാട് പദ്ധതികൾ · ഔദ്യോഗിക ലിങ്കുകൾ മാത്രം",
    hi: "केंद्र और तमिलनाडु योजनाएँ · केवल आधिकारिक लिंक",
  },
  schemesCount: {
    en: "schemes & scholarships in the database",
    ta: "திட்டங்கள் & உதவித்தொகைகள் தரவுத்தளத்தில் உள்ளன",
    ml: "ഡാറ്റാബേസിൽ പദ്ധതികളും സ്കോളർഷിപ്പുകളും",
    hi: "डेटाबेस में योजनाएँ और छात्रवृत्तियाँ",
  },
  findCta: {
    en: "Find Schemes for Me",
    ta: "எனக்கான திட்டங்களைக் கண்டறி",
    ml: "എനിക്കുള്ള പദ്ധതികൾ കണ്ടെത്തുക",
    hi: "मेरे लिए योजनाएँ खोजें",
  },

  /* ── How it works ───────────────────────────────────────────────── */
  howItWorks:   { en: "How it works",          ta: "எவ்வாறு செயல்படுகிறது", ml: "എങ്ങനെ പ്രവർത്തിക്കുന്നു", hi: "यह कैसे काम करता है" },
  step1Title:   { en: "Answer a few questions",ta: "சில கேள்விகளுக்கு பதிலளிக்கவும்", ml: "ചില ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക", hi: "कुछ सवालों के जवाब दें" },
  step1Body:    { en: "Age, occupation and what you need. Takes about a minute.", ta: "வயது, தொழில் மற்றும் தேவை. ஒரு நிமிடம் மட்டும்.", ml: "പ്രായം, തൊഴിൽ, ആവശ്യം. ഒരു മിനിറ്റ് മാത്രം.", hi: "उम्र, पेशा और जरूरत। एक मिनट में।" },
  step2Title:   { en: "See matching schemes",  ta: "பொருத்தமான திட்டங்களைப் பாருங்கள்", ml: "ബന്ധപ്പെട്ട പദ്ധതികൾ കാണുക", hi: "मेल खाती योजनाएँ देखें" },
  step2Body:    { en: "We check every scheme's conditions and explain why it fits.", ta: "ஒவ்வொரு திட்டத்தின் நிபந்தனைகளையும் சரிபார்த்து பொருத்தத்தை விளக்குகிறோம்.", ml: "ഓരോ പദ്ധതിയുടെയും നിബന്ധനകൾ പരിശോധിക്കുകയും അനുയോജ്യത വിശദീകരിക്കുകയും ചെയ്യുന്നു.", hi: "हम हर योजना की शर्तें जाँचते हैं और कारण बताते हैं।" },
  step3Title:   { en: "Prepare documents & apply", ta: "ஆவணங்களை தயார் செய்து விண்ணப்பிக்கவும்", ml: "രേഖകൾ തയ്യാറാക്കി അപേക്ഷ നൽകുക", hi: "दस्तावेज़ तैयार करें और आवेदन करें" },
  step3Body:    { en: "Tick the documents you have, learn how to get the rest, then apply on the official portal.", ta: "உங்களிடம் உள்ள ஆவணங்களை குறிக்கவும், மற்றவற்றை எவ்வாறு பெறுவது என்று தெரிந்துகொண்டு, அதிகாரப்பூர்வ போர்ட்டலில் விண்ணப்பிக்கவும்.", ml: "നിങ്ങളുടെ പക്കൽ ഉള്ള രേഖകൾ അടയാളപ്പെടുത്തുക, ബാക്കിയുള്ളവ എങ്ങനെ ലഭിക്കുമെന്ന് അറിയുക, ഔദ്യോഗിക പോർട്ടലിൽ അപേക്ഷ നൽകുക.", hi: "अपने दस्तावेज़ चिह्नित करें, बाकी कैसे पाएं सीखें, फिर आधिकारिक पोर्टल पर आवेदन करें।" },
  stepLabel:    { en: "Step",  ta: "படி",  ml: "ഘട്ടം", hi: "चरण" },
  browseByCategory: { en: "Browse by category", ta: "வகை வாரியாக பாருங்கள்", ml: "വിഭാഗം അനുസരിച്ച് ബ്രൗസ് ചെയ്യുക", hi: "श्रेणी के अनुसार देखें" },
  schemesWord:  { en: "schemes", ta: "திட்டங்கள்", ml: "പദ്ധതികൾ", hi: "योजनाएँ" },

  /* ── Questionnaire ──────────────────────────────────────────────── */
  next:      { en: "Next",            ta: "அடுத்து",      ml: "അടുത്തത്",   hi: "अगला" },
  back:      { en: "Back",            ta: "பின்செல்",     ml: "പിന്നോട്ട്",  hi: "वापस" },
  skip:      { en: "Skip",            ta: "தவிர்",        ml: "ഒഴിവാക്കുക", hi: "छोड़ें" },
  showResults:{ en: "Show my schemes",ta: "திட்டங்களைக் காட்டு", ml: "എന്റെ പദ്ധതികൾ കാണിക്കൂ", hi: "मेरी योजनाएँ दिखाएं" },
  questionOf: { en: "Question",       ta: "கேள்வி",       ml: "ചോദ്യം",     hi: "प्रश्न" },
  of:         { en: "of",             ta: "இல்",          ml: "ൽ",          hi: "में से" },
  optional:   { en: "Optional",       ta: "விருப்பத்தேர்வு", ml: "ഐच्छिக",  hi: "वैकल्पिक" },
  qState:    { en: "Which state do you live in?", ta: "நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?", ml: "നിങ്ങൾ ഏത് സംസ്ഥാനത്ത് താമസിക്കുന്നു?", hi: "आप किस राज्य में रहते हैं?" },
  qAge:      { en: "What is your age group?", ta: "உங்கள் வயது பிரிவு என்ன?", ml: "നിങ്ങളുടെ പ്രായ വിഭാഗം ഏതാണ്?", hi: "आपकी आयु वर्ग क्या है?" },
  qOcc:      { en: "What is your occupation?", ta: "உங்கள் தொழில் என்ன?", ml: "നിങ്ങളുടെ തൊഴിൽ എന്താണ്?", hi: "आपका व्यवसाय क्या है?" },
  qPurpose:  { en: "What do you need help with?", ta: "எதற்கு உதவி தேவை?", ml: "നിങ്ങൾക്ക് ഏത് വിഷയത്തിൽ സഹായം വേണം?", hi: "आपको किस विषय में सहायता चाहिए?" },
  qGender:   { en: "Your gender (some schemes are only for women or girls)", ta: "உங்கள் பாலினம் (சில திட்டங்கள் பெண்களுக்கு மட்டும்)", ml: "നിങ്ങളുടെ ലിംഗം (ചില പദ്ധതികൾ സ്ത്രീകൾക്ക് മാത്രം)", hi: "आपका लिंग (कुछ योजनाएँ केवल महिलाओं के लिए हैं)" },
  qEdu:      { en: "What are you studying now / highest education?", ta: "தற்போது படிப்பது / உயர்ந்த கல்வி?", ml: "ഇപ്പോൾ പഠിക്കുന്നത് / ഉന്നത വിദ്യാഭ്യാസം?", hi: "अभी क्या पढ़ रहे हैं / उच्चतम शिक्षा?" },
  qCommunity:{ en: "Your community (used only for reserved scholarships)", ta: "உங்கள் சமூகம் (இட ஒதுக்கீடு உதவித்தொகைகளுக்கு மட்டும்)", ml: "നിങ്ങളുടെ സമുദായം (സംവരണ സ്കോളർഷിപ്പുകൾക്ക് മാത്രം)", hi: "आपका समुदाय (केवल आरक्षित छात्रवृत्तियों के लिए)" },
  qIncome:   { en: "Approximate annual family income", ta: "தோராயமான ஆண்டு குடும்ப வருமானம்", ml: "ഏകദേശ വാർഷിക കുടുംബ വരുമാനം", hi: "अनुमानित वार्षिक पारिवारिक आय" },

  /* ── Results page ───────────────────────────────────────────────── */
  potentially: { en: "Potentially Eligible",  ta: "தகுதி பெறலாம்",         ml: "അർഹത ഉണ്ടാകാം",        hi: "संभावित पात्र" },
  moreInfo:    { en: "More Information Required", ta: "கூடுதல் தகவல் தேவை",  ml: "കൂടുതൽ വിവരം ആവശ്യം",  hi: "अधिक जानकारी आवश्यक" },
  notMeet:     { en: "Does Not Meet a Known Eligibility Condition", ta: "அறியப்பட்ட தகுதி நிபந்தனை பூர்த்தியாகவில்லை", ml: "അറിയപ്പെടുന്ന അർഹതാ നിബന്ധന പൂർത്തിയാകുന്നില്ല", hi: "ज्ञात पात्रता शर्त पूरी नहीं होती" },
  schemesSuitYou: { en: "Schemes that may suit you", ta: "உங்களுக்கு ஏற்ற திட்டங்கள்", ml: "നിങ്ങൾക்ക് അനുയോജ്യമായ പദ്ധதികൾ", hi: "आपके लिए उपयुक्त योजनाएँ" },
  changeAnswers:  { en: "Change answers", ta: "பதில்களை மாற்றுங்கள்", ml: "ഉത്തരങ്ങൾ മാറ്റുക", hi: "उत्तर बदलें" },
  noSchemesGroup: { en: "No schemes in this group. Try another tab or change your answers.", ta: "இந்த குழுவில் திட்டங்கள் இல்லை. வேறு தாவலை முயற்சிக்கவும் அல்லது உங்கள் பதில்களை மாற்றவும்.", ml: "ഈ ഗ്രൂപ്പിൽ പദ്ധതികൾ ഇല്ല. മറ്റൊരു ടാബ് ശ്രമിക്കുക അല്ലെങ്കിൽ ഉത്തരങ്ങൾ മാറ്റുക.", hi: "इस समूह में कोई योजना नहीं है। दूसरा टैब आज़माएं या उत्तर बदलें।" },

  /* ── Scheme detail ──────────────────────────────────────────────── */
  apply:         { en: "Apply on Official Website", ta: "அதிகாரப்பூர்வ இணையதளத்தில் விண்ணப்பிக்கவும்", ml: "ഔദ്യോഗിക വെബ്സൈറ്റിൽ അപേക്ഷ നൽകുക", hi: "आधिकारिक वेबसाइट पर आवेदन करें" },
  officialInfo:  { en: "Official information page", ta: "அதிகாரப்பூர்வ தகவல் பக்கம்", ml: "ഔദ്യോഗിക വിവര പേജ്", hi: "आधिकारिक जानकारी पृष्ठ" },
  schemeNoticeSmall: { en: "Application, verification and approval are handled only by the government department. Civic Nexus does not process applications.", ta: "விண்ணப்பம், சரிபார்ப்பு மற்றும் ஒப்புதல் சம்பந்தப்பட்ட அரசுத் துறையால் மட்டுமே செய்யப்படும். சிவிக் நெக்சஸ் விண்ணப்பங்களை செயல்படுத்துவதில்லை.", ml: "അപേക്ഷ, പരിശോധന, അംഗീകാരം എന്നിവ ബന്ധപ്പെട്ട സർക്കാർ വകുപ്പ് മാത്രം കൈകാര്യം ചെയ്യുന്നു. Civic Nexus അപേക്ഷകൾ പ്രോസസ് ചെയ്യുന്നില്ല.", hi: "आवेदन, सत्यापन और अनुमोदन केवल संबंधित सरकारी विभाग द्वारा किया जाता है। Civic Nexus आवेदन प्रक्रिया नहीं करता।" },
  backBtn:       { en: "Back", ta: "பின்செல்", ml: "പിന്നോട്ട്", hi: "वापस" },
  scholarship:   { en: "Scholarship", ta: "உதவித்தொகை", ml: "സ്കോളർഷിപ്പ്", hi: "छात्रवृत्ति" },
  centralGovt:   { en: "Central Government", ta: "மத்திய அரசு", ml: "കേന്ദ്ര സർക്കാർ", hi: "केंद्र सरकार" },
  benefits:      { en: "Benefits",             ta: "நலன்கள்",    ml: "ആനുകൂല്യങ്ങൾ", hi: "लाभ" },
  eligibility:   { en: "Eligibility conditions", ta: "தகுதி நிபந்தனைகள்", ml: "അർഹതാ നിബന്ധനകൾ", hi: "पात्रता शर्तें" },
  howToApply:    { en: "How to apply",           ta: "விண்ணப்பிப்பது எப்படி", ml: "എങ്ങനെ അപേക്ഷിക്കാം", hi: "आवेदन कैसे करें" },
  applyFallback: { en: "Detailed steps are not yet recorded in our database. Follow the instructions on the", ta: "விரிவான படிகள் இன்னும் எங்கள் தரவுத்தளத்தில் பதிவாகவில்லை. ", ml: "വിശദമായ ഘട്ടങ്ങൾ ഞങ്ങളുടെ ഡാറ്റാബേസിൽ ഇതുവരെ ഇല്ല. ", hi: "विस्तृत चरण अभी हमारे डेटाबेस में दर्ज नहीं हैं। " },
  officialWebsite: { en: "official website", ta: "அதிகாரப்பூர்வ இணையதளம்", ml: "ഔദ്യോഗിക വെബ്സൈറ്റ്", hi: "आधिकारिक वेबसाइट" },
  applyFallbackSuffix: { en: ".", ta: " பார்க்கவும்.", ml: " കാണുക.", hi: " देखें।" },
  docsChecklist: { en: "Required documents checklist", ta: "தேவையான ஆவணங்கள் பட்டியல்", ml: "ആവശ്യമായ രേഖകളുടെ ചെക്ക്ലിസ്റ്റ്", hi: "आवश्यक दस्तावेज़ सूची" },
  docsReady:     { en: "ready",    ta: "தயார்",       ml: "തയ്യാർ",        hi: "तैयार" },
  docsNote:      { en: "Mark each document. Your choices are saved only on this device.", ta: "ஒவ்வொரு ஆவணத்தையும் குறிக்கவும். உங்கள் தேர்வுகள் இந்த சாதனத்தில் மட்டும் சேமிக்கப்படும்.", ml: "ഓരോ രേഖയും അടയാളപ്പെടുത്തുക. നിങ്ങളുടെ തിരഞ്ഞെടുപ്പ് ഈ ഉപകരണത്തിൽ മാത്രം സേവ് ചെയ്യും.", hi: "प्रत्येक दस्तावेज़ चिह्नित करें। आपकी पसंद केवल इस डिवाइस में सहेजी जाती है।" },
  docWhy:        { en: "Why:",    ta: "ஏன்:",          ml: "എന്തുകൊണ്ട്:",  hi: "क्यों:" },
  keyFacts:      { en: "Key facts", ta: "முக்கிய தகவல்கள்", ml: "പ്രധാന വസ്തുതകൾ", hi: "मुख्य तथ्य" },
  statusLabel:   { en: "Status",   ta: "நிலை",         ml: "സ്ഥിതി",         hi: "स्थिति" },
  deadlineLabel: { en: "Deadline", ta: "கடைசி தேதி",   ml: "അവസാന തീയതി",  hi: "अंतिम तिथि" },
  lastVerified:  { en: "Last verified", ta: "கடைசியாக சரிபார்க்கப்பட்டது", ml: "അവസാനം പരിശോധിച്ചു", hi: "अंतिम सत्यापन" },
  sourceLabel:   { en: "Source",   ta: "ஆதாரம்",        ml: "ഉറവിടം",        hi: "स्रोत" },
  notVerified:   { en: "Not yet verified", ta: "இன்னும் சரிபார்க்கப்படவில்லை", ml: "ഇതുവരെ പരിശോധിച്ചിട്ടില്ല", hi: "अभी सत्यापित नहीं" },
  checkOfficial: { en: "Not verified — check official site", ta: "சரிபார்க்கப்படவில்லை — அதிகாரப்பூர்வ தளத்தைப் பாருங்கள்", ml: "പരിശോധിக്കാത്തത് — ഔദ്യോഗിക സൈറ്റ് നോക്കുക", hi: "सत्यापित नहीं — आधिकारिक साइट देखें" },
  officialSource:{ en: "Official source", ta: "அதிகாரப்பூர்வ ஆதாரம்", ml: "ഔദ്യോഗിക ഉറവിടം", hi: "आधिकारिक स्रोत" },
  pendingVerify: { en: "Amounts and limits shown here are pending re-verification against the official source. Always confirm on the official website before applying.", ta: "இங்கே காட்டப்படும் தொகைகள் மற்றும் வரம்புகள் மறுசரிபார்ப்பு நிலையில் உள்ளன. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ இணையதளத்தில் உறுதிப்படுத்தவும்.", ml: "ഇവിടെ കാണിച്ചിരിക്കുന്ന തുകകളും പരിധികളും ഔദ്യോഗിക ഉറവിടത്തിൽ വീണ്ടും പരിശോധിക്കേണ്ടിയിരിക്കുന്നു. അപേക്ഷ നൽകുന്നതിന് മുൻപ് ഔദ്യോഗിക വെബ്സൈറ്റ് പരിശോധിക്കുക.", hi: "यहाँ दिखाई गई राशियाँ और सीमाएँ पुनः सत्यापन के लिए लंबित हैं। आवेदन करने से पहले हमेशा आधिकारिक वेबसाइट पर पुष्टि करें।" },
  schemeNotFound:{ en: "Scheme not found", ta: "திட்டம் கண்டுபிடிக்கவில்லை", ml: "പദ്ധതി കണ്ടെത്തിയില്ല", hi: "योजना नहीं मिली" },
  browseAll:     { en: "Browse all schemes", ta: "அனைத்து திட்டங்களையும் பாருங்கள்", ml: "എല്ലാ പദ്ധതികളും ബ്രൗസ് ചെയ്യുക", hi: "सभी योजनाएँ देखें" },
  notInDb:       { en: "Not yet recorded in our database — please check the official website.", ta: "இன்னும் எங்கள் தரவுத்தளத்தில் பதிவாகவில்லை — அதிகாரப்பூர்வ இணையதளத்தைப் பாருங்கள்.", ml: "ഇതുവരെ ഞങ്ങളുടെ ഡാറ്റാബേസിൽ ഇല്ല — ഔദ്യോഗിക വെബ്സൈറ്റ് നോക്കുക.", hi: "अभी हमारे डेटाबेस में दर्ज नहीं — कृपया आधिकारिक वेबसाइट देखें।" },

  /* ── Document guide ─────────────────────────────────────────────── */
  available:   { en: "Available",     ta: "உள்ளது",        ml: "ഉണ്ട്",          hi: "उपलब्ध" },
  notAvailable:{ en: "Not Available", ta: "இல்லை",         ml: "ഇല്ല",           hi: "उपलब्ध नहीं" },
  notSure:     { en: "Not Sure",      ta: "தெரியவில்லை",   ml: "ഉറപ്പില്ല",      hi: "निश्चित नहीं" },
  howToObtain: { en: "How to obtain this document", ta: "இந்த ஆவணத்தைப் பெறுவது எப்படி", ml: "ഈ രേഖ എങ്ങനെ ലഭിക്കും", hi: "यह दस्तावेज़ कैसे प्राप्त करें" },
  issuedBy:    { en: "Issued by",     ta: "வழங்குவது",     ml: "നൽകുന്നത്",       hi: "जारीकर्ता" },
  whoCanGet:   { en: "Who can get it", ta: "யாருக்கு கிடைக்கும்", ml: "ആർക்ക് ലഭിക്കും", hi: "कौन प्राप्त कर सकता है" },
  supportingDocs:{ en: "Supporting documents to keep ready", ta: "தேவையான துணை ஆவணங்கள்", ml: "ഒരുക്കി വയ്ക്കേണ്ട അനுബന്ധ രേഖകൾ", hi: "तैयार रखने के लिए सहायक दस्तावेज़" },
  stepsToApply:{ en: "Steps to apply", ta: "விண்ணப்பிக்கும் படிகள்", ml: "അപേക്ഷ ഘട്ടങ്ങൾ", hi: "आवेदन के चरण" },
  offlineOption:{ en: "Offline option", ta: "நேரடி விருப்பம்", ml: "ഓഫ്‌ലൈൻ ഓപ്ഷൻ", hi: "ऑफ़लाइन विकल्प" },
  feesTime:    { en: "Fees & processing time", ta: "கட்டணம் & செயல்பாட்டு நேரம்", ml: "ഫീസ് & പ്രോസസ്സിംഗ് സമയം", hi: "शुल्क और प्रसंस्करण समय" },
  feesDefault: { en: "Not verified by us — the portal shows the current fee before payment.", ta: "நாங்கள் சரிபார்க்கவில்லை — கட்டணம் செலுத்தும் முன் போர்ட்டல் தெரிவிக்கும்.", ml: "ഞങ്ങൾ ഇത് പരിശോധിക്കാത്തത് — ഔദ്യോഗിക പോർട്ടൽ ഫീസ് കാണിക്കും.", hi: "हमने इसे सत्यापित नहीं किया — पोर्टल भुगतान से पहले शुल्क दिखाएगा।" },
  alternatives:{ en: "Officially accepted alternatives", ta: "ஏற்றுக்கொள்ளப்பட்ட மாற்று ஆவணங்கள்", ml: "ഔദ്യോഗികമായി സ്വീകരിക്കുന്ന ബദൽ", hi: "आधिकारिक रूप से स्वीकृत विकल्प" },
  afterObtaining:{ en: "After you get it", ta: "பெற்ற பிறகு", ml: "ലഭിച്ചതിന് ശേഷം", hi: "प्राप्त करने के बाद" },
  applyOnline: { en: "Apply online on", ta: "ஆன்லைனில் விண்ணப்பிக்கவும்", ml: "ഓൺലൈനിൽ അപേക്ഷ", hi: "ऑनलाइन आवेदन करें" },
  officialPortal:{ en: "official portal", ta: "அதிகாரப்பூர்வ போர்ட்டல்", ml: "ഔദ്യോഗിക പോർട്ടൽ", hi: "आधिकारिक पोर्टल" },
  tnOnly:      { en: "This procedure applies to Tamil Nadu residents.", ta: "இந்த நடைமுறை தமிழ்நாடு வாசிகளுக்கு பொருந்தும்.", ml: "ഈ നടപടി ക്രമം തമിഴ്‌നാട് നിവാസികൾക്ക് ബാധകമാണ്.", hi: "यह प्रक्रिया तमिलनाडु निवासियों पर लागू होती है।" },
  whyNeeded:   { en: "Why it's needed for", ta: "ஏன் தேவை:", ml: "എന്തിന് ആവശ്യം:", hi: "क्यों जरूरी है:" },

  /* ── Schemes browse page ─────────────────────────────────────────── */
  allSchemesTitle: { en: "All schemes & scholarships", ta: "அனைத்து திட்டங்கள் & உதவித்தொகைகள்", ml: "എല്ലാ പദ്ധതികളും സ്കോളർഷിപ്പുകളും", hi: "सभी योजनाएँ और छात्रवृत्तियाँ" },
  searchPlaceholder: { en: "Search by name or keyword", ta: "பெயர் அல்லது திறவுச்சொல் மூலம் தேடுங்கள்", ml: "പേര് അല്ലെങ്കിൽ കീവേഡ് ഉപയോഗിച്ച് തിരയുക", hi: "नाम या कीवर्ड से खोजें" },
  all:          { en: "All",        ta: "அனைத்தும்",   ml: "എല്ലാം",       hi: "सभी" },
  central:      { en: "Central",   ta: "மத்திய",       ml: "കേന്ദ്ര",      hi: "केंद्रीय" },
  stateFilter:  { en: "Tamil Nadu", ta: "தமிழ்நாடு",   ml: "തമിഴ്‌നാട്",   hi: "तमिलनाडु" },
  results:      { en: "results",    ta: "முடிவுகள்",   ml: "ഫലങ്ങൾ",       hi: "परिणाम" },
  previous:     { en: "Previous",   ta: "முந்தைய",     ml: "മുൻപത്തേത്",   hi: "पिछला" },
  page:         { en: "Page",       ta: "பக்கம்",      ml: "പേജ്",          hi: "पृष्ठ" },
  pageOf:       { en: "of",         ta: "இல்",          ml: "ൽ",             hi: "में से" },

  /* ── Documents page ─────────────────────────────────────────────── */
  documentHelp: { en: "Document help", ta: "ஆவண உதவி", ml: "ഡോക്യുമെന്റ് സഹായം", hi: "दस्तावेज़ सहायता" },
  documentHelpSub: { en: "Where to get each document, what you need, and the official portal to apply.", ta: "ஒவ்வொரு ஆவணத்தையும் எங்கே பெறுவது, என்ன தேவை மற்றும் விண்ணப்பிக்க அதிகாரப்பூர்வ போர்ட்டல்.", ml: "ഓരോ രേഖയും എവിടെ നിന്ന് ലഭിക്കും, എന്ത് ആവശ്യം, അപേക്ഷ പോർട്ടൽ.", hi: "प्रत्येक दस्तावेज़ कहाँ से प्राप्त करें, क्या चाहिए और आवेदन का पोर्टल।" },

  /* ── About page ─────────────────────────────────────────────────── */
  aboutTitle:   { en: "About Civic Nexus", ta: "சிவிக் நெக்சஸ் பற்றி", ml: "Civic Nexus നെക്കുറിച്ച്", hi: "Civic Nexus के बारे में" },
  aboutSub:     { en: "Government Scheme & Scholarship Information Gap Detector — helping citizens and students in Tamil Nadu discover benefits, understand documents and reach the official application portal.", ta: "அரசு திட்டங்கள் & உதவித்தொகை தகவல் இடைவெளி கண்டறிவி — தமிழ்நாட்டில் உள்ள குடிமக்கள் மற்றும் மாணவர்கள் நலன்களைக் கண்டறிய, ஆவணங்களை புரிந்துகொள்ள மற்றும் அதிகாரப்பூர்வ விண்ணப்ப போர்ட்டலை அடைய உதவுகிறது.", ml: "സർക്കാർ പദ്ധതി & സ്കോളർഷിപ്പ് വിവര ഗ്യാപ് ഡിറ്റക്ടർ — തമിഴ്‌നാട്ടിലെ പൗരന്മാർക്കും വിദ്യാർഥികൾക്കും ആനുകൂല്യങ്ങൾ കണ്ടെത്താനും രേഖകൾ മനസ്സിലാക്കാനും ഔദ്യോഗിക അപേക്ഷ പോർട്ടൽ കണ്ടെത്താനും സഹായിക്കുന്നു.", hi: "सरकारी योजना और छात्रवृत्ति सूचना अंतर पहचानकर्ता — तमिलनाडु के नागरिकों और छात्रों को लाभ खोजने, दस्तावेज़ समझने और आधिकारिक आवेदन पोर्टल तक पहुँचने में मदद करता है।" },
  teamTitle:    { en: "Team Civic Nexus", ta: "குழு சிவிக் நெக்சஸ்", ml: "Team Civic Nexus", hi: "Team Civic Nexus" },
  howMatchWorks:{ en: "How matching works", ta: "பொருத்தம் எவ்வாறு செயல்படுகிறது", ml: "മ്യാച്ചിംഗ് എങ്ങനെ പ്രവർത്തിക്കുന്നു", hi: "मिलान कैसे काम करता है" },
  matchPoint1:  { en: "Rule-based checks on state, age, gender, occupation, education, community and income limits.", ta: "மாநிலம், வயது, பாலினம், தொழில், கல்வி, சமூகம் மற்றும் வருமான வரம்பு ஆகியவற்றில் விதி அடிப்படையிலான சரிபார்ப்பு.", ml: "സംസ്ഥാനം, പ്രായം, ലിംഗം, തൊഴിൽ, വിദ്യാഭ്യാസം, സമുദായം, വരുമാന പരിധി എന്നിവ ചട്ടം അനുസരിച്ച് പരിശോധിക്കുന്നു.", hi: "राज्य, उम्र, लिंग, पेशा, शिक्षा, समुदाय और आय सीमा पर नियम-आधारित जाँच।" },
  matchPoint2:  { en: "TF-IDF text similarity between your stated need and each scheme's description, to rank relevance.", ta: "உங்கள் தேவைக்கும் ஒவ்வொரு திட்டத்தின் விளக்கத்திற்கும் இடையில் TF-IDF உரை ஒற்றுமை.", ml: "നിങ്ങളുടെ ആവശ്യവും ഓരോ പദ്ധതിയുടെ വിവരണവും തമ്മിൽ TF-IDF ടെക്സ്റ്റ് സമാനത.", hi: "आपकी जरूरत और हर योजना के विवरण के बीच TF-IDF पाठ समानता।" },
  matchPoint3:  { en: "Results are grouped as Potentially Eligible, More Information Required, or Does Not Meet a Known Eligibility Condition. Nothing here guarantees eligibility.", ta: "முடிவுகள் 'தகுதி பெறலாம்', 'கூடுதல் தகவல் தேவை', அல்லது 'தகுதி நிபந்தனை பூர்த்தியாகவில்லை' என்று தொகுக்கப்படுகின்றன. எதுவும் தகுதியை உத்தரவாதப்படுத்தாது.", ml: "ഫലങ്ങൾ 'അർഹത ഉണ്ടാകാം', 'കൂടുതൽ വിവരം ആവശ്യം', 'അർഹതാ നിബന്ധന പൂർത്തിയാകുന്നില്ല' എന്നിങ്ങനെ തരംതിരിക്കുന്നു. ഒന്നും അർഹത ഉറപ്പ് നൽകുന്നില്ല.", hi: "परिणाम 'संभावित पात्र', 'अधिक जानकारी आवश्यक', या 'पात्रता शर्त पूरी नहीं' के रूप में वर्गीकृत हैं। कुछ भी पात्रता की गारंटी नहीं देता।" },
  officialDataSources:{ en: "Official data sources & integration status", ta: "அதிகாரப்பூர்வ தரவு ஆதாரங்கள் & ஒருங்கிணைப்பு நிலை", ml: "ഔദ്യോഗിക ഡാറ്റ ഉറവിടങ്ങൾ & ഇന്റഗ്രേഷൻ സ്ഥിതി", hi: "आधिकारिक डेटा स्रोत और एकीकरण स्थिति" },
  noLiveIntegration:{ en: "No live government data integration is active yet. Records are curated manually from these official portals, each with its source link.", ta: "இதுவரை நேரலை அரசு தரவு ஒருங்கிணைப்பு இல்லை. பதிவுகள் இந்த அதிகாரப்பூர்வ போர்ட்டல்களிலிருந்து கைமுறையாக தயாரிக்கப்பட்டுள்ளன.", ml: "ഇതുവരെ ലൈവ് ഗവൺമെന്റ് ഡാറ്റ ഇന്റഗ്രേഷൻ ഇല്ല. ഔദ്യോഗിക പോർട്ടലുകളിൽ നിന്ന് സ്വമേധയാ ക്യൂറേറ്റ് ചെയ്ത ഡാറ്റ.", hi: "अभी कोई लाइव सरकारी डेटा एकीकरण सक्रिय नहीं है। रिकॉर्ड इन आधिकारिक पोर्टलों से मैन्युअल रूप से क्यूरेट किए गए हैं।" },

  /* ── Auth page ──────────────────────────────────────────────────── */
  adminSignIn:  { en: "Admin sign in",         ta: "நிர்வாக உள்நுழைவு",   ml: "അഡ്മിൻ സൈൻ ഇൻ",    hi: "व्यवस्थापक साइन इन" },
  createAdmin:  { en: "Create admin account",  ta: "நிர்வாக கணக்கு உருவாக்கவும்", ml: "അഡ്മിൻ അക്കൗണ്ട് ഉണ്ടാക്കുക", hi: "व्यवस्थापक खाता बनाएँ" },
  adminNote:    { en: "The first account created becomes the administrator.", ta: "முதலில் உருவாக்கப்படும் கணக்கு நிர்வாகி ஆகும்.", ml: "ആദ്യം ഉണ്ടാക്കുന്ന അക്കൗണ്ട് അഡ്മിൻ ആകും.", hi: "पहला बनाया गया खाता व्यवस्थापक बन जाएगा।" },
  emailLabel:   { en: "Email",    ta: "மின்னஞ்சல்", ml: "ഇമെയിൽ",    hi: "ईमेल" },
  passwordLabel:{ en: "Password", ta: "கடவுச்சொல்", ml: "പാസ്‌വേഡ്",  hi: "पासवर्ड" },
  signIn:       { en: "Sign in",  ta: "உள்நுழை",    ml: "സൈൻ ഇൻ",   hi: "साइन इन" },
  signUp:       { en: "Sign up",  ta: "பதிவு செய்க", ml: "സൈൻ അപ്പ്", hi: "साइन अप" },
  needAccount:  { en: "Need an account? Sign up",  ta: "கணக்கு இல்லையா? பதிவு செய்க", ml: "അക്കൗണ്ട് ഇല്ലേ? സൈൻ അപ്പ്", hi: "खाता नहीं है? साइन अप करें" },
  haveAccount:  { en: "Have an account? Sign in",  ta: "கணக்கு உள்ளதா? உள்நுழைக", ml: "അക്കൗണ്ട് ഉണ്ടോ? സൈൻ ഇൻ",  hi: "खाता है? साइन इन करें" },
  confirmEmail: { en: "Check your email to confirm your account, then sign in.", ta: "உங்கள் கணக்கை உறுதிப்படுத்த மின்னஞ்சலைப் பாருங்கள், பின்னர் உள்நுழையவும்.", ml: "അക്കൗണ്ട് സ്ഥിരീകരിക്കാൻ ഇമെയിൽ നോക്കുക, പിന്നീട് സൈൻ ഇൻ ചെയ്യുക.", hi: "खाता पुष्टि करने के लिए ईमेल देखें, फिर साइन इन करें।" },

  /* ── Footer & misc ──────────────────────────────────────────────── */
  footerDesc:  { en: "Government Scheme & Scholarship Information Gap Detector", ta: "அரசு திட்டங்கள் & உதவித்தொகை தகவல் இடைவெளி கண்டறிவி", ml: "സർക്കാർ പദ്ധതി & സ്കോളർഷിപ്പ് വിവര ഗ്യാപ് ഡിറ്റക്ടർ", hi: "सरकारी योजना और छात्रवृत्ति सूचना अंतर पहचानकर्ता" },
  disclaimer:  {
    en: "Civic Nexus is an information guide. It does not guarantee eligibility or approval. Applications, verification and approval are handled only by the respective government department.",
    ta: "சிவிக் நெக்சஸ் ஒரு தகவல் வழிகாட்டி மட்டுமே. தகுதி அல்லது ஒப்புதலுக்கு உத்தரவாதம் இல்லை. விண்ணப்பம், சரிபார்ப்பு மற்றும் ஒப்புதல் சம்பந்தப்பட்ட அரசுத் துறையால் மட்டுமே செய்யப்படும்.",
    ml: "Civic Nexus ഒരു ഇൻഫർമേഷൻ ഗൈഡ് മാത്രമാണ്. ഇത് അർഹത അല്ലെങ്കിൽ അംഗീകാരം ഉറപ്പ് നൽകുന്നില്ല. അപേക്ഷ, പരിശോധന, അംഗീകാരം ബന്ധപ്പെട്ട സർക്കാർ വകുപ്പ് മാത്രം ചെയ്യുന്നു.",
    hi: "Civic Nexus एक सूचना मार्गदर्शिका है। यह पात्रता या अनुमोदन की गारंटी नहीं देता। आवेदन, सत्यापन और अनुमोदन केवल संबंधित सरकारी विभाग द्वारा किया जाता है।",
  },

  /* ── Scheme card ─────────────────────────────────────────────────── */
  benefitLabel:  { en: "Benefit:", ta: "நலன்:", ml: "ആനുകൂല്യം:", hi: "लाभ:" },
  needToConfirm: { en: "Need to confirm:", ta: "உறுதிப்படுத்த வேண்டியவை:", ml: "സ്ഥിരീകരിക്കേണ്ടത്:", hi: "पुष्टि करना आवश्यक:" },
  detailsDocsApply:{ en: "Details, documents & apply", ta: "விவரங்கள், ஆவணங்கள் & விண்ணப்பம்", ml: "വിവരങ്ങൾ, രേഖകൾ & അപേക്ഷ", hi: "विवरण, दस्तावेज़ और आवेदन" },
  stateScheme:   { en: "State:", ta: "மாநிலம்:", ml: "സംസ്ഥാനം:", hi: "राज्य:" },

  /* ── Status pills ───────────────────────────────────────────────── */
  statusActive:        { en: "Active",                      ta: "செயலில்",              ml: "സജീവം",                 hi: "सक्रिय" },
  statusNeedsVerify:   { en: "Details pending re-verification", ta: "மறுசரிபார்ப்பு நிலையில்", ml: "വീണ്ടും പരിശോധന ആവശ്യം", hi: "पुनः सत्यापन लंबित" },
  statusExpired:       { en: "Expired",                     ta: "காலாவதியானது",         ml: "കാലഹരണപ്പെട്ടു",        hi: "समाप्त" },
  statusDiscontinued:  { en: "Discontinued",                ta: "நிறுத்தப்பட்டது",      ml: "നിർത്തിവച്ചു",           hi: "बंद" },

  /* ── Gap labels ─────────────────────────────────────────────────── */
  gapComplete:    { en: "Complete Information",    ta: "முழுமையான தகவல்",        ml: "പൂർണ്ണ വിവരം",           hi: "पूर्ण जानकारी" },
  gapIncomplete:  { en: "Incomplete Information",  ta: "முழுமையடையாத தகவல்",    ml: "അപൂർണ്ണ വിവരം",          hi: "अधूरी जानकारी" },
  gapNeedsVerify: { en: "Needs Verification",      ta: "சரிபார்ப்பு தேவை",       ml: "പരിശോധന ആവശ്യം",         hi: "सत्यापन आवश्यक" },
  gapOutdated:    { en: "Potentially Outdated",    ta: "காலாவதியாகலாம்",         ml: "കാലഹരണപ്പെടാൻ സാധ്യത",  hi: "संभावित रूप से पुराना" },
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
    if (saved === "ta" || saved === "en" || saved === "ml" || saved === "hi") setLangState(saved as Lang);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("cn-lang", l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[k][lang] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
