import React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LowCreditModalProps {
  open: boolean
  onClose: () => void
  onAddCredit: () => void
  creditBalance?: number
}

export const LowCreditModal: React.FC<LowCreditModalProps> = ({ open, onClose, onAddCredit, creditBalance = -612.5 }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <div className="flex items-center gap-3">
            
            <span className="text-xl font-semibold">Low Credit</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Separator */}
        <div className="border-b border-gray-200" />
        {/* Description */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-muted-foreground text-sm">
            Your credit balance is running low. Please add funds to your account to continue using our services without interruption.
          </p>
        </div>
        {/* Credit Section */}
        <div className="px-6 pt-2 pb-6">
          <div className="bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] px-6 py-4 flex flex-col items-center">
            <span className="text-base font-medium text-gray-400 mb-1">Credit Balance</span>
            <span className="text-2xl font-bold text-black">₹ {creditBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button variant="outline" onClick={onClose} className="min-w-[110px]">Cancel</Button>
          <Button onClick={onAddCredit} className="min-w-[110px]">Add Credit</Button>
        </div>
      </div>
    </div>
  )
} 