import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { LineChart, BarChart, DonutChart } from '../../components/charts/Charts'

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminService.getDashboard,
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Failed to load dashboard data.</p>
          <p className="text-red-500 text-sm mt-1">{error?.response?.data?.message || 'Please check your connection and try again.'}</p>
        </div>
      </div>
    )
  }

  const stats = data?.stats || {}

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats.totalUsers ?? 0, icon: '👥', color: 'text-blue-600' },
          { label: 'Total Vendors', value: stats.totalVendors ?? 0, icon: '🏪', color: 'text-purple-600' },
          { label: 'Total Products', value: stats.totalProducts ?? 0, icon: '📦', color: 'text-green-600' },
          { label: 'Total Orders', value: stats.totalOrders ?? 0, icon: '📋', color: 'text-yellow-600' },
          { label: 'Pending Orders', value: stats.pendingOrders ?? 0, icon: '⏳', color: 'text-orange-600' },
          { label: 'Open Disputes', value: stats.openDisputes ?? 0, icon: '⚠️', color: 'text-red-600' },
          { label: 'Total Revenue', value: `$${(parseFloat(stats.totalRevenue) || 0).toFixed(2)}`, icon: '💰', color: 'text-orange-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8">
        <LineChart
          title="Revenue — Last 12 Months"
          subtitle="Paid orders, monthly"
          data={data?.monthlyRevenue || []}
          formatY={(v) => `$${v}`}
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <BarChart title="Orders by Status" data={data?.ordersByStatus || []} />
        <DonutChart title="Users by Role" data={data?.usersByRole || []} />
      </div>

      {data?.recentOrders?.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Order #</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">#{order.order_number}</td>
                    <td className="px-4 py-2">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-2">${(parseFloat(order.total) || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.pendingVendors?.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">⏳ Pending Vendor Approvals ({data.pendingVendors.length})</h2>
          <div className="space-y-3">
            {data.pendingVendors.map((vendor) => (
              <div key={vendor.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">{vendor.store_name}</p>
                  <p className="text-sm text-gray-500">{vendor.user?.email}</p>
                </div>
                <a href="/admin/vendors" className="text-orange-600 text-sm hover:underline">Review →</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
