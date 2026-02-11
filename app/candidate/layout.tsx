import { getUserProfile } from "@/actions/auth"
import { redirect } from "next/navigation"
import { CandidateNav } from "@/components/candidate/nav"

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getUserProfile()
  
  if (!profile) {
    redirect("/login")
  }

  if (profile.role !== "candidate") {
    redirect("/recruiter/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <CandidateNav profile={profile} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
