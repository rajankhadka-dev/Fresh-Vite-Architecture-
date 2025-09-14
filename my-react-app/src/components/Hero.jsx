import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Rajan Khadka</h1>
        <p>Software Developer & Machine Learning Enthusiast</p>
        <div className="hero-buttons">
          <a href="#services" className="cta-button">Explore My Work</a>
          <Link to="/portfolio" className="stylish-button secondary">
            View Portfolio
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
