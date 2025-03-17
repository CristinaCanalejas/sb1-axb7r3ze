export interface Equipment {
  id?: string;
  department: string;
  internalNumber: string;
  name: string;
  type: string;
  status: 'operational' | 'non-operational';
  technicalSheet?: string;
  photos?: string[];
}

export interface FuelRecord {
  date: Date;
  department: string;
  operatorId: string;
  internalNumber: string;
  equipmentId: string;
  odometer: number;
  fuelType: string;
  liters: number;
  supervisor: string;
}

export interface Personnel {
  id: string;
  name: string;
  role: string[];
  department: string;
  contact: {
    email: string;
    phone: string;
  };
}

export interface ClothingSize {
  shirt: string;
  tshirt: string;
  pants: string;
  jacket: string;
  firstLayer: string;
  boots: string;
}

export interface ClothingPPERequest {
  id: string;
  requestNumber: string;
  date: Date;
  employeeId: string;
  employeeName: string;
  department: string;
  sizes: ClothingSize;
  items: ClothingPPEItem[];
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  priority: 'normal' | 'urgent';
  approvedBy?: string;
  approvalDate?: Date;
  deliveryDate?: Date;
  notes?: string;
}

export interface ClothingPPEItem {
  id: string;
  type: 'clothing' | 'ppe';
  name: string;
  quantity: number;
  size?: string;
  reason: string;
}

export interface EquipmentStatus {
  equipmentId: string;
  status: 'operational' | 'non-operational';
  exitDate?: string;
  exitTime?: string;
  supervisor?: string;
  mechanic?: string;
  problems?: string;
  spareParts?: string;
}

export interface EquipmentStatusFormData {
  equipmentId: string;
  status: 'operational' | 'non-operational';
  exitDate?: string;
  exitTime?: string;
  supervisor?: string;
  mechanic?: string;
  commonProblems: string[];
  otherProblem: string;
  spareParts: string[];
  otherSparePart: string;
}

export interface WorkingEquipment {
  id: string;
  equipmentId: string;
  equipmentName: string;
  department: string;
  startTime: Date;
  estimatedEndTime: Date;
  location: string;
  operatorId: string;
  operatorName: string;
  activity: string;
  status: string;
  notes: string;
}

export interface PriceHistory {
  date: Date;
  price: number;
  supplier: string;
}

export interface WarehouseItem {
  id: string;
  code: string;
  name: string;
  category: string;
  subcategory: string;
  unit: string;
  stock: number;
  minStock: number;
  maxStock: number;
  location: string;
  supplier?: string;
  lastPurchaseDate?: Date;
  lastPurchasePrice?: number;
  priceHistory?: PriceHistory[];
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  date: Date;
  requestedBy: string;
  requestedById: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: PurchaseRequestItem[];
  notes?: string;
  approvedBy?: string;
  approvedById?: string;
  approvalDate?: Date;
  equipmentId?: string;
  equipmentName?: string;
  equipmentInternalNumber?: string;
}

export interface PurchaseRequestItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  date: Date;
  supplier: string;
  requestId?: string;
  status: 'pending' | 'sent' | 'received' | 'completed' | 'cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
  expectedDeliveryDate: Date;
  receivedDate?: Date;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
  notes?: string;
}

export interface WarehouseWithdrawal {
  id: string;
  withdrawalNumber: string;
  date: Date;
  withdrawnBy: string;
  department: string;
  equipmentId?: string;
  equipmentName?: string;
  equipmentInternalNumber?: string;
  items: WithdrawalItem[];
  notes?: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
}

export interface WithdrawalItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
}

export interface WorkshopDelivery {
  id: string;
  deliveryNumber: string;
  date: Date;
  time: string;
  receivedBy: string;
  department: string;
  equipmentId?: string;
  equipmentName?: string;
  equipmentInternalNumber?: string;
  items: WorkshopDeliveryItem[];
  notes?: string;
}

export interface WorkshopDeliveryItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
}