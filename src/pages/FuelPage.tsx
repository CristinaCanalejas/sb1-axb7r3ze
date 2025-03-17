import React from 'react';
import FuelForm from '../components/fuel/FuelForm';
import FuelHistory from '../components/fuel/FuelHistory';

const FuelPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Registro de Combustible
          </h1>
          <FuelForm />
        </div>
      </div>
      
      <FuelHistory />
    </div>
  );
};

export default FuelPage;