import React, { useEffect, useRef } from 'react'

/**
 * High-performance Custom Cursor.
 * Uses refs and requestAnimationFrame for buttery smooth movement (60fps+).
 * Eliminates React state re-rendering bottleneck.
 */
const CustomCursor = () => {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  
  // Use refs to store position to avoid React re-renders on every move
  const mouse = useRef({ x: 0, y: 0 })
  const cursor = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    // High speed lerp (interpolation) for responsive feel
    // cursorLerp: 0.15 (smooth trail)
    // dotLerp: 0.35 (tight follow)
    const render = () => {
      cursor.current.x += (mouse.current.x - cursor.current.x) * 0.15
      cursor.current.y += (mouse.current.y - cursor.current.y) * 0.15
      
      dot.current.x += (mouse.current.x - dot.current.x) * 0.35
      dot.current.y += (mouse.current.y - dot.current.y) * 0.35

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0)`
      }
      
      requestAnimationFrame(render)
    }

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.classList.add('cursor-hover')
      if (dotRef.current) dotRef.current.classList.add('dot-hover')
    }

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.classList.remove('cursor-hover')
      if (dotRef.current) dotRef.current.classList.remove('dot-hover')
    }

    window.addEventListener('mousemove', handleMouseMove)
    const rafId = requestAnimationFrame(render)

    // Select all interactive elements
    const updateListeners = () => {
      const links = document.querySelectorAll('a, button, .service-card, .tech-badge, .stat-pill')
      links.forEach(link => {
        link.addEventListener('mouseenter', handleMouseEnter)
        link.addEventListener('mouseleave', handleMouseLeave)
      })
    }

    updateListeners()
    
    // Periodically re-check for new elements (useful for dynamic content)
    const interval = setInterval(updateListeners, 2000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <div className="cursor-outer" ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  )
}

export default CustomCursor
