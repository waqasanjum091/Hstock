import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiSend, FiLoader, FiCheckCircle } from 'react-icons/fi'
import { FaTelegram, FaWhatsapp } from 'react-icons/fa'
import SectionHeader from '../components/SectionHeader'
import SEO from '../components/SEO'
import { useScrollToTop } from '../hooks/useAnimations'
import toast from 'react-hot-toast'
import { FORMSPREE_ENDPOINT } from '../utils/config'

const contactMethods = [
  { icon: FaTelegram, label: 'Telegram', value: '@pvabrand', href: 'https://t.me/pvabrand', color: 'from-blue-400 to-blue-600' },
  { icon: FaWhatsapp, label: 'WhatsApp', value: '+1 (234) 567-890', href: 'https://wa.me/1234567890', color: 'from-green-400 to-green-600' },
  { icon: FiMail, label: 'Email', value: 'support@pvabrand.com', href: 'mailto:support@pvabrand.com', color: 'from-red-400 to-orange-500' },
  { icon: FiMapPin, label: 'Location', value: 'Global Service', href: '#', color: 'from-purple-400 to-pink-500' },
]

export default function ContactPage() {
  useScrollToTop()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _subject: form.subject, ...form }),
      })
      if (response.ok) {
        setIsSuccess(true)
        toast.success('Message sent successfully!', { style: { background: '#fff', color: '#1a1a1a', border: '1px solid #22c55e' } })
      } else {
        throw new Error('Failed')
      }
    } catch {
      toast.error('Failed to send message. Please try again.', { style: { background: '#fff', color: '#1a1a1a', border: '1px solid #ef4444' } })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with PVA Brand support team. Available 24/7." url="/contact" />

      <div className="min-h-screen pt-24 pb-20">
        <section className="py-16 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact <span className="text-white/80">Us</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 max-w-xl mx-auto text-lg">
              Have questions? We're here to help. Reach out to us anytime.
            </motion.p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contactMethods.map((method, i) => (
                <motion.a key={i} href={method.href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-xl p-5 text-center border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-300">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3`}>
                    <method.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{method.label}</h3>
                  <p className="text-xs text-gray-500">{method.value}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Get In Touch" title="Send Us a Message" description="Fill out the form below and we'll get back to you within 24 hours." />

            {isSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-50 rounded-xl p-12 text-center border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                <button onClick={() => { setIsSuccess(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} required placeholder="How can we help?"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm resize-none transition-all" />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                  {isSubmitting ? <><FiLoader className="animate-spin" size={18} /> Sending...</> : <><FiSend size={16} /> Send Message</>}
                </motion.button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
