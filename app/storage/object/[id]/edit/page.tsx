"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { PageLayout } from "../../../../../components/page-layout"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Switch } from "../../../../../components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Trash2 } from "lucide-react"
import { useToast } from "../../../../../hooks/use-toast"
import { BucketNamingRulesModal } from "../../../../../components/modals/bucket-naming-rules-modal"

// Mock function to get bucket by ID (same as details page)
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

export default function EditBucketPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [showNamingRulesModal, setShowNamingRulesModal] = useState(false)
  const bucket = getBucket(params.id)

  if (!bucket) {
    notFound()
  }

  // Initialize form data with existing bucket data
  const [formData, setFormData] = useState({
    bucketName: bucket.name,
    region: bucket.region,
    accessControl: bucket.accessControl,
    bucketVersioning: bucket.bucketVersioning,
    defaultEncryption: bucket.defaultEncryption,
    tags: bucket.tags
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleAddTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { key: "", value: "" }]
    }))
  }

  const handleTagChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => 
        i === index ? { ...tag, [field]: value } : tag
      )
    }))
  }

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Bucket updated successfully",
        description: `${formData.bucketName} has been updated.`,
      })
      router.push(`/storage/object/${bucket.id}`)
    }, 1000)
  }

  const customBreadcrumbs = [
    { href: "/dashboard", title: "Home" },
    { href: "/storage", title: "Storage" },
    { href: "/storage/object", title: "Object Storage" },
    { href: `/storage/object/${bucket.id}`, title: bucket.name },
    { href: `/storage/object/${bucket.id}/edit`, title: "Edit" }
  ]

  return (
    <PageLayout title="Edit Bucket" customBreadcrumbs={customBreadcrumbs} hideViewDocs={true}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                {/* Bucket Configuration */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bucketName" className="text-sm font-medium">
                      Bucket name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bucketName"
                      name="bucketName"
                      placeholder="Enter your bucket name"
                      value={formData.bucketName}
                      onChange={handleChange}
                      required
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-sm text-muted-foreground">
                      Bucket name cannot be modified after creation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-sm font-medium">
                      Region <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)} disabled>
                      <SelectTrigger className="bg-gray-50 cursor-not-allowed">
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In-Bangalore-1">In-Bangalore-1</SelectItem>
                        <SelectItem value="In-Hyderabad-1">In-Hyderabad-1</SelectItem>
                        <SelectItem value="In-Mumbai-1">In-Mumbai-1</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Region cannot be modified after creation.
                    </p>
                  </div>

                  <div className="space-y-2 mb-5">
                    <Label htmlFor="accessControl" className="text-sm font-medium">
                      Access Control <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.accessControl} onValueChange={(value) => handleSelectChange("accessControl", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Access Control" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Bucket versioning</Label>
                        <p className="text-sm text-muted-foreground">
                          Store different versions of the same object without losing
                        </p>
                      </div>
                      <Switch
                        checked={formData.bucketVersioning}
                        onCheckedChange={(checked) => handleSwitchChange("bucketVersioning", checked)}
                        disabled
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bucket versioning cannot be modified after creation.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Default encryption</Label>
                        <p className="text-sm text-muted-foreground">
                          Server-side encryption is automatically applied to new objects stored in this bucket.
                        </p>
                      </div>
                      <Switch
                        checked={formData.defaultEncryption}
                        onCheckedChange={(checked) => handleSwitchChange("defaultEncryption", checked)}
                        disabled
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Default encryption cannot be modified after creation.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Tags (optional)</Label>
                        <p className="text-sm text-muted-foreground">
                          You can use bucket tags to track storage costs and organize buckets
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                        Add Tag
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Input
                            placeholder="Key"
                            value={tag.key}
                            onChange={(e) => handleTagChange(index, 'key', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value"
                            value={tag.value}
                            onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTag(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="flex justify-end gap-4 px-6 pb-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/storage/object/${bucket.id}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={!formData.accessControl}
              >
                Update Bucket
              </Button>
            </div>
          </Card>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="text-sm text-muted-foreground flex">
                  <span className="mr-2">•</span>
                  <span>Choose a descriptive bucket name for easy identification</span>
                </li>
                <li className="text-sm text-muted-foreground flex">
                  <span className="mr-2">•</span>
                  <span>Select the region closest to your users for better performance</span>
                </li>
                <li className="text-sm text-muted-foreground flex">
                  <span className="mr-2">•</span>
                  <span>Enable versioning if you need to track object changes</span>
                </li>
                <li className="text-sm text-muted-foreground flex">
                  <span className="mr-2">•</span>
                  <span>Use tags to organize and track costs across projects</span>
                </li>
                <li className="text-sm text-muted-foreground flex">
                  <span className="mr-2">•</span>
                  <span>Default encryption is always enabled for security</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <BucketNamingRulesModal 
        open={showNamingRulesModal} 
        onClose={() => setShowNamingRulesModal(false)} 
      />
    </PageLayout>
  )
} 