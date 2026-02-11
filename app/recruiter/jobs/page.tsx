import { getRecruiterJobs } from "@/actions/jobs"
import { RecruiterJobList } from "@/components/recruiter/job-list"

export default async function RecruiterJobsPage() {
  const { data: jobs, error } = await getRecruiterJobs()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">My Job Postings</h1>
        <p className="text-muted-foreground mt-1">
          Manage all your job listings
        </p>
      </div>

      <RecruiterJobList jobs={jobs || []} />
    </div>
  )
}
