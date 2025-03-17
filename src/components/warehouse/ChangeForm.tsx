import React, { useState } from 'react';
import { Save, AlertCircle, Plus, Trash2, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import type { WarehouseItem } from '../../types';
import WarehouseService from '../../services/warehouseService';
import MasterDataService from '../../services/masterDataService';

interface Props {
  onSave: () => void;
  onCancel: () => void;
}

interface ChangeItem {
  id: string;
  oldItemId: string;
  oldItemName: string;
  oldQuantity: number;
  oldUnit: string;
  newItemId: string;
  newItemName: string;
  newQuantity: number;
  newUnit: string;
  reason: string;
  supplier?: string;
}

const ChangeForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [items, setItems] = useState<ChangeItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [requestedBy, setRequestedBy] = useState('');
  const [department, setDepartment] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const warehouseService = WarehouseService.getInstance();
  const masterDataService = MasterDataService.getInstance();

  const departments = masterDataService.getDepartments();
  const warehouseItems = warehouseService.getItems();
  const personnel = masterDataService.getPersonnel();
  const suppliers = masterDataService.getSuppliers();

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        oldItemId: '',
        oldItemName: '',
        oldQuantity: 0,
        oldUnit: '',
        newItemId: '',
        newItemName: '',
        newQuantity: 0,
        newUnit: '',
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

    if (!requestedBy || !department || items.length === 0) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    // Validate items
    for (const item of items) {
      if (
        !item.oldItemId ||
        !item.newItemId ||
        item.oldQuantity <= 0 ||
        item.newQuantity <= 0 ||
        !item.reason
      ) {
        setError('Por favor complete todos los campos de los ítems');
        return;
      }

      // Check if old item has enough stock
      const oldItem = warehouseItems.find(i => i.id === item.oldItemId);
      if (!oldItem || oldItem.stock < item.oldQuantity) {
        setError(`Stock insuficiente para ${oldItem?.name || 'el ítem seleccionado'}`);
        return;
      }
    }

    try {
      // Process each item change
      items.forEach(item => {
        // Decrease old item stock
        warehouseService.updateStock(item.oldItemId, item.oldQuantity, false);
        // Increase new item stock
        warehouseService.updateStock(item.newItemId, item.newQuantity, true);
      });

      onSave();
    } catch (err) {
      setError('Error al procesar el cambio');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-800">
              Cambio de Productos
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
                  Solicitado por
                </label>
                <select
                  className="select"
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                >
                  <option value="">Seleccionar Solicitante</option>
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
                <h2 className="text-lg font-medium text-gray-900">Ítems a Cambiar</h2>
                <button
                  type="button"
                  className="btn btn-secondary flex items-center gap-2"
                  onClick={handleAddItem}
                >
                  <Plus className="w-4 h-4" />
                  Agregar Cambio
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-sm font-medium text-gray-700">Cambio #{index + 1}</h3>
                      <button
                        type="button"
                        className="p-1 hover:bg-red-100 rounded-lg"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original Item */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-700">Ítem Original</h4>
                        <select
                          className="select"
                          value={item.oldItemId}
                          onChange={(e) => {
                            const selectedItem = warehouseItems.find(i => i.id === e.target.value);
                            const newItems = [...items];
                            newItems[index] = {
                              ...item,
                              oldItemId: e.target.value,
                              oldItemName: selectedItem?.name || '',
                              oldUnit: selectedItem?.unit || '',
                            };
                            setItems(newItems);
                          }}
                        >
                          <option value="">Seleccionar Ítem</option>
                          {warehouseItems.map((i) => (
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
                            value={item.oldQuantity || ''}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index] = {
                                ...item,
                                oldQuantity: parseInt(e.target.value),
                              };
                              setItems(newItems);
                            }}
                          />
                          <span className="py-2 px-3 bg-gray-100 rounded text-sm">
                            {item.oldUnit}
                          </span>
                        </div>
                      </div>

                      {/* New Item */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-700">Ítem Nuevo</h4>
                        <select
                          className="select"
                          value={item.newItemId}
                          onChange={(e) => {
                            const selectedItem = warehouseItems.find(i => i.id === e.target.value);
                            const newItems = [...items];
                            newItems[index] = {
                              ...item,
                              newItemId: e.target.value,
                              newItemName: selectedItem?.name || '',
                              newUnit: selectedItem?.unit || '',
                            };
                            setItems(newItems);
                          }}
                        >
                          <option value="">Seleccionar Ítem</option>
                          {warehouseItems.map((i) => (
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
                            value={item.newQuantity || ''}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index] = {
                                ...item,
                                newQuantity: parseInt(e.target.value),
                              };
                              setItems(newItems);
                            }}
                          />
                          <span className="py-2 px-3 bg-gray-100 rounded text-sm">
                            {item.newUnit}
                          </span>
                        </div>
                      </div>

                      {/* Supplier (Optional) */}
                      <div className="md:col-span-2">
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

                      {/* Reason */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Motivo del Cambio
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Motivo del cambio"
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
              Procesar Cambio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeForm;