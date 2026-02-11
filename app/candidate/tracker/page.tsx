import { getApplications } from "@/actions/tracker"
import { KanbanBoard } from "@/components/candidate/kanban-board"

export default async function TrackerPage() {
  const { data: applications } = await getApplications()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Job Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Track your applications across every stage
        </p>
      </div>

      <KanbanBoard applications={applications} />
    </div>
  )
}
