import React, { useState } from 'react';
import { FileText, Download, Edit, Trash2, Phone, Mail, X } from 'lucide-react';
import type { Employee } from '../../types';

interface Props {
  personnel: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const PersonnelList: React.FC<Props> = ({ personnel, onEdit, onDelete }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Personal</h2>
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
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turnos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {personnel.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {person.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {person.department}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {person.role.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {person.shifts.map((shift) => (
                      <span
                        key={shift}
                        className="text-sm text-gray-900"
                      >
                        {shift}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{person.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{person.contact.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800" 
                      title="Ver detalles"
                      onClick={() => setSelectedEmployee(person)}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-800" 
                      title="Editar"
                      onClick={() => onEdit(person)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800" 
                      title="Eliminar"
                      onClick={() => onDelete(person.id)}
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

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Detalles del Personal
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.fullName}
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedEmployee(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Información General</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Departamento</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedEmployee.department}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Correo Electrónico</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedEmployee.contact.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Teléfono</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedEmployee.contact.phone}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Roles y Turnos</h3>
                  <dl className="mt-2 space-y-4">
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">Roles</dt>
                      <dd className="flex flex-wrap gap-1">
                        {selectedEmployee.role.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">Turnos</dt>
                      <dd className="flex flex-col gap-1">
                        {selectedEmployee.shifts.map((shift) => (
                          <span
                            key={shift}
                            className="text-sm font-medium text-gray-900"
                          >
                            {shift}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelList;