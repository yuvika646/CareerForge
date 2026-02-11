"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createJob, CreateJobInput } from "@/actions/jobs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Briefcase, Plus, X, Loader2, Sparkles } from "lucide-react"

interface JobFormProps {
  initialData?: Partial<CreateJobInput>
  jobId?: string
}

export function JobForm({ initialData, jobId }: JobFormProps) {
  const [formData, setFormData] = useState<CreateJobInput>({
    title: initialData?.title || "",
    company: initialData?.company || "",
    description: initialData?.description || "",
    required_skills: initialData?.required_skills || [],
    location: initialData?.location || "",
    salary_range: initialData?.salary_range || "",
    status: initialData?.status || "active",
  })
  const [newSkill, setNewSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const addSkill = () => {
    if (newSkill.trim() && !formData.required_skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        required_skills: [...prev.required_skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      required_skills: prev.required_skills.filter((s) => s !== skill),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Job title is required", variant: "destructive" })
      return
    }
    if (!formData.company.trim()) {
      toast({ title: "Error", description: "Company name is required", variant: "destructive" })
      return
    }
    if (!formData.description.trim()) {
      toast({ title: "Error", description: "Job description is required", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    const result = await createJob(formData)

    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Job Posted!",
      description: "Your job listing has been created successfully.",
    })

    router.push("/recruiter/jobs")
  }

  // Suggested skills based on common tech roles
  const suggestedSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "SQL",
    "AWS",
    "Docker",
    "Git",
    "Agile",
    "Communication",
  ].filter((s) => !formData.required_skills.includes(s))

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., Acme Inc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    placeholder="e.g., $120k - $160k"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={8}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a required skill..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} disabled={!newSkill.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Current skills */}
              <div className="flex flex-wrap gap-2">
                {formData.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 px-3 py-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {formData.required_skills.length === 0 && (
                <p className="text-sm text-gray-500">
                  Add skills that candidates should have for this role.
                </p>
              )}

              {/* Suggested skills */}
              {suggestedSkills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Suggested skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestedSkills.slice(0, 8).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            required_skills: [...prev.required_skills, skill],
                          }))
                        }
                        className="text-xs px-2 py-1 rounded border border-dashed border-gray-300 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview & Submit */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {formData.title || "Job Title"}
                  </h3>
                  <p className="text-gray-600">
                    {formData.company || "Company Name"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {formData.location && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      📍 {formData.location}
                    </span>
                  )}
                  {formData.salary_range && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      💰 {formData.salary_range}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Description</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {formData.description || "No description provided..."}
                  </p>
                </div>

                {formData.required_skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.required_skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Briefcase className="h-4 w-4" />
                  )}
                  {jobId ? "Update Job" : "Post Job"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
