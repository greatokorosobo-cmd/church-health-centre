import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { full_name, phone, email, date_of_birth, gender, address } = req.body

  // Validate required fields
  if (!full_name || !phone || !email || !date_of_birth || !gender || !address) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  // Validate phone format (Nigerian)
  const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' })
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  // Validate date of birth (must be in the past)
  const dob = new Date(date_of_birth)
  if (dob >= new Date()) {
    return res.status(400).json({ error: 'Date of birth must be in the past' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Check if patient already exists by phone
  const { data: existing } = await supabase
    .from('patients')
    .select('id, phone')
    .eq('phone', phone)
    .single()

  if (existing) {
    return res.status(409).json({ error: 'Patient with this phone number already exists', patient_id: existing.id })
  }

  // Insert new patient
  const { data, error } = await supabase
    .from('patients')
    .insert([{ full_name, phone, email, date_of_birth, gender, address }])
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Registration failed. Please try again.' })
  }

  return res.status(201).json({ 
    success: true, 
    patient_id: data.id,
    message: 'Registration successful' 
  })
}
