"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import UploadCard from "./upload-card"
import ProcessingAnimation from "./processing-animation"
import EssayDisplay from "./essay-display"

type UploadState = "idle" | "uploading" | "processing" | "complete" | "error"

export default function UploadSection() {
  const { user } = useAuth()
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [wordCount, setWordCount] = useState(175) // Default to middle of 0-350 range
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [essay, setEssay] = useState<{
    title: string
    content: string
    sections: { heading: string; content: string }[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleWordCountChange = (value: number[]) => {
    setWordCount(value[0])
  }

  const handleSubmit = async () => {
    if (!selectedFile) return

    try {
      setUploadState("uploading")

      // Create form data
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append("wordCount", wordCount.toString())

      // Start processing
      setUploadState("processing")

      // Call the API to process the image
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process image")
      }

      const data = await response.json()
      setEssay(data)
      setUploadState("complete")
    } catch (err) {
      console.error("Error processing image:", err)
      setError("An error occurred while processing your image. Please try again.")
      setUploadState("error")
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setEssay(null)
    setError(null)
    setUploadState("idle")
  }

  return (
    <div className="w-full">
      {uploadState === "idle" && (
        <UploadCard
          onFileSelect={handleFileSelect}
          previewUrl={previewUrl}
          wordCount={wordCount}
          onWordCountChange={handleWordCountChange}
          onSubmit={handleSubmit}
          onCancel={handleReset}
        />
      )}

      {(uploadState === "uploading" || uploadState === "processing") && <ProcessingAnimation />}

      {uploadState === "complete" && essay && (
        <EssayDisplay essay={essay} imageUrl={previewUrl!} onReset={handleReset} />
      )}

      {uploadState === "error" && (
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <Button onClick={handleReset} variant="outline">
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
