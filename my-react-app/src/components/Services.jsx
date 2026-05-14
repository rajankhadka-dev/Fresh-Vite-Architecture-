import { useEffect, useRef } from 'react'

const SERVICES = [
  {
    icon: '🐍',
    color: 'rgba(59,130,246,0.18)',
    border: 'rgba(59,130,246,0.35)',
    title: 'Python Development',
    description:
      'Expert in Python for web apps, data pipelines, and automation. Building scalable backend systems and RESTful APIs with Django & FastAPI.',
  },
  {
    icon: '🤖',
    color: 'rgba(124,58,237,0.18)',
    border: 'rgba(124,58,237,0.35)',
    title: 'Machine Learning',
    description:
      'Developing intelligent ML models with TensorFlow, PyTorch, and scikit-learn — from data preprocessing to production deployment.',
  },
  {
    icon: '📊',
    color: 'rgba(6,182,212,0.18)',
    border: 'rgba(6,182,212,0.35)',
    title: 'Data Science',
    description:
      'Extracting actionable insights from complex datasets using advanced analytics, visualisation, and statistical modelling.',
  },
  {
    icon: '💻',
    color: 'rgba(236,72,153,0.18)',
    border: 'rgba(236,72,153,0.35)',
    title: 'Full-Stack Development',
    description:
      'Modern web applications with React, Node.js, and databases. Complete end-to-end solutions from design to deployment.',
  },
  {
    icon: '🧠',
    color: 'rgba(245,158,11,0.18)',
    border: 'rgba(245,158,11,0.35)',
    title: 'AI Solutions',
    description:
      'Intelligent applications using NLP, computer vision, and deep learning — bringing cutting-edge AI research into production.',
  },
  {
    icon: '🔧',
    color: 'rgba(34,197,94,0.18)',
    border: 'rgba(34,197,94,0.35)',
    title: 'DevOps & Deployment',
    description:
      'CI/CD pipelines, Docker containerisation, and cloud deployments on AWS, GCP, and Azure for reliable scalable infrastructure.',
  },
]

const Services = () => {
  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="section" id="services">
      <h2 className="section-title">What I Do</h2>

      <div className="cards-grid">
        {SERVICES.map((svc, i) => (
          <div
            key={svc.title}
            className="service-card"
            ref={(el) => (cardsRef.current[i] = el)}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div
              className="service-icon-wrap"
              style={{
                background: svc.color,
                boxShadow: `0 0 20px ${svc.border}`,
              }}
            >
              {svc.icon}
            </div>
            <h3>{svc.title}</h3>
            <p>{svc.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
