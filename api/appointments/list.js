import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify staff authentication
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.slice(7)
  
  // Verify the token with Supabase Auth
  const supabaseAuth = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY)
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  // Get filter from query params
  const { status = 'all', date = null } = req.query

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  let query = supabase
    .from('appointments')
    .select(`
      id,
      appointment_date,
      appointment_time,
      status,
      notes,
      reference_number,
      created_at,
      updated_at,
      patients (
        id,
        full_name,
        phone,
        email,
        date_of_birth,
        gender,
        address
      )
    `)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (date) {
    query = query.eq('appointment_date', date)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Failed to fetch appointments' })
  }

  // Format the response
  const appointments = (data || []).map(apt => ({
    id: apt.id,
    appointment_date: apt.appointment_date,
    appointment_time: apt.appointment_time,
    status: apt.status,
    notes: apt.notes,
    reference_number: apt.reference_number,
    created_at: apt.created_at,
    updated_at: apt.updated_at,
    patient: apt.patients ? {
      id: apt.patients.id,
      full_name: apt.patients.full_name,
      phone: apt.patients.phone,
      email: apt.patients.email,
      date_of_birth: apt.patients.date_of_birth,
      gender: apt.patients.gender,
      address: apt.patients.address
    } : null
  }))

  return res.status(200).json({ appointments })
}
