import { useState, useEffect } from 'react';
import { AlertCircle, Save } from 'lucide-react';
import type { EquipmentStatusFormData } from '../../types';
import { useEquipmentStore } from '../../stores/equipment';

const EquipmentStatusForm = () => {
  const { updateEquipmentStatus } = useEquipmentStore();
  const [formData, setFormData] = useState<EquipmentStatusFormData>({
    equipmentId: '',
    status: 'operational',
    exitDate: '',
    exitTime: '',
    supervisor: '',
    mechanic: '',
    commonProblems: [],
    otherProblem: '',
    spareParts: [],
    otherSparePart: '',
  });

  const [equipment, setEquipment] = useState<{ id: string; name: string }[]>([]);
  const [supervisors, setSupervisors] = useState<{ id: string; name: string }[]>([]);
  const [mechanics, setMechanics] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Common problems and spare parts lists
  const commonProblems = [
    'Motor',
    'Transmisión',
    'Frenos',
    'Sistema eléctrico',
    'Sistema hidráulico',
    'Neumáticos',
    'Suspensión',
    'Dirección',
  ];

  const spareParts = [
    'Filtros',
    'Aceite',
    'Baterías',
    'Neumáticos',
    'Pastillas de freno',
    'Correas',
    'Bombas',
    'Sensores',
  ];

  useEffect(() => {
    // Fetch equipment, supervisors, and mechanics from API
    const fetchData = async () => {
      try {
        // Fetch equipment
        const equipmentResponse = await fetch('http://localhost:3000/api/equipment');
        if (equipmentResponse.ok) {
          const equipmentData = await equipmentResponse.json();
          setEquipment(equipmentData.map((eq: any) => ({ 
            id: eq.internalNumber, 
            name: `${eq.internalNumber} - ${eq.name}` 
          })));
        }

        // Fetch supervisors
        const supervisorsResponse = await fetch('http://localhost:3000/api/personnel?role=supervisor');
        if (supervisorsResponse.ok) {
          const supervisorsData = await supervisorsResponse.json();
          setSupervisors(supervisorsData.map((sup: any) => ({ 
            id: sup.id, 
            name: sup.fullName 
          })));
        }

        // Fetch mechanics
        const mechanicsResponse = await fetch('http://localhost:3000/api/personnel?role=mechanic');
        if (mechanicsResponse.ok) {
          const mechanicsData = await mechanicsResponse.json();
          setMechanics(mechanicsData.map((mech: any) => ({ 
            id: mech.id, 
            name: mech.fullName 
          })));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'commonProblems' | 'spareParts',
    value: string
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value],
      });
    } else {
      setFormData({
        ...formData,
        [field]: formData[field].filter((item) => item !== value),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.equipmentId || !formData.status) {
      setError('Por favor complete los campos requeridos');
      return;
    }
    
    // Additional validation for non-operational status
    if (formData.status === 'non-operational') {
      if (!formData.exitDate || !formData.exitTime || !formData.supervisor || !formData.mechanic) {
        setError('Para equipos no operativos, complete todos los campos requeridos');
        return;
      }
      
      // Validate that at least one problem is selected
      if (formData.commonProblems.length === 0 && !formData.otherProblem) {
        setError('Seleccione al menos un problema o especifique otro');
        return;
      }
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Prepare problems and spare parts arrays
      const problems = [
        ...formData.commonProblems,
        ...(formData.otherProblem ? [formData.otherProblem] : []),
      ];
      
      const parts = [
        ...formData.spareParts,
        ...(formData.otherSparePart ? [formData.otherSparePart] : []),
      ];
      
      // Create the status record
      const statusData = {
        equipmentId: formData.equipmentId,
        status: formData.status,
        exitDate: formData.exitDate,
        exitTime: formData.exitTime,
        supervisor: formData.supervisor,
        mechanic: formData.mechanic,
        problems: JSON.stringify(problems),
        spareParts: JSON.stringify(parts),
      };
      
      // Call the updateEquipmentStatus function from the store
      await updateEquipmentStatus(statusData);
      
      // Reset form and show success message
      setFormData({
        equipmentId: '',
        status: 'operational',
        exitDate: '',
        exitTime: '',
        supervisor: '',
        mechanic: '',
        commonProblems: [],
        otherProblem: '',
        spareParts: [],
        otherSparePart: '',
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Error al guardar el estado del equipo. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipo <span className="text-red-500">*</span>
          </label>
          <select
            className="select"
            value={formData.equipmentId}
            onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
            required
          >
            <option value="">Seleccionar Equipo</option>
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name}
              </option>
            ))}
          </select>
        </div>

        {/* Operational Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            className="select"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'operational' | 'non-operational',
              })
            }
            required
          >
            <option value="operational">Operativo</option>
            <option value="non-operational">No Operativo</option>
          </select>
        </div>

        {/* Conditional fields for non-operational status */}
        {formData.status === 'non-operational' && (
          <>
            {/* Exit Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Salida <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="input"
                value={formData.exitDate}
                onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                required
              />
            </div>

            {/* Exit Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Salida <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="input"
                value={formData.exitTime}
                onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
                required
              />
            </div>

            {/* Supervisor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supervisor <span className="text-red-500">*</span>
              </label>
              <select
                className="select"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                required
              >
                <option value="">Seleccionar Supervisor</option>
                {supervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mechanic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mecánico <span className="text-red-500">*</span>
              </label>
              <select
                className="select"
                value={formData.mechanic}
                onChange={(e) => setFormData({ ...formData, mechanic: e.target.value })}
                required
              >
                <option value="">Seleccionar Mecánico</option>
                {mechanics.map((mech) => (
                  <option key={mech.id} value={mech.id}>
                    {mech.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Common Problems */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problemas Comunes <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonProblems.map((problem) => (
                  <div key={problem} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`problem-${problem}`}
                      className="mr-2"
                      checked={formData.commonProblems.includes(problem)}
                      onChange={(e) => handleCheckboxChange(e, 'commonProblems', problem)}
                    />
                    <label htmlFor={`problem-${problem}`} className="text-sm">
                      {problem}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Problem */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otro Problema
              </label>
              <input
                type="text"
                className="input"
                value={formData.otherProblem}
                onChange={(e) => setFormData({ ...formData, otherProblem: e.target.value })}
                placeholder="Especificar otro problema"
              />
            </div>

            {/* Spare Parts */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repuestos Necesarios
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {spareParts.map((part) => (
                  <div key={part} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`part-${part}`}
                      className="mr-2"
                      checked={formData.spareParts.includes(part)}
                      onChange={(e) => handleCheckboxChange(e, 'spareParts', part)}
                    />
                    <label htmlFor={`part-${part}`} className="text-sm">
                      {part}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Spare Part */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otro Repuesto
              </label>
              <input
                type="text"
                className="input"
                value={formData.otherSparePart}
                onChange={(e) => setFormData({ ...formData, otherSparePart: e.target.value })}
                placeholder="Especificar otro repuesto"
              />
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

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>Estado del equipo actualizado correctamente</span>
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
            <span>Guardando...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Estado
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EquipmentStatusForm;