import React, { useState } from 'react';
import EquipmentForm from '../components/equipment/EquipmentForm';
import EquipmentList from '../components/equipment/EquipmentList';
import type { Equipment } from '../types';

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      internalNumber: 'EQ001',
      name: 'Camión Volvo FH',
      type: 'Camión',
      status: 'operational',
      department: 'TRANSPORTE',
      technicalSheet: 'volvo-fh.pdf',
      photos: ['photo1.jpg', 'photo2.jpg'],
    },
    {
      internalNumber: 'EQ002',
      name: 'Excavadora CAT 320',
      type: 'Excavadora',
      status: 'non-operational',
      department: 'EXTRACCIÓN',
      technicalSheet: 'cat-320.pdf',
      photos: ['photo3.jpg'],
    },
  ]);

  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const handleSave = (newEquipment: Equipment) => {
    if (editingEquipment) {
      // Update existing equipment
      setEquipment(equipment.map(eq => 
        eq.internalNumber === editingEquipment.internalNumber ? newEquipment : eq
      ));
      setEditingEquipment(null);
    } else {
      // Add new equipment
      setEquipment([...equipment, newEquipment]);
    }
  };

  const handleEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
  };

  const handleDelete = (internalNumber: string) => {
    setEquipment(equipment.filter(eq => eq.internalNumber !== internalNumber));
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
      
      <EquipmentList 
        equipment={equipment}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EquipmentPage;