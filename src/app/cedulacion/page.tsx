
'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { label: 'Identificación' },
  { label: 'Tipo de Trámite' },
  { label: 'Servicio' },
  { label: 'Datos Personales' },
  { label: 'Firma y Foto' },
  { label: 'Tribunal de Entrega' },
];

export default function Page() {
  const router = useRouter();

  const provincias = [
    { nombre: 'Bocas del Toro', codigo: '1' },
    { nombre: 'Coclé', codigo: '2' },
    { nombre: 'Colón', codigo: '3' },
    { nombre: 'Chiriquí', codigo: '4' },
    { nombre: 'Darién', codigo: '5' },
    { nombre: 'Herrera', codigo: '6' },
    { nombre: 'Los Santos', codigo: '7' },
    { nombre: 'Panamá', codigo: '8' },
    { nombre: 'Veraguas', codigo: '9' },
    { nombre: 'Panamá Oeste', codigo: '10' },
    { nombre: 'Emberá', codigo: '11' },
    { nombre: 'Guna Yala', codigo: '12' },
    { nombre: 'Ngäbe-Buglé', codigo: '13' },
  ];

  const [formulario, setFormulario] = useState({
    tipo_identificacion: 'cedula',
    tipo_tramite: '',
    nombre_completo: '',
    cedula_original: '',
    fecha_nacimiento: '',
    provincia: '',
    lugar_nacimiento: '',
    genero: '',
    tipo_sangre: '',
    firma: '',
    firma_digital_url: '',
    correo: '',
    foto_url: '',
    fecha_solicitud: new Date().toISOString(),
    estado: 'pendiente',
    entrega: '',
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tribunales, setTribunales] = useState<{ id: number; nombre: string }[]>([]);
  const [servicios, setServicios] = useState<{ id: number; nombre: string }[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const fetchTribunales = async () => {
      try {
        const res = await fetch('/api/tribunales');
        if (!res.ok) throw new Error('No se pudieron cargar los tribunales');
        const data = await res.json();
        setTribunales(data);
      } catch (err) {
        setErrores(prev => ({ ...prev, entrega: 'Error al cargar tribunales' }));
      }
    };
    const fetchServicios = async () => {
      try {
        const res = await fetch('/api/servicios');
        if (!res.ok) throw new Error('No se pudieron cargar los servicios');
        let data = await res.json();
        if (Array.isArray(data)) {
          const idx = data.findIndex(s => s.nombre && s.nombre.toLowerCase().includes('renovación'));
          if (idx > 0) {
            const [renovacion] = data.splice(idx, 1);
            data.unshift(renovacion);
          }
        }
        setServicios(data);
      } catch (err) {
        setErrores(prev => ({ ...prev, servicio: 'Error al cargar servicios' }));
      }
    };
    fetchTribunales();
    fetchServicios();
  }, []);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'provincia') {
      setFormulario(prev => ({
        ...prev,
        provincia: value,
        cedula_original: value
          ? value + (prev.cedula_original.length > 1 ? prev.cedula_original.slice(1) : '')
          : '',
      }));
    } else if (name === 'cedula_original') {
      setFormulario(prev => ({
        ...prev,
        cedula_original: prev.provincia
          ? prev.provincia + value.replace(/\D/g, '').slice(1, 8)
          : value.replace(/\D/g, '').slice(0, 8),
      }));
    } else {
      setFormulario(prev => ({ ...prev, [name]: value }));
    }
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!servicioSeleccionado) {
      setErrores(prev => ({ ...prev, servicio: 'Debes seleccionar un servicio' }));
      setIsSubmitting(false);
      return;
    }

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
        servicioId: parseInt(servicioSeleccionado),
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

      router.push(`/factura?cedulacionId=${result.id}`);
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
    const found = tribunales.find(t => t.nombre === tribunal);
    return found ? found.id : 1;
  };


  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 w-full max-w-5xl mx-auto mt-10 p-0 md:p-0 bg-transparent shadow-none">
          {!showWizard && (
            <section className="rounded-3xl bg-gradient-to-br from-blue-100 via-white to-blue-50 border-2 border-blue-100 shadow-2xl flex flex-col md:flex-row items-center gap-8 px-2 py-8 md:px-16 md:py-16 animate-fade-in mb-10 relative overflow-hidden w-full max-w-5xl mx-auto">
              <div className="flex-1 z-10 min-w-[320px] md:min-w-[420px]">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow-lg">Servicios de Cedulación</h2>
                <p className="mb-4 text-gray-700 text-lg leading-relaxed font-medium">
                  La <span className="font-semibold text-blue-700">cédula de identidad</span> es el documento oficial que identifica plenamente a la persona en Panamá. Proporciona datos como:
                </p>
                <ul className="list-disc pl-8 text-gray-700 mb-4 text-base md:text-lg space-y-1">
                  <li>Número de inscripción de nacimiento (igual al de la cédula)</li>
                  <li>Nombres y apellidos</li>
                  <li>Lugar de nacimiento</li>
                  <li>Sexo</li>
                  <li>Foto</li>
                  <li>Tipo de sangre</li>
                  <li>Firma</li>
                  <li>Fecha de expedición y vencimiento</li>
                </ul>
                <div className="mt-4 text-blue-900 text-base md:text-lg font-semibold flex flex-wrap gap-2 items-center">
                  <span>Los servicios están divididos en:</span>
                  <span className="inline-block rounded-full bg-blue-300/80 px-3 py-1 text-xs md:text-sm font-bold text-blue-900 shadow">Trámites de nacionales</span>
                  <span className="inline-block rounded-full bg-blue-200 px-3 py-1 text-xs md:text-sm font-bold text-blue-800 shadow">Trámites de extranjeros</span>
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs md:text-sm font-bold text-blue-700 shadow">Autentificación y certificación</span>
                </div>
                <div className="mt-8 flex flex-col items-center w-full ">
                  <button
                    className=" px-12 py-5 rounded-2xl shadow-xl text-lg font-bold uppercase tracking-wider bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0 hover:scale-105 hover:from-blue-500 hover:to-blue-800 transition-all duration-200 min-w-[320px] max-w-2xl"
                    onClick={() => setShowWizard(true)}
                  >
                    Empezar trámite en línea
                  </button>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-center z-0 min-w-[350px]">
                <img
                  src="/tepanama-logo.png"
                  alt="Logo Tribunal Electoral"
                  className="w-44 h-44 object-contain drop-shadow-2xl mb-4 animate-float"
                />
                <div className="rounded-2xl h-48 relative shadow-xl overflow-hidden flex items-center justify-center">
                  <img
                    src="https://www.marbellastereo.net/wp-content/uploads/2024/07/actualidad-cedula-e1720562098967.jpg"
                    alt="Ejemplo de cédula panameña"
                    className="w-full h-full object-contain z-10 relative"
                    style={{ filter: 'drop-shadow(0 0 24px rgba(59,130,246,0.18))' }}
                  />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 400 192" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <defs>
                      <radialGradient id="fade" cx="50%" cy="50%" r="0.9">
                        <stop offset="80%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.95" />
                      </radialGradient>
                    </defs>
                    <rect x="0" y="0" width="400" height="192" fill="url(#fade)" />
                  </svg>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-blue-100 rounded-full opacity-40 blur-2xl z-0" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-2xl z-0" />
            </section>
          )}

          {showWizard && (
            <>
              <div className="flex items-center justify-center mb-8">
                {STEPS.map((step, idx) => (
                  <div key={step.label} className="flex items-center">
                    <div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold
                        ${idx < currentStep ? 'bg-blue-200 text-blue-600 border-2 border-blue-400' : ''}
                        ${idx === currentStep ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg border-4 border-blue-400 scale-110 z-10' : ''}
                        ${idx > currentStep ? 'bg-gray-200 text-gray-400 border-2 border-gray-300' : ''}
                        transition-all duration-300`}
                    >
                      {idx + 1}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`h-1 w-10 ${idx < currentStep ? 'bg-blue-400' : 'bg-gray-300'} transition-all duration-300`}></div>
                    )}
                  </div>
                ))}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-6 uppercase tracking-wide text-blue-700 focus:outline-none">
                {(() => {
                  switch (currentStep) {
                    case 0: return 'Seleccione tipo de identificación';
                    case 1: return 'Seleccione tipo de trámite';
                    case 2: return 'Seleccione un servicio';
                    case 3: return 'Datos personales';
                    case 4: return 'Firma y foto';
                    case 5: return 'Tribunal de entrega';
                    default: return '';
                  }
                })()}
              </h1>

              {errores.submit && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errores.submit}
                </div>
              )}

               {currentStep === 0 && (
                <div className="flex flex-col gap-6 items-center">
                  <button
                    className={`w-full py-5 rounded-2xl shadow-lg text-xl font-bold uppercase tracking-wide border-2
                      ${formulario.tipo_identificacion === 'cedula' ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-white text-blue-500 border-gray-300'}
                      hover:bg-blue-200 transition-all`}
                    onClick={() => {
                      setFormulario(f => ({ ...f, tipo_identificacion: 'cedula', tipo_tramite: '', }));
                      goNext();
                    }}
                  >
                    Cédula
                  </button>
                  <button
                    className={`w-full py-5 rounded-2xl shadow-lg text-xl font-bold uppercase tracking-wide border-2
                      ${formulario.tipo_identificacion === 'pasaporte' ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-white text-blue-500 border-gray-300'}
                      hover:bg-blue-200 transition-all`}
                    onClick={() => {
                      setFormulario(f => ({ ...f, tipo_identificacion: 'pasaporte', tipo_tramite: '', }));
                      goNext();
                    }}
                  >
                    Pasaporte
                  </button>
                </div>
              )}

              {currentStep === 1 && formulario.tipo_identificacion === 'cedula' && (
                <div className="flex flex-col gap-6 items-center">
                  {['cedulacion', 'registro_civil', 'organizacion_electoral'].map(tipo => (
                    <button
                      key={tipo}
                      className={`w-full py-5 rounded-2xl shadow-lg text-xl font-bold uppercase tracking-wide border-2
                        ${formulario.tipo_tramite === tipo ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-white text-blue-500 border-gray-300'}
                        hover:bg-blue-200 transition-all`}
                      onClick={() => {
                        setFormulario(f => ({ ...f, tipo_tramite: tipo }));
                        goNext();
                      }}
                    >
                      {tipo === 'cedulacion' ? 'Cedulación' : tipo === 'registro_civil' ? 'Registro Civil' : 'Organización Electoral'}
                    </button>
                  ))}
                </div>
              )}
              {currentStep === 1 && formulario.tipo_identificacion === 'pasaporte' && (
                <div className="flex flex-col items-center">
                  <button
                    className="w-full py-5 rounded-2xl shadow-lg text-xl font-bold uppercase tracking-wide border-2 bg-blue-100 text-blue-700 border-blue-400 hover:bg-blue-200 transition-all"
                    onClick={goNext}
                  >
                    Continuar
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-col gap-6 items-center">
                  {servicios.map(s => (
                    <button
                      key={s.id}
                      className={`w-full py-5 rounded-2xl shadow-lg text-xl font-bold uppercase tracking-wide border-2
                        ${servicioSeleccionado === String(s.id) ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-white text-blue-500 border-gray-300'}
                        hover:bg-blue-200 transition-all`}
                      onClick={() => {
                        setServicioSeleccionado(String(s.id));
                        setErrores(prev => ({ ...prev, servicio: '' }));
                        goNext();
                      }}
                    >
                      {s.nombre}
                    </button>
                  ))}
                  {errores.servicio && (
                    <div className="text-red-600 text-sm mt-1">{errores.servicio}</div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); goNext(); }}>
                  <input
                    type="text"
                    name="nombre_completo"
                    placeholder="Nombre completo"
                    value={formulario.nombre_completo}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl text-black placeholder-gray-400 text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                    required
                  />
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    value={formulario.correo}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl text-black placeholder-gray-400 text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                    required
                  />
                  <div className="flex gap-2">
                    <select
                      name="provincia"
                      value={formulario.provincia}
                      onChange={handleChange}
                      className="w-1/2 p-3 rounded-xl text-black text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                      required
                    >
                      <option value="">Provincia de nacimiento</option>
                      {provincias.map(p => (
                        <option key={p.codigo} value={p.codigo}>{p.nombre}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="lugar_nacimiento"
                      placeholder="Lugar de nacimiento"
                      value={formulario.lugar_nacimiento}
                      onChange={handleChange}
                      className="w-1/2 p-3 rounded-xl text-black placeholder-gray-400 text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                      required
                    />
                  </div>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    placeholder="Fecha de nacimiento"
                    value={formulario.fecha_nacimiento}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl text-black placeholder-gray-400 text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                    required
                  />
                  <div className="w-full flex items-center">
                    <input
                      type="text"
                      name="cedula_original"
                      placeholder="Número de cédula"
                      value={formulario.cedula_original}
                      onChange={e => {
                        let val = e.target.value.replace(/[^0-9-]/g, '');
                        if (formulario.provincia) {
                          if (!val.startsWith(formulario.provincia)) {
                            val = formulario.provincia + (val.startsWith('-') ? '' : '-') + val.replace(/^\d*-?/, '');
                          }
                        }
                        setFormulario(prev => ({
                          ...prev,
                          cedula_original: val,
                        }));
                        if (errores['cedula_original']) {
                          setErrores(prev => ({ ...prev, cedula_original: '' }));
                        }
                      }}
                      className="w-full p-3 border rounded-xl text-black placeholder-gray-400 text-lg shadow"
                      maxLength={20}
                      autoComplete="off"
                      disabled={!formulario.provincia}
                      onFocus={e => {
                        setTimeout(() => {
                          e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                        }, 0);
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition-all"
                  >
                    Siguiente
                  </button>
                </form>
              )}

              {/* Step 4: Firma y foto */}
              {currentStep === 4 && (
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); goNext(); }}>
                  <select
                    name="genero"
                    value={formulario.genero}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl text-black text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                    required
                  >
                    <option value="">Selecciona tu género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <select
                    name="tipo_sangre"
                    value={formulario.tipo_sangre || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl text-black text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                    required
                  >
                    <option value="">Selecciona tu tipo de sangre</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <select
                    name="firma"
                    value={formulario.firma || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl text-black text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                    required
                  >
                    <option value="">Selecciona tipo de firma</option>
                    <option value="no_firma">Sin firma</option>
                    <option value="firma_digital">Firma digital</option>
                    <option value="firma_anterior">Firma anterior</option>
                  </select>
                  {formulario.firma === 'firma_digital' && (
                    <input
                      type="url"
                      name="firma_digital_url"
                      placeholder="URL de la imagen de la firma digital"
                      value={formulario.firma_digital_url || ''}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl text-black placeholder-gray-400 text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                      required
                    />
                  )}
                  <input
                    type="url"
                    name="foto_url"
                    placeholder="URL de la foto con fondo blanco"
                    value={formulario.foto_url}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl text-black placeholder-gray-400 text-lg shadow-sm focus:shadow-lg focus:outline-none border-0"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition-all"
                  >
                    Siguiente
                  </button>
                </form>
              )}

+              {currentStep === 5 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-6 items-center">
                    {tribunales.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className={`w-full py-5 rounded-2xl shadow-lg text-xl font-bold uppercase tracking-wide border-2
                          ${formulario.entrega === t.nombre ? 'bg-blue-100 text-blue-700 border-blue-400' : 'bg-white text-blue-500 border-gray-300'}
                          hover:bg-blue-200 transition-all`}
                        onClick={() => setFormulario(f => ({ ...f, entrega: t.nombre }))}
                      >
                        {t.nombre}
                      </button>
                    ))}
                    {errores.entrega && (
                      <div className="text-red-600 text-sm mt-1">{errores.entrega}</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formulario.entrega}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Procesando...' : 'Finalizar y continuar'}
                  </button>
                </form>
              )}

+              {currentStep > 0 && (
                <button
                  className="w-full mt-4 py-4 rounded-2xl shadow-lg text-xl font-bold uppercase tracking-wide border-2 border-yellow-400 bg-white text-yellow-600 hover:bg-yellow-50 transition-all"
                  onClick={goBack}
                  type="button"
                >
                  REGRESAR
                </button>
              )}
            </>
          )}
        </main>
        <div className="h-8" />
        <Footer />
      </div>
    </>
  );
}
