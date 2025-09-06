import React, { useEffect } from 'react'

const Services = () => {
  useEffect(() => {
    // Card hover animations with 3D effect
    const cards = document.querySelectorAll('.card')
    
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      
      e.currentTarget.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
    
    const handleMouseLeave = (e) => {
      e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)'
    }

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  const services = [
    {
      icon: '🐍',
      title: 'Python Development',
      description: 'Expert in Python programming for web applications, data analysis, and automation. Building scalable backend systems and APIs.'
    },
    {
      icon: '🤖',
      title: 'Machine Learning',
      description: 'Developing intelligent ML models using TensorFlow, PyTorch, and scikit-learn. From data preprocessing to model deployment.'
    },
    {
      icon: '📊',
      title: 'Data Science',
      description: 'Extracting insights from complex datasets using advanced analytics, visualization, and statistical modeling techniques.'
    },
    {
      icon: '💻',
      title: 'Full-Stack Development',
      description: 'Building modern web applications with React, Node.js, and database technologies. End-to-end software solutions.'
    },
    {
      icon: '🧠',
      title: 'AI Solutions',
      description: 'Creating intelligent applications with natural language processing, computer vision, and deep learning technologies.'
    },
    {
      icon: '🔧',
      title: 'DevOps & Deployment',
      description: 'Implementing CI/CD pipelines, containerization with Docker, and cloud deployment on AWS, GCP, and Azure.'
    }
  ]

  return (
    <section className="section" id="services">
      <h2 className="section-title">Services</h2>
      <div className="cards-grid">
        {services.map((service, index) => (
          <div key={index} className="card">
            <div className="card-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
