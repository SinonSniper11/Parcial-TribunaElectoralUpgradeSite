'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const [formulario, setFormulario] = useState({
    nombre_completo: '',
    cedula_original: '',
    fecha_nacimiento: '',
    lugar_nacimiento: '',
    genero: '',
    foto_url: '',
    fecha_solicitud: new Date().toISOString(),
    estado: 'pendiente',
    entrega: '',
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiData = {
        nombreCompleto: formulario.nombre_completo,
        cedulaOriginal: formulario.cedula_original || null,
        fechaNacimiento: formulario.fecha_nacimiento,
        lugarNacimiento: formulario.lugar_nacimiento,
        genero: formulario.genero,
        fotoUrl: formulario.foto_url || null,
        tribunalId: getTribalId(formulario.entrega),
        fechaEntregaEstimada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        cedulaNueva: null,
        observaciones: null,
        estado: formulario.estado,
      };

      const response = await fetch('/api/cedulaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la solicitud');
      }

      const result = await response.json();
      console.log('Cedulación creada:', result);

      localStorage.setItem('cedulacionData', JSON.stringify(apiData));

      if (result == null) {
        console.error('Error: ceduacion no hecho');
        return;
      }

      // Redirigir a la página de factura con el ID de la cedulación
      router.push(`/pages/factura?cedulacionId=${result.id}`);
    } catch (error) {
      console.error('Error:', error);
      setErrores({
        submit: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
    const getTribalId = (tribunal: string): number => {
    const tribunalMap: { [key: string]: number } = {
      David: 7,
      Boquete: 11,
      Panamá: 1,
    };
    return tribunalMap[tribunal] || 1;
  };


  return (
    <main className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        Solicitud de Cédula
      </h1>

      {errores.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errores.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre_completo"
          placeholder="Nombre completo"
          value={formulario.nombre_completo}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-400"
          required
        />

        <input
          type="text"
          name="cedula_original"
          placeholder="Cédula anterior (si aplica)"
          value={formulario.cedula_original}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-400"
        />

        <input
          type="date"
          name="fecha_nacimiento"
          placeholder="Fecha de nacimiento"
          value={formulario.fecha_nacimiento}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-400"
          required
        />

        <input
          type="text"
          name="lugar_nacimiento"
          placeholder="Lugar de nacimiento"
          value={formulario.lugar_nacimiento}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-400"
          required
        />

        <select
          name="genero"
          value={formulario.genero}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          required
        >
          <option value="">Selecciona tu género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>

        <input
          type="url"
          name="foto_url"
          placeholder="URL de la foto (opcional)"
          value={formulario.foto_url}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black placeholder-gray-400"
        />

        <select
          name="entrega"
          value={formulario.entrega}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          required
        >
          <option value="">Selecciona tribunal más cercano</option>
          <option value="David">David</option>
          <option value="Boquete">Boquete</option>
          <option value="Panamá">Panamá</option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Procesando...' : 'Siguiente'}
        </button>
      </form>
    </main>
  );
}
