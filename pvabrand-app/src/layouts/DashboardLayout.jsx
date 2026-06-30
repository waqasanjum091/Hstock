import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

/*
 * Shared responsive shell for the admin / vendor / customer dashboards.
 * Desktop (lg+): sidebar is a static column. Mobile: sidebar is an off-canvas
 * drawer toggled by a hamburger in the top bar, with a tap-to-close backdrop.
 *
 * Props:
 *   title    — panel name shown in the sidebar header + mobile top bar
 *   subtitle — optional small text under the title (e.g. the user's name)
 *   links    — [{ to, label, end? }]
 *   banner   — optional node rendered above the page content (e.g. vendor approval notice)
 */
export default function DashboardLayout({ title, subtitle, links = [], banner = null }) {
  const navigate = useNavigate()
  const { logout } = useApp()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded text-sm transition-colors ${
      isActive ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
    }`

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 max-w-[80%] bg-gray-900 text-white flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-700 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-orange-400">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400 mt-1 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white flex-shrink-0"
            aria-label="Close menu"
          >
            <FiX size={22} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded text-sm text-red-400 hover:bg-gray-800"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 bg-gray-900 text-white px-4 py-3 flex-shrink-0">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <FiMenu size={22} />
          </button>
          <span className="font-bold text-orange-400">{title}</span>
        </header>

        {banner}

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
