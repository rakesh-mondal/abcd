"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
import { PageLayout } from "../../../../../components/page-layout"
import { VercelTabs } from "../../../../../components/ui/vercel-tabs"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { ShadcnDataTable } from "../../../../../components/ui/shadcn-data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../../components/ui/dropdown-menu"
import { FolderPlus, Upload, MoreVertical, RefreshCw, Download, Link, Edit, Move, Trash2, MoreHorizontal, X, Plus, ArrowUp, Folder, Image, File, CloudUpload, Pause } from "lucide-react"
import { Label } from "../../../../../components/ui/label"
import { useToast } from "../../../../../hooks/use-toast"
import { DeleteConfirmationModal } from "../../../../../components/delete-confirmation-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../../components/ui/tooltip"

// Helper function to format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }
}

// Mock function to get bucket by ID
const getBucket = (id: string) => {
  const mockBuckets = [
    {
      id: "1",
      name: "checkbucket1",
      region: "In-Bangalore-1",
      size: "0.00 B",
      createdOn: "2025-04-24T07:25:59",
      status: "updating",
      accessControl: "private",
      bucketVersioning: false,
      defaultEncryption: true,
      tags: [
        { key: "Environment", value: "Production" },
        { key: "Team", value: "DevOps" }
      ]
    },
    {
      id: "2",
      name: "vm-bucket-23",
      region: "In-Bangalore-1",
      size: "0.00 B",
      createdOn: "2025-05-29T14:56:13",
      status: "success",
      accessControl: "private",
      bucketVersioning: true,
      defaultEncryption: true,
      tags: [
        { key: "Project", value: "WebApp" },
        { key: "Owner", value: "Frontend Team" }
      ]
    },
    {
      id: "3",
      name: "another-bucket",
      region: "In-Hyderabad-1",
      size: "1.23 GB",
      createdOn: "2025-06-15T10:00:00",
      status: "success",
      accessControl: "public",
      bucketVersioning: false,
      defaultEncryption: true,
      tags: [
        { key: "Type", value: "Static Assets" }
      ]
    },
  ]
  
  return mockBuckets.find(bucket => bucket.id === id)
}

// Mock data for lifecycle rules
const mockLifecycleRules = [
  {
    id: "rule-1",
    ruleName: "Archive Old Files",
    expirationDays: "365",
    noncurrentDays: "30",
    newerNoncurrentVersions: "5",
    multipartUploads: "7",
    typeOfTimestamp: "Creation Date",
    enabled: true,
    expiredObjectDeleteMarker: "Enabled",
    status: "Active"
  },
  {
    id: "rule-2",
    ruleName: "Delete Temp Files",
    expirationDays: "30",
    noncurrentDays: "7",
    newerNoncurrentVersions: "3",
    multipartUploads: "1",
    typeOfTimestamp: "Last Modified",
    enabled: true,
    expiredObjectDeleteMarker: "Disabled",
    status: "Active"
  },
  {
    id: "rule-3",
    ruleName: "Backup Retention",
    expirationDays: "2555",
    noncurrentDays: "90",
    newerNoncurrentVersions: "10",
    multipartUploads: "14",
    typeOfTimestamp: "Creation Date",
    enabled: false,
    expiredObjectDeleteMarker: "Enabled",
    status: "Inactive"
  }
]

// Mock data for bucket objects
const mockObjects = [
  {
    id: "1",
    name: "documents",
    type: "folder",
    lastModified: "2025-01-15T10:30:00Z",
    storageClass: "Standard",
    size: "-"
  },
  {
    id: "2",
    name: "images", 
    type: "folder",
    lastModified: "2025-01-14T15:45:00Z",
    storageClass: "Standard",
    size: "-"
  },
  {
    id: "3",
    name: "videos",
    type: "folder", 
    lastModified: "2025-01-13T09:20:00Z",
    storageClass: "Standard",
    size: "-"
  },
  {
    id: "4",
    name: "report.pdf",
    type: "file",
    lastModified: "2025-01-15T14:22:00Z",
    storageClass: "Standard",
    size: "2.4 MB"
  },
  {
    id: "5",
    name: "presentation.pptx",
    type: "file",
    lastModified: "2025-01-15T11:15:00Z", 
    storageClass: "Standard",
    size: "5.8 MB"
  },
  {
    id: "6",
    name: "data.csv",
    type: "file",
    lastModified: "2025-01-14T16:30:00Z",
    storageClass: "Standard", 
    size: "1.2 MB"
  },
  {
    id: "7",
    name: "backup.zip",
    type: "file",
    lastModified: "2025-01-15T08:30:00Z",
    storageClass: "Standard",
    size: "15.2 MB"
  },
  {
    id: "8",
    name: "user-manual.pdf",
    type: "file",
    lastModified: "2025-01-14T13:45:00Z",
    storageClass: "Standard",
    size: "3.1 MB"
  },
  {
    id: "9",
    name: "logo.svg",
    type: "file",
    lastModified: "2025-01-13T11:20:00Z",
    storageClass: "Standard",
    size: "45 KB"
  },
  {
    id: "10",
    name: "database.sql",
    type: "file",
    lastModified: "2025-01-15T07:15:00Z",
    storageClass: "Standard",
    size: "8.7 MB"
  },
  {
    id: "11",
    name: "config.json",
    type: "file",
    lastModified: "2025-01-14T14:30:00Z",
    storageClass: "Standard",
    size: "2.3 KB"
  },
  {
    id: "12",
    name: "readme.md",
    type: "file",
    lastModified: "2025-01-13T09:10:00Z",
    storageClass: "Standard",
    size: "1.2 KB"
  },
  {
    id: "13",
    name: "archive",
    type: "folder",
    lastModified: "2025-01-12T15:45:00Z",
    storageClass: "Standard",
    size: "-"
  },
  {
    id: "14",
    name: "temp",
    type: "folder",
    lastModified: "2025-01-11T12:20:00Z",
    storageClass: "Standard",
    size: "-"
  },
  {
    id: "15",
    name: "backup-2025-01-15.zip",
    type: "file",
    lastModified: "2025-01-15T06:00:00Z",
    storageClass: "Standard",
    size: "25.8 MB"
  },
  {
    id: "16",
    name: "invoice-template.docx",
    type: "file",
    lastModified: "2025-01-14T17:30:00Z",
    storageClass: "Standard",
    size: "1.5 MB"
  },
  {
    id: "17",
    name: "product-catalog.pdf",
    type: "file",
    lastModified: "2025-01-13T16:45:00Z",
    storageClass: "Standard",
    size: "4.2 MB"
  },
  {
    id: "18",
    name: "api-docs.html",
    type: "file",
    lastModified: "2025-01-12T10:30:00Z",
    storageClass: "Standard",
    size: "156 KB"
  },
  {
    id: "19",
    name: "error-logs.txt",
    type: "file",
    lastModified: "2025-01-15T05:15:00Z",
    storageClass: "Standard",
    size: "892 KB"
  },
  {
    id: "20",
    name: "security-audit.pdf",
    type: "file",
    lastModified: "2025-01-14T18:20:00Z",
    storageClass: "Standard",
    size: "6.7 MB"
  },
  {
    id: "21",
    name: "user-profiles",
    type: "folder",
    lastModified: "2025-01-13T14:10:00Z",
    storageClass: "Standard",
    size: "-"
  },
  {
    id: "22",
    name: "system-config",
    type: "folder",
    lastModified: "2025-01-12T09:45:00Z",
    storageClass: "Standard",
    size: "-"
  },
  {
    id: "23",
    name: "monthly-report.xlsx",
    type: "file",
    lastModified: "2025-01-15T04:30:00Z",
    storageClass: "Standard",
    size: "3.8 MB"
  },
  {
    id: "24",
    name: "client-data.csv",
    type: "file",
    lastModified: "2025-01-14T19:15:00Z",
    storageClass: "Standard",
    size: "2.1 MB"
  },
  {
    id: "25",
    name: "project-specs.docx",
    type: "file",
    lastModified: "2025-01-13T15:20:00Z",
    storageClass: "Standard",
    size: "5.4 MB"
  }
]

