export interface Doctor {
  id: string
  name: string
  specialization: string
  bio: string
  image: string
  rating: number
  reviewCount: number
  priceOnline: number // EGP
  priceOffline: number // EGP
  experience: number
  gender: "male" | "female"
  languages: string[]
  availability: { [key: string]: string[] }
  consultationType: "online" | "offline" | "both"
  location?: string // Only for offline or both
  city?: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: "online" | "offline"
  status: "upcoming" | "confirmed" | "completed" | "cancelled" | "pending"
  service: string
  meetLink?: string
  location?: string
  city?: string
  request_type?: string
  request_message?: string
}

export interface AdminStats {
  totalDoctors: number
  totalPatients: number
  totalAppointments: number
  revenue: number
}

export interface Case {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  title: string
  description: string
  status: "active" | "resolved" | "on-hold"
  createdAt: string
  updatedAt: string
  sessions: number
}

export interface Topic {
  id: string
  name: string
  category: string
  description: string
  resourceCount: number
  viewCount: number
  createdAt: string
}

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  joinedDate: string
  totalSessions: number
  status: "active" | "inactive"
}

export const fallbackDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Ahmed",
    specialization: "Clinical Psychologist",
    bio: "Specialized in anxiety, depression, and trauma therapy with over 10 years of experience.",
    image: "/female-psychologist.jpg",
    rating: 4.8,
    reviewCount: 127,
    priceOnline: 4500, // EGP
    priceOffline: 6000, // EGP
    experience: 10,
    gender: "female",
    languages: ["English", "Arabic", "Urdu"],
    availability: {
      Monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Wednesday: ["09:00", "10:00", "11:00"],
      Thursday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Friday: ["09:00", "10:00", "11:00"],
    },
    consultationType: "both",
    location: "123 Medical Center, Nasr City",
    city: "Cairo",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Psychiatrist",
    bio: "Board-certified psychiatrist specializing in mood disorders and medication management.",
    image: "/male-psychiatrist.jpg",
    rating: 4.9,
    reviewCount: 203,
    priceOnline: 6000, // EGP
    priceOffline: 7500, // EGP
    experience: 15,
    gender: "male",
    languages: ["English", "Mandarin"],
    availability: {
      Monday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      Tuesday: ["10:00", "11:00", "14:00", "15:00"],
      Wednesday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      Thursday: ["10:00", "11:00", "14:00"],
      Friday: ["10:00", "11:00"],
    },
    consultationType: "online",
  },
  {
    id: "3",
    name: "Dr. Amina Khan",
    specialization: "Family Therapist",
    bio: "Helping families navigate relationship challenges and improve communication.",
    image: "/female-therapist.jpg",
    rating: 4.7,
    reviewCount: 89,
    priceOnline: 3900, // EGP
    priceOffline: 5400, // EGP
    experience: 8,
    gender: "female",
    languages: ["English", "Urdu", "Punjabi"],
    availability: {
      Monday: ["09:00", "10:00", "11:00", "14:00"],
      Tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Wednesday: ["09:00", "10:00"],
      Thursday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Friday: ["09:00", "10:00", "11:00"],
    },
    consultationType: "both",
    location: "456 Wellness Clinic, Maadi",
    city: "Cairo",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Addiction Specialist",
    bio: "Compassionate care for those struggling with substance abuse and behavioral addictions.",
    image: "/male-addiction-specialist.jpg",
    rating: 4.6,
    reviewCount: 156,
    priceOnline: 5400, // EGP
    priceOffline: 6600, // EGP
    experience: 12,
    gender: "male",
    languages: ["English", "Spanish"],
    availability: {
      Monday: ["10:00", "11:00", "15:00", "16:00"],
      Tuesday: ["10:00", "11:00", "15:00", "16:00"],
      Wednesday: ["10:00", "11:00", "15:00"],
      Thursday: ["10:00", "11:00", "15:00", "16:00"],
      Friday: [],
    },
    consultationType: "offline",
    location: "789 Recovery Center, 6th October City",
    city: "Giza",
  },
  {
    id: "5",
    name: "Dr. Fatima Hassan",
    specialization: "Child Psychologist",
    bio: "Specialized in helping children and adolescents with behavioral and emotional challenges.",
    image: "/female-child-psychologist.jpg",
    rating: 4.9,
    reviewCount: 178,
    priceOnline: 4800, // EGP
    priceOffline: 6300, // EGP
    experience: 11,
    gender: "female",
    languages: ["English", "Arabic"],
    availability: {
      Monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Tuesday: ["09:00", "10:00", "14:00", "15:00"],
      Wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Thursday: ["09:00", "10:00", "11:00"],
      Friday: ["09:00", "10:00"],
    },
    consultationType: "both",
    location: "321 Children's Clinic, Heliopolis",
    city: "Cairo",
  },
  {
    id: "6",
    name: "Dr. Robert Taylor",
    specialization: "Cognitive Behavioral Therapist",
    bio: "Expert in CBT techniques for anxiety, depression, and OCD treatment.",
    image: "/male-cbt-therapist.jpg",
    rating: 4.8,
    reviewCount: 142,
    priceOnline: 5100, // EGP
    priceOffline: 6600, // EGP
    experience: 9,
    gender: "male",
    languages: ["English", "French"],
    availability: {
      Monday: ["10:00", "11:00", "14:00", "15:00"],
      Tuesday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      Wednesday: ["10:00", "11:00", "14:00"],
      Thursday: ["10:00", "11:00", "14:00", "15:00"],
      Friday: ["10:00", "11:00"],
    },
    consultationType: "online",
  },
]

