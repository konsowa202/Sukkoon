# 📝 تعليمات إعداد .env.local

## ✅ تم إنشاء ملف `.env.local` بنجاح!

### 📋 الآن تحتاج فقط إلى ملء 3 قيم:

## 1️⃣ Supabase Project URL
- اذهب إلى: **Supabase Dashboard** → **Settings** → **API**
- انسخ **Project URL** (مثل: `https://xxxxxxxxxxxxx.supabase.co`)
- ضعه بدلاً من: `YOUR_SUPABASE_PROJECT_URL_HERE`

## 2️⃣ Supabase Anon Key
- في نفس الصفحة (Settings → API)
- ابحث عن **"anon public"** key
- انسخ الـ key **كاملاً** (يبدأ بـ `eyJhbG...` وطويل جداً)
- ضعه بدلاً من: `YOUR_SUPABASE_ANON_KEY_HERE`

## 3️⃣ Supabase Service Role Key
- في نفس الصفحة (Settings → API)
- في قسم **"Secret keys"**
- ابحث عن **"service_role"** key
- ⚠️ **حذر**: هذا المفتاح سري جداً!
- اضغط على **"Reveal"** أو **"Show"** لرؤيته
- انسخ الـ key **كاملاً** (يبدأ بـ `eyJhbG...` وطويل جداً)
- ضعه بدلاً من: `YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE`

---

## ✅ بعد ملء القيم:

1. احفظ ملف `.env.local`
2. أعد تشغيل المشروع: `pnpm dev`
3. المشروع سيعمل مع Supabase الحقيقي!

---

## 🔍 مثال على كيف يبدو الملف بعد الملء:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIyMCwiZXhwIjoxOTU3MzQ1MjIwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQxNzY5MjIwLCJleHAiOjE5NTczNDUyMjB9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
JWT_SECRET=1b4ee2ac7431fcc2e4275ae4a236b4e94d892b2e9c94d8144639b513d473d49d25c17d18b15e80c497f73a1e6424029c4a98b998f3b6c29c538903c7e9dbf962
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## ⚠️ ملاحظات مهمة:

- ✅ **JWT_SECRET** تم توليده تلقائياً - لا تغيره
- ✅ **NEXT_PUBLIC_APP_URL** و **NODE_ENV** جاهزين للتطوير
- ⚠️ لا ترفع ملف `.env.local` إلى Git (محمي في `.gitignore`)
- ⚠️ **SUPABASE_SERVICE_ROLE_KEY** سري جداً - لا تشاركه أبداً

---

## 🎯 الخطوة التالية:

بعد ملء القيم الثلاثة، تأكد من:
1. ✅ تشغيل SQL Schema في Supabase SQL Editor (`lib/supabase-schema.sql`)
2. ✅ إنشاء Storage Bucket `payment-proofs` في Supabase Storage
3. ✅ تشغيل المشروع: `pnpm dev`

**جاهز! 🚀**






