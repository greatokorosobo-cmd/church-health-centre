import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { status = 'all', date = null } = req.query

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  let query = supabase
    .from('appointments')
    .select('id, patient_name, phone, email, date, time_slot, reason, status, reference_number, created_at, updated_at')
    .order('date', { ascending: true })
    .order('time_slot', { ascending: true })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (date) {
    query = query.eq('date', date)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Failed to fetch appointments' })
  }

  const appointments = (data || []).map(apt => ({
    id: apt.id,
    patient_name: apt.patient_name,
    phone: apt.phone,
    email: apt.email,
    appointment_date: apt.date,
    appointment_time: apt.time_slot,
    reason: apt.reason,
    status: apt.status,
    reference_number: apt.reference_number,
    created_at: apt.created_at,
    updated_at: apt.updated_at
  }))

  return res.status(200).json({ appointments })
}