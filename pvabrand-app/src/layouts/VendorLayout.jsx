import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useApp } from '../context/AppContext'
import api from '../services/api'
import DashboardLayout from './DashboardLayout'

const links = [
  { to: '/vendor', label: '📊 Dashboard', end: true },
  { to: '/vendor/products', label: '📦 Products' },
  { to: '/vendor/orders', label: '📋 Orders' },
  { to: '/vendor/disputes', label: '⚠️ Disputes' },
  { to: '/vendor/messages', label: '💬 Messages' },
  { to: '/vendor/profile', label: '🏪 Store Profile' },
]

export default function VendorLayout() {
  const location = useLocation()
  const { user } = useApp()

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['vendor-profile-layout'],
    queryFn: () => api.get('/vendor-profile').then((r) => r.data).catch(() => null),
    retry: false,
    staleTime: 30000,
  })

  const hasProfile = profileData && !profileData?.message
  const isApproved = hasProfile && profileData?.is_approved
  const onProfilePage = location.pathname === '/vendor/profile'

  const banner = !isLoading && !isApproved && !onProfilePage ? (
    <div
      className={`p-4 text-sm font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
        !hasProfile
          ? 'bg-orange-50 border-b border-orange-200 text-orange-800'
          : 'bg-yellow-50 border-b border-yellow-200 text-yellow-800'
      }`}
    >
      <span>
        {!hasProfile
          ? '⚠️ You have not created your store profile yet.'
          : '⏳ Your store is pending admin approval. You cannot add products until approved.'}
      </span>
      <Link
        to="/vendor/profile"
        className="self-start sm:ml-4 bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 whitespace-nowrap"
      >
        {!hasProfile ? 'Create Profile' : 'View Profile'}
      </Link>
    </div>
  ) : null

  return <DashboardLayout title="Vendor Panel" subtitle={user?.name} links={links} banner={banner} />
}
