"use client"

import { useState } from "react"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"
import { ResumeContent } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

// PDF Styles - using default fonts (no custom font registration needed)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    textAlign: "center" as const,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1a365d",
  },
  contactInfo: {
    fontSize: 9,
    color: "#4a5568",
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb",
    borderBottomWidth: 1,
    borderBottomColor: "#2563eb",
    paddingBottom: 3,
    marginBottom: 8,
  },
  summary: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  jobTitle: {
    fontWeight: "bold",
    fontSize: 11,
  },
  company: {
    color: "#4b5563",
  },
  dates: {
    fontSize: 9,
    color: "#6b7280",
  },
  description: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.5,
  },
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontWeight: "bold",
    fontSize: 11,
  },
  school: {
    color: "#4b5563",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  skill: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    padding: "4 8",
    borderRadius: 4,
    fontSize: 9,
  },
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontWeight: "bold",
    fontSize: 11,
  },
  projectLink: {
    color: "#2563eb",
    fontSize: 9,
  },
  technologies: {
    fontSize: 9,
    color: "#6b7280",
    fontStyle: "italic",
  },
  certItem: {
    marginBottom: 5,
  },
  certName: {
    fontWeight: "bold",
    fontSize: 10,
  },
  certIssuer: {
    color: "#4b5563",
    fontSize: 9,
  },
})

// Resume PDF Document Component
function ResumePDF({ content }: { content: ResumeContent }) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {content.personalInfo.fullName && (
            <Text style={styles.name}>{content.personalInfo.fullName}</Text>
          )}
          <Text style={styles.contactInfo}>
            {[
              content.personalInfo.email,
              content.personalInfo.phone,
              content.personalInfo.location,
            ]
              .filter(Boolean)
              .join(" | ")}
          </Text>
          {(content.personalInfo.linkedin || content.personalInfo.website) && (
            <Text style={styles.contactInfo}>
              {[content.personalInfo.linkedin, content.personalInfo.website]
                .filter(Boolean)
                .join(" | ")}
            </Text>
          )}
        </View>

        {/* Summary */}
        {content.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summary}>{content.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
            {content.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.company}>
                      {exp.company}
                      {exp.location && ` - ${exp.location}`}
                    </Text>
                  </View>
                  <Text style={styles.dates}>
                    {formatDate(exp.startDate)} -{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </Text>
                </View>
                {exp.description && (
                  <Text style={styles.description}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {content.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {content.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.school}>
                      {edu.school}
                      {edu.location && ` - ${edu.location}`}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </Text>
                  </View>
                  <Text style={styles.dates}>{formatDate(edu.graduationDate)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsContainer}>
              {content.skills.map((skill) => (
                <Text key={skill} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {content.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {content.projects.map((proj) => (
              <View key={proj.id} style={styles.projectItem}>
                <Text style={styles.projectName}>
                  {proj.name}
                  {proj.link && <Text style={styles.projectLink}> ({proj.link})</Text>}
                </Text>
                {proj.description && (
                  <Text style={styles.description}>{proj.description}</Text>
                )}
                {proj.technologies.length > 0 && (
                  <Text style={styles.technologies}>
                    Technologies: {proj.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {content.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
            {content.certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <Text style={styles.certName}>
                  {cert.name}
                  {cert.date && ` (${formatDate(cert.date)})`}
                </Text>
                {cert.issuer && <Text style={styles.certIssuer}>{cert.issuer}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

// Preview Component
export function ResumePDFPreview({ content }: { content: ResumeContent }) {
  const [showPreview, setShowPreview] = useState(true)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={showPreview ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPreview(true)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <PDFDownloadLink
          document={<ResumePDF content={content} />}
          fileName={`${content.personalInfo.fullName || "resume"}.pdf`}
        >
          {({ loading }) => (
            <Button variant="outline" size="sm" disabled={loading} className="gap-2">
              <Download className="h-4 w-4" />
              {loading ? "Generating..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {showPreview && (
        <div className="bg-white border rounded-lg p-6 shadow-sm max-h-[600px] overflow-y-auto text-sm">
          {/* Preview Header */}
          <div className="text-center mb-6">
            {content.personalInfo.fullName && (
              <h1 className="text-2xl font-bold text-blue-900">
                {content.personalInfo.fullName}
              </h1>
            )}
            <p className="text-gray-600 text-xs">
              {[
                content.personalInfo.email,
                content.personalInfo.phone,
                content.personalInfo.location,
              ]
                .filter(Boolean)
                .join(" | ")}
            </p>
            {(content.personalInfo.linkedin || content.personalInfo.website) && (
              <p className="text-gray-600 text-xs">
                {[content.personalInfo.linkedin, content.personalInfo.website]
                  .filter(Boolean)
                  .join(" | ")}
              </p>
            )}
          </div>

          {/* Summary */}
          {content.summary && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-primary border-b border-primary pb-1 mb-2">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 text-xs leading-relaxed">{content.summary}</p>
            </div>
          )}

          {/* Experience */}
          {content.experience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-primary border-b border-primary pb-1 mb-2">
                WORK EXPERIENCE
              </h2>
              {content.experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{exp.title}</p>
                      <p className="text-gray-600 text-xs">
                        {exp.company}
                        {exp.location && ` - ${exp.location}`}
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-xs mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {content.education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-primary border-b border-primary pb-1 mb-2">
                EDUCATION
              </h2>
              {content.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{edu.degree}</p>
                      <p className="text-gray-600 text-xs">
                        {edu.school}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs">{formatDate(edu.graduationDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {content.skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-primary border-b border-primary pb-1 mb-2">
                SKILLS
              </h2>
              <div className="flex flex-wrap gap-1">
                {content.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {content.projects.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-primary border-b border-primary pb-1 mb-2">
                PROJECTS
              </h2>
              {content.projects.map((proj) => (
                <div key={proj.id} className="mb-2">
                  <p className="font-semibold">
                    {proj.name}
                    {proj.link && (
                      <span className="text-primary text-xs ml-1">({proj.link})</span>
                    )}
                  </p>
                  {proj.description && (
                    <p className="text-gray-700 text-xs">{proj.description}</p>
                  )}
                  {proj.technologies.length > 0 && (
                    <p className="text-gray-500 text-xs italic">
                      Technologies: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {content.certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-primary border-b border-primary pb-1 mb-2">
                CERTIFICATIONS
              </h2>
              {content.certifications.map((cert) => (
                <div key={cert.id} className="mb-1">
                  <p className="font-semibold text-xs">
                    {cert.name}
                    {cert.date && ` (${formatDate(cert.date)})`}
                  </p>
                  {cert.issuer && <p className="text-gray-600 text-xs">{cert.issuer}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!content.personalInfo.fullName &&
            !content.summary &&
            content.experience.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>Start filling in your information</p>
                <p className="text-sm">to see your resume preview here</p>
              </div>
            )}
        </div>
      )}
    </div>
  )
}
