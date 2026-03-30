import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { reference } = req.query

  if (!reference) {
    return res.status(400).json({ error: 'Reference number is required' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('appointments')
    .select('id, patient_name, phone, email, date, time_slot, reason, status, reference_number, created_at')
    .eq('reference_number', reference)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Appointment not found with this reference number' })
    }
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Failed to fetch appointment status' })
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return res.status(200).json({
    appointment: {
      id: data.id,
      reference_number: data.reference_number,
      patient_name: data.patient_name,
      phone: data.phone,
      email: data.email,
      date: formatDate(data.date),
      time: formatTime(data.time_slot),
      status: data.status,
      reason: data.reason,
      created_at: data.created_at
    }
  })
}