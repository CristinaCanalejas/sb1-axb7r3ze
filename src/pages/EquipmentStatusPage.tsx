import React from 'react';
import EquipmentStatusForm from '../components/equipment-status/EquipmentStatusForm';
import EquipmentStatusHistory from '../components/equipment-status/EquipmentStatusHistory';

const EquipmentStatusPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Control de Estado de Equipos
          </h1>
          <EquipmentStatusForm />
        </div>
      </div>
      
      <EquipmentStatusHistory />
    </div>
  );
};

export default EquipmentStatusPage;