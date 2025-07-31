"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AuthProvider } from "@/components/auth/auth-provider"
import { UserProvider } from "@/components/auth/user-context"
import { TopHeader } from "@/components/navigation/top-header"
import LeftNavigation from "@/components/navigation/left-navigation"
import { Toaster } from "@/components/ui/toaster"
import { ScrollFadeContainer } from "@/components/ui/scroll-fade-container"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close mobile sidebar when path changes
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname])

  if (!isMounted) {
    return null
  }

  // Don't show navigation on auth pages
  const isAuthPage = pathname?.startsWith("/auth")

  return (
    <AuthProvider>
      <UserProvider>
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <div className="flex h-screen w-full overflow-hidden flex-col" style={{ backgroundColor: '#F2F2F7' }}>
          {/* Full width Top Header */}
          <TopHeader
            onMenuClick={() => setMobileSidebarOpen(true)}
            isMobile={!isMounted ? false : window.innerWidth < 1024}
          />

          <div className="flex flex-1 overflow-hidden">
            {/* Left Navigation Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 top-[56px] z-50 transform transition-transform duration-300 ease-in-out lg:static lg:w-64 ${
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              }`}
              style={{ width: "16rem" }}
            >
              <LeftNavigation
                onClose={() => setMobileSidebarOpen(false)}
              />
            </div>

            {/* Mobile sidebar backdrop */}
            {mobileSidebarOpen && (
              <div
                className="fixed inset-0 top-[56px] z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
            )}

            {/* Main Content with Scroll Fade */}
            <main 
              className="flex-1 relative z-0 mx-4 mb-2 rounded-2xl" 
              style={{ backgroundColor: '#ffffff' }}
            >
              <ScrollFadeContainer 
                className="h-full"
                fadeHeight={24}
                showTopFade={true}
                showBottomFade={true}
              >
                <div className="h-full w-full p-4">
                  {children}
                </div>
              </ScrollFadeContainer>
            </main>
          </div>
        </div>
      )}
      <Toaster />
      </UserProvider>
    </AuthProvider>
  )
}
