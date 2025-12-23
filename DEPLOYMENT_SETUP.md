# 🚀 دليل الإعداد الكامل للنشر على Vercel

## 📋 الخطوات المطلوبة

### 1. إعداد Supabase Database

#### أ. إنشاء حساب Supabase
1. اذهب إلى https://supabase.com
2. سجل دخول أو أنشئ حساب جديد
3. اضغط "New Project"
4. اختر Organization (أو أنشئ واحدة)
5. املأ البيانات:
   - **Project Name**: `sukoon-platform` (أو أي اسم)
   - **Database Password**: اختر password قوي واحفظه
   - **Region**: اختر الأقرب لك
6. انتظر حتى يتم إنشاء المشروع (2-3 دقائق)

#### ب. الحصول على API Keys
1. بعد إنشاء المشروع، اذهب إلى **Settings** → **API**
2. انسخ هذه المعلومات:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (في الأسفل) → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **لا تشارك هذا المفتاح أبداً**

#### ج. إنشاء Database Schema
1. اذهب إلى **SQL Editor** في Supabase Dashboard
2. افتح ملف `lib/supabase-schema.sql`
3. انسخ كل محتوى الملف
4. الصقه في SQL Editor
5. اضغط **Run** (أو F5)
6. تأكد من أن جميع الجداول تم إنشاؤها بنجاح

#### د. إنشاء Storage Bucket
1. اذهب إلى **Storage** في Supabase Dashboard
2. اضغط **New bucket**
3. املأ البيانات:
   - **Name**: `payment-proofs`
   - **Public bucket**: ❌ **لا** (غير public)
4. اضغط **Create bucket**
5. اذهب إلى **Policies** tab
6. أضف policy للسماح بالرفع للمستخدمين المسجلين:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload payment proofs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated'
);

-- Allow users to view their own files
CREATE POLICY "Users can view own proofs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated'
);
```

### 2. إعداد Google Calendar API (اختياري - للـ Google Meet)

#### أ. إنشاء Google Cloud Project
1. اذهب إلى https://console.cloud.google.com
2. اضغط **Create Project** (أو اختر project موجود)
3. املأ **Project name**: `sukoon-meet` (أو أي اسم)
4. اضغط **Create**

#### ب. تفعيل Google Calendar API
1. اذهب إلى **APIs & Services** → **Library**
2. ابحث عن "Google Calendar API"
3. اضغط **Enable**

#### ج. إنشاء OAuth Credentials
1. اذهب إلى **APIs & Services** → **Credentials**
2. اضغط **Create Credentials** → **OAuth 2.0 Client ID**
3. إذا طلب إعداد OAuth consent screen:
   - اختر **External** (للاختبار)
   - املأ **App name**: `Sukoon Platform`
   - اضغط **Save and Continue** حتى النهاية
4. في **Create OAuth Client ID**:
   - **Application type**: Web application
   - **Name**: `Sukoon Web Client`
   - **Authorized redirect URIs**: أضف:
     - `http://localhost:3000/api/auth/google/callback` (للتطوير)
     - `https://your-domain.vercel.app/api/auth/google/callback` (للإنتاج - سيتم تحديثه لاحقاً)
5. اضغط **Create**
6. انسخ **Client ID** و **Client Secret**

### 3. إنشاء JWT Secret
في terminal:
```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
انسخ النتيجة - ستستخدمها كـ `JWT_SECRET`

---

## 🔧 إعداد Environment Variables

### أ. Local Development (.env.local)
أنشئ ملف `.env.local` في جذر المشروع:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (Required)
JWT_SECRET=your-generated-random-string-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### ب. Vercel Production Environment Variables
1. اذهب إلى https://vercel.com
2. سجل دخول أو أنشئ حساب
3. اضغط **Add New Project**
4. اربط GitHub repository
5. بعد إنشاء المشروع، اذهب إلى **Settings** → **Environment Variables**
6. أضف جميع المتغيرات من `.env.local` (بدون `NODE_ENV=development`)
7. **مهم**: أضف:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
   NODE_ENV=production
   ```
