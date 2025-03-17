import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Personnel } from '../types';

interface PersonnelState {
  personnel: Personnel[];
  loading: boolean;
  error: string | null;
  fetchPersonnel: () => Promise<void>;
  addPersonnel: (personnel: Omit<Personnel, 'id'>) => Promise<void>;
  updatePersonnel: (id: string, personnel: Partial<Personnel>) => Promise<void>;
  deletePersonnel: (id: string) => Promise<void>;
}

export const usePersonnelStore = create<PersonnelState>((set, get) => ({
  personnel: [],
  loading: false,
  error: null,

  fetchPersonnel: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('personnel')
        .select(`
          *,
          department:departments(name),
          roles:personnel_roles(role),
          shifts:personnel_shifts(shift:shifts(*))
        `);

      if (error) throw error;

      set({ personnel: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addPersonnel: async (personnel) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('personnel')
        .insert([personnel]);

      if (error) throw error;

      await get().fetchPersonnel();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updatePersonnel: async (id, personnel) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('personnel')
        .update(personnel)
        .eq('id', id);

      if (error) throw error;

      await get().fetchPersonnel();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deletePersonnel: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('personnel')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchPersonnel();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));