import { getUserProfile } from "@/actions/auth"
import { redirect } from "next/navigation"
import { RecruiterNav } from "@/components/recruiter/nav"

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getUserProfile()
  
  if (!profile) {
    redirect("/login")
  }

  if (profile.role !== "recruiter") {
    redirect("/candidate/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <RecruiterNav profile={profile} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
