import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function generateReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'CHC-'
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { patient_name, phone, email, date, time_slot, reason } = req.body

  if (!patient_name || !phone || !date || !time_slot) {
    return res.status(400).json({ error: 'Name, phone, date, and time are required' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Check for existing appointments at same date/time
  const { data: existing } = await supabase
    .from('appointments')
    .select('id')
    .eq('date', date)
    .eq('time_slot', time_slot)
    .neq('status', 'rejected')
    .single()

  if (existing) {
    return res.status(409).json({ 
      error: 'This time slot is already booked. Please select another time.',
      taken: true 
    })
  }

  const reference_number = generateReference()
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      patient_name,
      phone,
      email: email || null,
      date,
      time_slot,
      reason: reason || null,
      reference_number,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Booking failed. Please try again.' })
  }

  return res.status(201).json({
    success: true,
    reference_number,
    appointment: {
      id: data.id,
      date: data.date,
      time: data.time_slot,
      status: 'pending'
    },
    message: `Booking submitted! Your reference: ${reference_number}. Wait for confirmation.`
  })
}