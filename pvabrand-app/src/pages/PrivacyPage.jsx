import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { useScrollToTop } from '../hooks/useAnimations'

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.' },
  { title: 'How We Use Your Information', content: 'We use the information we collect to process transactions, send order confirmations, provide customer support, and improve our services.' },
  { title: 'Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties.' },
  { title: 'Data Security', content: 'We implement a variety of security measures to maintain the safety of your personal information.' },
  { title: 'Cookies', content: 'We use cookies to enhance your experience on our website.' },
  { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information.' },
  { title: 'Changes to This Policy', content: 'We reserve the right to update this Privacy Policy at any time.' },
  { title: 'Contact Us', content: 'If you have any questions, please contact us via Telegram, WhatsApp, or email.' },
]

export default function PrivacyPage() {
  useScrollToTop()

  return (
    <>
      <SEO title="Privacy Policy" description="PVA Brand Privacy Policy." url="/privacy" />

      <div className="min-h-screen pt-24 pb-20">
        <section className="py-16 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy <span className="text-white/80">Policy</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/80">Last updated: January 1, 2024</motion.p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-6 md:p-10">
              <p className="text-gray-500 leading-relaxed mb-8">
                At PVA Brand, we are committed to protecting your privacy and ensuring the security of your personal information.
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
