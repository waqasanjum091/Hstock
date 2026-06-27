import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useApp()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-800">Dashboard</Link>
          <Link to="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-800">Users</Link>
          <Link to="/admin/vendors" className="block px-4 py-2 rounded hover:bg-gray-800">Vendors</Link>
          <Link to="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-800">Products</Link>
          <Link to="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-800">Orders</Link>
          <Link to="/admin/banners" className="block px-4 py-2 rounded hover:bg-gray-800">Banners</Link>
          <Link to="/admin/inquiries" className="block px-4 py-2 rounded hover:bg-gray-800">Inquiries</Link>
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
