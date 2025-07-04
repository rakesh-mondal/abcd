import type React from "react"

export default function AiSolutionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      {children}
    </div>
  )
}
