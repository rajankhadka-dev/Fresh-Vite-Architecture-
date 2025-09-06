import React, { useEffect, useState } from 'react'

const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrolled / maxHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div 
      className="scroll-indicator" 
      id="scrollIndicator"
      style={{
        transform: `scaleX(${scrollProgress / 100})`
      }}
    />
  )
}

export default ScrollIndicator
