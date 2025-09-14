import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CustomCursor from '../components/CustomCursor'
import FloatingShapes from '../components/FloatingShapes'
import ScrollIndicator from '../components/ScrollIndicator'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getPassphrase } from '../config/settings'
import apiService from '../services/apiService'

const Portfolio = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [formData, setFormData] = useState({
    isIncome: false,
    isExpense: false,
    isLending: false,
    lendingReceived: false, // Fixed typo: was 'lendinReceived'
    type: '',
    amount: 0,
    remarks: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [error, setError] = useState('')

  const correctPassphrase = getPassphrase()

  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a[href^="#"]')
      if (target) {
        e.preventDefault()
        const targetId = target.getAttribute('href')
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    document.addEventListener('click', handleSmoothScroll)
    
    return () => {
      document.removeEventListener('click', handleSmoothScroll)
    }
  }, [])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === correctPassphrase) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect passphrase. Please try again.')
      setPassword('')
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSubmitMessage('')

    try {
      const result = await apiService.submitMasterData(formData)
      
      if (result.success) {
        setSubmitMessage(result.message)
        setFormData({
          isIncome: false,
          isExpense: false,
          isLending: false,
          lendingReceived: false,
          type: '',
          amount: 0,
          remarks: ''
        })
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        <CustomCursor />
        <ScrollIndicator />
        <FloatingShapes />
        <Header />
        
        <section className="password-section">
          <div className="container">
            <div className="password-container">
              <h1 className="password-title">
                <span className="gradient-text">Secure Access</span>
              </h1>
              <p className="password-subtitle">
                Please enter the passphrase to access the portfolio
              </p>
              
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="input-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter passphrase"
                    className="password-input"
                    required
                  />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button type="submit" className="stylish-button">
                  Access Portfolio
                </button>
              </form>
              
              <div className="hero-buttons">
                <Link to="/" className="stylish-button secondary">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  return (
    <div className="App">
      <CustomCursor />
      <ScrollIndicator />
      <FloatingShapes />
      <Header />
      
      <section className="form-section">
        <div className="container">
          <div className="form-container">
            <h1 className="form-title">
              <span className="gradient-text">Data Entry Form</span>
            </h1>
            <p className="form-subtitle">
              Submit your financial data to the system
            </p>
            
            <form onSubmit={handleSubmit} className="data-form">
              <div className="form-grid">
                {/* Checkbox Fields */}
                <div className="checkbox-group">
                  <h3 className="group-title">Transaction Types</h3>
                  <div className="checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isIncome"
                        checked={formData.isIncome}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      Income
                    </label>
                  </div>
                  
                  <div className="checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isExpense"
                        checked={formData.isExpense}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      Expense
                    </label>
                  </div>
                  
                  <div className="checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isLending"
                        checked={formData.isLending}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      Lending
                    </label>
                  </div>
                  
                  <div className="checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="lendingReceived" // Fixed name to match state
                        checked={formData.lendingReceived}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      Lending Received
                    </label>
                  </div>
                </div>

                {/* Text Fields */}
                <div className="input-group">
                  <label className="input-label">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="Enter transaction type"
                    className="form-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label className="input-label">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Enter remarks or description"
                    className="form-textarea"
                    rows="4"
                    required
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
              {submitMessage && <div className="success-message">{submitMessage}</div>}

              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="stylish-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Data'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setIsAuthenticated(false)}
                  className="stylish-button secondary"
                >
                  Logout
                </button>
              </div>
            </form>
            
            <div className="hero-buttons">
              <Link to="/" className="stylish-button secondary">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Portfolio