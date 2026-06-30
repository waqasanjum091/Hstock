import DashboardLayout from './DashboardLayout'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/vendors', label: 'Vendors' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/disputes', label: 'Disputes' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/inquiries', label: 'Inquiries' },
]

export default function AdminLayout() {
  return <DashboardLayout title="Admin Panel" links={links} />
}
