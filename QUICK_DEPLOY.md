# ⚡ دليل النشر السريع

## 📋 الخطوات السريعة

### 1️⃣ رفع على GitHub

#### ⚠️ حل مشكلة "You must verify your email address"

إذا ظهرت رسالة الخطأ:
```
remote: You must verify your email address.
fatal: unable to access '...': The requested URL returned error: 403
```

**الحل:**
1. اذهب إلى: https://github.com/settings/emails
2. تحقق من صندوق الوارد (البريد الإلكتروني المستخدم في GitHub)
3. افتح رسالة التحقق من GitHub
4. اضغط على رابط التحقق
5. بعد التحقق، حاول مرة أخرى:
   ```bash
   git push -u origin main
   ```

#### خطوات الرفع:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/konsowa202/Sukkoon.git
git push -u origin main
```

**ملاحظة:** إذا كان Repository موجود بالفعل على GitHub، قد تحتاج إلى:
- إما حذف Repository القديم وإنشاء واحد جديد
- أو استخدام `git push -f origin main` (⚠️ احذر: هذا سيحذف التاريخ القديم)

### 2️⃣ النشر على Vercel

1. اذهب إلى: https://vercel.com/signup
2. سجل دخول بـ GitHub
3. اضغط **"Add New Project"**
4. اختر Repository الخاص بك
5. **أضف Environment Variables** (من ملف `.env.local` المحلي):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (بعد النشر)
   - `NODE_ENV` = `production`
6. اضغط **"Deploy"**

### 3️⃣ بعد النشر

1. احصل على URL من Vercel (مثل: `https://your-project.vercel.app`)
2. حدث `NEXT_PUBLIC_APP_URL` في Vercel Settings
3. اضغط **Redeploy**

---

## 📝 ملف `.env.local` المحلي

**ماذا تفعل به؟**
- ✅ **احتفظ به محلياً** - للعمل على المشروع
- ✅ **لا ترفعه على GitHub** - محمي تلقائياً
- ✅ **انسخ القيم** - لإضافتها في Vercel

---

## 🔗 روابط مهمة

- **دليل مفصل:** راجع `DEPLOYMENT_GUIDE.md`
- **مثال Environment Variables:** راجع `.env.example`

---

**جاهز للنشر! 🚀**
