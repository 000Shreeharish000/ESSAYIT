"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { jsPDF } from "jspdf"  // Import jsPDF

interface EssayDisplayProps {
  essay: {
    title: string
    content: string
    sections: { heading: string; content: string }[]
  }
  imageUrl: string
  onReset: () => void
}

export default function EssayDisplay({ essay, imageUrl, onReset }: EssayDisplayProps) {
  const [downloading, setDownloading] = useState(false)

  // Combine all content into a single essay
  const fullEssay = `${essay.content} ${essay.sections.map((section) => section.content).join(" ")}`

  const handleDownload = async () => {
    setDownloading(true)

    try {
      // Create a new jsPDF instance
      const doc = new jsPDF()

      // Add the title to the PDF
      doc.setFontSize(22)
      doc.text(essay.title, 10, 20)  // Title at (10, 20)

      // Add content to the PDF
      doc.setFontSize(12)
      const content = `${essay.content} ${essay.sections.map((section) => section.content).join(" ")}`
      doc.text(content, 10, 30)  // Content starting at (10, 30)

      // Save the PDF as 'essay.pdf'
      doc.save(`${essay.title.replace(/\s+/g, "_")}.pdf`)
    } catch (error) {
      console.error("Error downloading essay:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-black/80 backdrop-blur-md rounded-xl border border-purple-500/50 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold neon-text-purple">Your AI-Generated Essay</h2>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={downloading}
                className="neon-button"
              >
                <Download className="mr-2 h-4 w-4" />
                {downloading ? "Downloading..." : "Download as PDF"}
              </Button>
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Essay
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden border border-purple-500/30 shadow-lg">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Uploaded image"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-2 bg-black/40 p-6 rounded-lg border border-purple-500/20">
              <h1 className="text-3xl font-bold mb-4 neon-text-purple">{essay.title}</h1>
              <div className="text-gray-300 leading-relaxed">{fullEssay}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
