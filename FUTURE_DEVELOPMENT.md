# خطة التطوير المستقبلية

## 📋 نظرة عامة

هذا الملف يوضح الخطة التفصيلية لبناء Backend وتكامل Google Meet ونظام الدفع.

---

## 🏗️ المرحلة 1: Backend API

### الخيار 1: Next.js API Routes (موصى به للبداية)

**المميزات:**
- ✅ نفس المشروع (لا تحتاج مشروع منفصل)
- ✅ Deploy سهل على Vercel
- ✅ TypeScript من البداية
- ✅ لا يحتاج إعدادات معقدة

**البنية المقترحة:**
```
app/
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   └── register/
│   │       └── route.ts
│   ├── doctors/
│   │   ├── route.ts          # GET, POST
│   │   └── [id]/
│   │       └── route.ts      # GET, PUT, DELETE
│   ├── appointments/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   └── payments/
│       ├── route.ts
│       └── [id]/
│           └── route.ts
```

### الخيار 2: Express.js Backend منفصل

**المميزات:**
- ✅ مرونة أكثر
- ✅ يمكن استخدامه مع Mobile App
- ✅ أسهل للـ Scaling

**البنية المقترحة:**
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── doctors.routes.ts
│   │   ├── appointments.routes.ts
│   │   └── payments.routes.ts
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── utils/
└── server.ts
```

### قاعدة البيانات: Supabase (موصى به) ⭐

**لماذا Supabase؟**
- ✅ مجاني للبداية (500MB database, 2GB bandwidth)
- ✅ PostgreSQL (قاعدة بيانات قوية)
- ✅ Authentication جاهز
- ✅ Storage للملفات (Screenshots)
- ✅ Real-time subscriptions
- ✅ سهل الإعداد

**الخطوات:**

1. إنشاء حساب على https://supabase.com
2. إنشاء Project جديد
3. الحصول على:
   - Database URL
   - API Key (anon, service_role)
   - Project URL

4. تثبيت Client:
```bash
pnpm add @supabase/supabase-js
```

5. إعداد Client:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Schema المقترح:**
```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Doctors Table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  specialization VARCHAR NOT NULL,
  bio TEXT,
  image_url VARCHAR,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_online INTEGER,
  price_offline INTEGER,
  experience INTEGER,
  gender VARCHAR CHECK (gender IN ('male', 'female')),
  languages TEXT[],
  consultation_type VARCHAR CHECK (consultation_type IN ('online', 'offline', 'both')),
  location VARCHAR,
  city VARCHAR,
  availability JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES doctors(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('online', 'offline')),
  status VARCHAR DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  service VARCHAR,
  meet_link VARCHAR, -- Google Meet link
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id),
  amount INTEGER NOT NULL,
  method VARCHAR NOT NULL CHECK (method IN ('bank_transfer', 'vodafone_cash', 'instapay')),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_image_url VARCHAR,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📹 المرحلة 2: تكامل Google Meet

### الطريقة 1: Manual Links (الأبسط)

**Implementation:**

1. إضافة حقل `meet_link` في جدول Appointments
2. عند حجز موعد Online:
   - Admin/Doctor يدخل رابط Google Meet يدوياً
   - أو يتم إنشاؤه مسبقاً وحفظه في Profile

**الكود:**
```typescript
// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { patientId, doctorId, date, time, type, meetLink } = await request.json()
  
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: patientId,
      doctor_id: doctorId,
      date,
      time,
      type,
      meet_link: type === 'online' ? meetLink : null
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ data })
}
```

### الطريقة 2: Google Calendar API (المتقدمة)

**المتطلبات:**
1. Google Cloud Project
2. تفعيل Google Calendar API
3. OAuth 2.0 credentials

**الخطوات:**

1. **إنشاء Google Cloud Project:**
```bash
# في Google Cloud Console
- New Project → اسمه "Sukoon Platform"
- APIs & Services → Enable APIs → Google Calendar API
```

2. **إنشاء OAuth Credentials:**
```
- APIs & Services → Credentials
- Create Credentials → OAuth 2.0 Client ID
- Application type: Web application
- Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
```

3. **تثبيت Google APIs:**
```bash
pnpm add googleapis
```

4. **API Route لإنشاء Google Meet:**
```typescript
// app/api/appointments/create-meet/route.ts
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// تحديث Token (يحتاج إدارة OAuth Flow)
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

export async function POST(request: NextRequest) {
  const { doctorEmail, patientEmail, startTime, duration = 60 } = await request.json()
  
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  
  const event = {
    summary: 'Therapy Session - Sukoon',
    description: 'Mental health consultation session',
    start: {
      dateTime: new Date(startTime).toISOString(),
      timeZone: 'Africa/Cairo',
    },
    end: {
      dateTime: new Date(new Date(startTime).getTime() + duration * 60000).toISOString(),
      timeZone: 'Africa/Cairo',
    },
    attendees: [
      { email: doctorEmail },
      { email: patientEmail }
    ],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    }
  }
  
  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    })
    
    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri
    
    return NextResponse.json({ 
      success: true, 
      meetLink,
      eventId: response.data.id
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
```

