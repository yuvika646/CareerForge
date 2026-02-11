"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Profile } from "@/lib/types/database"
import { 
  FileText, 
  Briefcase, 
  LayoutDashboard, 
  LogOut,
  User,
  ChevronDown,
  Menu,
  Columns3
} from "lucide-react"
import { useState } from "react"

interface CandidateNavProps {
  profile: Profile
}

export function CandidateNav({ profile }: CandidateNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/candidate/resume", label: "Resume Builder", icon: FileText },
    { href: "/candidate/jobs", label: "Find Jobs", icon: Briefcase },
    { href: "/candidate/tracker", label: "Job Tracker", icon: Columns3 },
  ]

  return (
    <nav className="bg-smoky-black sticky top-0 z-50 shadow-lg border-b border-border/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/candidate/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-olive-drab to-olive-drab/70 flex items-center justify-center shadow-lg shadow-olive-drab/25 group-hover:shadow-olive-drab/40 transition-shadow">
                <span className="text-floral-white font-bold text-lg">C</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-olive-drab rounded-full border-2 border-smoky-black"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">
                <span className="text-floral-white">Career</span>
                <span className="text-olive-drab">Forge</span>
              </span>
              <span className="text-[10px] text-bone/60 -mt-1 tracking-wider uppercase">Build Your Future</span>
            </div>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-olive-drab/20 text-floral-white"
                        : "text-bone/70 hover:text-floral-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-olive-drab" : ""}`} />
                    {item.label}
                  </button>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-olive-drab to-olive-drab/70 flex items-center justify-center text-floral-white font-semibold text-sm">
                {(profile.full_name || profile.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-floral-white truncate max-w-[120px]">
                  {profile.full_name || "Candidate"}
                </span>
                <span className="text-[10px] text-bone/60">Candidate</span>
              </div>
              <ChevronDown className="h-4 w-4 text-bone/60" />
            </div>
            <form action={signOut}>
              <Button 
                variant="ghost" 
                size="icon" 
                type="submit"
                className="text-bone/60 hover:text-floral-white hover:bg-white/10 rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-bone/60 hover:text-floral-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-3">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-olive-drab/20 text-floral-white"
                          : "text-bone/70 hover:bg-white/5 hover:text-floral-white"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? "text-olive-drab" : ""}`} />
                      {item.label}
                    </button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
