import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function StaffDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const session = localStorage.getItem('staff_session')
    if (!session) {
      navigate('/staff')
      return
    }
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setAppointments(data || [])
    } catch (err) {
      console.error('Error fetching appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setAppointments(appointments.map(apt =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      ))
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('staff_session')
    navigate('/staff')
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Approved</span>
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Pending</span>
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Rejected</span>
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); fetchAppointments(); }}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No appointments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{apt.patient_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{apt.phone}</div>
                      <div className="text-sm text-gray-500">{apt.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{formatDate(apt.date)}</div>
                      <div className="text-sm text-gray-500">{apt.time_slot}</div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(apt.status)}</td>
                    <td className="px-4 py-3">
                      {apt.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(apt.id, 'approved')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(apt.id, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
