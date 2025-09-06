import React, { useEffect } from 'react'

const FloatingShapes = () => {
  useEffect(() => {
    const createFloatingShape = () => {
      const shape = document.createElement('div')
      shape.className = 'shape'
      
      const size = Math.random() * 100 + 20
      shape.style.width = size + 'px'
      shape.style.height = size + 'px'
      shape.style.left = Math.random() * 100 + '%'
      shape.style.animationDuration = (Math.random() * 15 + 10) + 's'
      shape.style.opacity = Math.random() * 0.1 + 0.05
      
      const floatingShapes = document.getElementById('floatingShapes')
      if (floatingShapes) {
        floatingShapes.appendChild(shape)
        
        setTimeout(() => {
          if (shape.parentNode) {
            shape.remove()
          }
        }, 25000)
      }
    }

    // Create shapes periodically
    const interval = setInterval(createFloatingShape, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div className="floating-shapes" id="floatingShapes" />
}

export default FloatingShapes
