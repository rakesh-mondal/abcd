import type React from "react"

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
