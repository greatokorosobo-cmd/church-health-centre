const API_BASE = '/api'

async function fetchAPI(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

// Auth
export const authAPI = {
  login: (email, password) => 
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  logout: (token) =>
    fetchAPI('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  getSession: (token) =>
    fetchAPI('/auth/session', {
      headers: { Authorization: `Bearer ${token}` }
    })
}

// Patients
export const patientsAPI = {
  register: (patientData) =>
    fetchAPI('/patients/register', {
      method: 'POST',
      body: JSON.stringify(patientData)
    }),
  
  search: (phone) =>
    fetchAPI(`/patients/search?phone=${encodeURIComponent(phone)}`)
}

// Appointments
export const appointmentsAPI = {
  book: (bookingData, token) =>
    fetchAPI('/appointments/book', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(bookingData)
    }),
  
  getSlots: (date) =>
    fetchAPI(`/appointments/slots?date=${encodeURIComponent(date)}`),
  
  getStatus: (reference) =>
    fetchAPI(`/appointments/status?reference=${encodeURIComponent(reference)}`),
  
  list: (token, filters = {}) => {
    const params = new URLSearchParams(filters)
    return fetchAPI(`/appointments/list?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },
  
  update: (appointmentId, status, token) =>
    fetchAPI('/appointments/update', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ appointment_id: appointmentId, status })
    })
}
