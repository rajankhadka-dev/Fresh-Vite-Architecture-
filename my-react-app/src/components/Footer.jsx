import React from 'react'

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <h2 className="section-title">Let's Connect</h2>
      <div className="social-links">
        <a href="#" className="social-link">📧</a>
        <a href="#" className="social-link">🐦</a>
        <a href="#" className="social-link">💼</a>
        <a href="#" className="social-link">📷</a>
      </div>
      <p style={{opacity: 0.7}}>Ready to bring your ideas to life? Let's create something amazing together.</p>
      <p style={{opacity: 0.5, marginTop: '20px'}}>© 2025 Rajan Khadka. All rights reserved.</p>
    </footer>
  )
}

export default Footer
