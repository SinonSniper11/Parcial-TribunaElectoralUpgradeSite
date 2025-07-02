export default function Footer() {
    return (
        <footer className="w-full">
            {/* Fondo superior negro claro */}
            <div className="bg-[#393a3a]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
                        {/* Logo TE */}
                        <div className="flex-1 flex justify-center md:justify-start mb-6 md:mb-0">
                            <img
                                src="https://res.cloudinary.com/dfnsjfsxh/image/upload/v1751468613/logo-blanco-sobre-gris-oscuro_ujyqmg.webp"
                                alt="Tribunal Electoral"
                                className="h-28 object-contain"
                            />
                        </div>
                        {/* Dirección y teléfono */}
                        <div className="flex-1 text-center text-gray-100">
                            <div className="font-bold mb-1">Dirección:</div>
                            <div>Sede principal – Ancón, Ave. Omar Torrijos H.</div>
                            <div className="font-bold mt-3 mb-1">Central Telefónica:</div>
                            <div>507-8000</div>
                        </div>
                        {/* Logo 311 */}
                        <div className="flex-1 flex justify-center md:justify-end">
                            <img
                                src="https://res.cloudinary.com/dfnsjfsxh/image/upload/v1751468615/logo-311-blanco1_m5tccs.webp"
                                alt="Centro de Atención Ciudadana 311"
                                className="h-24 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Línea divisoria */}
            <div className="border-t border-gray-600"></div>

            {/* Franja inferior mismo color */}
            <div className="bg-[#393a3a]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center gap-4 pt-8">
                        <div className="text-gray-300 text-sm text-center">
                            Derechos Reservados® - 2025 &nbsp;|&nbsp; Sitio creado por <span className="font-semibold text-white">Global Internet Corp., S.A.</span> y <span className="text-white">Negocios Virtuales, S.A.</span> e impulsado por <span className="text-orange-400 font-semibold">WordPress</span>.
                        </div>
                        <a href="#" className="text-gray-300 text-xs hover:underline">Política de Privacidad</a>
                        <div className="flex gap-4 mt-2">
                            <a href="https://www.facebook.com/tepanama/" target="_blank" rel="noopener noreferrer" className="bg-[#3b5998] hover:bg-[#2d4373] rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                                <i className="fab fa-facebook-f text-white text-lg"></i>
                            </a>
                            <a href="https://twitter.com/tepanama/" target="_blank" rel="noopener noreferrer" className="bg-[#1da1f2] hover:bg-[#0d8ddb] rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                                <i className="fab fa-twitter text-white text-lg"></i>
                            </a>
                            <a href="https://www.youtube.com/channel/UCEkREtyiKjqAg2qZV8jgu_Q" target="_blank" rel="noopener noreferrer" className="bg-[#ff0000] hover:bg-[#cc0000] rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                                <i className="fab fa-youtube text-white text-lg"></i>
                            </a>
                            <a href="https://instagram.com/tepanama/" target="_blank" rel="noopener noreferrer" className="bg-[#e1306c] hover:bg-[#c13584] rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                                <i className="fab fa-instagram text-white text-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}