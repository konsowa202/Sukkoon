# دليل Deployment للمشروع

## 📋 نظرة عامة

هذا الدليل يشرح كيفية عمل Deploy للمشروع على المنصات المجانية المناسبة للمطورين في مصر.

---

## 🌟 الخيار 1: Vercel (الموصى به)

### لماذا Vercel؟
- ✅ مجاني تماماً (لا يحتاج بطاقة ائتمانية للبداية)
- ✅ CDN عالمي (سريع في مصر)
- ✅ Deploy تلقائي من GitHub
- ✅ SSL مجاني
- ✅ دعم Next.js كامل ومثالي

### خطوات Deploy على Vercel:

#### الخطوة 1: رفع المشروع على GitHub

1. إنشاء Repository جديد على GitHub:
   - اذهب إلى https://github.com/new
   - اختر اسم للمشروع (مثل: `sukoon-platform`)
   - اختر Public أو Private
   - لا تقم بإنشاء README (لأنه موجود بالفعل)

2. رفع المشروع:
```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit: Sukoon Mental Health Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

#### الخطوة 2: ربط GitHub مع Vercel

1. اذهب إلى https://vercel.com/signup
2. سجل دخول باستخدام حساب GitHub
3. بعد تسجيل الدخول، اضغط على "Add New Project"
4. اختر Repository الخاص بك
5. Vercel سيتعرف تلقائياً على Next.js وسيقترح الإعدادات التالية:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `pnpm build` (أو `npm run build`)
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install` (أو `npm install`)

6. اضغط "Deploy"

#### الخطوة 3: الانتظار والتحقق

- Vercel سيقوم ببناء المشروع (عادة يستغرق 1-2 دقيقة)
- بعد الانتهاء، ستحصل على رابط مثل: `https://your-project.vercel.app`
- ✅ المشروع الآن متاح للعالم!

#### إعدادات إضافية (اختيارية):

1. **Custom Domain:**
   - Settings → Domains
   - أضف اسم النطاق الخاص بك
   - Vercel سيوجهك لإعدادات DNS

2. **Environment Variables:**
   - Settings → Environment Variables
   - أضف المتغيرات البيئية إذا احتجتها في المستقبل

### الحدود المجانية:
- 100GB Bandwidth شهرياً (كثير جداً للمشاريع الصغيرة)
- Builds غير محدودة
- لا يوجد حدود على عدد المشاريع

---

## 🌟 الخيار 2: Netlify

### خطوات Deploy على Netlify:

1. **رفع المشروع على GitHub** (نفس الخطوات أعلاه)

2. **ربط Netlify:**
   - اذهب إلى https://app.netlify.com/signup
   - سجل دخول بـ GitHub
   - اضغط "Add new site" → "Import an existing project"
   - اختر Repository الخاص بك

3. **Build Settings:**
   ```
   Build command: pnpm build (أو npm run build)
   Publish directory: .next
   ```

4. **Environment Variables (اختياري):**
   - Site settings → Environment variables
   - أضف المتغيرات المطلوبة

5. **Deploy!**

### الحدود المجانية:
- 100GB Bandwidth شهرياً
- 300 Build minutes شهرياً

---

## 🚂 الخيار 3: Railway (للـ Backend المستقبلي)

Railway مفيد عندما تحتاج Backend API وقاعدة بيانات.

### خطوات Deploy على Railway:

1. **رفع المشروع على GitHub**

2. **ربط Railway:**
   - اذهب إلى https://railway.app
   - سجل دخول بـ GitHub
   - اضغط "New Project" → "Deploy from GitHub repo"
   - اختر Repository الخاص بك

3. **إعدادات:**
   - Railway سيتعرف تلقائياً على Next.js
   - سيقوم بالبناء والـ Deploy تلقائياً

4. **قاعدة بيانات (اختياري):**
   - اضغط "+ New" → "Database" → "PostgreSQL"
   - Railway سيوفر لك `DATABASE_URL` تلقائياً

### التسعير:
- $5 شهرياً بعد 500 ساعة مجانية
- قاعدة بيانات PostgreSQL صغيرة مجانية

---

## 📱 تكامل Google Meet (الخطة المستقبلية)

### الطريقة البسيطة (بدون API):

عند حجز موعد Online:
1. Admin أو Doctor ينشئ رابط Google Meet يدوياً
2. يحفظ الرابط في قاعدة البيانات مع الموعد
3. عند وقت الجلسة، يظهر زر "Join Meeting" يفتح الرابط

