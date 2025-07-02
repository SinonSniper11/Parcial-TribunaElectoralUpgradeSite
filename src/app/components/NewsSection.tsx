import Link from "next/link";

// Tipos locales
type News = {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    publishedAt: string;
};

type Communication = {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    author: string;
    publishedAt: string;
};

// Datos estáticos simulados
const news: News[] = [
    {
        id: "1",
        title: "Nueva ley de educación aprobada",
        excerpt: "El congreso aprobó una nueva ley que moderniza el sistema educativo.",
        imageUrl: "",
        publishedAt: "2024-06-01T10:00:00Z"
    },
    {
        id: "2",
        title: "Inauguración de hospital regional",
        excerpt: "El nuevo hospital regional brindará atención a más de 100,000 personas.",
        imageUrl: "",
        publishedAt: "2024-05-28T09:00:00Z"
    },
    {
        id: "3",
        title: "Campaña de vacunación nacional",
        excerpt: "Se inicia la campaña de vacunación contra la gripe en todo el país.",
        imageUrl: "",
        publishedAt: "2024-05-20T08:00:00Z"
    }
];

const communications: Communication[] = [
    {
        id: "1",
        title: "Comunicado oficial sobre transporte",
        excerpt: "Se informa a la ciudadanía sobre los cambios en el transporte público.",
        imageUrl: "",
        author: "Ministerio de Transporte",
        publishedAt: "2024-06-02T12:00:00Z"
    },
    {
        id: "2",
        title: "Aviso de corte de energía",
        excerpt: "Habrá corte programado de energía en la zona norte.",
        imageUrl: "",
        author: "Empresa Eléctrica",
        publishedAt: "2024-05-30T15:00:00Z"
    }
];

function formatDate(dateString: string | Date) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export default function NewsSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Últimas Noticias */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-black">Últimas Noticias</h2>
                            <Link
                                href="/noticias"
                                className="text-black underline text-base font-medium hover:text-blue-600"
                            >
                                Ver todas
                            </Link>
                        </div>
                        <div className="space-y-6">
                            {news.map((article) => (
                                <div key={article.id} className="bg-gray-100 rounded-lg hover:shadow-md transition-shadow p-4 flex gap-4">
                                    <img
                                        src={article.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100"}
                                        alt={article.title}
                                        className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-black mb-2 line-clamp-2">
                                            <a href="#" className="hover:underline">{article.title}</a>
                                        </h3>
                                        <p className="text-sm text-black mb-2">
                                            {article.excerpt}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(article.publishedAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comunicados */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-black">Comunicados</h2>
                            <Link
                                href="/comunicados"
                                className="text-black underline text-base font-medium hover:text-blue-600"
                            >
                                Ver todos
                            </Link>
                        </div>
                        <div className="space-y-6">
                            {communications.slice(0, 2).map((comm) => (
                                <div key={comm.id} className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <img
                                        src={comm.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
                                        alt={comm.title}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-black mb-2">
                                            <a href="#" className="hover:underline">{comm.title}</a>
                                        </h3>
                                        <p className="text-sm text-black mb-3">
                                            {comm.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{comm.author}</span>
                                            <span>{formatDate(comm.publishedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}