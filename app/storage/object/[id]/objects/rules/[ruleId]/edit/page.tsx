"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

export default function EditRulePage({ params }: { params: { id: string; ruleId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  
  // Mock function to get bucket data (should be replaced with actual API call)
  const getBucket = (id: string) => {
    const mockBuckets = [
      {
        id: "1",
        name: "my-storage-bucket",
        region: "In-Bangalore-1",
        size: "2.34 GB",
        createdOn: "2025-01-15T08:30:00",
        status: "success",
        accessControl: "private",
        bucketVersioning: true,
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

  // Mock function to get rule data
  const getRule = (ruleId: string) => {
    const mockRules = [
      {
        id: "rule-1",
        ruleName: "Delete old files",
        expirationDays: "30",
        noncurrentDays: "7",
        newerNoncurrentVersions: "5",
        multipartUploads: "7",
        typeOfTimestamp: "Creation Date",
        enabled: true,
        expiredObjectDeleteMarker: "Yes",
        status: "Active",
        enableRule: true,
        deleteIncompleteMultipartUploads: 7,
        expireDeleteDefinition: "expire",
        timestampType: "creation-date",
        noncurrentVersionsDays: 7,
      },
      {
        id: "rule-2",
        ruleName: "Archive documents",
        expirationDays: "90",
        noncurrentDays: "30",
        newerNoncurrentVersions: "10",
        multipartUploads: "14",
        typeOfTimestamp: "Last Modified",
        enabled: false,
        expiredObjectDeleteMarker: "No",
        status: "Inactive",
        enableRule: false,
        deleteIncompleteMultipartUploads: 14,
        expireDeleteDefinition: "delete",
        timestampType: "last-modified",
        noncurrentVersionsDays: 30,
      }
    ]
    
    return mockRules.find(rule => rule.id === ruleId)
  }

  const bucket = getBucket(params.id)
  const rule = getRule(params.ruleId)

  if (!bucket) {
    return <div>Bucket not found</div>
  }

  if (!rule) {
    return <div>Rule not found</div>
  }

  // Initialize form data with existing rule data
  const [formData, setFormData] = useState({
    enableRule: rule.enableRule,
    ruleName: rule.ruleName,
    deleteIncompleteMultipartUploads: rule.deleteIncompleteMultipartUploads,
    expireDeleteDefinition: rule.expireDeleteDefinition,
    timestampType: rule.timestampType,
    expirationDays: parseInt(rule.expirationDays),
    noncurrentVersionsDays: rule.noncurrentVersionsDays,
  })

  const customBreadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Storage", href: "/storage" },
    { title: "Object Storage", href: "/storage/object" },
    { title: bucket.name, href: `/storage/object/${params.id}/objects` },
    { title: "Edit Rule", href: "" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: id.includes("Days") || id.includes("Uploads") ? parseInt(value) || 0 : value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, expireDeleteDefinition: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // TODO: Replace with actual API call
      console.log("Updating rule:", formData)
      
      toast({
        title: "Rule updated successfully",
        description: "Your lifecycle rule has been updated.",
      })
      
      // Navigate back to rules tab
      router.push(`/storage/object/${params.id}/objects?tab=rules`)
    } catch (error) {
      toast({
        title: "Error updating rule",
        description: "There was an error updating your lifecycle rule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.push(`/storage/object/${params.id}/objects?tab=rules`)
  }

  return (
    <PageLayout
      title="Edit Rule"
      customBreadcrumbs={customBreadcrumbs}
      hideViewDocs={true}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Enable Rule */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableRule" className="text-base">
                        Enable Rule
                      </Label>
                      <div className="text-[13px] text-muted-foreground">
                        Turn on or off this lifecycle rule
                      </div>
                    </div>
                    <Switch
                      id="enableRule"
                      checked={formData.enableRule}
                      onCheckedChange={(checked) => handleSwitchChange("enableRule", checked)}
                    />
                  </div>

                  {/* Rule Name */}
                  <div className="space-y-2">
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      value={formData.ruleName}
                      onChange={handleChange}
                      placeholder="Enter rule name"
                      required
                    />
                  </div>

                  {/* Delete Incomplete Multipart Uploads */}
                  <div className="space-y-2">
                    <Label htmlFor="deleteIncompleteMultipartUploads">Delete Incomplete Multipart Uploads (Days)</Label>
                    <Input
                      id="deleteIncompleteMultipartUploads"
                      type="number"
                      min="0"
                      value={formData.deleteIncompleteMultipartUploads}
                      onChange={handleChange}
                      placeholder="Enter number of days"
                    />
                  </div>

                  {/* Expire and Delete Definitions */}
                  <div className="space-y-3">
                    <Label>Expire and Delete Definitions</Label>
                    <RadioGroup
                      value={formData.expireDeleteDefinition}
                      onValueChange={handleRadioChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expire" id="expire" />
                        <Label htmlFor="expire">Expire current versions of objects</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delete" id="delete" />
                        <Label htmlFor="delete">Permanently delete current versions of objects</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Type of Timestamp */}
                  <div className="space-y-2">
                    <Label htmlFor="timestampType">Type of Timestamp</Label>
                    <Select
                      value={formData.timestampType}
                      onValueChange={(value) => handleSelectChange("timestampType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timestamp type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="creation-date">Creation Date</SelectItem>
                        <SelectItem value="last-modified">Last Modified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Expiration Days */}
                  <div className="space-y-2">
                    <Label htmlFor="expirationDays">Expiration Days</Label>
                    <Input
                      id="expirationDays"
                      type="number"
                      min="0"
                      value={formData.expirationDays}
                      onChange={handleChange}
                      placeholder="Enter number of days"
                    />
                  </div>

                  {/* Permanently Delete Noncurrent Versions */}
                  <div className="space-y-2">
                    <Label htmlFor="noncurrentVersionsDays">Permanently Delete Noncurrent Versions (Days)</Label>
                    <Input
                      id="noncurrentVersionsDays"
                      type="number"
                      min="0"
                      value={formData.noncurrentVersionsDays}
                      onChange={handleChange}
                      placeholder="Enter number of days"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Update Rule
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Tips Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-normal">Configuration Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Review your rule settings carefully before updating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Changes to lifecycle rules may take time to propagate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Consider the impact on existing objects when modifying rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Test your rule logic with a small subset of objects first</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-normal">Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use descriptive rule names for easy identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Set appropriate expiration periods based on data retention policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Monitor rule performance and adjust as needed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 