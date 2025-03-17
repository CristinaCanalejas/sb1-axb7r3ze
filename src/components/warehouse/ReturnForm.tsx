import React, { useState } from 'react';
import { Save, AlertCircle, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { WarehouseItem } from '../../types';
import WarehouseService from '../../services/warehouseService';
import MasterDataService from '../../services/masterDataService';

interface Props {
  onSave: () => void;
  onCancel: () => void;
}

interface ReturnItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  condition: 'good' | 'damaged' | 'expired';
  reason: string;
  supplier?: string;
}

const ReturnForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [returnedBy, setReturnedBy] = useState('');
  const [department, setDepartment] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const warehouseService = WarehouseService.getInstance();
  const masterDataService = MasterDataService.getInstance();

  const departments = masterDataService.getDepartments();
  const warehouseItems = warehouseService.getItems();
  const personnel = masterDataService.getPersonnel();
  const suppliers = masterDataService.getSuppliers();

  const conditions = [
    { value: 'good', label: 'Buen Estado' },
    { value: 'damaged', label: 'Dañado' },
    { value: 'expired', label: 'Vencido' },
  ];

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        itemId: '',
        itemName: '',
        quantity: 0,
        unit: '',
        condition: 'good',
        reason: '',
        supplier: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!returnedBy || !department || items.length === 0) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    // Validate items
    for (const item of items) {
      if (
        !item.itemId ||
        item.quantity <= 0 ||
        !item.condition ||
        !item.reason
      ) {
        setError('Por favor complete todos los campos de los ítems');
        return;
      }
    }

    try {
      // Process each return item
      items.forEach(item => {
        // Only increase stock for items in good condition
        if (item.condition === 'good') {
          warehouseService.updateStock(item.itemId, item.quantity, true);
        }
      });

      onSave();
    } catch (err) {
      setError('Error al procesar la devolución');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-800">
              Devolución de Productos
            </h2>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={onCancel}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  className="input"
                  value={format(date, 'yyyy-MM-dd')}
                  onChange={(e) => setDate(new Date(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devuelto por
                </label>
                <select
                  className="select"
                  value={returnedBy}
                  onChange={(e) => setReturnedBy(e.target.value)}
                >
                  <option value="">Seleccionar Persona</option>
                  {personnel.map((person) => (
                    <option key={person.id} value={person.name}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  className="select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Seleccionar Departamento</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <input
                  type="text"
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones adicionales"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Ítems a Devolver</h2>
                <button
                  type="button"
                  className="btn btn-secondary flex items-center gap-2"
                  onClick={handleAddItem}
                >
                  <Plus className="w-4 h-4" />
                  Agregar Ítem
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-sm font-medium text-gray-700">Ítem #{index + 1}</h3>
                      <button
                        type="button"
                        className="p-1 hover:bg-red-100 rounded-lg"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ítem
                        </label>
                        <select
                          className="select"
                          value={item.itemId}
                          onChange={(e) => {
                            const selectedItem = warehouseItems.find(i => i.id === e.target.value);
                            const newItems = [...items];
                            newItems[index] = {
                              ...item,
                              itemId: e.target.value,
                              itemName: selectedItem?.name || '',
                              unit: selectedItem?.unit || '',
                            };
                            setItems(newItems);
                          }}
                        >
                          <option value="">Seleccionar Ítem</option>
                          {warehouseItems.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.code} - {i.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cantidad
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="input w-32"
                            min="1"
                            placeholder="Cantidad"
                            value={item.quantity || ''}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index] = {
                                ...item,
                                quantity: parseInt(e.target.value),
                              };
                              setItems(newItems);
                            }}
                          />
                          <span className="py-2 px-3 bg-gray-100 rounded text-sm">
                            {item.unit}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado
                        </label>
                        <select
                          className="select"
                          value={item.condition}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = {
                              ...item,
                              condition: e.target.value as 'good' | 'damaged' | 'expired',
                            };
                            setItems(newItems);
                          }}
                        >
                          {conditions.map((condition) => (
                            <option key={condition.value} value={condition.value}>
                              {condition.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proveedor <span className="text-gray-500">(Opcional)</span>
                        </label>
                        <select
                          className="select"
                          value={item.supplier || ''}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = {
                              ...item,
                              supplier: e.target.value,
                            };
                            setItems(newItems);
                          }}
                        >
                          <option value="">Seleccionar Proveedor</option>
                          {suppliers.map((supplier) => (
                            <option key={supplier} value={supplier}>
                              {supplier}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Motivo
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Motivo de la devolución"
                          value={item.reason}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = {
                              ...item,
                              reason: e.target.value,
                            };
                            setItems(newItems);
                          }}
                        />
                      </div>
                    </div>
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
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50">
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
              onClick={handleSubmit}
            >
              <Save className="w-4 h-4" />
              Procesar Devolución
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnForm;