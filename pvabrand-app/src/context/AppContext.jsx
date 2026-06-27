import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'

const AppContext = createContext()

export function AppProvider({ children }) {
  // UI States
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cartItems, setCartItems] = useState([])

  // Auth States
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pvabrand_user')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    // Ensure roles are always an array of strings
    if (parsed && parsed.roles) {
      parsed.roles = parsed.roles.map((r) => (typeof r === 'string' ? r : r.name))
    }
    return parsed
  })
  const [token, setToken] = useState(() => localStorage.getItem('pvabrand_token'))
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)

  // UI Callbacks
  const openPurchaseModal = useCallback((product) => {
    setSelectedProduct(product)
    setIsPurchaseModalOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closePurchaseModal = useCallback(() => {
    setIsPurchaseModalOpen(false)
    setSelectedProduct(null)
    document.body.style.overflow = 'unset'
  }, [])

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(212,175,55,0.3)' },
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Auth Callbacks
  const login = useCallback((userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)
    localStorage.setItem('pvabrand_user', JSON.stringify(userData))
    localStorage.setItem('pvabrand_token', authToken)
  }, [])

  const logout = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await authService.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
      localStorage.removeItem('pvabrand_user')
      localStorage.removeItem('pvabrand_token')
    }
  }, [isAuthenticated])

  const isAdmin = user?.roles?.includes('super-admin') ?? false
  const isVendor = user?.roles?.includes('vendor') ?? false
  const isCustomer = user?.roles?.includes('customer') ?? false

  return (
    <AppContext.Provider
      value={{
        // UI
        isPurchaseModalOpen,
        selectedProduct,
        openPurchaseModal,
        closePurchaseModal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cartItems,
        addToCart,
        removeFromCart,
        cartCount,
        // Auth
        user,
        token,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        isVendor,
        isCustomer,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
