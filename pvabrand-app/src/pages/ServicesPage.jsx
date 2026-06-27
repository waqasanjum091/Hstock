import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiArrowRight, FiZap, FiShield, FiGlobe, FiLock, FiCpu } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import CTABanner from '../components/CTABanner'
import SEO from '../components/SEO'
import { useScrollToTop } from '../hooks/useAnimations'

const services = [
  {
    title: 'Social Media Accounts',
    description: 'Verified accounts for Instagram, TikTok, LinkedIn, Twitter/X, Facebook, YouTube, Reddit, and Discord.',
    icon: FiGlobe,
    features: ['Phone Verified', 'Email Verified', 'Profile Ready', 'Instant Delivery'],
    gradient: 'from-pink-500 to-purple-600',
    link: '/marketplace?category=social',
  },
  {
    title: 'Email Accounts',
    description: 'Premium Gmail and other email provider accounts with full verification and recovery options.',
    icon: FiLock,
    features: ['Fresh Accounts', 'Recovery Email', 'Phone Verified', 'Bulk Available'],
    gradient: 'from-red-500 to-orange-500',
    link: '/marketplace?category=email',
  },
  {
    title: 'Finance & Crypto',
    description: 'Verified Binance, Coinbase, and PayPal accounts for seamless financial transactions.',
    icon: FiCpu,
    features: ['KYC Verified', 'Full Access', 'Secure', 'Transaction Ready'],
    gradient: 'from-green-500 to-emerald-600',
    link: '/marketplace?category=finance',
  },
  {
    title: 'Streaming Services',
    description: 'Premium Spotify, Netflix, and other streaming accounts for entertainment.',
    icon: FiZap,
    features: ['Premium Access', 'Ad-Free', '4K Quality', 'Multiple Profiles'],
    gradient: 'from-purple-500 to-pink-600',
    link: '/marketplace?category=streaming',
  },
  {
    title: 'Productivity & Cloud',
    description: 'Apple ID, iCloud, and Microsoft accounts for productivity and cloud services.',
    icon: FiShield,
    features: ['Full Access', 'Cloud Storage', 'Office Suite', 'Verified'],
    gradient: 'from-sky-500 to-blue-600',
    link: '/marketplace?category=productivity',
  },
  {
    title: 'SMTP Services',
    description: 'Gmail and iCloud SMTP configurations for automated email campaigns.',
    icon: FiLock,
    features: ['API Ready', 'Bulk Sending', 'High Deliverability', 'Configured'],
    gradient: 'from-amber-500 to-yellow-500',
    link: '/marketplace?category=smtp',
  },
]

const process = [
  { step: '01', title: 'Browse & Select', desc: 'Choose from our wide range of verified digital accounts.' },
  { step: '02', title: 'Place Your Order', desc: 'Fill in your details and complete the purchase securely.' },
  { step: '03', title: 'Instant Delivery', desc: 'Receive your accounts within minutes via email or dashboard.' },
  { step: '04', title: 'Get Support', desc: 'Our team is available 24/7 for any questions or issues.' },
]

export default function ServicesPage() {
  useScrollToTop()

  return (
    <>
      <SEO title="Our Services" description="Explore our comprehensive range of digital account services." url="/services" />

      <div className="min-h-screen pt-24 pb-20">
        <section className="py-16 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-white/80">Services</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 max-w-xl mx-auto text-lg">
              Premium digital accounts and services tailored for your needs.
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-300">
                  <div className={`h-2 bg-gradient-to-r ${service.gradient}`} />
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4`}>
                      <service.icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-5">
                      {service.features.map((feat, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCheck size={14} className="text-orange-500 flex-shrink-0" />{feat}
                        </li>
                      ))}
                    </ul>
                    <Link to={service.link} className="inline-flex items-center gap-2 text-orange-500 text-sm font-semibold hover:gap-3 transition-all">
                      View Products <FiArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="How It Works" title="Simple 4-Step Process" description="Getting started with PVA Brand is easy." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="text-center">
                  <div className="text-5xl font-black text-orange-200 mb-3">{step.step}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </div>
    </>
  )
}
