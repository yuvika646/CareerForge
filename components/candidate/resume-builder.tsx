"use client"

import { useState, useCallback } from "react"
import { ResumeContent, Resume } from "@/lib/types/database"
import { defaultResumeContent } from "@/lib/resume-defaults"
import { saveResume } from "@/actions/resume"
import { enhanceDescription } from "@/actions/ai"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { generateId } from "@/lib/utils"
import { 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  Loader2, 
  User, 
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  FolderKanban,
  FileText,
  X
} from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import for PDF preview (client-side only)
const ResumePDFPreview = dynamic<{ content: ResumeContent }>(
  () => import("@/components/candidate/resume-pdf-preview").then((mod) => mod.ResumePDFPreview),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div> }
)

interface ResumeBuilderProps {
  initialResume: {
    id: string
    user_id: string
    content: unknown
    ats_score: number
    created_at: string
    updated_at: string
  } | null
}

export function ResumeBuilder({ initialResume }: ResumeBuilderProps) {
  const [content, setContent] = useState<ResumeContent>(
    (initialResume?.content as unknown as ResumeContent) || defaultResumeContent
  )
  const [atsScore, setAtsScore] = useState(initialResume?.ats_score || 0)
  const [isSaving, setIsSaving] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState("")
  const { toast } = useToast()

  // Update content helper
  const updateContent = useCallback((updates: Partial<ResumeContent>) => {
    setContent((prev) => ({ ...prev, ...updates }))
  }, [])

  // Save resume
  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveResume(content)
    setIsSaving(false)

    if (result.error) {
      toast({
        title: "Save Failed",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    if (result.atsScore !== undefined) {
      setAtsScore(result.atsScore)
    }

    toast({
      title: "Resume Saved!",
      description: `Your resume has been saved. ATS Score: ${result.atsScore}%`,
    })
  }

  // AI Enhancement
  const handleEnhance = async (text: string, type: 'experience' | 'summary' | 'project', callback: (enhanced: string) => void) => {
    if (!text.trim()) return

    setIsEnhancing(type)
    const result = await enhanceDescription(text, type)
    setIsEnhancing(null)

    if (result.error) {
      toast({
        title: "Enhancement Failed",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    if (result.data) {
      callback(result.data)
      toast({
        title: "Enhanced!",
        description: "Your text has been improved by AI.",
      })
    }
  }

  // Add skill
  const addSkill = () => {
    if (newSkill.trim() && !content.skills.includes(newSkill.trim())) {
      updateContent({ skills: [...content.skills, newSkill.trim()] })
      setNewSkill("")
    }
  }

  // Remove skill
  const removeSkill = (skill: string) => {
    updateContent({ skills: content.skills.filter((s) => s !== skill) })
  }

  // Add experience
  const addExperience = () => {
    updateContent({
      experience: [
        ...content.experience,
        {
          id: generateId(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    })
  }

  // Update experience
  const updateExperience = (id: string, updates: Partial<typeof content.experience[0]>) => {
    updateContent({
      experience: content.experience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    })
  }

  // Remove experience
  const removeExperience = (id: string) => {
    updateContent({
      experience: content.experience.filter((exp) => exp.id !== id),
    })
  }

  // Add education
  const addEducation = () => {
    updateContent({
      education: [
        ...content.education,
        {
          id: generateId(),
          degree: "",
          school: "",
          location: "",
          graduationDate: "",
          gpa: "",
        },
      ],
    })
  }

  // Update education
  const updateEducation = (id: string, updates: Partial<typeof content.education[0]>) => {
    updateContent({
      education: content.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    })
  }

  // Remove education
  const removeEducation = (id: string) => {
    updateContent({
      education: content.education.filter((edu) => edu.id !== id),
    })
  }

  // Add project
  const addProject = () => {
    updateContent({
      projects: [
        ...content.projects,
        {
          id: generateId(),
          name: "",
          description: "",
          technologies: [],
          link: "",
        },
      ],
    })
  }

  // Update project
  const updateProject = (id: string, updates: Partial<typeof content.projects[0]>) => {
    updateContent({
      projects: content.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      ),
    })
  }

  // Remove project
  const removeProject = (id: string) => {
    updateContent({
      projects: content.projects.filter((proj) => proj.id !== id),
    })
  }

  // Add certification
  const addCertification = () => {
    updateContent({
      certifications: [
        ...content.certifications,
        {
          id: generateId(),
          name: "",
          issuer: "",
          date: "",
        },
      ],
    })
  }

  // Update certification
  const updateCertification = (id: string, updates: Partial<typeof content.certifications[0]>) => {
    updateContent({
      certifications: content.certifications.map((cert) =>
        cert.id === id ? { ...cert, ...updates } : cert
      ),
    })
  }

  // Remove certification
  const removeCertification = (id: string) => {
    updateContent({
      certifications: content.certifications.filter((cert) => cert.id !== id),
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Editor Section */}
      <div className="space-y-6">
        {/* ATS Score & Save */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">ATS Score</span>
                  <span className={atsScore >= 70 ? "text-green-600" : atsScore >= 50 ? "text-yellow-600" : "text-red-600"}>
                    {atsScore}%
                  </span>
                </div>
                <Progress value={atsScore} className="h-2" />
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Tabs */}
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="personal" className="gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="gap-1">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Work</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-1">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Edu</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-1">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-1">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="certs" className="gap-1">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Certs</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={content.personalInfo.fullName}
                      onChange={(e) =>
                        updateContent({
                          personalInfo: { ...content.personalInfo, fullName: e.target.value },
                        })
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={content.personalInfo.email}
                      onChange={(e) =>
                        updateContent({
                          personalInfo: { ...content.personalInfo, email: e.target.value },
                        })
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={content.personalInfo.phone}
                      onChange={(e) =>
                        updateContent({
                          personalInfo: { ...content.personalInfo, phone: e.target.value },
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={content.personalInfo.location}
                      onChange={(e) =>
                        updateContent({
                          personalInfo: { ...content.personalInfo, location: e.target.value },
                        })
                      }
                      placeholder="New York, NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={content.personalInfo.linkedin}
                      onChange={(e) =>
                        updateContent({
                          personalInfo: { ...content.personalInfo, linkedin: e.target.value },
                        })
                      }
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={content.personalInfo.website}
                      onChange={(e) =>
                        updateContent({
                          personalInfo: { ...content.personalInfo, website: e.target.value },
                        })
                      }
                      placeholder="johndoe.com"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleEnhance(content.summary, "summary", (enhanced) =>
                          updateContent({ summary: enhanced })
                        )
                      }
                      disabled={isEnhancing === "summary" || !content.summary}
                      className="gap-1 text-purple-600 hover:text-purple-700"
                    >
                      {isEnhancing === "summary" ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      Enhance with AI
                    </Button>
                  </div>
                  <Textarea
                    id="summary"
                    value={content.summary}
                    onChange={(e) => updateContent({ summary: e.target.value })}
                    placeholder="A brief summary of your professional background and career goals..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Experience
                  </div>
                  <Button variant="outline" size="sm" onClick={addExperience} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experience #{index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-600 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="Tech Corp"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          disabled={exp.current}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) =>
                            updateExperience(exp.id, { current: e.target.checked, endDate: "" })
                          }
                          className="rounded"
                        />
                        <Label htmlFor={`current-${exp.id}`}>Current Position</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Description</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleEnhance(exp.description, "experience", (enhanced) =>
                              updateExperience(exp.id, { description: enhanced })
                            )
                          }
                          disabled={isEnhancing === "experience" || !exp.description}
                          className="gap-1 text-purple-600 hover:text-purple-700"
                        >
                          {isEnhancing === "experience" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3" />
                          )}
                          Enhance
                        </Button>
                      </div>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={4}
                      />
                    </div>
                  </div>
                ))}
                {content.experience.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No work experience added yet.</p>
                    <Button variant="link" onClick={addExperience}>
                      Add your first experience
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </div>
                  <Button variant="outline" size="sm" onClick={addEducation} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Education #{index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-500 hover:text-red-600 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder="Bachelor of Science in Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>School</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                          placeholder="University of Technology"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                          placeholder="Boston, MA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <Input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA (Optional)</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                          placeholder="3.8"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {content.education.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No education added yet.</p>
                    <Button variant="link" onClick={addEducation}>
                      Add your education
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button onClick={addSkill} disabled={!newSkill.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 px-3 py-1">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                {content.skills.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No skills added yet. Start typing to add skills.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5" />
                    Projects
                  </div>
                  <Button variant="outline" size="sm" onClick={addProject} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.projects.map((proj, index) => (
                  <div key={proj.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Project #{index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProject(proj.id)}
                        className="text-red-500 hover:text-red-600 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                          placeholder="My Awesome Project"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link (Optional)</Label>
                        <Input
                          value={proj.link}
                          onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                          placeholder="github.com/project"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Description</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleEnhance(proj.description, "project", (enhanced) =>
                              updateProject(proj.id, { description: enhanced })
                            )
                          }
                          disabled={isEnhancing === "project" || !proj.description}
                          className="gap-1 text-purple-600 hover:text-purple-700"
                        >
                          {isEnhancing === "project" ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3" />
                          )}
                          Enhance
                        </Button>
                      </div>
                      <Textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        placeholder="Describe the project and your contributions..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Technologies (comma-separated)</Label>
                      <Input
                        value={proj.technologies.join(", ")}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        placeholder="React, Node.js, PostgreSQL"
                      />
                    </div>
                  </div>
                ))}
                {content.projects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No projects added yet.</p>
                    <Button variant="link" onClick={addProject}>
                      Add your first project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certifications
                  </div>
                  <Button variant="outline" size="sm" onClick={addCertification} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.certifications.map((cert, index) => (
                  <div key={cert.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Certification #{index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCertification(cert.id)}
                        className="text-red-500 hover:text-red-600 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                          placeholder="AWS Solutions Architect"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Issuer</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="month"
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {content.certifications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No certifications added yet.</p>
                    <Button variant="link" onClick={addCertification}>
                      Add your certifications
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResumePDFPreview content={content} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
