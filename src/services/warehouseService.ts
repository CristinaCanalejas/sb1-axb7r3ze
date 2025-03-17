import type { 
  WarehouseItem, 
  PurchaseRequest, 
  PurchaseOrder,
  PurchaseRequestItem,
  PurchaseOrderItem,
  WarehouseWithdrawal,
  PriceHistory,
  WorkshopDelivery 
} from '../types';

class WarehouseService {
  private static instance: WarehouseService;
  
  private items: WarehouseItem[] = [
    {
      id: '1',
      code: 'FIL-001',
      name: 'Filtro de Aceite',
      category: 'Repuestos',
      subcategory: 'Filtros',
      unit: 'unidad',
      stock: 15,
      minStock: 10,
      maxStock: 30,
      location: 'A-01-01',
      supplier: 'AutoParts SA',
      lastPurchaseDate: new Date('2024-03-01'),
      lastPurchasePrice: 25000,
      priceHistory: [
        { date: new Date('2024-03-01'), price: 25000, supplier: 'AutoParts SA' },
        { date: new Date('2024-02-01'), price: 24000, supplier: 'AutoParts SA' },
        { date: new Date('2024-01-15'), price: 23500, supplier: 'Repuestos Mineros' },
      ]
    },
    {
      id: '2',
      code: 'ACE-001',
      name: 'Aceite de Motor 15W-40',
      category: 'Lubricantes',
      subcategory: 'Aceites',
      unit: 'litro',
      stock: 200,
      minStock: 100,
      maxStock: 500,
      location: 'B-02-01',
      supplier: 'Lubricantes Chile',
      lastPurchaseDate: new Date('2024-02-15'),
      lastPurchasePrice: 5000,
      priceHistory: [
        { date: new Date('2024-02-15'), price: 5000, supplier: 'Lubricantes Chile' },
        { date: new Date('2024-01-10'), price: 4800, supplier: 'Lubricantes Chile' },
      ]
    },
  ];

  private purchaseRequests: PurchaseRequest[] = [
    {
      id: '1',
      requestNumber: 'PR-2024-001',
      date: new Date('2024-03-15'),
      requestedBy: 'Carlos Rodríguez',
      requestedById: '3',
      department: 'MANTENIMIENTO',
      status: 'pending',
      priority: 'high',
      equipmentId: 'EQ001',
      equipmentName: 'Camión Volvo FH',
      equipmentInternalNumber: 'CAM-001',
      items: [
        {
          id: '1',
          itemId: '1',
          itemName: 'Filtro de Aceite',
          quantity: 10,
          unit: 'unidad',
          estimatedPrice: 25000,
          status: 'pending',
        },
      ],
      notes: 'Reposición de stock crítico',
    },
  ];

  private purchaseOrders: PurchaseOrder[] = [
    {
      id: '1',
      orderNumber: 'PO-2024-001',
      date: new Date('2024-03-16'),
      supplier: 'AutoParts SA',
      requestId: '1',
      status: 'pending',
      items: [
        {
          id: '1',
          itemId: '1',
          itemName: 'Filtro de Aceite',
          quantity: 10,
          unit: 'unidad',
          unitPrice: 25000,
          totalPrice: 250000,
        },
      ],
      totalAmount: 250000,
      expectedDeliveryDate: new Date('2024-03-23'),
      notes: 'Entrega en bodega central',
    },
  ];

  private withdrawals: WarehouseWithdrawal[] = [
    {
      id: '1',
      withdrawalNumber: 'WD-2024-001',
      date: new Date('2024-03-15'),
      withdrawnBy: 'Juan Pérez',
      department: 'EXTRACCIÓN',
      equipmentId: 'EQ002',
      equipmentName: 'Excavadora CAT 320',
      equipmentInternalNumber: 'EXC-001',
      items: [
        {
          id: '1',
          itemId: '2',
          itemName: 'Aceite de Motor 15W-40',
          quantity: 40,
          unit: 'litro',
        },
      ],
      status: 'completed',
      notes: 'Cambio de aceite programado',
    },
  ];

