import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Save, AlertCircle, Edit, Trash2, Search, FileText, Download, ShoppingCart, DollarSign, History, X, Package, Printer } from 'lucide-react';
import { format } from 'date-fns';
import type { PurchaseRequest, PurchaseRequestItem, Personnel, WarehouseItem } from '../types';
import WarehouseService from '../services/warehouseService';
import MasterDataService from '../services/masterDataService';
import { generatePurchaseRequestPDF } from '../utils/pdfGenerator';
import { useNavigate } from 'react-router-dom';
import WarehouseForm from './WarehousePage';

const PurchaseRequestsPage = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [editingRequest, setEditingRequest] = useState<PurchaseRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [error, setError] = useState('');
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const warehouseService = WarehouseService.getInstance();
  const masterDataService = MasterDataService.getInstance();

  useEffect(() => {
    setRequests(warehouseService.getPurchaseRequests());
  }, []);

  const handleSearch = () => {
    // Implement search logic here
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingRequest) return;

    if (
      !editingRequest.requestedBy ||
      !editingRequest.department ||
      !editingRequest.items.length ||
      editingRequest.items.some(item => !item.itemId || !item.quantity || item.quantity <= 0)
    ) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      warehouseService.savePurchaseRequest(editingRequest);
      setRequests(warehouseService.getPurchaseRequests());
      setEditingRequest(null);
      setError('');
    } catch (err) {
      setError('Error al guardar la solicitud');
    }
  };

  const handleDelete = (id: string) => {
    try {
      warehouseService.deletePurchaseRequest(id);
      setRequests(warehouseService.getPurchaseRequests());
    } catch (err) {
      setError('Error al eliminar la solicitud');
    }
  };

  const handleGeneratePurchaseOrder = (request: PurchaseRequest) => {
    try {
      const order = {
        id: '',
        orderNumber: '',
        date: new Date(),
        supplier: '',
        requestId: request.id,
        status: 'pending' as const,
        items: request.items.map(item => ({
          id: '',
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.estimatedPrice || 0,
          totalPrice: (item.estimatedPrice || 0) * item.quantity,
        })),
        totalAmount: request.items.reduce((sum, item) => sum + ((item.estimatedPrice || 0) * item.quantity), 0),
        expectedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        notes: `Generado desde solicitud ${request.requestNumber}`,
      };

      warehouseService.savePurchaseOrder(order);
      navigate('/purchase-orders');
    } catch (err) {
      setError('Error al generar la orden de compra');
    }
  };

  const handleAddItem = () => {
    if (!editingRequest) return;
    setEditingRequest({
      ...editingRequest,
      items: [
        ...editingRequest.items,
        {
          id: Date.now().toString(),
          itemId: '',
          itemName: '',
          quantity: 0,
          unit: '',
          status: 'pending',
        },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!editingRequest) return;
    setEditingRequest({
      ...editingRequest,
      items: editingRequest.items.filter((_, i) => i !== index),
    });
  };

  const handleItemPriceChange = (index: number, newPrice: number) => {
    if (!editingRequest) return;

    const newItems = [...editingRequest.items];
    newItems[index] = {
      ...newItems[index],
      estimatedPrice: newPrice
    };

    setEditingRequest({
      ...editingRequest,
      items: newItems
    });
  };

  const handleViewPriceHistory = (itemId: string) => {
    const item = warehouseService.getItemById(itemId);
    if (item) {
      setSelectedItem(item);
      setShowPriceHistory(true);
    }
  };

  const departments = masterDataService.getDepartments();
  const equipment = masterDataService.getEquipment();
  const items = warehouseService.getItems();
  const mechanics = masterDataService.getMechanics();
  const supervisors = masterDataService.getSupervisors();

  const personnel = [...mechanics, ...supervisors].reduce<Personnel[]>((unique, person) => {
    const exists = unique.find(p => p.id === person.id);
    if (!exists) {
      unique.push(person);
    }
    return unique;
  }, []);

  const priorityOptions = [
    { value: 'low', label: 'Baja', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Aprobada', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rechazada', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completada', color: 'bg-blue-100 text-blue-800' },
  ];

  const getPriorityInfo = (priority: string) => {
    return priorityOptions.find(opt => opt.value === priority) || priorityOptions[0];
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Solicitudes de Compra
            </h1>

            {!editingRequest && (
              <button
                className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => setEditingRequest({
                  id: '',
                  requestNumber: '',
                  date: new Date(),
                  requestedBy: '',
                  requestedById: '',
                  department: '',
                  status: 'pending',
                  priority: 'medium',
                  items: [],
                })}
              >
                <Plus className="w-4 h-4" />
                Nueva Solicitud
              </button>
            )}

            {!editingRequest && (
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      className="input pl-10 w-full"
                      placeholder="Buscar por código, nombre, categoría..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <button
                  className="btn btn-secondary w-full sm:w-auto"
                  onClick={handleSearch}
                >
                  Buscar
                </button>
              </div>
            )}

            {editingRequest && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {editingRequest.id ? 'Editar Solicitud' : 'Nueva Solicitud'}
                      </h2>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setEditingRequest(null)}
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Solicitante
                          </label>
                          <select
                            className="select"
                            value={editingRequest.requestedById}
                            onChange={(e) => {
                              const selectedPerson = personnel.find(p => p.id === e.target.value);
                              setEditingRequest({
                                ...editingRequest,
                                requestedById: e.target.value,
                                requestedBy: selectedPerson?.name || '',
                                department: selectedPerson?.department || editingRequest.department,
                              });
                            }}
                          >
                            <option value="">Seleccionar Solicitante</option>
                            {personnel.map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.name} ({person.role.join(', ')})
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
                            value={editingRequest.department}
                            onChange={(e) => setEditingRequest({
                              ...editingRequest,
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
                            Prioridad
                          </label>
                          <select
                            className="select"
                            value={editingRequest.priority}
                            onChange={(e) => setEditingRequest({
                              ...editingRequest,
                              priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent',
                            })}
                          >
                            {priorityOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                          </label>
                          <select
                            className="select"
                            value={editingRequest.status}
                            onChange={(e) => setEditingRequest({
                              ...editingRequest,
                              status: e.target.value as 'pending' | 'approved' | 'rejected' | 'completed',
                            })}
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Equipo Asignado
                          </label>
                          <select
                            className="select"
                            value={editingRequest.equipmentId || ''}
                            onChange={(e) => {
                              const selectedEquipment = equipment.find(eq => eq.id === e.target.value);
                              setEditingRequest({
                                ...editingRequest,
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
                            value={editingRequest.equipmentInternalNumber || ''}
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
                            value={editingRequest.notes || ''}
                            onChange={(e) => setEditingRequest({
                              ...editingRequest,
                              notes: e.target.value,
                            })}
                            placeholder="Observaciones o detalles adicionales"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-medium text-gray-900">Ítems Solicitados</h2>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowInventoryModal(true)}
                            >
                              <Package className="w-4 h-4" /> Ver Inventario
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleAddItem}
                            >
                              <Plus className="w-4 h-4" /> Agregar Ítem
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {editingRequest.items.map((item, index) => (
                            <div key={item.id} className="flex gap-4 items-start">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                  <select
                                    className="select"
                                    value={item.itemId}
                                    onChange={(e) => {
                                      const selectedItem = items.find(i => i.id === e.target.value);
                                      const newItems = [...editingRequest.items];
                                      newItems[index] = {
                                        ...item,
                                        itemId: e.target.value,
                                        itemName: selectedItem?.name || '',
                                        unit: selectedItem?.unit || '',
                                        estimatedPrice: selectedItem?.lastPurchasePrice || 0,
                                      };
                                      setEditingRequest({
                                        ...editingRequest,
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
                                </div>

                                <div>
                                  <div className="flex gap-2">
                                    <input
                                      type="number"
                                      className="input w-32"
                                      min="1"
                                      placeholder="Cantidad"
                                      value={item.quantity || ''}
                                      onChange={(e) => {
                                        const newItems = [...editingRequest.items];
                                        newItems[index] = {
                                          ...item,
                                          quantity: parseInt(e.target.value),
                                        };
                                        setEditingRequest({
                                          ...editingRequest,
                                          items: newItems,
                                        });
                                      }}
                                    />
                                    <span className="py-2 px-3 bg-gray-100 rounded text-sm">
                                      {item.unit}
                                    </span>
                                  </div>
                                </div>

                                <div className="relative">
                                  <div className="flex gap-2">
                                    <div className="relative flex-1">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                      <input
                                        type="number"
                                        className="input pl-8"
                                        min="0"
                                        placeholder="Precio estimado"
                                        value={item.estimatedPrice || ''}
                                        onChange={(e) => handleItemPriceChange(index, parseInt(e.target.value))}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      className="p-2 hover:bg-gray-100 rounded-lg"
                                      onClick={() => handleViewPriceHistory(item.itemId)}
                                      title="Ver historial de precios"
                                    >
                                      <History className="w-4 h-4 text-blue-600" />
                                    </button>
                                  </div>
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
                    </form>
                  </div>

                  <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditingRequest(null)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex items-center gap-2"
                        onClick={handleSave}
                      >
                        <Save className="w-4 h-4" />
                        Guardar Solicitud
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rest of the component code remains unchanged */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestsPage;