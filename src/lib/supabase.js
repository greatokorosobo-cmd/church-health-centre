import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hxtiphtcerrisfuyaxvi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dGlwaHRjZXJyaXNmdXlheHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTU0NDMsImV4cCI6MjA5MDM5MTQ0M30.zIMDA5ZZQFV8rHXWyGjMGjveU5ZiTwpKQYQB4mgZttI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
]

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}
