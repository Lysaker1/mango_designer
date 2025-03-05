import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get and update the total revenue
 * @param newRevenue Amount to add to total (0 to just retrieve)
 * @returns The updated total revenue
 */
export async function getAndUpdateTotalRevenue(newRevenue: number = 0) {
  // Get current total revenue
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'total_revenue')
    .single();
  
  if (error) {
    console.error('Error getting total revenue:', error);
    // Initialize if doesn't exist
    await supabase.from('settings').insert([
      { key: 'total_revenue', value: newRevenue.toString() }
    ]);
    return newRevenue;
  }
  
  // Calculate new total
  const currentTotal = parseFloat(data.value);
  const newTotal = currentTotal + newRevenue;
  
  // Only update if we're adding revenue
  if (newRevenue > 0) {
    await supabase
      .from('settings')
      .update({ value: newTotal.toString() })
      .eq('key', 'total_revenue');
  }
  
  return newTotal;
} 