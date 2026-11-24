import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'te';

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  te: 'తెలుగు',
};

const translations: Record<Language, Record<string, string>> = {
  en: {},
  hi: {},
  mr: {},
  te: {},
};

const en: Record<string, string> = {
  'nav.home':'Home','nav.scan':'Scan & Analyse','nav.dashboard':'Dashboard','nav.watchlist':'Site Intelligence',
  'nav.scammed':'Got Scammed?','nav.threat':'Threat Radar','nav.learn':'Learn','nav.membership':'Membership',
  'nav.help':'Help Center','nav.history':'History','nav.account':'Account','nav.signin':'Sign in',
  'nav.developers':'Developers','nav.profile':'Profile & Privacy','nav.privacy':'Privacy','nav.terms':'Terms',
  'nav.disclaimer':'Disclaimer','nav.security':'Security','nav.accessibility':'Accessibility',
  'header.brandTag':'Digital Trust Engine','header.quickPlaceholder':'Quick check URL','header.check':'Check',
  'header.language':'Language','header.read':'Read','header.pause':'Pause','header.resume':'Resume','header.stop':'Stop',
  'header.mode':'Mode','header.light':'Light','header.dark':'Dark','header.system':'System',
  'header.openMenu':'Open menu','header.closeMenu':'Close navigation','header.close':'Close menu',
  'common.loading':'Loading...','common.retry':'Retry','common.dismiss':'Dismiss','common.cancel':'Cancel',
  'common.submit':'Submit','common.save':'Save','common.back':'Back','common.next':'Next','common.search':'Search',
  'common.notSet':'Not set','common.yes':'Yes','common.no':'No','common.signOut':'Log out',
  'landing.kicker':'DIGITAL SAFETY & AWARENESS','landing.heroTitle':'Before you trust,','landing.heroAccent':'check.',
  'landing.heroText':'CyberProof helps you check suspicious websites, messages, emails, QR codes and other digital interactions — then explains what to do next.',
  'landing.checkSomething':'Check something','landing.learnScams':'Learn how scams work',
  'landing.explainable':'Explainable checks','landing.noSecrets':'No passwords or OTPs','landing.nextSteps':'Practical next steps',
  'landing.checkHeading':'Something looks wrong?','landing.checkAccent':'Check it before you act.',
  'landing.checkText':'Choose what you received. CyberProof takes you to the right analysis flow without asking for sensitive authentication secrets.',
  'landing.awarenessHeading':'How are innocent people','landing.awarenessAccent':'being tricked?',
  'landing.learnRedFlags':'Learn the red flags','landing.started':'Start recovery','landing.threat':'Open Threat Radar',
  'landing.rulesHeading':'Six habits that','landing.rulesAccent':'stop common scams.',
  'landing.journeyHeading':'From doubt','landing.journeyAccent':'to a safer decision.',
  'landing.extensionHeading':'Browser extension','landing.extensionAccent':'in development.',
  'landing.previewGuard':'Preview Guard','landing.membership':'See membership','landing.report':'Open National Cyber Crime Reporting Portal',
  'account.loading':'Checking your account session...','account.session':'Account session','account.signedIn':'Signed in as',
  'account.name':'Name','account.membership':'Recorded membership tier','account.premium':'Premium entitlements remain unavailable until membership expiry can be verified.',
  'account.scoped':'Account history and watchlist are scoped to this account. Guest sessions on this browser remain separate.',
  'account.profile':'Profile & Privacy','account.welcome':'Welcome back','account.create':'Create your account',
  'account.login':'Log in','account.register':'Register','account.nameOptional':'Name (optional)','account.email':'Email',
  'account.password':'Password','account.minChars':'Use at least 8 characters.','account.createAccount':'Create account',
  'account.continueGuest':'Continue as guest','account.guestText':'You can scan URLs as a guest without an account.',
  'dashboard.kicker':'Personal Security Dashboard','dashboard.title':'Digital Trust Overview',
  'dashboard.subtitle':'Monitor verified websites, inspect recent scan snapshots, and evaluate security changes.',
  'dashboard.newScan':'Start New Scan','dashboard.analyses':'Recorded Analyses','dashboard.tracked':'Tracked Websites',
  'dashboard.highRisk':'High Risk Flagged','dashboard.loading':'Loading your saved history...',
  'dashboard.retry':'Retry history','dashboard.viewHistory':'View Full History',
  'scan.tabs.url':'Website / URL','scan.tabs.qr':'QR Code','scan.tabs.email':'Email','scan.tabs.message':'Message / SMS',
  'scan.tabs.otp':'Caller / OTP','scan.loading':'Analyzing...','scan.retry':'Restore guest session',
  'scan.title':'Scan & Analyse','scan.privacy':'Your input stays private; do not enter passwords or OTP codes.',
  'history.title':'Security History','history.empty':'No saved scans yet','history.clear':'Clear history','history.view':'View details',
  'watchlist.title':'Site Intelligence','watchlist.empty':'No websites are being tracked yet.',
  'watchlist.add':'Add to watchlist','watchlist.remove':'Remove from watchlist',
  'membership.title':'Membership','membership.current':'Current plan','membership.upgrade':'Upgrade',
  'membership.free':'Free','membership.premium':'Premium',
  'help.title':'Help Center','learn.title':'Learn','threat.title':'Threat Radar','incident.title':'Got Scammed?',
  'result.title':'Scan Result','result.trustScore':'Trust score','result.risk':'Risk level','result.explanation':'Why this result',
  'result.action':'Recommended action','result.back':'Scan something else','result.unknown':'Unknown',
  'errors.auth':'Could not authenticate. Please try again.',
  'errors.network':'Could not reach CyberProof. Check your connection and try again.',
  'errors.generic':'The analysis could not be completed. Please try again.',
  'errors.guest':'Could not restore your guest session. Please retry.',
  'speech.unsupported':'Read Aloud is not supported in this browser.',
  'speech.noText':'There is no readable text on this page.',
  'footer.credential':'Designed and developed by the CyberProof student team.',
  'footer.disclaimer':'CyberProof is an educational project and does not replace official emergency, financial, law-enforcement or government reporting services.',
};
Object.assign(translations.en, en);

