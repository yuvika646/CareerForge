"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Application,
  ApplicationStatus,
  addApplication,
  updateStatus,
  deleteApplication,
} from "@/actions/tracker"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Plus,
  Loader2,
  Trash2,
  Calendar,
  DollarSign,
  Building2,
} from "lucide-react"

// ── Column config ────────────────────────────────────────────
interface ColumnConfig {
  key: ApplicationStatus
  label: string
  dot: string            // small color dot for the header
  cardAccent: string     // left-border on cards
  countBg: string        // pill badge around count
}

const COLUMNS: ColumnConfig[] = [
  {
    key: "wishlist",
    label: "Wishlist",
    dot: "bg-muted-foreground",
    cardAccent: "border-l-muted-foreground/60",
    countBg: "bg-muted text-muted-foreground",
  },
  {
    key: "applied",
    label: "Applied",
    dot: "bg-blue-500",
    cardAccent: "border-l-blue-500",
    countBg: "bg-blue-500/10 text-blue-600",
  },
  {
    key: "interview",
    label: "Interview",
    dot: "bg-indigo-500",
    cardAccent: "border-l-indigo-500",
    countBg: "bg-indigo-500/10 text-indigo-600",
  },
  {
    key: "offer",
    label: "Offer",
    dot: "bg-emerald-500",
    cardAccent: "border-l-emerald-500",
    countBg: "bg-emerald-500/10 text-emerald-600",
  },
  {
    key: "rejected",
    label: "Rejected",
    dot: "bg-red-500",
    cardAccent: "border-l-red-500",
    countBg: "bg-red-500/10 text-red-600",
  },
]

// ── Props ────────────────────────────────────────────────────
interface KanbanBoardProps {
  applications: Application[]
}

// ── Component ────────────────────────────────────────────────
export function KanbanBoard({ applications: serverApps }: KanbanBoardProps) {
  const [apps, setApps] = useState<Application[]>(serverApps)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formCompany, setFormCompany] = useState("")
  const [formRole, setFormRole] = useState("")
  const [formSalary, setFormSalary] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  // ── Helpers ──────────────────────────────────────────────
  const grouped = COLUMNS.map((col) => ({
    ...col,
    items: apps.filter((a) => a.status === col.key),
  }))

  function formatShortDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // ── Handlers ─────────────────────────────────────────────
  async function handleAdd() {
    if (!formCompany.trim() || !formRole.trim()) {
      toast({ title: "Error", description: "Company and role are required", variant: "destructive" })
      return
    }

    setIsAdding(true)

    const result = await addApplication({
      company: formCompany.trim(),
      role: formRole.trim(),
      salary: formSalary.trim() || undefined,
      status: "wishlist",
    })

    setIsAdding(false)

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
      return
    }

    // Optimistic: push immediately
    if (result.data) {
      setApps((prev) => [result.data!, ...prev])
    }

    toast({ title: "Added", description: `${formCompany} added to Wishlist` })
    setFormCompany("")
    setFormRole("")
    setFormSalary("")
    setDialogOpen(false)
    startTransition(() => router.refresh())
  }

  async function handleStatusChange(id: string, newStatus: ApplicationStatus) {
    // Optimistic update
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )

    const result = await updateStatus(id, newStatus)

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
      // Revert
      startTransition(() => router.refresh())
      return
    }

    startTransition(() => router.refresh())
  }

  async function handleDelete(id: string) {
    setDeletingId(id)

    // Optimistic remove
    setApps((prev) => prev.filter((a) => a.id !== id))

    const result = await deleteApplication(id)

    setDeletingId(null)

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
      startTransition(() => router.refresh())
      return
    }

    toast({ title: "Deleted", description: "Application removed" })
    startTransition(() => router.refresh())
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-4 min-w-[1100px] lg:min-w-0 lg:grid lg:grid-cols-5">
        {grouped.map((col) => (
          <div
            key={col.key}
            className="flex flex-col min-w-[240px] lg:min-w-0 rounded-xl bg-muted/20 border border-border/40 p-3"
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${col.countBg}`}
                >
                  {col.items.length}
                </span>
              </div>

              {/* Add button only in Wishlist column */}
              {col.key === "wishlist" && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-muted"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Application</DialogTitle>
                      <DialogDescription>
                        Track a new job you&apos;re interested in.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="add-company">Company *</Label>
                        <Input
                          id="add-company"
                          placeholder="e.g., Google"
                          value={formCompany}
                          onChange={(e) => setFormCompany(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-role">Role *</Label>
                        <Input
                          id="add-role"
                          placeholder="e.g., Frontend Engineer"
                          value={formRole}
                          onChange={(e) => setFormRole(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-salary">Salary (optional)</Label>
                        <Input
                          id="add-salary"
                          placeholder="e.g., $120k – $160k"
                          value={formSalary}
                          onChange={(e) => setFormSalary(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        onClick={handleAdd}
                        disabled={isAdding}
                        className="gap-2"
                      >
                        {isAdding ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Add to Wishlist
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5 flex-1">
              {col.items.length === 0 && (
                <div className="flex-1 flex items-center justify-center min-h-[120px] rounded-lg border border-dashed border-border/60 text-muted-foreground/50 text-xs">
                  No applications
                </div>
              )}

              {col.items.map((app) => (
                <Card
                  key={app.id}
                  className={`border-l-[3px] ${col.cardAccent} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-3.5 space-y-2.5">
                    {/* Company + Delete */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {app.company}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {app.role}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 rounded-full text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(app.id)}
                        disabled={deletingId === app.id}
                      >
                        {deletingId === app.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatShortDate(app.date_applied)}
                      </span>
                      {app.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {app.salary}
                        </span>
                      )}
                    </div>

                    {/* Status select */}
                    <Select
                      value={app.status}
                      onValueChange={(v) =>
                        handleStatusChange(app.id, v as ApplicationStatus)
                      }
                    >
                      <SelectTrigger className="h-7 text-xs rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLUMNS.map((c) => (
                          <SelectItem key={c.key} value={c.key} className="text-xs">
                            <span className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${c.dot}`}
                              />
                              {c.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Global empty state */}
      {apps.length === 0 && (
        <div className="text-center py-16 mt-4">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="font-semibold text-lg mb-1 text-foreground">No applications yet</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Start tracking jobs by adding one to your Wishlist.
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Application
              </Button>
            </DialogTrigger>
            {/* Reuses same DialogContent from above — 
                React will portal the already-rendered dialog */}
          </Dialog>
        </div>
      )}
    </div>
  )
}
