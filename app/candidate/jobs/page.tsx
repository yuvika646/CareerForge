import { getUserProfile } from "@/actions/auth"
import { getActiveJobs } from "@/actions/jobs"
import { JobList } from "@/components/candidate/job-list"

export default async function JobsPage() {
  const [profile, jobsResult] = await Promise.all([
    getUserProfile(),
    getActiveJobs(),
  ])

  const jobs = jobsResult.data || []
  const userSkills = profile?.skills || []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
        <p className="text-gray-600 mt-1">
          Discover opportunities that match your skills
        </p>
      </div>

      <JobList jobs={jobs} userSkills={userSkills} />
    </div>
  )
}
