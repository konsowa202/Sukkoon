"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Languages, User, LogOut, Menu, Star, Heart } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface HeaderNavProps {
  showAuth?: boolean
}

export function HeaderNav({ showAuth = true }: HeaderNavProps) {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  const { user, logout } = useAuth()

  const getDashboardPath = () => {
    if (!user) return "/login"
    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "doctor":
        return "/doctor/dashboard"
      case "patient":
        return "/patient/dashboard"
      default:
        return "/login"
    }
  }

  const getProfilePath = () => {
    if (!user) return "/login"
    switch (user.role) {
      case "doctor":
        return "/doctor/profile"
      case "patient":
        return "/patient/profile"
      default:
        return "/login"
    }
  }

  const NavLinks = () => (
    <>
      <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
        {t("nav.features")}
      </Link>
      <Link href="/library" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
        {t("nav.library")}
      </Link>
      <Link href="/#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
        {t("nav.about")}
      </Link>
      <Link href="/donate" className="text-sm font-medium text-primary hover:text-primary/80 transition flex items-center gap-1">
        <Heart className="w-4 h-4" />
        {t("nav.donate")}
      </Link>
      <Button asChild variant="outline" className="w-full md:w-auto">
        <Link href="/patient/search">{t("nav.findDoctor")}</Link>
      </Button>
    </>
  )

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/whatsapp-20image-202025-12-03-20at-201.jpeg"
            alt="Sukoon Logo"
            width={240}
            height={72}
            className="h-16 md:h-20 w-auto dark:invert-0 invert transition-all"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardPath()} className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {(user.role === "doctor" || user.role === "patient") && (
                  <DropdownMenuItem asChild>
                    <Link href={getProfilePath()} className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            showAuth && (
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                {t("nav.login")}
              </Link>
            )
          )}

          <div className="flex items-center border-l pl-4 gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Languages className="w-4 h-4" />
              <span className="sr-only">{language === "en" ? "العربية" : "English"}</span>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
              <SheetHeader className="p-6 text-left border-b bg-card rounded-t-xl">
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/images/whatsapp-20image-202025-12-03-20at-201.jpeg"
                    alt="Sukoon Logo"
                    width={200}
                    height={60}
                    className="h-14 w-auto dark:invert-0 invert"
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-6">
                <div className="px-6 space-y-6">
                  {/* Primary Nav */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Explore</p>
                    <Link href="/#features" className="flex items-center gap-3 text-base font-medium p-2 -mx-2 rounded-lg hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <Star className="w-4 h-4" />
                      </div>
                      {t("nav.features")}
                    </Link>
                    <Link href="/library" className="flex items-center gap-3 text-base font-medium p-2 -mx-2 rounded-lg hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <Star className="w-4 h-4" />
                      </div>
                      {t("nav.library")}
                    </Link>
                    <Link href="/#about" className="flex items-center gap-3 text-base font-medium p-2 -mx-2 rounded-lg hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      {t("nav.about")}
                    </Link>
                    <Link href="/donate" className="flex items-center gap-3 text-base font-medium p-2 -mx-2 rounded-lg hover:bg-accent transition-colors text-primary">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <Heart className="w-4 h-4" />
                      </div>
                      {t("nav.donate")}
                    </Link>
                    <Link href="/patient/search" className="flex items-center gap-3 text-base font-medium p-2 -mx-2 rounded-lg hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <Languages className="w-4 h-4" />
                      </div>
                      {t("nav.findDoctor")}
                    </Link>
                  </div>

                  <DropdownMenuSeparator className="opacity-50" />

                  {/* User Section */}
                  {user ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">My Account</p>
                      <Link href={getDashboardPath()} className="flex items-center gap-3 text-base font-medium p-2 -mx-2 rounded-lg hover:bg-accent transition-colors">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-4 h-4" />
                        </div>
                        Dashboard
                      </Link>
                      {(user.role === "doctor" || user.role === "patient") && (
                        <Link href={getProfilePath()} className="flex items-center gap-3 text-base font-medium p-2 -mx-2 rounded-lg hover:bg-accent transition-colors">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-4 h-4" />
                          </div>
                          Profile
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 p-2 -mx-2 h-auto text-base font-medium rounded-lg"
                        onClick={logout}
                      >
                        <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center text-red-600 mr-3">
                          <LogOut className="w-4 h-4" />
                        </div>
                        Logout
                      </Button>
                    </div>
                  ) : (
                    showAuth && (
                      <div className="space-y-3 pt-2">
                        <Button asChild className="w-full">
                          <Link href="/login">{t("nav.login")}</Link>
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="p-6 border-t bg-muted/30 space-y-3">
                <Button variant="outline" className="w-full justify-between" onClick={toggleTheme}>
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground uppercase">{theme}</span>
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={toggleLanguage}>
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <span>{language === "en" ? "Arabi (العربية)" : "English"}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{language === "en" ? "AR" : "EN"}</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
