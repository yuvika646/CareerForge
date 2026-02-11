import { getUserProfile } from "@/actions/auth"
import { loadResume } from "@/actions/resume"
import { getActiveJobs } from "@/actions/jobs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, Briefcase, Target, Sparkles, ArrowRight, TrendingUp, MapPin } from "lucide-react"
import Link from "next/link"
import { calculateMatchPercentage } from "@/lib/utils"
import type { Job } from "@/lib/types/database"

export default async function CandidateDashboard() {
  const [profile, resumeResult, jobsResult] = await Promise.all([
    getUserProfile(),
    loadResume(),
    getActiveJobs(),
  ])

  const resume = resumeResult.data
  const jobs: Job[] = jobsResult.data || []
  const userSkills: string[] = profile?.skills || []

  const topMatches = jobs
    .map((job: Job) => {
      const { percentage, matchedSkills } = calculateMatchPercentage(
        userSkills,
        job.required_skills
      )
      return { ...job, matchPercentage: percentage, matchedSkills }
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 4)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wider">{greeting()}</p>
          <h1 className="text-2xl font-semibold text-foreground mt-1">
            {profile?.full_name?.split(" ")[0] || "Welcome"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/candidate/resume">
            <Button variant="outline" size="sm" className="rounded-full gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Resume
            </Button>
          </Link>
          <Link href="/candidate/jobs">
            <Button size="sm" className="rounded-full gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              Find Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ATS Score</p>
              <p className="text-xl font-semibold">{resume?.ats_score || 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Your Skills</p>
              <p className="text-xl font-semibold">{userSkills.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Job Matches</p>
              <p className="text-xl font-semibold">{topMatches.filter(j => j.matchPercentage >= 50).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Open Positions</p>
              <p className="text-xl font-semibold">{jobs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Resume & Skills */}
        <div className="space-y-4">
          {/* Resume Card */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Resume Progress</h3>
                <Link href="/candidate/resume">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                </Link>
              </div>
              {resume ? (
                <div className="space-y-3">
                  <Progress value={resume.ats_score} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>ATS Optimized</span>
                    <span className="font-medium text-foreground">{resume.ats_score}%</span>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Quick tips:</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {resume.ats_score < 70 && <li>• Add more relevant keywords</li>}
                      {resume.ats_score < 85 && <li>• Include measurable achievements</li>}
                      {resume.ats_score >= 85 && <li>• Your resume looks great! ✓</li>}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground mb-3">No resume yet</p>
                  <Link href="/candidate/resume">
                    <Button size="sm" className="rounded-full">Create Resume</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-3">Your Skills</h3>
              {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.slice(0, 8).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs font-normal">
                      {skill}
                    </Badge>
                  ))}
                  {userSkills.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{userSkills.length - 8}
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Add skills to your resume to see matches</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Job Matches */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm">Recommended for you</h3>
                <Link href="/candidate/jobs">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              {topMatches.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {topMatches.map((job) => (
                    <div
                      key={job.id}
                      className="group p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{job.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{job.company}</p>
                        </div>
                        <div className="ml-2 text-right">
                          <span className="text-lg font-semibold text-primary">{job.matchPercentage}%</span>
                          <p className="text-[10px] text-muted-foreground">match</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
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
                      <div className="flex gap-1">
                        {job.matchedSkills.slice(0, 2).map((skill) => (
                          <Badge key={skill} className="text-[10px] bg-primary/10 text-primary border-0">
                            {skill}
                          </Badge>
                        ))}
                        {job.matchedSkills.length > 2 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{job.matchedSkills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No job matches yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Add skills to see personalized recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/candidate/resume" className="group">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">AI Enhancement</h4>
              <p className="text-xs text-muted-foreground">Improve your resume with AI</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>

        <Link href="/candidate/jobs" className="group">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors">
            <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
              <Target className="h-5 w-5 text-background" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">Explore Jobs</h4>
              <p className="text-xs text-muted-foreground">Find your perfect match</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
