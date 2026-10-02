"""Seed data for the 10 Pandurang Land Developers township projects."""

IMG = {
    "heroAerial": "https://images.unsplash.com/photo-1776149421497-7f8be85cb885?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjB2aWV3JTIwZ3JlZW4lMjB0b3duc2hpcCUyMGxhbmQlMjBwbG90c3xlbnwwfHx8fDE3ODQyODk4Njh8MA&ixlib=rb-4.1.0&q=85",
    "gatedEntrance": "https://images.unsplash.com/photo-1775112077888-8fa36e9bbc51?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxnYXRlZCUyMGNvbW11bml0eSUyMGVudHJhbmNlJTIwcmVhbCUyMGVzdGF0ZXxlbnwwfHx8fDE3ODQyODk4Njh8MA&ixlib=rb-4.1.0&q=85",
    "greenLayout": "https://images.unsplash.com/photo-1587966783152-ca9cda6b3052?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjByZXNpZGVudGlhbCUyMGxheW91dCUyMHBsb3R8ZW58MHx8fHwxNzg0Mjg5ODkyfDA&ixlib=rb-4.1.0&q=85",
    "parkLandscape": "https://images.unsplash.com/photo-1729444906899-33329455b172?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxncmVlbiUyMHBhcmslMjBuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzg0Mjg5ODkyfDA&ixlib=rb-4.1.0&q=85",
    "familyPark": "https://images.unsplash.com/photo-1765181120744-4700543cdce6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGluZGlhbiUyMGZhbWlseSUyMG5hdHVyZSUyMHBhcmt8ZW58MHx8fHwxNzg0Mjg5ODY4fDA&ixlib=rb-4.1.0&q=85",
}

_pool = [IMG["heroAerial"], IMG["greenLayout"], IMG["gatedEntrance"], IMG["parkLandscape"], IMG["familyPark"]]

_common = [
    "प्रशस्त डांबरी रस्ते.",
    "भव्य स्वागत कमान (Grand Entrance Arch).",
    "बांधकामास योग्य जमीन, रहिवासी उपयुक्त N.A. प्लॉट्स.",
    "पाणी, लाईट व स्ट्रीट लाईट्सची सोय उपलब्ध.",
    "प्रत्येक प्लॉटला तारेचे कंपाऊंड, गेट व नेम प्लेट.",
    "रोड साईड झाडे व ठिबक सिंचन तसेच सिमेंट बाकडी.",
    "ओपन स्पेस, चिल्ड्रन पार्क, स्पोर्ट्स ग्राऊंड व ओपन जिमची सोय.",
    "सर्व प्लॉट वास्तुशास्त्रानुसार पूर्व, पश्चिम, उत्तर मुखी.",
    "शांत, रम्य व प्रदूषण विरहित परिसर (Pollution-free surroundings).",
    "खरेदीपत्रा नंतर ७/१२ व ८-अ उतारा करून देणे.",
]

