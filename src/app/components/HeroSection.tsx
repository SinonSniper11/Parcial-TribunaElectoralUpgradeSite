
export default function HeroSection() {
  return (
    <section 
      className="relative bg-gradient-to-r from-gov-blue to-gov-blue-dark text-white py-20 md:py-24 min-h-[700px] flex items-center"
      style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.7), rgba(30, 58, 138, 0.6)), url('https://res.cloudinary.com/dfnsjfsxh/image/upload/v1751468030/15_shqvt8.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-8 animate-fade-in drop-shadow-2xl text-white">
            TRIBUNAL ELECTORAL
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 animate-slide-up drop-shadow-xl text-white">
            DE PANAMÁ
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-white animate-slide-up drop-shadow-lg max-w-5xl mx-auto leading-relaxed font-medium">
            Fortaleciendo la democracia panameña con transparencia y servicio ciudadano
          </p>
          <div className="flex justify-center">
            <a
              href="#servicios"
              className="bg-gov-orange hover:bg-orange-600 text-white px-12 py-5 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-full border-2 border-white flex items-center"
            >
              <i className="fas fa-cogs mr-3"></i>
              Explorar Servicios
            </a>
          </div>
        </div>
      </div>    
    </section>
  );
}