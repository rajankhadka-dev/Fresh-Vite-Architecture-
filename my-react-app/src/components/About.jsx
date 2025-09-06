import React, { useEffect, useRef } from 'react'

const About = () => {
  const statsRef = useRef(null)

  useEffect(() => {
    // Counter animation for stats
    const animateCounter = (element, target, duration = 2000) => {
      const start = 0
      const increment = target / (duration / 16)
      let current = start
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        
        if (target % 1 === 0) {
          element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '')
        } else {
          element.textContent = current.toFixed(1) + (element.textContent.includes('%') ? '%' : '')
        }
      }, 16)
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll('.stat-number')
          numbers.forEach(num => {
            const text = num.textContent
            const value = parseInt(text.replace(/[^0-9]/g, ''))
            animateCounter(num, value)
          })
          statsObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.5 })

    if (statsRef.current) {
      statsObserver.observe(statsRef.current)
    }

    return () => {
      statsObserver.disconnect()
    }
  }, [])

  return (
    <section className="section" id="about">
      <h2 className="section-title">About Me</h2>
      <div className="stats-section" ref={statsRef}>
        <p style={{fontSize: '1.2rem', opacity: 0.9, marginBottom: '30px'}}>
          Passionate about creating digital experiences that blend creativity with cutting-edge technology. 
          I specialize in bringing innovative ideas to life through code and design.
        </p>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Projects Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Client Satisfaction</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support Available</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
