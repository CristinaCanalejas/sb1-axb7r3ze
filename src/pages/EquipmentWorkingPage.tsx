import React, { useState, useEffect } from 'react';
import { Truck, Clock, AlertCircle, Plus, Save, Trash2, MapPin, User, FileText, Building2, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import type { WorkingEquipment } from '../types';
import EquipmentService from '../services/equipmentService';
import MasterDataService from '../services/masterDataService';
import { generateWorkingEquipmentPDF, generateAllWorkingEquipmentPDF } from '../utils/pdfGenerator';

const EquipmentWorkingPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [workingEquipment, setWorkingEquipment] = useState<WorkingEquipment[]>([]);
  const [editingEquipment, setEditingEquipment] = useState<WorkingEquipment | null>(null);
  const [error, setError] = useState('');

  const equipmentService = EquipmentService.getInstance();
  const masterDataService = MasterDataService.getInstance();

  useEffect(() => {
    setWorkingEquipment(equipmentService.getWorkingEquipment());
  }, []);

  const departments = masterDataService.getDepartments();
  const equipment = masterDataService.getEquipment(selectedDepartment);
  const operators = masterDataService.getOperators(selectedDepartment);
  const activities = masterDataService.getActivities();
  const statusOptions = masterDataService.getStatusOptions();

  const filteredWorkingEquipment = selectedDepartment
    ? workingEquipment.filter(eq => eq.department === selectedDepartment)
    : workingEquipment;

  const handleDelete = (id: string) => {
    try {
      equipmentService.deleteWorkingEquipment(id);
      setWorkingEquipment(equipmentService.getWorkingEquipment());
    } catch (err) {
      setError('Error al eliminar el registro');
    }
  };

  const handlePrint = (equipment: WorkingEquipment) => {
    generateWorkingEquipmentPDF(equipment);
  };

  const handlePrintAll = () => {
    generateAllWorkingEquipmentPDF(filteredWorkingEquipment);
  };

  const getStatusInfo = (status: string) => masterDataService.getStatusInfo(status);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Equipos en Operación
            </h1>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-500" />
                <select
                  className="select min-w-[200px] flex-1"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Todos los Departamentos</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="btn btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={handlePrintAll}
                >
                  <Download className="w-4 h-4" />
                  Generar PDF
                </button>
                <button
                  className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={() => setEditingEquipment({
                    id: '',
                    equipmentId: '',
                    equipmentName: '',
                    department: selectedDepartment,
                    startTime: new Date(),
                    estimatedEndTime: new Date(),
                    location: '',
                    operatorId: '',
                    operatorName: '',
                    activity: '',
                    status: 'operando',
                    notes: '',
                  })}
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Registro
                </button>
              </div>
            </div>

            {editingEquipment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {editingEquipment.id ? 'Editar Registro' : 'Nuevo Registro'}
                      </h2>
                      <div className="flex gap-2">
                        {editingEquipment.id && (
                          <button
                            className="btn btn-secondary flex items-center gap-2"
                            onClick={() => handlePrint(editingEquipment)}
                          >
                            <Download className="w-4 h-4" />
                            Generar PDF
                          </button>
                        )}
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setEditingEquipment(null)}
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Departamento
                          </label>
                          <select
                            className="select"
                            value={editingEquipment.department}
                            onChange={(e) => setEditingEquipment({
                              ...editingEquipment,
                              department: e.target.value,
                              equipmentId: '',
                              equipmentName: '',
                              operatorId: '',
                              operatorName: '',
                            })}
                          >
                            <option value="">Seleccionar Departamento</option>
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Equipo
                          </label>
                          <select
                            className="select"
                            value={editingEquipment.equipmentId}
                            onChange={(e) => {
                              const selectedEquipment = equipment.find(eq => eq.id === e.target.value);
                              setEditingEquipment({
                                ...editingEquipment,
                                equipmentId: e.target.value,
                                equipmentName: selectedEquipment?.name || '',
                                department: selectedEquipment?.department || editingEquipment.department,
                              });
                            }}
                          >
                            <option value="">Seleccionar Equipo</option>
                            {equipment.map((eq) => (
                              <option key={eq.id} value={eq.id}>
                                {eq.id} - {eq.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Operador
                          </label>
                          <select
                            className="select"
                            value={editingEquipment.operatorId}
                            onChange={(e) => {
                              const selectedOperator = operators.find(op => op.id === e.target.value);
                              setEditingEquipment({
                                ...editingEquipment,
                                operatorId: e.target.value,
                                operatorName: selectedOperator?.name || '',
                              });
                            }}
                          >
                            <option value="">Seleccionar Operador</option>
                            {operators.map((operator) => (
                              <option key={operator.id} value={operator.id}>
                                {operator.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hora de Inicio
                          </label>
                          <input
                            type="datetime-local"
                            className="input"
                            value={format(editingEquipment.startTime, "yyyy-MM-dd'T'HH:mm")}
                            onChange={(e) => setEditingEquipment({
                              ...editingEquipment,
                              startTime: new Date(e.target.value),
                            })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hora Estimada de Término
                          </label>
                          <input
                            type="datetime-local"
                            className="input"
                            value={format(editingEquipment.estimatedEndTime, "yyyy-MM-dd'T'HH:mm")}
                            onChange={(e) => setEditingEquipment({
                              ...editingEquipment,
                              estimatedEndTime: new Date(e.target.value),
                            })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ubicación
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="input pr-24"
                              value={editingEquipment.location}
                              onChange={(e) => setEditingEquipment({
                                ...editingEquipment,
                                location: e.target.value,
                              })}
                              placeholder="Ingrese la ubicación..."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Actividad
                          </label>
                          <select
                            className="select"
                            value={editingEquipment.activity}
                            onChange={(e) => setEditingEquipment({
                              ...editingEquipment,
                              activity: e.target.value,
                            })}
                          >
                            <option value="">Seleccionar Actividad</option>
                            {activities.map((activity) => (
                              <option key={activity} value={activity}>
                                {activity}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                          </label>
                          <select
                            className="select"
                            value={editingEquipment.status}
                            onChange={(e) => setEditingEquipment({
                              ...editingEquipment,
                              status: e.target.value,
                            })}
                          >
                            <option value="">Seleccionar Estado</option>
                            {statusOptions.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notas
                          </label>
                          <textarea
                            className="input h-24 resize-none"
                            value={editingEquipment.notes}
                            onChange={(e) => setEditingEquipment({
                              ...editingEquipment,
                              notes: e.target.value,
                            })}
                            placeholder="Observaciones o detalles adicionales..."
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                          <AlertCircle className="w-5 h-5" />
                          <span>{error}</span>
                        </div>
                      )}
                    </form>
                  </div>

                  <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditingEquipment(null)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex items-center gap-2"
                        onClick={handleSave}
                      >
                        <Save className="w-4 h-4" />
                        Guardar Registro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!editingEquipment && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredWorkingEquipment.map((equipment) => (
                  <div
                    key={equipment.id}
                    className="bg-white rounded-lg shadow p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {equipment.equipmentName}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getStatusInfo(equipment.status).color
                          }`}>
                            {getStatusInfo(equipment.status).label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">{equipment.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Truck className="w-4 h-4" />
                          <span className="text-sm">{equipment.activity}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          onClick={() => setEditingEquipment(equipment)}
                          title="Editar"
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          onClick={() => handlePrint(equipment)}
                          title="Imprimir"
                        >
                          <Printer className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          onClick={() => handlePrint(equipment)}
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          onClick={() => handleDelete(equipment.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{equipment.operatorName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{equipment.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {format(equipment.startTime, 'dd/MM/yyyy HH:mm')} - {format(equipment.estimatedEndTime, 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>

                      {equipment.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Notas
                          </h4>
                          <p className="text-sm text-gray-600">
                            {equipment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentWorkingPage;