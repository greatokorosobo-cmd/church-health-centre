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

  const { patient_id, full_name, phone, email, date, time_slot, reason } = req.body

  if (!full_name || !phone || !date || !time_slot) {
    return res.status(400).json({ error: 'Name, phone, date, and time slot are required' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Check if slot is available
  const { data: existingSlot } = await supabase
    .from('time_slots')
    .select('id')
    .eq('slot_date', date)
    .eq('slot_time', time_slot)
    .eq('is_available', true)
    .single()

  if (!existingSlot) {
    return res.status(409).json({ 
      error: 'This time slot is not available. Please select another time.',
      taken: true 
    })
  }

  // Create appointment and mark slot as unavailable
  const reference_number = generateReference()
  
  const { data: aptData, error: aptError } = await supabase
    .from('appointments')
    .insert([{
      patient_name: full_name,
      phone,
      email: email || '',
      date,
      time_slot,
      reason: reason || '',
      status: 'pending'
    }])
    .select()
    .single()

  if (aptError) {
    console.error('Appointment error:', aptError)
    return res.status(500).json({ error: 'Booking failed. Please try again.' })
  }

  // Mark slot as unavailable
  await supabase
    .from('time_slots')
    .update({ is_available: false })
    .eq('slot_date', date)
    .eq('slot_time', time_slot)

  function formatTime(time) {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return res.status(201).json({
    success: true,
    reference_number,
    appointment: {
      id: aptData.id,
      date,
      time: formatTime(time_slot),
      status: 'pending'
    },
    message: `Booking submitted! Your reference: ${reference_number}. Wait for confirmation.`
  })
}