export default function BucketObjectsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Get the tab from URL parameters, default to "objects"
  const initialTab = searchParams.get("tab") || "objects"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bucketSession') === 'true'
    }
    return false
  })
  const [accessKey, setAccessKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  
  // Bucket Policy state (moved to parent to persist across tab switches)
  const [policyExists, setPolicyExists] = useState(false)
  const [policyData, setPolicyData] = useState({
    policyId: "DefaultBucketPolicy",
    readWriteIPs: ["*"],
    readOnlyIPs: ["*"]
  })
  
  // Tags state for Properties tab
  const [tags, setTags] = useState([{ key: "", value: "" }])
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<number | null>(null)
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const lastFocusedInput = useRef<string | null>(null)
  
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [objects, setObjects] = useState(mockObjects)
  const [showMoveObjectModal, setShowMoveObjectModal] = useState(false)
  const [selectedObjectToMove, setSelectedObjectToMove] = useState<any>(null)
  const [selectedDestinationFolder, setSelectedDestinationFolder] = useState("")
  const [showCreateFolderInMove, setShowCreateFolderInMove] = useState(false)
  const [newFolderNameInMove, setNewFolderNameInMove] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [navigationHistory, setNavigationHistory] = useState<string[][]>([[]])
  const [moveModalCurrentPath, setMoveModalCurrentPath] = useState<string[]>([])
  const [moveModalNavigationHistory, setMoveModalNavigationHistory] = useState<string[][]>([[]])
  const [dynamicFolders, setDynamicFolders] = useState<{ [path: string]: any[] }>({})
  const [mainDynamicFolders, setMainDynamicFolders] = useState<{ [path: string]: any[] }>({})
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [selectedObjectToRename, setSelectedObjectToRename] = useState<any>(null)
  const [renameValue, setRenameValue] = useState("")
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [rulesSearchQuery, setRulesSearchQuery] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<Array<{
    file: File
    progress: number
    status: 'uploading' | 'uploaded' | 'error'
    intervalId?: NodeJS.Timeout
  }>>([])
  
  // Confirmation modals
  const [showDeleteObjectModal, setShowDeleteObjectModal] = useState(false)
  const [objectToDelete, setObjectToDelete] = useState<any>(null)
  const [showDeleteRuleModal, setShowDeleteRuleModal] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<any>(null)
  const [showDeletePolicyModal, setShowDeletePolicyModal] = useState(false)

  // Unwrap params
  const { id } = use(params)
  const bucket = getBucket(id)
  
  if (!bucket) {
    notFound()
  }

  // Convert technical region to user-friendly format that matches header
  const getDisplayRegion = (region: string) => {
    switch (region) {
      case "In-Bangalore-1":
        return "Bengaluru"
      case "In-Hyderabad-1":
        return "Hyderabad"
      default:
        return region
    }
  }

  // Authentication handler
  const handleCreateSession = () => {
    if (!accessKey.trim() || !secretKey.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both access key and secret key",
        variant: "destructive"
      })
      return
    }

    if (accessKey.trim() === "1" && secretKey.trim() === "1") {
      setIsAuthenticated(true)
      localStorage.setItem('bucketSession', 'true')
      toast({
        title: "Session Created",
        description: "Your storage session has been created successfully",
      })
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid access key or secret key. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCreateAPIKeys = () => {
    toast({
      title: "Redirecting",
      description: "Redirecting to API keys management...",
    })
  }

  // Deactivate session handler
  const handleDeactivateSession = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('bucketSession')
    setAccessKey("")
    setSecretKey("")
    toast({
      title: "Session Deactivated",
      description: "Your storage session has been deactivated successfully.",
    })
  }

  const handleRefresh = () => {
    setLastRefreshed(new Date())
    toast({
      title: "Objects refreshed",
      description: "The object list has been refreshed successfully.",
    })
  }

  // Navigation functions for main screen
  const handleFolderClick = (folderName: string) => {
    const newPath = [...currentPath, folderName]
    setCurrentPath(newPath)
    setNavigationHistory(prev => [...prev, newPath])
  }

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1)
      const previousPath = newHistory[newHistory.length - 1]
      setNavigationHistory(newHistory)
      setCurrentPath(previousPath)
    }
  }

  // Mock data for different folders
  const getFolderContents = (folderName: string) => {
    const folderContents: { [key: string]: any[] } = {
      documents: [
        {
          id: "doc-1",
          name: "reports",
          type: "folder",
          lastModified: "2025-01-13T14:30:00Z",
          storageClass: "Standard",
          size: "-"
        },
        {
          id: "doc-2",
          name: "contracts",
          type: "folder",
          lastModified: "2025-01-12T11:20:00Z",
          storageClass: "Standard",
          size: "-"
        }
      ],
      images: [
        {
          id: "img-1",
          name: "screenshots",
          type: "folder",
          lastModified: "2025-01-14T12:00:00Z",
          storageClass: "Standard",
          size: "-"
        },
        {
          id: "img-2",
          name: "profile-photos",
          type: "folder",
          lastModified: "2025-01-13T08:30:00Z",
          storageClass: "Standard",
          size: "-"
        }
      ],
      videos: [
        {
          id: "vid-1",
          name: "tutorials",
          type: "folder",
          lastModified: "2025-01-13T16:15:00Z",
          storageClass: "Standard",
          size: "-"
        }
      ]
    }
    
    return folderContents[folderName] || []
  }

  // Filter objects based on current path
  const getCurrentFolderObjects = () => {
    const currentPathKey = currentPath.join('/')
    
    if (currentPath.length === 0) {
      // Root level: combine static objects with any dynamically created folders at root
      const staticObjects = objects
      const dynamicRootObjects = mainDynamicFolders[''] || []
      return [...dynamicRootObjects, ...staticObjects]
    }
    
    // Check if we have dynamic folders for this path
    if (mainDynamicFolders[currentPathKey]) {
      const dynamicObjects = mainDynamicFolders[currentPathKey]
      const currentFolder = currentPath[currentPath.length - 1]
      const staticObjects = getFolderContents(currentFolder)
      return [...dynamicObjects, ...staticObjects]
    }
    
    // Fallback to static folder contents
    const currentFolder = currentPath[currentPath.length - 1]
    return getFolderContents(currentFolder)
  }

  const currentFolderObjects = getCurrentFolderObjects()

  // Get table data with navigation and search filtering
  const getTableData = () => {
    let data = [...currentFolderObjects]
    
    // Filter by search query if provided
    if (searchQuery.trim()) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Add "go back" option if we're inside a folder (always show, not affected by search)
    if (currentPath.length > 0) {
      data.unshift({
        id: "go-back",
        name: ".. (Go back)",
        type: "navigation",
        lastModified: "",
        storageClass: "",
        size: ""
      })
    }
    
    return data
  }

  // Tag management functions for Properties tab
  const handleAddTag = () => {
    const lastTag = tags[tags.length - 1]
    if (lastTag.key.trim() && lastTag.value.trim()) {
      setTags([...tags, { key: "", value: "" }])
    }
  }
  
  const isAddTagDisabled = () => {
    // If there's only one tag, allow adding more
    if (tags.length === 1) {
      return false
    }
    
    // If there are multiple tags, check if the second-to-last tag is filled
    const secondToLastTag = tags[tags.length - 2]
    return !secondToLastTag.key.trim() || !secondToLastTag.value.trim()
  }
  
  const handleRemoveTag = (index: number) => {
    const tag = tags[index]
    
    // If tag is empty (both key and value are empty), delete directly without confirmation
    if (!tag.key.trim() && !tag.value.trim()) {
      if (tags.length > 1) {
        setTags(tags.filter((_, i) => i !== index))
      } else {
        // If it's the last tag, just clear it and keep the row
        setTags([{ key: "", value: "" }])
      }
      return
    }
    
    // If tag has content, show confirmation modal
    setTagToDelete(index)
    setDeleteConfirmationOpen(true)
  }
  
  const confirmTagDelete = () => {
    if (tagToDelete !== null) {
      if (tags.length > 1) {
        setTags(tags.filter((_, i) => i !== tagToDelete))
      } else {
        // If it's the last tag, just clear it and keep the row
        setTags([{ key: "", value: "" }])
      }
    }
    setTagToDelete(null)
    setDeleteConfirmationOpen(false)
  }
  
  const handleTagChange = (index: number, field: 'key' | 'value', value: string) => {
    const inputKey = `${index}-${field}`
    lastFocusedInput.current = inputKey
    
    const newTags = [...tags]
    newTags[index][field] = value
    setTags(newTags)
    
    setTimeout(() => {
      const input = inputRefs.current[inputKey]
      if (input && lastFocusedInput.current === inputKey) {
        input.focus()
        input.setSelectionRange(value.length, value.length)
      }
    }, 0)
  }
  
  const isTagFilled = (tag: { key: string; value: string }) => {
    return Boolean(tag.key.trim() && tag.value.trim())
  }

  const saveTags = () => {
    toast({
      title: "Success",
      description: "Tags saved successfully",
    })
  }

  const handleRulesRefresh = () => {
    setLastRefreshed(new Date())
    toast({
      title: "Rules refreshed",
      description: "The lifecycle rules have been refreshed successfully.",
    })
  }

  // Create Folder handlers
  const handleCreateFolderSubmit = () => {
    if (folderName.trim()) {
      const newFolder = {
        id: `new-folder-${Date.now()}`,
        name: folderName,
        type: "folder",
        lastModified: new Date().toISOString(),
        storageClass: "Standard",
        size: "-"
      }
      
      // Add folder to the current path location
      const currentPathKey = currentPath.join('/')
      
      if (currentPath.length === 0) {
        // Root level - add to main objects
        setObjects(prev => [newFolder, ...prev])
      } else {
        // Inside a folder - add to dynamic folders for that path
        setMainDynamicFolders(prev => {
          const updated = { ...prev }
          if (!updated[currentPathKey]) {
            updated[currentPathKey] = []
          }
          updated[currentPathKey] = [newFolder, ...updated[currentPathKey]]
          return updated
        })
      }
      
      toast({
        title: "Folder created",
        description: `Folder "${folderName}" has been created successfully.`,
      })
      setFolderName("")
      setShowCreateFolderModal(false)
    }
  }

  const handleCreateFolderCancel = () => {
    setFolderName("")
    setShowCreateFolderModal(false)
  }

  // Action handlers for dropdown menu
  const handleDownload = (fileName: string) => {
    toast({
      title: "Download started",
      description: `Download started of '${fileName}'`,
    })
    
    setTimeout(() => {
      toast({
        title: "Download completed",
        description: `Download completed for '${fileName}'`,
      })
    }, 2000)
  }

  const handleCopyPresignedUrl = (fileName: string) => {
    navigator.clipboard.writeText(`https://example.com/presigned-url/${fileName}`)
    
    toast({
      title: "Copied to clipboard",
      description: "Presigned URL has been copied to your clipboard",
    })
  }

  const handleRename = (object: any) => {
    setSelectedObjectToRename(object)
    setRenameValue(object.name)
    setShowRenameModal(true)
  }

  const handleRenameCancel = () => {
    setSelectedObjectToRename(null)
    setRenameValue("")
    setShowRenameModal(false)
  }

  const handleRenameSubmit = () => {
    if (renameValue.trim() && selectedObjectToRename) {
      toast({
        title: "Object renamed",
        description: `"${selectedObjectToRename.name}" has been renamed to "${renameValue.trim()}"`,
      })
      handleRenameCancel()
    }
  }

  const handleMoveObject = (objectToMove: any) => {
    setSelectedObjectToMove(objectToMove)
    setSelectedDestinationFolder("")
    setMoveModalCurrentPath([])
    setMoveModalNavigationHistory([[]])
    setShowMoveObjectModal(true)
  }

  const handleMoveObjectCancel = () => {
    setSelectedObjectToMove(null)
    setSelectedDestinationFolder("")
    setShowMoveObjectModal(false)
  }

  const handleMoveObjectConfirm = () => {
    if (selectedDestinationFolder && selectedObjectToMove) {
      toast({
        title: "Object moved",
        description: `${selectedObjectToMove.name} has been moved to ${selectedDestinationFolder}`,
      })
      handleMoveObjectCancel()
    }
  }

  const handleCreateFolderInMove = () => {
    setShowCreateFolderInMove(true)
  }

  const handleCreateFolderInMoveSubmit = () => {
    if (newFolderNameInMove.trim()) {
      const newFolder = {
        id: `move-folder-${Date.now()}`,
        name: newFolderNameInMove,
        type: "folder",
        lastModified: new Date().toISOString(),
        storageClass: "Standard",
        size: "-"
      }
      
      const currentPathKey = moveModalCurrentPath.join('/')
      
      // Add to main objects/folders based on current path
      if (moveModalCurrentPath.length === 0) {
        // Root level - add to main objects
        setObjects(prev => [newFolder, ...prev])
      } else {
        // Inside a folder - add to main dynamic folders for that path
        setMainDynamicFolders(prev => {
          const updated = { ...prev }
          if (!updated[currentPathKey]) {
            updated[currentPathKey] = []
          }
          updated[currentPathKey] = [newFolder, ...updated[currentPathKey]]
          return updated
        })
      }
      
      // Also add to move modal dynamic folders for navigation
      setDynamicFolders(prev => {
        const updated = { ...prev }
        if (!updated[currentPathKey]) {
          updated[currentPathKey] = []
        }
        updated[currentPathKey] = [newFolder, ...updated[currentPathKey]]
        return updated
      })
      
      setNewFolderNameInMove("")
      setShowCreateFolderInMove(false)
      setSelectedDestinationFolder(newFolderNameInMove)
      
      // Show success toast
      toast({
        title: "Folder created",
        description: `Folder "${newFolderNameInMove}" has been created successfully.`,
      })
    }
  }

  const handleCreateFolderInMoveCancel = () => {
    setNewFolderNameInMove("")
    setShowCreateFolderInMove(false)
  }

  // Navigation functions for Move Object modal
  const handleMoveModalFolderClick = (folderName: string) => {
    const newPath = [...moveModalCurrentPath, folderName]
    setMoveModalCurrentPath(newPath)
    setMoveModalNavigationHistory(prev => [...prev, newPath])
    setSelectedDestinationFolder("")
  }

  const handleMoveModalGoBack = () => {
    if (moveModalNavigationHistory.length > 1) {
      const newHistory = moveModalNavigationHistory.slice(0, -1)
      const previousPath = newHistory[newHistory.length - 1]
      setMoveModalNavigationHistory(newHistory)
      setMoveModalCurrentPath(previousPath)
      setSelectedDestinationFolder("")
    }
  }

  // Get folders for current path in Move Object modal
  const getMoveModalFolders = () => {
    const currentPathKey = moveModalCurrentPath.join('/')
    
    if (moveModalCurrentPath.length === 0) {
      const staticFolders = objects.filter(obj => obj.type === "folder")
      const dynamicRootFolders = dynamicFolders[''] || []
      return [...dynamicRootFolders, ...staticFolders]
    }
    
    const currentFolder = moveModalCurrentPath[moveModalCurrentPath.length - 1]
    const staticFolders = getFolderContents(currentFolder).filter(obj => obj.type === "folder")
    const dynamicFoldersForPath = dynamicFolders[currentPathKey] || []
    
    // Return dynamic folders first (newly created), then static folders (existing)
    return [...dynamicFoldersForPath, ...staticFolders]
  }

  const handleDeleteObject = (object: any) => {
    setObjectToDelete(object)
    setShowDeleteObjectModal(true)
  }

  const handleDeleteObjectConfirm = () => {
    if (objectToDelete) {
      const itemType = objectToDelete.type === "folder" ? "folder" : "object"
      toast({
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted`,
        description: `${objectToDelete.name} has been deleted successfully.`,
      })
      setShowDeleteObjectModal(false)
      setObjectToDelete(null)
    }
  }

  const handleDeleteObjectCancel = () => {
    setShowDeleteObjectModal(false)
    setObjectToDelete(null)
  }

  const handleDeleteRule = (rule: any) => {
    setRuleToDelete(rule)
    setShowDeleteRuleModal(true)
  }

  const handleDeleteRuleConfirm = () => {
    if (ruleToDelete) {
      toast({
        title: "Rule Deleted",
        description: `${ruleToDelete.ruleName} has been deleted successfully.`,
      })
      setShowDeleteRuleModal(false)
      setRuleToDelete(null)
    }
  }

  const handleDeleteRuleCancel = () => {
    setShowDeleteRuleModal(false)
    setRuleToDelete(null)
  }

  const handleDeletePolicy = () => {
    setShowDeletePolicyModal(true)
  }

  const handleDeletePolicyConfirm = () => {
    setPolicyExists(false)
    setPolicyData({
      policyId: "",
      readWriteIPs: ["*"],
      readOnlyIPs: ["*"]
    })
    toast({
      title: "Policy Deleted",
      description: "Bucket policy has been deleted successfully",
    })
    setShowDeletePolicyModal(false)
  }

  const handleDeletePolicyCancel = () => {
    setShowDeletePolicyModal(false)
  }

  // Upload handlers
  const handleUploadClick = () => {
    setShowUploadModal(true)
  }

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Directly start upload simulation for each file
    const filesToUpload = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadingFiles(prev => [...prev, ...filesToUpload])

    // Simulate upload progress for each file
    filesToUpload.forEach((uploadItem) => {
      const interval = setInterval(() => {
        setUploadingFiles(prev => {
          const updated = [...prev]
          const fileIndex = updated.findIndex(item => item.file === uploadItem.file)
          
          if (fileIndex !== -1) {
            if (updated[fileIndex].progress < 100) {
              updated[fileIndex].progress += Math.random() * 20 + 5 // Random progress increment
              
              // Simulate error for some uploads (10% chance)
              if (Math.random() < 0.1 && updated[fileIndex].progress > 50) {
                updated[fileIndex].status = 'error'
                clearInterval(interval)
              }
            } else {
              updated[fileIndex].status = 'uploaded'
              clearInterval(interval)
              
              // Add to objects list when upload completes
              const newFile = {
                id: `file-${Date.now()}-${Math.random()}`,
                name: uploadItem.file.name,
                type: "file",
                lastModified: new Date().toISOString(),
                storageClass: "Standard",
                size: `${(uploadItem.file.size / 1024 / 1024).toFixed(2)} MB`
              }
              
              setObjects(prev => [newFile, ...prev])
            }
          }
          
          return updated
        })
      }, 200) // Update every 200ms
      
      // Store the interval ID in the upload item
      setUploadingFiles(prev => {
        const updated = [...prev]
        const fileIndex = updated.findIndex(item => item.file === uploadItem.file)
        if (fileIndex !== -1) {
          updated[fileIndex].intervalId = interval
        }
        return updated
      })
    })
    
    toast({
      title: "Upload Started",
      description: `${fileArray.length} file(s) are now uploading`,
    })
  }

  const handleUploadSubmit = () => {
    // Add uploaded files to the current folder
    const uploadedFiles = uploadingFiles.filter(f => f.status === 'uploaded')
    
    if (uploadedFiles.length > 0) {
      // Add uploaded files to the current objects list
      const newObjects = uploadedFiles.map((uploadItem, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        name: uploadItem.file.name,
        type: uploadItem.file.type.startsWith('image/') ? 'image' : 'file',
        size: `${(uploadItem.file.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date().toISOString(),
        storageClass: 'Standard',
        path: currentPath.length > 0 ? `${currentPath.join('/')}/${uploadItem.file.name}` : uploadItem.file.name
      }))
      
      // Add to objects list
      setObjects(prev => [...newObjects, ...prev])
      
      toast({
        title: "Files Uploaded Successfully",
        description: `${uploadedFiles.length} file(s) have been uploaded to the current folder`,
      })
    }
    
    // Close the modal and reset states
    setShowUploadModal(false)
    setUploadingFiles([])
    setUploadedFiles([])
  }

  const handleUploadCancel = () => {
    // Clear all upload intervals to prevent memory leaks
    uploadingFiles.forEach(uploadItem => {
      if (uploadItem.intervalId) {
        clearInterval(uploadItem.intervalId)
      }
    })
    
    setShowUploadModal(false)
    setUploadedFiles([])
    setUploadingFiles([])
    
    toast({
      title: "Upload Cancelled",
      description: "All uploads have been cancelled and the modal has been closed",
    })
  }

  const handleUploadMore = () => {
    // Add existing uploaded files to the current folder
    const uploadedFiles = uploadingFiles.filter(f => f.status === 'uploaded')
    
    if (uploadedFiles.length > 0) {
      const newObjects = uploadedFiles.map((uploadItem, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        name: uploadItem.file.name,
        type: uploadItem.file.type.startsWith('image/') ? 'image' : 'file',
        size: `${(uploadItem.file.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date().toISOString(),
        storageClass: 'Standard',
        path: currentPath.length > 0 ? `${currentPath.join('/')}/${uploadItem.file.name}` : uploadItem.file.name
      }))
      
      setObjects(prev => [...newObjects, ...prev])
      
      toast({
        title: "Files Uploaded Successfully",
        description: `${uploadedFiles.length} file(s) have been uploaded to the current folder`,
      })
    }
    
    // Reset modal to upload box state
    setUploadingFiles([])
    setUploadedFiles([])
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Cancel upload handler
  const handleCancelUpload = (fileIndex: number) => {
    setUploadingFiles(prev => {
      const updated = [...prev]
      const uploadItem = updated[fileIndex]
      
      // Clear the interval if it exists
      if (uploadItem.intervalId) {
        clearInterval(uploadItem.intervalId)
      }
      
      // Remove the item from the list
      updated.splice(fileIndex, 1)
      return updated
    })
    
    toast({
      title: "Upload Cancelled",
      description: "The upload has been cancelled successfully",
    })
  }

  // Reload upload handler
  const handleReloadUpload = (fileIndex: number) => {
    setUploadingFiles(prev => {
      const updated = [...prev]
      const uploadItem = updated[fileIndex]
      
      // Reset progress and status
      updated[fileIndex] = {
        ...uploadItem,
        progress: 0,
        status: 'uploading' as const
      }
      
      // Start new upload simulation
      const interval = setInterval(() => {
        setUploadingFiles(current => {
          const currentUpdated = [...current]
          const currentFileIndex = currentUpdated.findIndex(item => item.file === uploadItem.file)
          
          if (currentFileIndex !== -1) {
            if (currentUpdated[currentFileIndex].progress < 100) {
              currentUpdated[currentFileIndex].progress += Math.random() * 20 + 5
            } else {
              currentUpdated[currentFileIndex].status = 'uploaded'
              clearInterval(interval)
              
              // Add to objects list when upload completes
              const newFile = {
                id: `file-${Date.now()}-${Math.random()}`,
                name: uploadItem.file.name,
                type: "file",
                lastModified: new Date().toISOString(),
                storageClass: "Standard",
                size: `${(uploadItem.file.size / 1024 / 1024).toFixed(2)} MB`
              }
              
              setObjects(prev => [newFile, ...prev])
            }
          }
          
          return currentUpdated
        })
      }, 200)
      
      // Store the interval ID
      updated[fileIndex].intervalId = interval
      
      return updated
    })
    
    toast({
      title: "Upload Restarted",
      description: "The upload has been restarted successfully",
    })
  }

  // Remove completed upload handler
  const handleRemoveCompletedUpload = (fileIndex: number) => {
    setUploadingFiles(prev => {
      const updated = [...prev]
      updated.splice(fileIndex, 1)
      return updated
    })
    
    toast({
      title: "Upload Removed",
      description: "The completed upload has been removed from the list",
    })
  }

  const tabs = [
    { id: "objects", label: "Objects" },
    { id: "rules", label: "Rules" },
    { id: "properties", label: "Properties" },
    { id: "bucket-policy", label: "Bucket Policy" },
  ]

  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/storage", title: "Storage" },
    { href: "/storage/object", title: "Object Storage" },
    { href: `/storage/object/${bucket.id}/objects`, title: bucket.name }
  ]

  // Columns for lifecycle rules table
  const rulesColumns = [
    {
      key: "ruleName",
      label: "Rule Name",
      sortable: true,
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      key: "expirationDays",
      label: (
        <div className="text-left leading-tight">
          <div>Expiration</div>
          <div>Days</div>
        </div>
      ),
      sortable: true,
      render: (value: string) => (
        <span>{value}</span>
      ),
    },
    {
      key: "noncurrentDays",
      label: (
        <div className="text-left leading-tight">
          <div>Noncurrent</div>
          <div>Days</div>
        </div>
      ),
      sortable: true,
      render: (value: string) => (
        <span>{value}</span>
      ),
    },
    {
      key: "newerNoncurrentVersions",
      label: (
        <div className="text-left leading-tight">
          <div>Newer Noncurrent</div>
          <div>Versions</div>
        </div>
      ),
      sortable: true,
      render: (value: string) => (
        <span>{value}</span>
      ),
    },
    {
      key: "multipartUploads",
      label: (
        <div className="text-left leading-tight">
          <div>Multipart</div>
          <div>Uploads</div>
        </div>
      ),
      sortable: true,
      render: (value: string) => (
        <span>{value}</span>
      ),
    },
    {
      key: "typeOfTimestamp",
      label: (
        <div className="text-left leading-tight">
          <div>Type of</div>
          <div>Timestamp</div>
        </div>
      ),
      sortable: true,
      render: (value: string) => (
        <span>{value}</span>
      ),
    },
    {
      key: "enabled",
      label: "Enabled",
      sortable: true,
      render: (value: boolean) => (
        <span className={value ? "text-green-600" : "text-red-600"}>
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "expiredObjectDeleteMarker",
      label: (
        <div className="text-left leading-tight">
          <div>Expired Object</div>
          <div>Delete Marker</div>
        </div>
      ),
      sortable: true,
      render: (value: string) => (
        <span>{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (value: string, row: any) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/storage/object/${id}/objects/rules/${row.id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Rule
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteRule(row)}
                className="text-red-600 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Rule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          {row.type === "folder" ? (
            <Folder className="w-4 h-4 text-foreground" />
          ) : row.type === "navigation" ? (
            <ArrowUp className="w-4 h-4 text-gray-600" />
          ) : row.name.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i) ? (
            <Image className="w-4 h-4 text-foreground" />
          ) : (
            <File className="w-4 h-4 text-foreground" />
          )}
          {row.type === "folder" ? (
            <button
              onClick={() => handleFolderClick(value)}
              className="font-medium text-foreground hover:underline cursor-pointer"
            >
              {value}
            </button>
          ) : row.type === "navigation" ? (
            <button
              onClick={handleGoBack}
              className="font-medium text-gray-600 hover:text-gray-800 hover:underline cursor-pointer"
            >
              {value}
            </button>
          ) : (
            <span className="font-medium hover:underline cursor-pointer">{value}</span>
          )}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string, row: any) => (
        row.type === "navigation" ? null : (
          <span className="capitalize text-muted-foreground">{value}</span>
        )
      ),
    },
    {
      key: "lastModified",
      label: "Last Modified",
      sortable: true,
      render: (value: string, row: any) => (
        row.type === "navigation" ? null : (
          <span className="text-muted-foreground">
            {value ? new Date(value).toLocaleDateString() : "-"}
          </span>
        )
      ),
    },
    {
      key: "storageClass",
      label: "Storage Class",
      sortable: true,
      render: (value: string, row: any) => (
        row.type === "navigation" ? null : (
          <span className="text-muted-foreground">{value}</span>
        )
      ),
    },
    {
      key: "actions",
      label: "",
      sortable: false,
      render: (value: string, row: any) => (
        row.type === "navigation" ? null : (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {row.type === "folder" ? (
                  <DropdownMenuItem 
                    onClick={() => handleDeleteObject(row)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete folder
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => handleDownload(row.name)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyPresignedUrl(row.name)}>
                      <Link className="h-4 w-4 mr-2" />
                      Copy presigned URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRename(row)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMoveObject(row)}>
                      <Move className="h-4 w-4 mr-2" />
                      Move object
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteObject(row)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete object
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      ),
    },
  ]

  return (
    <PageLayout
      title={bucket.name}
      customBreadcrumbs={customBreadcrumbs}
      headerActions={
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <Button variant="outline" size="sm" onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button size="sm" onClick={() => setShowCreateFolderModal(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 border border-gray-200 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={handleDeactivateSession}
                    className="text-red-600 hover:bg-red-50 hover:text-red-600"
                  >
                    Deactivate Session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      }
      hideViewDocs={true}
    >
      <div className="space-y-6">
        <VercelTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          size="lg"
        />

        {activeTab === "objects" && (
          isAuthenticated ? (
            <div className="space-y-4">
              {/* Search and Refresh */}
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-sm">
                  <Input
                    placeholder="Search objects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-9 w-9 p-0 border border-gray-200 rounded-md">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="bg-black text-white border-black"
                      sideOffset={8}
                      side="top"
                      align="center"
                      avoidCollisions={true}
                      collisionPadding={15}
                    >
                      <p className="text-xs font-medium">
                        {lastRefreshed 
                          ? `Last refreshed: ${formatRelativeTime(lastRefreshed)}` 
                          : 'Never refreshed'
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Table */}
              <div className="[&_tbody_tr_td]:py-3">
                <ShadcnDataTable
                  columns={columns}
                  data={getTableData()}
                  searchableColumns={["name"]}
                  pageSize={10}
                  enableSearch={false}
                  enableColumnVisibility={false}
                  enablePagination={true}
                  enableVpcFilter={false}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">Create Session</h2>
                    <p className="text-sm text-gray-600">Region: Bengaluru</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="access-key" className="text-sm font-medium text-gray-700">Access Key</Label>
                      <Input
                        id="access-key"
                        type="text"
                        placeholder="Enter access key"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secret-key" className="text-sm font-medium text-gray-700">Secret Key</Label>
                      <Input
                        id="secret-key"
                        type="password"
                        placeholder="Enter secret key"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleCreateSession}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      size="lg"
                    >
                      Create Session
                    </Button>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Don't have keys?{" "}
                        <button
                          onClick={handleCreateAPIKeys}
                          className="text-black hover:text-gray-700 font-medium hover:underline focus:outline-none focus:underline transition-colors duration-200"
                        >
                          Create API keys
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
        
        {activeTab === "rules" && (
          <div className="space-y-6">
            {/* Header with Search, Create Rule button, and Refresh */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder="Search rules..."
                  value={rulesSearchQuery}
                  onChange={(e) => setRulesSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/storage/object/${id}/objects/rules/create`)}
                >
                  Create Rule
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={handleRulesRefresh} className="h-9 w-9 p-0 border border-gray-200 rounded-md">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="bg-black text-white border-black"
                      sideOffset={8}
                      side="top"
                      align="center"
                      avoidCollisions={true}
                      collisionPadding={15}
                    >
                      <p className="text-xs font-medium">
                        {lastRefreshed 
                          ? `Last refreshed: ${formatRelativeTime(lastRefreshed)}` 
                          : 'Never refreshed'
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-full [&_tbody_tr_td]:py-3 [&_thead_th]:text-left [&_thead_th]:leading-tight [&_thead_th]:py-3 [&_thead_th]:h-auto [&_thead_th]:min-w-[80px] [&_thead_th]:whitespace-normal [&_thead_th]:align-top [&_thead_th]:px-3 [&_tbody_tr_td]:px-3">
                <ShadcnDataTable
                  columns={rulesColumns}
                  data={mockLifecycleRules.filter(rule =>
                    rule.ruleName.toLowerCase().includes(rulesSearchQuery.toLowerCase()) ||
                    rule.status.toLowerCase().includes(rulesSearchQuery.toLowerCase()) ||
                    rule.typeOfTimestamp.toLowerCase().includes(rulesSearchQuery.toLowerCase())
                  )}
                  searchableColumns={["ruleName", "status", "typeOfTimestamp"]}
                  enableSearch={false}
                  enablePagination={true}
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "properties" && (
          <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
            <div className="space-y-6">
              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Tags (Optional)</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      You can use bucket tags to track storage costs and organize buckets
                    </p>
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={handleAddTag}
                    disabled={isAddTagDisabled()}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add More
                  </Button>
                </div>
                
                {/* Tags Form */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium text-muted-foreground">
                    <div>Key</div>
                    <div>Value</div>
                  </div>
                  
                  {tags.map((tag, index) => {
                    const keyInputKey = `${index}-key`
                    const valueInputKey = `${index}-value`
                    
                    return (
                      <div key={index} className="grid grid-cols-2 gap-4 items-center">
                        <Input
                          ref={(el) => { inputRefs.current[keyInputKey] = el }}
                          placeholder=""
                          value={tag.key}
                          onChange={(e) => handleTagChange(index, 'key', e.target.value)}
                          onFocus={() => { lastFocusedInput.current = keyInputKey }}
                          onBlur={() => { 
                            if (lastFocusedInput.current === keyInputKey) {
                              lastFocusedInput.current = null
                            }
                          }}
                          className="h-10"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            ref={(el) => { inputRefs.current[valueInputKey] = el }}
                            placeholder=""
                            value={tag.value}
                            onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                            onFocus={() => { lastFocusedInput.current = valueInputKey }}
                            onBlur={() => { 
                              if (lastFocusedInput.current === valueInputKey) {
                                lastFocusedInput.current = null
                              }
                            }}
                            className="h-10 flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTag(index)}
                            disabled={tags.length === 1 && (!tag.key.trim() || !tag.value.trim())}
                            className={`h-8 w-8 p-0 ${
                              tags.length === 1 && (!tag.key.trim() || !tag.value.trim())
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <Button onClick={saveTags} className="px-6">
                    Save Tags
                  </Button>
                </div>
              </div>
              
              {/* Delete Confirmation Modal */}
              <DeleteConfirmationModal
                isOpen={deleteConfirmationOpen}
                onClose={() => {
                  setDeleteConfirmationOpen(false)
                  setTagToDelete(null)
                }}
                resourceName={tagToDelete !== null ? `Tag: ${tags[tagToDelete]?.key || 'Empty'} = ${tags[tagToDelete]?.value || 'Empty'}` : ""}
                resourceType="Tag"
                onConfirm={confirmTagDelete}
              />
            </div>
          </div>
        )}
        
        {activeTab === "bucket-policy" && (
          <div className="bg-card text-card-foreground border-border border rounded-lg p-6">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-lg font-medium text-foreground">Bucket Policy</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure access permissions for your bucket
                </p>
              </div>

              {/* Policy ID */}
              <div className="space-y-2">
                <Label htmlFor="policyId" className="text-sm font-medium">
                  Policy ID
                </Label>
                {policyExists ? (
                  <div className="h-10 px-3 py-2 bg-muted rounded-md border border-input text-sm">
                    {policyData.policyId}
                  </div>
                ) : (
                  <Input
                    id="policyId"
                    value={policyData.policyId}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, policyId: e.target.value }))}
                    className="h-10"
                  />
                )}
              </div>

              {/* Read-Write IPs */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Read-Write IPs</Label>
                <p className="text-xs text-muted-foreground">
                  Separate multiple IPs with commas
                </p>
                <Input
                  placeholder="eg. 192.168.1.1, * (use * for all IPs)"
                  value={policyData.readWriteIPs[0]}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, readWriteIPs: [e.target.value] }))}
                  className="h-10"
                />
              </div>

              {/* Read-Only IPs */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Read-Only IPs</Label>
                <p className="text-xs text-muted-foreground">
                  Separate multiple IPs with commas
                </p>
                <Input
                  placeholder="eg. 192.168.1.1, * (use * for all IPs)"
                  value={policyData.readOnlyIPs[0]}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, readOnlyIPs: [e.target.value] }))}
                  className="h-10"
                />
              </div>

              {/* Timestamps */}
              <div className="space-y-1 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Created: 7/29/2025, 3:57:19 PM</p>
                <p className="text-xs text-muted-foreground">Last Updated: 7/29/2025, 3:59:24 PM</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                {policyExists ? (
                  <>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeletePolicy}
                      className="px-6"
                    >
                      Delete Policy
                    </Button>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Success",
                          description: "Bucket policy updated successfully",
                        })
                      }}
                      className="px-6"
                    >
                      Update Policy
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => {
                      const validatePolicyIPs = (ipString: string) => {
                        if (!ipString || ipString.trim() === "") return false
                        const ips = ipString.split(',').map(ip => ip.trim()).filter(ip => ip !== "")
                        const hasValidIP = ips.some(ip => ip !== "*" && ip.length > 0)
                        return hasValidIP
                      }
                      
                      const readWriteValid = validatePolicyIPs(policyData.readWriteIPs[0])
                      const readOnlyValid = validatePolicyIPs(policyData.readOnlyIPs[0])
                      
                      if (!readWriteValid && !readOnlyValid) {
                        toast({
                          title: "Validation Error",
                          description: "Please enter at least one IP address in addition to asterisk (*) in either Read-Write IPs or Read-Only IPs",
                          variant: "destructive"
                        })
                        return
                      }
                      
                      setPolicyExists(true)
                      setPolicyData(prev => ({
                        ...prev,
                        policyId: "km:kos:colo-1:6951281219:e5a028ad-c239-4f0e-b9ee-63dfc4001545:bucket:406ee2e8-25e7-4dd7-98ab-fdc30bc5753e"
                      }))
                      toast({
                        title: "Success",
                        description: "Bucket policy created successfully",
                      })
                    }}
                    className="px-6"
                  >
                    Create Policy
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Create Folder</h2>
            
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Do not use / in folder names. The system will handle path formatting.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleCreateFolderCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateFolderSubmit}
                disabled={!folderName.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 overflow-hidden max-h-[80vh]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  {uploadingFiles.length === 0 
                    ? "Upload Documents" 
                    : uploadingFiles.some(f => f.status === 'uploading')
                    ? "Uploading Files"
                    : "Files Uploaded"
                  }
                </h2>
                {uploadingFiles.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Add your files here, all file types accepted with max size of 1024 GB.
                  </p>
                )}
              </div>
              <button
                onClick={handleUploadCancel}
                className="text-muted-foreground hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded mt-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Upload Area - Hidden when files are selected */}
              {uploadingFiles.length === 0 && (
                              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors bg-gray-50"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.multiple = true
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files
                    if (files && files.length > 0) {
                      handleFileUpload(files)
                    }
                  }
                  input.click()
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-blue-400', 'bg-blue-50')
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                  
                  const files = e.dataTransfer.files
                  if (files && files.length > 0) {
                    handleFileUpload(files)
                  }
                }}
              >
                                  <div className="flex flex-col items-center space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <CloudUpload className="w-8 h-8 text-gray-600" />
                  </div>
                  
                  {/* Instructions */}
                  <div className="space-y-2 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Drag and drop your files here
                    </p>
                    <p className="text-xs text-gray-500">or</p>
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.multiple = true
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files
                            if (files && files.length > 0) {
                              handleFileUpload(files)
                            }
                          }
                          input.click()
                        }}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
                </div>
              )}

              {/* Upload Progress Display */}
              {uploadingFiles.length > 0 && (
                <div className="space-y-2 max-h-[448px] md:max-h-[448px] max-h-[448px] overflow-y-auto gap-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                      {uploadingFiles.map((uploadItem, index) => (
                      <div key={index} className="rounded-lg mb-2 p-3 bg-gray-50">
                                              <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <File className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm font-medium truncate">{uploadItem.file.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            ({(uploadItem.file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {uploadItem.status === 'uploading' && (
                            <button 
                              className="text-gray-500 hover:text-gray-700 p-1"
                              onClick={() => handleCancelUpload(index)}
                              title="Cancel upload"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          {uploadItem.status === 'error' && (
                            <>
                              <button 
                                className="text-gray-500 hover:text-gray-700 p-1"
                                onClick={() => handleReloadUpload(index)}
                                title="Retry upload"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-gray-500 hover:text-gray-700 p-1"
                                onClick={() => handleCancelUpload(index)}
                                title="Cancel upload"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {uploadItem.status === 'uploaded' && (
                            <button 
                              className="text-gray-500 hover:text-gray-700 p-1"
                              onClick={() => handleRemoveCompletedUpload(index)}
                              title="Remove from list"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar with Percentage */}
                      <div className="flex items-center justify-center gap-2">
                        <div className={`flex-1 rounded-full h-2 min-w-0 ${
                          uploadItem.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          <div 
                            className={`h-2 rounded-full transition-all duration-200 ${
                              uploadItem.status === 'uploaded' 
                                ? 'bg-gray-800' 
                                : uploadItem.status === 'error'
                                ? 'bg-red-500'
                                : 'bg-gray-800'
                            }`}
                            style={{ width: `${uploadItem.status === 'uploading' ? uploadItem.progress : uploadItem.status === 'uploaded' ? 100 : uploadItem.status === 'error' ? 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-center">
                          {uploadItem.status === 'uploading' ? `${Math.round(uploadItem.progress)}%` : 
                           uploadItem.status === 'uploaded' ? '100%' : 'Error'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}


            </div>

            {uploadingFiles.length > 0 && (
              <div className="flex justify-between gap-3 mt-6">
                <div className="flex-1">
                  <Button 
                    variant="outline" 
                    onClick={handleUploadMore}
                    className="flex items-center gap-2"
                    disabled={!uploadingFiles.some(f => f.status === 'uploaded')}
                  >
                    <Plus className="h-4 w-4" />
                    Upload Files
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleUploadCancel}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUploadSubmit}
                    disabled={uploadingFiles.some(f => f.status === 'uploading')}
                  >
                    {uploadingFiles.length > 0 ? 'Done' : 'Upload'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rename Object Modal */}
      {showRenameModal && selectedObjectToRename && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleRenameCancel}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Rename object</h2>
              <button
                onClick={handleRenameCancel}
                className="text-muted-foreground hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                <strong>NOTE:</strong> Please don't enter file extension and Do not use / in file names. The system will handle path formatting.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleRenameCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleRenameSubmit}
                disabled={!renameValue.trim()}
              >
                Rename
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Move Object Modal */}
      {showMoveObjectModal && selectedObjectToMove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Move Object</h2>
              <button
                onClick={handleMoveObjectCancel}
                className="text-muted-foreground hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Object Info */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded flex items-center justify-center">
                {selectedObjectToMove.type === "folder" ? "📁" : "📄"}
              </div>
              <span className="font-medium">{selectedObjectToMove.name}</span>
            </div>

            {/* Select Destination Folder */}
            <div className="mb-4 flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Select destination folder
              </label>
              <div className="border rounded-lg flex flex-col">
                <div className="overflow-y-auto" style={{ height: '240px' }}>
                  {/* Go back option - Always first */}
                  {moveModalCurrentPath.length > 0 && (
                    <div
                      className="p-3 cursor-pointer hover:bg-blue-50/50 focus:bg-blue-50 flex items-center gap-2 border-b border-gray-100"
                      onClick={handleMoveModalGoBack}
                      tabIndex={0}
                    >
                      <ArrowUp className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">.. (Go back)</span>
                    </div>
                  )}
                  
                  {/* Create folder interface - Second */}
                  {showCreateFolderInMove && (
                    <div className="p-3 border-b border-gray-100 flex items-center gap-2">
                      <Folder className="w-4 h-4 text-foreground" />
                      <input
                        type="text"
                        value={newFolderNameInMove}
                        onChange={(e) => setNewFolderNameInMove(e.target.value)}
                        placeholder="Folder name"
                        className="flex-1 h-8 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleCreateFolderInMoveSubmit}
                        disabled={!newFolderNameInMove.trim()}
                        className="px-3 py-1 h-7"
                      >
                        Create
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateFolderInMoveCancel}
                        className="px-3 py-1 h-7"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  {/* Existing folders - Third onwards */}
                  {getMoveModalFolders().map((folder) => (
                    <div
                      key={folder.id}
                      className={`p-3 cursor-pointer hover:bg-blue-50/50 focus:bg-blue-50 flex items-center gap-2 ${
                        selectedDestinationFolder === folder.name ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedDestinationFolder(folder.name)}
                      onDoubleClick={() => handleMoveModalFolderClick(folder.name)}
                      tabIndex={0}
                    >
                      <Folder className="w-4 h-4 text-foreground" />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                {!showCreateFolderInMove && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateFolderInMove}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Folder
                  </Button>
                )}
              </div>
            </div>

            {/* Move From Path */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Move from
              </label>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
                /{bucket.name}/
              </div>
            </div>

            {/* Destination Path - Always visible */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Destination path
              </label>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
                {(() => {
                  let path = `/${bucket.name}/`
                  if (moveModalCurrentPath.length > 0) {
                    path += moveModalCurrentPath.join('/') + '/'
                  }
                  if (selectedDestinationFolder) {
                    path += selectedDestinationFolder + '/'
                  }
                  return path
                })()}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleMoveObjectCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleMoveObjectConfirm}
                disabled={!selectedDestinationFolder}
              >
                Move
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Object Confirmation Modal */}
      {showDeleteObjectModal && objectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Delete {objectToDelete.type === "folder" ? "Folder" : "Object"}</h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <strong>{objectToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleDeleteObjectCancel}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteObjectConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Rule Confirmation Modal */}
      {showDeleteRuleModal && ruleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Delete Rule</h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the rule <strong>{ruleToDelete.ruleName}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleDeleteRuleCancel}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteRuleConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Policy Confirmation Modal */}
      {showDeletePolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Delete Bucket Policy</h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the bucket policy? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleDeletePolicyCancel}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeletePolicyConfirm}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
} 