import { getRecruiterJobs } from "@/actions/jobs"
import { RecruiterJobList } from "@/components/recruiter/job-list"

export default async function RecruiterJobsPage() {
  const { data: jobs, error } = await getRecruiterJobs()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
        <p className="text-gray-600 mt-1">
          Manage all your job listings
        </p>
      </div>

      <RecruiterJobList jobs={jobs || []} />
    </div>
  )
}
