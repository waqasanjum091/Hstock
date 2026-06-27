import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiClock, FiShoppingBag, FiZap, FiCheck, FiArrowLeft, FiShield, FiTruck, FiHeadphones, FiChevronRight } from 'react-icons/fi'
import { products } from '../data/products'
import brandIcons from '../data/brandIcons'
import { useApp } from '../context/AppContext'
import { formatPrice, getDiscountPercent } from '../utils/helpers'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { useScrollToTop } from '../hooks/useAnimations'

export default function ProductDetailPage() {
  useScrollToTop()
  const { slug } = useParams()
  const { openPurchaseModal } = useApp()

  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/marketplace" className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
            Browse Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const discount = getDiscountPercent(product.originalPrice, product.price)
  const brandIcon = product.iconKey ? brandIcons[product.iconKey] : null
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <>
      <SEO title={product.name} description={product.description} url={`/product/${product.slug}`} />

      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <FiChevronRight size={14} />
            <Link to="/marketplace" className="hover:text-orange-500 transition-colors">Marketplace</Link>
            <FiChevronRight size={14} />
            <span className="text-gray-600">{product.name}</span>
          </div>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className={`relative h-72 md:h-96 bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-6 right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                </div>
                {brandIcon ? (
                  <div className="relative z-10 w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center p-3">
                    {brandIcon.svg}
                  </div>
                ) : (
                  <div className="relative z-10 w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <product.icon size={48} className="text-white" />
                  </div>
                )}
                {product.badge && (
                  <div className={`absolute top-4 left-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                    {product.badge}
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Save {discount}%
                  </div>
                )}
              </div>

              {/* Features grid below image */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">What's Included</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCheck size={14} className="text-orange-500 flex-shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Title & Rating */}
              <div>
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                  {product.category.replace('-', ' ')}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} size={16} className={i < Math.floor(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-bold text-orange-500">{formatPrice(product.price)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  {discount > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">Per account &bull; Bulk discounts available</p>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Delivery Type</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    {product.deliveryType === 'Instant' ? <FiZap size={14} className="text-orange-500" /> : <FiClock size={14} className="text-gray-400" />}
                    {product.deliveryType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Delivery Time</span>
                  <span className="font-medium text-gray-900">{product.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">In Stock</span>
                  <span className={`font-medium ${product.stock > 100 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {product.stock.toLocaleString()} available
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Min Order</span>
                  <span className="font-medium text-gray-900">{product.minOrder} accounts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Max Order</span>
                  <span className="font-medium text-gray-900">{product.maxOrder} accounts</span>
                </div>
              </div>

              {/* Buy Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openPurchaseModal(product)}
                className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
              >
                <FiShoppingBag size={18} /> Buy Now
              </motion.button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FiShield, label: 'Secure Payment' },
                  { icon: FiTruck, label: 'Fast Delivery' },
                  { icon: FiHeadphones, label: '24/7 Support' },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-white border border-gray-100 text-center">
                    <badge.icon size={18} className="text-orange-500" />
                    <span className="text-[11px] text-gray-500 font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                <Link to="/marketplace" className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
                  View All <FiArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
