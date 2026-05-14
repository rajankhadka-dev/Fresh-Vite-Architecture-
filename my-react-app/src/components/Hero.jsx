import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Signature from './Signature'

const ROLES = [
  'Software Developer',
  'ML Enthusiast',
  'Full-Stack Builder',
  'Python Engineer',
  'AI Explorer',
]

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const full = ROLES[roleIndex]
    let timeout
    if (!deleting && displayed.length < full.length) {
      timeout = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIndex])

  return (
    <section className="hero editorial-hero" id="home">
      {/* ── Left: text ── */}
      <div className="editorial-left">
        <p className="hero-greeting">✦ Hello, I&apos;m</p>
        <h1 className="hero-name">Rajan<br />Khadka</h1>
        <div className="hero-role-wrapper">
          <span>I&apos;m a&nbsp;</span>
          <span className="hero-role-text">
            {displayed}
            <span className="typewriter-cursor" />
          </span>
        </div>
        <p className="hero-desc">
          Turning complex problems into elegant solutions — from machine learning
          models to full-stack web apps, I build things that matter.
        </p>
        <div className="hero-buttons">
          <a href="#services" className="cta-button">Explore My Work</a>
          <Link to="/portfolio" className="stylish-button secondary">View Portfolio</Link>
        </div>
      </div>

      {/* ── Right: big image + overlapping signature ── */}
      <div className="editorial-right">
        {!imgError ? (
          <img
            src="/profile.png"
            alt="Rajan Khadka at Pokhara International Airport"
            className="editorial-photo"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="editorial-placeholder">
            <span>👤</span>
            <p>Save your photo as<br /><code>public/profile.png</code></p>
            <small style={{opacity: 0.5, marginTop: '10px'}}>Refresh page after adding the image</small>
          </div>
        )}

        {/* Left-edge gradient blend */}
        <div className="editorial-grad-left" />
        {/* Bottom gradient blend */}
        <div className="editorial-grad-bottom" />

        {/* Signature overlapping the image */}
        <div className="signature-on-image">
          <Signature variant="overlay" />
        </div>
      </div>
    </section>
  )
}

export default Hero
