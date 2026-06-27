# PVA Brand - Frontend Setup Guide

## Project Overview
PVA Brand is a full-stack multi-vendor marketplace built with React, Node.js/Laravel backend, and MongoDB.

### Key Features Implemented
- **Customer Portal**: Browse products, manage cart, checkout, view orders, wishlists, and addresses
- **Vendor Portal**: Dashboard, product management, order fulfillment, and store profile
- **Admin Dashboard**: User management, vendor approval, product oversight, banner management, and contact inquiries
- **Authentication**: Role-based access control (customer, vendor, admin)
- **API Integration**: Full integration with backend APIs via Axios

## Installation

### Prerequisites
- Node.js (v16+)
- npm (v7+)

### Setup Steps

1. **Install Dependencies**
```bash
cd pvabrand-app
npm install
```

2. **Environment Configuration**
Create or update `.env` file:
```
VITE_API_URL=http://localhost:8000/api
```

3. **Start Development Server**
```bash
npm run dev
```
Server will run on `http://localhost:5173`

4. **Build for Production**
```bash
npm run build
```

5. **Lint Code**
```bash
npm run lint
```

## Project Structure

```
src/
├── pages/              # Page components
│   ├── admin/         # Admin panel pages
│   ├── account/       # Customer account pages
│   ├── vendor/        # Vendor portal pages
│   ├── auth/          # Login/Register pages
│   └── [public pages] # HomePage, Marketplace, etc.
├── layouts/           # Layout wrappers
├── components/        # Reusable components
├── services/          # API services
├── context/           # React context (AppContext)
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── data/              # Static data
└── styles/            # CSS files
```

## Routes Overview

### Public Routes
- `/` - Home page
- `/marketplace` - Browse products
- `/product/:slug` - Product details
- `/services` - Services page
- `/about` - About page
- `/blog` - Blog page
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Authentication Routes
- `/login` - Login page
- `/register` - Registration page

### Shared Routes
- `/cart` - Shopping cart
- `/checkout` - Checkout (protected)

### Customer Routes (Protected - /account)
- `/account` - Dashboard
- `/account/orders` - Order history
- `/account/wishlist` - Saved items
- `/account/addresses` - Shipping addresses

### Vendor Routes (Protected - /vendor)
- `/vendor` - Dashboard with stats
- `/vendor/products` - Product management
- `/vendor/orders` - Order management
- `/vendor/profile` - Store profile settings

### Admin Routes (Protected - /admin)
- `/admin` - Dashboard with analytics
- `/admin/users` - User management
- `/admin/vendors` - Vendor approval/management
- `/admin/products` - Product oversight
- `/admin/orders` - Order management
- `/admin/banners` - Banner management
- `/admin/inquiries` - Contact inquiries

## API Services

All API calls are handled through services in `src/services/`:

- `authService.js` - Authentication
- `productService.js` - Product data
- `orderService.js` - Orders
- `adminService.js` - Admin functions
- `vendorService.js` - Vendor functions
- `wishlistService.js` - Wishlist management
- `cartService.js` - Cart operations

## Technologies Used

- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **React Query 5** - Data fetching & caching
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## Authentication Flow

1. User registers or logs in via `/login` or `/register`
2. Backend returns JWT token and user data
3. Token stored in localStorage as `pvabrand_token`
4. Protected routes check user role and redirect accordingly
5. API requests automatically include token in Authorization header
6. Token removed on logout or 401 response

## Role-Based Access

- **customer** - Access to marketplace, cart, orders, wishlist
- **vendor** - Access to vendor dashboard and product management
- **super-admin** - Full admin panel access

## Development Tips

### Adding New Pages
1. Create page in `src/pages/[section]/NewPage.jsx`
2. Add import to `src/App.jsx`
3. Add Route in appropriate section
4. Add navigation link if needed

### Using API Services
```javascript
import { someService } from '../services/someService'
import { useQuery, useMutation } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['key'],
  queryFn: someService.method
})

const mutation = useMutation({
  mutationFn: someService.method,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] })
    toast.success('Success!')
  }
})
```

### Styling
- Use Tailwind CSS classes
- Common colors: orange-600, gray-700, etc.
- Responsive: `md:`, `lg:` prefixes

## Testing

1. **Manual Testing**
   - Run dev server
   - Test different user roles
   - Verify all routes work
   - Check API integration

2. **Linting**
   ```bash
   npm run lint
   ```

3. **Build Verification**
   ```bash
   npm run build
   ```

## Backend Integration

Backend API should be running at `http://localhost:8000/api`

Key endpoints expected:
- POST `/auth/login`
- POST `/auth/register`
- GET `/admin/dashboard` - Admin stats
- GET `/admin/users` - User list
- GET `/admin/vendors` - Vendor list
- GET `/vendor/stats` - Vendor statistics
- GET `/orders` - User orders
- POST `/checkout` - Place order
- GET `/wishlist` - Wishlist items
- GET `/addresses` - User addresses

## Troubleshooting

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version`

### CORS Issues
- Ensure backend allows frontend origin
- Check VITE_API_URL in .env

### 401 Errors
- Token may have expired
- Try logging out and back in
- Check localStorage for pvabrand_token

### Styling Issues
- Ensure Tailwind CSS is built: `npm run build`
- Check class names for typos

## Next Steps

1. Set up and run the Laravel backend
2. Configure database connections
3. Test API endpoints
4. Deploy to production

## Support

For issues or questions, check:
- Project documentation
- API response error messages
- Browser console for client errors
