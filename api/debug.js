import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', '2026-04-02')
      .neq('status', 'rejected')
    
    if (error) {
      return res.status(200).json({ 
        error: error.message,
        details: error.details,
        hint: error.hint
      })
    }
    
    return res.status(200).json({ slots: data })
  } catch (e) {
    return res.status(200).json({ 
      catch_error: e.message,
      supabaseUrl: supabaseUrl ? 'present' : 'missing',
      supabaseServiceKey: supabaseServiceKey ? 'present' : 'missing'
    })
  }
}
