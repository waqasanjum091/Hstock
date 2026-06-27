import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistService } from '../../services/wishlistService'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    retry: 1,
  })

  const removeMutation = useMutation({
    mutationFn: wishlistService.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      toast.success('Removed from wishlist')
    },
  })

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading wishlist...</div>
  if (isError) return <div className="p-8 text-red-600">Failed to load wishlist.</div>

  const items = data?.data || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Wishlist</h1>

      {items.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <Link to="/marketplace" className="text-orange-600 hover:text-orange-700">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              {item.product?.image && (
                <img src={item.product.image} alt={item.product.name} className="w-full h-48 object-cover rounded mb-4" />
              )}
              <h3 className="font-bold text-lg mb-2">{item.product?.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.product?.description?.substring(0, 100)}...</p>
              <p className="text-orange-600 font-bold text-lg mb-4">${(item.product?.price || 0).toFixed(2)}</p>

              <div className="flex gap-2">
                <Link
                  to={`/product/${item.product?.slug}`}
                  className="flex-1 bg-orange-600 text-white py-2 rounded text-center hover:bg-orange-700"
                >
                  View
                </Link>
                <button
                  onClick={() => removeMutation.mutate(item.id)}
                  disabled={removeMutation.isPending}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}