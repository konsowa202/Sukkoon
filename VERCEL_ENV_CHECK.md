# 🔍 فحص Environment Variables في Vercel

## المشكلة: تسجيل الدخول لا يعمل

إذا كان تسجيل الدخول لا يعمل بعد النشر على Vercel، المشكلة على الأرجح في Environment Variables.

---

## ✅ خطوات الحل

### 1. اذهب إلى Vercel Dashboard

1. افتح: https://vercel.com/dashboard
2. اختر المشروع: **Sukkoon**
3. اضغط على **Settings** (من القائمة العلوية)
4. اضغط على **Environment Variables** (من القائمة الجانبية)

### 2. تحقق من وجود جميع المتغيرات

يجب أن تكون هذه المتغيرات موجودة:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xamjlzhmfzgkgnrwfobh.supabase.co` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Production, ✅ Preview, ✅ Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Production, ✅ Preview, ✅ Development |
| `JWT_SECRET` | `1b4ee2ac7431fcc2e4275ae4a236b4e94d892b2e9c94d8144639b513d473d49d25c17d18b15e80c497f73a1e6424029c4a98b998f3b6c29c538903c7e9dbf962` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_APP_URL` | `https://www.suukoon.com` | ✅ Production فقط |
| `NODE_ENV` | `production` | ✅ Production, ✅ Preview, ✅ Development |

### 3. إذا كانت المتغيرات غير موجودة

#### أضف كل متغير:

1. اضغط **"Add New"** أو **"Add"**
2. في **"Name"**: أدخل اسم المتغير (مثل: `NEXT_PUBLIC_SUPABASE_URL`)
3. في **"Value"**: انسخ القيمة من ملف `.env.local` المحلي
4. اختر **Environment**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. اضغط **"Add"**
6. كرر لكل متغير

### 4. بعد إضافة/تعديل المتغيرات

**مهم جداً:** بعد إضافة أو تعديل Environment Variables:

1. اذهب إلى **Deployments** (من القائمة العلوية)
2. اضغط على آخر Deployment
3. اضغط **"Redeploy"** (أو **"..."** → **"Redeploy"**)
4. انتظر حتى ينتهي البناء

**⚠️ ملاحظة:** التعديلات على Environment Variables لا تطبق تلقائياً - يجب عمل Redeploy!

---

## 🔍 التحقق من المشكلة

### طريقة 1: فحص Console في المتصفح

1. افتح الموقع: https://www.suukoon.com
2. اضغط `F12` لفتح Developer Tools
3. اذهب إلى **Console** tab
4. حاول تسجيل الدخول
5. ابحث عن أخطاء مثل:
   - `Database not configured`
   - `Invalid token`
   - `401 Unauthorized`
   - `503 Service Unavailable`

### طريقة 2: فحص Vercel Logs

1. اذهب إلى Vercel Dashboard → **Deployments**
2. اضغط على آخر Deployment
3. اضغط على **"Functions"** tab
4. اضغط على `/api/auth/login`
5. ابحث عن أخطاء في Logs

### طريقة 3: اختبار API مباشرة

افتح في المتصفح أو Postman:

```
POST https://www.suukoon.com/api/auth/login
Content-Type: application/json

{
  "identifier": "your-email@example.com",
  "password": "your-password"
}
```

---

## 🐛 المشاكل الشائعة وحلولها

### المشكلة: "Database not configured"

**السبب:** `NEXT_PUBLIC_SUPABASE_URL` أو `NEXT_PUBLIC_SUPABASE_ANON_KEY` غير موجودة

**الحل:**
1. تأكد من إضافة `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` في Vercel
2. تأكد من أن القيم صحيحة (نسخ/لصق من `.env.local`)
3. عمل Redeploy

### المشكلة: "Invalid token" أو "Unauthorized"

**السبب:** `JWT_SECRET` غير موجود أو مختلف

**الحل:**
1. تأكد من إضافة `JWT_SECRET` في Vercel
2. تأكد من أن القيمة **نفسها** في `.env.local` و Vercel
3. عمل Redeploy

### المشكلة: تسجيل الدخول ينجح لكن لا يتم حفظ Session

**السبب:** `NEXT_PUBLIC_APP_URL` غير صحيح

**الحل:**
1. تأكد من أن `NEXT_PUBLIC_APP_URL` = `https://www.suukoon.com`
2. تأكد من أنه موجود في **Production** environment فقط
3. عمل Redeploy

### المشكلة: "503 Service Unavailable"

**السبب:** `SUPABASE_SERVICE_ROLE_KEY` غير موجود

**الحل:**
1. تأكد من إضافة `SUPABASE_SERVICE_ROLE_KEY` في Vercel
2. تأكد من أن القيمة صحيحة (من Supabase Dashboard)
3. عمل Redeploy

---

## ✅ Checklist

- [ ] جميع Environment Variables موجودة في Vercel
- [ ] القيم صحيحة (مطابقة لـ `.env.local`)
- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.suukoon.com`
- [ ] تم عمل Redeploy بعد إضافة/تعديل المتغيرات
- [ ] تم اختبار تسجيل الدخول بعد Redeploy

---

## 📝 القيم المطلوبة (من ملف `.env.local`)

انسخ هذه القيم من ملف `.env.local` المحلي:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xamjlzhmfzgkgnrwfobh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWpsemhtZnpna2ducndmb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzE2OTEsImV4cCI6MjA4MTY0NzY5MX0.l8hQOS1sTNTanE5g67PoA8tdhDyrG7wbS1JjqLR5tiw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWpsemhtZnpna2ducndmb2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA3MTY5MSwiZXhwIjoyMDgxNjQ3NjkxfQ.ddCdncMgLbGxUR8Pjpnfglc1RXNpYb71oS6btgNmJLg
JWT_SECRET=1b4ee2ac7431fcc2e4275ae4a236b4e94d892b2e9c94d8144639b513d473d49d25c17d18b15e80c497f73a1e6424029c4a98b998f3b6c29c538903c7e9dbf962
NEXT_PUBLIC_APP_URL=https://www.suukoon.com
NODE_ENV=production
```

---

## 🆘 إذا استمرت المشكلة

1. تحقق من Vercel Logs (Deployments → Functions → `/api/auth/login`)
2. تحقق من Supabase Dashboard → Logs
3. تأكد من أن المستخدم موجود في Supabase → `users` table
4. تأكد من أن `password_hash` موجود في قاعدة البيانات

---

**آخر تحديث:** ديسمبر 2024





