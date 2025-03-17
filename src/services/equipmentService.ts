import { WorkingEquipment } from '../types';

class EquipmentService {
  private static instance: EquipmentService;
  private workingEquipment: WorkingEquipment[] = [
    {
      id: '1',
      equipmentId: 'EQ001',
      equipmentName: 'Camión Volvo FH',
      department: 'TRANSPORTE',
      startTime: new Date('2024-03-15T08:00:00'),
      estimatedEndTime: new Date('2024-03-15T16:00:00'),
      location: 'Zona Norte - Sector A',
      operatorId: '1',
      operatorName: 'Juan Pérez',
      activity: 'Transporte de material',
      status: 'operando',
      notes: 'Transporte regular entre puntos de extracción y acopio',
    },
    {
      id: '2',
      equipmentId: 'EQ002',
      equipmentName: 'Excavadora CAT 320',
      department: 'EXTRACCIÓN',
      startTime: new Date('2024-03-15T07:30:00'),
      estimatedEndTime: new Date('2024-03-15T15:30:00'),
      location: 'Zona Sur - Sector B',
      operatorId: '2',
      operatorName: 'María González',
      activity: 'Excavación',
      status: 'en_espera',
      notes: 'Preparación de terreno para nueva área de extracción',
    },
  ];

  private locations: string[] = [
    'Zona Norte - Sector A',
    'Zona Sur - Sector B',
  ];

  private constructor() {}

  public static getInstance(): EquipmentService {
    if (!EquipmentService.instance) {
      EquipmentService.instance = new EquipmentService();
    }
    return EquipmentService.instance;
  }

  public getWorkingEquipment(): WorkingEquipment[] {
    return this.workingEquipment;
  }

  public getFilteredWorkingEquipment(department?: string): WorkingEquipment[] {
    if (!department) return this.workingEquipment;
    return this.workingEquipment.filter(eq => eq.department === department);
  }

  public getLocations(): string[] {
    return this.locations;
  }

  public addLocation(location: string): void {
    if (!this.locations.includes(location)) {
      this.locations.push(location);
    }
  }

  public saveWorkingEquipment(equipment: WorkingEquipment): void {
    const index = this.workingEquipment.findIndex(eq => eq.id === equipment.id);
    
    if (equipment.location && !this.locations.includes(equipment.location)) {
      this.addLocation(equipment.location);
    }

    if (index >= 0) {
      this.workingEquipment[index] = equipment;
    } else {
      this.workingEquipment.push({
        ...equipment,
        id: Date.now().toString(),
      });
    }
  }

  public deleteWorkingEquipment(id: string): void {
    this.workingEquipment = this.workingEquipment.filter(eq => eq.id !== id);
  }
}

export default EquipmentService;