# PVA Brand Backend - cPanel Deployment Guide

## Database Structure Overview

### SQL Migrations (22 Total)
Your Laravel backend uses migrations to create the database structure:

1. **Users & Authentication**
   - `create_users_table.php` - User accounts
   - `create_cache_table.php` - Cache storage
   - `create_jobs_table.php` - Queue jobs
   - `create_permission_tables.php` - Roles & permissions (Spatie)

2. **E-commerce Core**
   - `create_categories_table.php` - Product categories
   - `create_brands_table.php` - Brand information
   - `create_products_table.php` - Product details
   - `create_product_images_table.php` - Product images
   - `create_inventory_table.php` - Stock management

3. **Vendor Management**
   - `create_vendor_profiles_table.php` - Store information

4. **Orders & Payments**
   - `create_carts_table.php` - Shopping cart
   - `create_orders_table.php` - Order records
   - `create_order_items_table.php` - Items in orders
   - `create_payments_table.php` - Payment info

5. **Customer Features**
   - `create_wishlists_table.php` - Saved items
   - `create_shipping_addresses_table.php` - Delivery addresses

6. **Communication**
   - `create_conversations_messages_table.php` - Chat/messages
   - `create_contact_inquiries_table.php` - Contact form submissions

7. **Content & Moderation**
   - `create_reviews_table.php` - Product reviews
   - `create_banners_table.php` - Promotional banners
   - `create_settings_table.php` - App settings

8. **Logging & Analytics**
   - `create_user_notifications_table.php` - Notifications
   - `create_activity_logs_table.php` - User activities

## Current Database Configuration
- **Type**: SQLite (file-based)
- **File**: `database/database.sqlite`
- **For Production**: Switch to MySQL/MariaDB

---

## Step-by-Step cPanel Deployment

### Phase 1: cPanel Setup (2-3 minutes)

#### 1.1 Create Database
1. Log into cPanel
2. Go to **MySQL® Databases**
3. Click **Create New Database**
   - Database Name: `websouls_pvabrand` (cPanel auto-prefixes your username)
   - Click **Create Database**

#### 1.2 Create Database User
1. In MySQL Databases section, go to **MySQL Users**
2. Click **Create New User**
   - Username: `pvabrand_user`
   - Password: Generate strong password (save this!)
   - Click **Create User**

#### 1.3 Assign Privileges
1. Under "Add User To Database"
2. Select user: `pvabrand_user`
3. Select database: `websouls_pvabrand`
4. Click **Add**
5. Check **ALL PRIVILEGES**
6. Click **Make Changes**

#### 1.4 Get Database Credentials
- **Host**: `localhost` (default)
- **Database**: `websouls_pvabrand`
- **Username**: `pvabrand_user`
- **Password**: Your generated password

---

### Phase 2: File Upload (5-10 minutes)

#### 2.1 Connect via FTP/SFTP
1. Get FTP credentials from cPanel > FTP Accounts
2. Use FileZilla, Cyberduck, or WinSCP
3. Connect to your cPanel host

#### 2.2 Upload Backend Files
1. Navigate to your public_html directory
2. Create folder: `api` (or your preferred path)
3. Upload ALL backend files to `/public_html/api/`
4. Keep the exact structure (app/, config/, database/, etc.)

**Important: Directory Structure**
```
public_html/
├── api/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── .env (created in next step)
│   ├── artisan
│   ├── composer.json
│   └── public/
│       └── index.php (Laravel entry point)
└── index.html (frontend)
```

#### 2.3 Set Permissions
After upload, set correct permissions via SSH or FTP:
```bash
chmod 755 /public_html/api
chmod 755 /public_html/api/storage
chmod 755 /public_html/api/bootstrap/cache
chmod 644 /public_html/api/.env
```

---

### Phase 3: Configuration (3-5 minutes)

#### 3.1 Create .env File
1. In `/public_html/api/`, create file `.env`
2. Copy content from `.env.example`
3. Update with your settings:

```env
APP_NAME=PVABrand
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com/api

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=websouls_pvabrand
DB_USERNAME=pvabrand_user
DB_PASSWORD=your_database_password_here

CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com

SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com,api.yourdomain.com
```

#### 3.2 Important Settings Explained

**For SQLite to MySQL Migration:**
```env
# OLD (local):
DB_CONNECTION=sqlite

# NEW (production):
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=websouls_pvabrand
DB_USERNAME=pvabrand_user
DB_PASSWORD=your_password
```

---

### Phase 4: Installation (5-10 minutes)

#### 4.1 Connect via SSH
In cPanel > Terminal (or use Putty)

#### 4.2 Navigate to Backend
```bash
cd public_html/api
```

#### 4.3 Install PHP Dependencies
```bash
composer install --optimize-autoloader --no-dev
```

#### 4.4 Generate App Key
```bash
php artisan key:generate
```

#### 4.5 Run Migrations
```bash
php artisan migrate --force
```

#### 4.6 Run Seeders (Optional - for test data)
```bash
php artisan db:seed
```

#### 4.7 Clear Caches
```bash
php artisan config:cache
php artisan view:cache
php artisan route:cache
```

---

### Phase 5: Frontend Deployment (5-10 minutes)

