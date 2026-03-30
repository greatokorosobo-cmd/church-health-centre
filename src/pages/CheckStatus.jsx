import { useState } from 'react'
import { appointmentsAPI } from '../lib/api'

export default function CheckStatus() {
  const [reference, setReference] = useState('')
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const searchBooking = async () => {
    if (!reference) return
    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const { appointment: data } = await appointmentsAPI.getStatus(reference)
      setAppointment(data)
    } catch (err) {
      setError(err.message || 'Booking not found. Check your reference number.')
      setAppointment(null)
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-green-600 mb-8 text-center">Check Booking Status</h2>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="Enter your reference number (e.g., CHC-XXXXXX)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
          />
          <button
            onClick={searchBooking}
            disabled={loading || !reference}
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

      {appointment && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-mono font-bold text-green-600">{appointment.reference_number}</span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Patient Name</span>
              <span className="font-semibold">{appointment.patient_name}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Phone</span>
              <span className="font-semibold">{appointment.phone}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Appointment Date</span>
              <span className="font-semibold">{appointment.date}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Appointment Time</span>
              <span className="font-semibold">{appointment.time}</span>
            </div>
            {appointment.reason && (
              <div className="py-3">
                <span className="text-gray-600 block mb-2">Reason</span>
                <p className="bg-gray-50 p-3 rounded-lg">{appointment.reason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!searched && (
        <p className="text-center text-gray-500">
          Enter your reference number to check your booking status
        </p>
      )}
    </div>
  )
}