import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { disputeService, DISPUTE_STATUS_STYLES } from '../../services/disputeService'

const FILTERS = ['', 'open', 'in_progress', 'resolved', 'rejected']

export default function AdminDisputesPage() {
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-disputes', status],
    queryFn: () => disputeService.getAll(status ? { status } : {}),
    refetchInterval: 15000,
  })

  const disputes = data?.data || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Disputes Oversight</h1>
      <p className="text-gray-500 mb-6">Monitor all disputes raised by customers across every vendor.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f || 'all'}
            onClick={() => setStatus(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
              status === f ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f ? f.replace('_', ' ') : 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : disputes.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">No disputes found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Dispute</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Vendor</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr key={d.id} className="border-b hover:bg-gray-50 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">#{d.dispute_number}</p>
                    <p className="text-gray-500 text-xs max-w-xs truncate">{d.description}</p>
                  </td>
                  <td className="px-4 py-3">{d.customerId?.name || '—'}</td>
                  <td className="px-4 py-3">{d.vendorId?.store_name || '—'}</td>
                  <td className="px-4 py-3 capitalize">{d.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${DISPUTE_STATUS_STYLES[d.status]}`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
