import { useEffect, useRef, useState } from 'react'
import Signature from './Signature'

const BADGES = [
  { icon: '🐍', label: 'Python' },
  { icon: '⚛️', label: 'React' },
  { icon: '🤖', label: 'Machine Learning' },
  { icon: '📊', label: 'Data Science' },
  { icon: '☁️', label: 'Cloud / DevOps' },
  { icon: '🧠', label: 'Deep Learning' },
  { icon: '🔧', label: 'Node.js' },
  { icon: '🗄️', label: 'SQL / NoSQL' },
]

const STATS = [
  { number: 50, suffix: '+', label: 'Projects Completed' },
  { number: 5,  suffix: '+', label: 'Years Experience' },
  { number: 98, suffix: '%', label: 'Client Satisfaction' },
  { number: 24, suffix: '/7', label: 'Support Available' },
]

const About = () => {
  const statsRef = useRef(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const animateCounter = (el, target) => {
      let start = 0
      const step = target / 80
      const timer = setInterval(() => {
        start = Math.min(start + step, target)
        el.textContent = Math.floor(start)
        if (start >= target) clearInterval(timer)
      }, 20)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-num').forEach((el) => {
            animateCounter(el, parseInt(el.dataset.target))
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.5 })

    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section" id="about">
      <h2 className="section-title">About Me</h2>

      {/* ── Two-column layout ── */}
      <div className="about-layout">

        {/* Left: photo + signature */}
        <div className="about-photo-col">
          <div className="about-photo-ring">
            {!imgError ? (
              <img
                src="/profile.png"
                alt="Rajan Khadka"
                className="about-photo"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="about-photo-placeholder">👤</div>
            )}
          </div>

          <Signature size={0.7} label={true} />
        </div>

        {/* Right: bio + badges */}
        <div className="about-text-col">
          <h3 className="about-greeting">
            Nice to meet you 👋
          </h3>

          <p className="about-bio">
            I&apos;m a passionate software developer and machine learning enthusiast
            based in Nepal. I love turning complex problems into clean, scalable
            solutions — whether that&apos;s building intelligent ML pipelines, crafting
            beautiful React UIs, or designing robust backend APIs.
          </p>

          <p className="about-bio">
            With 5+ years of hands-on experience across the full stack, I&apos;ve
            shipped products for startups and enterprises alike. When I&apos;m not coding,
            you&apos;ll find me exploring mountains or experimenting with new AI research.
          </p>

          <div className="tech-badges">
            {BADGES.map((b) => (
              <span key={b.label} className="tech-badge">
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats pills ── */}
      <div className="stats-pill-grid" ref={statsRef}>
        {STATS.map((s) => (
          <div key={s.label} className="stat-pill">
            <span className="stat-number">
              <span className="stat-num" data-target={s.number}>0</span>
              {s.suffix}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default About
