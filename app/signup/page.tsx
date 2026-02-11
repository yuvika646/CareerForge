"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowRight, User, Briefcase } from "lucide-react"

function AuthBackground() {
  return (
    <div className="fixed inset-0 auth-bg -z-10">
      {/* Morphing blobs */}
      <div
        className="auth-blob w-[500px] h-[500px] bg-primary/20 -top-40 -left-40"
        style={{ "--duration": "20s", "--delay": "0s" } as React.CSSProperties}
      />
      <div
        className="auth-blob w-[400px] h-[400px] bg-secondary/40 bottom-[-80px] right-[-80px]"
        style={{ "--duration": "24s", "--delay": "2s" } as React.CSSProperties}
      />
      <div
        className="auth-blob w-[350px] h-[350px] bg-primary/10 top-1/2 right-1/3"
        style={{ "--duration": "22s", "--delay": "5s" } as React.CSSProperties}
      />

      {/* Floating circles */}
      <div
        className="auth-float-circle w-3 h-3 top-[20%] right-[12%]"
        style={{ "--duration": "6s", "--delay": "0s" } as React.CSSProperties}
      />
      <div
        className="auth-float-circle w-2 h-2 top-[35%] left-[18%]"
        style={{ "--duration": "8s", "--delay": "1.5s" } as React.CSSProperties}
      />
      <div
        className="auth-float-circle w-4 h-4 bottom-[25%] right-[22%]"
        style={{ "--duration": "5s", "--delay": "0.5s" } as React.CSSProperties}
      />
      <div
        className="auth-float-circle w-2 h-2 top-[55%] left-[8%]"
        style={{ "--duration": "7s", "--delay": "3s" } as React.CSSProperties}
      />
      <div
        className="auth-float-circle w-1.5 h-1.5 bottom-[40%] right-[40%]"
        style={{ "--duration": "6.5s", "--delay": "2s" } as React.CSSProperties}
      />

      {/* Pulse rings */}
      <div
        className="auth-pulse-ring w-48 h-48 top-[8%] left-[15%]"
        style={{ "--duration": "6s", "--delay": "1s" } as React.CSSProperties}
      />
      <div
        className="auth-pulse-ring w-56 h-56 bottom-[10%] left-[25%]"
        style={{ "--duration": "8s", "--delay": "3s" } as React.CSSProperties}
      />

      {/* Shimmer line */}
      <div className="absolute top-1/3 left-0 right-0 h-px auth-shimmer" />
    </div>
  )
}

function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"candidate" | "recruiter">("candidate")
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const roleFromUrl = searchParams.get("role")
  if (roleFromUrl === "recruiter" && selectedRole !== "recruiter") {
    setSelectedRole("recruiter")
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    formData.set("role", selectedRole)

    const result = await signUp(formData)

    if (result.error) {
      toast({
        title: "Signup Failed",
        description: result.error,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    toast({
      title: "Account Created!",
      description: "Please check your email to verify your account.",
    })

    router.push("/login")
  }

  return (
    <div className="w-full max-w-sm relative z-10">
      {/* Logo / Brand */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-foreground">Career</span>
            <span className="text-primary">Forge</span>
          </h1>
        </Link>
        <p className="text-muted-foreground text-xs mt-2">Create your account and start building</p>
      </div>

      {/* Card */}
      <div className="auth-card rounded-2xl p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">Create Account</h2>
          <p className="text-xs text-muted-foreground mt-1">Choose your role and fill in the details</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">I am a</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("candidate")}
                className={`relative p-3.5 rounded-xl border transition-all duration-300 group ${
                  selectedRole === "candidate"
                    ? "border-primary bg-primary/8 shadow-sm"
                    : "border-border/60 bg-background/40 hover:border-border hover:bg-background/60"
                }`}
              >
                <div className={`h-8 w-8 rounded-lg mx-auto mb-2 flex items-center justify-center transition-colors ${
                  selectedRole === "candidate"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                }`}>
                  <User className="h-4 w-4" />
                </div>
                <p className={`text-xs font-medium transition-colors ${
                  selectedRole === "candidate" ? "text-foreground" : "text-muted-foreground"
                }`}>
                  Job Seeker
                </p>
                {selectedRole === "candidate" && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("recruiter")}
                className={`relative p-3.5 rounded-xl border transition-all duration-300 group ${
                  selectedRole === "recruiter"
                    ? "border-primary bg-primary/8 shadow-sm"
                    : "border-border/60 bg-background/40 hover:border-border hover:bg-background/60"
                }`}
              >
                <div className={`h-8 w-8 rounded-lg mx-auto mb-2 flex items-center justify-center transition-colors ${
                  selectedRole === "recruiter"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                }`}>
                  <Briefcase className="h-4 w-4" />
                </div>
                <p className={`text-xs font-medium transition-colors ${
                  selectedRole === "recruiter" ? "text-foreground" : "text-muted-foreground"
                }`}>
                  Recruiter
                </p>
                {selectedRole === "recruiter" && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-medium">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Jane Doe"
              required
              className="h-10 rounded-xl bg-background/60 border-border/60 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-10 rounded-xl bg-background/60 border-border/60 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength={6}
              required
              className="h-10 rounded-xl bg-background/60 border-border/60 focus:bg-background transition-colors"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 rounded-xl font-medium gap-2 mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium hover:text-primary transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-muted-foreground/60 mt-6">
        By creating an account, you agree to our Terms of Service
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AuthBackground />
      <Suspense fallback={
        <div className="w-full max-w-sm auth-card rounded-2xl p-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  )
}
