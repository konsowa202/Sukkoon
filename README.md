# Sukoon - Mental Health Platform

منصة للصحة النفسية تربط المرضى بالأطباء النفسيين والمختصين في العلاج النفسي.

## 📋 نظرة عامة

Sukoon هي منصة Frontend مبنية بـ Next.js 16، تم تصميمها لربط المرضى بالأطباء النفسيين. المشروع حالياً يعمل على Mock Data ولا يوجد Backend بعد.

### المميزات الحالية:
- ✅ واجهة مستخدم حديثة مع دعم Dark Mode
- ✅ دعم اللغة العربية والإنجليزية (RTL/LTR)
- ✅ نظام تسجيل دخول وتسجيل حساب (Mock Auth)
- ✅ صفحة بحث عن الأطباء مع فلاتر متعددة
- ✅ صفحات Dashboard للعديد من المستخدمين (Patient, Doctor, Admin)
- ✅ عرض ملفات الأطباء وحجز المواعيد
- ✅ تصميم Responsive

### ما يحتاج إلى تطوير:
- ⏳ Backend API (Node.js/Express أو Next.js API Routes)
- ⏳ قاعدة بيانات (PostgreSQL, MongoDB, أو Supabase)
- ⏳ تكامل مع Google Meet للجلسات الإلكترونية
- ⏳ نظام الدفع (تحويل بنكي، فودافون كاش، أنستا باي)
- ⏳ نظام إشعارات
- ⏳ نظام إدارة المواعيد الحقيقي

---

## 🚀 متطلبات التشغيل

### المتطلبات الأساسية:
1. **Node.js** - الإصدار 18 أو أحدث
   - تحميل من: https://nodejs.org/
   - للتحقق من الإصدار: `node --version`

2. **pnpm** (موصى به) أو npm
   - تثبيت pnpm: `npm install -g pnpm`
   - أو استخدام npm الموجود مع Node.js

3. **Git** (لنسخ المشروع)
   - تحميل من: https://git-scm.com/

---

## 📦 خطوات التشغيل المحلي

### 1. تثبيت Dependencies

```bash
# باستخدام pnpm (الأسرع)
pnpm install

# أو باستخدام npm
npm install
```

### 2. تشغيل المشروع في وضع التطوير

```bash
# باستخدام pnpm
pnpm dev

# أو باستخدام npm
npm run dev
```

### 3. فتح المتصفح

افتح المتصفح واذهب إلى: **http://localhost:3000**

### 4. حسابات تجريبية للتسجيل

**Admin:**
- Email: `admin@sukoon.com`
- Password: `123`

**Doctor:**
- Email: `doctor@sukoon.com`
- Password: `123`

**Patient:**
- Email: `patient@sukoon.com`
- Password: `123`

---

## 🏗️ بناء المشروع للإنتاج

```bash
# بناء المشروع
pnpm build

# تشغيل النسخة الإنتاجية محلياً
pnpm start
```

---

## 🌐 Deploy (الحلول المجانية المناسبة لمصر)

### الخيار 1: Vercel (الأسهل - موصى به) ⭐

**المميزات:**
- ✅ مجاني 100%
- ✅ Deploy تلقائي مع GitHub
- ✅ CDN عالمي (سريع في مصر)
- ✅ SSL مجاني
- ✅ دعم Next.js كامل

**خطوات Deploy:**

