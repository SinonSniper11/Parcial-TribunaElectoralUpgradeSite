import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="space-y-4">
          <Link href="/" onClick={onClose} className="block text-gov-gray hover:text-gov-blue transition-colors font-medium">
            Inicio
          </Link>
          <div>
            <button className="text-gov-gray hover:text-gov-blue transition-colors font-medium flex items-center justify-between w-full">
              Servicios <ChevronDown className="h-4 w-4" />
            </button>
            <div className="mt-2 ml-4 space-y-2">
              <Link href="/servicios/registro-civil" onClick={onClose} className="block text-gov-gray hover:text-gov-blue transition-colors">
                Registro Civil
              </Link>
              <Link href="/servicios/cedulacion" onClick={onClose} className="block text-gov-gray hover:text-gov-blue transition-colors">
                Cedulación
              </Link>
              <Link href="/servicios/organizacion-electoral" onClick={onClose} className="block text-gov-gray hover:text-gov-blue transition-colors">
                Organización Electoral
              </Link>
            </div>
          </div>
          <Link href="/noticias" onClick={onClose} className="block text-gov-gray hover:text-gov-blue transition-colors font-medium">
            Noticias
          </Link>
          <Link href="/comunicados" onClick={onClose} className="block text-gov-gray hover:text-gov-blue transition-colors font-medium">
            Comunicados
          </Link>
          <a href="#" onClick={onClose} className="block text-gov-gray hover:text-gov-blue transition-colors font-medium">
            Contacto
          </a>
        </div>
      </div>
    </div>
  );
}
