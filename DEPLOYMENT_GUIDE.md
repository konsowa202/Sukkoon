# 🚀 دليل النشر الكامل - GitHub و Vercel

## 📋 نظرة عامة

هذا الدليل يشرح بالتفصيل كيفية رفع المشروع على GitHub ونشره على Vercel.

---

## ✅ الخطوة 1: إعداد المشروع للنشر

### 1.1 التأكد من أن المشروع جاهز

قبل النشر، تأكد من:
- ✅ المشروع يعمل محلياً بدون أخطاء (`pnpm dev`)
- ✅ البناء ينجح (`pnpm build`)
- ✅ لا توجد أخطاء TypeScript
- ✅ ملف `.env.local` موجود ومحمي في `.gitignore`

### 1.2 ملف `.env.local` المحلي

**ملاحظة مهمة:** ملف `.env.local` موجود محلياً فقط ولا يُرفع على GitHub. هذا الملف يحتوي على:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xamjlzhmfzgkgnrwfobh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=1b4ee2ac7431fcc2e4275ae4a236b4e94d892b2e9c94d8144639b513d473d49d25c17d18b15e80c497f73a1e6424029c4a98b998f3b6c29c538903c7e9dbf962
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**ماذا تفعل بهذا الملف؟**
- ✅ **لا ترفعه على GitHub** - محمي تلقائياً في `.gitignore`
- ✅ **احتفظ به محلياً** - للعمل على المشروع في جهازك
- ✅ **انسخ القيم** - ستحتاجها لإضافتها في Vercel

---

## 📤 الخطوة 2: رفع المشروع على GitHub

### 2.1 إنشاء Repository جديد

1. اذهب إلى: https://github.com/new
2. اختر اسم للمشروع (مثل: `sekoon-platform` أو `sukoon-app`)
3. اختر **Public** أو **Private** (حسب تفضيلك)
4. **لا** تضع علامة على "Initialize with README" (لأن المشروع موجود بالفعل)
5. اضغط **"Create repository"**

### 2.2 رفع المشروع

افتح Terminal في مجلد المشروع وقم بتنفيذ:

```bash
# 1. تهيئة Git (إذا لم يكن موجوداً)
git init

# 2. إضافة جميع الملفات
git add .

# 3. عمل Commit
git commit -m "Initial commit: Sukoon Mental Health Platform"

# 4. تغيير اسم الفرع إلى main
git branch -M main

# 5. إضافة Remote (استبدل YOUR_USERNAME و YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. رفع المشروع
git push -u origin main
```

**ملاحظة:** استبدل:
- `YOUR_USERNAME` → اسم المستخدم على GitHub
- `YOUR_REPO_NAME` → اسم الـ Repository الذي أنشأته

### 2.3 التحقق من الرفع

- اذهب إلى صفحة Repository على GitHub
- تأكد من أن جميع الملفات موجودة
- **تأكد من عدم وجود ملف `.env.local`** في الملفات المرفوعة

---

## 🌐 الخطوة 3: النشر على Vercel

### 3.1 إنشاء حساب Vercel

1. اذهب إلى: https://vercel.com/signup
2. اختر **"Continue with GitHub"**
3. سجل دخول بحساب GitHub الخاص بك
4. امنح Vercel الصلاحيات المطلوبة

### 3.2 ربط المشروع

1. بعد تسجيل الدخول، اضغط **"Add New Project"** أو **"Import Project"**
2. اختر الـ Repository الخاص بك من القائمة
3. اضغط **"Import"**

### 3.3 إعدادات المشروع

Vercel سيتعرف تلقائياً على Next.js وسيقترح:

- **Framework Preset:** Next.js ✅
- **Root Directory:** `./` ✅
- **Build Command:** `pnpm build` (أو `npm run build`)
- **Output Directory:** `.next` ✅
- **Install Command:** `pnpm install` (أو `npm install`)

**لا تغير هذه الإعدادات** - اتركها كما هي.

### 3.4 إضافة Environment Variables

**هذه الخطوة مهمة جداً!** قبل الضغط على "Deploy"، يجب إضافة جميع المتغيرات البيئية:

1. في صفحة **Configure Project**، اضغط على **"Environment Variables"**
2. أضف كل متغير من القائمة التالية:

