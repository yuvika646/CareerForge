"use client"

import { useState, useMemo } from "react"
import { Job, JobWithMatch } from "@/lib/types/database"
import { calculateMatchPercentage } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Search, 
  Filter, 
  ChevronDown,
  Target,
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface JobListProps {
  jobs: Job[]
  userSkills: string[]
}

export function JobList({ jobs, userSkills }: JobListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"match" | "date">("match")
  const [minMatchPercent, setMinMatchPercent] = useState(0)

  // Calculate matches for all jobs
  const jobsWithMatch: JobWithMatch[] = useMemo(() => {
    return jobs.map((job) => {
      const { percentage, matchedSkills } = calculateMatchPercentage(
        userSkills,
        job.required_skills
      )
      return { ...job, matchPercentage: percentage, matchedSkills }
    })
  }, [jobs, userSkills])

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = jobsWithMatch

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.required_skills.some((s) => s.toLowerCase().includes(query))
      )
    }

    // Match percentage filter
    if (minMatchPercent > 0) {
      result = result.filter((job) => job.matchPercentage >= minMatchPercent)
    }

    // Sort
    if (sortBy === "match") {
      result.sort((a, b) => b.matchPercentage - a.matchPercentage)
    } else {
      result.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }

    return result
  }, [jobsWithMatch, searchQuery, minMatchPercent, sortBy])

  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-gray-500"
  }

  const getMatchBadge = (percentage: number) => {
    if (percentage >= 70) return "success"
    if (percentage >= 50) return "warning"
    return "secondary"
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "match" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("match")}
                className="gap-2"
              >
                <Target className="h-4 w-4" />
                Best Match
              </Button>
              <Button
                variant={sortBy === "date" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("date")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Recent
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-gray-600">Minimum match:</span>
            <div className="flex gap-2">
              {[0, 25, 50, 75].map((value) => (
                <Button
                  key={value}
                  variant={minMatchPercent === value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMinMatchPercent(value)}
                >
                  {value}%+
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Found <span className="font-medium">{filteredJobs.length}</span> jobs
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        {userSkills.length === 0 && (
          <Badge variant="outline" className="gap-1">
            <Filter className="h-3 w-3" />
            Add skills to your profile for better matching
          </Badge>
        )}
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getMatchColor(job.matchPercentage)}`}>
                        {job.matchPercentage}%
                      </div>
                      <p className="text-xs text-gray-500">Match</p>
                    </div>
                  </div>

                  {/* Job details */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    )}
                    {job.salary_range && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary_range}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(job.created_at)}
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                    {job.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {job.required_skills.slice(0, 6).map((skill) => {
                      const isMatched = job.matchedSkills.includes(skill)
                      return (
                        <Badge
                          key={skill}
                          variant={isMatched ? "success" : "outline"}
                          className="text-xs gap-1"
                        >
                          {isMatched && <CheckCircle className="h-3 w-3" />}
                          {skill}
                        </Badge>
                      )
                    })}
                    {job.required_skills.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.required_skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{job.title}</DialogTitle>
                        <DialogDescription>
                          {job.company}
                          {job.location && ` • ${job.location}`}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Match Score */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Your Match Score</span>
                            <span className={`text-xl font-bold ${getMatchColor(job.matchPercentage)}`}>
                              {job.matchPercentage}%
                            </span>
                          </div>
                          <Progress value={job.matchPercentage} className="h-2" />
                        </div>

                        {/* Job Details */}
                        <div>
                          <h4 className="font-medium mb-2">Job Description</h4>
                          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                        </div>

                        {job.salary_range && (
                          <div>
                            <h4 className="font-medium mb-2">Salary Range</h4>
                            <p className="text-gray-700">{job.salary_range}</p>
                          </div>
                        )}

                        {/* Skills Analysis */}
                        <div>
                          <h4 className="font-medium mb-2">Required Skills</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Skills you have ({job.matchedSkills.length}/{job.required_skills.length})
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {job.matchedSkills.map((skill) => (
                                  <Badge key={skill} variant="success" className="gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {skill}
                                  </Badge>
                                ))}
                                {job.matchedSkills.length === 0 && (
                                  <span className="text-gray-400 text-sm">None matched</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Skills to develop</p>
                              <div className="flex flex-wrap gap-1">
                                {job.required_skills
                                  .filter((s) => !job.matchedSkills.includes(s))
                                  .map((skill) => (
                                    <Badge key={skill} variant="outline" className="gap-1">
                                      <XCircle className="h-3 w-3 text-gray-400" />
                                      {skill}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button className="flex-1">Apply Now</Button>
                          <Button variant="outline">Save Job</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button>Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="font-semibold text-lg mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `No jobs match your search for "${searchQuery}"`
                : "There are no jobs available at the moment."}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
