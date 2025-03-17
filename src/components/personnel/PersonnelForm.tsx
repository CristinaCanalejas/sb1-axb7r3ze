import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Plus, X } from 'lucide-react';
import type { Employee } from '../../types';

interface Props {
  employee?: Employee | null;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

const PersonnelForm: React.FC<Props> = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    id: '',
    fullName: '',
    role: [],
    department: '',
    contact: {
      email: '',
      phone: '',
    },
    shifts: [],
  });

  const [error, setError] = useState<string>('');
  const [newRole, setNewRole] = useState('');
  const [newShift, setNewShift] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const [roles, setRoles] = useState([
    'Operador',
    'Mecánico',
    'Supervisor',
    'Administrador',
    'Conductor',
    'Ayudante',
  ]);

  const [shifts, setShifts] = useState([
    'Mañana (6:00 - 14:00)',
    'Tarde (14:00 - 22:00)',
    'Noche (22:00 - 6:00)',
  ]);

  const departments = ['EXTRACCIÓN', 'TRANSPORTE', 'ADMINISTRACIÓN'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.role?.length || !formData.department || !formData.contact?.email || !formData.contact?.phone || !formData.shifts?.length) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    onSave(formData as Employee);
    setFormData({
      id: '',
      fullName: '',
      role: [],
      department: '',
      contact: {
        email: '',
        phone: '',
      },
      shifts: [],
    });
    setError('');
  };

  const handleRoleChange = (role: string) => {
    const currentRoles = formData.role || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setFormData({ ...formData, role: newRoles });
  };

  const handleShiftChange = (shift: string) => {
    const currentShifts = formData.shifts || [];
    const newShifts = currentShifts.includes(shift)
      ? currentShifts.filter(s => s !== shift)
      : [...currentShifts, shift];
    setFormData({ ...formData, shifts: newShifts });
  };

  const handleAddRole = () => {
    if (!newRole.trim()) {
      setError('Por favor ingrese un rol');
      return;
    }

    if (roles.includes(newRole.trim())) {
      setError('Este rol ya existe');
      return;
    }

    setRoles([...roles, newRole.trim()]);
    setNewRole('');
    setError('');
  };

  const handleAddShift = () => {
    if (!newShift.trim()) {
      setError('Por favor ingrese un turno');
      return;
    }

    if (shifts.includes(newShift.trim())) {
      setError('Este turno ya existe');
      return;
    }

    setShifts([...shifts, newShift.trim()]);
    setNewShift('');
    setError('');
  };

  const handleDeleteRole = (roleToDelete: string) => {
    setRoles(roles.filter(role => role !== roleToDelete));
    
    if (formData.role?.includes(roleToDelete)) {
      setFormData({
        ...formData,
        role: formData.role.filter(role => role !== roleToDelete)
      });
    }
  };

  const handleDeleteShift = (shiftToDelete: string) => {
    setShifts(shifts.filter(shift => shift !== shiftToDelete));
    
    if (formData.shifts?.includes(shiftToDelete)) {
      setFormData({
        ...formData,
        shifts: formData.shifts.filter(shift => shift !== shiftToDelete)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            className="input"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Ingrese nombre completo"
          />
        </div>

        {/* Department */}
        <div className="md:col-span-2">
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

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            className="input"
            value={formData.contact?.email}
            onChange={(e) => setFormData({
              ...formData,
              contact: { ...formData.contact, email: e.target.value }
            })}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            className="input"
            value={formData.contact?.phone}
            onChange={(e) => setFormData({
              ...formData,
              contact: { ...formData.contact, phone: e.target.value }
            })}
            placeholder="+56 9 1234 5678"
          />
        </div>

        {/* Roles */}
        <div className="md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Roles
            </label>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                className="input flex-1 sm:w-64"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Agregar nuevo rol..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRole();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
                onClick={handleAddRole}
              >
                <Plus className="w-4 h-4" />
                Agregar Rol
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {roles.map((role) => (
              <div key={role} className="relative group">
                <label className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.role?.includes(role) || false}
                    onChange={() => handleRoleChange(role)}
                  />
                  <span className="text-sm text-gray-700">{role}</span>
                </label>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                  onClick={() => handleDeleteRole(role)}
                  title="Eliminar rol"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Shifts */}
        <div className="md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Turnos
            </label>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                className="input flex-1 sm:w-64"
                value={newShift}
                onChange={(e) => setNewShift(e.target.value)}
                placeholder="Agregar nuevo turno... (ej: Especial (15:00 - 23:00))"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddShift();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
                onClick={handleAddShift}
              >
                <Plus className="w-4 h-4" />
                Agregar Turno
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {shifts.map((shift) => (
              <div key={shift} className="relative group">
                <label className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.shifts?.includes(shift) || false}
                    onChange={() => handleShiftChange(shift)}
                  />
                  <span className="text-sm text-gray-700">{shift}</span>
                </label>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                  onClick={() => handleDeleteShift(shift)}
                  title="Eliminar turno"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
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
          className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          {employee ? 'Actualizar Personal' : 'Guardar Personal'}
        </button>
      </div>
    </form>
  );
};

export default PersonnelForm;