#### المتغيرات المطلوبة:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xamjlzhmfzgkgnrwfobh.supabase.co` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWpsemhtZnpna2ducndmb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzE2OTEsImV4cCI6MjA4MTY0NzY5MX0.l8hQOS1sTNTanE5g67PoA8tdhDyrG7wbS1JjqLR5tiw` | ✅ Production, ✅ Preview, ✅ Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWpsemhtZnpna2ducndmb2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA3MTY5MSwiZXhwIjoyMDgxNjQ3NjkxfQ.ddCdncMgLbGxUR8Pjpnfglc1RXNpYb71oS6btgNmJLg` | ✅ Production, ✅ Preview, ✅ Development |
| `JWT_SECRET` | `1b4ee2ac7431fcc2e4275ae4a236b4e94d892b2e9c94d8144639b513d473d49d25c17d18b15e80c497f73a1e6424029c4a98b998f3b6c29c538903c7e9dbf962` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-project-name.vercel.app` | ⚠️ Production فقط |
| `NODE_ENV` | `production` | ✅ Production, ✅ Preview, ✅ Development |

**كيفية إضافة متغير:**

1. اضغط **"Add"** أو **"Add New"**
2. في حقل **"Name"**: أدخل اسم المتغير (مثل: `NEXT_PUBLIC_SUPABASE_URL`)
3. في حقل **"Value"**: انسخ القيمة من ملف `.env.local` المحلي
4. اختر **Environment**: 
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. اضغط **"Add"**
6. كرر لكل متغير

**ملاحظة مهمة:**
- `NEXT_PUBLIC_APP_URL` سيتم تحديثه بعد النشر (بعد الحصول على URL الفعلي)
- جميع القيم الأخرى **نفسها** من ملف `.env.local` المحلي

### 3.5 النشر

1. بعد إضافة جميع Environment Variables
2. اضغط **"Deploy"**
3. انتظر حتى ينتهي البناء (عادة 1-3 دقائق)
4. بعد الانتهاء، ستحصل على رابط مثل: `https://your-project-name.vercel.app`

### 3.6 تحديث NEXT_PUBLIC_APP_URL

بعد النشر:

1. اذهب إلى **Settings** → **Environment Variables**
2. ابحث عن `NEXT_PUBLIC_APP_URL`
3. عدّل القيمة إلى: `https://your-project-name.vercel.app` (استبدل `your-project-name` بالاسم الفعلي)
4. اضغط **Save**
5. اذهب إلى **Deployments** → اضغط على آخر Deployment → **Redeploy**

---

## ✅ الخطوة 4: التحقق من النشر

### 4.1 فتح الموقع

1. افتح الرابط الذي حصلت عليه من Vercel
2. تأكد من أن الموقع يعمل

### 4.2 اختبار الوظائف

- ✅ جرب إنشاء حساب جديد
- ✅ جرب تسجيل الدخول
- ✅ جرب البحث عن الأطباء
- ✅ جرب حجز موعد
- ✅ تحقق من Supabase Dashboard → Tables (يجب أن تظهر البيانات الجديدة)

---

## 🔄 التحديثات المستقبلية

### كيفية تحديث الموقع بعد التعديلات:

1. **اعمل التعديلات محلياً**
2. **اختبر التعديلات** (`pnpm dev`)
3. **ارفع التعديلات على GitHub:**
   ```bash
   git add .
   git commit -m "وصف التعديلات"
   git push
   ```
4. **Vercel سينشر تلقائياً!** 🎉
   - كل Push على `main` branch → Deploy تلقائي
   - Pull Requests → Preview Deployments

---

## 🐛 حل المشاكل الشائعة

### المشكلة: Build فاشل

**الحل:**
1. اذهب إلى Vercel Dashboard → Deployments
2. اضغط على آخر Deployment الفاشل
3. اقرأ Build Logs
4. تحقق من الأخطاء:
   - TypeScript errors → أصلحها محلياً
   - Missing dependencies → تأكد من `package.json`
   - Environment Variables → تأكد من إضافتها جميعاً

### المشكلة: "Database not configured"

**الحل:**
- تأكد من إضافة جميع Environment Variables في Vercel
- تأكد من أن القيم صحيحة (نسخ/لصق من `.env.local`)
- تأكد من أن `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` موجودة

### المشكلة: "Invalid token" أو "Unauthorized"

**الحل:**
- تأكد من إضافة `JWT_SECRET` في Vercel
- تأكد من أن القيمة نفسها في `.env.local` و Vercel
- بعد إضافة `JWT_SECRET`، قم بـ Redeploy

### المشكلة: الصور لا تظهر

**الحل:**
- تأكد من أن الصور في مجلد `/public`
- استخدم مسارات نسبية مثل `/image.jpg` وليس `./image.jpg`
- تحقق من `next.config.mjs` → `images.unoptimized: true`

### المشكلة: 404 على Routes

**الحل:**
- تأكد من أن Next.js Config صحيح
- تحقق من App Router Structure
- تأكد من أن الملفات في الأماكن الصحيحة

---

## 📝 ملخص سريع

### قبل النشر:
- ✅ المشروع يعمل محلياً
- ✅ `pnpm build` ينجح
- ✅ `.env.local` موجود ومحمي

### أثناء النشر:
- ✅ رفع على GitHub
- ✅ ربط Vercel مع GitHub
- ✅ إضافة Environment Variables
- ✅ Deploy

### بعد النشر:
- ✅ تحديث `NEXT_PUBLIC_APP_URL`
- ✅ Redeploy
- ✅ اختبار الموقع

---

## 🎯 Checklist النشر

- [ ] المشروع يعمل محلياً (`pnpm dev`)
- [ ] البناء ينجح (`pnpm build`)
- [ ] المشروع مرفوع على GitHub
- [ ] Vercel مربوط مع GitHub
- [ ] جميع Environment Variables مضافة في Vercel
- [ ] النشر نجح
- [ ] `NEXT_PUBLIC_APP_URL` محدث
- [ ] الموقع يعمل وتم اختباره

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Build Logs في Vercel
2. تحقق من Console في المتصفح
3. تحقق من Supabase Dashboard → Logs

---

**آخر تحديث:** ديسمبر 2024

**جاهز للنشر! 🚀**
