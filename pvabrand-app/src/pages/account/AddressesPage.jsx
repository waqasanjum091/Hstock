import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

const addressService = {
  getAddresses: async () => {
    const response = await api.get('/shipping-addresses')
    return response.data
  },
  createAddress: async (data) => {
    const response = await api.post('/shipping-addresses', data)
    return response.data
  },
  deleteAddress: async (id) => {
    const response = await api.delete(`/shipping-addresses/${id}`)
    return response.data
  },
  setDefault: async (id) => {
    const response = await api.put(`/shipping-addresses/${id}`, { is_default: true })
    return response.data
  },
}

const emptyForm = {
  full_name: '',
  phone: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  is_default: false,
}

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['shipping-addresses'],
    queryFn: addressService.getAddresses,
  })

  const createMutation = useMutation({
    mutationFn: addressService.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-addresses'] })
      toast.success('Address added successfully')
      setFormData(emptyForm)
      setShowForm(false)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add address')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: addressService.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-addresses'] })
      toast.success('Address deleted')
    },
  })

  const defaultMutation = useMutation({
    mutationFn: addressService.setDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-addresses'] })
      toast.success('Default address updated')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const addresses = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shipping Addresses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          {showForm ? 'Cancel' : 'Add Address'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={formData.address_line_1}
              onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              className="px-4 py-2 border rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={formData.address_line_2}
              onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
              className="px-4 py-2 border rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="text"
              placeholder="State / Province"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <label className="flex items-center md:col-span-2">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="mr-2"
              />
              Set as default address
            </label>
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="mt-4 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : addresses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No addresses added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white p-6 rounded-lg shadow">
              {address.is_default && (
                <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded mb-2 inline-block">
                  Default
                </span>
              )}
              <p className="font-bold mb-2">{address.full_name}</p>
              <p className="text-gray-600 text-sm mb-4">
                {address.address_line_1}
                {address.address_line_2 && <>, {address.address_line_2}</>}
                <br />
                {address.city}, {address.state} {address.postal_code}
                <br />
                {address.country}
                <br />
                {address.phone}
              </p>
              <div className="flex gap-2">
                {!address.is_default && (
                  <button
                    onClick={() => defaultMutation.mutate(address.id)}
                    disabled={defaultMutation.isPending}
                    className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(address.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
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
