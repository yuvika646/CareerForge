"use client"

import { useState } from "react"
import { Job } from "@/lib/types/database"
import { toggleJobStatus, deleteJob } from "@/actions/jobs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  DollarSign,
  Calendar,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface RecruiterJobListProps {
  jobs: Job[]
}

export function RecruiterJobList({ jobs }: RecruiterJobListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [deletingJob, setDeletingJob] = useState<string | null>(null)
  const { toast } = useToast()

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    setLoadingStates((prev) => ({ ...prev, [jobId]: true }))
    
    const newStatus = currentStatus === "active" ? "closed" : "active"
    const result = await toggleJobStatus(jobId, newStatus)

    setLoadingStates((prev) => ({ ...prev, [jobId]: false }))

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Job Updated",
      description: `Job is now ${newStatus}`,
    })
  }

  const handleDelete = async (jobId: string) => {
    setDeletingJob(jobId)
    
    const result = await deleteJob(jobId)

    setDeletingJob(null)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Job Deleted",
      description: "The job posting has been removed",
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          <span className="font-medium">{jobs.length}</span> job{jobs.length !== 1 ? "s" : ""} posted
        </p>
        <Link href="/recruiter/jobs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Job List */}
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <Badge
                        variant={job.status === "active" ? "success" : "secondary"}
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{job.company}</p>

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
                        Posted {formatDate(job.created_at)}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {job.required_skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(job.id, job.status)}
                      disabled={loadingStates[job.id]}
                      className="gap-2"
                    >
                      {loadingStates[job.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : job.status === "active" ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                      {job.status === "active" ? "Close" : "Reopen"}
                    </Button>

                    <Link href={`/recruiter/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-2 w-full">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Job Posting</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete &quot;{job.title}&quot;? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(job.id)}
                            disabled={deletingJob === job.id}
                          >
                            {deletingJob === job.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="font-semibold text-lg mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first job posting to start finding candidates
            </p>
            <Link href="/recruiter/jobs/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Post Your First Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
