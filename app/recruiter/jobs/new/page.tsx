import { JobForm } from "@/components/recruiter/job-form"

export default function NewJobPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Post a New Job</h1>
        <p className="text-muted-foreground mt-1">
          Create a job listing to find the perfect candidate
        </p>
      </div>

      <JobForm />
    </div>
  )
}
