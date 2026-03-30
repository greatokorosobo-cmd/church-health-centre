import { useState } from 'react'
import { patientsAPI, appointmentsAPI } from '../lib/api'

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
]

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export default function BookAppointment() {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [patientFound, setPatientFound] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const [bookingData, setBookingData] = useState({
    appointment_date: '',
    appointment_time: '',
    notes: ''
  })
  const [bookedSlots, setBookedSlots] = useState([])

  const minDate = new Date().toISOString().split('T')[0]

  const fetchBookedSlots = async (date) => {
    try {
      const { slots } = await appointmentsAPI.getSlots(date)
      setBookedSlots(slots.filter(s => !s.available).map(s => s.time))
    } catch (err) {
      console.error('Error fetching slots:', err)
    }
  }

  const searchPatient = async () => {
    if (!phone) return
    setLoading(true)
    setError(null)
    setPatientFound(null)

    try {
      const { patient } = await patientsAPI.search(phone)
      setPatientFound(patient)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Patient not found. Please register first.')
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date) => {
    setBookingData({ ...bookingData, appointment_date: date, appointment_time: '' })
    if (date) {
      fetchBookedSlots(date)
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await appointmentsAPI.book({
        patient_id: patientFound.id,
        appointment_date: bookingData.appointment_date,
        appointment_time: bookingData.appointment_time,
        notes: bookingData.notes
      })
      setMessage(result.message || `Booking submitted! Your reference: ${result.reference_number}. Wait for confirmation.`)
      setStep(3)
      setBookingData({ appointment_date: '', appointment_time: '', notes: '' })
    } catch (err) {
      setError(err.message || 'Booking failed. This slot may already be taken.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-green-600 mb-8 text-center">Book Appointment</h2>

      {message && (
        <div className="mb-6 p-6 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
          <p className="text-xl font-semibold mb-2">Booking Submitted!</p>
          <p className="text-lg">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Find Your Patient Record</h3>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={searchPatient}
              disabled={loading || !phone}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && patientFound && (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold">Welcome, {patientFound.full_name}!</p>
            <p className="text-sm text-gray-600">Phone: {patientFound.phone}</p>
          </div>

          <form onSubmit={handleBooking} className="bg-white shadow-lg rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date *</label>
              <input
                type="date"
                min={minDate}
                value={bookingData.appointment_date}
                onChange={(e) => handleDateChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {bookingData.appointment_date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time *</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot)
                    const isSelected = bookingData.appointment_time === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, appointment_time: slot })}
                        disabled={isBooked}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          isBooked
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-green-600 text-white'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {formatTime(slot)}
                        {isBooked && <span className="block text-xs">(Taken)</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                rows="3"
                placeholder="Any symptoms or concerns..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !bookingData.appointment_date || !bookingData.appointment_time}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <a
            href="/check-status"
            className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          >
            Check Booking Status
          </a>
        </div>
      )}
    </div>
  )
}
