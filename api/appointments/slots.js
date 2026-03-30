import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
]

function formatTime(time) {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { date } = req.query

  if (!date) {
    return res.status(400).json({ error: 'Date is required' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('appointment_date', date)
    .neq('status', 'rejected')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const bookedSlots = (data || []).map(a => a.appointment_time)
  
  const slots = TIME_SLOTS.map(time => ({
    time,
    display: formatTime(time),
    available: !bookedSlots.includes(time)
  }))

  return res.status(200).json({ date, slots, booked: bookedSlots })
}