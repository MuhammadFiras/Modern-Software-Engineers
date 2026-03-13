"use client"

import { useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { NotesSection } from "@/components/notes-section"
import { ActionItemsSection } from "@/components/action-items-section"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Note, ActionItem } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export default function Home() {
  const [notes, setNotes, notesLoaded] = useLocalStorage<Note[]>("developer-notes", [])
  const [actionItems, setActionItems, actionsLoaded] = useLocalStorage<ActionItem[]>(
    "developer-action-items",
    []
  )

  const isLoaded = notesLoaded && actionsLoaded

  // Notes handlers
  const handleAddNote = useCallback(
    (title: string, content: string) => {
      const now = new Date().toISOString()
      const newNote: Note = {
        id: generateId(),
        title,
        content,
        createdAt: now,
        updatedAt: now,
      }
      setNotes((prev) => [newNote, ...prev])
    },
    [setNotes]
  )

  const handleUpdateNote = useCallback(
    (id: string, title: string, content: string) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, title, content, updatedAt: new Date().toISOString() } : note
        )
      )
    },
    [setNotes]
  )

  const handleDeleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== id))
    },
    [setNotes]
  )

  // Action Items handlers
  const handleAddActionItem = useCallback(
    (description: string) => {
      const now = new Date().toISOString()
      const newItem: ActionItem = {
        id: generateId(),
        description,
        completed: false,
        createdAt: now,
        updatedAt: now,
      }
      setActionItems((prev) => [newItem, ...prev])
    },
    [setActionItems]
  )

  const handleUpdateActionItem = useCallback(
    (id: string, description: string, completed: boolean) => {
      setActionItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, description, completed, updatedAt: new Date().toISOString() } : item
        )
      )
    },
    [setActionItems]
  )

  const handleDeleteActionItem = useCallback(
    (id: string) => {
      setActionItems((prev) => prev.filter((item) => item.id !== id))
    },
    [setActionItems]
  )

  const handleToggleActionItem = useCallback(
    (id: string) => {
      setActionItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() }
            : item
        )
      )
    },
    [setActionItems]
  )

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8 text-accent" />
          <p className="text-muted-foreground text-sm">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NotesSection
            notes={notes}
            onAdd={handleAddNote}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
          />
          <ActionItemsSection
            actionItems={actionItems}
            onAdd={handleAddActionItem}
            onUpdate={handleUpdateActionItem}
            onDelete={handleDeleteActionItem}
            onToggle={handleToggleActionItem}
          />
        </div>
      </main>
    </div>
  )
}
