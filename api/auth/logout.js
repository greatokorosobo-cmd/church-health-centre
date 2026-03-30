import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json({ success: true }) // Already logged out
  }

  const token = authHeader.slice(7)
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    // Don't fail - user wants to log out regardless
  }

  return res.status(200).json({ success: true })
}
