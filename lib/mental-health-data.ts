export interface TopicKeyword {
    ar: string;
    en: string;
}

export interface TopicCategory {
    title: string;
    titleEn: string;
    keywords: TopicKeyword[];
}

export const mentalHealthDirectory: TopicCategory[] = [
    {
        title: "الاضطرابات النمائية",
        titleEn: "Neurodevelopmental Disorders",
        keywords: [
            { ar: "الإعاقة الذهنية", en: "Intellectual Disability" },
            { ar: "التأخر النمائي الشامل", en: "Global Developmental Delay" },
            { ar: "اضطراب طيف التوحد", en: "Autism Spectrum Disorder" },
            { ar: "توحد وأسبرجر", en: "Autism & Asperger's" },
            { ar: "اضطراب ريت", en: "Rett’s Disorder" },
            { ar: "اضطراب الطفولة التحللي", en: "Childhood Disintegrative Disorder" },
            { ar: "اضطراب نقص الانتباه مع فرط النشاط", en: "ADHD" },
            { ar: "اضطراب تشتت الانتباه", en: "ADD" },
            { ar: "عسر القراءة", en: "Dyslexia" },
            { ar: "عسر الحساب", en: "Dyscalculia" },
            { ar: "اضطراب اللغة", en: "Language Disorder" },
            { ar: "اضطراب النطق", en: "Speech Disorder" },
            { ar: "التلعثم", en: "Stuttering" },
            { ar: "اضطراب التواصل الاجتماعي", en: "Social Communication Disorder" },
            { ar: "اضطراب التنسيق الحركي", en: "Motor Coordination Disorder" },
            { ar: "اضطراب الحركة النمطية", en: "Stereotypic Movement Disorder" },
            { ar: "اضطراب توريت", en: "Tourette’s" }
        ]
    },
    {
        title: "طيف الفصام والاضطرابات الذهانية",
        titleEn: "Schizophrenia Spectrum",
        keywords: [
            { ar: "الفصام", en: "Schizophrenia" },
            { ar: "الاضطراب الفصامي العاطفي", en: "Schizoaffective Disorder" },
            { ar: "اضطراب فصامي الشكل", en: "Schizophreniform Disorder" },
            { ar: "الضلال الزوراني", en: "Delusional Disorder" },
            { ar: "البارانويا", en: "Paranoia" },
            { ar: "الاضطراب الذهاني الوجيز", en: "Brief Psychotic Disorder" },
            { ar: "الذهان المشترك", en: "Shared Psychotic Disorder" },
            { ar: "اضطراب الشخصية الفصامي النمط", en: "Schizotypal Personality Disorder" }
        ]
    },
    {
        title: "اضطرابات المزاج",
        titleEn: "Mood Disorders",
        keywords: [
            { ar: "ثنائي القطب النوع الأول", en: "Bipolar I Disorder" },
            { ar: "ثنائي القطب النوع الثاني", en: "Bipolar II Disorder" },
            { ar: "اضطراب دوروية المزاج", en: "Cyclothymic Disorder" },
            { ar: "اكتئاب", en: "Depression" },
            { ar: "الديستيميا", en: "Dysthymia" },
            { ar: "DMDD", en: "DMDD" },
            { ar: "عسر تنظيم المزاج التخريبي", en: "Disruptive Mood Dysregulation" },
            { ar: "PMDD", en: "PMDD" },
            { ar: "الاكتئاب الثانوي", en: "Secondary Depression" }
        ]
    },
    {
        title: "اضطرابات القلق والوسواس والصدمة",
        titleEn: "Anxiety, OCD & Trauma",
        keywords: [
            { ar: "اضطراب الهلع", en: "Panic Disorder" },
            { ar: "رهاب الساح", en: "Agoraphobia" },
            { ar: "الرهاب الاجتماعي", en: "Social Phobia" },
            { ar: "القلق العام", en: "General Anxiety (GAD)" },
            { ar: "اضطراب قلق الانفصال", en: "Separation Anxiety" },
            { ar: "الصمت الاختياري", en: "Selective Mutism" },
            { ar: "الوسواس القهري", en: "OCD" },
            { ar: "نتف الشعر", en: "Trichotillomania" },
            { ar: "اضطراب ما بعد الصدمة", en: "PTSD" },
            { ar: "اضطراب الكرب الحاد", en: "Acute Stress Disorder" },
            { ar: "اضطرابات التكيف", en: "Adjustment Disorders" }
        ]
    },
    {
        title: "الاضطرابات التفارقية والجسدية",
        titleEn: "Dissociative & Somatic Disorders",
        keywords: [
            { ar: "تعدد الشخصيات", en: "Dissociative Identity" },
            { ar: "فقدان الذاكرة التفارقي", en: "Dissociative Amnesia" },
            { ar: "تبدد الشخصية", en: "Depersonalization" },
            { ar: "الاغتراب عن الواقع", en: "Derealization" },
            { ar: "اضطراب الأعراض الجسدية", en: "Somatic Symptom Disorder" },
            { ar: "توهم المرض", en: "Illness Anxiety Disorder" },
            { ar: "الاضطراب التحويلي", en: "Conversion Disorder" },
            { ar: "متلازمة منشوزن", en: "Munchausen Syndrome" }
        ]
    },
    {
        title: "اضطرابات الأكل والنوم",
        titleEn: "Eating & Sleep Disorders",
        keywords: [
            { ar: "فقدان الشهية العصبي", en: "Anorexia Nervosa" },
            { ar: "الشره المرضي", en: "Bulimia Nervosa" },
            { ar: "نهم الطعام", en: "Binge Eating Disorder" },
            { ar: "الأكل القهري", en: "Pica" },
            { ar: "اضطراب الأرق", en: "Insomnia Disorder" },
            { ar: "فرط النوم", en: "Hypersomnolence" },
            { ar: "التغفيق", en: "Narcolepsy" },
            { ar: "انقطاع النفس النومي", en: "Sleep Apnea" },
            { ar: "اضطراب الكوابيس", en: "Nightmare Disorder" }
        ]
    },
    {
        title: "اضطرابات السلوك والإدمان",
        titleEn: "Behavior & Addiction",
        keywords: [
            { ar: "هوس السرقة", en: "Kleptomania" },
            { ar: "هوس الحرائق", en: "Pyromania" },
            { ar: "إدمان الحشيش", en: "Cannabis Addiction" },
            { ar: "إدمان الكحول", en: "Alcohol Addiction" },
            { ar: "إدمان الأفيونات", en: "Opioid Addiction" },
            { ar: "إدمان التبغ", en: "Tobacco Addiction" },
            { ar: "إدمان النيكوتين", en: "Nicotine Addiction" },
            { ar: "التعافي", en: "Recovery" },
            { ar: "مصحة لعلاج الإدمان", en: "Rehab Center" },
            { ar: "أعراض انسحاب", en: "Withdrawal Symptoms" }
        ]
    },
    {
        title: "الكلمات الدارجة والوصفية",
        titleEn: "Common Terms",
        keywords: [
            { ar: "خنقة", en: "Suffocation Feel" },
            { ar: "حاسس بضيق", en: "Feeling Tight" },
            { ar: "دماغي مش بتفصل", en: "Racing Thoughts" },
            { ar: "أعصابي تعبانة", en: "Wrecked Nerves" },
            { ar: "فقدان الشغف", en: "Loss of Passion" },
            { ar: "احتراق وظيفي", en: "Burnout" },
            { ar: "علاقات توكسيك", en: "Toxic Relationships" },
            { ar: "نرجسية", en: "Narcissism" },
            { ar: "تقدير الذات", en: "Self-Esteem" },
            { ar: "قلق الامتحانات", en: "Exam Anxiety" }
        ]
    }
];

export const allKeywords = mentalHealthDirectory.flatMap(c => [
    c.title,
    c.titleEn,
    ...c.keywords.map(k => k.ar),
    ...c.keywords.map(k => k.en)
]);