#### 5.1 Build Frontend
On your local machine:
```bash
cd pvabrand-app
npm run build
```

This creates a `dist/` folder with production files.

#### 5.2 Update Frontend API URL
Before building, update `.env` in pvabrand-app:
```env
VITE_API_URL=https://yourdomain.com/api
```

Then rebuild:
```bash
npm run build
```

#### 5.3 Upload Frontend Files
1. Upload contents of `pvabrand-app/dist/` to `/public_html/`
2. Replace any existing index.html
3. Keep the API folder untouched

**Final Structure:**
```
public_html/
├── api/                    (Laravel backend)
├── assets/                 (React app assets)
├── index.html             (React entry point)
└── favicon.ico
```

---

### Phase 6: Configure Routing

#### 6.1 Create .htaccess for Frontend
In `/public_html/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Except for the /api folder
  RewriteCond %{REQUEST_URI} !^/api
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Route all other requests to index.html (React Router)
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

#### 6.2 Ensure Backend .htaccess Exists
Check `/public_html/api/public/.htaccess` exists (Laravel provides this by default).

---

### Phase 7: SSL Certificate (Recommended)

1. In cPanel > AutoSSL or Let's Encrypt
2. Ensure certificate covers:
   - yourdomain.com
   - www.yourdomain.com
   - api.yourdomain.com (if using subdomain)

3. Test with browser: `https://yourdomain.com/api`

---

### Phase 8: Verification Checklist

- [ ] Database created and accessible
- [ ] Backend files uploaded to `/api` folder
- [ ] `.env` file configured with correct credentials
- [ ] Composer dependencies installed
- [ ] Migrations ran successfully
- [ ] Frontend files uploaded to root
- [ ] `.htaccess` configured for React routing
- [ ] SSL certificate active
- [ ] Test login: `https://yourdomain.com/login`
- [ ] Test API: `https://yourdomain.com/api/admin/dashboard` (with auth token)

---

## Running Without Port 5173

### Option 1: Production Server (Recommended)
After deployment on cPanel, your app runs on:
- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://yourdomain.com/api`
- **No port needed** - uses HTTPS (port 443)

### Option 2: Local Development on Different Port

#### For Frontend:
```bash
cd pvabrand-app
npm run dev -- --port 3000
```

Or change the dev script in `package.json`:
```json
"dev": "vite --port 3000"
```

#### For Backend (Laravel):
```bash
cd backend
php artisan serve --port 8080
```

Or use host option:
```bash
php artisan serve --host 0.0.0.0 --port 8080
```

Then update frontend `.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

### Option 3: Production Build (Locally)
```bash
cd pvabrand-app
npm run build
npx http-server dist -p 3000
```

Access at: `http://localhost:3000`

---

## Common Issues & Solutions

### Issue: 500 Error on API calls
**Solution:**
1. Check storage/ folder permissions: `chmod -R 755 storage/`
2. Check `.env` database credentials
3. Check error logs: `storage/logs/laravel.log`

### Issue: CORS Errors
**Solution:** Update `.env`:
```env
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
APP_URL=https://yourdomain.com
```

Then clear cache:
```bash
php artisan config:cache
```

### Issue: 404 on React routes
**Solution:** Ensure `.htaccess` is in root directory with React routing rules.

### Issue: Database not found
**Solution:**
```bash
php artisan migrate --force
php artisan db:seed
```

### Issue: Can't connect to database
**Solution:**
1. Verify credentials in `.env`
2. Test in cPanel: MySQL Databases > Check connection
3. SSH and test: `mysql -u pvabrand_user -p`

---

## Testing API Endpoints

### Test Backend is Running
```bash
curl https://yourdomain.com/api/health
```

Should return status 200.

### Test Authentication
```bash
# Login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Should return token
```

### Test Protected Route
```bash
curl https://yourdomain.com/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Backup & Maintenance

### Daily Backups
In cPanel > Backups:
- Enable automatic backups
- Store externally

### Monitor Logs
```bash
# View recent errors
tail -f storage/logs/laravel.log

# Monitor real-time
php artisan pail
```

### Database Backup
```bash
# Export database
mysqldump -u pvabrand_user -p websouls_pvabrand > backup.sql

# Import database
mysql -u pvabrand_user -p websouls_pvabrand < backup.sql
```

---

## Performance Optimization

### Enable Caching
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Optimize Autoloader
```bash
composer install --optimize-autoloader --no-dev
```

### Enable GZIP Compression
Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

---

## Support Resources

- **Laravel Docs**: https://laravel.com/docs
- **cPanel Support**: Contact your hosting provider
- **WebSouls Support**: Check your hosting account dashboard

## Quick Reference Commands

```bash
# SSH into server
ssh yourusername@yourdomain.com

# Navigate to backend
cd public_html/api

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed

# Clear all caches
php artisan cache:clear && php artisan config:clear

# Tinker shell for testing
php artisan tinker

# Check PHP version
php -v

# Check Composer version
composer --version
```

---

**Deployment Status**: ✅ Ready to Deploy
**Estimated Setup Time**: 30-45 minutes
**Skill Level**: Intermediate (basic SSH/cPanel knowledge required)
