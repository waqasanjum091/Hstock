# PVA Brand - Complete Deployment Checklist

## Quick Reference

**Frontend (React)**: No longer uses port 5173 after deployment  
**Backend (Laravel)**: Database + API running on cPanel  
**Database**: MySQL (or SQLite for development)  
**Domain**: yourdomain.com  
**API Access**: https://yourdomain.com/api  
**Frontend Access**: https://yourdomain.com  

---

## Pre-Deployment Checklist

### Database Preparation
- [ ] 22 Laravel migrations created and tested
- [ ] Database seeders created (roles, permissions)
- [ ] SQLite to MySQL migration path verified
- [ ] Backup strategy planned
- [ ] Database credentials secured

### Frontend Build
- [ ] All 16 pages completed and tested
- [ ] Environment variables configured
- [ ] API URLs pointing to correct endpoint
- [ ] Production build created: `npm run build`
- [ ] dist/ folder contains optimized files

### Backend Setup
- [ ] All routes configured
- [ ] Controllers created for each entity
- [ ] Authentication (Sanctum) configured
- [ ] CORS configured for frontend domain
- [ ] Error handling implemented
- [ ] Logging configured

---

## Step 1: Prepare cPanel Environment (5 minutes)

### Create Database
```bash
# In cPanel > MySQL Databases
Database Name: websouls_pvabrand
Username: pvabrand_user
Password: [Generate strong password]
Host: localhost
```

**Save credentials for later**

### Create FTP/SFTP User
```bash
# In cPanel > FTP Accounts
Username: your_ftp_username
Password: your_ftp_password
Home Directory: public_html
```

---

## Step 2: Upload Backend Files (10 minutes)

### Via FTP/SFTP

1. Connect to server using FileZilla or Cyberduck
2. Create folder `/public_html/api/`
3. Upload all backend files:
   - `app/` folder
   - `bootstrap/` folder
   - `config/` folder
   - `database/` folder
   - `routes/` folder
   - `storage/` folder
   - `vendor/` folder (or install via SSH)
   - `artisan` file
   - `composer.json`
   - `.env` (create next step)

### Set Permissions
```bash
# Via SSH (in cPanel Terminal)
cd public_html/api
chmod 755 .
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 644 .env
```

---

## Step 3: Configure Backend (5 minutes)

### Create .env File
Create `/public_html/api/.env` with:

```env
# Application
APP_NAME=PVABrand
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com/api
APP_KEY=base64:YOUR_KEY_HERE

# Database (MySQL)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=websouls_pvabrand
DB_USERNAME=pvabrand_user
DB_PASSWORD=your_password_here

# Cache & Session
CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

# Mail (Update with your email)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com

# CORS & Frontend
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SANCTUM_SECURE_COOKIES=true

# API Settings
API_PREFIX=api
```

---

## Step 4: Install Backend (10 minutes)

### Via SSH

```bash
# Connect via SSH
ssh your_username@yourdomain.com

# Navigate to backend
cd public_html/api

# Install dependencies
composer install --optimize-autoloader --no-dev

# Generate key (if not done)
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed data (optional - for test data)
php artisan db:seed

# Clear caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Verify Installation
```bash
# Test API is accessible
curl https://yourdomain.com/api/health

# Should return 200 status
```

---

## Step 5: Build Frontend (5 minutes)

### On Your Local Machine

```bash
cd pvabrand-app

# Update .env before building
echo "VITE_API_URL=https://yourdomain.com/api" > .env

# Build production
npm run build

