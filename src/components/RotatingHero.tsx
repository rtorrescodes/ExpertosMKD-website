'use client'

import { useState, useEffect } from 'react'
import { VideoText } from '@/components/magicui/video-text'
import { AnimatePresence, motion } from 'framer-motion'

interface Phrase {
  text: string;
  highlight: string;
}

interface RotatingHeroProps {
  phrases: Phrase[];
}

export default function RotatingHero({ phrases }: RotatingHeroProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length)
    }, 8000) // Cambia cada 8 segundos
    return () => clearInterval(interval)
  }, [])

  return (
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white min-h-[180px] md:min-h-[160px] lg:min-h-[180px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full"
        >
          <span className="block mb-2">{phrases[index].text}</span>
          <VideoText text={phrases[index].highlight} />
        </motion.div>
      </AnimatePresence>
    </h1>
  )
}
