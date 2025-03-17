import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, Save, AlertCircle, Edit, Trash2 } from 'lucide-react';

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  employees: string[];
  days: string[];
}

const ShiftsPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      name: 'Turno Mañana',
      startTime: '06:00',
      endTime: '14:00',
      employees: ['Juan Pérez', 'María González'],
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    },
    {
      id: '2',
      name: 'Turno Tarde',
      startTime: '14:00',
      endTime: '22:00',
      employees: ['Carlos Rodríguez', 'Ana Martínez'],
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    },
    {
      id: '3',
      name: 'Turno Noche',
      startTime: '22:00',
      endTime: '06:00',
      employees: ['Luis García', 'Pedro Sánchez'],
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    },
  ]);

  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [error, setError] = useState('');

  const weekDays = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  const employees = [
    'Juan Pérez',
    'María González',
    'Carlos Rodríguez',
    'Ana Martínez',
    'Luis García',
    'Pedro Sánchez',
    'Sofia Torres',
    'Diego Ramírez',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingShift) return;

    if (!editingShift.name || !editingShift.startTime || !editingShift.endTime || editingShift.employees.length === 0 || editingShift.days.length === 0) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setShifts(currentShifts => {
      const index = currentShifts.findIndex(s => s.id === editingShift.id);
      if (index >= 0) {
        return [
          ...currentShifts.slice(0, index),
          editingShift,
          ...currentShifts.slice(index + 1),
        ];
      }
      return [...currentShifts, { ...editingShift, id: Date.now().toString() }];
    });

    setEditingShift(null);
    setError('');
  };

  const handleDelete = (id: string) => {
    setShifts(currentShifts => currentShifts.filter(shift => shift.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Gestión de Turnos
            </h1>
            {!editingShift && (
              <button
                className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setEditingShift({
                  id: '',
                  name: '',
                  startTime: '',
                  endTime: '',
                  employees: [],
                  days: [],
                })}
              >
                <Plus className="w-4 h-4" />
                Nuevo Turno
              </button>
            )}
          </div>

          {editingShift && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Turno
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingShift.name}
                    onChange={(e) => setEditingShift({
                      ...editingShift,
                      name: e.target.value,
                    })}
                    placeholder="Ej: Turno Mañana"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      className="input"
                      value={editingShift.startTime}
                      onChange={(e) => setEditingShift({
                        ...editingShift,
                        startTime: e.target.value,
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora Fin
                    </label>
                    <input
                      type="time"
                      className="input"
                      value={editingShift.endTime}
                      onChange={(e) => setEditingShift({
                        ...editingShift,
                        endTime: e.target.value,
                      })}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de Trabajo
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {weekDays.map((day) => (
                      <label
                        key={day}
                        className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={editingShift.days.includes(day)}
                          onChange={(e) => {
                            const newDays = e.target.checked
                              ? [...editingShift.days, day]
                              : editingShift.days.filter(d => d !== day);
                            setEditingShift({ ...editingShift, days: newDays });
                          }}
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empleados Asignados
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {employees.map((employee) => (
                      <label
                        key={employee}
                        className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={editingShift.employees.includes(employee)}
                          onChange={(e) => {
                            const newEmployees = e.target.checked
                              ? [...editingShift.employees, employee]
                              : editingShift.employees.filter(emp => emp !== employee);
                            setEditingShift({ ...editingShift, employees: newEmployees });
                          }}
                        />
                        <span className="text-sm text-gray-700">{employee}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-secondary w-full sm:w-auto"
                  onClick={() => {
                    setEditingShift(null);
                    setError('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4" />
                  Guardar Turno
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {!editingShift && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {shift.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {shift.startTime} - {shift.endTime}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => setEditingShift(shift)}
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => handleDelete(shift.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Días de Trabajo
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {shift.days.map((day) => (
                      <span
                        key={day}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Empleados Asignados
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {shift.employees.map((employee) => (
                      <span
                        key={employee}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                      >
                        {employee}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShiftsPage;