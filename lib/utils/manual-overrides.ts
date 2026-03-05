/**
 * Manual Overrides Utilities
 * 
 * Track which fields have been manually edited in Bikerfun dashboard
 * to prevent WooCommerce sync from overwriting them
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Get list of fields that have been manually overridden
 */
export async function getManualOverrides(
  tableName: 'occasions' | 'webshop_products',
  recordId: string
): Promise<string[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from(tableName)
    .select('manual_overrides')
    .eq('id', recordId)
    .single();
  
  if (error) {
    console.error('Error fetching manual overrides:', error);
    return [];
  }
  
  return (data as any)?.manual_overrides || [];
}

/**
 * Add a field to manual overrides
 */
export async function addManualOverride(
  tableName: 'occasions' | 'webshop_products',
  recordId: string,
  fieldName: string
): Promise<boolean> {
  const supabase = createClient();
  
  // Get current overrides
  const currentOverrides = await getManualOverrides(tableName, recordId);
  
  // Add field if not already present
  if (!currentOverrides.includes(fieldName)) {
    const newOverrides = [...currentOverrides, fieldName];
    
    const { error } = await (supabase as any)
      .from(tableName)
      .update({ manual_overrides: newOverrides })
      .eq('id', recordId);
    
    if (error) {
      console.error('Error adding manual override:', error);
      return false;
    }
  }
  
  return true;
}

/**
 * Add multiple fields to manual overrides
 */
export async function addManualOverrides(
  tableName: 'occasions' | 'webshop_products',
  recordId: string,
  fieldNames: string[]
): Promise<boolean> {
  const supabase = createClient();
  
  // Get current overrides
  const currentOverrides = await getManualOverrides(tableName, recordId);
  
  // Add fields that aren't already present
  const newFields = fieldNames.filter(field => !currentOverrides.includes(field));
  
  if (newFields.length > 0) {
    const newOverrides = [...currentOverrides, ...newFields];
    
    const { error } = await (supabase as any)
      .from(tableName)
      .update({ manual_overrides: newOverrides })
      .eq('id', recordId);
    
    if (error) {
      console.error('Error adding manual overrides:', error);
      return false;
    }
  }
  
  return true;
}

/**
 * Remove a field from manual overrides (reset to WooCommerce)
 */
export async function removeManualOverride(
  tableName: 'occasions' | 'webshop_products',
  recordId: string,
  fieldName: string
): Promise<boolean> {
  const supabase = createClient();
  
  // Get current overrides
  const currentOverrides = await getManualOverrides(tableName, recordId);
  
  // Remove field if present
  if (currentOverrides.includes(fieldName)) {
    const newOverrides = currentOverrides.filter(f => f !== fieldName);
    
    const { error } = await (supabase as any)
      .from(tableName)
      .update({ manual_overrides: newOverrides })
      .eq('id', recordId);
    
    if (error) {
      console.error('Error removing manual override:', error);
      return false;
    }
  }
  
  return true;
}

/**
 * Clear all manual overrides (reset all to WooCommerce)
 */
export async function clearManualOverrides(
  tableName: 'occasions' | 'webshop_products',
  recordId: string
): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await (supabase as any)
    .from(tableName)
    .update({ manual_overrides: [] })
    .eq('id', recordId);
  
  if (error) {
    console.error('Error clearing manual overrides:', error);
    return false;
  }
  
  return true;
}

/**
 * Detect which fields have changed compared to original
 */
export function detectChangedFields<T extends Record<string, any>>(
  original: T,
  updated: T,
  fieldsToTrack: string[]
): string[] {
  const changedFields: string[] = [];
  
  fieldsToTrack.forEach(field => {
    const originalValue = original[field];
    const updatedValue = updated[field];
    
    // Handle different types of comparison
    if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
      // Array comparison
      if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changedFields.push(field);
      }
    } else if (typeof originalValue === 'object' && typeof updatedValue === 'object') {
      // Object comparison
      if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changedFields.push(field);
      }
    } else {
      // Primitive comparison
      if (originalValue !== updatedValue) {
        changedFields.push(field);
      }
    }
  });
  
  return changedFields;
}
