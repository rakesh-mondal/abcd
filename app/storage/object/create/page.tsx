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
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BucketNamingRulesModal } from "@/components/modals/bucket-naming-rules-modal"

interface Tag {
  key: string
  value: string
}

export default function CreateBucketPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    bucketName: "",
    region: "",
    accessControl: "",
    bucketVersioning: false,
  })
  const [tags, setTags] = useState<Tag[]>([{ key: "", value: "" }])
  const [showNamingRulesModal, setShowNamingRulesModal] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }

  const handleAddTag = () => {
    setTags([...tags, { key: "", value: "" }])
  }

  const handleRemoveTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index))
    }
  }

  const handleTagChange = (index: number, field: 'key' | 'value', value: string) => {
    const newTags = [...tags]
    newTags[index][field] = value
    setTags(newTags)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate bucket creation
    toast({
      title: "Bucket created successfully",
      description: `${formData.bucketName} has been created in ${formData.region}.`,
    })
    router.push("/storage/object")
  }

  return (
    <PageLayout 
      title="Create Bucket" 
      description=""
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                {/* Bucket Configuration */}
                <div className="mb-8">
                  <div className="mb-5">
                    <Label htmlFor="bucketName" className="block mb-2 font-medium">
                      Bucket Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bucketName"
                      placeholder="Enter your bucket name"
                      value={formData.bucketName}
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 3 characters and bucket name must be unique within the global namespace and follow the{" "}
                      <button 
                        type="button"
                        onClick={() => setShowNamingRulesModal(true)}
                        className="text-primary hover:underline"
                      >
                        Bucket Naming Rules
                      </button>
                    </p>
                  </div>

                  <div className="mb-5">
                    <Label htmlFor="region" className="block mb-2 font-medium">
                      Region <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-bangalore-1">In-Bangalore-1</SelectItem>
                        <SelectItem value="in-hyderabad-1">In-Hyderabad-1</SelectItem>
                        <SelectItem value="in-mumbai-1">In-Mumbai-1</SelectItem>
                      </SelectContent>
                    </Select>
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

                  {/* Bucket Versioning */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="font-medium">Bucket Versioning</Label>
                        <p className="text-xs text-muted-foreground">
                          Store different versions of the same object without losing
                        </p>
                      </div>
                      <Switch
                        checked={formData.bucketVersioning}
                        onCheckedChange={(checked) => handleSwitchChange("bucketVersioning", checked)}
                      />
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> Once you enable the Bucket Versioning you can't disable it
                      </p>
                    </div>
                  </div>

                  {/* Default Encryption */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="font-medium">Default Encryption</Label>
                        <p className="text-xs text-muted-foreground">
                          Server-side encryption is automatically applied to new objects stored in this bucket.
                        </p>
                      </div>
                      <Switch checked={true} disabled />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="space-y-1">
                        <Label className="font-medium">Tags (optional)</Label>
                        <p className="text-xs text-muted-foreground">
                          You can use bucket tags to track storage costs and organize buckets
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleAddTag} type="button">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Tag
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {tags.map((tag, index) => (
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
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTag(index)}
                            disabled={tags.length === 1}
                            type="button"
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
                className="hover:bg-secondary transition-colors"
                onClick={() => router.push("/storage/object")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-black text-white hover:bg-black/90 transition-colors hover:scale-105"
                onClick={handleSubmit}
                disabled={!formData.bucketName || !formData.region || !formData.accessControl}
              >
                Create Bucket
              </Button>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="w-full md:w-80 space-y-6">
          {/* Price Summary */}
          {/* <div 
            style={{
              borderRadius: '16px',
              border: '4px solid #FFF',
              background: 'linear-gradient(265deg, #FFF -13.17%, #F7F8FD 133.78%)',
              boxShadow: '0px 8px 39.1px -9px rgba(0, 27, 135, 0.08)',
              padding: '1.5rem'
            }}
          >
            <div className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Price Summary</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">First Bucket</Badge>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-600">Free</div>
                <p className="text-sm text-muted-foreground">
                  Your first storage bucket is free! This includes basic bucket setup and storage.
                </p>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <p>• First Bucket: ₹0.00/month</p>
                  <p>• Storage: ₹2.50/GB/month</p>
                  <p>• Data transfer charges apply</p>
                </div>
              </div>
            </div>
          </div> */}

          {/* Configuration Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal">Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Choose a descriptive bucket name for easy identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Select the region closest to your users for better performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Use private access control for better security</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Plan your versioning strategy to avoid storage conflicts</span>
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