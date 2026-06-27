import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'

const vendorProductService = {
  getProducts: async () => {
    const response = await api.get('/vendor/products')
    return response.data
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
  updateProduct: async (id, data) => {
    const response = await api.put(`/vendor/products/${id}`, data)
    return response.data
  },
}

export default function VendorProductsPage() {
  const [editingId, setEditingId] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: vendorProductService.getProducts,
    retry: 1,
  })

  const deleteMutation = useMutation({
    mutationFn: vendorProductService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] })
      toast.success('Product deleted')
    },
  })

  const products = data?.data || []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link to="/vendor/products/add" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          Add Product
        </Link>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Loading products...</div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Failed to load products.</p>
          <p className="text-red-500 text-sm mt-1">Make sure your store profile is created and approved.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">No products yet</p>
          <Link to="/vendor/products/add" className="text-orange-600 hover:text-orange-700">
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Product Name</th>
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
                    <p className="text-sm text-gray-600">{product.sku}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-orange-600">${(product.price || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={product.quantity > 10 ? 'text-green-600' : 'text-red-600'}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-sm ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700 mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(product.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
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