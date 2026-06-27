import { useApp } from '../../context/AppContext'

export default function DashboardPage() {
  const { user } = useApp()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.roles?.[0] || 'Customer'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="/account/orders" className="text-orange-600 hover:text-orange-700">View Orders</a></li>
            <li><a href="/account/wishlist" className="text-orange-600 hover:text-orange-700">View Wishlist</a></li>
            <li><a href="/account/addresses" className="text-orange-600 hover:text-orange-700">Manage Addresses</a></li>
            <li><a href="/" className="text-orange-600 hover:text-orange-700">Continue Shopping</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
