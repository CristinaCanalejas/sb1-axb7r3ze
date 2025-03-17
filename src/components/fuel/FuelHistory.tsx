import React, { useState } from 'react';
import { FileText, Download, X } from 'lucide-react';
import { format } from 'date-fns';

const FuelHistory = () => {
  // Mock data for demonstration
  const fuelRecords = [
    {
      id: '1',
      date: new Date('2024-03-10T08:30:00'),
      operator: 'Juan Pérez',
      equipment: 'EQ001 - Camión Volvo FH',
      odometer: 125000,
      fuelType: 'Diesel',
      liters: 150.5,
      department: 'TRANSPORTE',
      supervisor: 'Roberto Sánchez',
      internalNumber: 'CAM-001',
      notes: 'Recarga programada',
    },
    {
      id: '2',
      date: new Date('2024-03-10T10:15:00'),
      operator: 'María González',
      equipment: 'EQ002 - Excavadora CAT 320',
      odometer: 3500,
      fuelType: 'Diesel',
      liters: 200.0,
      department: 'EXTRACCIÓN',
      supervisor: 'Ana Martínez',
      internalNumber: 'EXC-001',
      notes: 'Recarga de emergencia',
    },
  ];

  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Historial de Recargas</h2>
        <button className="btn btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Odómetro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Combustible
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Litros
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fuelRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(record.date, 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.operator}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.equipment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.odometer.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.fuelType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.liters.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Detalles de Recarga
                  </h2>
                  <p className="text-sm text-gray-500">
                    {format(selectedRecord.date, 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedRecord(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Información del Equipo</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Equipo</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.equipment}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">N° Interno</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.internalNumber}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Departamento</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.department}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Odómetro</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.odometer.toLocaleString()} km
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Detalles de la Recarga</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Tipo de Combustible</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.fuelType}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Cantidad</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.liters.toFixed(2)} litros
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Operador</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.operator}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Supervisor</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.supervisor}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {selectedRecord.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
                  <p className="text-sm text-gray-900">{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelHistory;