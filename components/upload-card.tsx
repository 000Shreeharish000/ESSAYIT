"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { X, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface UploadCardProps {
  onFileSelect: (file: File) => void
  previewUrl: string | null
  wordCount: number
  onWordCountChange: (value: number[]) => void
  onSubmit: () => void
  onCancel: () => void
}

export default function UploadCard({
  onFileSelect,
  previewUrl,
  wordCount,
  onWordCountChange,
  onSubmit,
  onCancel,
}: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full max-w-md mx-auto perspective-1000"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: "transform 0.1s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full p-6 bg-black/80 backdrop-blur-md rounded-xl border border-purple-500/50 shadow-xl neon-glow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold neon-text-purple">Upload Your Image</h3>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!previewUrl ? (
            <div
              className={`mt-4 p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging ? "border-purple-500 bg-purple-900/20" : "border-gray-600 hover:border-purple-500/70"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-300 text-center">Drag and drop your image here, or click to select</p>
              <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG, GIF</p>
            </div>
          ) : (
            <div className="mt-4 relative rounded-lg overflow-hidden">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                width={400}
                height={300}
                className="w-full h-auto object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-black/50"
                onClick={() => {
                  onFileSelect(new File([], ""))
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300">Word Count: {wordCount}</label>
              <span className="text-xs text-gray-500">0-350 words</span>
            </div>
            <Slider
              defaultValue={[175]}
              min={0}
              max={350}
              step={10}
              value={[wordCount]}
              onValueChange={onWordCountChange}
              className="my-4"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={onCancel} className="border-gray-600 hover:border-red-500/70">
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!previewUrl}
              className="neon-button bg-purple-900/50 hover:bg-purple-800/60 disabled:opacity-50"
            >
              Generate Essay
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
