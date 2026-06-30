/*
 * Converts a product document returned by the API into the flat shape the
 * storefront components (ProductCard, MarketplacePage, ProductDetailPage) expect.
 * UI-only fields live on the product's `specifications` (set by the seed script).
 */
export function mapProduct(p) {
  if (!p) return null
  const s = p.specifications || {}
  const price = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0
  return {
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.name,
    slug: p.slug,
    category: s.category || p.category?.slug || 'social',
    iconKey: s.iconKey || '',
    shortDescription: p.short_description || s.shortDescription || '',
    description: p.description || '',
    price,
    originalPrice: s.originalPrice ?? price,
    rating: p.avg_rating ?? s.rating ?? 0,
    reviews: p.reviews_count ?? s.reviews ?? 0,
    stock: p.quantity ?? 0,
    deliveryType: s.deliveryType || 'Instant',
    deliveryTime: s.deliveryTime || '',
    badge: s.badge || null,
    badgeColor: s.badgeColor || 'bg-green-500',
    gradient: s.gradient || 'from-gray-500 to-gray-700',
    features: s.features || [],
    minOrder: s.minOrder || 1,
    maxOrder: s.maxOrder || 100,
  }
}

export function mapProducts(list = []) {
  return list.map(mapProduct).filter(Boolean)
}