export const fallbackAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "3",
    patientName: "John Doe",
    doctorId: "1",
    doctorName: "Dr. Sarah Ahmed",
    date: "2025-12-20",
    time: "10:00",
    type: "online",
    status: "upcoming",
    service: "Individual Therapy Session",
  },
  {
    id: "2",
    patientId: "3",
    patientName: "John Doe",
    doctorId: "5",
    doctorName: "Dr. Fatima Hassan",
    date: "2025-12-25",
    time: "14:00",
    type: "offline",
    status: "upcoming",
    service: "Consultation",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "John Doe",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    date: "2025-12-10",
    time: "11:00",
    type: "online",
    status: "completed",
    service: "Psychiatric Evaluation",
  },
]

export interface Message {
  id: string
  appointmentId: string
  senderId: string
  content: string
  createdAt: string
}

export const fallbackMessages: Message[] = [
  {
    id: "m1",
    appointmentId: "1",
    senderId: "1",
    content: "Hello! How can I help you today?",
    createdAt: new Date().toISOString()
  }
]

export const fallbackAdminStats: AdminStats = {
  totalDoctors: 6,
  totalPatients: 234,
  totalAppointments: 1456,
  revenue: 287500,
}

export const fallbackPendingDoctors = [
  {
    id: "7",
    name: "Dr. Emma Johnson",
    specialization: "Marriage Counselor",
    email: "emma.johnson@example.com",
    status: "pending",
    appliedDate: "2025-12-15",
  },
  {
    id: "8",
    name: "Dr. Ali Rahman",
    specialization: "Trauma Specialist",
    email: "ali.rahman@example.com",
    status: "pending",
    appliedDate: "2025-12-14",
  },
]

export const fallbackCases: Case[] = [
  {
    id: "case-1",
    patientId: "3",
    patientName: "John Doe",
    doctorId: "1",
    doctorName: "Dr. Sarah Ahmed",
    title: "Anxiety Management",
    description: "Working on managing work-related anxiety and stress",
    status: "active",
    createdAt: "2025-11-15",
    updatedAt: "2025-12-15",
    sessions: 8,
  },
  {
    id: "case-2",
    patientId: "pat-2",
    patientName: "Jane Smith",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    title: "Depression Treatment",
    description: "Ongoing treatment for major depressive disorder",
    status: "active",
    createdAt: "2025-10-20",
    updatedAt: "2025-12-12",
    sessions: 12,
  },
  {
    id: "case-3",
    patientId: "pat-3",
    patientName: "Ahmed Hassan",
    doctorId: "5",
    doctorName: "Dr. Fatima Hassan",
    title: "Child Behavioral Issues",
    description: "Supporting child with ADHD and behavioral challenges",
    status: "active",
    createdAt: "2025-11-01",
    updatedAt: "2025-12-14",
    sessions: 6,
  },
  {
    id: "case-4",
    patientId: "pat-4",
    patientName: "Sarah Williams",
    doctorId: "3",
    doctorName: "Dr. Amina Khan",
    title: "Marriage Counseling",
    description: "Completed marriage counseling sessions",
    status: "resolved",
    createdAt: "2025-09-01",
    updatedAt: "2025-11-30",
    sessions: 15,
  },
]

export const fallbackTopics: Topic[] = [
  {
    id: "topic-1",
    name: "Anxiety Disorders",
    category: "Mental Health",
    description: "Resources and information about anxiety disorders and treatment options",
    resourceCount: 24,
    viewCount: 1234,
    createdAt: "2025-01-15",
  },
  {
    id: "topic-2",
    name: "Depression",
    category: "Mental Health",
    description: "Understanding depression, symptoms, and evidence-based treatments",
    resourceCount: 31,
    viewCount: 2103,
    createdAt: "2025-01-20",
  },
  {
    id: "topic-3",
    name: "Stress Management",
    category: "Wellness",
    description: "Practical techniques for managing stress in daily life",
    resourceCount: 18,
    viewCount: 987,
    createdAt: "2025-02-10",
  },
  {
    id: "topic-4",
    name: "Mindfulness",
    category: "Wellness",
    description: "Mindfulness practices and meditation techniques",
    resourceCount: 22,
    viewCount: 1567,
    createdAt: "2025-02-15",
  },
  {
    id: "topic-5",
    name: "Relationship Issues",
    category: "Relationships",
    description: "Guidance on improving communication and resolving conflicts",
    resourceCount: 15,
    viewCount: 876,
    createdAt: "2025-03-01",
  },
]

export const fallbackPatients: Patient[] = [
  {
    id: "3",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+20 100 123 4567",
    dateOfBirth: "1990-05-15",
    gender: "male",
    joinedDate: "2025-11-01",
    totalSessions: 8,
    status: "active",
  },
  {
    id: "pat-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+20 100 234 5678",
    dateOfBirth: "1985-08-22",
    gender: "female",
    joinedDate: "2025-10-15",
    totalSessions: 12,
    status: "active",
  },
  {
    id: "pat-3",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    phone: "+20 100 345 6789",
    dateOfBirth: "2015-03-10",
    gender: "male",
    joinedDate: "2025-11-01",
    totalSessions: 6,
    status: "active",
  },
  {
    id: "pat-4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+20 100 456 7890",
    dateOfBirth: "1992-12-05",
    gender: "female",
    joinedDate: "2025-09-01",
    totalSessions: 15,
    status: "inactive",
  },
  {
    id: "pat-5",
    name: "Mohamed Ali",
    email: "m.ali@example.com",
    phone: "+20 100 567 8901",
    dateOfBirth: "1988-07-18",
    gender: "male",
    joinedDate: "2025-12-01",
    totalSessions: 2,
    status: "active",
  },
]