  private workshopDeliveries: WorkshopDelivery[] = [
    {
      id: '1',
      deliveryNumber: 'WD-2024-001',
      date: new Date('2024-03-15'),
      time: '08:30',
      receivedBy: 'Carlos Rodríguez',
      department: 'MANTENIMIENTO',
      equipmentId: 'EQ001',
      equipmentName: 'Camión Volvo FH',
      equipmentInternalNumber: 'CAM-001',
      items: [
        {
          id: '1',
          itemId: '1',
          itemName: 'Filtro de Aceite',
          quantity: 2,
          unit: 'unidad',
        },
        {
          id: '2',
          itemId: '2',
          itemName: 'Aceite de Motor 15W-40',
          quantity: 40,
          unit: 'litro',
        },
      ],
      notes: 'Mantenimiento preventivo programado',
    },
  ];

  private constructor() {}

  public static getInstance(): WarehouseService {
    if (!WarehouseService.instance) {
      WarehouseService.instance = new WarehouseService();
    }
    return WarehouseService.instance;
  }

  // Warehouse Items
  public getItems(): WarehouseItem[] {
    return this.items;
  }

  public getItemById(id: string): WarehouseItem | undefined {
    return this.items.find(item => item.id === id);
  }

  public saveItem(item: WarehouseItem): void {
    const index = this.items.findIndex(i => i.id === item.id);
    
    // If price has changed, update price history
    if (item.lastPurchasePrice !== this.items[index]?.lastPurchasePrice) {
      const newPriceHistory: PriceHistory = {
        date: new Date(),
        price: item.lastPurchasePrice || 0,
        supplier: item.supplier || 'No especificado'
      };

      item.priceHistory = [
        newPriceHistory,
        ...(item.priceHistory || [])
      ];
    }

    if (index >= 0) {
      this.items[index] = item;
    } else {
      this.items.push({
        ...item,
        id: Date.now().toString(),
        priceHistory: item.lastPurchasePrice ? [{
          date: new Date(),
          price: item.lastPurchasePrice,
          supplier: item.supplier || 'No especificado'
        }] : []
      });
    }

    // Update price in pending purchase requests
    if (item.lastPurchasePrice) {
      this.updatePriceInPendingRequests(item.id, item.lastPurchasePrice);
    }
  }

  private updatePriceInPendingRequests(itemId: string, newPrice: number): void {
    this.purchaseRequests = this.purchaseRequests.map(request => {
      if (request.status === 'pending') {
        const updatedItems = request.items.map(item => {
          if (item.itemId === itemId) {
            return {
              ...item,
              estimatedPrice: newPrice
            };
          }
          return item;
        });

        return {
          ...request,
          items: updatedItems
        };
      }
      return request;
    });
  }

