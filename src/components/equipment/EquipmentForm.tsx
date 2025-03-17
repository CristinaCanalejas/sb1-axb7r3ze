import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Upload } from 'lucide-react';
import type { Equipment } from '../../types';

interface Props {
  equipment?: Equipment | null;
  onSave: (equipment: Equipment) => void;
  onCancel: () => void;
}

const EquipmentForm: React.FC<Props> = ({ equipment, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Equipment>({
    department: '',
    internalNumber: '',
    name: '',
    type: '',
    status: 'operational',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (equipment) {
      setFormData(equipment);
    }
  }, [equipment]);

  const departments = ['EXTRACCIÓN', 'TRANSPORTE', 'ADMINISTRACIÓN'];

  const equipmentTypes = [
    'Camión',
    'Excavadora',
    'Cargador Frontal',
    'Retroexcavadora',
    'Motoniveladora',
    'Compactador',
    'Grúa',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department || !formData.internalNumber || !formData.name || !formData.type) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Pasar los datos del formulario directamente
      onSave(formData);
      
      setFormData({
        department: '',
        internalNumber: '',
        name: '',
        type: '',
        status: 'operational',
      });
      setError('');
    } catch (err) {
      console.error('Error saving equipment:', err);
      setError('Error al guardar el equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <option key={dept} value={dept}>
                {dept}
              </option>
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
            placeholder="Ej: EQ-001"
          />
        </div>

        {/* Equipment Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Equipo
          </label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Camión Volvo FH"
          />
        </div>

        {/* Equipment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Equipo
          </label>
          <select
            className="select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Seleccionar Tipo</option>
            {equipmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Operational Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado Operativo
          </label>
          <select
            className="select"
            value={formData.status}
            onChange={(e) => setFormData({ 
              ...formData, 
              status: e.target.value as 'operational' | 'non-operational'
            })}
          >
            <option value="operational">Operativo</option>
            <option value="non-operational">No Operativo</option>
          </select>
        </div>

        {/* Technical Sheet (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ficha Técnica <span className="text-gray-500 text-sm">(Opcional)</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="btn btn-secondary flex items-center gap-2"
              onClick={() => {/* Handle file upload */}}
            >
              <Upload className="w-4 h-4" />
              Subir Archivo
            </button>
            <span className="text-sm text-gray-500">PDF, máx. 5MB</span>
          </div>
        </div>

        {/* Photo Gallery (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Galería de Fotos <span className="text-gray-500 text-sm">(Opcional)</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="btn btn-secondary flex items-center gap-2"
              onClick={() => {/* Handle photos upload */}}
            >
              <Upload className="w-4 h-4" />
              Subir Fotos
            </button>
            <span className="text-sm text-gray-500">JPG/PNG, máx. 2MB c/u</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          className="btn btn-secondary w-full sm:w-auto"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? (
            <span>Guardando...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Equipo
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;