"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import UploadSection from "./upload-section"

export default function HeroSection() {
  const { user } = useAuth()
  const [showUpload, setShowUpload] = useState(false)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { clientX, clientY } = e
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()

      const x = (clientX - left - width / 2) / 25
      const y = (clientY - top - height / 2) / 25

      controls.start({
        rotateY: x,
        rotateX: -y,
        transition: { type: "spring", stiffness: 100, damping: 30 },
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [controls])

  const handleUploadClick = () => {
    if (!user) {
      alert("Please sign in to upload an image")
      return
    }
    setShowUpload(true)
  }

  if (showUpload) {
    return <UploadSection />
  }

  return (
    <div className="w-full max-w-4xl mx-auto" ref={containerRef}>
      <motion.div className="perspective-1000" animate={controls} style={{ transformStyle: "preserve-3d" }}>
        <div className="relative w-full h-[70vh] bg-black/60 backdrop-blur-md rounded-2xl border border-purple-500/50 shadow-2xl overflow-hidden">
          {/* Background grid and effects */}
          <div className="absolute inset-0 cyberpunk-grid"></div>

          {/* Glowing orb */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 glitch-text" data-text="50 Shades of Your Essay">
                <span className="neon-text-purple">50 Shades</span> <span className="text-white">of Your</span>{" "}
                <span className="neon-text-purple">Essay</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-2xl md:text-3xl text-white font-bold tracking-wider mb-12">
                UPLOAD: <span className="neon-text-purple">LEARN RIZZ</span>: GET YOUR BAG
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleUploadClick}
                size="lg"
                className="neon-button bg-black/50 border border-purple-500/50 hover:bg-purple-900/20 text-xl px-8 py-6 h-auto"
              >
                <Upload className="mr-3 h-6 w-6" />
                Upload an Image
              </Button>
            </motion.div>

            {/* 3D floating elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-white/30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transformStyle: "preserve-3d",
                    transform: `translateZ(${Math.random() * 50}px)`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom text */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Upload any image and get a detailed AI-generated essay powered by Gemini</p>
      </div>
    </div>
  )
}
