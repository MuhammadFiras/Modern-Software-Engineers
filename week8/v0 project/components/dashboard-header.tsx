"use client"

import { Terminal } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 border border-accent/20">
            <Terminal className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Developer Control Center</h1>
            <p className="text-xs text-muted-foreground">Manage your notes and tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-secondary border border-border">
            v1.0
          </span>
        </div>
      </div>
    </header>
  )
}
