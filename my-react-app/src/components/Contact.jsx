import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const Contact = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    const preSubject = searchParams.get('subject')
    const preMessage = searchParams.get('message')
    if (preSubject || preMessage) {
      setFormData(prev => ({
        ...prev,
        subject: preSubject || prev.subject,
        message: preMessage || prev.message
      }))
    }
  }, [searchParams])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('https://formspree.io/f/maqvzzqo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">
          Have a question or want to work together? Drop me a message below.
        </p>

        <div className="contact-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me more about your project..."
                required
              ></textarea>
            </div>

            <div className="form-footer">
              <button 
                type="submit" 
                className="cta-button" 
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              
              {status === 'success' && (
                <p className="status-msg success">✓ Message sent successfully! I&apos;ll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="status-msg error">✗ Something went wrong. Please try again or email me directly.</p>
              )}
            </div>
            
            <p className="form-note">
              Note: You can also reach me at <a href="mailto:rajankhadka.dev@gmail.com">rajankhadka.dev@gmail.com</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
