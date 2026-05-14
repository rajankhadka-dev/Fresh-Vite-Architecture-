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
      {label && variant === 'card' && <span className="signature-label">Signature</span>}
      
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
          1. The Capital 'R'
        */}
        <path
          className={pc}
          pathLength="1"
          filter={glowFilter}
          d="M 40,75 
             C 35,30 65,20 75,40
             C 80,55 60,65 50,60
             C 45,58 55,85 70,80"
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animationDelay: '0s',
            animationDuration: '1.2s',
          }}
        />

        {/* 
          2. The cursive "ajans" - connected flow
        */}
        <path
          className={pc}
          pathLength="1"
          filter={glowFilter}
          d="M 75,70
             C 85,60 95,60 95,75 
             C 95,85 85,85 85,75
             C 85,65 95,65 105,70
             L 108,105 
             C 110,120 95,120 95,105
             C 95,95 105,75 115,70
             C 125,60 135,60 135,75
             C 135,85 125,85 125,75
             C 125,65 135,65 145,70
             C 155,60 165,60 165,75
             C 165,60 175,60 175,75
             C 185,60 195,60 195,75
             C 195,65 205,65 210,70
             C 215,75 205,85 195,80"
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animationDelay: '1s',
            animationDuration: '2.5s',
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

      {label && variant === 'overlay' && <span className="signature-name-tag">Rajan Khadka</span>}
      {label && variant === 'card' && <span className="signature-label">Rajan Khadka</span>}
    </div>
  )
}

export default Signature
