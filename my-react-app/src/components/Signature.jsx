import { useEffect, useRef, useState } from 'react'

/**
 * Animated SVG Signature — High-quality cursive "Rajans"
 */
const Signature = ({ variant = 'card', size = 1, label = true }) => {
  const wrapRef = useRef(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(false)
            requestAnimationFrame(() =>
              requestAnimationFrame(() => setAnimated(true))
            )
          } else {
            setAnimated(false)
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const pc = `sig-path${animated ? ' animate' : ''}`

  const strokeColor = variant === 'overlay' ? '#ffffff' : 'rgba(255,255,255,0.9)'
  const strokeWidth = variant === 'overlay' ? 2.5 : 2.2
  const glowFilter = variant === 'overlay' ? 'url(#sigGlow)' : 'none'

  const w = Math.round(240 * size)
  const h = Math.round(100 * size)

  return (
    <div ref={wrapRef} className={variant === 'overlay' ? 'signature-overlay-inner' : 'signature-card'}>
      {/* Label removed as per request */}
      
      <svg
        className="signature-svg-el"
        viewBox="0 0 240 100"
        width={w}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Rajans signature"
        overflow="visible"
      >
        <defs>
          <filter id="sigGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 
          1. The Capital 'R' (D-style with long sweeping curve)
        */}
        <path
          className={pc}
          pathLength="1"
          filter={glowFilter}
          d="M 45,85 
             L 45,25
             C 45,15 95,15 95,45
             C 95,75 45,85 45,85"
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth * 1.1,
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animationDelay: '0s',
            animationDuration: '1s',
          }}
        />

        {/* 
          2. The R-leg and transition to "ajans"
        */}
        <path
          className={pc}
          pathLength="1"
          filter={glowFilter}
          d="M 55,55 
             C 65,65 75,85 85,82
             C 95,70 105,70 105,80 
             C 105,90 95,90 95,80
             C 95,70 105,70 115,75
             L 118,110 
             C 120,125 105,125 105,110
             C 105,100 115,80 125,75
             C 135,65 145,65 145,80
             C 145,90 135,90 135,80
             C 135,70 145,70 155,75
             C 165,65 175,65 175,80
             C 175,65 185,65 185,80
             C 195,65 205,65 205,80
             C 205,70 215,70 220,75
             C 225,80 215,90 205,85"
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animationDelay: '0.8s',
            animationDuration: '2.4s',
          }}
        />

        {/* 
          3. Final Flourish / Underline
        */}
        <path
          className={pc}
          pathLength="1"
          filter={glowFilter}
          d="M 50,95 C 100,90 180,90 220,105"
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth * 0.7,
            fill: 'none',
            strokeLinecap: 'round',
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animationDelay: '3.2s',
            animationDuration: '0.8s',
          }}
        />
      </svg>

    </div>
  )
}

export default Signature
