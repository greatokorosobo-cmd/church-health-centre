import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Get actual columns
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .limit(1)
  
  return res.status(200).json({ 
    columns: data ? Object.keys(data[0] || {}) : [],
    sample: data?.[0],
    error: error?.message 
  })
}