import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { orderService } from '../services/orderService'
import { useApp } from '../context/AppContext'
import api from '../services/api'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, isAuthenticated } = useApp()
  const [formData, setFormData] = useState({
    shipping_address_id: '',
    payment_method: 'card',
    notes: '',
  })

  const { data: addressData } = useQuery({
    queryKey: ['shipping-addresses'],
    queryFn: () => api.get('/shipping-addresses').then((r) => r.data),
    enabled: isAuthenticated,
  })

  const addresses = addressData?.data || addressData || []

  const checkout = useMutation({
    mutationFn: orderService.checkout,
    onSuccess: () => {
      toast.success('Order placed successfully!')
      navigate('/account/orders')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Checkout failed')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.shipping_address_id) {
      toast.error('Please select a shipping address')
      return
    }
    checkout.mutate(formData)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              {addresses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No addresses saved.{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/account/addresses')}
                    className="text-orange-600 underline"
                  >
                    Add one here
                  </button>
                </p>
              ) : (
                <select
                  value={formData.shipping_address_id}
                  onChange={(e) => setFormData({ ...formData, shipping_address_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">-- Select address --</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.full_name} — {addr.address_line_1}, {addr.city}, {addr.country}
                      {addr.is_default ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Order Notes (Optional)</h2>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Any special instructions..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={checkout.isPending || cartItems.length === 0 || addresses.length === 0}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkout.isPending ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
