import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone } = req.query

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('patients')
    .select('id, full_name, phone, email, date_of_birth, gender, address, created_at')
    .eq('phone', phone)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Patient not found. Please register first.' })
    }
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Search failed. Please try again.' })
  }

  return res.status(200).json({ patient: data })
}
