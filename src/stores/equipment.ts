import { create } from 'zustand';
import type { Equipment, EquipmentStatus, WorkingEquipment } from '../types';

interface EquipmentState {
  equipment: Equipment[];
  workingEquipment: WorkingEquipment[];
  loading: boolean;
  error: string | null;
  fetchEquipment: () => Promise<void>;
  fetchWorkingEquipment: () => Promise<void>;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  updateEquipmentStatus: (status: EquipmentStatus) => Promise<void>;
  updateWorkingEquipment: (equipment: WorkingEquipment) => Promise<void>;
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  equipment: [],
  workingEquipment: [],
  loading: false,
  error: null,

  fetchEquipment: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('http://localhost:3000/api/equipment');
      
      if (!response.ok) {
        throw new Error('Error fetching equipment');
      }
      
      const data = await response.json();
      set({ equipment: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchWorkingEquipment: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('http://localhost:3000/api/equipment/working');
      
      if (!response.ok) {
        throw new Error('Error fetching working equipment');
      }
      
      const data = await response.json();
      set({ workingEquipment: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addEquipment: async (equipment) => {
    try {
      set({ loading: true, error: null });
      
      // Mapear los campos de la interfaz Equipment a los campos esperados por el servidor
      const serverEquipment = {
        internal_number: equipment.internalNumber,
        name: equipment.name,
        type: equipment.type,
        status: equipment.status,
        department_id: equipment.department,
        technical_sheet_url: equipment.technicalSheet || null,
        photos: equipment.photos || []
      };
      
      const response = await fetch('http://localhost:3000/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverEquipment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error adding equipment');
      }

      await get().fetchEquipment();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateEquipment: async (id, equipment) => {
    try {
      set({ loading: true, error: null });
      
      // Mapear los campos de la interfaz Equipment a los campos esperados por el servidor
      const serverEquipment: Record<string, any> = {};
      
      if (equipment.internalNumber !== undefined) serverEquipment.internal_number = equipment.internalNumber;
      if (equipment.name !== undefined) serverEquipment.name = equipment.name;
      if (equipment.type !== undefined) serverEquipment.type = equipment.type;
      if (equipment.status !== undefined) serverEquipment.status = equipment.status;
      if (equipment.department !== undefined) serverEquipment.department_id = equipment.department;
      if (equipment.technicalSheet !== undefined) serverEquipment.technical_sheet_url = equipment.technicalSheet;
      if (equipment.photos !== undefined) serverEquipment.photos = equipment.photos;
      
      const response = await fetch(`http://localhost:3000/api/equipment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverEquipment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating equipment');
      }

      await get().fetchEquipment();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteEquipment: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`http://localhost:3000/api/equipment/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting equipment');
      }

      await get().fetchEquipment();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateEquipmentStatus: async (status) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch('http://localhost:3000/api/equipment/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });

      if (!response.ok) {
        throw new Error('Error updating equipment status');
      }

      // Update equipment status in the main equipment list
      const equipmentResponse = await fetch(`http://localhost:3000/api/equipment/${status.equipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status.status }),
      });

      if (!equipmentResponse.ok) {
        throw new Error('Error updating equipment status');
      }

      await get().fetchEquipment();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateWorkingEquipment: async (equipment) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('http://localhost:3000/api/equipment/working', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipment),
      });

      if (!response.ok) {
        throw new Error('Error updating working equipment');
      }

      await get().fetchWorkingEquipment();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));