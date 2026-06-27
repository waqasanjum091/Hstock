import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

const emptyForm = {
  store_name: '',
  description: '',
  phone: '',
  address: '',
}

export default function VendorProfilePage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState(emptyForm)

  const { data: meData, isLoading } = useQuery({
    queryKey: ['vendor-me'],
    queryFn: () => api.get('/me').then((r) => r.data),
  })

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['vendor-profile'],
    queryFn: () => api.get('/vendor-profile').then((r) => r.data).catch(() => null),
    retry: false,
  })

  const hasProfile = !!profileData && !profileData?.message

  useEffect(() => {
    if (profileData && !profileData?.message) {
      setFormData({
        store_name: profileData.store_name || '',
        description: profileData.description || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
      })
    }
  }, [profileData])

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/vendor-profile', data).then((r) => r.data),
    onSuccess: () => {
      toast.success('Store profile created! Waiting for admin approval.')
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] })
      queryClient.invalidateQueries({ queryKey: ['vendor-stats'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create profile')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data) => api.put('/vendor-profile', data).then((r) => r.data),
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    },
  })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.store_name.trim()) {
      toast.error('Store name is required')
      return
    }
    if (hasProfile) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  if (isLoading || profileLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Store Profile</h1>

      {!hasProfile && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium">⚠️ You haven't created a store profile yet.</p>
          <p className="text-yellow-700 text-sm mt-1">Fill in the form below to create your store. An admin must approve it before you can add products.</p>
        </div>
      )}

      {hasProfile && !profileData?.is_approved && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">⏳ Your store is pending admin approval.</p>
          <p className="text-blue-700 text-sm mt-1">You can update your details, but cannot add products until approved.</p>
        </div>
      )}

      {hasProfile && profileData?.is_approved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">✅ Your store is approved and active!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Store Name *</label>
          <input
            type="text"
            name="store_name"
            value={formData.store_name}
            onChange={handleChange}
            required
            placeholder="My Awesome Store"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, City, Country"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Store Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Tell customers about your store..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-orange-600 text-white py-3 rounded font-bold hover:bg-orange-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Store Profile'}
        </button>
      </form>
    </div>
  )
}
