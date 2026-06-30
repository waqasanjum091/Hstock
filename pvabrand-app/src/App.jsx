import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PurchaseModal from './components/PurchaseModal'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import HomePage from './pages/HomePage'
import MarketplacePage from './pages/MarketplacePage'
import ProductDetailPage from './pages/ProductDetailPage'
import ServicesPage from './pages/ServicesPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Shared Pages
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'

// Admin Pages
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/DashboardPage'
import AdminUsers from './pages/admin/UsersPage'
import AdminVendors from './pages/admin/VendorsPage'
import AdminProducts from './pages/admin/ProductsPage'
import AdminOrders from './pages/admin/OrdersPage'
import AdminBanners from './pages/admin/BannersPage'
import AdminInquiries from './pages/admin/InquiriesPage'
import AdminDisputes from './pages/admin/DisputesPage'

// Vendor Pages
import VendorLayout from './layouts/VendorLayout'
import VendorDashboard from './pages/vendor/DashboardPage'
import VendorProducts from './pages/vendor/ProductsPage'
import VendorAddProduct from './pages/vendor/AddProductPage'
import VendorOrders from './pages/vendor/OrdersPage'
import VendorProfile from './pages/vendor/ProfilePage'
import VendorDisputes from './pages/vendor/DisputesPage'
import VendorMessages from './pages/vendor/MessagesPage'

// Customer Pages
import CustomerLayout from './layouts/CustomerLayout'
import CustomerDashboard from './pages/account/DashboardPage'
import CustomerOrders from './pages/account/OrdersPage'
import CustomerWishlist from './pages/account/WishlistPage'
import CustomerAddresses from './pages/account/AddressesPage'
import CustomerDisputes from './pages/account/DisputesPage'
import CustomerMessages from './pages/account/MessagesPage'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <PurchaseModal />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/marketplace"
          element={
            <PublicLayout>
              <MarketplacePage />
            </PublicLayout>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <PublicLayout>
              <ProductDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/services"
          element={
            <PublicLayout>
              <ServicesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <PublicLayout>
              <BlogPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <PrivacyPage />
            </PublicLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicLayout>
              <TermsPage />
            </PublicLayout>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Shared Routes */}
        <Route
          path="/cart"
          element={
            <PublicLayout>
              <CartPage />
            </PublicLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['super-admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute roles={['vendor']}>
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="products/add" element={<VendorAddProduct />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="disputes" element={<VendorDisputes />} />
          <Route path="messages" element={<VendorMessages />} />
          <Route path="profile" element={<VendorProfile />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute roles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="disputes" element={<CustomerDisputes />} />
          <Route path="messages" element={<CustomerMessages />} />
          <Route path="wishlist" element={<CustomerWishlist />} />
          <Route path="addresses" element={<CustomerAddresses />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(212,175,55,0.2)',
          },
        }}
      />
    </AppProvider>
  )
}
