"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

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
      // Create a simple HTML structure for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${essay.title}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #8b5cf6; }
            p { line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${essay.title}</h1>
          <p>${fullEssay}</p>
        </body>
        </html>
      `

      // Create a Blob from the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" })

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${essay.title.replace(/\s+/g, "_")}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
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
                {downloading ? "Downloading..." : "Download as HTML"}
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
