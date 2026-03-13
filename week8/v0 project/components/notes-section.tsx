"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Note } from "@/lib/types"

interface NotesSectionProps {
  notes: Note[]
  onAdd: (title: string, content: string) => void
  onUpdate: (id: string, title: string, content: string) => void
  onDelete: (id: string) => void
}

export function NotesSection({ notes, onAdd, onUpdate, onDelete }: NotesSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

  const validateFields = (title: string, content: string) => {
    const newErrors: { title?: string; content?: string } = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!content.trim()) newErrors.content = "Content is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    if (!validateFields(newTitle, newContent)) return
    onAdd(newTitle.trim(), newContent.trim())
    setNewTitle("")
    setNewContent("")
    setErrors({})
    setIsAddDialogOpen(false)
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setErrors({})
  }

  const handleUpdate = () => {
    if (!editingNote) return
    if (!validateFields(editTitle, editContent)) return
    onUpdate(editingNote.id, editTitle.trim(), editContent.trim())
    setEditingNote(null)
    setEditTitle("")
    setEditContent("")
    setErrors({})
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setEditTitle("")
    setEditContent("")
    setErrors({})
  }

  const handleCancelAdd = () => {
    setNewTitle("")
    setNewContent("")
    setErrors({})
    setIsAddDialogOpen(false)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          <CardTitle className="text-foreground">Notes</CardTitle>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  placeholder="Enter note title..."
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value)
                    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
                  }}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content</label>
                <Textarea
                  placeholder="Enter note content..."
                  value={newContent}
                  onChange={(e) => {
                    setNewContent(e.target.value)
                    if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }))
                  }}
                  rows={4}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
                {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancelAdd} className="border-border text-foreground">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Create Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-accent/50 transition-colors"
              >
                {editingNote?.id === note.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editTitle}
                      onChange={(e) => {
                        setEditTitle(e.target.value)
                        if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
                      }}
                      className="bg-input border-border text-foreground"
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    <Textarea
                      value={editContent}
                      onChange={(e) => {
                        setEditContent(e.target.value)
                        if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }))
                      }}
                      rows={3}
                      className="bg-input border-border text-foreground resize-none"
                    />
                    {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
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
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-foreground">{note.title}</h3>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(note)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete(note.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      Updated {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
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
