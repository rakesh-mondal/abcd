"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { HelpCircle, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddPolicyModalProps {
  open: boolean
  onClose: () => void
  onSave: (policy: any) => void
  mode: "add" | "edit"
  type: "snapshot" | "backup"
  initialPolicy?: any
  volume?: { name: string; size: string; type: string }
}

export function AddPolicyModal({ open, onClose, onSave, mode, type, initialPolicy, volume }: AddPolicyModalProps) {
  const { toast } = useToast()
  
  // Form state
  const [maxBackups, setMaxBackups] = useState(initialPolicy?.maxBackups || "5")
  const [description, setDescription] = useState(initialPolicy?.description || "")
  const [customName, setCustomName] = useState(initialPolicy?.name || "")
  const [incremental, setIncremental] = useState(initialPolicy?.incremental || false)
  
  // Policy scheduler state
  const [minute, setMinute] = useState(initialPolicy?.minute || "30")
  const [hour, setHour] = useState(initialPolicy?.hour || "")
  const [dayOfMonth, setDayOfMonth] = useState(initialPolicy?.dayOfMonth || "*")
  const [month, setMonth] = useState(initialPolicy?.month || "*")
  const [dayOfWeek, setDayOfWeek] = useState(initialPolicy?.dayOfWeek || "*")

  const formRef = useRef<HTMLFormElement>(null)

  // Generate CRON expression
  const generateCronExpression = () => {
    const monthMap: { [key: string]: string } = {
      "Jan": "1", "Feb": "2", "Mar": "3", "Apr": "4", "May": "5", "Jun": "6",
      "Jul": "7", "Aug": "8", "Sep": "9", "Oct": "10", "Nov": "11", "Dec": "12"
    }
    
    const cronMinute = minute.trim() === "" || minute === "*" ? "*" : minute
    const cronHour = hour.trim() === "" || hour === "*" ? "*" : hour
    const cronDayOfMonth = dayOfMonth.trim() === "" || dayOfMonth === "*" ? "*" : dayOfMonth
    const cronMonth = month.trim() === "" || month === "*" ? "*" : (monthMap[month] || month)
    const cronDayOfWeek = dayOfWeek.trim() === "" || dayOfWeek === "*" ? "*" : dayOfWeek
    
    return `${cronMinute} ${cronHour} ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`
  }

  // Generate CRON explanation
  const generateCronExplanation = () => {
    const conditions = []
    
    if (minute.trim() !== "" && minute !== "*") {
      conditions.push(`at every ${minute} minutes`)
    }
    
    if (hour.trim() !== "" && hour !== "*") {
      conditions.push(`at hour ${hour}`)
    }
    
    if (dayOfMonth.trim() !== "" && dayOfMonth !== "*") {
      conditions.push(`on day ${dayOfMonth} of the month`)
    }
    
    if (month.trim() !== "" && month !== "*") {
      conditions.push(`in ${month}`)
    }
    
    if (dayOfWeek.trim() !== "" && dayOfWeek !== "*") {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const dayName = dayNames[parseInt(dayOfWeek)] || `day ${dayOfWeek}`
      conditions.push(`on ${dayName}`)
    }
    
    if (conditions.length === 0) {
      return "This policy will run every minute (no constraints specified)."
    }
    
    if (conditions.length === 1) {
      return `This policy will run ${conditions[0]}.`
    }
    
    return `This policy will run when all these conditions are met: ${conditions.join(", ")}.`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const policy = {
      name: customName || "Backup Policy",
      description,
      maxBackups: parseInt(maxBackups),
      incremental,
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
      cronExpression: generateCronExpression(),
      cronExplanation: generateCronExplanation(),
      nextExecution: "20/12/2024, 14:00:00" // Mock next execution
    }
    
    onSave(policy)
    onClose()
    
    toast({
      title: mode === "add" ? "Policy Created" : "Policy Updated",
      description: `${type === "snapshot" ? "Snapshot" : "Backup"} policy "${policy.name}" has been ${mode === "add" ? "created" : "updated"} successfully.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white max-w-[60vw] max-h-[85vh] w-[60vw] h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 p-6 border-b">
          <DialogTitle className="text-2xl font-semibold">
            {mode === "add" ? `Create ${type === "snapshot" ? "Snapshot" : "Backup"} Policy` : `Edit ${type === "snapshot" ? "Snapshot" : "Backup"} Policy`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-6 min-h-0 p-6">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto" style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}>
            <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
              {/* Custom Name Override */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="customName" className="font-medium">
                    Policy Name
                  </Label>
                  <TooltipWrapper 
                    content="Leave empty to use the auto-generated name. Only alphanumeric characters, hyphens, and underscores allowed." 
                    side="top"
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipWrapper>
                </div>
                <Input 
                  id="customName" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter custom policy name" 
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              
              {/* Description */}
              <div>
                <Label htmlFor="description" className="block mb-2 font-medium">
                  Description
                </Label>
                <Textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter policy description" 
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[80px]"
                />
              </div>

              {/* Maximum Backups */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="maxBackups" className="font-medium">
                    Maximum Backups <span className="text-destructive">*</span>
                  </Label>
                  <TooltipWrapper 
                    content="When this limit is reached, the oldest backup will be replaced." 
                    side="top"
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipWrapper>
                </div>
                <Select value={maxBackups} onValueChange={setMaxBackups} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 10}, (_, i) => (
                      <SelectItem key={i+1} value={String(i+1)}>{i+1} backup{i+1 > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Incremental Backup Toggle */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="font-medium">
                    Incremental Backup
                  </Label>
                  <TooltipWrapper 
                    content="Incremental backups only store changes since the last backup, saving storage space." 
                    side="top"
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipWrapper>
                </div>
                <div className="flex items-center space-x-2">
                                     <button
                     type="button"
                     className={`w-12 h-7 rounded-full border transition-colors duration-200 ${incremental ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300'}`}
                     onClick={() => setIncremental((v: boolean) => !v)}
                     aria-pressed={incremental}
                   >
                    <span className={`block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-200 ${incremental ? 'translate-x-6' : ''}`}></span>
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {incremental ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              {/* Policy Scheduler */}
              <div>
                <Label className="block mb-2 font-medium">
                  Policy Scheduler <span className="text-destructive">*</span>
                </Label>
              
                <div className="text-sm text-muted-foreground mb-4">
                  Leave fields empty for "any" value, or fill in specific values to create constraints. All specified constraints must be met.
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Minute */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Minute <span className="text-xs text-muted-foreground">(0-59)</span>
                    </Label>
                    <Input
                      type="number"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      placeholder="Any minute"
                      min="0"
                      max="59"
                      className="text-sm h-8"
                    />
                  </div>

                  {/* Hour */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Hour <span className="text-xs text-muted-foreground">(0-23)</span>
                    </Label>
                    <Input
                      type="number"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      placeholder="Any hour"
                      min="0"
                      max="23"
                      className="text-sm h-8"
                    />
                  </div>

                  {/* Day */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Day <span className="text-xs text-muted-foreground">(1-31)</span>
                    </Label>
                    <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Any day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="*">Any day</SelectItem>
                        {Array.from({length: 31}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Month */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Month</Label>
                    <Select value={month} onValueChange={setMonth}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Any month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="*">Any month</SelectItem>
                        {[
                          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ].map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Day of Week */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Weekday</Label>
                    <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Any weekday" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="*">Any weekday</SelectItem>
                        {[
                          {value: "0", label: "Sunday"},
                          {value: "1", label: "Monday"},
                          {value: "2", label: "Tuesday"},
                          {value: "3", label: "Wednesday"},
                          {value: "4", label: "Thursday"},
                          {value: "5", label: "Friday"},
                          {value: "6", label: "Saturday"}
                        ].map((day) => (
                          <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Common Examples */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Common Examples:</h4>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div>• <strong>Every 30 minutes:</strong> Minute: 30, leave others empty</div>
                    <div>• <strong>Daily at 2:30 AM:</strong> Minute: 30, Hour: 2, leave others empty</div>
                    <div>• <strong>Weekly backup on Sunday at 3:00 AM:</strong> Minute: 0, Hour: 3, Weekday: Sunday</div>
                    <div>• <strong>Monthly on 1st at midnight:</strong> Minute: 0, Hour: 0, Day: 1</div>
                  </div>
                </div>

                {/* Generated CRON Expression */}
                <div className="bg-muted/50 p-3 rounded-lg mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">CRON Expression:</span>
                    <TooltipWrapper 
                      content="Copy CRON expression to clipboard" 
                      side="top"
                    >
                      <button
                        type="button"
                        className="p-1 hover:bg-muted/50 rounded transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(generateCronExpression())
                          toast({
                            title: "CRON expression copied",
                            description: "The CRON expression has been copied to your clipboard."
                          })
                        }}
                      >
                        <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                      </button>
                    </TooltipWrapper>
                  </div>
                  <code className="text-primary font-mono text-sm bg-white px-2 py-1 rounded border">
                    {generateCronExpression()}
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    {generateCronExplanation()}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => formRef.current?.requestSubmit()}>
              {mode === "add" ? "Create Policy" : "Update Policy"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 