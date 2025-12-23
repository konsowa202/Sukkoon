# دليل البدء السريع - Sukoon Platform

## ⚡ التشغيل السريع (5 دقائق)

```bash
# 1. تثبيت Dependencies
pnpm install

# 2. تشغيل المشروع
pnpm dev

# 3. فتح المتصفح
# http://localhost:3000
```

## 📝 الحسابات التجريبية

- **Admin:** `admin@sukoon.com` / `123`
- **Doctor:** `doctor@sukoon.com` / `123`
- **Patient:** `patient@sukoon.com` / `123`

---

## 🚀 Deploy على Vercel (10 دقائق)

### الخطوات:
1. **ارفع المشروع على GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **ربط مع Vercel:**
   - اذهب إلى https://vercel.com
   - Sign up بـ GitHub
   - Add New Project → اختر Repository
   - Deploy! ✅

**التكلفة:** مجاني 100%

---

## 📋 الوضع الحالي للمشروع

### ✅ ما هو موجود:
- Frontend كامل (Next.js 16)
- واجهة مستخدم حديثة
- دعم عربي/إنجليزي
- Mock Authentication
- صفحات Dashboard (Admin, Doctor, Patient)
- بحث عن الأطباء وحجز المواعيد

### ⏳ ما يحتاج تطوير:
- Backend API
- قاعدة بيانات
- Google Meet Integration
- نظام الدفع (تحويل/فودافون كاش/أنستا باي)

---

## 📚 الملفات المرجعية

- **README.md** - نظرة عامة شاملة
- **DEPLOYMENT.md** - دليل Deploy مفصل
- **FUTURE_DEVELOPMENT.md** - خطة تطوير Backend والتكاملات

---

## 🆘 حل المشاكل السريع

### المشروع لا يعمل؟
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build فاشل؟
```bash
# تحقق من الأخطاء
pnpm build

# تأكد من TypeScript
pnpm tsc --noEmit
```

### الصور لا تظهر؟
- تأكد أن الصور في مجلد `/public`
- استخدم مسارات مثل `/image.jpg` وليس `./image.jpg`

---

## 🎯 الخطوات التالية

1. ✅ تشغيل المشروع محلياً
2. ✅ Deploy على Vercel
3. ⏳ بناء Backend (راجع FUTURE_DEVELOPMENT.md)
4. ⏳ تكامل Google Meet
5. ⏳ نظام الدفع

---

**أسئلة؟** راجع README.md للتفاصيل الكاملة

**آخر تحديث:** ديسمبر 2024
