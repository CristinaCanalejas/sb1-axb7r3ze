import { create } from 'zustand';
import { supabase } from '../lib/supabase';
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
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          department:departments(name),
          photos:equipment_photos(url)
        `);

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('working_equipment')
        .select(`
          *,
          equipment:equipment(name, internal_number),
          operator:personnel(full_name)
        `);

      if (error) throw error;

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
      const { error } = await supabase
        .from('equipment')
        .insert([equipment]);

      if (error) throw error;

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
      const { error } = await supabase
        .from('equipment')
        .update(equipment)
        .eq('id', id);

      if (error) throw error;

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
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      
      // Start a transaction
      const { error: statusError } = await supabase
        .from('equipment_status')
        .insert([{
          equipment_id: status.equipmentId,
          status: status.status,
          exit_date: status.exitDate,
          exit_time: status.exitTime,
          supervisor_id: status.supervisor,
          mechanic_id: status.mechanic,
        }])
        .select()
        .single();

      if (statusError) throw statusError;

      // Update equipment status
      const { error: equipmentError } = await supabase
        .from('equipment')
        .update({ status: status.status })
        .eq('id', status.equipmentId);

      if (equipmentError) throw equipmentError;

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
      const { error } = await supabase
        .from('working_equipment')
        .upsert([equipment]);

      if (error) throw error;

      await get().fetchWorkingEquipment();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));