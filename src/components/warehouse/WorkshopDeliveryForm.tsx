import React, { useState } from 'react';
import { Save, AlertCircle, Plus, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';
import type { WorkshopDelivery, WorkshopDeliveryItem } from '../../types';
import WarehouseService from '../../services/warehouseService';
import MasterDataService from '../../services/masterDataService';
import { generateWorkshopDeliveryPDF } from '../../utils/pdfGenerator';

interface Props {
  onSave: () => void;
  onCancel: () => void;
}

const WorkshopDeliveryForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [delivery, setDelivery] = useState<WorkshopDelivery>({
    id: '',
    deliveryNumber: '',
    date: new Date(),
    time: format(new Date(), 'HH:mm'),
    receivedBy: '',
    department: '',
    items: [],
  });

  const [error, setError] = useState('');
  const [savedDelivery, setSavedDelivery] = useState<WorkshopDelivery | null>(null);
  const [deliveredBy, setDeliveredBy] = useState('');

  const warehouseService = WarehouseService.getInstance();
  const masterDataService = MasterDataService.getInstance();

  const departments = masterDataService.getDepartments();
  const items = warehouseService.getItems();
  const equipment = masterDataService.getEquipment();
  const mechanics = masterDataService.getMechanics();
  const personnel = masterDataService.getPersonnel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !delivery.receivedBy ||
      !delivery.department ||
      !delivery.items.length ||
      !deliveredBy ||
      delivery.items.some(item => !item.itemId || !item.quantity || item.quantity <= 0)
    ) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      const deliveryWithSignatures = {
        ...delivery,
        deliveredBy,
      };
      warehouseService.saveWorkshopDelivery(deliveryWithSignatures);
      setSavedDelivery(deliveryWithSignatures);
      onSave();
    } catch (err) {
      setError('Error al guardar la entrega');
    }
  };

  const handleAddItem = () => {
    setDelivery({
      ...delivery,
      items: [
        ...delivery.items,
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
    setDelivery({
      ...delivery,
      items: delivery.items.filter((_, i) => i !== index),
    });
  };

  const handlePrint = () => {
    if (savedDelivery) {
      generateWorkshopDeliveryPDF(savedDelivery);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-800">
              Entrega de Materiales a Taller
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
                  value={format(delivery.date, 'yyyy-MM-dd')}
                  onChange={(e) => setDelivery({
                    ...delivery,
                    date: new Date(e.target.value),
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  className="input"
                  value={delivery.time}
                  onChange={(e) => setDelivery({
                    ...delivery,
                    time: e.target.value,
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entregado por
                </label>
                <select
                  className="select"
                  value={deliveredBy}
                  onChange={(e) => setDeliveredBy(e.target.value)}
                >
                  <option value="">Seleccionar Personal</option>
                  {personnel.map((person) => (
                    <option key={person.id} value={person.name}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recibido por
                </label>
                <select
                  className="select"
                  value={delivery.receivedBy}
                  onChange={(e) => setDelivery({
                    ...delivery,
                    receivedBy: e.target.value,
                  })}
                >
                  <option value="">Seleccionar Mecánico</option>
                  {mechanics.map((mechanic) => (
                    <option key={mechanic.id} value={mechanic.name}>
                      {mechanic.name}
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
                  value={delivery.department}
                  onChange={(e) => setDelivery({
                    ...delivery,
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
                  Equipo
                </label>
                <select
                  className="select"
                  value={delivery.equipmentId || ''}
                  onChange={(e) => {
                    const selectedEquipment = equipment.find(eq => eq.id === e.target.value);
                    setDelivery({
                      ...delivery,
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
                  value={delivery.equipmentInternalNumber || ''}
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
                  value={delivery.notes || ''}
                  onChange={(e) => setDelivery({
                    ...delivery,
                    notes: e.target.value,
                  })}
                  placeholder="Observaciones o detalles adicionales"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Ítems a Entregar</h2>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddItem}
                >
                  <Plus className="w-4 h-4" /> Agregar Ítem
                </button>
              </div>

              <div className="space-y-4">
                {delivery.items.map((item, index) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <select
                        className="select mb-2"
                        value={item.itemId}
                        onChange={(e) => {
                          const selectedItem = items.find(i => i.id === e.target.value);
                          const newItems = [...delivery.items];
                          newItems[index] = {
                            ...item,
                            itemId: e.target.value,
                            itemName: selectedItem?.name || '',
                            unit: selectedItem?.unit || '',
                          };
                          setDelivery({
                            ...delivery,
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
                            const newItems = [...delivery.items];
                            newItems[index] = {
                              ...item,
                              quantity: parseInt(e.target.value),
                            };
                            setDelivery({
                              ...delivery,
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

            {/* Conformity Receipt Section */}
            <div className="border-t pt-6 mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recibí Conforme</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="h-24 border-b border-gray-300 mb-2"></div>
                  <p className="text-sm text-gray-600">Entregado por: {deliveredBy || '________________'}</p>
                  <p className="text-xs text-gray-500">Nombre y Firma</p>
                </div>
                <div className="text-center">
                  <div className="h-24 border-b border-gray-300 mb-2"></div>
                  <p className="text-sm text-gray-600">Recibido por: {delivery.receivedBy || '________________'}</p>
                  <p className="text-xs text-gray-500">Nombre y Firma</p>
                </div>
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
            {savedDelivery && (
              <button
                type="button"
                className="btn btn-secondary flex items-center gap-2"
                onClick={handlePrint}
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              onClick={handleSubmit}
            >
              <Save className="w-4 h-4" />
              Guardar Entrega
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDeliveryForm;