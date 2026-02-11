import { loadResume } from "@/actions/resume"
import { ResumeBuilder } from "@/components/candidate/resume-builder"

export default async function ResumePage() {
  const { data: resume, error } = await loadResume()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
        <p className="text-gray-600 mt-1">
          Create and customize your professional resume
        </p>
      </div>
      
      <ResumeBuilder initialResume={resume} />
    </div>
  )
}
