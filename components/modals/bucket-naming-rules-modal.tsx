import React from "react"
import { X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BucketNamingRulesModalProps {
  open: boolean
  onClose: () => void
}

export const BucketNamingRulesModal: React.FC<BucketNamingRulesModalProps> = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-foreground">Bucket Naming Rules</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* DO'S Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">DO'S</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  1. Should be of min 3 and max 63 characters
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  2. Should begin and end with either :-
                </p>
                <ul className="space-y-1">
                  <li className="text-sm text-muted-foreground flex ml-3">
                    <span className="mr-2">•</span>
                    <span>lowercase letter</span>
                  </li>
                  <li className="text-sm text-muted-foreground flex ml-3">
                    <span className="mr-2">•</span>
                    <span>number</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  3. Should only consist of :-
                </p>
                <ul className="space-y-1">
                  <li className="text-sm text-muted-foreground flex ml-3">
                    <span className="mr-2">•</span>
                    <span>lowercase letter</span>
                  </li>
                  <li className="text-sm text-muted-foreground flex ml-3">
                    <span className="mr-2">•</span>
                    <span>number</span>
                  </li>
                  <li className="text-sm text-muted-foreground flex ml-3">
                    <span className="mr-2">•</span>
                    <span>dots(.)</span>
                  </li>
                  <li className="text-sm text-muted-foreground flex ml-3">
                    <span className="mr-2">•</span>
                    <span>hyphens(-)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* DON'T'S Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-100 rounded-full p-1">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">DON'T'S</h3>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Must not consist of:-
              </p>
              <ul className="space-y-1">
                <li className="text-sm text-muted-foreground flex">
                  <span className="mr-2">•</span>
                  <span>Two or more adjacent periods, eg "test-bucket.." IP Address like formatting, eg "192.168.5.4"</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button 
              onClick={onClose}
              className="bg-black text-white hover:bg-black/90 px-8 py-2 rounded-full"
            >
              Got It
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 