**OAuth Flow (لأخذ Authorization):**
```typescript
// app/api/auth/google/route.ts
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export async function GET(request: NextRequest) {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    prompt: 'consent'
  })
  
  return NextResponse.redirect(url)
}

// app/api/auth/callback/google/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  const { tokens } = await oauth2Client.getToken(code!)
  // حفظ refresh_token في Database (للاستخدام لاحقاً)
  
  return NextResponse.redirect('/admin/dashboard?google_connected=true')
}
```

---

## 💳 المرحلة 3: نظام الدفع

### التصميم المقترح:

**1. صفحة اختيار طريقة الدفع:**
```typescript
// app/patient/appointment/[id]/payment/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PaymentPage() {
  const [method, setMethod] = useState<'bank_transfer' | 'vodafone_cash' | 'instapay' | null>(null)
  const [proofImage, setProofImage] = useState<File | null>(null)
  
  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      details: 'Account: 1234567890 - Bank: CIB',
      icon: '🏦'
    },
    {
      id: 'vodafone_cash',
      name: 'Vodafone Cash',
      details: 'Number: 0100 000 0000',
      icon: '📱'
    },
    {
      id: 'instapay',
      name: 'InstaPay',
      details: 'Account: 1234567890',
      icon: '💳'
    }
  ]
  
  const handleSubmit = async () => {
    // 1. رفع الصورة (Screenshot)
    const formData = new FormData()
    if (proofImage) {
      formData.append('proof', proofImage)
    }
    
    // 2. حفظ Payment في Database
    const response = await fetch('/api/payments', {
      method: 'POST',
      body: JSON.stringify({
        appointmentId: appointment.id,
        amount: appointment.amount,
        method
      })
    })
    
    // 3. رفع الصورة
    if (proofImage) {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
    }
  }
  
  return (
    <div>
      <h1>Payment</h1>
      {/* Payment methods selection */}
      {/* Image upload */}
      {/* Submit button */}
    </div>
  )
}
```

**2. API Route للدفع:**
```typescript
// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { appointmentId, amount, method, proofImageUrl } = await request.json()
  
  const { data, error } = await supabase
    .from('payments')
    .insert({
      appointment_id: appointmentId,
      amount,
      method,
      status: 'pending',
      proof_image_url: proofImageUrl
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ data })
}
```

**3. Dashboard للـ Admin للتحقق:**
```typescript
// app/admin/payments/page.tsx
'use client'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  
  const approvePayment = async (paymentId: string) => {
    await fetch(`/api/payments/${paymentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'approved' })
    })
    // تفعيل الموعد تلقائياً
  }
  
  return (
    <div>
      <h1>Pending Payments</h1>
      {payments.map(payment => (
        <Card>
          <img src={payment.proof_image_url} alt="Proof" />
          <Button onClick={() => approvePayment(payment.id)}>Approve</Button>
          <Button onClick={() => rejectPayment(payment.id)}>Reject</Button>
        </Card>
      ))}
    </div>
  )
}
```

**4. رفع الصور (Supabase Storage):**
```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('proof') as File
  
  const fileName = `payment-proofs/${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('proofs')
    .upload(fileName, file)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('proofs')
    .getPublicUrl(fileName)
  
  return NextResponse.json({ url: publicUrl })
}
```

---

## 🔐 المرحلة 4: Authentication الحقيقي

### استخدام Supabase Auth:

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
  
  return NextResponse.json({ 
    user: data.user,
    session: data.session 
  })
}
```

---

## 📅 Timeline المقترح

### الأسبوع 1-2: Backend الأساسي
- إعداد Supabase
- إنشاء Schema
- API Routes للـ CRUD الأساسي

### الأسبوع 3: Google Meet
- OAuth Setup
- Calendar API Integration
- Testing

### الأسبوع 4: نظام الدفع
- صفحة الدفع
- رفع الصور
- Admin Dashboard للتحقق

### الأسبوع 5: Testing & Deploy
- Testing شامل
- Fix Bugs
- Deploy على Vercel

---

## 📝 ملاحظات مهمة

1. **Security:**
   - استخدم Environment Variables للأسرار
   - Validate كل Input
   - Rate Limiting على APIs
   - HTTPS دائماً

2. **Error Handling:**
   - Handle كل Errors بشكل مناسب
   - Logging للأخطاء
   - User-friendly error messages

3. **Testing:**
   - Unit Tests
   - Integration Tests
   - Manual Testing على Browsers مختلفة

---

**آخر تحديث:** ديسمبر 2024
