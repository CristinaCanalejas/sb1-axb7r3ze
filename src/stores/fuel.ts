import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { FuelRecord } from '../types';

interface FuelState {
  fuelRecords: FuelRecord[];
  loading: boolean;
  error: string | null;
  fetchFuelRecords: () => Promise<void>;
  addFuelRecord: (record: Omit<FuelRecord, 'id'>) => Promise<void>;
}

export const useFuelStore = create<FuelState>((set, get) => ({
  fuelRecords: [],
  loading: false,
  error: null,

  fetchFuelRecords: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('fuel_records')
        .select(`
          *,
          equipment:equipment(name, internal_number),
          operator:personnel!operator_id(full_name),
          supervisor:personnel!supervisor_id(full_name)
        `);

      if (error) throw error;

      set({ fuelRecords: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addFuelRecord: async (record) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('fuel_records')
        .insert([record]);

      if (error) throw error;

      await get().fetchFuelRecords();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));