8. **مهم للـ Google OAuth**: حدث `GOOGLE_REDIRECT_URI` إلى:
   ```env
   GOOGLE_REDIRECT_URI=https://your-project-name.vercel.app/api/auth/google/callback
   ```
9. في Google Cloud Console، أضف نفس الـ URL في **Authorized redirect URIs**

---

## 🚀 النشر على Vercel

### الطريقة 1: من Vercel Dashboard
1. اذهب إلى https://vercel.com/new
2. اختر **Import Git Repository**
3. اختر repository الخاص بك
4. اضغط **Import**
5. في **Configure Project**:
   - **Framework Preset**: Next.js (يتم اكتشافه تلقائياً)
   - **Root Directory**: `./` (افتراضي)
   - **Build Command**: `pnpm build` (أو `npm run build`)
   - **Output Directory**: `.next` (افتراضي)
6. أضف **Environment Variables** (كما هو موضح أعلاه)
7. اضغط **Deploy**
8. انتظر حتى ينتهي البناء
9. 🎉 المشروع متاح على `https://your-project.vercel.app`

### الطريقة 2: من Terminal (Vercel CLI)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? sukoon-platform
# - Directory? ./
# - Override settings? No

# Production deploy
vercel --prod
```

---

## ✅ التحقق من الإعداد

### 1. تحقق من Database
- اذهب إلى Supabase Dashboard → **Table Editor**
- تأكد من وجود الجداول: `users`, `doctors`, `appointments`, `payments`

### 2. اختبار Authentication
- افتح المشروع المنشور
- جرب إنشاء حساب جديد
- تحقق من وجود المستخدم في Supabase → `users` table

### 3. اختبار الحجز
- سجل دخول كمريض
- احجز موعد
- تحقق من وجود الموعد في `appointments` table

### 4. اختبار الدفع
- ارفع proof screenshot
- تحقق من وجوده في Supabase → **Storage** → `payment-proofs` bucket

---

## 🔒 الأمان

### ✅ ممارسات أمنية مهمة:
1. **لا تشارك `SUPABASE_SERVICE_ROLE_KEY` أبداً** - هذا المفتاح يعطي وصول كامل للـ database
2. **استخدم `JWT_SECRET` قوي** - string عشوائي طويل
3. **فعّل Row Level Security (RLS)** - تم تفعيلها في `supabase-schema.sql`
4. **استخدم HTTPS فقط** في production
5. **راقب استخدام API** في Supabase Dashboard

---

## 🐛 حل المشاكل الشائعة

### مشكلة: "Invalid token" errors
- **الحل**: تأكد من إضافة `JWT_SECRET` في Vercel environment variables
- تأكد من أن الـ secret نفسها في development و production

### مشكلة: "Supabase connection failed"
- **الحل**: تحقق من:
  - `NEXT_PUBLIC_SUPABASE_URL` صحيح
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` صحيح
  - Network لا يحجب Supabase

### مشكلة: "Storage bucket not found"
- **الحل**: تأكد من إنشاء bucket `payment-proofs` في Supabase Storage
- تحقق من الـ policies في Storage → Policies

### مشكلة: Google OAuth redirect mismatch
- **الحل**: تأكد من أن `GOOGLE_REDIRECT_URI` في Vercel matches تماماً مع الموجود في Google Cloud Console
- يجب أن يكون: `https://your-domain.vercel.app/api/auth/google/callback` (دون `/` في النهاية)

---

## 📝 ملاحظات مهمة

1. **Mock Data تمت إزالته** - المشروع يعمل فقط مع Supabase الآن
2. **Authentication حقيقي** - جميع المستخدمين يتم حفظهم في database
3. **Storage حقيقي** - جميع الملفات في Supabase Storage
4. **Google Meet** - يتطلب إعداد Google OAuth (اختياري)

---

## 🎯 الخطوات التالية بعد النشر

1. ✅ إنشاء حساب admin في database (يدوياً أو من خلال registration)
2. ✅ إضافة أطباء (من خلال admin dashboard أو يدوياً)
3. ✅ اختبار جميع الـ flows
4. ✅ إعداد Custom Domain (اختياري)
5. ✅ إعداد Monitoring (Vercel Analytics)

---

**🎉 الآن المشروع جاهز للنشر على Vercel!**



