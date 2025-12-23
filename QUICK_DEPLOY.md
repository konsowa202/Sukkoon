# ⚡ دليل النشر السريع

## 📋 الخطوات السريعة

### 1️⃣ رفع على GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

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
