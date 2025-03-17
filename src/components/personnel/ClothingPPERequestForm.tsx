import React, { useState } from 'react';
import { Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { ClothingPPERequest, ClothingPPEItem, Personnel } from '../../types';
import MasterDataService from '../../services/masterDataService';

interface Props {
  onSave: (request: ClothingPPERequest) => void;
  onCancel: () => void;
}

const ClothingPPERequestForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [request, setRequest] = useState<ClothingPPERequest>({
    id: '',
    requestNumber: '',
    date: new Date(),
    employeeId: '',
    employeeName: '',
    department: '',
    sizes: {
      shirt: '',
      tshirt: '',
      pants: '',
      jacket: '',
      firstLayer: '',
      boots: '',
    },
    items: [],
    status: 'pending',
    priority: 'normal',
  });

  const [error, setError] = useState('');

  const masterDataService = MasterDataService.getInstance();
  const personnel = masterDataService.getPersonnel();

  const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const pantSizes = ['28', '30', '32', '34', '36', '38', '40', '42', '44'];
  const bootSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

  const clothingItems = [
    'Camisa manga larga',
    'Camisa manga corta',
    'Pantalón de trabajo',
    'Chaqueta',
    'Overol',
    'Chaleco reflectante',
  ];

  const ppeItems = [
    'Casco de seguridad',
    'Lentes de seguridad',
    'Protector auditivo',
    'Guantes de trabajo',
    'Zapato de seguridad',
    'Arnés de seguridad',
    'Respirador',
    'Máscara facial',
  ];

  const handleAddItem = () => {
    setRequest({
      ...request,
      items: [
        ...request.items,
        {
          id: Date.now().toString(),
          type: 'clothing',
          name: '',
          quantity: 1,
          size: '',
          reason: '',
        },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setRequest({
      ...request,
      items: request.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !request.employeeId ||
      !request.department ||
      !request.items.length ||
      request.items.some(item => !item.name || !item.quantity || !item.reason)
    ) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    onSave(request);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empleado
          </label>
          <select
            className="select"
            value={request.employeeId}
            onChange={(e) => {
              const selectedEmployee = personnel.find(p => p.id === e.target.value);
              setRequest({
                ...request,
                employeeId: e.target.value,
                employeeName: selectedEmployee?.name || '',
                department: selectedEmployee?.department || '',
              });
            }}
          >
            <option value="">Seleccionar Empleado</option>
            {personnel.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridad
          </label>
          <select
            className="select"
            value={request.priority}
            onChange={(e) => setRequest({
              ...request,
              priority: e.target.value as 'normal' | 'urgent',
            })}
          >
            <option value="normal">Normal</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Tallas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camisa
              </label>
              <select
                className="select"
                value={request.sizes.shirt}
                onChange={(e) => setRequest({
                  ...request,
                  sizes: { ...request.sizes, shirt: e.target.value },
                })}
              >
                <option value="">Seleccionar</option>
                {shirtSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Polera
              </label>
              <select
                className="select"
                value={request.sizes.tshirt}
                onChange={(e) => setRequest({
                  ...request,
                  sizes: { ...request.sizes, tshirt: e.target.value },
                })}
              >
                <option value="">Seleccionar</option>
                {shirtSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pantalón
              </label>
              <select
                className="select"
                value={request.sizes.pants}
                onChange={(e) => setRequest({
                  ...request,
                  sizes: { ...request.sizes, pants: e.target.value },
                })}
              >
                <option value="">Seleccionar</option>
                {pantSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chaqueta
              </label>
              <select
                className="select"
                value={request.sizes.jacket}
                onChange={(e) => setRequest({
                  ...request,
                  sizes: { ...request.sizes, jacket: e.target.value },
                })}
              >
                <option value="">Seleccionar</option>
                {shirtSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primera Piel
              </label>
              <select
                className="select"
                value={request.sizes.firstLayer}
                onChange={(e) => setRequest({
                  ...request,
                  sizes: { ...request.sizes, firstLayer: e.target.value },
                })}
              >
                <option value="">Seleccionar</option>
                {shirtSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zapato de Seguridad
              </label>
              <select
                className="select"
                value={request.sizes.boots}
                onChange={(e) => setRequest({
                  ...request,
                  sizes: { ...request.sizes, boots: e.target.value },
                })}
              >
                <option value="">Seleccionar</option>
                {bootSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas
          </label>
          <input
            type="text"
            className="input"
            value={request.notes || ''}
            onChange={(e) => setRequest({
              ...request,
              notes: e.target.value,
            })}
            placeholder="Observaciones adicionales"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-medium text-gray-900">Ítems Solicitados</h2>
          <button
            type="button"
            className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto"
            onClick={handleAddItem}
          >
            <Plus className="w-4 h-4" />
            Agregar Ítem
          </button>
        </div>

        <div className="space-y-4">
          {request.items.map((item, index) => (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    className="select"
                    value={item.type}
                    onChange={(e) => {
                      const newItems = [...request.items];
                      newItems[index] = {
                        ...item,
                        type: e.target.value as 'clothing' | 'ppe',
                        name: '',
                      };
                      setRequest({
                        ...request,
                        items: newItems,
                      });
                    }}
                  >
                    <option value="clothing">Ropa de Trabajo</option>
                    <option value="ppe">EPP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ítem
                  </label>
                  <select
                    className="select"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...request.items];
                      newItems[index] = {
                        ...item,
                        name: e.target.value,
                      };
                      setRequest({
                        ...request,
                        items: newItems,
                      });
                    }}
                  >
                    <option value="">Seleccionar Ítem</option>
                    {(item.type === 'clothing' ? clothingItems : ppeItems).map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...request.items];
                      newItems[index] = {
                        ...item,
                        quantity: parseInt(e.target.value),
                      };
                      setRequest({
                        ...request,
                        items: newItems,
                      });
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={item.reason}
                    onChange={(e) => {
                      const newItems = [...request.items];
                      newItems[index] = {
                        ...item,
                        reason: e.target.value,
                      };
                      setRequest({
                        ...request,
                        items: newItems,
                      });
                    }}
                    placeholder="Motivo de la solicitud"
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

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          className="btn btn-secondary w-full sm:w-auto"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          Guardar Solicitud
        </button>
      </div>
    </form>
  );
};

export default ClothingPPERequestForm;