import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function InquiriesPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: () => adminService.getContactInquiries(),
  })

  const resolveMutation = useMutation({
    mutationFn: adminService.resolveInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] })
      toast.success('Inquiry marked as resolved')
    },
  })

  if (isLoading) return <div className="p-8">Loading...</div>

  const inquiries = data?.data || []
  const unresolvedCount = inquiries.filter(i => !i.is_resolved).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Inquiries</h1>
        <p className="text-gray-600">
          {unresolvedCount} unresolved inquiries
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">{inquiry.name}</p>
                  <p className="text-sm text-gray-600">{inquiry.email}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  inquiry.is_resolved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {inquiry.is_resolved ? 'Resolved' : 'Pending'}
                </span>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-sm text-gray-600">Subject</p>
                <p className="mb-2">{inquiry.subject || 'No subject'}</p>
                <p className="font-semibold text-sm text-gray-600">Message</p>
                <p className="text-gray-700">{inquiry.message}</p>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p>Received: {new Date(inquiry.created_at).toLocaleString()}</p>
              </div>

              {!inquiry.is_resolved && (
                <button
                  onClick={() => resolveMutation.mutate(inquiry.id)}
                  disabled={resolveMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
