import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import CustomCursor from '../components/CustomCursor'
import FloatingShapes from '../components/FloatingShapes'
import ScrollIndicator from '../components/ScrollIndicator'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getPassphrase, getApiUrl } from '../config/settings'
import apiService from '../services/apiService'

// Add styles for the new dashboard components
const dashboardStyles = `
  .dashboard-section {
    padding: 80px 0;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .dashboard-title {
    text-align: center;
    font-size: 3rem;
    margin-bottom: 2rem;
    color: white;
  }

  .dashboard-layout {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    margin-top: 2rem;
  }

  .form-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    height: fit-content;
  }

  .dashboard-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .date-filter {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: end;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-label {
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .filter-input, .filter-select {
    padding: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    backdrop-filter: blur(10px);
  }

  .filter-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .filter-button {
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .filter-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .filter-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .charts-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .chart-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .chart-title, .table-title {
    color: white;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .tables-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .table-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .table-container {
    overflow-x: auto;
    border-radius: 10px;
    max-height: 400px;
    overflow-y: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(255, 255, 255, 0.1);
  }

  .data-table th {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .data-table td {
    padding: 0.75rem 1rem;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .data-table tr:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .total-row {
    background: rgba(255, 255, 255, 0.15) !important;
    font-weight: 600;
    border-top: 2px solid rgba(255, 255, 255, 0.3);
  }

  .amount-cell {
    text-align: right;
    font-weight: 500;
  }

  .type-cell {
    font-weight: 500;
  }

  .remarks-cell {
    max-width: 200px;
    word-wrap: break-word;
  }

  .loading-dashboard, .error-dashboard, .no-data {
    text-align: center;
    color: white;
    padding: 2rem;
    font-size: 1.1rem;
  }

  .error-dashboard {
    color: #ff6b6b;
  }

  .chart-tooltip {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 0.75rem;
    color: white;
  }

  .tooltip-label {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .tooltip-value {
    color: #4fc3f7;
    margin-bottom: 0.25rem;
  }

  .tooltip-remarks {
    color: #b39ddb;
    font-size: 0.9rem;
  }

  .data-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .radio-row {
    display: flex;
    align-items: center;
  }

  .form-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  @media (max-width: 600px) {
    .form-buttons {
      flex-direction: column;
    }
    .form-buttons .stylish-button {
      width: 100%;
    }
  }

  @media (max-width: 1024px) {
    .dashboard-layout {
      grid-template-columns: 1fr;
    }
    
    .charts-container, .tables-container {
      grid-template-columns: 1fr;
    }
    
    .date-filter {
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .dashboard-title {
      font-size: 2rem;
    }
    
    .form-container, .dashboard-container {
      padding: 1.5rem;
    }
    
    .data-table th, .data-table td {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = dashboardStyles
  document.head.appendChild(styleElement)
}

const Portfolio = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [formData, setFormData] = useState({
    transactionType: '',
    type: '',
    amount: 0,
    remarks: ''
  })
  const [typeOptions, setTypeOptions] = useState([])
  const [isLoadingTypes, setIsLoadingTypes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [error, setError] = useState('')

  // New state for dashboard data
  const [dashboardData, setDashboardData] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [dashboardError, setDashboardError] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const correctPassphrase = getPassphrase()

  // Transaction type options for radio buttons
  const transactionTypes = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'lending', label: 'Lending' },
    { value: 'lending_received', label: 'Lending Received' },
    { value: 'payable_amount', label: 'Payable Amount' },
    { value: 'payable_amount_paid', label: 'Payable Amount Paid' }
  ]

  // Month options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]

  // Colors for charts - mapping specific colors to transaction types
  const getColorForType = (type) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('expense')) return '#ff4444' // Red for expenses
    if (lowerType.includes('income')) return '#228B22' // Dark green for income/savings
    if (lowerType.includes('lending received')) return '#32CD32' // Lime green for lending received
    if (lowerType.includes('payable amount paid')) return '#90EE90' // Light green for payable paid
    if (lowerType.includes('lending')) return '#ffc658' // Yellow for lending
    if (lowerType.includes('payable amount')) return '#ff7c7c' // Light red for payable amount
    return '#8dd1e1' // Default light blue
  }

  const COLORS = [
    '#228B22', '#ff4444', '#ffc658', '#32CD32', 
    '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'
  ]

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

  // Load dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAuthenticated, selectedYear, selectedMonth])

  // Fetch dropdown options when transaction type changes
  useEffect(() => {
    if (formData.transactionType) {
      fetchTypeOptions(formData.transactionType)
    } else {
      setTypeOptions([])
      setFormData(prev => ({ ...prev, type: '' }))
    }
  }, [formData.transactionType])

  const fetchDashboardData = async () => {
    setIsLoadingData(true)
    setDashboardError('')
    
    try {
      const data = await apiService.getMonthlyData(selectedYear, selectedMonth)
      setDashboardData(data)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setDashboardError('Failed to load dashboard data. Please try again.')
      setDashboardData([])
    } finally {
      setIsLoadingData(false)
    }
  }

  const fetchTypeOptions = async (category) => {
    setIsLoadingTypes(true)
    setError('')
    
    try {
      const options = await apiService.getDropdownOptions(category)
      setTypeOptions(options)
    } catch (err) {
      console.error('Failed to fetch dropdown options:', err)
      setError(`Failed to load options for ${category}. Please try again.`)
      setTypeOptions([])
    } finally {
      setIsLoadingTypes(false)
    }
  }

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
    
    if (name === 'transactionType') {
      setFormData(prev => ({
        ...prev,
        transactionType: value,
        type: ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSubmitMessage('')

    try {
      const submitData = {
        isIncome: formData.transactionType === 'income',
        isExpense: formData.transactionType === 'expense',
        isLending: formData.transactionType === 'lending',
        lendinReceived: formData.transactionType === 'lending_received',
        payableAmount: formData.transactionType === 'payable_amount',
        payableaAmountPaid: formData.transactionType === 'payable_amount_paid',
        type: formData.type,
        amount: parseFloat(formData.amount),
        remarks: formData.remarks
      }

      const result = await apiService.submitMasterData(submitData)
      
      if (result.success) {
        setSubmitMessage(result.message)
        setFormData({
          transactionType: '',
          type: '',
          amount: 0,
          remarks: ''
        })
        setTypeOptions([])
        // Refresh dashboard data after successful submission
        fetchDashboardData()
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

  // Prepare data for charts - only show totals
  const prepareChartData = () => {
    if (!dashboardData.length) return { pieData: [], barData: [] }

    // Get only the total rows for charts
    const totalRows = dashboardData.filter(item => 
      item.type.toLowerCase().includes('total') && 
      item.amount > 0
    )

    const pieData = totalRows.map(item => ({
      name: item.type,
      value: item.amount
    }))

    const barData = totalRows.map(item => ({
      name: item.type.length > 15 ? item.type.substring(0, 15) + '...' : item.type,
      fullName: item.type,
      amount: item.amount
    }))

    return { pieData, barData }
  }

  // Group data by category for tables
  const groupDataByCategory = () => {
    if (!dashboardData.length) return {}

    const groups = {}
    
    dashboardData.forEach(item => {
      let category
      if (item.type.toLowerCase().includes('income')) {
        category = 'Income'
      } else if (item.type.toLowerCase().includes('expense')) {
        category = 'Expense'
      } else if (item.type.toLowerCase().includes('lending received')) {
        category = 'Lending Received'
      } else if (item.type.toLowerCase().includes('lending')) {
        category = 'Lending'
      } else if (item.type.toLowerCase().includes('payable amount paid')) {
        category = 'Payable Amount Paid'
      } else if (item.type.toLowerCase().includes('payable amount')) {
        category = 'Payable Amount'
      } else {
        category = 'Other'
      }

      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })

    return groups
  }

  const { pieData, barData } = prepareChartData()
  const groupedData = groupDataByCategory()

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.fullName || data.name}</p>
          <p className="tooltip-value">Amount: ${payload[0].value?.toLocaleString()}</p>
        </div>
      )
    }
    return null
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
                    autoFocus
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
      
      <section className="dashboard-section">
        <div className="container">
          <h1 className="dashboard-title">
            <span className="gradient-text">Financial Dashboard</span>
          </h1>
          
          <div className="dashboard-layout">
            {/* Left Side - Transaction Form */}
            <div className="form-container">
              <h2 className="form-title">Add Transaction</h2>
              
              <form onSubmit={handleSubmit} className="data-form">
                <div className="form-grid">
                  {/* Radio Button Fields for Transaction Types */}
                  <div className="radio-group">
                    <h3 className="group-title">Transaction Type</h3>
                    {transactionTypes.map((option) => (
                      <div key={option.value} className="radio-row">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="transactionType"
                            value={option.value}
                            checked={formData.transactionType === option.value}
                            onChange={handleInputChange}
                            className="radio-input"
                          />
                          <span className="radio-custom"></span>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Type Dropdown */}
                  {formData.transactionType && (
                    <div className="input-group">
                      <label className="input-label">Type</label>
                      {isLoadingTypes ? (
                        <div className="loading-message">Loading options...</div>
                      ) : (
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                          disabled={typeOptions.length === 0}
                        >
                          <option value="">Select a type</option>
                          {typeOptions.map((option) => (
                            <option key={option.value} value={option.id}>
                              {option.value}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

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
                    disabled={isSubmitting || !formData.transactionType || !formData.type}
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
            </div>

            {/* Right Side - Dashboard */}
            <div className="dashboard-container">
              {/* Date Filter */}
              <div className="date-filter">
                <div className="filter-group">
                  <label className="filter-label">Year:</label>
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="filter-input"
                    min="2020"
                    max="2030"
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="filter-select"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={fetchDashboardData}
                  className="filter-button"
                  disabled={isLoadingData}
                >
                  {isLoadingData ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {/* Charts and Tables Section */}
              {isLoadingData ? (
                <div className="loading-dashboard">Loading dashboard data...</div>
              ) : dashboardError ? (
                <div className="error-dashboard">{dashboardError}</div>
              ) : dashboardData.length > 0 ? (
                <>
                  {/* Charts showing only totals */}
                  <div className="charts-container">
                    {/* Pie Chart */}
                    <div className="chart-section">
                      <h3 className="chart-title">Total Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name.replace('TOTAL ', '')}: $${value.toLocaleString()}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name.replace('TOTAL ', '')]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="chart-section">
                      <h3 className="chart-title">Total Amounts</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                          />
                          <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="amount">
                            {barData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Grouped Data Tables */}
                  <div className="tables-container">
                    {Object.entries(groupedData).map(([category, items]) => (
                      <div key={category} className="table-section">
                        <h3 className="table-title">{category}</h3>
                        <div className="table-container">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, index) => (
                                <tr 
                                  key={index} 
                                  className={item.type.toLowerCase().includes('total') ? 'total-row' : ''}
                                >
                                  <td className="type-cell">{item.type}</td>
                                  <td className="amount-cell">${item.amount.toLocaleString()}</td>
                                  <td className="remarks-cell">{item.remarks || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-data">No data available for the selected period.</div>
              )}
            </div>
          </div>
          
          <div className="hero-buttons">
            <Link to="/" className="stylish-button secondary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Portfolio

