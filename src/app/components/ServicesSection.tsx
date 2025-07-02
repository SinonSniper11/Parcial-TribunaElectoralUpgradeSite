import Link from "next/link";
import { Fingerprint, IdCard, Vote, ArrowRight } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Registro Civil",
    description: "Trámites de nacimiento, matrimonio y defunción.",
    icon: Fingerprint,
    slug: "registro-civil"
  },
  {
    id: 2,
    name: "Cedulación",
    description: "Emisión y renovación de cédulas de identidad.",
    icon: IdCard,
    slug: "cedulacion"
  },
  {
    id: 3,
    name: "Organización Electoral",
    description: "Gestión y organización de procesos electorales.",
    icon: Vote,
    slug: "organizacion-electoral"
  }
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="py-16 bg-gov-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Nuestros Servicios</h2>
          <p className="text-lg text-black max-w-3xl mx-auto">
            Ofrecemos servicios especializados en registro civil, cedulación y organización electoral 
            para garantizar los derechos ciudadanos
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow service-card hover:shadow-xl transition-all duration-300 p-8 flex flex-col"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gov-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-12 w-12 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">{service.name}</h3>
                </div>
                <p className="text-black mb-6 flex-1">
                  {service.description}
                </p>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="text-black hover:underline font-medium inline-flex items-center gap-2 transition-colors"
                >
                  Leer más <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
