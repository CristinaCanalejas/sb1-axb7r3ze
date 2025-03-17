import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShoppingCart, ClipboardList, Bell, ChevronRight, Package } from 'lucide-react';
import WarehouseService from '../../services/warehouseService';
import type { WarehouseItem, PurchaseRequest, PurchaseOrder } from '../../types';

const WarehouseAlerts = () => {
  const [lowStockItems, setLowStockItems] = useState<WarehouseItem[]>([]);
  const [processedOrders, setProcessedOrders] = useState<PurchaseOrder[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PurchaseRequest[]>([]);

  const warehouseService = WarehouseService.getInstance();

  useEffect(() => {
    // Get low stock items
    setLowStockItems(warehouseService.getLowStockItems());

    // Get processed purchase orders (received or completed)
    const orders = warehouseService.getPurchaseOrders();
    setProcessedOrders(orders.filter(order => 
      ['received', 'completed'].includes(order.status) && 
      (!order.receivedDate || new Date().getTime() - order.receivedDate.getTime() < 24 * 60 * 60 * 1000) // Last 24 hours
    ));

    // Get pending purchase requests
    const requests = warehouseService.getPurchaseRequests();
    setPendingRequests(requests.filter(request => request.status === 'pending'));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Low Stock Alerts */}
      <div className="bg-red-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-red-900">Stock Bajo</h2>
        </div>
        
        <div className="space-y-3">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-red-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.code}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {item.stock} {item.unit}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">Stock Mínimo: {item.minStock}</span>
                <span className="text-red-600 font-medium">
                  Faltan {item.minStock - item.stock} {item.unit}
                </span>
              </div>
            </div>
          ))}

          {lowStockItems.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No hay items con stock bajo
            </div>
          )}
        </div>
      </div>

      {/* Processed Orders */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-green-900">Órdenes Procesadas</h2>
        </div>
        
        <div className="space-y-3">
          {processedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-green-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">{order.supplier}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.status === 'completed' ? 'Completada' : 'Recibida'}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {order.receivedDate?.toLocaleDateString()}
                </span>
                <span className="text-green-600 font-medium">
                  ${order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {processedOrders.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No hay órdenes procesadas recientemente
            </div>
          )}
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <ClipboardList className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-lg font-semibold text-yellow-900">Solicitudes Pendientes</h2>
        </div>
        
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{request.requestNumber}</h3>
                  <p className="text-sm text-gray-500">{request.department}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  request.priority === 'urgent'
                    ? 'bg-red-100 text-red-800'
                    : request.priority === 'high'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.priority === 'urgent' ? 'Urgente' : 
                   request.priority === 'high' ? 'Alta' : 'Media'}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {request.date.toLocaleDateString()}
                </span>
                <span className="text-yellow-600 font-medium">
                  {request.items.length} items
                </span>
              </div>
            </div>
          ))}

          {pendingRequests.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No hay solicitudes pendientes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseAlerts;