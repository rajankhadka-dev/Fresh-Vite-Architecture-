import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><Link to="/demo" className={location.pathname === '/demo' ? 'active' : ''}>Demo</Link></li>
        <li><Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blog</Link></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  )
}

export default Header
