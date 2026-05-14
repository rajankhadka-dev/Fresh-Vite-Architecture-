import { useState } from 'react'
import Signature from './Signature'

const SOCIALS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/rajankhadka-dev',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.912.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.338c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/rajankhadka',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    href: 'https://twitter.com/rajankhadkadev',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.735-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:rajankhadkadev@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
  },
]

const Footer = () => {
  const [imgError, setImgError] = useState(false)

  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">

        {/* Mini photo */}
        {!imgError ? (
          <img
            src="/profile.png"
            alt="Rajan Khadka"
            className="footer-mini-photo"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="footer-mini-placeholder">👤</div>
        )}

        {/* Animated signature */}
        <Signature size={0.55} label={false} />

        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Let&apos;s Connect
        </h2>

        <p className="footer-tagline">
          Ready to bring your ideas to life? Let&apos;s create something amazing together.
        </p>

        {/* Social links with SVG icons */}
        <div className="social-links">
          {SOCIALS.map((s) => (
            <a
              key={s.id}
              id={`social-${s.id}`}
              href={s.href}
              className="social-link"
              aria-label={s.label}
              target="_blank"
              rel="noreferrer noopener"
              title={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>

        <p style={{ opacity: 0.4, fontSize: '0.85rem' }}>
          © 2025 Rajan Khadka. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
