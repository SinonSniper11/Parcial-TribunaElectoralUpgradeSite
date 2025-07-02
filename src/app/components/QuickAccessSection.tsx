    import { useState } from "react";
import { Search } from "lucide-react";

export default function QuickAccessSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState({
    exact: false,
    title: false,
    content: false,
    summary: false
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implementar funcionalidad de búsqueda
      console.log("Buscando:", searchQuery, "con opciones:", searchOptions);
    }
  };

  const handleCheckboxChange = (option: keyof typeof searchOptions) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchOptions(prev => ({
      ...prev,
      [option]: e.target.checked
    }));
  };

  const socialMediaLinks = [
    {
      name: "Facebook",
      icon: "fab fa-facebook",
      url: "https://www.facebook.com/tepanama",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "X (Twitter)",
      icon: "fab fa-twitter",
      url: "https://x.com/tepanama",
      color: "bg-gray-900 hover:bg-black"
    },
    {
      name: "YouTube",
      icon: "fab fa-youtube",
      url: "https://www.youtube.com/channel/UCEkREtyiKjqAg2qZV8jgu_Q",
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      name: "Instagram",
      icon: "fab fa-instagram",
      url: "https://www.instagram.com/tepanama/",
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Sección de búsqueda */}
          <div>
            <h2 className="text-2xl font-bold text-gov-blue mb-6">Busca dentro de nuestro sitio web</h2>
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="¿Qué estás buscando?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gov-blue"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gov-blue hover:text-gov-blue-dark p-2 rounded-full focus:outline-none"
                      aria-label="Buscar"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <input
                        id="exact"
                        type="checkbox"
                        checked={searchOptions.exact}
                        onChange={handleCheckboxChange("exact")}
                        className="accent-gov-blue"
                      />
                      <label htmlFor="exact" className="text-sm font-medium leading-none">
                        Resultados exactos
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="title"
                        type="checkbox"
                        checked={searchOptions.title}
                        onChange={handleCheckboxChange("title")}
                        className="accent-gov-blue"
                      />
                      <label htmlFor="title" className="text-sm font-medium leading-none">
                        Buscar en título
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="content"
                        type="checkbox"
                        checked={searchOptions.content}
                        onChange={handleCheckboxChange("content")}
                        className="accent-gov-blue"
                      />
                      <label htmlFor="content" className="text-sm font-medium leading-none">
                        Buscar en contenido
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="summary"
                        type="checkbox"
                        checked={searchOptions.summary}
                        onChange={handleCheckboxChange("summary")}
                        className="accent-gov-blue"
                      />
                      <label htmlFor="summary" className="text-sm font-medium leading-none">
                        Buscar en resumen
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sección de redes sociales */}
          <div>
            <h2 className="text-2xl font-bold text-gov-blue mb-6">En las Redes Sociales</h2>
            <p className="text-gov-gray mb-6">¡Visita nuestras Redes Sociales!</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialMediaLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} text-white p-4 rounded-lg text-center transition-all duration-300 hover:scale-105`}
                >
                  <i className={`${social.icon} text-2xl mb-2 block`}></i>
                  <p className="text-sm font-medium">{social.name}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
