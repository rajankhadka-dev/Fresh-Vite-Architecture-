import React, { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const animateCursor = () => {
      setCursorPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1
      }))
      requestAnimationFrame(animateCursor)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animateCursor()

    // Hover effects for cursor
    const handleMouseEnter = () => {
      const cursor = document.getElementById('cursor')
      if (cursor) {
        cursor.style.transform = 'scale(2)'
        cursor.style.background = 'rgba(124, 58, 237, 0.3)'
      }
    }

    const handleMouseLeave = () => {
      const cursor = document.getElementById('cursor')
      if (cursor) {
        cursor.style.transform = 'scale(1)'
        cursor.style.background = 'rgba(124, 58, 237, 0.1)'
      }
    }

    const interactiveElements = document.querySelectorAll('a, button, .card')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [mousePosition])

  return (
    <div 
      className="cursor" 
      id="cursor"
      style={{
        left: cursorPosition.x - 10,
        top: cursorPosition.y - 10
      }}
    />
  )
}

export default CustomCursor
