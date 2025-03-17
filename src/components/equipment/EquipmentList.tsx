import React, { useState } from 'react';
import { FileText, Download, Edit, Trash2, Image, Save, X, Printer } from 'lucide-react';
import type { Equipment } from '../../types';
import { generateEquipmentPDF } from '../../utils/pdfGenerator';

interface Props {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipment: Equipment) => void;
}

const EquipmentList: React.FC<Props> = ({ equipment, onEdit, onDelete }) => {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const handlePrint = (equipment: Equipment) => {
    generateEquipmentPDF(equipment);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Equipos</h2>
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
                N° Interno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documentos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipment.map((eq) => (
              <tr key={eq.internalNumber} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {eq.internalNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {eq.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {eq.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    eq.status === 'operational' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {eq.status === 'operational' ? 'Operativo' : 'No Operativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" title="Ver ficha técnica">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800" title="Ver fotos">
                      <Image className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setSelectedEquipment(eq)}
                      title="Ver detalles"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onEdit(eq)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handlePrint(eq)}
                      title="Imprimir"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handlePrint(eq)}
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDelete(eq)}
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

      {/* Equipment Details Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Detalles del Equipo
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedEquipment.internalNumber}
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedEquipment(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Información General</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Nombre</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedEquipment.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Tipo</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedEquipment.type}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Departamento</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedEquipment.department}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Estado Operativo</dt>
                      <dd>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedEquipment.status === 'operational' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedEquipment.status === 'operational' ? 'Operativo' : 'No Operativo'}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Documents Section */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Documentos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Ficha Técnica</span>
                      </div>
                      {selectedEquipment.technicalSheet && (
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Fotos</span>
                      </div>
                      {selectedEquipment.photos && selectedEquipment.photos.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {selectedEquipment.photos.length} fotos
                        </span>
                      )}
                    </div>
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

export default EquipmentList;