translations.hi = {
  ...en,
  'nav.home':'होम','nav.scan':'स्कैन और विश्लेषण','nav.dashboard':'डैशबोर्ड','nav.watchlist':'साइट इंटेलिजेंस','nav.scammed':'ठगी हुई?','nav.threat':'थ्रेट रडार','nav.learn':'सीखें','nav.membership':'सदस्यता','nav.help':'सहायता केंद्र','nav.history':'इतिहास','nav.account':'खाता','nav.signin':'साइन इन','nav.developers':'डेवलपर्स','nav.profile':'प्रोफ़ाइल और गोपनीयता','nav.privacy':'गोपनीयता','nav.terms':'शर्तें','nav.disclaimer':'अस्वीकरण','nav.security':'सुरक्षा','nav.accessibility':'सरल उपयोग',
  'header.brandTag':'डिजिटल विश्वास इंजन','header.quickPlaceholder':'URL तुरंत जांचें','header.check':'जांचें','header.language':'भाषा','header.read':'पढ़ें','header.pause':'रोकें','header.resume':'जारी रखें','header.stop':'बंद करें','header.mode':'मोड','header.light':'हल्का','header.dark':'गहरा','header.system':'सिस्टम','header.openMenu':'मेन्यू खोलें','header.closeMenu':'नेविगेशन बंद करें','header.close':'मेन्यू बंद करें',
  'common.loading':'लोड हो रहा है...','common.retry':'फिर प्रयास करें','common.dismiss':'हटाएँ','common.cancel':'रद्द करें','common.submit':'जमा करें','common.save':'सहेजें','common.back':'वापस','common.next':'आगे','common.search':'खोजें','common.notSet':'सेट नहीं','common.signOut':'लॉग आउट',
  'landing.kicker':'डिजिटल सुरक्षा और जागरूकता','landing.heroTitle':'विश्वास करने से पहले,','landing.heroAccent':'जांचें।','landing.heroText':'CyberProof संदिग्ध वेबसाइटों, संदेशों, ईमेल, QR कोड और अन्य डिजिटल गतिविधियों की जांच करता है — और आगे क्या करना है बताता है।','landing.checkSomething':'कुछ जांचें','landing.learnScams':'घोटाले कैसे काम करते हैं जानें','landing.explainable':'समझने योग्य जांच','landing.noSecrets':'कोई पासवर्ड या OTP नहीं','landing.nextSteps':'व्यावहारिक अगले कदम','landing.checkHeading':'कुछ गलत लग रहा है?','landing.checkAccent':'कार्रवाई से पहले जांचें।','landing.checkText':'आपको जो मिला है उसे चुनें। CyberProof संवेदनशील प्रमाणीकरण जानकारी मांगे बिना सही विश्लेषण पृष्ठ पर ले जाता है।','landing.awarenessHeading':'निरपराध लोग','landing.awarenessAccent':'कैसे ठगे जा रहे हैं?','landing.learnRedFlags':'लाल संकेत जानें','landing.started':'रिकवरी शुरू करें','landing.threat':'थ्रेट रडार खोलें','landing.rulesHeading':'छह आदतें जो','landing.rulesAccent':'आम घोटालों को रोकती हैं।','landing.journeyHeading':'संदेह से','landing.journeyAccent':'सुरक्षित निर्णय तक।','landing.extensionHeading':'ब्राउज़र एक्सटेंशन','landing.extensionAccent':'विकास में है।','landing.previewGuard':'गार्ड का पूर्वावलोकन','landing.membership':'सदस्यता देखें','landing.report':'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल खोलें',
  'account.loading':'आपका खाता सत्र जांचा जा रहा है...','account.session':'खाता सत्र','account.signedIn':'इस रूप में साइन इन','account.name':'नाम','account.membership':'दर्ज सदस्यता स्तर','account.premium':'सदस्यता की समाप्ति सत्यापित होने तक प्रीमियम सुविधाएँ उपलब्ध नहीं हैं।','account.scoped':'खाता इतिहास और वॉचलिस्ट इस खाते से जुड़ी हैं। इस ब्राउज़र के अतिथि सत्र अलग रहते हैं।','account.profile':'प्रोफ़ाइल और गोपनीयता','account.welcome':'वापसी पर स्वागत है','account.create':'अपना खाता बनाएँ','account.login':'लॉग इन','account.register':'पंजीकरण','account.nameOptional':'नाम (वैकल्पिक)','account.email':'ईमेल','account.password':'पासवर्ड','account.minChars':'कम से कम 8 अक्षर उपयोग करें।','account.createAccount':'खाता बनाएँ','account.continueGuest':'अतिथि के रूप में जारी रखें','account.guestText':'आप बिना खाते के भी URL स्कैन कर सकते हैं।',
  'dashboard.kicker':'व्यक्तिगत सुरक्षा डैशबोर्ड','dashboard.title':'डिजिटल विश्वास अवलोकन','dashboard.subtitle':'वेबसाइटों की निगरानी करें, हाल के स्कैन देखें और सुरक्षा बदलाव जांचें।','dashboard.newScan':'नया स्कैन शुरू करें','dashboard.analyses':'रिकॉर्ड किए गए विश्लेषण','dashboard.tracked':'ट्रैक किए गए वेबसाइट','dashboard.highRisk':'उच्च जोखिम के निशान','dashboard.loading':'आपका सहेजा हुआ इतिहास लोड हो रहा है...','dashboard.retry':'इतिहास फिर लोड करें','dashboard.viewHistory':'पूरा इतिहास देखें',
  'scan.tabs.url':'वेबसाइट / URL','scan.tabs.qr':'QR कोड','scan.tabs.email':'ईमेल','scan.tabs.message':'संदेश / SMS','scan.tabs.otp':'कॉलर / OTP','scan.loading':'विश्लेषण हो रहा है...','scan.retry':'अतिथि सत्र पुनर्स्थापित करें','scan.title':'स्कैन और विश्लेषण','scan.privacy':'आपकी जानकारी निजी रहती है; पासवर्ड या OTP न डालें।',
  'history.title':'सुरक्षा इतिहास','history.empty':'अभी कोई स्कैन सहेजा नहीं गया','history.clear':'इतिहास हटाएँ','history.view':'विवरण देखें','watchlist.title':'साइट इंटेलिजेंस','watchlist.empty':'अभी कोई वेबसाइट ट्रैक नहीं हो रही।','watchlist.add':'वॉचलिस्ट में जोड़ें','watchlist.remove':'वॉचलिस्ट से हटाएँ','membership.title':'सदस्यता','membership.current':'वर्तमान योजना','membership.upgrade':'अपग्रेड','membership.free':'नि:शुल्क','membership.premium':'प्रीमियम','help.title':'सहायता केंद्र','learn.title':'सीखें','threat.title':'थ्रेट रडार','incident.title':'ठगी हुई?','result.title':'स्कैन परिणाम','result.trustScore':'विश्वास स्कोर','result.risk':'जोखिम स्तर','result.explanation':'यह परिणाम क्यों','result.action':'अनुशंसित कार्रवाई','result.back':'कुछ और स्कैन करें','result.unknown':'अज्ञात',
  'errors.auth':'प्रमाणीकरण नहीं हो सका। कृपया फिर प्रयास करें।','errors.network':'CyberProof से संपर्क नहीं हुआ। इंटरनेट जांचें और फिर प्रयास करें।','errors.generic':'विश्लेषण पूरा नहीं हो सका। कृपया फिर प्रयास करें।','errors.guest':'अतिथि सत्र पुनर्स्थापित नहीं हो सका। फिर प्रयास करें।','speech.unsupported':'इस ब्राउज़र में पढ़कर सुनाने की सुविधा उपलब्ध नहीं है।','speech.noText':'इस पृष्ठ पर पढ़ने योग्य कोई पाठ नहीं है।','footer.credential':'CyberProof छात्र टीम द्वारा डिज़ाइन और विकसित।','footer.disclaimer':'CyberProof एक शैक्षिक परियोजना है और आधिकारिक आपातकालीन, वित्तीय, कानून या सरकारी रिपोर्टिंग सेवाओं का विकल्प नहीं है।',
};

