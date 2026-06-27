import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CategoryCard({ category, index }) {
  const Icon = category.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/marketplace?category=${category.id}`}
        className="block bg-white rounded-xl p-5 text-center group border border-gray-200 hover:border-orange-200 hover:shadow-md hover:shadow-orange-50 transition-all duration-300"
      >
        <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
          <Icon size={22} className="text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-orange-500 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-gray-400">{category.count} products</p>
      </Link>
    </motion.div>
  )
}