# This creates dist/ folder with optimized files
```

---

## Step 6: Upload Frontend Files (10 minutes)

### Via FTP/SFTP

1. Connect to `/public_html/`
2. **Important**: Do NOT delete `/api/` folder
3. Upload contents of `dist/` folder to root:
   - `assets/` folder → `/public_html/assets/`
   - `index.html` → `/public_html/index.html`
   - `favicon.ico` → `/public_html/favicon.ico`

### Final Structure
```
public_html/
├── api/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── routes/
│   ├── .env
│   └── artisan
├── assets/
├── index.html
├── favicon.ico
└── .htaccess
```

---

## Step 7: Configure Routing (5 minutes)

### Create .htaccess for React Router

In `/public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Skip /api folder - let Laravel handle it
  RewriteCond %{REQUEST_URI} ^/api [NC]
  RewriteRule ^ - [L]
  
  # Skip existing files and directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Rewrite all other requests to index.html (React routing)
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

### Laravel .htaccess (Should Already Exist)

In `/public_html/api/public/.htaccess`:
Should already exist from Laravel installation.

---

## Step 8: Enable SSL Certificate (3 minutes)

### Auto SSL
1. cPanel > AutoSSL
2. Install certificate for your domain
3. Verify both `yourdomain.com` and `www.yourdomain.com`

### Let's Encrypt (Free)
1. cPanel > SSL/TLS Manager
2. Auto-generate certificate for all subdomains
3. Wait 5-10 minutes for activation

### Redirect HTTP to HTTPS
Add to `/public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## Step 9: Verification Tests

### Test 1: Frontend Loads
- [ ] Open `https://yourdomain.com` in browser
- [ ] Page loads without errors
- [ ] Logo and content visible

### Test 2: API Responds
- [ ] Open `https://yourdomain.com/api` in browser
- [ ] Should show 200 status or JSON response
- [ ] No CORS errors in console

### Test 3: Register User
- [ ] Go to `https://yourdomain.com/register`
- [ ] Fill in details
- [ ] Click Register
- [ ] Should redirect to dashboard

### Test 4: Login
- [ ] Go to `https://yourdomain.com/login`
- [ ] Use registered credentials
- [ ] Should log in successfully
- [ ] Should redirect based on role

### Test 5: Create Order (Customer)
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout
- [ ] Order should be in database

### Test 6: Admin Panel
- [ ] Login as admin
- [ ] Visit `https://yourdomain.com/admin`
- [ ] View dashboard with stats
- [ ] Test user/vendor/order management

---

## Step 10: Performance Optimization

### Enable Caching
```bash
# SSH into server
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Enable Gzip Compression
Add to `/public_html/.htaccess`:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
</IfModule>
```

### Browser Caching
Add to `/public_html/.htaccess`:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Troubleshooting Guide

### Issue: 500 Error
**Solution**:
```bash
# Check error log
tail -f /home/your_username/public_html/api/storage/logs/laravel.log

# Set permissions
chmod -R 755 storage bootstrap/cache

# Clear cache
php artisan cache:clear
php artisan config:clear
```

### Issue: CORS Error
**Solution**:
Update `/public_html/api/.env`:
```env
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
APP_URL=https://yourdomain.com/api
```

Then:
```bash
php artisan config:cache
```

### Issue: Database Connection Error
**Solution**:
1. Verify credentials in `.env`
2. Test connection in cPanel
3. Check DB_HOST (usually `localhost`)
4. Verify database user has all privileges

### Issue: 404 on React Routes
**Solution**:
Ensure `.htaccess` exists in `/public_html/` with React routing rules.

### Issue: Frontend Shows Old Content
**Solution**:
```bash
# Clear browser cache
# Or hard refresh: Ctrl+Shift+R

# Clear server cache
php artisan cache:clear
```

---

## Security Checklist

- [ ] APP_DEBUG=false in production .env
- [ ] Strong database password set
- [ ] SSL certificate installed
- [ ] CORS properly configured
- [ ] API authentication enabled (Sanctum)
- [ ] Sensitive data not in version control
- [ ] Error messages don't expose system info
- [ ] Regular backups enabled
- [ ] Log files monitored
- [ ] File permissions correctly set (755/644)

---

## Backup & Maintenance

### Daily Backup
In cPanel > Backups:
- Enable automatic backups
- Store offsite

