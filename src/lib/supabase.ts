import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper functions for common database operations
export const db = {
  // Departments
  departments: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (name: string) => {
      const { data, error } = await supabase
        .from('departments')
        .insert([{ name }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, name: string) => {
      const { data, error } = await supabase
        .from('departments')
        .update({ name })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Personnel
  personnel: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('personnel')
        .select(`
          *,
          department:departments(name),
          roles:personnel_roles(role),
          shifts:personnel_shifts(shift:shifts(*))
        `)
        .order('full_name');
      if (error) throw error;
      return data;
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('personnel')
        .select(`
          *,
          department:departments(name),
          roles:personnel_roles(role),
          shifts:personnel_shifts(shift:shifts(*))
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (personnel: Database['public']['Tables']['personnel']['Insert']) => {
      const { data, error } = await supabase
        .from('personnel')
        .insert([personnel])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, personnel: Database['public']['Tables']['personnel']['Update']) => {
      const { data, error } = await supabase
        .from('personnel')
        .update(personnel)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('personnel')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Equipment
  equipment: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          department:departments(name),
          photos:equipment_photos(url)
        `)
        .order('name');
      if (error) throw error;
      return data;
    },
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          department:departments(name),
          photos:equipment_photos(url)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    create: async (equipment: Database['public']['Tables']['equipment']['Insert']) => {
      const { data, error } = await supabase
        .from('equipment')
        .insert([equipment])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, equipment: Database['public']['Tables']['equipment']['Update']) => {
      const { data, error } = await supabase
        .from('equipment')
        .update(equipment)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  }
};