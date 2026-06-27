import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/admin/all-products').then((r) => r.data),
    retry: 1,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Product deleted')
    },
    onError: () => toast.error('Failed to delete product'),
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => api.patch(`/admin/products/${id}/toggle-active`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Product status updated')
    },
  })

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
    </div>
  )

  if (isError) return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Products Management</h1>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Failed to load products.</p>
      </div>
    </div>
  )

  const products = data?.data || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Products Management</h1>

      {products.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No products found. Vendors need to add products.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Vendor</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.sku || ''}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{product.vendor?.store_name || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-orange-600">${(parseFloat(product.price) || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={product.quantity > 10 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {product.quantity ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => toggleMutation.mutate(product.id)}
                      disabled={toggleMutation.isPending}
                      className="text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
                    >
                      {product.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${product.name}"?`)) deleteMutation.mutate(product.id)
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
