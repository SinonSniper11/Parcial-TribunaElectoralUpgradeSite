'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Building,
  User,
  CreditCard,
} from 'lucide-react';
import {
  Cedulacion,
  Factura,
  Servicio,
  Tribunal,
  FacturaDetalle,
} from '@/app/types';
import { generatePDF } from '@/app/utils';

const InvoiceManagement = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [tribunales, setTribunales] = useState<Tribunal[]>([]);
  const [cedulaciones, setCedulaciones] = useState<Cedulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);

  // Form state
  const [selectedCedulacion, setSelectedCedulacion] = useState('');
  const [selectedServicios, setSelectedServicios] = useState<
    { servicioId: string; cantidad: number }[]
  >([{ servicioId: '', cantidad: 1 }]);
  const [impuestos, setImpuestos] = useState('0.07');
  const [metodoPago, setMetodoPago] = useState('');

  const printRef = useRef<HTMLDivElement>(null);

  // Calcular impuesto como 7% fijo

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [facturasRes, serviciosRes, tribunalesRes, cedulacionesRes] =
        await Promise.all([
          fetch('/api/facturas'),
          fetch('/api/servicios'),
          fetch('/api/tribunales'),
          fetch('/api/cedulaciones'),
        ]);

      const [facturasData, serviciosData, tribunalesData, cedulacionesData] =
        await Promise.all([
          facturasRes.json(),
          serviciosRes.json(),
          tribunalesRes.json(),
          cedulacionesRes.json(),
        ]);

      setFacturas(facturasData);
      setServicios(serviciosData);
      setTribunales(tribunalesData);
      setCedulaciones(cedulacionesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCedulacion('');
    setSelectedServicios([{ servicioId: '', cantidad: 1 }]);
    setImpuestos('0.07');
    setMetodoPago('');
    setEditingFactura(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviciosData = selectedServicios
      .filter(s => s.servicioId)
      .map(s => {
        const servicio = servicios.find(
          serv => serv.id === parseInt(s.servicioId),
        );
        return {
          servicioId: s.servicioId,
          cantidad: s.cantidad,
          precioUnitario: servicio?.precio || 0,
        };
      });

    if (!selectedCedulacion || serviciosData.length === 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      const response = await fetch('/api/facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedulacionId: selectedCedulacion,
          servicios: serviciosData,
          impuestos: parseFloat(impuestos),
          metodoPago,
          estadoPago: 'pendiente',
        }),
      });

      if (response.ok) {
        await fetchAllData();
        setShowModal(false);
        resetForm();
      } else {
        alert('Error al crear la factura');
      }
    } catch (error) {
      console.error('Error creating factura:', error);
      alert('Error al crear la factura');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta factura?')) return;

    try {
      const response = await fetch(`/api/facturas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        alert('Error al eliminar la factura');
      }
    } catch (error) {
      console.error('Error deleting factura:', error);
      alert('Error al eliminar la factura');
    }
  };

  const handleUpdatePayment = async (facturaId: number, estadoPago: string) => {
    try {
      const response = await fetch(`/api/facturas/${facturaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estadoPago,
          fechaPago: estadoPago === 'pagado' ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        await fetchAllData();
      } else {
        alert('Error al actualizar el estado de pago');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Error al actualizar el estado de pago');
    }
  };

  const addServicioRow = () => {
    setSelectedServicios([
      ...selectedServicios,
      { servicioId: '', cantidad: 1 },
    ]);
  };

  const removeServicioRow = (index: number) => {
    setSelectedServicios(selectedServicios.filter((_, i) => i !== index));
  };

  const updateServicioRow = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...selectedServicios];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedServicios(updated);
  };

  

  const formatCurrency = (amount: number) => {
    const numericAmount = parseFloat(amount.toString()) || 0;
    return `B/. ${numericAmount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'text-green-700 bg-green-100';
      case 'cancelado':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-yellow-700 bg-yellow-100';
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sistema de Facturación
                </h1>
                <p className="text-gray-600">
                  Tribunal Electoral - Dirección Nacional de Cedulación
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Factura</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Facturas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {facturas.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {facturas.filter(f => f.estadoPago === 'pagado').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <User className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {facturas.filter(f => f.estadoPago === 'pendiente').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Facturas Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Lista de Facturas
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tribunal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facturas.map(factura => (
                  <tr key={factura.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {factura.numeroFactura}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {factura.cedulacion.nombreCompleto}
                      </div>
                      <div className="text-sm text-gray-500">
                        {factura.cedulacion.cedulaOriginal}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {factura.cedulacion.tribunal.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {factura.cedulacion.tribunal.provincia}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(parseFloat(factura.total.toString()))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          factura.estadoPago,
                        )}`}
                      >
                        {factura.estadoPago}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(factura.createdAt).toLocaleDateString('es-PA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => generatePDF(factura)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Generar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {factura.estadoPago === 'pendiente' && (
                          <button
                            onClick={() =>
                              handleUpdatePayment(factura.id, 'pagado')
                            }
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Marcar como pagado"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(factura.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for New Invoice */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Nueva Factura
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cedulación Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Cedulación *
                  </label>
                  <select
                    value={selectedCedulacion}
                    onChange={e => setSelectedCedulacion(e.target.value)}
                    className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccione una cedulación...</option>
                    {cedulaciones.map(cedulacion => (
                      <option key={cedulacion.id} value={cedulacion.id}>
                        {cedulacion.nombreCompleto} -{' '}
                        {cedulacion.cedulaOriginal} (
                        {cedulacion.tribunal.nombre})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Services Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servicios *
                  </label>
                  {selectedServicios.map((item, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <select
                        value={item.servicioId}
                        onChange={e =>
                          updateServicioRow(index, 'servicioId', e.target.value)
                        }
                        className="flex-1 p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccione un servicio...</option>
                        {servicios.map(servicio => (
                          <option key={servicio.id} value={servicio.id}>
                            {servicio.nombre} -{' '}
                            {formatCurrency(servicio.precio)} (
                            {servicio.tipoServicio})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={e =>
                          updateServicioRow(
                            index,
                            'cantidad',
                            parseInt(e.target.value),
                          )
                        }
                        className="w-20 p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Cant."
                      />
                      {selectedServicios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeServicioRow(index)}
                          className="p-3 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addServicioRow}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar servicio
                  </button>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impuestos (B/.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={impuestos}
                      // onChange={(e) => setImpuestos(e.target.value)}
                      readOnly
                      className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <select
                      value={metodoPago}
                      onChange={e => setMetodoPago(e.target.value)}
                      className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccione método...</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                      <option value="transferencia">
                        Transferencia Bancaria
                      </option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Crear Factura
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;
