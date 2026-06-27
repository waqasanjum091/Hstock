import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { useScrollToTop } from '../hooks/useAnimations'

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing and using PVA Brand services, you agree to be bound by these Terms of Service.' },
  { title: 'Service Description', content: 'PVA Brand provides digital accounts and related services. All accounts are verified and tested before delivery.' },
  { title: 'Account Delivery', content: 'Most accounts are delivered instantly (within 0-5 minutes). Some premium products may take up to 24 hours.' },
  { title: 'Payment Terms', content: 'All payments must be made in full before account delivery.' },
  { title: 'Refund Policy', content: 'We offer refunds for accounts that are non-functional or banned within 24 hours of purchase.' },
  { title: 'User Responsibilities', content: 'You are responsible for maintaining the confidentiality of your account information.' },
  { title: 'Prohibited Activities', content: 'You may not resell accounts without authorization, use accounts for spam, or engage in harmful activities.' },
  { title: 'Limitation of Liability', content: 'PVA Brand shall not be liable for any indirect, incidental, or consequential damages.' },
  { title: 'Intellectual Property', content: 'All content on this website is the property of PVA Brand and protected by copyright laws.' },
  { title: 'Governing Law', content: 'These terms shall be governed by and construed in accordance with applicable laws.' },
]

export default function TermsPage() {
  useScrollToTop()

  return (
    <>
      <SEO title="Terms of Service" description="PVA Brand Terms of Service." url="/terms" />

      <div className="min-h-screen pt-24 pb-20">
        <section className="py-16 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of <span className="text-white/80">Service</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/80">Last updated: January 1, 2024</motion.p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-6 md:p-10">
              <p className="text-gray-500 leading-relaxed mb-8">
                Welcome to PVA Brand. These Terms of Service govern your use of our website and services.
              </p>
              <div className="space-y-8">
                {sections.map((section, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
