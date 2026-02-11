"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, User, Briefcase } from "lucide-react"

function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"candidate" | "recruiter">("candidate")
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if role is specified in URL
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
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Join CareerForge and start your journey
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("candidate")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === "candidate"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className={`h-6 w-6 mx-auto mb-2 ${
                  selectedRole === "candidate" ? "text-primary" : "text-gray-400"
                }`} />
                <p className={`font-medium ${
                  selectedRole === "candidate" ? "text-primary" : "text-gray-600"
                }`}>
                  Job Seeker
                </p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("recruiter")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === "recruiter"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Briefcase className={`h-6 w-6 mx-auto mb-2 ${
                  selectedRole === "recruiter" ? "text-primary" : "text-gray-400"
                }`} />
                <p className={`font-medium ${
                  selectedRole === "recruiter" ? "text-primary" : "text-gray-600"
                }`}>
                  Recruiter
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      }>
        <SignupForm />
      </Suspense>
    </div>
  )
}
