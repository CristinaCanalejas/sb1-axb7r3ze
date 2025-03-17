import React, { useState, useEffect } from 'react';
import { FileText, Download, X } from 'lucide-react';
import { format } from 'date-fns';

const FuelHistory = () => {
  const [fuelRecords, setFuelRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchFuelRecords();
  }, []);

  const fetchFuelRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/fuel');
      
      if (!response.ok) {
        throw new Error('Error al obtener los registros de combustible');
      }
      
      const data = await response.json();
      setFuelRecords(data);
      setError('');
    } catch (err) {
      console.error('Error fetching fuel records:', err);
      setError('No se pudieron cargar los registros de combustible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Historial de Recargas</h2>
        <button className="btn btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando registros...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={fetchFuelRecords} 
            className="mt-2 text-blue-500 hover:underline"
          >
            Intentar nuevamente
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {fuelRecords.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay registros de combustible disponibles.
            </div>
          ) : (
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
                {fuelRecords.map((record: any) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(record.date), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.operator_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.equipment_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.odometer?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.fuel_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(record.liters).toFixed(2)}
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
          )}
        </div>
      )}

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
                    {format(new Date(selectedRecord.date), 'dd/MM/yyyy HH:mm')}
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
                        {selectedRecord.equipment_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">N° Interno</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.internal_number}
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
                        {selectedRecord.odometer?.toLocaleString() || 'N/A'} km
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
                        {selectedRecord.fuel_type}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Cantidad</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {parseFloat(selectedRecord.liters).toFixed(2)} litros
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Operador</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.operator_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Supervisor</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {selectedRecord.supervisor_name}
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

export default FuelHistory;