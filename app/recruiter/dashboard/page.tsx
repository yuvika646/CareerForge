import { getUserProfile } from "@/actions/auth"
import { getRecruiterJobs } from "@/actions/jobs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, Users, CheckCircle, Clock, ArrowRight, MapPin, Eye } from "lucide-react"
import Link from "next/link"
import type { Job } from "@/lib/types/database"

export default async function RecruiterDashboard() {
  const [profile, jobsResult] = await Promise.all([
    getUserProfile(),
    getRecruiterJobs(),
  ])

  const jobs: Job[] = jobsResult.data || []
  const activeJobs = jobs.filter((job) => job.status === "active")
  const closedJobs = jobs.filter((job) => job.status === "closed")

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider">{greeting()}</p>
          <h1 className="text-2xl font-semibold text-foreground mt-1">
            {profile?.full_name?.split(" ")[0] || "Welcome"}
          </h1>
        </div>
        <Link href="/recruiter/jobs/new">
          <Button size="sm" className="rounded-full gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Post Job
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Jobs</p>
              <p className="text-xl font-semibold">{activeJobs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
              <p className="text-xl font-semibold">{jobs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Closed</p>
              <p className="text-xl font-semibold">{closedJobs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/recruiter/jobs/new" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <Plus className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Post New Job</p>
                      <p className="text-xs text-muted-foreground">Create a job listing</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
                <Link href="/recruiter/jobs" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                      <Eye className="h-4 w-4 text-background" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Manage Jobs</p>
                      <p className="text-xs text-muted-foreground">View all postings</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>


        </div>

        {/* Right Column - Recent Jobs */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm">Recent Job Postings</h3>
                <Link href="/recruiter/jobs">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{job.title}</h4>
                          <Badge
                            variant={job.status === "active" ? "default" : "secondary"}
                            className="text-[10px] shrink-0"
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                          )}
                          {job.salary_range && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {job.salary_range}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">Posted</p>
                        <p className="text-xs font-medium">{formatDate(job.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No job postings yet</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">Create your first job listing to get started</p>
                  <Link href="/recruiter/jobs/new">
                    <Button size="sm" className="rounded-full">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Post Your First Job
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips Section */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Attract More Candidates</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Jobs with detailed descriptions and clear requirements receive 3x more applications. 
                Include salary ranges and benefits to stand out.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
