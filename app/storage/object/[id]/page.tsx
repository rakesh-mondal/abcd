"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { PageLayout } from "../../../../components/page-layout"
import { DetailGrid } from "../../../../components/detail-grid"
import { Button } from "../../../../components/ui/button"
import { DeleteConfirmationModal } from "../../../../components/delete-confirmation-modal"
import { StatusBadge } from "../../../../components/status-badge"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "../../../../hooks/use-toast"

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

export default function BucketDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  // Redirect to objects page immediately
  router.push(`/storage/object/${params.id}/objects`)
  
  return null
} 