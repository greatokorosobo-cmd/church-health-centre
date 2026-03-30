import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Time slots from 9 AM to 5 PM
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
]

function generateReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'CHC-'
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}

function formatTime(time) {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { patient_id, appointment_date, appointment_time, notes } = req.body

  // Validate required fields
  if (!patient_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'Patient ID, date, and time are required' })
  }

  // Validate time slot
  if (!TIME_SLOTS.includes(appointment_time)) {
    return res.status(400).json({ error: 'Invalid time slot' })
  }

  // Validate date is not in the past
  const selectedDate = new Date(appointment_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (selectedDate < today) {
    return res.status(400).json({ error: 'Cannot book appointments in the past' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Check if patient exists
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patient_id)
    .single()

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' })
  }

  // Check if slot is already taken
  const { data: existing } = await supabase
    .from('appointments')
    .select('id')
    .eq('appointment_date', appointment_date)
    .eq('appointment_time', appointment_time)
    .neq('status', 'rejected')
    .single()

  if (existing) {
    return res.status(409).json({ 
      error: 'This time slot is already booked. Please select another time.',
      taken: true 
    })
  }

  // Create appointment
  const reference_number = generateReference()
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      patient_id,
      appointment_date,
      appointment_time,
      notes: notes || null,
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
      date: appointment_date,
      time: formatTime(appointment_time),
      status: 'pending'
    },
    message: `Booking submitted! Your reference: ${reference_number}. Wait for confirmation.`
  })
}
