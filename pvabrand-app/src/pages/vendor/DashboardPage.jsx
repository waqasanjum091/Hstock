import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../services/api'


export default function VendorDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendor-stats'],
    queryFn: () => api.get('/vendor/stats').then((r) => r.data),
    retry: false,
  })

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['vendor-profile-check'],
    queryFn: () => api.get('/me').then((r) => r.data),
    retry: false,
  })

  if (isLoading || profileLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Vendor has no profile yet — prompt to create one
  if (isError) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h2 className="text-xl font-bold mb-2">Set Up Your Store First</h2>
          <p className="text-gray-600 mb-6">
            You need to create your store profile before you can manage products and orders.
          </p>
          <Link
            to="/vendor/profile"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700"
          >
            Create Store Profile →
          </Link>
        </div>
      </div>
    )
  }

  const stats = data?.stats || {}

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Products', value: stats.totalProducts ?? 0, icon: '📦' },
          { label: 'Total Orders', value: stats.totalOrders ?? 0, icon: '📋' },
          { label: 'Total Revenue', value: `$${(parseFloat(stats.totalRevenue) || 0).toFixed(2)}`, icon: '💰' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-orange-600">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/vendor/products" className="p-4 border rounded hover:bg-orange-50 block">
            <p className="font-bold">📦 Manage Products</p>
            <p className="text-sm text-gray-600">Add, edit, or remove products</p>
          </Link>
          <Link to="/vendor/orders" className="p-4 border rounded hover:bg-orange-50 block">
            <p className="font-bold">📋 View Orders</p>
            <p className="text-sm text-gray-600">Manage order fulfillment</p>
          </Link>
          <Link to="/vendor/profile" className="p-4 border rounded hover:bg-orange-50 block">
            <p className="font-bold">🏪 Store Profile</p>
            <p className="text-sm text-gray-600">Update store information</p>
          </Link>
        </div>
      </div>

      {data?.recentOrders?.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {data.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">#{order.order_number}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
