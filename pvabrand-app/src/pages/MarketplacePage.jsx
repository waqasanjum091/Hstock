import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { categories } from '../data/products'
import { productService } from '../services/productService'
import { mapProduct } from '../utils/mapProduct'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import { useScrollToTop, useDebounce } from '../hooks/useAnimations'

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A-Z' },
]

export default function MarketplacePage() {
  useScrollToTop()
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const initialSearch = searchParams.get('search') || ''

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [sortBy, setSortBy] = useState('popular')
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll({ per_page: 100 }),
  })
  const products = useMemo(() => (data?.data || []).map(mapProduct), [data])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.reviews - a.reviews)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [products, selectedCategory, debouncedSearch, sortBy])

  return (
    <>
      <SEO
        title="Marketplace"
        description="Browse our complete marketplace of verified digital accounts."
        url="/marketplace"
      />

      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <span className="text-orange-gradient">Marketplace</span>
            </h1>
            <p className="text-gray-500">
              Browse {products.length} verified digital accounts and services
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 appearance-none cursor-pointer min-w-[180px] transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-all"
            >
              <FiFilter size={16} /> Filters
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className={`${showMobileFilter ? 'block' : 'hidden'} lg:block w-full lg:w-56 flex-shrink-0`}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory('all'); setShowMobileFilter(false) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === 'all'
                        ? 'text-orange-600 bg-orange-50 font-medium'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    All Products ({products.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setShowMobileFilter(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'text-orange-600 bg-orange-50 font-medium'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gray-400">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="flex-1">
              {isLoading ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
                    className="mt-4 px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
