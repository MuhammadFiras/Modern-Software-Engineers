"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Check, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ActionItem } from "@/lib/types"

interface ActionItemsSectionProps {
  actionItems: ActionItem[]
  onAdd: (description: string) => void
  onUpdate: (id: string, description: string, completed: boolean) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function ActionItemsSection({
  actionItems,
  onAdd,
  onUpdate,
  onDelete,
  onToggle,
}: ActionItemsSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null)
  const [newDescription, setNewDescription] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [error, setError] = useState<string | null>(null)

  const validateDescription = (description: string) => {
    if (!description.trim()) {
      setError("Description is required")
      return false
    }
    setError(null)
    return true
  }

  const handleAdd = () => {
    if (!validateDescription(newDescription)) return
    onAdd(newDescription.trim())
    setNewDescription("")
    setError(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (item: ActionItem) => {
    setEditingItem(item)
    setEditDescription(item.description)
    setError(null)
  }

  const handleUpdate = () => {
    if (!editingItem) return
    if (!validateDescription(editDescription)) return
    onUpdate(editingItem.id, editDescription.trim(), editingItem.completed)
    setEditingItem(null)
    setEditDescription("")
    setError(null)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditDescription("")
    setError(null)
  }

  const handleCancelAdd = () => {
    setNewDescription("")
    setError(null)
    setIsAddDialogOpen(false)
  }

  const completedCount = actionItems.filter((item) => item.completed).length
  const totalCount = actionItems.length

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-accent" />
          <CardTitle className="text-foreground">Action Items</CardTitle>
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground">
              ({completedCount}/{totalCount})
            </span>
          )}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Input
                  placeholder="Enter task description..."
                  value={newDescription}
                  onChange={(e) => {
                    setNewDescription(e.target.value)
                    if (error) setError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd()
                  }}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancelAdd} className="border-border text-foreground">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {actionItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No action items yet. Create your first task!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-accent/50 transition-colors"
              >
                {editingItem?.id === item.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editDescription}
                      onChange={(e) => {
                        setEditDescription(e.target.value)
                        if (error) setError(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                      className="bg-input border-border text-foreground"
                      autoFocus
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleUpdate}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="border-border text-foreground"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => onToggle(item.id)}
                      className="border-muted-foreground data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        item.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.description}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(item.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
