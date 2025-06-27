import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Noticias from '../components/Noticias'
import Servicios from '../components/Servicios'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <main>
        <Servicios />
        <Noticias />
      </main>
      <Footer />
    </>
  )
}