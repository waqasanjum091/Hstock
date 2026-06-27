import { motion } from 'framer-motion'
import { FiTarget, FiEye, FiShield, FiZap } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import CTABanner from '../components/CTABanner'
import SEO from '../components/SEO'
import { useScrollToTop } from '../hooks/useAnimations'
import { testimonials, faqData } from '../data/products'
import TestimonialCard from '../components/TestimonialCard'
import FAQItem from '../components/FAQItem'

const values = [
  { icon: FiTarget, title: 'Quality First', desc: 'Every account is verified and tested before delivery.' },
  { icon: FiEye, title: 'Customer Focus', desc: 'Your satisfaction is our top priority.' },
  { icon: FiZap, title: 'Speed & Efficiency', desc: 'Instant delivery means you get what you need fast.' },
  { icon: FiShield, title: 'Trust & Security', desc: 'Your data and transactions are always protected.' },
]

const milestones = [
  { year: '2020', event: 'PVA Brand Founded', desc: 'Started with a vision to provide premium digital accounts.' },
  { year: '2021', event: '100K Accounts Sold', desc: 'Reached our first major milestone in customer trust.' },
  { year: '2022', event: 'Expanded Services', desc: 'Added 30+ new product categories and services.' },
  { year: '2023', event: '500K+ Accounts', desc: 'Half a million accounts sold with 99.9% satisfaction.' },
  { year: '2024', event: 'Global Reach', desc: 'Serving customers in 100+ countries worldwide.' },
]

export default function AboutPage() {
  useScrollToTop()

  return (
    <>
      <SEO title="About Us" description="Learn about PVA Brand - your trusted marketplace for premium digital accounts." url="/about" />

      <div className="min-h-screen pt-24 pb-20">
        <section className="py-16 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
              About <span className="text-white/80">PVA Brand</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
              We are a team of passionate professionals dedicated to providing the highest quality digital accounts.
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-wider mb-4">Our Story</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Building Trust in Digital Accounts</h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  PVA Brand was founded with a simple mission: to provide the highest quality verified digital accounts to customers worldwide.
                </p>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Today, we serve over 25,000 customers across 100+ countries, delivering more than 500,000 accounts with a 99.9% satisfaction rate.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Every account we sell is carefully verified, tested, and quality-checked before delivery.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
                {values.map((val, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 text-center border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all">
                    <val.icon size={24} className="text-orange-500 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{val.title}</h4>
                    <p className="text-xs text-gray-500">{val.desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <FiTarget size={32} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-500 leading-relaxed">To provide the most reliable, high-quality digital accounts with instant delivery and exceptional customer support.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <FiEye size={32} className="text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-500 leading-relaxed">To create a world where everyone has access to verified, premium digital accounts without compromise.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Our Journey" title="Company Milestones" />
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200" />
              {milestones.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-500 border-2 border-gray-50 z-10" />
                  <div className={`flex-1 ml-12 md:ml-0 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <span className="text-orange-500 font-bold text-lg">{m.year}</span>
                    <h4 className="font-semibold text-gray-900 mt-1">{m.event}</h4>
                    <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Testimonials" title="What People Say" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t, i) => <TestimonialCard key={t.id} testimonial={t} index={i} />)}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="FAQ" title="Frequently Asked Questions" />
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              {faqData.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
            </div>
          </div>
        </section>

        <CTABanner />
      </div>
    </>
  )
}
