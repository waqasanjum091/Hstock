import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiSend } from 'react-icons/fi'
import { FaTelegram, FaWhatsapp, FaTwitter, FaDiscord, FaYoutube } from 'react-icons/fa'

const footerLinks = {
  Marketplace: [
    { name: 'All Products', path: '/marketplace' },
    { name: 'Social Media', path: '/marketplace?category=social' },
    { name: 'Email Accounts', path: '/marketplace?category=email' },
    { name: 'Finance & Crypto', path: '/marketplace?category=finance' },
    { name: 'Streaming', path: '/marketplace?category=streaming' },
  ],
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/about' },
  ],
  Support: [
    { name: 'Help Center', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'FAQ', path: '/about#faq' },
    { name: 'Refund Policy', path: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-10 border-b border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Stay Updated</h3>
              <p className="text-gray-500 mt-1 text-sm">Get the latest deals and new product announcements.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 rounded-l-lg bg-gray-50 border border-gray-200 border-r-0 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 text-sm"
              />
              <button className="px-5 py-2.5 rounded-r-lg bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors flex items-center gap-2">
                <FiSend size={14} /> Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-orange-200">
                PV
              </div>
              <span className="text-xl font-bold text-gray-900">
                PVA <span className="text-orange-500">Brand</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-xs">
              Your trusted marketplace for premium digital accounts. Fast delivery, secure payments, and 24/7 support.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FaTwitter, href: '#' },
                { icon: FaTelegram, href: '#' },
                { icon: FaWhatsapp, href: '#' },
                { icon: FaDiscord, href: '#' },
                { icon: FaYoutube, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                >
                  <social.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-500 hover:text-orange-500 text-sm transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      <FiArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PVA Brand. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
