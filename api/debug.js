import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .not('table_name', 'like', '%_batch_%')
    
    if (tablesError) {
      return res.status(200).json({ tablesError: tablesError.message })
    }
    
    // Check columns of appointments if it exists
    let appointmentsColumns = null
    const aptTable = tables?.find(t => t.table_name === 'appointments')
    if (aptTable) {
      const { data: cols, error: colsError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'appointments')
        .eq('table_schema', 'public')
      
      if (!colsError) {
        appointmentsColumns = cols
      }
    }
    
    return res.status(200).json({ 
      tables: tables?.map(t => t.table_name),
      appointmentsColumns
    })
  } catch (e) {
    return res.status(200).json({ catch_error: e.message })
  }
}