translations.mr = {
  ...en,
  'nav.home':'मुख्यपृष्ठ','nav.scan':'स्कॅन आणि विश्लेषण','nav.dashboard':'डॅशबोर्ड','nav.watchlist':'साइट इंटेलिजन्स','nav.scammed':'फसवणूक झाली?','nav.threat':'थ्रेट रडार','nav.learn':'शिका','nav.membership':'सदस्यता','nav.help':'मदत केंद्र','nav.history':'इतिहास','nav.account':'खाते','nav.signin':'साइन इन','nav.developers':'डेव्हलपर्स','nav.profile':'प्रोफाइल आणि गोपनीयता','nav.privacy':'गोपनीयता','nav.terms':'अटी','nav.disclaimer':'अस्वीकरण','nav.security':'सुरक्षा','nav.accessibility':'सुलभता',
  'header.brandTag':'डिजिटल विश्वास इंजिन','header.quickPlaceholder':'URL त्वरीत तपासा','header.check':'तपासा','header.language':'भाषा','header.read':'वाचा','header.pause':'थांबवा','header.resume':'पुन्हा सुरू','header.stop':'बंद करा','header.mode':'मोड','header.light':'हलका','header.dark':'गडद','header.system':'सिस्टम','header.openMenu':'मेनू उघडा','header.closeMenu':'नेव्हिगेशन बंद करा','header.close':'मेनू बंद करा',
  'common.loading':'लोड होत आहे...','common.retry':'पुन्हा प्रयत्न करा','common.dismiss':'बंद करा','common.cancel':'रद्द करा','common.submit':'सादर करा','common.save':'जतन करा','common.back':'मागे','common.next':'पुढे','common.search':'शोधा','common.notSet':'नसलेले','common.signOut':'लॉग आउट',
  'landing.kicker':'डिजिटल सुरक्षा आणि जागरूकता','landing.heroTitle':'विश्वास ठेवण्याआधी,','landing.heroAccent':'तपासा.','landing.heroText':'CyberProof संशयास्पद वेबसाइट्स, संदेश, ईमेल, QR कोड आणि इतर डिजिटल व्यवहार तपासण्यास मदत करते — आणि पुढे काय करावे ते सांगते.','landing.checkSomething':'काहीतरी तपासा','landing.learnScams':'फसवणूक कशी होते ते शिका','landing.explainable':'स्पष्ट तपासण्या','landing.noSecrets':'पासवर्ड किंवा OTP नाही','landing.nextSteps':'व्यावहारिक पुढील पावले','landing.checkHeading':'काहीतरी चुकीचे वाटते?','landing.checkAccent':'कृती करण्यापूर्वी तपासा.','landing.checkText':'आपल्याला मिळालेली गोष्ट निवडा. CyberProof संवेदनशील प्रवेश माहिती मागत नाही आणि योग्य विश्लेषणात नेते.','landing.awarenessHeading':'निर्दोष लोकांना','landing.awarenessAccent':'कसे फसवले जाते?','landing.learnRedFlags':'इशारा चिन्हे शिका','landing.started':'रिकव्हरी सुरू करा','landing.threat':'थ्रेट रडार उघडा','landing.rulesHeading':'सामान्य फसवणुकीला','landing.rulesAccent':'थांबवणाऱ्या सहा सवयी.','landing.journeyHeading':'संशयापासून','landing.journeyAccent':'सुरक्षित निर्णयाकडे.','landing.extensionHeading':'ब्राउझर एक्स्टेंशन','landing.extensionAccent':'विकासात आहे.','landing.previewGuard':'गार्डचे पूर्वावलोकन','landing.membership':'सदस्यता पहा','landing.report':'राष्ट्रीय साइबर गुन्हे तक्रार पोर्टल उघडा',
  'account.loading':'आपले खाते सत्र तपासत आहे...','account.session':'खाते सत्र','account.signedIn':'असे साइन इन','account.name':'नाव','account.membership':'नोंद केलेली सदस्यता पातळी','account.premium':'सदस्यता कालबाह्यता सत्यापित झाल्याशिवाय प्रीमियम सुविधा उपलब्ध नाहीत.','account.scoped':'खाते इतिहास आणि वॉचलिस्ट या खात्याशी जोडलेले आहेत. या ब्राउझरची अतिथी सत्रे स्वतंत्र राहतात.','account.profile':'प्रोफाइल आणि गोपनीयता','account.welcome':'पुन्हा स्वागत आहे','account.create':'आपले खाते तयार करा','account.login':'लॉग इन','account.register':'नोंदणी','account.nameOptional':'नाव (ऐच्छिक)','account.email':'ईमेल','account.password':'पासवर्ड','account.minChars':'किमान 8 अक्षरे वापरा.','account.createAccount':'खाते तयार करा','account.continueGuest':'अतिथी म्हणून सुरू ठेवा','account.guestText':'आपण खाते न करता URL स्कॅन करू शकता.',
  'dashboard.kicker':'वैयक्तिक सुरक्षा डॅशबोर्ड','dashboard.title':'डिजिटल विश्वास आढावा','dashboard.subtitle':'वेबसाइट्सचे निरीक्षण करा, अलीकडील स्कॅन पहा आणि सुरक्षा बदलांचे मूल्यमापन करा.','dashboard.newScan':'नवीन स्कॅन सुरू करा','dashboard.analyses':'नोंदवलेले विश्लेषण','dashboard.tracked':'ट्रॅक केलेल्या वेबसाइट्स','dashboard.highRisk':'उच्च धोका चिन्हांकित','dashboard.loading':'आपला जतन केलेला इतिहास लोड होत आहे...','dashboard.retry':'इतिहास पुन्हा लोड करा','dashboard.viewHistory':'पूर्ण इतिहास पहा',
  'scan.tabs.url':'वेबसाइट / URL','scan.tabs.qr':'QR कोड','scan.tabs.email':'ईमेल','scan.tabs.message':'संदेश / SMS','scan.tabs.otp':'कॉलर / OTP','scan.loading':'विश्लेषण होत आहे...','scan.retry':'अतिथी सत्र पुनर्स्थापित करा','scan.title':'स्कॅन आणि विश्लेषण','scan.privacy':'आपली माहिती खासगी राहते; पासवर्ड किंवा OTP प्रविष्ट करू नका.',
  'history.title':'सुरक्षा इतिहास','history.empty':'अद्याप कोणतेही स्कॅन जतन नाही','history.clear':'इतिहास साफ करा','history.view':'तपशील पहा','watchlist.title':'साइट इंटेलिजन्स','watchlist.empty':'अद्याप कोणतीही वेबसाइट ट्रॅक होत नाही.','watchlist.add':'वॉचलिस्टमध्ये जोडा','watchlist.remove':'वॉचलिस्टमधून काढा','membership.title':'सदस्यता','membership.current':'सध्याचा प्लॅन','membership.upgrade':'अपग्रेड','membership.free':'मोफत','membership.premium':'प्रीमियम','help.title':'मदत केंद्र','learn.title':'शिका','threat.title':'थ्रेट रडार','incident.title':'फसवणूक झाली?','result.title':'स्कॅन परिणाम','result.trustScore':'विश्वास गुण','result.risk':'जोखीम पातळी','result.explanation':'हा परिणाम का','result.action':'शिफारस केलेली कृती','result.back':'दुसरे काहीतरी स्कॅन करा','result.unknown':'अज्ञात',
  'errors.auth':'प्रमाणीकरण करता आले नाही. कृपया पुन्हा प्रयत्न करा.','errors.network':'CyberProofशी संपर्क होत नाही. इंटरनेट तपासा आणि पुन्हा प्रयत्न करा.','errors.generic':'विश्लेषण पूर्ण करता आले नाही. कृपया पुन्हा प्रयत्न करा.','errors.guest':'अतिथी सत्र पुनर्स्थापित करता आले नाही. पुन्हा प्रयत्न करा.','speech.unsupported':'या ब्राउझरमध्ये वाचून ऐकवण्याची सुविधा उपलब्ध नाही.','speech.noText':'या पानावर वाचता येईल असा मजकूर नाही.','footer.credential':'CyberProof विद्यार्थी संघाने डिझाइन आणि विकसित केले.','footer.disclaimer':'CyberProof हा शैक्षणिक प्रकल्प आहे आणि अधिकृत आपत्कालीन, वित्तीय, कायद्याची अंमलबजावणी किंवा सरकारी तक्रार सेवांचे पर्याय नाही.',
};

