'use client'

import { useState, useEffect } from 'react'
import { Safari } from '@/components/magicui/safari'
import { Iphone15Pro } from '@/components/magicui/iphone-15-pro'

const projects = [
  {
    url: "expertosmkd.com",
    desktop: "/mockup-desktop.jpg",
    mobile: "/mockup-mobile.jpg"
  },
  {
    url: "leclat-restaurant.com",
    desktop: "/mockup-restaurant-desktop.jpg",
    mobile: "/mockup-restaurant-mobile.jpg"
  },
  {
    url: "brighton-academy.edu",
    desktop: "/mockup-school-desktop.jpg",
    mobile: "/mockup-school-mobile.jpg"
  }
]

export function HeroMockups() {
  const [index, setIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const timer = setInterval(() => {
      // Trigger fade out
      setIsFading(true)
      
      setTimeout(() => {
        setIndex((current) => (current + 1) % projects.length)
        setIsFading(false)
      }, 300) // Swap source halfway through the transition
      
    }, 6000) // Change every 6 seconds
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div 
      className={`relative hidden lg:block h-[650px] w-full transition-all duration-1000 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`} 
      style={{ perspective: '1000px' }}
    >
      {/* Desktop Mockup (Safari) */}
      <div 
        className="absolute top-10 -right-20 w-[120%] transition-transform duration-700 hover:transform-none"
        style={{ transform: 'rotateY(-10deg) rotateX(5deg)' }}
      >
         <div className={`transition-opacity duration-300 ${isFading ? 'opacity-50' : 'opacity-100'}`}>
           <Safari 
             url={projects[index].url} 
             className="w-full shadow-[0_0_50px_rgba(34,211,238,0.15)]" 
             src={projects[index].desktop} 
           />
         </div>
      </div>

      {/* Mobile Mockup (iPhone) */}
      <div 
        className="absolute -bottom-10 left-0 w-[35%] z-20 transition-transform duration-700 hover:-translate-y-4"
        style={{ transform: 'rotateY(15deg) rotateX(5deg) translateY(2.5rem)', transformOrigin: 'bottom left' }}
      >
        <div className={`w-full h-full transition-opacity duration-300 ${isFading ? 'opacity-50' : 'opacity-100'}`}>
          <Iphone15Pro 
            className="shadow-[0_0_50px_rgba(168,85,247,0.2)]" 
            src={projects[index].mobile} 
          />
        </div>
      </div>
    </div>
  )
}
