import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CheckStatus() {
  const [phone, setPhone] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const searchBookings = async () => {
    if (!phone) return
    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      setError('Error fetching bookings.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-green-600 mb-8 text-center">Check Booking Status</h2>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <div className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={searchBookings}
            disabled={loading || !phone}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">{booking.patient_name}</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(booking.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{booking.time_slot}</span>
                </div>
                {booking.reason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-medium">{booking.reason}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && bookings.length === 0 && !loading && (
        <p className="text-center text-gray-500">No bookings found for this phone number</p>
      )}
    </div>
  )
}
