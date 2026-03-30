import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { full_name, phone, email, date_of_birth, gender, blood_group, genotype, allergies } = req.body

  if (!full_name || !phone) {
    return res.status(400).json({ error: 'Full name and phone are required' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Check if patient exists by phone
  const { data: existing } = await supabase
    .from('patients')
    .select('id, phone')
    .eq('phone', phone)
    .single()

  if (existing) {
    return res.status(409).json({ error: 'Patient with this phone number already exists', patient_id: existing.id })
  }

  const { data, error } = await supabase
    .from('patients')
    .insert([{ 
      full_name, 
      phone, 
      email: email || null, 
      date_of_birth: date_of_birth || null,
      gender: gender || null,
      blood_group: blood_group || null,
      genotype: genotype || null,
      allergies: allergies || null
    }])
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