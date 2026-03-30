export default function handler(req, res) {
  return res.status(200).json({ 
    url: process.env.SUPABASE_URL || 'MISSING',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    anonKey: process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
  })
}
