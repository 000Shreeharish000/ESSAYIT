"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Brain } from "lucide-react"

// Brain rot rizz pick-up lines
const rizzLines = [
  "Are you a parking ticket? Because you've got FINE written all over you.",
  "I'm not a photographer, but I can picture us together.",
  "Do you have a map? I keep getting lost in your eyes.",
  "Is your name Google? Because you have everything I've been searching for.",
  "Are you made of copper and tellurium? Because you're Cu-Te.",
  "If you were a vegetable, you'd be a cute-cumber.",
  "Are you a bank loan? Because you have my interest.",
  "Do you like raisins? How about a date?",
  "Are you a campfire? Because you're hot and I want s'more.",
  "Is your dad a boxer? Because you're a knockout!",
  "Are you a time traveler? Because I see you in my future.",
  "Do you have a Band-Aid? I just scraped my knee falling for you.",
  "Is your name Wi-Fi? Because I'm feeling a connection.",
  "Are you a magician? Because whenever I look at you, everyone else disappears.",
  "Do you believe in love at first sight, or should I walk by again?",
]

export default function ProcessingAnimation() {
  const [progress, setProgress] = useState(0)
  const [currentRizzIndex, setCurrentRizzIndex] = useState(0)

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 150)

    // Rizz line rotation
    const rizzInterval = setInterval(() => {
      setCurrentRizzIndex((prev) => (prev + 1) % rizzLines.length)
    }, 10000) // Change every 10 seconds

    return () => {
      clearInterval(progressInterval)
      clearInterval(rizzInterval)
    }
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold neon-text-purple mb-2">Analyzing Your Image</h2>
        <p className="text-gray-300">Learning rizz while your essay is being generated...</p>
      </div>

      <div className="relative h-[300px] w-full bg-black/40 rounded-xl border border-purple-500/30 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 cyberpunk-grid"></div>

        {/* Brain Animation */}
        <motion.div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <Brain className="w-24 h-24 text-purple-500" />
        </motion.div>

        {/* Rizz Line Display - Centered */}
        <motion.div
          className="absolute w-4/5 mx-auto left-0 right-0 text-center"
          key={currentRizzIndex} // Re-render animation when line changes
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xl font-bold text-white p-4 bg-purple-900/50 backdrop-blur-sm rounded-lg border border-purple-500/30 shadow-lg">
            "{rizzLines[currentRizzIndex]}"
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-500/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Analyzing image...</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-white"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-center mt-4">
          <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
        </div>
      </div>
    </div>
  )
}
