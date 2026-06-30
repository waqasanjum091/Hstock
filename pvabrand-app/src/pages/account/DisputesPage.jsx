import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { disputeService, DISPUTE_TYPES, DISPUTE_STATUS_STYLES } from '../../services/disputeService'
import { orderService } from '../../services/orderService'

export default function CustomerDisputesPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ order_id: '', product_name: '', type: 'wrong_account', description: '' })

  const { data: disputeData, isLoading } = useQuery({
    queryKey: ['my-disputes'],
    queryFn: disputeService.getMine,
  })
  const { data: orderData } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderService.getMyOrders,
  })

  const disputes = disputeData?.data || []
  const orders = orderData?.data || []
  const selectedOrder = orders.find((o) => o.id === form.order_id)

  const createMutation = useMutation({
    mutationFn: disputeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-disputes'] })
      setForm({ order_id: '', product_name: '', type: 'wrong_account', description: '' })
      toast.success('Dispute submitted. The vendor has been notified.')
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to submit dispute'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.order_id || !form.description.trim()) return toast.error('Pick an order and describe the issue')
    createMutation.mutate(form)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Disputes & Issues</h1>
      <p className="text-gray-500 mb-8">Got the wrong account or a problem with an order? Report it here and the vendor will fix it.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* New dispute */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-lg font-bold mb-4">Report an Issue</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={form.order_id}
                onChange={(e) => setForm({ ...form, order_id: e.target.value, product_name: '' })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                <option value="">Select an order…</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.order_number} — ${(parseFloat(o.total) || 0).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {selectedOrder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select
                  value={form.product_name}
                  onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                >
                  <option value="">All items in order</option>
                  {selectedOrder.items?.map((it, i) => (
                    <option key={i} value={it.product_name}>{it.product_name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                {DISPUTE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Describe the problem</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="e.g. The Instagram account login does not work / I received different credentials than ordered."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Submitting…' : 'Submit Dispute'}
            </button>
          </form>
        </div>

        {/* My disputes */}
        <div>
          <h2 className="text-lg font-bold mb-4">My Disputes ({disputes.length})</h2>
          {isLoading ? (
            <p className="text-gray-400">Loading…</p>
          ) : disputes.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">No disputes filed.</div>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => (
                <div key={d.id} className="bg-white p-5 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{d.product_name || 'Order issue'}</p>
                      <p className="text-xs text-gray-500">
                        #{d.dispute_number} · {d.vendorId?.store_name || 'Vendor'} · {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${DISPUTE_STATUS_STYLES[d.status]}`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{d.description}</p>
                  {d.resolution_note && (
                    <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">Vendor response</p>
                      <p className="text-sm text-gray-700">{d.resolution_note}</p>
                      {d.corrected_details && (
                        <p className="text-sm text-gray-800 mt-2 font-mono bg-white border border-green-100 rounded p-2 break-words">
                          {d.corrected_details}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
