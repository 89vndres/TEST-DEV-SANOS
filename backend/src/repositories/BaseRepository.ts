import { SupabaseClient } from '@supabase/supabase-js';
import SupabaseConfig from '../config/supabase';

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

export abstract class BaseRepository<T extends { id?: number }> implements IRepository<T> {
  protected supabase: SupabaseClient;
  protected tableName: string;

  constructor(tableName: string, supabaseClient?: SupabaseClient) {
    this.tableName = tableName;
    this.supabase = supabaseClient || SupabaseConfig.getClient();
  }

  async findAll(): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(`Error fetching ${this.tableName}: ${error.message}`);
    return (data as T[]) || [];
  }

  async findById(id: number): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching ${this.tableName} by id: ${error.message}`);
    }
    return data as T;
  }

  async create(entity: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(entity as any)
      .select()
      .single();

    if (error) throw new Error(`Error creating ${this.tableName}: ${error.message}`);
    return data as T;
  }

  async update(id: number, entity: Partial<T>): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(entity as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error updating ${this.tableName}: ${error.message}`);
    return data as T;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Error deleting ${this.tableName}: ${error.message}`);
    return true;
  }
}
