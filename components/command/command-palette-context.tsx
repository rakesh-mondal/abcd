"use client"

import { createContext, useContext, useState } from "react"

interface CommandPaletteContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined)

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (context === undefined) {
    throw new Error("useCommandPalette must be used within a CommandPaletteProvider")
  }
  return context
} 