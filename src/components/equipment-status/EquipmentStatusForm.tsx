import React, { useState } from 'react';
import { Save, AlertCircle, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import type { EquipmentStatus } from '../../types';

const EquipmentStatusForm = () => {
  const [formData, setFormData] = useState<Partial<EquipmentStatus>>({
    equipmentId: '',
    internalNumber: '',
    status: 'operational',
    exitDate: new Date(),
    exitTime: '08:00',
    supervisor: '',
    mechanic: '',
    problems: [],
    spareParts: [],
  });

  const [otherProblem, setOtherProblem] = useState('');
  const [otherSparePart, setOtherSparePart] = useState('');
  const [error, setError] = useState<string>('');
  const [newProblem, setNewProblem] = useState('');
  const [newSparePart, setNewSparePart] = useState('');

  // Mock data for demonstration
  const equipment = [
    { id: 'EQ001', name: 'Camión Volvo FH' },
    { id: 'EQ002', name: 'Excavadora CAT 320' },
    { id: 'EQ003', name: 'Cargador Frontal 966H' },
  ];

  const personnel = [
    { id: '1', name: 'Roberto Sánchez' },
    { id: '2', name: 'Ana Martínez' },
    { id: '3', name: 'Luis García' },
    { id: '4', name: 'Carlos Rodríguez' },
  ];

  const [commonProblems, setCommonProblems] = useState([
    'Falla en el motor',
    'Problemas de transmisión',
    'Sistema hidráulico',
    'Sistema eléctrico',
    'Frenos',
    'Dirección',
    'Neumáticos',
    'Sistema de refrigeración',
    'Fugas de aceite',
    'Fugas de combustible',
    'Sistema de suspensión',
    'Problemas de arranque',
    'Desgaste de neumáticos',
    'Problema de dirección',
    'Ruido anormal',
    'Sobrecalentamiento',
  ]);

  const [spareParts, setSpareParts] = useState([
    'Filtro de aceite',
    'Filtro de aire',
    'Filtro de combustible',
    'Pastillas de freno',
    'Correa de distribución',
    'Batería',
    'Bujías',
    'Amortiguadores',
    'Rodamientos',
    'Neumáticos',
    'Bomba de agua',
    'Bomba de combustible',
    'Radiador',
    'Alternador',
    'Motor de arranque',
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipmentId || !formData.internalNumber || !formData.status) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    if (formData.status === 'non-operational' && 
        (!formData.exitDate || !formData.exitTime || !formData.supervisor || !formData.mechanic || !formData.problems?.length)) {
      setError('Por favor complete todos los campos para equipos no operativos');
      return;
    }

    console.log('Equipment status:', formData);
    setError('');
  };

  const handleProblemChange = (problem: string) => {
    const currentProblems = formData.problems || [];
    const newProblems = currentProblems.includes(problem)
      ? currentProblems.filter(p => p !== problem)
      : [...currentProblems, problem];
    
    setFormData({ ...formData, problems: newProblems });
  };

  const handleSparePartChange = (part: string) => {
    const currentParts = formData.spareParts || [];
    const newParts = currentParts.includes(part)
      ? currentParts.filter(p => p !== part)
      : [...currentParts, part];
    
    setFormData({ ...formData, spareParts: newParts });
  };

  const handleAddProblem = () => {
    if (!newProblem.trim()) {
      setError('Por favor ingrese un problema');
      return;
    }

    if (commonProblems.includes(newProblem.trim())) {
      setError('Este problema ya existe');
      return;
    }

    setCommonProblems([...commonProblems, newProblem.trim()]);
    setNewProblem('');
    setError('');
  };

  const handleDeleteProblem = (problemToDelete: string) => {
    setCommonProblems(commonProblems.filter(problem => problem !== problemToDelete));
    
    if (formData.problems?.includes(problemToDelete)) {
      setFormData({
        ...formData,
        problems: formData.problems.filter(problem => problem !== problemToDelete)
      });
    }
  };

  const handleAddSparePart = () => {
    if (!newSparePart.trim()) {
      setError('Por favor ingrese un repuesto');
      return;
    }

    if (spareParts.includes(newSparePart.trim())) {
      setError('Este repuesto ya existe');
      return;
    }

    setSpareParts([...spareParts, newSparePart.trim()]);
    setNewSparePart('');
    setError('');
  };

  const handleDeleteSparePart = (partToDelete: string) => {
    setSpareParts(spareParts.filter(part => part !== partToDelete));
    
    if (formData.spareParts?.includes(partToDelete)) {
      setFormData({
        ...formData,
        spareParts: formData.spareParts.filter(part => part !== partToDelete)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {formData.status === 'non-operational' && (
          <>
            {/* Exit Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Salida
                </label>
                <input
                  type="date"
                  className="input"
                  value={format(formData.exitDate || new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setFormData({ ...formData, exitDate: new Date(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de Salida
                </label>
                <input
                  type="time"
                  className="input"
                  value={formData.exitTime}
                  onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
                />
              </div>
            </div>

            {/* Personnel Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supervisor de Turno
                </label>
                <select
                  className="select"
                  value={formData.supervisor}
                  onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                >
                  <option value="">Seleccionar Supervisor</option>
                  {personnel.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mecánico de Turno
                </label>
                <select
                  className="select"
                  value={formData.mechanic}
                  onChange={(e) => setFormData({ ...formData, mechanic: e.target.value })}
                >
                  <option value="">Seleccionar Mecánico</option>
                  {personnel.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Problems Detected */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problemas Detectados
              </label>

              {/* Add New Problem */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="text"
                  className="input flex-1"
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  placeholder="Agregar nuevo problema..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddProblem();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={handleAddProblem}
                >
                  <Plus className="w-4 h-4" />
                  Agregar Problema
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {commonProblems.map((problem) => (
                  <div key={problem} className="relative group">
                    <label className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={formData.problems?.includes(problem) || false}
                        onChange={() => handleProblemChange(problem)}
                      />
                      <span className="text-sm text-gray-700">{problem}</span>
                    </label>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                      onClick={() => handleDeleteProblem(problem)}
                      title="Eliminar problema"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Spare Parts */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repuestos Requeridos
                </label>

                {/* Add New Spare Part */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    className="input flex-1"
                    value={newSparePart}
                    onChange={(e) => setNewSparePart(e.target.value)}
                    placeholder="Agregar nuevo repuesto..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSparePart();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
                    onClick={handleAddSparePart}
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Repuesto
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {spareParts.map((part) => (
                    <div key={part} className="relative group">
                      <label className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.spareParts?.includes(part) || false}
                          onChange={() => handleSparePartChange(part)}
                        />
                        <span className="text-sm text-gray-700">{part}</span>
                      </label>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                        onClick={() => handleDeleteSparePart(part)}
                        title="Eliminar repuesto"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          Guardar Estado
        </button>
      </div>
    </form>
  );
};

export default EquipmentStatusForm;