1. ارفع المشروع على GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <رابط الـ repository>
git push -u origin main
```

2. اذهب إلى https://vercel.com
3. سجل دخول بـ GitHub
4. اضغط "Add New Project"
5. اختر Repository الخاص بك
6. اضغط "Deploy" (Vercel سيتعرف على Next.js تلقائياً)
7. انتهى! 🎉

**التكلفة:** مجاني تماماً (حتى 100GB bandwidth شهرياً)

---

### الخيار 2: Netlify (بديل ممتاز)

**المميزات:**
- ✅ مجاني 100%
- ✅ Deploy تلقائي مع GitHub
- ✅ SSL مجاني

**خطوات Deploy:**

1. ارفع المشروع على GitHub (نفس الخطوات أعلاه)
2. اذهب إلى https://netlify.com
3. سجل دخول بـ GitHub
4. اضغط "Add new site" → "Import an existing project"
5. اختر Repository الخاص بك
6. Build settings:
   - Build command: `pnpm build` أو `npm run build`
   - Publish directory: `.next`
7. اضغط "Deploy site"

**التكلفة:** مجاني تماماً

---

### الخيار 3: Railway (للـ Backend المستقبلي)

**متى تستخدمه:**
- عندما تحتاج Backend API
- تحتاج قاعدة بيانات
- تحتاج Background Jobs

**المميزات:**
- ✅ $5 شهرياً (500 ساعة مجاناً - كافية للبداية)
- ✅ دعم قواعد البيانات (PostgreSQL مجاني)
- ✅ Deploy من GitHub مباشرة

---

## 🔐 تكامل Google Meet

### الخطة المستقبلية:

#### الطريقة 1: Google Meet Links (الأسهل - بدون API)
- عند حجز موعد Online، يتم إنشاء رابط Google Meet يدوياً
- يحفظ الرابط في قاعدة البيانات مع الموعد
- عند موعد الجلسة، يظهر زر "Join Meeting" يفتح الرابط

#### الطريقة 2: Google Calendar API + Google Meet (متقدم)
- استخدام Google Calendar API لإنشاء Events
- إضافة Google Meet link تلقائياً للحدث
- إرسال إشعارات للمستخدمين

**متطلبات:**
1. Google Cloud Project
2. تفعيل Google Calendar API
3. OAuth 2.0 credentials
4. Service Account (للأتمتة)

**ملاحظة:** هذه الميزة تحتاج Backend للتعامل مع Google APIs

---

## 💳 نظام الدفع (المستقبلي)

### طرق الدفع المطلوبة:

#### 1. التحويل البنكي (Bank Transfer)
- ✅ بدون تكلفة إضافية
- عرض بيانات الحساب البنكي
- المستخدم يرسل screenshot للتحويل
- Admin يتحقق ويفعل الموعد

#### 2. فودافون كاش (Vodafone Cash)
- ✅ بدون تكلفة API (Manual)
- عرض رقم فودافون كاش
- المستخدم يرسل screenshot للدفع
- Admin يتحقق ويفعل الموعد

#### 3. أنستا باي (InstaPay)
- ⚠️ يحتاج تكامل مع البنك
- أو Manual (مثل فودافون كاش)

### التصميم المقترح:

```typescript
// مثال على Flow الدفع
interface Payment {
  id: string
  appointmentId: string
  amount: number
  method: "bank_transfer" | "vodafone_cash" | "instapay"
  status: "pending" | "completed" | "rejected"
  proofImage?: string // Screenshot من المستخدم
  verifiedAt?: Date
  verifiedBy?: string // Admin ID
}
```

**Workflow:**
1. المستخدم يحجز موعد
2. يختار طريقة الدفع
3. يدفع خارج المنصة (حالياً)
4. يرفع screenshot للدفع
5. Admin يتحقق من الدفع
6. عند الموافقة، يتم تفعيل الموعد

---

## 🗄️ البنية الحالية للمشروع

```
sekoon/
├── app/                    # Next.js App Router
│   ├── admin/             # صفحات Admin
│   ├── doctor/            # صفحات Doctor
│   ├── patient/           # صفحات Patient
│   ├── login/             # صفحة تسجيل الدخول
│   └── signup/            # صفحة التسجيل
├── components/            # React Components
│   ├── ui/               # UI Components (shadcn/ui)
│   └── header-nav.tsx    # Navigation Bar
├── contexts/             # React Contexts
│   ├── mock-auth-context.tsx    # Mock Authentication
│   ├── language-context.tsx     # Language Switching
│   └── theme-context.tsx        # Dark/Light Mode
├── lib/                  # Utilities
│   ├── mock-data.ts      # Mock Data للبيانات
│   └── utils.ts          # Helper Functions
└── public/               # Static Files
```

---

## 🔧 المتغيرات البيئية المطلوبة (مستقبلاً)

عند بناء Backend، ستحتاج ملف `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# Google OAuth (لـ Google Meet)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

# JWT Secret
JWT_SECRET=...

# API Keys
# ...etc
```

**ملاحظة:** حالياً لا تحتاج أي متغيرات بيئية

---

## 📝 المهام المستقبلية

### المرحلة 1: Backend الأساسي
- [ ] إعداد Backend API (Node.js/Express أو Next.js API Routes)
- [ ] إعداد قاعدة بيانات (Supabase مجاني أو Railway)
- [ ] نظام Authentication حقيقي (JWT)
- [ ] CRUD للأطباء
- [ ] CRUD للمواعيد

### المرحلة 2: التكاملات
- [ ] تكامل Google Meet
- [ ] نظام إشعارات (Email/SMS)
- [ ] نظام رفع الملفات (Screenshots الدفع)

### المرحلة 3: نظام الدفع
- [ ] صفحة اختيار طريقة الدفع
- [ ] رفع Screenshot للدفع
- [ ] Dashboard للـ Admin للتحقق من المدفوعات
- [ ] تفعيل/رفض الدفعات

### المرحلة 4: التحسينات
- [ ] Real-time Updates (WebSockets)
- [ ] Push Notifications
- [ ] Analytics Dashboard
- [ ] Mobile App (React Native)

---

## 🛠️ التقنيات المستخدمة

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **3D Graphics:** Three.js (@react-three/fiber)
- **Forms:** React Hook Form + Zod
- **State Management:** React Context API
- **Package Manager:** pnpm

---

## 📞 الدعم

إذا واجهت أي مشاكل في التشغيل أو التطوير، لا تتردد في التواصل.

---

## 📄 الرخصة

هذا المشروع مملوك لشركة Sukoon.

---

## 🎯 ملخص سريع للتشغيل

```bash
# 1. تثبيت المتطلبات
pnpm install

# 2. تشغيل المشروع
pnpm dev

# 3. فتح المتصفح
# http://localhost:3000

# 4. Deploy على Vercel
# ارفع على GitHub → اربط بـ Vercel → Deploy
```

---

**آخر تحديث:** ديسمبر 2024