### Database Backup
```bash
# Manual backup
mysqldump -u pvabrand_user -p websouls_pvabrand > backup_$(date +%Y%m%d).sql

# Restore
mysql -u pvabrand_user -p websouls_pvabrand < backup_20260627.sql
```

### Monitor Logs
```bash
# View recent errors
tail -f storage/logs/laravel.log

# Search for specific errors
grep "ERROR" storage/logs/laravel.log
```

---

## Post-Deployment Steps

### 1. Monitor Performance
- Check load times
- Monitor CPU usage
- Watch error logs for issues

### 2. Set Up Email
- Configure SMTP in .env
- Test email delivery
- Set up notification emails

### 3. Add Analytics
- Set up Google Analytics
- Track user behavior
- Monitor conversion rates

### 4. Create Admin User
```bash
# SSH into server
cd public_html/api
php artisan tinker

# In tinker shell
$user = \App\Models\User::create(['name' => 'Admin', 'email' => 'admin@yourdomain.com', 'password' => bcrypt('password123')]);
$user->assignRole('super-admin');
exit
```

### 5. Test All Features
- [ ] User registration
- [ ] Product browsing
- [ ] Shopping cart
- [ ] Checkout/payment flow
- [ ] Order tracking
- [ ] Vendor dashboard
- [ ] Admin panel

---

## Running Without Port 5173

### Production (No Port Shown)
```
https://yourdomain.com → Frontend runs on standard HTTPS port (443)
https://yourdomain.com/api → Backend API
```

### Development (Different Port)
```bash
# Frontend on port 3000
npm run dev -- --port 3000

# Backend on port 8000
php artisan serve --port 8000

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000/api
```

### Build Without Port
```bash
npm run build
npx http-server dist -p 80
# Access on port 80 (default HTTP)
```

---

## FAQ

**Q: How do I change ports after deployment?**  
A: In production, HTTP/HTTPS use default ports 80/443. You don't specify them in URLs.

**Q: Can I run frontend and backend on same domain?**  
A: Yes! `/api` path routes to backend, rest routes to frontend via `.htaccess`

**Q: How do I migrate from SQLite to MySQL?**  
A: Change `.env` DB settings, run migrations, data will populate in MySQL.

**Q: What if I get CORS error?**  
A: Check `SANCTUM_STATEFUL_DOMAINS` in `.env` includes your domain.

**Q: How do I backup the database?**  
A: Use `mysqldump` command or cPanel backup feature.

**Q: Can I use subdomains instead?**  
A: Yes - frontend on `app.domain.com`, backend on `api.domain.com`

---

## Timeline

- **Phase 1 (cPanel Setup)**: 5 min
- **Phase 2 (File Upload)**: 10 min
- **Phase 3 (Configuration)**: 5 min
- **Phase 4 (Installation)**: 10 min
- **Phase 5 (Frontend Build & Upload)**: 10 min
- **Phase 6 (Routing)**: 5 min
- **Phase 7 (SSL)**: 3 min
- **Phase 8 (Testing)**: 15 min
- **Phase 9 (Optimization)**: 10 min
- **Total Time**: ~73 minutes (About 1.5 hours)

---

## Success Indicators

✅ **You'll Know It's Working When:**
1. Frontend loads: `https://yourdomain.com`
2. API responds: `https://yourdomain.com/api`
3. User can register
4. User can login
5. Admin panel shows data
6. Orders can be placed
7. No console errors
8. HTTPS working on all pages

---

**Status**: ✅ Ready for Deployment  
**Complexity**: Intermediate  
**Support**: Check documentation or hosting support  

---

For detailed information, see:
- `BACKEND_DEPLOYMENT.md` - cPanel deployment guide
- `FRONTEND_DEPLOYMENT.md` - Running frontend on different ports
- `DATABASE_SCHEMA.md` - Database structure and migrations
- `SETUP.md` - Local development setup
