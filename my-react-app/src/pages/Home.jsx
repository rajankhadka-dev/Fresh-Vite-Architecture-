import { useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Footer from '../components/Footer'
import CustomCursor from '../components/CustomCursor'
import FloatingShapes from '../components/FloatingShapes'
import ScrollIndicator from '../components/ScrollIndicator'
import Contact from '../components/Contact'

const Home = () => {
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

  return (
    <div className="App">
      <CustomCursor />
      <ScrollIndicator />
      <FloatingShapes />
      <Header />
      <div className="hero-height-fix" style={{height: '60px'}} />
      <Hero />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
