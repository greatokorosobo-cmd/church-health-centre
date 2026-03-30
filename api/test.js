import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .limit(1)
    
    if (error) {
      return res.status(200).json({ 
        error: error.message,
        hint: error.hint,
        details: error
      })
    }
    
    return res.status(200).json({ success: true, data })
  } catch (e) {
    return res.status(200).json({ error: e.message })
  }
}
