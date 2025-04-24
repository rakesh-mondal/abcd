import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">{children}</div>
    </div>
  )
}
