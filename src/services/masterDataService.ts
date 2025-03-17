import type { Personnel } from '../types';

interface Equipment {
  id: string;
  name: string;
  department: string;
  internalNumber?: string;
}

interface Operator {
  id: string;
  name: string;
  department: string;
}

class MasterDataService {
  private static instance: MasterDataService;

  private equipment: Equipment[] = [
    { id: 'EQ001', name: 'Camión Volvo FH', department: 'TRANSPORTE', internalNumber: 'CAM-001' },
    { id: 'EQ002', name: 'Excavadora CAT 320', department: 'EXTRACCIÓN', internalNumber: 'EXC-001' },
    { id: 'EQ003', name: 'Cargador Frontal 966H', department: 'EXTRACCIÓN', internalNumber: 'CF-001' },
  ];

  private personnel: Personnel[] = [
    { 
      id: '1', 
      name: 'Juan Pérez', 
      department: 'TRANSPORTE',
      role: ['Operador', 'Conductor'],
      contact: { email: 'juan.perez@fleetco.cl', phone: '+56 9 1234 5678' }
    },
    { 
      id: '2', 
      name: 'María González', 
      department: 'EXTRACCIÓN',
      role: ['Supervisor'],
      contact: { email: 'maria.gonzalez@fleetco.cl', phone: '+56 9 8765 4321' }
    },
    { 
      id: '3', 
      name: 'Carlos Rodríguez', 
      department: 'MANTENIMIENTO',
      role: ['Mecánico', 'Supervisor'],
      contact: { email: 'carlos.rodriguez@fleetco.cl', phone: '+56 9 2468 1357' }
    },
    { 
      id: '4', 
      name: 'Ana Martínez', 
      department: 'MANTENIMIENTO',
      role: ['Mecánico'],
      contact: { email: 'ana.martinez@fleetco.cl', phone: '+56 9 1357 2468' }
    }
  ];

  private departments: string[] = [
    'EXTRACCIÓN',
    'TRANSPORTE',
    'ADMINISTRACIÓN',
    'MANTENIMIENTO',
    'BODEGA'
  ];

  private activities: string[] = [
    'Transporte de material',
    'Excavación',
    'Carga de material',
    'Nivelación de terreno',
    'Compactación',
    'Perforación',
    'Limpieza de área',
  ];

  private statusOptions = [
    { value: 'operando', label: 'Operando', color: 'bg-green-100 text-green-800' },
    { value: 'en_espera', label: 'En Espera', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'detenido_mantenimiento', label: 'Detenido por Mantenimiento', color: 'bg-red-100 text-red-800' },
    { value: 'detenido_operador', label: 'Detenido por Falta de Operador', color: 'bg-orange-100 text-orange-800' },
    { value: 'detenido_combustible', label: 'Detenido por Combustible', color: 'bg-purple-100 text-purple-800' },
    { value: 'detenido_clima', label: 'Detenido por Clima', color: 'bg-blue-100 text-blue-800' },
    { value: 'detenido_seguridad', label: 'Detenido por Seguridad', color: 'bg-red-100 text-red-800' },
    { value: 'en_traslado', label: 'En Traslado', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'finalizado', label: 'Finalizado', color: 'bg-gray-100 text-gray-800' },
  ];

  private units: string[] = [
    'unidad',
    'par',
    'litro',
    'kilogramo',
    'metro',
    'metro cuadrado',
    'metro cúbico',
    'rollo',
    'caja',
  ];

  private suppliers: string[] = [
    'AutoParts SA',
    'Lubricantes Chile',
    'Ferretería Industrial',
    'Repuestos Mineros',
    'Seguridad Industrial SA',
  ];

  private constructor() {}

  public static getInstance(): MasterDataService {
    if (!MasterDataService.instance) {
      MasterDataService.instance = new MasterDataService();
    }
    return MasterDataService.instance;
  }

  public getEquipment(department?: string): Equipment[] {
    if (!department) return this.equipment;
    return this.equipment.filter(eq => eq.department === department);
  }

  public getPersonnel(department?: string, role?: string): Personnel[] {
    let filtered = this.personnel;
    
    if (department) {
      filtered = filtered.filter(p => p.department === department);
    }
    
    if (role) {
      filtered = filtered.filter(p => p.role.includes(role));
    }
    
    return filtered;
  }

  public getOperators(department?: string): Operator[] {
    return this.getPersonnel(department, 'Operador').map(p => ({
      id: p.id,
      name: p.name,
      department: p.department,
    }));
  }

  public getMechanics(): Personnel[] {
    return this.getPersonnel(undefined, 'Mecánico');
  }

  public getSupervisors(): Personnel[] {
    return this.getPersonnel(undefined, 'Supervisor');
  }

  public getDepartments(): string[] {
    return this.departments;
  }

  public getActivities(): string[] {
    return this.activities;
  }

  public getStatusOptions() {
    return this.statusOptions;
  }

  public getStatusInfo(status: string) {
    return (
      this.statusOptions.find(opt => opt.value === status) || {
        value: status,
        label: 'Desconocido',
        color: 'bg-gray-100 text-gray-800',
      }
    );
  }

  public getUnits(): string[] {
    return this.units;
  }

  public getSuppliers(): string[] {
    return this.suppliers;
  }
}

export default MasterDataService;