# 🚀 دليل النشر السريع - Sukoon Platform

## ✅ ما تم إنجازه

تم إزالة جميع البيانات المؤقتة (Mock Data) وجعل المشروع يعمل فقط مع **Supabase** الحقيقي.

## 📋 الخطوات المطلوبة قبل النشر

### 1. إعداد Supabase (Required)

#### أ. إنشاء Project
1. اذهب إلى https://supabase.com
2. أنشئ حساب أو سجل دخول
3. اضغط **New Project**
4. املأ البيانات:
   - **Project Name**: `sukoon-platform`
   - **Database Password**: احفظه جيداً
   - **Region**: اختر الأقرب
5. انتظر 2-3 دقائق

#### ب. الحصول على API Keys
1. **Settings** → **API**
2. انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (في الأسفل) → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **سرّي**

#### ج. إنشاء Database Schema
1. **SQL Editor** → **New Query**
2. افتح `lib/supabase-schema.sql`
3. انسخ كل المحتوى
4. الصقه في SQL Editor
5. اضغط **Run** (F5)
6. ✅ تأكد من نجاح التنفيذ

#### د. إنشاء Storage Bucket
1. **Storage** → **New bucket**
2. **Name**: `payment-proofs`
3. **Public**: ❌ **غير public**
4. **Create bucket**
5. **Policies** tab → أضف:
```sql
CREATE POLICY "Users can upload payment proofs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can view own proofs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment-proofs' AND
  auth.role() = 'authenticated'
);
```

### 2. إنشاء JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
انسخ النتيجة → `JWT_SECRET`

### 3. (اختياري) Google Calendar API
راجع `DEPLOYMENT_SETUP.md` للتفاصيل الكاملة.

---

## 🔧 إعداد Environment Variables

### Local (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

JWT_SECRET=your-generated-secret-here

NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Vercel Production
1. **Settings** → **Environment Variables**
2. أضف نفس المتغيرات (بدون `NODE_ENV=development`)
3. أضف:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   NODE_ENV=production
   ```

---

## 🚀 النشر على Vercel

### الطريقة 1: من Dashboard
1. https://vercel.com/new
2. اختر **Import Git Repository**
3. اختر repository
4. **Configure Project**:
   - Framework: Next.js (تلقائي)
   - Build Command: `pnpm build`
5. أضف **Environment Variables**
6. **Deploy** → ✅

### الطريقة 2: CLI
```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

---

## ✅ التحقق بعد النشر

1. ✅ افتح المشروع المنشور
2. ✅ جرب إنشاء حساب جديد
3. ✅ تحقق من Supabase → `users` table
4. ✅ احجز موعد → تحقق من `appointments` table
5. ✅ ارفع proof → تحقق من Storage → `payment-proofs`

---

## ⚠️ ملاحظات مهمة

- ❌ **لا يوجد Mock Data** - يجب إعداد Supabase
- ✅ **Authentication حقيقي** - جميع المستخدمين في database
- ✅ **Storage حقيقي** - جميع الملفات في Supabase Storage
- 🔒 **JWT_SECRET** - استخدم string قوي عشوائي

---

## 🐛 حل المشاكل

### "Database not configured"
- تأكد من إضافة `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- تحقق من صحة القيم

### "Invalid token"
- تأكد من إضافة `JWT_SECRET` في Vercel
- يجب أن يكون نفس الـ secret في development و production

### "Storage bucket not found"
- أنشئ bucket `payment-proofs` في Supabase Storage
- تأكد من الـ policies

---

**📖 للتفاصيل الكاملة، راجع `DEPLOYMENT_SETUP.md`**

**🎉 جاهز للنشر!**






