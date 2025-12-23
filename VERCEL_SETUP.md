# 🚀 إعداد Vercel للنشر

## ✅ ملف `.env.local` جاهز للـ Local Development

تم إنشاء ملف `.env.local` بنجاح! ✅

---

## 📋 إعداد Environment Variables في Vercel

### الخطوات:

#### 1. اذهب إلى Vercel Dashboard
- https://vercel.com
- سجل دخول أو أنشئ حساب

#### 2. أنشئ Project جديد
- اضغط **"Add New Project"** أو **"Import Project"**
- اختر GitHub repository الخاص بك
- اضغط **"Import"**

#### 3. في صفحة **Configure Project**:

**أضف Environment Variables:**
- اضغط على **"Environment Variables"** في القائمة الجانبية

#### 4. أضف هذه المتغيرات (نفس القيم من `.env.local`):

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xamjlzhmfzgkgnrwfobh.supabase.co` | **Production, Preview, Development** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWpsemhtZnpna2ducndmb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzE2OTEsImV4cCI6MjA4MTY0NzY5MX0.l8hQOS1sTNTanE5g67PoA8tdhDyrG7wbS1JjqLR5tiw` | **Production, Preview, Development** |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWpsemhtZnpna2ducndmb2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA3MTY5MSwiZXhwIjoyMDgxNjQ3NjkxfQ.ddCdncMgLbGxUR8Pjpnfglc1RXNpYb71oS6btgNmJLg` | **Production, Preview, Development** |
| `JWT_SECRET` | `1b4ee2ac7431fcc2e4275ae4a236b4e94d892b2e9c94d8144639b513d473d49d25c17d18b15e80c497f73a1e6424029c4a98b998f3b6c29c538903c7e9dbf962` | **Production, Preview, Development** |
| `NEXT_PUBLIC_APP_URL` | `https://your-project-name.vercel.app` | **Production فقط** ⚠️ |
| `NODE_ENV` | `production` | **Production, Preview, Development** |

---

## ⚠️ التغييرات المطلوبة عند النشر على Vercel:

### ✅ نفس القيم (لا تتغير):
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - **نفس القيمة**
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - **نفس القيمة**
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - **نفس القيمة**
- ✅ `JWT_SECRET` - **نفس القيمة**

### 🔄 يتغير فقط:
- 🔄 `NEXT_PUBLIC_APP_URL` - سيصبح `https://your-project-name.vercel.app` (بعد النشر)
- 🔄 `NODE_ENV` - سيصبح `production` بدلاً من `development`

---

## 📝 خطوات إضافة Environment Variables في Vercel:

### الطريقة 1: أثناء إنشاء Project
1. بعد ربط GitHub repository
2. في صفحة **Configure Project**
3. اضغط **"Environment Variables"**
4. أضف كل متغير:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://xamjlzhmfzgkgnrwfobh.supabase.co`
   - **Environment**: ✅ Production, ✅ Preview, ✅ Development
   - اضغط **Add**
5. كرر لكل متغير

### الطريقة 2: بعد إنشاء Project
1. اذهب إلى Project Dashboard
2. **Settings** → **Environment Variables**
3. أضف كل متغير بنفس الطريقة

---

## 🔧 بعد النشر على Vercel:

### 1. احصل على URL الخاص بك
- بعد النشر، Vercel سيعطيك URL مثل: `https://your-project-name.vercel.app`

### 2. حدث `NEXT_PUBLIC_APP_URL`
- اذهب إلى **Settings** → **Environment Variables**
- ابحث عن `NEXT_PUBLIC_APP_URL`
- عدّل القيمة إلى: `https://your-project-name.vercel.app`
- اضغط **Save**
- **Redeploy** (إعادة نشر) للـ Project

---

## ⚙️ Build Settings (إعدادات البناء):

تأكد من:
- **Framework Preset**: Next.js ✅
- **Build Command**: `pnpm build` (أو `npm run build`)
- **Output Directory**: `.next` ✅
- **Install Command**: `pnpm install` (أو `npm install`)

---

## ✅ Checklist قبل النشر:

- [ ] ✅ تم إعداد Supabase Database (تشغيل `lib/supabase-schema.sql`)
- [ ] ✅ تم إنشاء Storage Bucket `payment-proofs`
- [ ] ✅ تم إضافة جميع Environment Variables في Vercel
- [ ] ✅ تم ربط GitHub Repository
- [ ] ✅ Build Settings صحيحة

---

## 🎯 بعد النشر:

1. ✅ افتح URL الخاص بك: `https://your-project-name.vercel.app`
2. ✅ جرب إنشاء حساب جديد
3. ✅ تحقق من Supabase → `users` table (يجب أن يظهر المستخدم الجديد)
4. ✅ جرب الحجز (يجب أن يظهر في `appointments` table)

---

## 🐛 حل المشاكل:

### "Database not configured"
- تأكد من إضافة جميع Environment Variables في Vercel
- تأكد من أن القيم صحيحة (نسخ/لصق)

### "Invalid token"
- تأكد من إضافة `JWT_SECRET` في Vercel
- تأكد من أن القيمة نفسها في `.env.local` و Vercel

### Build Failed
- تحقق من Build Logs في Vercel
- تأكد من أن جميع Dependencies موجودة في `package.json`

---

**🎉 جاهز للنشر! بعد إضافة Environment Variables، اضغط "Deploy"!**



