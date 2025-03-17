import React, { useState, useEffect } from 'react';
import { FileText, Download, Edit, Trash2, Printer } from 'lucide-react';
import { format } from 'date-fns';
import type { PurchaseOrder } from '../types';
import WarehouseService from '../services/warehouseService';
import { generatePurchaseOrderPDF } from '../utils/pdfGenerator';

const PurchaseOrdersPage = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [error, setError] = useState('');

  const warehouseService = WarehouseService.getInstance();

  useEffect(() => {
    setOrders(warehouseService.getPurchaseOrders());
  }, []);

  const handleDelete = (id: string) => {
    try {
      warehouseService.deletePurchaseOrder(id);
      setOrders(warehouseService.getPurchaseOrders());
    } catch (err) {
      setError('Error al eliminar la orden');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Órdenes de Compra
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(order.date, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                          onClick={() => setSelectedOrder(order)}
                          title="Ver detalles"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="sm:hidden">Ver detalles</span>
                        </button>
                        <button
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                          onClick={() => setEditingOrder(order)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sm:hidden">Editar</span>
                        </button>
                        <button
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                          onClick={() => generatePurchaseOrderPDF(order)}
                          title="Imprimir"
                        >
                          <Printer className="w-4 h-4" />
                          <span className="sm:hidden">Imprimir</span>
                        </button>
                        <button
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                          onClick={() => generatePurchaseOrderPDF(order)}
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                          <span className="sm:hidden">Descargar PDF</span>
                        </button>
                        <button
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                          onClick={() => handleDelete(order.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sm:hidden">Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdersPage;