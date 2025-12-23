# دليل الإعداد السريع - Sukoon Platform

## ⚙️ إعداد Environment Variables

أنشئ ملف `.env.local` في جذر المشروع:

```env
# Supabase (اختياري - إذا لم يكن متاحاً سيستخدم Mock Data)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Secret (لـ Authentication)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google OAuth (لـ Google Meet)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📋 خطوات الإعداد

### 1. Supabase (اختياري)

1. أنشئ حساب على https://supabase.com
2. أنشئ Project جديد
3. اذهب إلى Settings → API
4. انسخ `Project URL` و `anon public` key
5. اذهب إلى Settings → Database → Connection String
6. أنشئ Service Role Key (Settings → API → service_role key)
7. اذهب إلى SQL Editor وقم بتشغيل `lib/supabase-schema.sql`
8. اذهب إلى Storage وأنشئ bucket باسم `payment-proofs` (public: false)

### 2. Google Calendar API (لـ Google Meet)

1. اذهب إلى https://console.cloud.google.com
2. أنشئ Project جديد أو اختر project موجود
3. اذهب إلى APIs & Services → Library
4. ابحث عن "Google Calendar API" وافعلها
5. اذهب إلى APIs & Services → Credentials
6. اضغط Create Credentials → OAuth 2.0 Client ID
7. اختر Application type: Web application
8. أضف Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (للتطوير)
   - `https://yourdomain.com/api/auth/google/callback` (للإنتاج)
9. انسخ Client ID و Client Secret

### 3. الحصول على Google Refresh Token

1. استخدم هذا الرابط (استبدل YOUR_CLIENT_ID):
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/google/callback&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent
```
2. سجل دخول ووافق على الصلاحيات
3. سيتم تحويلك إلى callback URL مع `code` في URL
4. استخدم هذا الكود للحصول على Refresh Token من Google OAuth Playground أو برمجياً

أو استخدم Google OAuth Playground:
1. اذهب إلى https://developers.google.com/oauthplayground/
2. اختر Google Calendar API v3
3. اضغط Authorize APIs
4. بعد الموافقة، اضغط Exchange authorization code for tokens
5. انسخ refresh_token

### 4. تشغيل المشروع

```bash
# تثبيت Dependencies
pnpm install

# تشغيل المشروع
pnpm dev
```

## 🔧 بدون Supabase (Mock Mode)

إذا لم تقم بإعداد Supabase، المشروع سيعمل على Mock Data تلقائياً:
- Authentication يعمل على Mock Users
- البيانات محفوظة في localStorage
- Google Meet links يتم إنشاؤها يدوياً

**الحسابات التجريبية:**
- Admin: `admin@sukoon.com` / `123`
- Doctor: `doctor@sukoon.com` / `123`
- Patient: `patient@sukoon.com` / `123`

## ✅ التحقق من الإعداد

1. افتح http://localhost:3000
2. سجل دخول بحساب تجريبي
3. اذهب إلى Search Doctors
4. جرب حجز موعد

## 🐛 حل المشاكل

### الخطأ: "Database not configured"
- المشروع يعمل على Mock Mode (طبيعي)
- لإستخدام Database، أضف Supabase credentials في `.env.local`

### الخطأ: "Failed to create Meet link"
- تأكد من إضافة Google credentials في `.env.local`
- تأكد من صحة Refresh Token
- بدون Google credentials، سيتم إنشاء رابط Meet يدوياً

### الخطأ: "Unauthorized"
- تأكد من تسجيل الدخول
- تحقق من وجود Token في localStorage

## 📝 ملاحظات مهمة

1. **في Production:**
   - غيّر `JWT_SECRET` إلى قيمة آمنة
   - استخدم HTTPS دائماً
   - لا ترفع `.env.local` على GitHub

2. **Google Meet:**
   - بدون Google OAuth، يمكن إدخال روابط Meet يدوياً
   - Admin/Doctor يمكنهم إضافة Meet link عند إنشاء الموعد

3. **Payment Proofs:**
   - بدون Supabase Storage، يمكن استخدام Cloudinary أو أي خدمة أخرى
   - أو تعديل الكود لرفع الصور على أي storage service

