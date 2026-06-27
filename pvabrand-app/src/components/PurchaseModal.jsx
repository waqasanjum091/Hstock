import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend, FiCheckCircle, FiLoader } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function PurchaseModal() {
  const { isPurchaseModalOpen, selectedProduct, closePurchaseModal } = useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    quantity: 1,
    notes: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSuccess(true)
    toast.success('Order submitted successfully!', {
      style: { background: '#fff', color: '#1a1a1a', border: '1px solid #22c55e' },
    })

    setIsSubmitting(false)
  }

  const handleClose = () => {
    setIsSuccess(false)
    setForm({ name: '', email: '', contact: '', quantity: 1, notes: '' })
    closePurchaseModal()
  }

  if (!selectedProduct) return null

  return (
    <AnimatePresence>
      {isPurchaseModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header Gradient */}
            <div className={`h-2 bg-gradient-to-r ${selectedProduct.gradient}`} />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all z-10"
            >
              <FiX size={18} />
            </button>

            {isSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <FiCheckCircle size={40} className="text-green-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Submitted!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Thank you for your order. We will process it and contact you shortly.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedProduct.gradient} flex items-center justify-center flex-shrink-0`}>
                    <selectedProduct.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedProduct.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-lg font-bold text-orange-500">{formatPrice(selectedProduct.price)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(selectedProduct.originalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Telegram / WhatsApp *</label>
                    <input
                      type="text"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      required
                      placeholder="@username or phone number"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                      min={selectedProduct.minOrder}
                      max={selectedProduct.maxOrder}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Min: {selectedProduct.minOrder} | Max: {selectedProduct.maxOrder}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any special requirements..."
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm resize-none transition-all"
                    />
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-orange-50 border border-orange-100">
                    <span className="text-sm text-gray-600 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-orange-500">
                      {formatPrice(selectedProduct.price * form.quantity)}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader className="animate-spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiSend size={16} />
                        Place Order
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By placing an order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
