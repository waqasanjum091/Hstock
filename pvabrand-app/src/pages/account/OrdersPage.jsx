import { useQuery } from '@tanstack/react-query'
import { orderService } from '../../services/orderService'
import { Link } from 'react-router-dom'
// Link kept for "Continue Shopping" button

export default function OrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderService.getMyOrders,
    retry: 1,
  })

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>
  if (isError) return <div className="p-8 text-red-600">Failed to load orders.</div>

  const orders = data?.data || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">No orders yet</p>
          <Link to="/marketplace" className="text-orange-600 hover:text-orange-700">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-600 mb-2"><strong>Items:</strong> {order.items?.length || 0}</p>
                <p className="text-gray-600"><strong>Total:</strong> ${(parseFloat(order.total) || 0).toFixed(2)}</p>
                {order.tracking_number && (
                  <p className="text-gray-600 mt-1"><strong>Tracking:</strong> {order.tracking_number}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}