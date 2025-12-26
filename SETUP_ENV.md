# 🔑 إعداد Environment Variables

## API Keys من Supabase

بناءً على ما حصلت عليه من Supabase Dashboard:

### 1. Publishable Key (Anon Key)
```
sb_publishable_o037k4g-Y-PwmSPUcuelqA_VljEQ7Dz
```
هذا هو `NEXT_PUBLIC_SUPABASE_ANON_KEY` - آمن للاستخدام في المتصفح

### 2. Secret Key (Service Role Key)
```
sb_secret_r_tHzz-A2y_nEu8rsRO4EA_z3npeEqt
```
هذا هو `SUPABASE_SERVICE_ROLE_KEY` - ⚠️ **سري جداً** - لا تشاركه أبداً

## ⚠️ ملاحظة مهمة

الـ keys التي أرسلتها تبدو **مختصرة**. في Supabase عادة تكون الـ keys أطول بكثير.

**تحقق من:**
1. اذهب إلى **Settings** → **API**
2. انسخ **Project URL** كاملاً
3. انسخ **anon public** key كاملاً (يبدأ بـ `eyJhbG...`)
4. انسخ **service_role** key كاملاً (يبدأ بـ `eyJhbG...`)

## 📝 ملف .env.local

أنشئ ملف `.env.local` في جذر المشروع:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxNzY5MjIwLCJleHAiOjE5NTczNDUyMjB9.your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDE3NjkyMjAsImV4cCI6MTk1NzM0NTIyMH0.your-service-role-key

# JWT Secret (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your-generated-jwt-secret-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🔍 كيفية الحصول على Project URL

1. في Supabase Dashboard
2. **Settings** → **API**
3. في قسم **Project URL** → انسخ الـ URL كاملاً

عادة يكون بهذا الشكل:
```
https://xxxxxxxxxxxxxxxxxxxxx.supabase.co
```

## ✅ بعد إضافة الـ Environment Variables

1. أعد تشغيل المشروع: `pnpm dev`
2. تأكد من أن الكود يعمل مع Supabase
3. جرب إنشاء حساب جديد

---

**⚠️ تذكر:** 
- لا ترفع ملف `.env.local` إلى Git
- أضف `.env.local` إلى `.gitignore`









