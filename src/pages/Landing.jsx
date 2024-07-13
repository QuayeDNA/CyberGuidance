// Desc: Home page for the application
import Header from '../components/Header'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Services from '../components/sections/Services'
import Metrics from '../components/sections/Metrics'
import Testimonials from '../components/sections/Testimonials'
import Contact from '../components/sections/Contact'
import Footer from '../components/Footer'
function Landing() {
  return (
    <div>
        <Header />
        <Hero />
        <About />
        <Metrics />
        <Services />
        <Testimonials />
        <Contact />
        <Footer />
    </div>
  )
}

export default Landing