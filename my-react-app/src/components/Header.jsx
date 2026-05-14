import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/#about">About</Link></li>
        <li><Link to="/#services">Services</Link></li>
        <li><Link to="/demo" className={location.pathname === '/demo' ? 'active' : ''}>Demo</Link></li>
        <li><Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blog</Link></li>
        <li><Link to="/#contact">Contact</Link></li>
      </ul>
    </nav>
  )
}

export default Header
