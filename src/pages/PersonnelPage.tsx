import React, { useState } from 'react';
import PersonnelForm from '../components/personnel/PersonnelForm';
import PersonnelList from '../components/personnel/PersonnelList';
import type { Employee } from '../types';

const PersonnelPage = () => {
  const [personnel, setPersonnel] = useState<Employee[]>([
    {
      id: '1',
      fullName: 'Juan Pérez',
      role: ['Operador', 'Conductor'],
      department: 'EXTRACCIÓN',
      contact: {
        email: 'juan.perez@ejemplo.com',
        phone: '+56 9 1234 5678',
      },
      shifts: ['Mañana (6:00 - 14:00)'],
    },
    {
      id: '2',
      fullName: 'María González',
      role: ['Supervisor', 'Administrador'],
      department: 'ADMINISTRACIÓN',
      contact: {
        email: 'maria.gonzalez@ejemplo.com',
        phone: '+56 9 8765 4321',
      },
      shifts: ['Tarde (14:00 - 22:00)', 'Noche (22:00 - 6:00)'],
    },
  ]);

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleSave = (employee: Employee) => {
    if (editingEmployee) {
      // Update existing employee
      setPersonnel(personnel.map(p => 
        p.id === editingEmployee.id ? employee : p
      ));
      setEditingEmployee(null);
    } else {
      // Add new employee
      setPersonnel([...personnel, { ...employee, id: Date.now().toString() }]);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleDelete = (id: string) => {
    setPersonnel(personnel.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingEmployee ? 'Editar Personal' : 'Registro de Personal'}
          </h1>
          <PersonnelForm 
            employee={editingEmployee}
            onSave={handleSave}
            onCancel={() => setEditingEmployee(null)}
          />
        </div>
      </div>
      
      <PersonnelList 
        personnel={personnel}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PersonnelPage;