**الكود المقترح:**
```typescript
// في صفحة Appointment Details
{appointment.type === 'online' && appointment.meetLink && (
  <Button onClick={() => window.open(appointment.meetLink, '_blank')}>
    <Video className="w-4 h-4 mr-2" />
    Join Google Meet
  </Button>
)}
```

### الطريقة المتقدمة (مع Google Calendar API):

**المتطلبات:**
1. Google Cloud Project
2. تفعيل Google Calendar API
3. OAuth 2.0 credentials
4. Service Account

**الخطوات:**

1. **إنشاء Google Cloud Project:**
   - اذهب إلى https://console.cloud.google.com
   - أنشئ مشروع جديد
   - تفعيل Google Calendar API

2. **إنشاء OAuth Credentials:**
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - اختر "Web application"
   - أضف Authorized redirect URIs

3. **في Backend:**
```typescript
// API Route: /api/appointments/create
import { google } from 'googleapis';

async function createGoogleMeet(doctorEmail: string, startTime: Date) {
  const calendar = google.calendar({ version: 'v3' });
  
  const event = {
    summary: 'Therapy Session',
    start: { dateTime: startTime.toISOString() },
    end: { dateTime: new Date(startTime.getTime() + 3600000).toISOString() },
    attendees: [{ email: doctorEmail }],
    conferenceData: {
      createRequest: {
        requestId: 'meet-' + Date.now(),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };
  
  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1
  });
  
  return response.data.conferenceData?.entryPoints?.[0]?.uri;
}
```

**ملاحظة:** هذا يحتاج Backend API متكامل.

---

## 💳 نظام الدفع (الخطة المستقبلية)

### الخيار 1: Manual (بدون API)

**Flow:**
1. المستخدم يحجز موعد
2. يختار طريقة الدفع (تحويل بنكي / فودافون كاش / أنستا باي)
3. يظهر له:
   - رقم الحساب/رقم فودافون كاش
   - مبلغ الدفع
   - حقل لرفع Screenshot
4. يرفع المستخدم Screenshot للدفع
5. Admin يتحقق من Screenshot
6. عند الموافقة، يتم تفعيل الموعد

**الكود المقترح:**
```typescript
interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: 'bank_transfer' | 'vodafone_cash' | 'instapay';
  status: 'pending' | 'approved' | 'rejected';
  proofImage?: string; // URL للصورة
  createdAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string; // Admin ID
}
```

### الخيار 2: Integration مع Payment Gateways

**خيارات في مصر:**
- **Paymob:** يدعم فودافون كاش، أنستا باي، بطاقات
- **Paymob API:** https://docs.paymob.com

**لكن:** هذا يحتاج Backend API ومتغيرات بيئية للأمان.

---

## 🔒 الأمان (مستقبلاً)

### متغيرات بيئية مهمة:

```env
# يجب أن تكون سرية ولا تُرفع على GitHub
JWT_SECRET=your_super_secret_key_here
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_SECRET=...
```

**ملاحظة:** تأكد من إضافة `.env.local` إلى `.gitignore`

---

## 📊 Monitoring و Analytics

### Vercel Analytics:
- مفعل بالفعل في المشروع (`@vercel/analytics`)
- يعرض إحصائيات الزيارات والأداء

### Google Analytics (اختياري):
- يمكن إضافة GA4 للمشروع
- تتبع المستخدمين والسلوك

---

## 🔄 Continuous Deployment

### مع Vercel/Netlify:
- كل Push على `main` branch → Deploy تلقائي
- Pull Requests → Preview Deployments

### Workflow:
1. تعمل على Feature في branch جديد
2. ترفع Branch على GitHub
3. تفتح Pull Request
4. Vercel/Netlify ينشئ Preview URL
5. بعد الموافقة و Merge → Deploy تلقائي على Production

---

## ✅ Checklist قبل Deploy

- [ ] المشروع يعمل محلياً بدون أخطاء
- [ ] `pnpm build` ينجح
- [ ] لا توجد Console Errors
- [ ] الصور والـ Assets موجودة في `/public`
- [ ] `.env.local` في `.gitignore`
- [ ] Repository على GitHub
- [ ] Connected مع Vercel/Netlify

---

## 🆘 حل المشاكل الشائعة

### مشكلة: Build فاشل
- تحقق من الأخطاء في Vercel Build Logs
- تأكد من أن كل Dependencies مثبتة
- تأكد من TypeScript errors

### مشكلة: الصور لا تظهر
- تأكد من أن الصور في مجلد `/public`
- استخدم مسارات نسبية مثل `/image.jpg` وليس `./image.jpg`

### مشكلة: 404 على Routes
- تأكد من أن Next.js Config صحيح
- تحقق من App Router Structure

---

**آخر تحديث:** ديسمبر 2024
