"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type UserType = 'new' | 'existing' | 'regular'

interface UserContextType {
  userType: UserType
  setUserType: (type: UserType) => void
  isExistingUser: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserTypeState] = useState<UserType>('regular')

  // Load user type from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.userType) {
          setUserTypeState(parsed.userType)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const setUserType = (type: UserType) => {
    setUserTypeState(type)
    
    // Update localStorage
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        parsed.userType = type
        localStorage.setItem('user_data', JSON.stringify(parsed))
      } catch (error) {
        console.error('Error updating user data:', error)
      }
    }
  }

  const isExistingUser = userType === 'existing'

  return (
    <UserContext.Provider value={{ userType, setUserType, isExistingUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 