import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import brandIcons from '../data/brandIcons'

const socialMediaItems = [
  { key: 'telegram', slug: 'telegram-accounts' },
  { key: 'twitter', slug: 'x-twitter-pva-accounts' },
  { key: 'google', slug: 'gmail-pva-accounts' },
  { key: 'discord', slug: 'discord-accounts' },
  { key: 'instagram', slug: 'instagram-pva-accounts' },
  { key: 'facebook', slug: 'facebook-pva-accounts' },
  { key: 'microsoft', slug: 'microsoft-accounts' },
  { key: 'tiktok', slug: 'tiktok-pva-accounts' },
  { key: 'twitch', slug: 'reddit-pva-accounts' },
  { key: 'threads', slug: 'whatsapp-accounts' },
  { key: 'pinterest', slug: 'linkedin-pva-accounts' },
  { key: 'reddit', slug: 'reddit-pva-accounts' },
  { key: 'linkedin', slug: 'linkedin-pva-accounts' },
  { key: 'youtube', slug: 'youtube-pva-accounts' },
]

const subscriptionItems = [
  { key: 'youtube_premium', slug: 'youtube-pva-accounts' },
  { key: 'prime_video', slug: 'netflix-premium-accounts' },
  { key: 'apple_tv', slug: 'apple-id-accounts' },
  { key: 'disney', slug: 'netflix-premium-accounts' },
  { key: 'hbo', slug: 'netflix-premium-accounts' },
  { key: 'netflix', slug: 'netflix-premium-accounts' },
  { key: 'spotify', slug: 'spotify-premium-accounts' },
  { key: 'gemini', slug: 'gmail-smtp-service' },
  { key: 'claude', slug: 'gmail-smtp-service' },
  { key: 'deepseek', slug: 'gmail-smtp-service' },
  { key: 'copilot', slug: 'microsoft-accounts' },
  { key: 'perplexity', slug: 'gmail-smtp-service' },
  { key: 'cursor', slug: 'gmail-smtp-service' },
  { key: 'other_ai', slug: 'gmail-smtp-service' },
]

function IconItem({ item, index }) {
  const icon = brandIcons[item.key]
  if (!icon) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link
        to={`/marketplace?search=${encodeURIComponent(icon.name)}`}
        className="flex flex-col items-center gap-2 group"
      >
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-gray-200 group-hover:border-orange-300 group-hover:shadow-md group-hover:shadow-orange-50 transition-all duration-300 group-hover:scale-110 p-1">
          {icon.svg}
        </div>
        <span className="text-[11px] text-gray-500 group-hover:text-orange-500 transition-colors text-center leading-tight max-w-[70px]">
          {icon.name}
        </span>
      </Link>
    </motion.div>
  )
}

export default function IconGridSection() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Social Media Accounts */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Social Media Accounts</h2>
              <Link to="/marketplace?category=social" className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium">
                Show all accounts <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {socialMediaItems.map((item, i) => (
                <IconItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Subscriptions & AI Accounts */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Subscriptions & AI Accounts</h2>
              <Link to="/marketplace?category=streaming" className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium">
                Show all accounts <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {subscriptionItems.map((item, i) => (
                <IconItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
