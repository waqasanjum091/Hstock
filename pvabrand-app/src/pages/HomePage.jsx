import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { FiSearch, FiShield, FiZap, FiClock, FiHeadphones, FiArrowRight, FiCheck, FiTrendingUp, FiPackage } from 'react-icons/fi'
import { FaShieldAlt, FaRocket, FaUsers, FaLock } from 'react-icons/fa'
import { categories, testimonials, stats, faqData } from '../data/products'
import { productService } from '../services/productService'
import { mapProduct } from '../utils/mapProduct'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import TestimonialCard from '../components/TestimonialCard'
import FAQItem from '../components/FAQItem'
import SectionHeader from '../components/SectionHeader'
import AnimatedCounter from '../components/AnimatedCounter'
import CTABanner from '../components/CTABanner'
import IconGridSection from '../components/IconGridSection'
import SEO from '../components/SEO'
import { useApp } from '../context/AppContext'
import { useScrollToTop } from '../hooks/useAnimations'

const features = [
  { icon: FiZap, title: 'Instant Delivery', desc: 'Get your accounts within minutes of purchase.' },
  { icon: FiShield, title: 'Verified Accounts', desc: 'All accounts are phone verified and tested.' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Round-the-clock customer support via chat.' },
  { icon: FaLock, title: 'Secure Payments', desc: 'Safe and encrypted payment processing.' },
]

const trustBadges = [
  { icon: FaShieldAlt, label: 'SSL Secured' },
  { icon: FaRocket, label: 'Fast Delivery' },
  { icon: FaUsers, label: '25K+ Users' },
  { icon: FaLock, label: 'Safe & Secure' },
]

export default function HomePage() {
  useScrollToTop()
  const { searchQuery, setSearchQuery } = useApp()
  const [heroSearch, setHeroSearch] = useState('')

  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll({ per_page: 100 }),
  })
  const products = useMemo(() => (data?.data || []).map(mapProduct), [data])

  const trendingProducts = products.filter(p => p.badge === 'Best Seller').slice(0, 4)
  const newestProducts = [...products].reverse().slice(0, 4)
  const topRatedProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4)
  const popularProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4)

  return (
    <>
      <SEO
        title="Home"
        description="PVA Brand - Your premium marketplace for verified digital accounts. Buy Instagram, Gmail, TikTok, LinkedIn, and more PVA accounts with instant delivery."
        keywords="PVA accounts, buy verified accounts, Instagram accounts, Gmail accounts, TikTok accounts"
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-white/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-800/20 rounded-full blur-[150px]" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-8 flex-wrap"
            >
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs text-white/90">
                  <badge.icon size={12} />
                  {badge.label}
                </div>
              ))}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6"
            >
              Your Trusted Marketplace
              <br />for Digital Accounts
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Shop digital products, verified accounts, and online services. Fast delivery with buyer protection.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="max-w-2xl mx-auto mb-10"
            >
              <div className="relative">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for Instagram, Gmail, TikTok accounts..."
                  value={heroSearch}
                  onChange={(e) => {
                    setHeroSearch(e.target.value)
                    setSearchQuery(e.target.value)
                  }}
                  className="w-full pl-14 pr-36 py-4.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 text-base shadow-xl transition-all"
                />
                <Link
                  to={heroSearch ? `/marketplace?search=${encodeURIComponent(heroSearch)}` : '/marketplace'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-lg bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Search
                </Link>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center justify-center gap-8 md:gap-12"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500K+</div>
                <div className="text-xs text-white/70">Accounts Sold</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">25K+</div>
                <div className="text-xs text-white/70">Happy Clients</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-white/70">Services</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Icon Grid Section - Below Hero */}
      <IconGridSection />

      {/* Trusted Statistics */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedCounter key={i} end={stat.value} suffix={stat.suffix} prefix={stat.prefix} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Categories"
            title="Browse Popular Categories"
            description="Find the perfect digital accounts for your needs from our wide range of verified services."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Trending Now"
            title="Trending Products"
            description="Our most popular accounts that customers love. Verified, reliable, and ready to use."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-orange-200 text-orange-600 font-semibold text-sm hover:bg-orange-50 transition-all"
            >
              View All Products <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Why Choose Us"
            title="Why Choose PVA Brand"
            description="We deliver excellence with every account. Here's what makes us the preferred choice."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <feat.icon size={24} className="text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Top Rated"
            title="Top Rated Products"
            description="Highest rated accounts by our customers. Proven quality and satisfaction guaranteed."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRatedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Marketplace"
            title="Marketplace Highlights"
            description="Discover our most popular categories with thousands of verified accounts available."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  to={`/marketplace?category=${cat.id}`}
                  className="block bg-white rounded-xl overflow-hidden group border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-300"
                >
                  <div className={`h-28 bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <cat.icon size={40} className="text-white/80 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-500 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-500">{cat.count} products available</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newest Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="New Arrivals"
            title="Newest Products"
            description="Freshly added accounts and services. Be the first to try our latest offerings."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newestProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Platform Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Live Statistics"
            title="Live Platform Statistics"
            description="Real-time numbers that showcase our platform's growth and reliability."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Accounts Available', value: '50,000+', icon: FiPackage, color: 'from-blue-500 to-blue-600' },
              { label: 'Orders Today', value: '1,200+', icon: FiTrendingUp, color: 'from-green-500 to-green-600' },
              { label: 'Active Sellers', value: '500+', icon: FaUsers, color: 'from-purple-500 to-purple-600' },
              { label: 'Uptime', value: '99.9%', icon: FiCheck, color: 'from-orange-500 to-orange-600' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-xl p-5 text-center border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon size={18} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              '256-bit SSL Encryption',
              'Secure Payment Gateway',
              'Money-Back Guarantee',
              '24/7 Fraud Protection',
              'Verified Accounts Only',
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                <FiShield size={16} className="text-orange-500" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Testimonials"
            title="What Our Customers Say"
            description="Trusted by thousands of customers worldwide. Here are some of their experiences."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="FAQ"
            title="Frequently Asked Questions"
            description="Got questions? We've got answers. If you can't find what you're looking for, contact our support team."
          />
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            {faqData.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner />
    </>
  )
}