SEED_PROJECTS = [
    {
        "slug": "lakshminarayan-park", "name": "लक्ष्मीनारायण पार्क", "nameEn": "Laxminarayan Park",
        "price": "649", "tagline": "मिरज-बेडग रोडवरील प्रीमियम N.A. टाउनशिप",
        "location": "मिरज-बेडग रोड, ता. मिरज, जि. सांगली",
        "address": "मिरज-बेडग रोड, लक्ष्मीमंदिर जवळ, महानगरपालिका हद्द लगत, बोलवाड हद्द, ता. मिरज, जि. सांगली.",
        "mapQuery": "Laxmi Narayan Park Miraj Sangli", "image": _pool[0],
        "gallery": [_pool[0], _pool[1], _pool[3]],
        "features": [
            "प्रशस्त डांबरी रस्ते.", "भव्य स्वागत कमान.", "भव्य लक्ष्मी मंदिर.",
            "सांडपाण्यासाठी अंडरग्राउंड ड्रेनेजची सोय.", "बांधकामास योग्य जमीन, रहिवासी उपयुक्त N.A. प्लॉट्स.",
            "पाणी, लाईट व स्ट्रीट लाईटची सोय उपलब्ध.", "प्रत्येक प्लॉटला तारेचे कंपाऊंड, गेट व नेम प्लेट.",
            "ओपन स्पेस, चिल्ड्रन पार्क, स्पोर्ट्स ग्राऊंड व ओपन जिमची सोय.", "सभागृह मंडप व इनडोअर गेम्स.",
            "सर्व प्लॉट वास्तुशास्त्रानुसार पूर्व, पश्चिम, उत्तर मुखी.",
            "रत्नागिरी-नागपूर महामार्गापासून ९०० मिटर अंतरावर.",
            "मुख्य रस्त्यास लागून, वस्तीलगत, शाळा, बझार व जीवनावश्यक सोयी-सुविधा हाकेच्या अंतरावर.",
        ],
    },
    {
        "slug": "vyankatesh-park", "name": "व्यंकटेश पार्क", "nameEn": "Vyankatesh Park",
        "price": "451", "tagline": "हिरवाईने नटलेला निसर्गरम्य परिसर",
        "location": "सांगली-मिरज परिसर, जि. सांगली", "address": "सांगली-मिरज रोड परिसर, ता. मिरज, जि. सांगली.",
        "mapQuery": "Vyankatesh Park Sangli", "image": _pool[1], "gallery": [_pool[1], _pool[3], _pool[0]], "features": _common,
    },
    {
        "slug": "sant-balumama-park", "name": "संत बाळूमामा पार्क", "nameEn": "Sant Balumama Park",
        "price": "450", "tagline": "भव्य स्वागत कमान असलेली आदर्श टाउनशिप",
        "location": "ता. मिरज, जि. सांगली", "address": "मिरज परिसर, ता. मिरज, जि. सांगली.",
        "mapQuery": "Sant Balumama Park Sangli", "image": _pool[2], "gallery": [_pool[2], _pool[0], _pool[4]], "features": _common,
    },
    {
        "slug": "siddheshwar-park", "name": "सिद्धेश्वर पार्क", "nameEn": "Siddheshwar Park",
        "price": "700", "tagline": "प्रशस्त प्लॉट्स व उत्तम कनेक्टिव्हिटी",
        "location": "ता. मिरज, जि. सांगली", "address": "मिरज-कुपवाड परिसर, ता. मिरज, जि. सांगली.",
        "mapQuery": "Siddheshwar Park Sangli", "image": _pool[3], "gallery": [_pool[3], _pool[1], _pool[2]], "features": _common,
    },
    {
        "slug": "mangalmurti-park", "name": "मंगलमूर्ती पार्क", "nameEn": "Mangalmurti Park",
        "price": "199", "tagline": "किफायतशीर दरात हमखास गुंतवणूक",
        "location": "ता. मिरज, जि. सांगली", "address": "सांगली-मिरज परिसर, ता. मिरज, जि. सांगली.",
        "mapQuery": "Mangalmurti Park Sangli", "image": _pool[4], "gallery": [_pool[4], _pool[0], _pool[3]], "features": _common,
    },
    {
        "slug": "bramhanath-park", "name": "ब्राह्मनाथ पार्क", "nameEn": "Bramhanath Park",
        "price": "199", "tagline": "स्वप्नातील घरासाठी योग्य जागा",
        "location": "ता. मिरज, जि. सांगली", "address": "मिरज परिसर, ता. मिरज, जि. सांगली.",
        "mapQuery": "Bramhanath Park Sangli", "image": _pool[0], "gallery": [_pool[0], _pool[2], _pool[4]], "features": _common,
    },
    {
        "slug": "ramchandra-park", "name": "रामचंद्र पार्क", "nameEn": "Ramchandra Park",
        "price": "399", "tagline": "वास्तुशास्त्रानुसार सुनियोजित प्लॉट्स",
        "location": "ता. मिरज, जि. सांगली", "address": "मिरज परिसर, ता. मिरज, जि. सांगली.",
        "mapQuery": "Ramchandra Park Sangli", "image": _pool[1], "gallery": [_pool[1], _pool[4], _pool[0]], "features": _common,
    },
    {
        "slug": "shree-hari-park", "name": "श्री हरी पार्क", "nameEn": "Shree Hari Park",
        "price": "349", "tagline": "मिशन हॉस्पिटलपासून अवघ्या ४ कि.मी. अंतरावर",
        "location": "सोनवळेनगर, ढाकळी हद्द, ता. मिरज",
        "address": "सुभाषनगर-मालगांव रोड, सोनवळेनगर, ढाकळी हद्द, मजदी सराफ मळ्या शेजारी, ढाकळी, ता. मिरज, जि. सांगली.",
        "mapQuery": "Shree Hari Park Dhakali Miraj Sangli", "image": _pool[2],
        "gallery": [_pool[2], _pool[3], _pool[1]],
        "features": [
            "प्रशस्त रस्ते.", "लाईट सोय उपलब्ध, स्ट्रीट लाईट्स.", "प्रत्येक प्लॉटला स्वतंत्र पाणी पुरवठा.",
            "स्वागत कमान.", "प्रत्येक प्लॉटला तारेचे कंपाऊंड, गेट व नेम प्लेट.",
            "रोड साईड झाडे व ठिबक सिंचन तसेच सिमेंट बाकडी.", "बांधकामास योग्य जमीन, रहिवासी उपयुक्त प्लॉट्स.",
            "सर्व प्लॉट वास्तुशास्त्रानुसार पूर्व-पश्चिम-उत्तर मुखी.",
            "मिशन हॉस्पिटलपासून ४ कि.मी. व कुपवाड-मिरज MIDC पासून ८ कि.मी.",
            "रत्नागिरी-नागपूर हायवेपासून फक्त ३०० मि. अंतरावर.", "शांत, रम्य व प्रदूषण विरहित परिसर.",
            "खरेदीपत्राच्या खर्चासह व ७/१२, ८-अ उतारा करून देणेची हमी.",
        ],
    },
    {
        "slug": "shree-ram-park", "name": "श्री राम पार्क", "nameEn": "Shree Ram Park",
        "price": "375", "tagline": "सुस्वागतम — तुमच्या स्वप्नांचे ठिकाण",
        "location": "ता. मिरज, जि. सांगली", "address": "मिरज परिसर, ता. मिरज, जि. सांगली.",
        "mapQuery": "Shree Ram Park Sangli", "image": _pool[3], "gallery": [_pool[3], _pool[2], _pool[0]], "features": _common,
    },
    {
        "slug": "morya-park", "name": "मोरया पार्क", "nameEn": "Morya Park",
        "price": "251", "tagline": "किफायतशीर दर, उत्तम भविष्य",
        "location": "ता. मिरज, जि. सांगली", "address": "मिरज परिसर, ता. मिरज, जि. सांगली.",
        "mapQuery": "Morya Park Sangli", "image": _pool[4], "gallery": [_pool[4], _pool[1], _pool[3]], "features": _common,
    },
]
