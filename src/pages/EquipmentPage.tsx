import { useState, useEffect } from 'react';
import EquipmentForm from '../components/equipment/EquipmentForm';
import EquipmentList from '../components/equipment/EquipmentList';
import type { Equipment } from '../types';
import { useEquipmentStore } from '../stores/equipment';

const EquipmentPage = () => {
  const { 
    equipment, 
    loading, 
    error, 
    fetchEquipment, 
    addEquipment, 
    updateEquipment, 
    deleteEquipment 
  } = useEquipmentStore();
  
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleSave = (newEquipment: Equipment) => {
    if (editingEquipment) {
      // Update existing equipment
      updateEquipment(editingEquipment.internalNumber, newEquipment);
      setEditingEquipment(null);
    } else {
      // Add new equipment
      addEquipment(newEquipment);
    }
  };

  const handleEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
  };

  const handleDelete = (equipment: Equipment) => {
    if (equipment.id) {
      deleteEquipment(equipment.id);
    } else {
      console.error('No se puede eliminar un equipo sin ID');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingEquipment ? 'Editar Equipo' : 'Registro de Equipos'}
          </h1>
          <EquipmentForm 
            equipment={editingEquipment}
            onSave={handleSave}
            onCancel={() => setEditingEquipment(null)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <EquipmentList 
          equipment={equipment}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EquipmentPage;