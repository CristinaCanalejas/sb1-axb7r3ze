import React, { useState } from 'react';
import { Plus, Download, FileText, Edit, Trash2, Printer } from 'lucide-react';
import { format } from 'date-fns';
import type { ClothingPPERequest } from '../types';
import ClothingPPERequestForm from '../components/personnel/ClothingPPERequestForm';

const ClothingPPERequestPage = () => {
  const [requests, setRequests] = useState<ClothingPPERequest[]>([]);
  const [editingRequest, setEditingRequest] = useState<ClothingPPERequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ClothingPPERequest | null>(null);
  const [error, setError] = useState('');

  const handleSave = (request: ClothingPPERequest) => {
    if (editingRequest) {
      // Update existing request
      setRequests(requests.map(r => 
        r.id === editingRequest.id ? request : r
      ));
      setEditingRequest(null);
    } else {
      // Add new request
      setRequests([...requests, { ...request, id: Date.now().toString() }]);
    }
  };

  const handleDelete = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const handlePrint = (request: ClothingPPERequest) => {
    // TODO: Implement PDF generation
    console.log('Print request:', request);
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Solicitudes de Vestimenta y EPP
            </h1>
            {!editingRequest && (
              <button
                className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setEditingRequest({
                  id: '',
                  requestNumber: '',
                  date: new Date(),
                  employeeId: '',
                  employeeName: '',
                  department: '',
                  sizes: {
                    shirt: '',
                    pants: '',
                    jacket: '',
                    boots: '',
                  },
                  items: [],
                  status: 'pending',
                  priority: 'normal',
                })}
              >
                <Plus className="w-4 h-4" />
                Nueva Solicitud
              </button>
            )}
          </div>

          {editingRequest ? (
            <ClothingPPERequestForm
              onSave={handleSave}
              onCancel={() => setEditingRequest(null)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.employeeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(request.date, 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority === 'urgent' ? 'Urgente' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status === 'pending' ? 'Pendiente' :
                           request.status === 'approved' ? 'Aprobada' :
                           request.status === 'rejected' ? 'Rechazada' : 'Entregada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setSelectedRequest(request)}
                            title="Ver detalles"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setEditingRequest(request)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handlePrint(request)}
                            title="Imprimir"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handlePrint(request)}
                            title="Descargar PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(request.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Detalles de Solicitud
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedRequest.employeeName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handlePrint(selectedRequest)}
                    title="Imprimir"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handlePrint(selectedRequest)}
                    title="Descargar PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedRequest(null)}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Información General</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Departamento</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRequest.department}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Fecha</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {format(selectedRequest.date, 'dd/MM/yyyy')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Estado</dt>
                      <dd>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRequest.status)}`}>
                          {selectedRequest.status === 'pending' ? 'Pendiente' :
                           selectedRequest.status === 'approved' ? 'Aprobada' :
                           selectedRequest.status === 'rejected' ? 'Rechazada' : 'Entregada'}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tallas</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Camisa</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRequest.sizes.shirt || '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Polera</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRequest.sizes.tshirt || '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Pantalón</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRequest.sizes.pants || '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Chaqueta</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRequest.sizes.jacket || '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Primera Piel</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRequest.sizes.firstLayer || '-'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Zapato de Seguridad</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRequest.sizes.boots || '-'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Ítems Solicitados</h3>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ítem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedRequest.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.type === 'clothing' ? 'Ropa de Trabajo' : 'EPP'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedRequest.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
                  <p className="text-sm text-gray-900">{selectedRequest.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothingPPERequestPage;