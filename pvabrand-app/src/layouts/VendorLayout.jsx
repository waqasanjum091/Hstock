import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useApp } from '../context/AppContext'
import api from '../services/api'

export default function VendorLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useApp()

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['vendor-profile-layout'],
    queryFn: () => api.get('/vendor-profile').then((r) => r.data).catch(() => null),
    retry: false,
    staleTime: 30000,
  })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-orange-600 text-white'
      : 'text-gray-300 hover:bg-gray-800'

  // No profile yet — only allow access to /vendor/profile
  const hasProfile = profileData && !profileData?.message
  const isApproved = hasProfile && profileData?.is_approved
  const onProfilePage = location.pathname === '/vendor/profile'

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-orange-400">Vendor Panel</h2>
          <p className="text-xs text-gray-400 mt-1 truncate">{user?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link to="/vendor" className={`block px-4 py-2 rounded text-sm ${isActive('/vendor')}`}>
            📊 Dashboard
          </Link>
          <Link to="/vendor/products" className={`block px-4 py-2 rounded text-sm ${isActive('/vendor/products')}`}>
            📦 Products
          </Link>
          <Link to="/vendor/orders" className={`block px-4 py-2 rounded text-sm ${isActive('/vendor/orders')}`}>
            📋 Orders
          </Link>
          <Link to="/vendor/disputes" className={`block px-4 py-2 rounded text-sm ${isActive('/vendor/disputes')}`}>
            ⚠️ Disputes
          </Link>
          <Link to="/vendor/messages" className={`block px-4 py-2 rounded text-sm ${isActive('/vendor/messages')}`}>
            💬 Messages
          </Link>
          <Link to="/vendor/profile" className={`block px-4 py-2 rounded text-sm ${isActive('/vendor/profile')}`}>
            🏪 Store Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded text-sm text-red-400 hover:bg-gray-800"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {/* Approval status banner */}
        {!isLoading && !isApproved && !onProfilePage && (
          <div className={`p-4 text-sm font-medium flex items-center justify-between ${
            !hasProfile
              ? 'bg-orange-50 border-b border-orange-200 text-orange-800'
              : 'bg-yellow-50 border-b border-yellow-200 text-yellow-800'
          }`}>
            <span>
              {!hasProfile
                ? '⚠️ You have not created your store profile yet.'
                : '⏳ Your store is pending admin approval. You cannot add products until approved.'}
            </span>
            <Link
              to="/vendor/profile"
              className="ml-4 bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
            >
              {!hasProfile ? 'Create Profile' : 'View Profile'}
            </Link>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
