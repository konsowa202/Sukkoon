"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { Loader2, UserCircle, Stethoscope } from "lucide-react"
import { useSearchParams } from "next/navigation"

function SignupPageContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") === "doctor" ? "doctor" : "patient"
  const [selectedRole, setSelectedRole] = useState<"doctor" | "patient">(defaultRole)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    const success = await register(email, password, name, selectedRole, phone)

    if (!success) {
      setError("Email already exists. Please use a different email or login.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image
              src="/images/whatsapp-20image-202025-12-03-20at-201.jpeg"
              alt="Sukoon Logo"
              width={300}
              height={96}
              className="h-28 w-auto dark:invert-0 invert"
            />
          </div>
          <CardTitle className="text-2xl">{t("auth.register")}</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as "doctor" | "patient")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="patient" className="gap-2">
                <UserCircle className="w-4 h-4" />
                {t("auth.patient")}
              </TabsTrigger>
              <TabsTrigger value="doctor" className="gap-2">
                <Stethoscope className="w-4 h-4" />
                {t("auth.doctor")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("auth.fullName")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("auth.phone") || "Phone Number"}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("auth.register")}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t("auth.hasAccount")}{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    {t("auth.submit")}
                  </Link>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="doctor">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">{t("auth.fullName")}</Label>
                  <Input
                    id="doctorName"
                    type="text"
                    placeholder="Dr. Sarah Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorPhone">{t("auth.phone") || "Phone Number"}</Label>
                  <Input
                    id="doctorPhone"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorEmail">{t("auth.email")}</Label>
                  <Input
                    id="doctorEmail"
                    type="email"
                    placeholder="doctor@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorPassword">{t("auth.password")}</Label>
                  <Input
                    id="doctorPassword"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorConfirmPassword">{t("auth.confirmPassword")}</Label>
                  <Input
                    id="doctorConfirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
                  <p className="font-semibold text-foreground">Doctor Registration:</p>
                  <p className="text-muted-foreground">
                    Your application will be reviewed by our admin team before activation
                  </p>
                </div>

                {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("auth.register")}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t("auth.hasAccount")}{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    {t("auth.submit")}
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  )
}
