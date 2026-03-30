export default async function handler(req, res) {
  return res.status(200).json({ 
    url: process.env.SUPABASE_URL ? 'set' : 'missing',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY ? 'set' : 'missing',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing'
  })
}
