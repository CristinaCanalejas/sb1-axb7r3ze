import React, { useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { generateEquipmentStatusPDF } from '../../utils/pdfGenerator';

const EquipmentStatusHistory = () => {
  // Mock data for demonstration
  const statusHistory = [
    {
      id: '1',
      equipmentId: 'EQ001',
      equipmentName: 'Camión Volvo FH',
      status: 'non-operational',
      exitDate: new Date('2024-03-10'),
      exitTime: '08:30',
      supervisor: 'Roberto Sánchez',
      mechanic: 'Carlos Rodríguez',
      problems: [
        'Sistema hidráulico',
        'Fugas de aceite',
        'Problemas de arranque'
      ],
      spareParts: [
        'Manguera hidráulica',
        'Bomba de aceite',
        'Motor de arranque'
      ]
    },
    {
      id: '2',
      equipmentId: 'EQ002',
      equipmentName: 'Excavadora CAT 320',
      status: 'operational',
      exitDate: new Date('2024-03-09'),
      exitTime: '14:15',
      supervisor: 'Ana Martínez',
      mechanic: 'Luis García',
      problems: [
        'Desgaste de neumáticos',
        'Sistema eléctrico'
      ],
      spareParts: [
        'Neumáticos',
        'Batería'
      ]
    },
  ];

  const [selectedStatus, setSelectedStatus] = useState<any>(null);

  const handlePrint = (status: any) => {
    generateEquipmentStatusPDF(status);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Historial de Estados</h2>
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
                Equipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Salida
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora Salida
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supervisor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mecánico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statusHistory.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.equipmentId} - {record.equipmentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    record.status === 'operational' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status === 'operational' ? 'Operativo' : 'No Operativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(record.exitDate, 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.exitTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.supervisor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.mechanic}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800" 
                      title="Ver detalles"
                      onClick={() => setSelectedStatus(record)}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-800" 
                      title="Imprimir"
                      onClick={() => handlePrint(record)}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-800" 
                      title="Descargar PDF"
                      onClick={() => handlePrint(record)}
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

      {/* Details Modal */}
      {selectedStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Detalles del Estado
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedStatus.equipmentId} - {selectedStatus.equipmentName}
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedStatus(null)}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Información General</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Estado</dt>
                      <dd>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedStatus.status === 'operational' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedStatus.status === 'operational' ? 'Operativo' : 'No Operativo'}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Fecha de Salida</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {format(selectedStatus.exitDate, 'dd/MM/yyyy')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Hora de Salida</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedStatus.exitTime}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Personal Asignado</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Supervisor</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedStatus.supervisor}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Mecánico</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedStatus.mechanic}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Problemas Detectados</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStatus.problems.map((problem: string) => (
                      <span
                        key={problem}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
                      >
                        {problem}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Repuestos Requeridos</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStatus.spareParts.map((part: string) => (
                      <span
                        key={part}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentStatusHistory;