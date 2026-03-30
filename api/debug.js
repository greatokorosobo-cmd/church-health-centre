import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Try different column names
  const tests = await Promise.all([
    supabase.from('appointments').select('*').limit(1),
    supabase.from('patients').select('*').limit(1),
  ])
  
  const results = tests.map((r, i) => ({
    table: ['appointments', 'patients'][i],
    success: !r.error,
    columns: r.data?.length ? Object.keys(r.data[0]) : null,
    error: r.error?.message
  }))
  
  return res.status(200).json(results)
}