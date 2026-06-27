import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function BannersPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    link: '',
    position: 'top',
    is_active: true,
  })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => adminService.getBanners(),
  })

  const createMutation = useMutation({
    mutationFn: adminService.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      toast.success('Banner created successfully')
      setShowForm(false)
      setFormData({
        title: '',
        image: null,
        link: '',
        position: 'top',
        is_active: true,
      })
    },
    onError: () => {
      toast.error('Failed to create banner')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      toast.success('Banner deleted')
    },
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('title', formData.title)
    form.append('link', formData.link)
    form.append('position', formData.position)
    form.append('is_active', formData.is_active)
    if (formData.image) {
      form.append('image', formData.image)
    }

    if (editingId) {
      createMutation.mutate({ id: editingId, data: form })
    } else {
      createMutation.mutate(form)
    }
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  const banners = data?.data || []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Banners Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              title: '',
              image: null,
              link: '',
              position: 'top',
              is_active: true,
            })
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          {showForm ? 'Cancel' : 'Add Banner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Active</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            Save Banner
          </button>
        </form>
      )}

      {banners.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No banners found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
              {banner.image && (
                <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <p className="font-bold mb-2">{banner.title}</p>
                <p className="text-sm text-gray-600 mb-2">Position: {banner.position}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Status: <span className={banner.is_active ? 'text-green-600' : 'text-red-600'}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <button
                  onClick={() => deleteMutation.mutate(banner.id)}
                  disabled={deleteMutation.isPending}
                  className="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
