import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../../services/orderService'
import { chatService } from '../../services/chatService'
import toast from 'react-hot-toast'

export default function VendorOrdersPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const messageCustomer = async (order) => {
    const customerId = order.user?.id || order.user?._id || order.userId?.id || order.userId
    if (!customerId) return toast.error('Customer not available')
    try {
      await chatService.startConversation({ participant_id: customerId })
      navigate('/vendor/messages')
    } catch {
      toast.error('Could not start conversation')
    }
  }
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: orderService.getVendorOrders,
    retry: 1,
  })

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) =>
      orderService.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-orders'] })
      toast.success('Order status updated')
    },
  })

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>
  if (isError) return <div className="p-8 text-red-600 bg-red-50 rounded-lg">Failed to load orders. Make sure your store profile exists.</div>

  const orders = data?.data || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No orders yet</p>
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
                <select
                  value={order.status}
                  onChange={(e) =>
                    statusMutation.mutate({
                      orderId: order.id,
                      status: e.target.value,
                    })
                  }
                  disabled={statusMutation.isPending}
                  className="px-3 py-1 border rounded font-medium disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Customer</p>
                    <p className="font-medium">{order.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Items</p>
                    <p className="font-medium">{order.items?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="font-bold text-orange-600">${(parseFloat(order.total) || 0).toFixed(2)}</p>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="text-sm text-gray-600">
                    <p><strong>Tracking:</strong> {order.tracking_number}</p>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => messageCustomer(order)}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
                  >
                    💬 Message Customer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}