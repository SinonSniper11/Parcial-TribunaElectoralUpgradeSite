'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  CreditCard,
  FileText,
  Building,
  User,
  ArrowLeft,
} from 'lucide-react';
import { Cedulacion, Factura, FacturaDetalle, Servicio } from '@/app/types';
import { NextResponse } from 'next/server';
import { generatePDF } from '@/app/utils';

export default function FacturaPage() {
  const router = useRouter();

  const [cedulacionData, setCedulacionData] = useState<Cedulacion | null>(null);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [metodoPago, setMetodoPago] = useState('');
  const [loading, setLoading] = useState(true);
  const [facturaGenerada, setFacturaGenerada] = useState<Factura | null>(null);

  const impuestoFijo = 0.07;

  // Load service data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load cedulacion data from localStorage
        const datosGuardados = localStorage.getItem('cedulacionData');
        if (datosGuardados) {
          const datos = JSON.parse(datosGuardados);
          setCedulacionData(datos);
        } else {
          router.push('/pages/cedulacion');
          return;
        }

        // Load service data from API
        const servicioResponse = await fetch('/api/servicios/1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!servicioResponse.ok) {
          throw new Error('Error al obtener datos del servicio');
        }

        const servicioData: Servicio = await servicioResponse.json();
        setServicio(servicioData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        alert('Error al cargar los datos iniciales');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [router]);

  useEffect(() => {
    console.log('facturaGenerada state changed:', facturaGenerada);
  }, [facturaGenerada]);

  const calcularTotales = () => {
    if (!servicio) {
      return { subtotal: 0, impuestos: 0, total: 0 };
    }

    const precio =
      typeof servicio.precio === 'string'
        ? parseFloat(servicio.precio)
        : typeof servicio.precio === 'number'
        ? servicio.precio
        : 0;

    // Ensure precio is a valid number
    const precioValid = !isNaN(precio) ? precio : 0;

    const subtotal = precioValid;
    const impuestos = subtotal * impuestoFijo;
    const total = subtotal + impuestos;

    return { subtotal, impuestos, total };
  };

  const generarNumeroFactura = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    return `TE-${año}${mes}${dia}-${random}`;
  };

  const resetForm = () => {
    setMetodoPago('');
  };

  const handleGenerarFactura = async () => {
    if (!metodoPago) {
      alert('Por favor seleccione un método de pago');
      return;
    }

    if (!servicio) {
      alert('Error: No se pudo cargar la información del servicio');
      return;
    }

    try {
      setLoading(true);

      console.log('Llamando facturas API');

      const numeroFactura = generarNumeroFactura();
      const fechaCreacion = new Date();
      const fechaPago = new Date(fechaCreacion);
      fechaPago.setMonth(fechaPago.getMonth() + 1);

      const precioServicio =
        typeof servicio.precio === 'string'
          ? parseFloat(servicio.precio)
          : typeof servicio.precio === 'number'
          ? servicio.precio
          : 0;

      if (isNaN(precioServicio) || precioServicio <= 0) {
        throw new Error('El precio del servicio no es válido');
      }

      const cedulacionGuardados = localStorage.getItem('cedulacionData');
      if (!cedulacionGuardados) {
        throw new Error('No se encontraron datos de cedulación');
      }

      const cedulacionDataFromStorage = JSON.parse(cedulacionGuardados);

      if (!cedulacionDataFromStorage) {
        console.warn('Cedulacion data en storage no encontrado');
        return;
      }

      const subtotalReal = precioServicio;
      const impuestosReal = subtotalReal * impuestoFijo;
      const totalReal = subtotalReal + impuestosReal;

      // Buscar cedulacion
      const cedulacionResponse = await fetch('/api/cedulaciones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!cedulacionResponse.ok) {
        throw new Error('Error al obtener datos de cedulación desde la API');
      }

      const cedulacionList: Cedulacion[] = await cedulacionResponse.json();

      const matchingCedulacion = cedulacionList.find(
        cedulacion =>
          cedulacion.nombreCompleto ===
            cedulacionDataFromStorage.nombreCompleto &&
          cedulacion.cedulaOriginal ===
            cedulacionDataFromStorage.cedulaOriginal,
      );

      if (!matchingCedulacion) {
        throw new Error(
          'No se encontró un registro de cedulación que coincida con los datos proporcionados',
        );
      }

      const cedulacionId = matchingCedulacion.id;

      if (!cedulacionId) {
        console.warn(
          'Cedulacion data ID no encontrado, Es posible que primero necesites crear el registro de cedulacion',
        );
        return;
      }

      const facturaData = {
        cedulacionId: cedulacionId,
        servicios: [
          // Changed from 'facturaDetalles' to 'servicios'
          {
            servicioId: servicio.id,
            cantidad: 1,
            precioUnitario: parseFloat(precioServicio.toFixed(2)),
          },
        ],
        impuestos: parseFloat(impuestosReal.toFixed(2)), // Added impuestos field
        estadoPago: 'pendiente',
        metodoPago: metodoPago,
        fechaPago: fechaPago.toISOString(),
      };

      console.log('Enviando factura data:', facturaData);
      console.log('servicio: ', servicio);

      const facturaResponse = await fetch('/api/facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facturaData),
      });

      if (!facturaResponse.ok) {
        const errorData = await facturaResponse.text();
        throw new Error(
          `Error al crear la factura: ${facturaResponse.status} - ${errorData}`,
        );
      }

      const facturaCreada: Factura = await facturaResponse.json();
      resetForm();
      localStorage.removeItem('cedulacionData');

      setFacturaGenerada(facturaCreada);
      console.log('Factura creado');
    } catch (error) {
      console.error('Error creando factura:', error);
      alert(
        `Error al crear la factura: ${
          error instanceof Error ? error.message : 'Error desconocido'
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    generatePDF(facturaGenerada);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!cedulacionData || !servicio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {!cedulacionData
              ? 'No se encontraron datos de cedulación'
              : 'No se pudo cargar la información del servicio'}
          </p>
          <button
            onClick={() => router.push('/pages/cedulacion')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a Cedulación
          </button>
        </div>
      </div>
    );
  }

  const { subtotal, impuestos, total } = calcularTotales();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto shadow-sm bg-white">
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Generación de Factura
                </h1>
                <p className="text-gray-600">
                  Tribunal Electoral - Dirección Nacional de Cedulación
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/pages/cedulacion')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </button>
          </div>
        </div>

        {/* Datos del Solicitante */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Datos del Solicitante
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre Completo</p>
              <p className="font-medium text-black">
                {cedulacionData.nombreCompleto}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cédula Anterior</p>
              <p className="font-medium text-black">
                {cedulacionData.cedulaOriginal || 'Primera vez'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
              <p className="font-medium text-black">
                {cedulacionData.fechaNacimiento}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lugar de Nacimiento</p>
              <p className="font-medium text-black">
                {cedulacionData.lugarNacimiento}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Género</p>
              <p className="font-medium text-black">{cedulacionData.genero}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tribunal de Entrega</p>
              <p className="font-medium text-black">
                {cedulacionData.tribunal?.nombre}
              </p>
            </div>
          </div>
        </div>

        {/* Detalle del Servicio */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Detalle del Servicio
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {servicio.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {servicio.tipoServicio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    B/.{' '}
                    {(() => {
                      const precio =
                        typeof servicio.precio === 'string'
                          ? parseFloat(servicio.precio)
                          : typeof servicio.precio === 'number'
                          ? servicio.precio
                          : 0;
                      return (!isNaN(precio) ? precio : 0).toFixed(2);
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    B/. {subtotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Método de Pago y Totales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Método de Pago */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Método de Pago
            </h3>
            <div className="space-y-3">
              {[
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
                { value: 'transferencia', label: 'Transferencia Bancaria' },
                { value: 'cheque', label: 'Cheque' },
              ].map(opcion => (
                <label
                  key={opcion.value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value={opcion.value}
                    checked={metodoPago === opcion.value}
                    onChange={e => setMetodoPago(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {opcion.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Resumen de Totales */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Resumen de Pago
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-black">
                  B/. {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos (7%):</span>
                <span className="font-medium text-black">
                  B/. {impuestos.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-black">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    B/. {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generar factura */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {facturaGenerada === null ? (
              <button
                onClick={handleGenerarFactura}
                disabled={!metodoPago || loading}
                className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  metodoPago && !loading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>{loading ? 'Generando...' : 'Generar Factura'}</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={generarPDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Descargar PDF</span>
                </button>
                <button
                  onClick={() => setFacturaGenerada(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Nueva Factura
                </button>
              </div>
            )}
          </div>

          {facturaGenerada && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-center">
                ✅ Factura generada exitosamente:{' '}
                <strong>{facturaGenerada.numeroFactura}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
