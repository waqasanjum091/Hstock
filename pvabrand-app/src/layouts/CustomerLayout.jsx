import DashboardLayout from './DashboardLayout'

const links = [
  { to: '/account', label: 'Dashboard', end: true },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/disputes', label: 'Disputes' },
  { to: '/account/messages', label: 'Messages' },
  { to: '/account/wishlist', label: 'Wishlist' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/', label: 'Shop', end: true },
]

export default function CustomerLayout() {
  return <DashboardLayout title="My Account" links={links} />
}
