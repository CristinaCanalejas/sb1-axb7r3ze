import React, { useState } from 'react';
import { Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import type { WarehouseWithdrawal, WithdrawalItem } from '../../types';
import WarehouseService from '../../services/warehouseService';
import MasterDataService from '../../services/masterDataService';

interface Props {
  withdrawal?: WarehouseWithdrawal;
  onSave: () => void;
  onCancel: () => void;
}

const WarehouseWithdrawalForm: React.FC<Props> = ({ withdrawal, onSave, onCancel }) => {
  const [editingWithdrawal, setEditingWithdrawal] = useState<WarehouseWithdrawal>(
    withdrawal || {
      id: '',
      withdrawalNumber: '',
      date: new Date(),
      withdrawnBy: '',
      department: '',
      items: [],
      status: 'pending',
    }
  );
  const [error, setError] = useState('');

  const warehouseService = WarehouseService.getInstance();
  const masterDataService = MasterDataService.getInstance();

  const departments = masterDataService.getDepartments();
  const items = warehouseService.getItems();
  const equipment = masterDataService.getEquipment();

  const handleAddItem = () => {
    setEditingWithdrawal({
      ...editingWithdrawal,
      items: [
        ...editingWithdrawal.items,
        {
          id: Date.now().toString(),
          itemId: '',
          itemName: '',
          quantity: 0,
          unit: '',
        },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setEditingWithdrawal({
      ...editingWithdrawal,
      items: editingWithdrawal.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !editingWithdrawal.withdrawnBy ||
      !editingWithdrawal.department ||
      !editingWithdrawal.items.length ||
      editingWithdrawal.items.some(item => !item.itemId || !item.quantity || item.quantity <= 0)
    ) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      warehouseService.saveWithdrawal(editingWithdrawal);
      onSave();
    } catch (err) {
      setError('Error al guardar el retiro');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solicitante
          </label>
          <input
            type="text"
            className="input"
            value={editingWithdrawal.withdrawnBy}
            onChange={(e) => setEditingWithdrawal({
              ...editingWithdrawal,
              withdrawnBy: e.target.value,
            })}
            placeholder="Nombre de quien retira"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departamento
          </label>
          <select
            className="select"
            value={editingWithdrawal.department}
            onChange={(e) => setEditingWithdrawal({
              ...editingWithdrawal,
              department: e.target.value,
            })}
          >
            <option value="">Seleccionar Departamento</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipo Asignado
          </label>
          <select
            className="select"
            value={editingWithdrawal.equipmentId || ''}
            onChange={(e) => {
              const selectedEquipment = equipment.find(eq => eq.id === e.target.value);
              setEditingWithdrawal({
                ...editingWithdrawal,
                equipmentId: e.target.value,
                equipmentName: selectedEquipment?.name || '',
                equipmentInternalNumber: selectedEquipment?.internalNumber || '',
              });
            }}
          >
            <option value="">Seleccionar Equipo (Opcional)</option>
            {equipment.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            N° Interno del Equipo
          </label>
          <input
            type="text"
            className="input bg-gray-50"
            value={editingWithdrawal.equipmentInternalNumber || ''}
            readOnly
            placeholder="Se asigna automáticamente al seleccionar el equipo"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas
          </label>
          <input
            type="text"
            className="input"
            value={editingWithdrawal.notes || ''}
            onChange={(e) => setEditingWithdrawal({
              ...editingWithdrawal,
              notes: e.target.value,
            })}
            placeholder="Observaciones o detalles adicionales"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Ítems a Retirar</h2>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddItem}
          >
            <Plus className="w-4 h-4" /> Agregar Ítem
          </button>
        </div>

        <div className="space-y-4">
          {editingWithdrawal.items.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="flex-1">
                <select
                  className="select mb-2"
                  value={item.itemId}
                  onChange={(e) => {
                    const selectedItem = items.find(i => i.id === e.target.value);
                    const newItems = [...editingWithdrawal.items];
                    newItems[index] = {
                      ...item,
                      itemId: e.target.value,
                      itemName: selectedItem?.name || '',
                      unit: selectedItem?.unit || '',
                    };
                    setEditingWithdrawal({
                      ...editingWithdrawal,
                      items: newItems,
                    });
                  }}
                >
                  <option value="">Seleccionar Ítem</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.code} - {i.name} (Stock: {i.stock} {i.unit})
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input w-32"
                    min="1"
                    placeholder="Cantidad"
                    value={item.quantity || ''}
                    onChange={(e) => {
                      const newItems = [...editingWithdrawal.items];
                      newItems[index] = {
                        ...item,
                        quantity: parseInt(e.target.value),
                      };
                      setEditingWithdrawal({
                        ...editingWithdrawal,
                        items: newItems,
                      });
                    }}
                  />
                  <span className="py-2 px-3 bg-gray-100 rounded text-sm">
                    {item.unit}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="p-2 hover:bg-red-100 rounded-lg"
                onClick={() => handleRemoveItem(index)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar Retiro
        </button>
      </div>
    </form>
  );
};

export default WarehouseWithdrawalForm;