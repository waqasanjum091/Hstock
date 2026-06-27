import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCalendar, FiUser, FiArrowRight, FiTag } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import SEO from '../components/SEO'
import { useScrollToTop } from '../hooks/useAnimations'

const blogPosts = [
  { id: 1, title: 'Why PVA Accounts Are Essential for Digital Marketing', excerpt: 'Discover how Phone Verified Accounts can boost your marketing campaigns.', author: 'PVA Brand Team', date: 'Jan 15, 2024', category: 'Marketing', readTime: '5 min read', gradient: 'from-blue-500 to-purple-600' },
  { id: 2, title: 'The Complete Guide to Instagram Account Safety', excerpt: 'Learn best practices for keeping your Instagram accounts safe and active.', author: 'PVA Brand Team', date: 'Jan 10, 2024', category: 'Social Media', readTime: '7 min read', gradient: 'from-pink-500 to-orange-500' },
  { id: 3, title: 'How to Scale Your Business with Bulk Gmail Accounts', excerpt: 'A comprehensive guide on using bulk Gmail accounts for business communication.', author: 'PVA Brand Team', date: 'Jan 5, 2024', category: 'Business', readTime: '6 min read', gradient: 'from-red-500 to-yellow-500' },
  { id: 4, title: 'Top 10 LinkedIn Strategies for B2B Marketers', excerpt: 'Maximize your B2B marketing efforts with these proven LinkedIn strategies.', author: 'PVA Brand Team', date: 'Dec 28, 2023', category: 'B2B', readTime: '8 min read', gradient: 'from-blue-600 to-blue-800' },
  { id: 5, title: 'Understanding SMTP: Gmail vs iCloud Email Services', excerpt: 'A detailed comparison of Gmail and iCloud SMTP services.', author: 'PVA Brand Team', date: 'Dec 20, 2023', category: 'Technical', readTime: '6 min read', gradient: 'from-sky-400 to-indigo-500' },
  { id: 6, title: 'Crypto Trading: Getting Started with Verified Accounts', excerpt: 'Everything you need to know about setting up verified crypto accounts.', author: 'PVA Brand Team', date: 'Dec 15, 2023', category: 'Crypto', readTime: '9 min read', gradient: 'from-yellow-400 to-orange-500' },
]

export default function BlogPage() {
  useScrollToTop()

  return (
    <>
      <SEO title="Blog" description="Read the latest articles, guides, and tips about digital accounts." url="/blog" />

      <div className="min-h-screen pt-24 pb-20">
        <section className="py-16 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-white/80">Blog</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 max-w-xl mx-auto text-lg">
              Insights, guides, and tips for making the most of your digital accounts.
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, i) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-300">
                  <div className={`h-40 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
                    <div className="text-white/20 text-6xl font-black">{post.title.charAt(0)}</div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1"><FiCalendar size={12} />{post.date}</div>
                      <div className="flex items-center gap-1"><FiUser size={12} />{post.author}</div>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <FiTag size={12} className="text-orange-500" />
                      <span className="text-xs text-orange-500 font-medium">{post.category}</span>
                      <span className="text-xs text-gray-400 ml-2">&bull; {post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 hover:text-orange-500 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <button className="inline-flex items-center gap-2 text-orange-500 text-sm font-semibold hover:gap-3 transition-all">
                      Read More <FiArrowRight size={14} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
