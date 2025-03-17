import React, { useState } from 'react';
import { Download, FileText, X, Printer } from 'lucide-react';
import { format } from 'date-fns';
import type { WorkshopDelivery } from '../../types';
import { generateWorkshopDeliveryPDF } from '../../utils/pdfGenerator';

interface Props {
  deliveries: WorkshopDelivery[];
  onClose: () => void;
}

const WorkshopDeliveryHistory: React.FC<Props> = ({ deliveries, onClose }) => {
  const [selectedDelivery, setSelectedDelivery] = useState<WorkshopDelivery | null>(null);

  const handlePrint = (delivery: WorkshopDelivery) => {
    generateWorkshopDeliveryPDF(delivery);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Historial de Entregas a Taller
              </h2>
              <p className="text-sm text-gray-500">
                Registro de materiales entregados
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Entrega
                  </th>
                  <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recibido por
                  </th>
                  <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {delivery.deliveryNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(delivery.date, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {delivery.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {delivery.receivedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {delivery.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setSelectedDelivery(delivery)}
                          title="Ver detalles"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handlePrint(delivery)}
                          title="Imprimir"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handlePrint(delivery)}
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Detalles de Entrega
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedDelivery.deliveryNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handlePrint(selectedDelivery)}
                    title="Imprimir"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handlePrint(selectedDelivery)}
                    title="Descargar PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedDelivery(null)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Información General</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Fecha</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {format(selectedDelivery.date, 'dd/MM/yyyy')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Hora</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedDelivery.time}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Recibido por</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedDelivery.receivedBy}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Departamento</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedDelivery.department}
                      </dd>
                    </div>
                  </dl>
                </div>

                {selectedDelivery.equipmentName && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Equipo</h3>
                    <dl className="mt-2 space-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Nombre</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {selectedDelivery.equipmentName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">N° Interno</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {selectedDelivery.equipmentInternalNumber}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Ítems Entregados</h3>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ítem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidad
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedDelivery.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.itemName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedDelivery.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
                  <p className="text-sm text-gray-900">{selectedDelivery.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopDeliveryHistory;