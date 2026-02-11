import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Briefcase } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

// Floating Lines Background Component
function FloatingLines() {
  const lines = [
    { width: '200px', top: '10%', left: '5%', rotation: '15deg', duration: '8s', delay: '0s' },
    { width: '150px', top: '20%', right: '10%', rotation: '-10deg', duration: '10s', delay: '1s' },
    { width: '180px', top: '35%', left: '15%', rotation: '25deg', duration: '12s', delay: '2s' },
    { width: '220px', top: '50%', right: '5%', rotation: '-20deg', duration: '9s', delay: '0.5s' },
    { width: '160px', top: '65%', left: '8%', rotation: '10deg', duration: '11s', delay: '1.5s' },
    { width: '190px', top: '80%', right: '15%', rotation: '-15deg', duration: '8s', delay: '2.5s' },
    { width: '140px', top: '45%', left: '50%', rotation: '30deg', duration: '13s', delay: '3s' },
    { width: '170px', top: '25%', left: '70%', rotation: '-25deg', duration: '10s', delay: '0.8s' },
  ]

  const verticalLines = [
    { height: '150px', top: '5%', left: '20%', rotation: '5deg', duration: '14s', delay: '0s' },
    { height: '200px', top: '30%', right: '25%', rotation: '-8deg', duration: '16s', delay: '2s' },
    { height: '180px', top: '60%', left: '80%', rotation: '12deg', duration: '12s', delay: '1s' },
    { height: '160px', top: '15%', right: '60%', rotation: '-5deg', duration: '15s', delay: '3s' },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {lines.map((line, i) => (
        <div
          key={`h-${i}`}
          className="floating-line"
          style={{
            width: line.width,
            top: line.top,
            left: line.left,
            right: line.right,
            '--rotation': line.rotation,
            '--duration': line.duration,
            '--delay': line.delay,
          } as React.CSSProperties}
        />
      ))}
      {verticalLines.map((line, i) => (
        <div
          key={`v-${i}`}
          className="floating-line-vertical"
          style={{
            height: line.height,
            top: line.top,
            left: line.left,
            right: line.right,
            '--rotation': line.rotation,
            '--duration': line.duration,
            '--delay': line.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userRole: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = (profile as { role: string } | null)?.role || null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background relative">
      <FloatingLines />
      
      {/* Navigation */}
      <nav className="sticky top-4 z-50 mx-4 md:mx-8 lg:mx-auto lg:max-w-5xl">
        <div className="bg-background/90 backdrop-blur-md border border-border/50 rounded-full px-6 py-3 flex justify-between items-center shadow-lg">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">
              <span className="text-foreground">Career</span>
              <span className="text-primary">Forge</span>
            </span>
          </Link>
          <div className="flex gap-2 items-center">
            {user ? (
              <>
                <Link href={userRole === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}>
                  <Button variant="ghost" className="rounded-full">Dashboard</Button>
                </Link>
                <form action={async () => {
                  'use server'
                  const supabase = await createClient()
                  await supabase.auth.signOut()
                }}>
                  <Button type="submit" variant="outline" className="rounded-full">Logout</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
          Build Your Career with
          <span className="text-primary block">AI-Powered Precision</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Create professional resumes, match with perfect job opportunities, and
          land your dream job with CareerForge&apos;s intelligent platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2 rounded-full">
              <FileText className="h-5 w-5" />
              Build Your Resume
            </Button>
          </Link>
          <Link href="/signup?role=recruiter">
            <Button size="lg" variant="outline" className="gap-2 rounded-full">
              <Briefcase className="h-5 w-5" />
              Post a Job
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">What we offer</p>
        <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
          Everything You Need to Succeed
        </h2>
        <p className="text-muted-foreground text-center max-w-lg mx-auto mb-14 text-sm">
          Four powerful tools, one platform. Built to give you an unfair advantage in your job search.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div tabIndex={0} className="feature-card group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-2">Smart Resume Builder</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create professional resumes with an intuitive builder and real-time PDF preview.
            </p>
          </div>

          <div tabIndex={0} className="feature-card group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-2">AI Enhancement</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Let AI polish your descriptions and suggest improvements for maximum impact.
            </p>
          </div>

          <div tabIndex={0} className="feature-card group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-2">ATS Scoring</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get real-time ATS compatibility scores to ensure your resume passes screening systems.
            </p>
          </div>

          <div tabIndex={0} className="feature-card group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-foreground mb-2">Job Matching</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find perfect job matches based on your skills with an intelligent matching algorithm.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Take Your Career to the Next Level?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who have already transformed their
              job search with CareerForge.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="font-semibold">
                Get Started for Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-background/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 CareerForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
