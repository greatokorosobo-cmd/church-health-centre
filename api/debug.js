import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data, error } = await supabase
      .from('appointments')
      .select('id, appointment_time')
      .eq('appointment_date', '2026-04-02')
      .neq('status', 'rejected')
    
    if (error) {
      return res.status(200).json({ 
        error: error.message,
        details: error.details,
        hint: error.hint
      })
    }
    
    return res.status(200).json({ 
      success: true, 
      appointments: data 
    })
  } catch (err) {
    return res.status(200).json({ 
      error: err.message,
      stack: err.stack
    })
  }
}
