import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getUsers(),
    retry: 1,
  })

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User deleted')
    },
    onError: () => toast.error('Failed to delete user'),
  })

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
    </div>
  )

  if (isError) return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Users Management</h1>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Failed to load users.</p>
      </div>
    </div>
  )

  const users = data?.data || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>
      {users.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.roles?.[0]?.name === 'super-admin' ? 'bg-red-100 text-red-800' :
                      user.roles?.[0]?.name === 'vendor' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.roles?.[0]?.name || 'customer'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        if (confirm(`Delete user ${user.name}?`)) deleteMutation.mutate(user.id)
                      }}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
