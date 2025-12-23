# 🔧 أوامر Git للنشر

## ⚠️ مهم: فعّل البريد الإلكتروني أولاً!

1. اذهب إلى: https://github.com/settings/emails
2. تحقق من صندوق الوارد: `mahmoudkonsowa3030@gmail.com`
3. افتح رسالة التحقق من GitHub
4. اضغط على رابط التحقق

---

## بعد التفعيل، نفّذ هذه الأوامر:

```powershell
# الانتقال لمجلد المشروع
cd c:\Users\user\OneDrive\Desktop\sekoon

# إضافة جميع الملفات
git add .

# عمل Commit
git commit -m "Initial commit: Sukoon Platform"

# رفع على GitHub
git push -u origin main
```

---

## إذا استمرت المشكلة - استخدم Personal Access Token:

### 1. إنشاء Token:
1. اذهب إلى: https://github.com/settings/tokens
2. اضغط "Generate new token" → "Generate new token (classic)"
3. اختر الصلاحيات: ✅ `repo` (Full control of private repositories)
4. اضغط "Generate token"
5. انسخ الـ Token (سيظهر مرة واحدة فقط!)

### 2. استخدام Token:
```powershell
# عند الـ push، سيطلب منك:
# Username: konsowa202
# Password: [الصق الـ Token هنا]
git push -u origin main
```

---

## أو استخدم SSH (الأسهل على المدى الطويل):

### 1. إنشاء SSH Key:
```powershell
ssh-keygen -t ed25519 -C "mahmoudkonsowa3030@gmail.com"
# اضغط Enter للقيم الافتراضية
```

### 2. عرض المفتاح العام:
```powershell
cat ~/.ssh/id_ed25519.pub
# انسخ النص الكامل
```

### 3. إضافة المفتاح إلى GitHub:
1. اذهب إلى: https://github.com/settings/keys
2. اضغط "New SSH key"
3. الصق المفتاح
4. اضغط "Add SSH key"

### 4. تغيير Remote URL:
```powershell
git remote set-url origin git@github.com:konsowa202/Sukkoon.git
git push -u origin main
```

---

## الأوامر الكاملة (بعد تفعيل البريد):

```powershell
cd c:\Users\user\OneDrive\Desktop\sekoon
git add .
git commit -m "Initial commit: Sukoon Platform"
git push -u origin main
```

