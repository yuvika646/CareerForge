import { JobForm } from "@/components/recruiter/job-form"

export default function NewJobPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-600 mt-1">
          Create a job listing to find the perfect candidate
        </p>
      </div>

      <JobForm />
    </div>
  )
}
