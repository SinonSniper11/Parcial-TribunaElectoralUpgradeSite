import Navbar from "./components/Header";
import Hero from "./components/HeroSection";
import Servicios from "./components/ServicesSection";
import Noticias from "./components/NewsSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        <Servicios />
         <Noticias />
      </main>
       <Footer /> 
    </div>
  );
}
