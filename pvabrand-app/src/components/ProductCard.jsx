import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiClock, FiShoppingBag, FiZap } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { formatPrice, getDiscountPercent } from '../utils/helpers'
import brandIcons from '../data/brandIcons'

export default function ProductCard({ product, index = 0 }) {
  const { openPurchaseModal } = useApp()
  const discount = getDiscountPercent(product.originalPrice, product.price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-50"
    >
      {/* Image / Icon Area */}
      <div className={`relative h-40 bg-gradient-to-br ${product.gradient} p-6 flex items-center justify-center`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 blur-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/20 blur-xl" />
        </div>

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
            {product.badge}
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}

        {/* Icon */}
        <Link to={`/product/${product.slug}`} className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 p-1.5">
          {product.iconKey && brandIcons[product.iconKey] ? (
            <div className="w-full h-full">{brandIcons[product.iconKey].svg}</div>
          ) : (
            <FiShoppingBag size={36} className="text-white" />
          )}
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Delivery */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">
            {product.category.replace('-', ' ')}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            {product.deliveryType === 'Instant' ? <FiZap size={10} className="text-green-500" /> : <FiClock size={10} />}
            <span>{product.deliveryTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-orange-500 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={11}
                  className={i < Math.floor(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-0.5">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
          </div>
          <span className="text-[10px] text-gray-400">
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${product.stock > 100 ? 'bg-green-400' : product.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'}`} />
            {product.stock.toLocaleString()} in stock
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-[11px] text-gray-400 line-through ml-1.5">{formatPrice(product.originalPrice)}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              openPurchaseModal(product)
            }}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold text-xs hover:bg-orange-600 transition-colors flex items-center gap-1.5 shadow-sm shadow-orange-200"
          >
            <FiShoppingBag size={13} /> Buy Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