translations.te = {
  ...en,
  'nav.home':'హోమ్','nav.scan':'స్కాన్ & విశ్లేషణ','nav.dashboard':'డాష్‌బోర్డ్','nav.watchlist':'సైట్ ఇంటెలిజెన్స్','nav.scammed':'మోసం జరిగిందా?','nav.threat':'థ్రెట్ రాడార్','nav.learn':'నేర్చుకోండి','nav.membership':'సభ్యత్వం','nav.help':'సహాయ కేంద్రం','nav.history':'చరిత్ర','nav.account':'ఖాతా','nav.signin':'సైన్ ఇన్','nav.developers':'డెవలపర్లు','nav.profile':'ప్రొఫైల్ & గోప్యత','nav.privacy':'గోప్యత','nav.terms':'నిబంధనలు','nav.disclaimer':'నివేదిక','nav.security':'భద్రత','nav.accessibility':'అందుబాటు',
  'header.brandTag':'డిజిటల్ విశ్వాస ఇంజిన్','header.quickPlaceholder':'URL త్వరగా పరీక్షించండి','header.check':'పరీక్షించు','header.language':'భాష','header.read':'చదువు','header.pause':'ఆపు','header.resume':'కొనసాగించు','header.stop':'ఆపు','header.mode':'రీతి','header.light':'లేత','header.dark':'ముదురు','header.system':'సిస్టమ్','header.openMenu':'మెనూ తెరువు','header.closeMenu':'నావిగేషన్ మూసివేయి','header.close':'మెనూ మూసివేయి',
  'common.loading':'లోడ్ అవుతోంది...','common.retry':'మళ్లీ ప్రయత్నించండి','common.dismiss':'మూసివేయి','common.cancel':'రద్దు','common.submit':'సమర్పించు','common.save':'సేవ్ చేయి','common.back':'వెనుకకు','common.next':'తదుపరి','common.search':'వెతుకు','common.notSet':'సెట్ చేయలేదు','common.signOut':'లాగ్ అవుట్',
  'landing.kicker':'డిజిటల్ భద్రత & అవగాహన','landing.heroTitle':'నమ్మకానికి ముందు,','landing.heroAccent':'పరీక్షించండి.','landing.heroText':'CyberProof అనుమానాస్పద వెబ్‌సైట్లు, సందేశాలు, ఇమెయిల్స్, QR కోడ్లు మరియు ఇతర డిజిటల్ కార్యకలాపాలను పరీక్షించి తరువాత ఏం చేయాలో వివరిస్తుంది.','landing.checkSomething':'ఏదైనా పరీక్షించండి','landing.learnScams':'మోసాలు ఎలా జరుగుతాయో తెలుసుకోండి','landing.explainable':'అర్థమయ్యే పరీక్షలు','landing.noSecrets':'పాస్‌వర్డ్లు లేదా OTP లు అవసరం లేదు','landing.nextSteps':'ప్రాక్టికల్ తదుపరి చర్యలు','landing.checkHeading':'ఏదో తప్పుగా ఉందా?','landing.checkAccent':'చర్య తీసుకునేముందు పరీక్షించండి.','landing.checkText':'మీకు వచ్చినదాన్ని ఎంచుకోండి. CyberProof సున్నితమైన ప్రవేశ వివరాలు అడగకుండా సరైన విశ్లేషణ దారికి తీసుకెళ్తుంది.','landing.awarenessHeading':'నిర్దోషులని','landing.awarenessAccent':'ఎలా మోసగిస్తారు?','landing.learnRedFlags':'హెచ్చరిక సంకేతాలు తెలుసుకోండి','landing.started':'రికవరీ మొదలు పెట్టండి','landing.threat':'థ్రెట్ రాడార్ తెరవండి','landing.rulesHeading':'సాధారణ మోసాలను','landing.rulesAccent':'ఆపే ఆరు అలవాట్లు.','landing.journeyHeading':'సందేహం నుండి','landing.journeyAccent':'సురక్షిత నిర్ణయం వరకు.','landing.extensionHeading':'బ్రౌజర్ ఎక్స్‌టెన్షన్','landing.extensionAccent':'అభివృద్ధిలో ఉంది.','landing.previewGuard':'గార్డ్ ప్రివ్యూకు వెళ్లండి','landing.membership':'సభ్యత్వం చూడండి','landing.report':'జాతీయ సైబర్ నేరాల నివేదిక పోర్టల్ తెరవండి',
  'account.loading':'మీ ఖాతా సెషన్‌ను పరిశీలిస్తోంది...','account.session':'ఖాతా సెషన్','account.signedIn':'లాగిన్ చేసిన ఖాతా','account.name':'పేరు','account.membership':'నమోదైన సభ్యత్వ స్థాయి','account.premium':'సభ్యత్వ కాలం ధృవీకరించబడే వరకు ప్రీమియం హక్కులు అందుబాటులో ఉండవు.','account.scoped':'ఖాతా చరిత్ర మరియు వాచ్‌లిస్ట్ ఈ ఖాతాకు మాత్రమే సంబంధించినవి. ఈ బ్రౌజర్ అతిథి సెషన్లు వేరుగా ఉంటాయి.','account.profile':'ప్రొఫైల్ & గోప్యత','account.welcome':'మళ్లీ స్వాగతం','account.create':'మీ ఖాతాను సృష్టించండి','account.login':'లాగిన్','account.register':'నమోదు','account.nameOptional':'పేరు (ఐచ్ఛికం)','account.email':'ఇమెయిల్','account.password':'పాస్‌వర్డ్','account.minChars':'కనీసం 8 అక్షరాలు ఉపయోగించండి.','account.createAccount':'ఖాతా సృష్టించండి','account.continueGuest':'అతిథిగా కొనసాగండి','account.guestText':'ఖాతా లేకుండానే URL లను స్కాన్ చేయవచ్చు.',
  'dashboard.kicker':'వ్యక్తిగత భద్రత డాష్‌బోర్డ్','dashboard.title':'డిజిటల్ విశ్వాస అవలోకనం','dashboard.subtitle':'వెబ్‌సైట్లను పర్యవేక్షించండి, ఇటీవలి స్కాన్‌లను చూడండి మరియు భద్రత మార్పులను అంచనా వేయండి.','dashboard.newScan':'కొత్త స్కాన్ ప్రారంభించండి','dashboard.analyses':'నమోదైన విశ్లేషణలు','dashboard.tracked':'ట్రాక్ చేసే వెబ్‌సైట్లు','dashboard.highRisk':'అధిక నష్ట సూచనలు','dashboard.loading':'మీ సేవ్ చేసిన చరిత్ర లోడ్ అవుతోంది...','dashboard.retry':'చరిత్రను మళ్లీ లోడ్ చేయి','dashboard.viewHistory':'పూర్తి చరిత్ర చూడండి',
  'scan.tabs.url':'వెబ్‌సైట్ / URL','scan.tabs.qr':'QR కోడ్','scan.tabs.email':'ఇమెయిల్','scan.tabs.message':'సందేశం / SMS','scan.tabs.otp':'కాలర్ / OTP','scan.loading':'విశ్లేషిస్తోంది...','scan.retry':'అతిథి సెషన్ పునరుద్ధరించు','scan.title':'స్కాన్ & విశ్లేషణ','scan.privacy':'మీ వివరాలు గోప్యంగా ఉంటాయి; పాస్‌వర్డ్ లేదా OTP ఎంటర్ చేయవద్దు.',
  'history.title':'భద్రతా చరిత్ర','history.empty':'ఇంకా స్కాన్లు సేవ్ చేయలేదు','history.clear':'చరిత్ర తొలగించు','history.view':'వివరాలు చూడండి','watchlist.title':'సైట్ ఇంటెలిజెన్స్','watchlist.empty':'ఇంకా ఎలాంటి వెబ్‌సైట్‌లను ట్రాక్ చేయడం లేదు.','watchlist.add':'వాచ్‌లిస్ట్‌కు జోడించు','watchlist.remove':'వాచ్‌లిస్ట్ నుండి తొలగించు','membership.title':'సభ్యత్వం','membership.current':'ప్రస్తుత ప్రణాళిక','membership.upgrade':'అప్‌గ్రేడ్','membership.free':'ఉచితం','membership.premium':'ప్రీమియం','help.title':'సహాయ కేంద్రం','learn.title':'నేర్చుకోండి','threat.title':'థ్రెట్ రాడార్','incident.title':'మోసం జరిగిందా?','result.title':'స్కాన్ ఫలితం','result.trustScore':'విశ్వాస స్కోరు','result.risk':'నష్ట స్థాయి','result.explanation':'ఈ ఫలితం ఎందుకు','result.action':'సిఫార్సు చేసిన చర్య','result.back':'మరొకదాన్ని స్కాన్ చేయి','result.unknown':'తెలియదు',
  'errors.auth':'ప్రమాణీకరణ చేయలేకపోయింది. మళ్లీ ప్రయత్నించండి.','errors.network':'CyberProofకు చేరలేము. కనెక్షన్ పరీక్షించి మళ్లీ ప్రయత్నించండి.','errors.generic':'విశ్లేషణ పూర్తి కాలేదు. మళ్లీ ప్రయత్నించండి.','errors.guest':'అతిథి సెషన్ పునరుద్ధరించలేకపోయింది. మళ్లీ ప్రయత్నించండి.','speech.unsupported':'ఈ బ్రౌజర్‌లో చదివి వినిపించే సేవకు మద్దతు లేదు.','speech.noText':'ఈ పేజీలో చదవదగిన పాఠ్యం లేదు.','footer.credential':'CyberProof విద్యార్థి బృందం రూపొందించి అభివృద్ధి చేసింది.','footer.disclaimer':'CyberProof ఒక విద్యా ప్రాజెక్టు మాత్రమే; అత్యవసర, ఆర్థిక, చట్టబద్ధమైన లేదా ప్రభుత్వ నివేదిక సేవలకు ప్రత్యామ్నాయం కాదు.',
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cyberproof-language');
    return saved === 'hi' || saved === 'mr' || saved === 'te' ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('cyberproof-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (next: Language) => setLanguageState(next);
  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    languageName: languageNames[language],
    t: (key: string) => translations[language][key] || translations.en[key] || key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
