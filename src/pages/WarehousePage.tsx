import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Edit, Trash2, AlertCircle, Save, ArrowLeftRight, ArrowLeft, Wrench, History, Menu } from 'lucide-react';
import type { WarehouseItem } from '../types';
import WarehouseService from '../services/warehouseService';
import MasterDataService from '../services/masterDataService';
import WarehouseAlerts from '../components/warehouse/WarehouseAlerts';
import ChangeForm from '../components/warehouse/ChangeForm';
import ReturnForm from '../components/warehouse/ReturnForm';
import WorkshopDeliveryForm from '../components/warehouse/WorkshopDeliveryForm';
import WorkshopDeliveryHistory from '../components/warehouse/WorkshopDeliveryHistory';

const WarehousePage = () => {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [showWorkshopDeliveryForm, setShowWorkshopDeliveryForm] = useState(false);
  const [showWorkshopDeliveryHistory, setShowWorkshopDeliveryHistory] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const warehouseService = WarehouseService.getInstance();
  const masterDataService = MasterDataService.getInstance();

  const menuItems = [
    {
      id: 'workshop-delivery',
      label: 'Entrega a Taller',
      icon: Wrench,
      onClick: () => setShowWorkshopDeliveryForm(true),
    },
    {
      id: 'delivery-history',
      label: 'Historial de Entrega',
      icon: History,
      onClick: () => setShowWorkshopDeliveryHistory(true),
    },
    {
      id: 'change',
      label: 'Cambio',
      icon: ArrowLeftRight,
      onClick: () => setShowChangeForm(true),
    },
    {
      id: 'return',
      label: 'Devolución',
      icon: ArrowLeft,
      onClick: () => setShowReturnForm(true),
    },
    {
      id: 'new-item',
      label: 'Nuevo Ítem',
      icon: Plus,
      onClick: () => setEditingItem({
        id: '',
        code: '',
        name: '',
        category: '',
        subcategory: '',
        unit: '',
        stock: 0,
        minStock: 0,
        maxStock: 0,
        location: '',
      }),
      primary: true,
    },
  ];

  useEffect(() => {
    setItems(warehouseService.getItems());
  }, []);

  const handleSearch = () => {
    setItems(warehouseService.searchItems(searchTerm));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingItem) return;

    if (
      !editingItem.code ||
      !editingItem.name ||
      !editingItem.category ||
      !editingItem.subcategory ||
      !editingItem.unit ||
      editingItem.minStock < 0 ||
      editingItem.maxStock <= editingItem.minStock
    ) {
      setError('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    try {
      warehouseService.saveItem(editingItem);
      setItems(warehouseService.getItems());
      setEditingItem(null);
      setError('');
    } catch (err) {
      setError('Error al guardar el ítem');
    }
  };

  const handleDelete = (id: string) => {
    try {
      warehouseService.deleteItem(id);
      setItems(warehouseService.getItems());
    } catch (err) {
      setError('Error al eliminar el ítem');
    }
  };

  const categories = warehouseService.getItemCategories();
  const subcategories = selectedCategory ? warehouseService.getItemSubcategories(selectedCategory) : [];
  const units = masterDataService.getUnits();
  const suppliers = masterDataService.getSuppliers();
  const workshopDeliveries = warehouseService.getWorkshopDeliveries();

  return (
    <div className="space-y-6">
      <WarehouseAlerts />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Control de Inventario
            </h1>

            <div className="hidden md:flex items-center gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`btn ${item.primary ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2 whitespace-nowrap`}
                  onClick={item.onClick}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="md:hidden flex justify-end">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                    item.primary ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {!editingItem && (
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
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

          {editingItem && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingItem.code}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      code: e.target.value,
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      name: e.target.value,
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingItem.category}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                        subcategory: '',
                      });
                    }}
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategoría
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingItem.subcategory}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      subcategory: e.target.value,
                    })}
                    list="subcategories"
                  />
                  <datalist id="subcategories">
                    {subcategories.map((subcat) => (
                      <option key={subcat} value={subcat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad de Medida
                  </label>
                  <select
                    className="select"
                    value={editingItem.unit}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      unit: e.target.value,
                    })}
                  >
                    <option value="">Seleccionar Unidad</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Actual
                  </label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={editingItem.stock}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      stock: parseInt(e.target.value),
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={editingItem.minStock}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      minStock: parseInt(e.target.value),
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Máximo
                  </label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={editingItem.maxStock}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      maxStock: parseInt(e.target.value),
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      location: e.target.value,
                    })}
                    placeholder="Ej: A-01-01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor
                  </label>
                  <select
                    className="select"
                    value={editingItem.supplier || ''}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      supplier: e.target.value,
                    })}
                  >
                    <option value="">Seleccionar Proveedor</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>{supplier}</option>
                    ))}
                  </select>
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
                  onClick={() => {
                    setEditingItem(null);
                    setError('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Ítem
                </button>
              </div>
            </form>
          )}

          {!editingItem && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category} / {item.subcategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            item.stock <= item.minStock
                              ? 'text-red-600'
                              : item.stock >= item.maxStock
                              ? 'text-green-600'
                              : 'text-gray-900'
                          }`}>
                            {item.stock} {item.unit}
                          </span>
                          {item.stock <= item.minStock && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Stock Bajo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showWorkshopDeliveryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Entrega de Materiales a Taller
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowWorkshopDeliveryForm(false)}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <WorkshopDeliveryForm
                onSave={() => {
                  setShowWorkshopDeliveryForm(false);
                  setItems(warehouseService.getItems());
                }}
                onCancel={() => setShowWorkshopDeliveryForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showWorkshopDeliveryHistory && (
        <WorkshopDeliveryHistory
          deliveries={workshopDeliveries}
          onClose={() => setShowWorkshopDeliveryHistory(false)}
        />
      )}

      {showChangeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cambio de Productos
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowChangeForm(false)}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ChangeForm
                onSave={() => {
                  setShowChangeForm(false);
                  setItems(warehouseService.getItems());
                }}
                onCancel={() => setShowChangeForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showReturnForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Devolución de Productos
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowReturnForm(false)}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ReturnForm
                onSave={() => {
                  setShowReturnForm(false);
                  setItems(warehouseService.getItems());
                }}
                onCancel={() => setShowReturnForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;