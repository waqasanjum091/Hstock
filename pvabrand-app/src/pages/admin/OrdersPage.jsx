import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../../services/orderService'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderService.getAllOrders(),
    retry: 1,
  })

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) =>
      orderService.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Order status updated')
    },
  })

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>
  if (isError) return <div className="p-8 text-red-600">Failed to load orders.</div>

  const orders = data?.data || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Order #</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold">#{order.order_number}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-sm text-gray-600">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">{order.items?.length || 0}</td>
                  <td className="px-6 py-4 font-bold text-orange-600">${(parseFloat(order.total) || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        statusMutation.mutate({
                          orderId: order.id,
                          status: e.target.value,
                        })
                      }
                      disabled={statusMutation.isPending}
                      className={`px-3 py-1 border rounded text-sm font-medium disabled:opacity-50 ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}