  public deleteItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  public updateStock(itemId: string, quantity: number, isAddition: boolean): void {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.stock = isAddition ? item.stock + quantity : item.stock - quantity;
    }
  }

  // Purchase Requests
  public getPurchaseRequests(): PurchaseRequest[] {
    return this.purchaseRequests;
  }

  public getPurchaseRequestById(id: string): PurchaseRequest | undefined {
    return this.purchaseRequests.find(pr => pr.id === id);
  }

  public savePurchaseRequest(request: PurchaseRequest): void {
    // Update estimated prices from current inventory prices
    const updatedItems = request.items.map(item => {
      const inventoryItem = this.getItemById(item.itemId);
      return {
        ...item,
        estimatedPrice: inventoryItem?.lastPurchasePrice || item.estimatedPrice
      };
    });

    request = {
      ...request,
      items: updatedItems
    };

    const index = this.purchaseRequests.findIndex(pr => pr.id === request.id);
    if (index >= 0) {
      this.purchaseRequests[index] = request;
    } else {
      this.purchaseRequests.push({
        ...request,
        id: Date.now().toString(),
        requestNumber: `PR-${new Date().getFullYear()}-${(this.purchaseRequests.length + 1).toString().padStart(3, '0')}`,
      });
    }
  }

  public deletePurchaseRequest(id: string): void {
    this.purchaseRequests = this.purchaseRequests.filter(pr => pr.id !== id);
  }

  // Purchase Orders
  public getPurchaseOrders(): PurchaseOrder[] {
    return this.purchaseOrders;
  }

  public getPurchaseOrderById(id: string): PurchaseOrder | undefined {
    return this.purchaseOrders.find(po => po.id === id);
  }

  public savePurchaseOrder(order: PurchaseOrder): void {
    const index = this.purchaseOrders.findIndex(po => po.id === order.id);
    if (index >= 0) {
      this.purchaseOrders[index] = order;
    } else {
      this.purchaseOrders.push({
        ...order,
        id: Date.now().toString(),
        orderNumber: `PO-${new Date().getFullYear()}-${(this.purchaseOrders.length + 1).toString().padStart(3, '0')}`,
      });
    }
  }

  public deletePurchaseOrder(id: string): void {
    this.purchaseOrders = this.purchaseOrders.filter(po => po.id !== id);
  }

  public receivePurchaseOrder(orderId: string, receivedItems: { itemId: string; quantity: number }[]): void {
    const order = this.purchaseOrders.find(po => po.id === orderId);
    if (order) {
      order.status = 'received';
      order.receivedDate = new Date();
      
      receivedItems.forEach(({ itemId, quantity }) => {
        const orderItem = order.items.find(item => item.itemId === itemId);
        if (orderItem) {
          orderItem.receivedQuantity = quantity;
          this.updateStock(itemId, quantity, true);

          // Update item price in inventory if different
          const item = this.getItemById(itemId);
          if (item && orderItem.unitPrice !== item.lastPurchasePrice) {
            this.saveItem({
              ...item,
              lastPurchasePrice: orderItem.unitPrice,
              lastPurchaseDate: new Date(),
              supplier: order.supplier
            });
          }
        }
      });

      if (order.items.every(item => item.receivedQuantity === item.quantity)) {
        order.status = 'completed';
      }
    }
  }

  // Warehouse Withdrawals
  public getWithdrawals(): WarehouseWithdrawal[] {
    return this.withdrawals;
  }

  public getWithdrawalById(id: string): WarehouseWithdrawal | undefined {
    return this.withdrawals.find(w => w.id === id);
  }

  public saveWithdrawal(withdrawal: WarehouseWithdrawal): void {
    const index = this.withdrawals.findIndex(w => w.id === withdrawal.id);
    
    // Update stock for completed withdrawals
    if (withdrawal.status === 'completed') {
      withdrawal.items.forEach(item => {
        this.updateStock(item.itemId, item.quantity, false);
      });
    }

    if (index >= 0) {
      this.withdrawals[index] = withdrawal;
    } else {
      this.withdrawals.push({
        ...withdrawal,
        id: Date.now().toString(),
        withdrawalNumber: `WD-${new Date().getFullYear()}-${(this.withdrawals.length + 1).toString().padStart(3, '0')}`,
      });
    }
  }

  public deleteWithdrawal(id: string): void {
    this.withdrawals = this.withdrawals.filter(w => w.id !== id);
  }

  // Workshop Deliveries
  public getWorkshopDeliveries(): WorkshopDelivery[] {
    return this.workshopDeliveries;
  }

  public saveWorkshopDelivery(delivery: WorkshopDelivery): void {
    const index = this.workshopDeliveries.findIndex(d => d.id === delivery.id);
    
    // Update stock for each item
    delivery.items.forEach(item => {
      this.updateStock(item.itemId, item.quantity, false);
    });

    if (index >= 0) {
      this.workshopDeliveries[index] = delivery;
    } else {
      this.workshopDeliveries.push({
        ...delivery,
        id: Date.now().toString(),
        deliveryNumber: `WD-${new Date().getFullYear()}-${(this.workshopDeliveries.length + 1).toString().padStart(3, '0')}`,
      });
    }
  }

  public deleteWorkshopDelivery(id: string): void {
    this.workshopDeliveries = this.workshopDeliveries.filter(d => d.id !== id);
  }

  // Utility Methods
  public getLowStockItems(): WarehouseItem[] {
    return this.items.filter(item => item.stock <= item.minStock);
  }

  public getItemCategories(): string[] {
    return [...new Set(this.items.map(item => item.category))];
  }

  public getItemSubcategories(category: string): string[] {
    return [...new Set(this.items.filter(item => item.category === category).map(item => item.subcategory))];
  }

  public searchItems(query: string): WarehouseItem[] {
    const searchTerm = query.toLowerCase();
    return this.items.filter(item =>
      item.code.toLowerCase().includes(searchTerm) ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.subcategory.toLowerCase().includes(searchTerm)
    );
  }

  public getPriceHistory(itemId: string): PriceHistory[] {
    const item = this.getItemById(itemId);
    return item?.priceHistory || [];
  }
}

export default WarehouseService;