import { Search } from "lucide-react";

export default function Header() {
    return (
        <header className="w-full">
            {/* Barra superior */}
            <div className="bg-[#27a3fa] text-white text-sm">
                <div className="container mx-auto flex justify-between items-center px-4 py-2">
                    <div className="flex gap-6 items-center">
                        <a href="http://www.tribunalcontigo.com/" className="flex items-center gap-1 hover:underline" target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-file-alt"></i> Trámites
                        </a>
                        <a href="https://www.youtube.com/playlist?list=PLkBHvlgapi1wM1T64h8mExk3G6isJsQyZ" className="flex items-center gap-1 hover:underline" target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-tv"></i> CNRE2025
                        </a>
                        <a href="#" className="flex items-center gap-1 hover:underline">
                            <i className="fas fa-map-marker-alt"></i> Quioscos
                        </a>
                    </div>
                    <div className="flex gap-4 items-center">
                        <a href="https://www.facebook.com/tepanama/" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="https://twitter.com/tepanama/" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.youtube.com/channel/UCEkREtyiKjqAg2qZV8jgu_Q" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>

            {/* Barra principal */}
            <div className="bg-white w-full border-b border-gray-200">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3">
                    {/* Logo y nombre */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <img
                            src="https://res.cloudinary.com/dfnsjfsxh/image/upload/v1751467745/Logo-PLAGEL-2022-2024-125px_rkbdbw.webp"
                            alt="Escudo de Panamá"
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                            <span className="block text-lg md:text-xl font-bold text-black">Tribunal Electoral</span>
                            <span className="block text-sm text-black">República de Panamá</span>
                        </div>
                    </div>

                    {/* Menú principal */}
                    <nav className="flex-1 flex justify-center mt-4 md:mt-0">
                        <ul className="flex gap-8 items-center font-medium text-black">
                            <li>
                                <a href="/" className="hover:text-[#27a3fa]">Inicio</a>
                            </li>
                            <li className="relative group">
                                <button
                                    className="flex items-center gap-1 hover:text-[#27a3fa] focus:outline-none"
                                    tabIndex={0}
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Servicios <span className="ml-1">&#9662;</span>
                                </button>
                                {/* Menú desplegable solo visible en hover */}
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <a href="/registro-civil" className="block py-2 px-4 text-black hover:bg-[#e6f4fd]">Registro Civil</a>
                                    <a href="/cedulacion" className="block py-2 px-4 text-black hover:bg-[#e6f4fd]">Cedulación</a>
                                    <a href="/organizacion-electoral" className="block py-2 px-4 text-black hover:bg-[#e6f4fd]">Organización Electoral</a>
                                </div>
                            </li>
                            <li>
                                <a href="/noticias" className="hover:text-[#27a3fa]">Noticias</a>
                            </li>
                            <li>
                                <a href="/comunicados" className="hover:text-[#27a3fa]">Comunicados</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#27a3fa]">Contacto</a>
                            </li>
                        </ul>
                    </nav>

                    {/* Buscador */}
                    <div className="flex items-center w-full md:w-auto justify-end mt-4 md:mt-0">
                        <button
                            type="button"
                            className="text-black hover:text-[#27a3fa] p-2 rounded-full transition-colors"
                            aria-label="Buscar"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}