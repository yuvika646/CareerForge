"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowRight } from "lucide-react"

function AuthBackground() {
  return (
    <div className="fixed inset-0 auth-bg -z-10">
      {/* Morphing blobs */}
      <div
        className="auth-blob w-[500px] h-[500px] bg-primary/20 -top-40 -right-40"
        style={{ "--duration": "22s", "--delay": "0s" } as React.CSSProperties}
      />
      <div
        className="auth-blob w-[400px] h-[400px] bg-secondary/40 bottom-[-100px] left-[-100px]"
        style={{ "--duration": "18s", "--delay": "3s" } as React.CSSProperties}
      />
      <div
        className="auth-blob w-[300px] h-[300px] bg-primary/15 top-1/3 left-1/4"
        style={{ "--duration": "25s", "--delay": "6s" } as React.CSSProperties}
      />

      {/* Floating circles */}
      <div
        className="auth-float-circle w-3 h-3 top-[15%] left-[10%]"
        style={{ "--duration": "5s", "--delay": "0s" } as React.CSSProperties}
      />
      <div
        className="auth-float-circle w-2 h-2 top-[25%] right-[15%]"
        style={{ "--duration": "7s", "--delay": "1s" } as React.CSSProperties}
      />
      <div
        className="auth-float-circle w-4 h-4 bottom-[20%] left-[20%]"
        style={{ "--duration": "6s", "--delay": "2s" } as React.CSSProperties}
      />
      <div
        className="auth-float-circle w-2.5 h-2.5 top-[60%] right-[25%]"
        style={{ "--duration": "8s", "--delay": "0.5s" } as React.CSSProperties}
      />
      <div
        className="auth-float-circle w-1.5 h-1.5 top-[40%] left-[60%]"
        style={{ "--duration": "5.5s", "--delay": "3s" } as React.CSSProperties}
      />

      {/* Pulse rings */}
      <div
        className="auth-pulse-ring w-40 h-40 top-[10%] right-[20%]"
        style={{ "--duration": "5s", "--delay": "0s" } as React.CSSProperties}
      />
      <div
        className="auth-pulse-ring w-60 h-60 bottom-[15%] right-[10%]"
        style={{ "--duration": "7s", "--delay": "2s" } as React.CSSProperties}
      />

      {/* Shimmer line */}
      <div className="absolute top-1/2 left-0 right-0 h-px auth-shimmer" />
    </div>
  )
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    const result = await signIn(formData)

    if (result.error) {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    })

    router.push(result.redirectTo || "/candidate/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AuthBackground />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">Career</span>
              <span className="text-primary">Forge</span>
            </h1>
          </Link>
          <p className="text-muted-foreground text-xs mt-2">Welcome back — pick up where you left off</p>
        </div>

        {/* Card */}
        <div className="auth-card rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Sign in</h2>
            <p className="text-xs text-muted-foreground mt-1">Enter your credentials to continue</p>
          </div>

          <form action={handleSubmit} className="space-y-4">
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
                  Sign In
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-foreground font-medium hover:text-primary transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/60 mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
