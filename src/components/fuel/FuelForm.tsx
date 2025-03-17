import React, { useState } from 'react';
import { format } from 'date-fns';
import { Save, AlertCircle } from 'lucide-react';
import type { FuelRecord } from '../../types';

const FuelForm = () => {
  const [formData, setFormData] = useState<Partial<FuelRecord & { internalNumber: string; supervisor: string; department: string }>>({
    date: new Date(),
    department: '',
    operatorId: '',
    internalNumber: '',
    equipmentId: '',
    odometer: 0,
    fuelType: '',
    liters: 0,
    supervisor: '',
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const departments = ['EXTRACCIÓN', 'TRANSPORTE', 'ADMINISTRACIÓN'];
  const fuelTypes = ['Diesel', 'Gasolina 95', 'Gasolina 97'];
  
  // Mock data for demonstration
  const operators = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María González' },
    { id: '3', name: 'Carlos Rodríguez' },
  ];

  const equipment = [
    { id: 'EQ001', name: 'Camión Volvo FH' },
    { id: 'EQ002', name: 'Excavadora CAT 320' },
    { id: 'EQ003', name: 'Cargador Frontal 966H' },
  ];

  const supervisors = [
    { id: '1', name: 'Roberto Sánchez' },
    { id: '2', name: 'Ana Martínez' },
    { id: '3', name: 'Luis García' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.operatorId || !formData.internalNumber || !formData.equipmentId || !formData.fuelType || formData.liters <= 0 || !formData.supervisor || !formData.department) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/fuel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el registro');
      }

      setSuccess('Registro guardado exitosamente');
      setFormData({
        date: new Date(),
        department: '',
        operatorId: '',
        internalNumber: '',
        equipmentId: '',
        odometer: 0,
        fuelType: '',
        liters: 0,
        supervisor: '',
      });

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date and Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha y Hora
          </label>
          <input
            type="datetime-local"
            className="input"
            value={format(formData.date || new Date(), "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
          />
        </div>

        {/* Operator Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operador
          </label>
          <select
            className="select"
            value={formData.operatorId}
            onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
          >
            <option value="">Seleccionar Operador</option>
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departamento
          </label>
          <select
            className="select"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            <option value="">Seleccionar Departamento</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Internal Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            N° Interno
          </label>
          <input
            type="text"
            className="input"
            value={formData.internalNumber}
            onChange={(e) => setFormData({ ...formData, internalNumber: e.target.value })}
            placeholder="Ingrese N° interno"
          />
        </div>

        {/* Equipment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipo
          </label>
          <select
            className="select"
            value={formData.equipmentId}
            onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
          >
            <option value="">Seleccionar Equipo</option>
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.id} - {eq.name}
              </option>
            ))}
          </select>
        </div>

        {/* Odometer Reading */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Odómetro (km)
          </label>
          <input
            type="number"
            className="input"
            min="0"
            step="1"
            value={formData.odometer}
            onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) })}
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Combustible
          </label>
          <select
            className="select"
            value={formData.fuelType}
            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
          >
            <option value="">Seleccionar Tipo</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad (Litros)
          </label>
          <input
            type="number"
            className="input"
            min="0"
            step="0.01"
            value={formData.liters}
            onChange={(e) => setFormData({ ...formData, liters: parseFloat(e.target.value) })}
          />
        </div>

        {/* Supervisor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supervisor
          </label>
          <select
            className="select"
            value={formData.supervisor}
            onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
          >
            <option value="">Seleccionar Supervisor</option>
            {supervisors.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Registro</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FuelForm;