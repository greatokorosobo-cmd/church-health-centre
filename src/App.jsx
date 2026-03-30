import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import BookAppointment from './pages/BookAppointment'
import CheckStatus from './pages/CheckStatus'
import StaffLogin from './pages/StaffLogin'
import StaffDashboard from './pages/StaffDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-green-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Church Health Centre</h1>
              <div className="flex gap-4 text-sm">
                <a href="/" className="hover:underline">Home</a>
                <a href="/register" className="hover:underline">Register</a>
                <a href="/book" className="hover:underline">Book</a>
                <a href="/check-status" className="hover:underline">Check Status</a>
                <a href="/staff" className="hover:underline">Staff</a>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/check-status" element={<CheckStatus />} />
          <Route path="/staff" element={<StaffLogin />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
