export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Welcome to Church Health Centre
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Quality Healthcare for Our Community
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/register"
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Register as Patient
          </a>
          <a
            href="/book"
            className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Book Appointment
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
          <p className="text-gray-600">Book your appointment online in just a few clicks</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">👨‍�‍️️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Qualified Staff</h3>
          <p className="text-gray-600">Professional healthcare providers ready to help</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⏰</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Real-time Slots</h3>
          <p className="text-gray-600">See available time slots and book instantly</p>
        </div>
      </div>

      <div className="mt-16 bg-green-50 p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Our Services</h2>
        <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> General Consultation
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Laboratory Services
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Maternal & Child Health
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Pharmacy
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Health Education
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Emergency Care
          </li>
        </ul>
      </div>
    </div>
  )
}
