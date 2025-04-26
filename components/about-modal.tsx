"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border border-purple-500/50 bg-black/80 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold neon-text-purple">About 50 Shades of Your Essay</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-lg font-semibold neon-text-teal mb-2">App Description</h3>
            <p className="text-gray-300">
              50 Shades of Your Essay is an AI-powered, futuristic platform where you upload an image, and the Gemini
              API writes you a custom essay describing it. No more boring essays—just pure AI genius, with some serious
              hip-hop culture sprinkled in. Watch as Kendrick and Drake literally fight while your image is being
              analyzed.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold neon-text-teal mb-2">About the Creator</h3>
            <p className="text-gray-300">
              Shree Harish V, 2nd Year CSE, Big Data Analytics, SRM University Trichy. A data lover and essay enthusiast
              who believes AI can write it better than humans!
            </p>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">Powered by Google&apos;s Gemini API and Next.js</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
