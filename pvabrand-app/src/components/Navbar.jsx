import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSearch, FiShoppingBag, FiUser, FiLogOut, FiGrid, FiChevronDown } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Marketplace', path: '/marketplace' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery, cartCount, isAuthenticated, user, logout, isAdmin, isVendor } = useApp()

  // Where the account menu "Dashboard" link should point, based on role
  const dashboardPath = isAdmin ? '/admin' : isVendor ? '/vendor' : '/account'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setIsMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-black text-white text-sm group-hover:scale-110 transition-transform shadow-md shadow-orange-200">
              PV
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              PVA <span className="text-orange-500">Brand</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
            >
              <FiSearch size={18} />
            </button>

            {/* Cart */}
            <Link
              to="/marketplace"
              className="p-2.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all relative"
            >
              <FiShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth: signed out → Sign in / Sign up */}
            {!isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Auth: signed in → account menu */}
            {isAuthenticated && (
              <div className="hidden sm:block relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold uppercase">
                    {user?.name?.charAt(0) || <FiUser size={14} />}
                  </span>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <FiChevronDown size={14} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link to={dashboardPath} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <FiGrid size={16} className="text-orange-500" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search accounts, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated ? (
                <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-lg text-gray-700 font-semibold text-sm text-center border border-gray-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
                  <Link
                    to={dashboardPath}
                    className="block px-4 py-3 rounded-lg bg-orange-50 text-orange-700 font-semibold text-sm text-center"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full block px-4 py-3 rounded-lg text-red-600 font-semibold text-sm text-center"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
