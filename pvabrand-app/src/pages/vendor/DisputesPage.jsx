import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { disputeService, DISPUTE_STATUS_STYLES } from '../../services/disputeService'

function RespondForm({ dispute, onDone }) {
  const queryClient = useQueryClient()
  const [resolution_note, setNote] = useState(dispute.resolution_note || '')
  const [corrected_details, setDetails] = useState(dispute.corrected_details || '')

  const mutation = useMutation({
    mutationFn: (data) => disputeService.respond(dispute.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-disputes'] })
      toast.success('Dispute updated')
      onDone?.()
    },
    onError: () => toast.error('Failed to update dispute'),
  })

  const submit = (status) => {
    if (!resolution_note.trim()) return toast.error('Add a response note first')
    mutation.mutate({ status, resolution_note, corrected_details })
  }

  return (
    <div className="mt-4 border-t pt-4 space-y-3">
      <textarea
        value={resolution_note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Reply to the customer — explain how you'll fix it…"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
      />
      <textarea
        value={corrected_details}
        onChange={(e) => setDetails(e.target.value)}
        rows={2}
        placeholder="Corrected account details / replacement credentials (optional)"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-orange-400"
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => submit('in_progress')} disabled={mutation.isPending}
          className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 disabled:opacity-50">
          Mark In Progress
        </button>
        <button onClick={() => submit('resolved')} disabled={mutation.isPending}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
          ✅ Resolve & Send Fix
        </button>
        <button onClick={() => submit('rejected')} disabled={mutation.isPending}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50">
          Reject
        </button>
      </div>
    </div>
  )
}

export default function VendorDisputesPage() {
  const [openId, setOpenId] = useState(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendor-disputes'],
    queryFn: disputeService.getForVendor,
    retry: false,
    refetchInterval: 15000,
  })

  if (isLoading) return <div className="p-8 text-gray-500">Loading disputes…</div>
  if (isError) return <div className="p-8 text-gray-500">Create your store profile to receive disputes.</div>

  const disputes = data?.data || []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Customer Disputes</h1>
        {data?.open_count > 0 && (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            {data.open_count} need attention
          </span>
        )}
      </div>
      <p className="text-gray-500 mb-8">Resolve issues your customers reported (e.g. wrong account delivered).</p>

      {disputes.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-gray-600 font-medium">No disputes — your customers are happy!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{d.product_name || 'Order issue'}</p>
                  <p className="text-sm text-gray-500">
                    #{d.dispute_number} · {d.customerId?.name} ({d.customerId?.email}) · {new Date(d.createdAt).toLocaleString()}
                  </p>
                  <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                    {d.type.replace('_', ' ')}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${DISPUTE_STATUS_STYLES[d.status]}`}>
                  {d.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-gray-700 mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">{d.description}</p>

              {d.resolution_note && openId !== d.id && (
                <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-700 mb-1">Your response</p>
                  <p className="text-sm text-gray-700">{d.resolution_note}</p>
                </div>
              )}

              {openId === d.id ? (
                <RespondForm dispute={d} onDone={() => setOpenId(null)} />
              ) : (
                <button
                  onClick={() => setOpenId(d.id)}
                  className="mt-4 text-orange-600 text-sm font-medium hover:underline"
                >
                  {d.status === 'resolved' || d.status === 'rejected' ? 'Update response →' : 'Respond / Resolve →'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
