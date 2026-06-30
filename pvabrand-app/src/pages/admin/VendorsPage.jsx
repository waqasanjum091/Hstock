import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function VendorsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: () => adminService.getVendors(),
    retry: 1,
    refetchInterval: 15000, // auto-refresh every 15s
  })

  const approveMutation = useMutation({
    mutationFn: adminService.approveVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] })
      toast.success('✅ Vendor approved! They can now add products.')
    },
    onError: () => toast.error('Failed to approve vendor'),
  })

  const rejectMutation = useMutation({
    mutationFn: (id) => adminService.rejectVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] })
      toast.success('Vendor request rejected')
    },
    onError: () => toast.error('Failed to reject vendor'),
  })

  const banMutation = useMutation({
    mutationFn: adminService.banVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] })
      toast.success('Vendor selling rights revoked')
    },
    onError: () => toast.error('Failed to revoke vendor'),
  })

  const suspendMutation = useMutation({
    mutationFn: ({ userId, suspend }) => adminService.toggleSuspendUser(userId, suspend),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] })
      toast.success(vars.suspend ? 'Account suspended' : 'Account reactivated')
    },
    onError: () => toast.error('Failed to update account'),
  })

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
    </div>
  )

  if (isError) return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Vendor Management</h1>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Failed to load vendors. Please refresh.</p>
      </div>
    </div>
  )

  const allVendors = data?.profiles?.data || []
  const noProfileVendors = data?.no_profile_vendors || []
  const pendingVendors = allVendors.filter((v) => !v.is_approved)
  const approvedVendors = allVendors.filter((v) => v.is_approved)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Management</h1>
        <div className="flex gap-2">
          {pendingVendors.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingVendors.length} pending approval
            </span>
          )}
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {approvedVendors.length} approved
          </span>
        </div>
      </div>

      {/* ── PENDING APPROVAL (most important — shown first) ── */}
      {pendingVendors.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse inline-block"></span>
            Pending Approval ({pendingVendors.length})
          </h2>
          <div className="space-y-3">
            {pendingVendors.map((vendor) => (
              <div key={vendor.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{vendor.store_name}</p>
                  <p className="text-sm text-gray-600">{vendor.user?.name} · {vendor.user?.email}</p>
                  {vendor.phone && <p className="text-sm text-gray-500">📞 {vendor.phone}</p>}
                  {vendor.address && <p className="text-sm text-gray-500">📍 {vendor.address}</p>}
                  {vendor.description && <p className="text-sm text-gray-500 mt-1 italic">"{vendor.description}"</p>}
                  <p className="text-xs text-gray-400 mt-1">Applied: {new Date(vendor.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => approveMutation.mutate(vendor.id)}
                    disabled={approveMutation.isPending}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => { if (confirm(`Reject "${vendor.store_name}"?`)) rejectMutation.mutate(vendor.id) }}
                    disabled={rejectMutation.isPending}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 disabled:opacity-50 whitespace-nowrap"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── REGISTERED BUT NO PROFILE ── */}
      {noProfileVendors.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-600">
            ⏳ Registered — No Store Profile Yet ({noProfileVendors.length})
          </h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Registered</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {noProfileVendors.map((v) => (
                  <tr key={v.user_id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{v.user?.name}</td>
                    <td className="px-6 py-3">{v.user?.email}</td>
                    <td className="px-6 py-3 text-gray-500">{new Date(v.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                        No Profile Created
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── APPROVED VENDORS ── */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-600">
          ✅ Approved Vendors ({approvedVendors.length})
        </h2>
        {approvedVendors.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            No approved vendors yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Store Name</th>
                  <th className="px-6 py-3 text-left">Owner</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Account</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedVendors.map((vendor) => {
                  const suspended = vendor.user?.is_suspended
                  const userId = vendor.user?.id || vendor.user?._id
                  return (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{vendor.store_name}</td>
                    <td className="px-6 py-3">{vendor.user?.name}</td>
                    <td className="px-6 py-3">{vendor.user?.email}</td>
                    <td className="px-6 py-3">
                      {suspended ? (
                        <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">Suspended</span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-3 space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => suspendMutation.mutate({ userId, suspend: !suspended })}
                        disabled={suspendMutation.isPending || !userId}
                        className={`text-sm disabled:opacity-50 ${suspended ? 'text-green-600 hover:text-green-700' : 'text-yellow-600 hover:text-yellow-700'}`}
                      >
                        {suspended ? 'Reactivate' : 'Suspend Account'}
                      </button>
                      <button
                        onClick={() => { if (confirm(`Revoke selling rights for "${vendor.store_name}"?`)) banMutation.mutate(vendor.id) }}
                        disabled={banMutation.isPending}
                        className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingVendors.length === 0 && noProfileVendors.length === 0 && approvedVendors.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-4xl mb-4">🏪</p>
          <p className="text-gray-600 font-medium">No vendors yet.</p>
          <p className="text-gray-400 text-sm mt-1">Vendors will appear here after they register.</p>
        </div>
      )}
    </div>
  )
}
