import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function CustomerLayout() {
  const navigate = useNavigate()
  const { logout } = useApp()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8">My Account</h2>
        <nav className="space-y-2">
          <Link to="/account" className="block px-4 py-2 rounded hover:bg-gray-800">Dashboard</Link>
          <Link to="/account/orders" className="block px-4 py-2 rounded hover:bg-gray-800">Orders</Link>
          <Link to="/account/disputes" className="block px-4 py-2 rounded hover:bg-gray-800">Disputes</Link>
          <Link to="/account/messages" className="block px-4 py-2 rounded hover:bg-gray-800">Messages</Link>
          <Link to="/account/wishlist" className="block px-4 py-2 rounded hover:bg-gray-800">Wishlist</Link>
          <Link to="/account/addresses" className="block px-4 py-2 rounded hover:bg-gray-800">Addresses</Link>
          <Link to="/" className="block px-4 py-2 rounded hover:bg-gray-800">Shop</Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 text-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
