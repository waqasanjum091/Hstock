import { motion } from 'framer-motion'

export default function SectionHeader({ badge, title, description, align = 'center' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-wider mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        {title.split(' ').map((word, i) => {
          const isOrange = ['Premium', 'Best', 'Top', 'Featured', 'Trusted', 'Why', 'Live', 'Trending', 'Newest', 'Our'].includes(word)
          return (
            <span key={i} className={isOrange ? 'text-orange-gradient' : ''}>
              {word}{' '}
            </span>
          )
        })}
      </h2>
      {description && (
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  )
}
