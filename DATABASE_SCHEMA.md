# PVA Brand - Database Schema

## Complete Database Structure

### Core Tables (22 Tables Total)

---

## 1. Authentication & User Management

### users
```sql
- id (PRIMARY KEY)
- name VARCHAR(255)
- email VARCHAR(255) UNIQUE
- email_verified_at TIMESTAMP
- password VARCHAR(255)
- remember_token VARCHAR(100)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Store all user accounts (customers, vendors, admins)

---

## 2. Authorization & Permissions

### roles
```sql
- id (PRIMARY KEY)
- name VARCHAR(255)
- guard_name VARCHAR(255)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Roles:**
- `customer` - Regular customers
- `vendor` - Shop owners
- `super-admin` - Platform administrators

### permissions
```sql
- id (PRIMARY KEY)
- name VARCHAR(255)
- guard_name VARCHAR(255)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

### model_has_roles
Links users to roles (many-to-many)

### role_has_permissions
Links roles to permissions (many-to-many)

---

## 3. Vendor Management

### vendor_profiles
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- store_name VARCHAR(255)
- description TEXT
- logo VARCHAR(255)
- cover_image VARCHAR(255)
- phone VARCHAR(20)
- email VARCHAR(255)
- address TEXT
- city VARCHAR(100)
- state VARCHAR(100)
- country VARCHAR(100)
- postal_code VARCHAR(20)
- website VARCHAR(255)
- social_facebook VARCHAR(255)
- social_instagram VARCHAR(255)
- social_twitter VARCHAR(255)
- is_approved BOOLEAN (default: false)
- is_banned BOOLEAN (default: false)
- rating DECIMAL(3,2)
- total_sales DECIMAL(12,2)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Store vendor/shop profile information

---

## 4. Products & Inventory

### categories
```sql
- id (PRIMARY KEY)
- name VARCHAR(255) UNIQUE
- slug VARCHAR(255) UNIQUE
- description TEXT
- image VARCHAR(255)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Examples:**
- Instagram Accounts
- Gmail Accounts
- TikTok Accounts
- LinkedIn Accounts
- Facebook Accounts

### brands
```sql
- id (PRIMARY KEY)
- name VARCHAR(255) UNIQUE
- slug VARCHAR(255) UNIQUE
- description TEXT
- logo VARCHAR(255)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

### products
```sql
- id (PRIMARY KEY)
- name VARCHAR(255)
- slug VARCHAR(255) UNIQUE
- description TEXT
- short_description VARCHAR(500)
- sku VARCHAR(100) UNIQUE
- price DECIMAL(10,2)
- original_price DECIMAL(10,2)
- vendor_id (FOREIGN KEY → users.id)
- category_id (FOREIGN KEY → categories.id)
- brand_id (FOREIGN KEY → brands.id)
- stock INT
- status ENUM('active', 'inactive') default: 'active'
- rating DECIMAL(3,2)
- reviews_count INT
- views_count INT
- is_featured BOOLEAN
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Main product catalog

### product_images
```sql
- id (PRIMARY KEY)
- product_id (FOREIGN KEY → products.id)
- image_url VARCHAR(255)
- alt_text VARCHAR(255)
- is_primary BOOLEAN
- sort_order INT
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Multiple images per product

### inventory
```sql
- id (PRIMARY KEY)
- product_id (FOREIGN KEY → products.id)
- quantity_available INT
- quantity_reserved INT
- quantity_sold INT
- low_stock_threshold INT
- last_restocked_at TIMESTAMP
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Track stock levels

---

## 5. Shopping & Orders

### carts
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- product_id (FOREIGN KEY → products.id)
- quantity INT
- added_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Shopping cart items

### orders
```sql
- id (PRIMARY KEY)
- order_number VARCHAR(50) UNIQUE
- user_id (FOREIGN KEY → users.id)
- vendor_id (FOREIGN KEY → users.id)
- total_amount DECIMAL(12,2)
- subtotal DECIMAL(12,2)
- tax_amount DECIMAL(10,2)
- shipping_cost DECIMAL(10,2)
- discount_amount DECIMAL(10,2)
- status ENUM('pending','processing','shipped','delivered','completed','cancelled')
- payment_status ENUM('pending','paid','failed','refunded')
- tracking_number VARCHAR(100)
- delivery_date DATE
- notes TEXT
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Order records

### order_items
```sql
- id (PRIMARY KEY)
- order_id (FOREIGN KEY → orders.id)
- product_id (FOREIGN KEY → products.id)
- quantity INT
- unit_price DECIMAL(10,2)
- discount_price DECIMAL(10,2)
- total_price DECIMAL(10,2)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Items within each order

### payments
```sql
- id (PRIMARY KEY)
- order_id (FOREIGN KEY → orders.id)
- payment_method VARCHAR(50) (e.g., 'card', 'paypal', 'bank_transfer')
- payment_status ENUM('pending','completed','failed','refunded')
- transaction_id VARCHAR(255)
- amount_paid DECIMAL(12,2)
- currency VARCHAR(3) default: 'USD'
- error_message TEXT
- processed_at TIMESTAMP
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Payment tracking

---

## 6. Customer Features

### wishlists
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- product_id (FOREIGN KEY → products.id)
- added_at TIMESTAMP
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: User's saved/favorite products

### shipping_addresses
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- name VARCHAR(255)
- phone VARCHAR(20)
- street_address VARCHAR(255)
- city VARCHAR(100)
- state VARCHAR(100)
- country VARCHAR(100)
- postal_code VARCHAR(20)
- is_default BOOLEAN
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Multiple shipping addresses per user

---

## 7. Communication

### conversations_messages
```sql
- id (PRIMARY KEY)
- conversation_id VARCHAR(255)
- sender_id (FOREIGN KEY → users.id)
- receiver_id (FOREIGN KEY → users.id)
- message TEXT
- attachment_url VARCHAR(255)
- is_read BOOLEAN default: false
- read_at TIMESTAMP
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Customer-vendor messages/chat

### contact_inquiries
```sql
- id (PRIMARY KEY)
- name VARCHAR(255)
- email VARCHAR(255)
- phone VARCHAR(20)
- subject VARCHAR(255)
- message TEXT
- is_resolved BOOLEAN default: false
- resolved_at TIMESTAMP
- resolved_by INT (FOREIGN KEY → users.id)
- notes TEXT
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Contact form submissions from website

---

## 8. Feedback & Reviews

### reviews
```sql
- id (PRIMARY KEY)
- product_id (FOREIGN KEY → products.id)
- user_id (FOREIGN KEY → users.id)
- rating INT (1-5)
- title VARCHAR(255)
- comment TEXT
- is_approved BOOLEAN default: false
- helpful_count INT default: 0
- unhelpful_count INT default: 0
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Product reviews and ratings

---

## 9. Notifications & Alerts

### user_notifications
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- type VARCHAR(50) (e.g., 'order_placed', 'order_shipped', 'message_received')
- title VARCHAR(255)
- message TEXT
- related_id INT
- is_read BOOLEAN default: false
- read_at TIMESTAMP
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: In-app notifications for users

---

## 10. Content Management

### banners
```sql
- id (PRIMARY KEY)
- title VARCHAR(255)
- image_url VARCHAR(255)
- link_url VARCHAR(255)
- position VARCHAR(50) (e.g., 'top', 'middle', 'bottom')
- is_active BOOLEAN default: true
- display_start_date DATE
- display_end_date DATE
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Promotional banners on homepage

### settings
```sql
- id (PRIMARY KEY)
- key VARCHAR(255) UNIQUE
- value LONGTEXT
- type VARCHAR(50) (e.g., 'string', 'boolean', 'json')
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Example Settings:**
- `site_name` → "PVA Brand"
- `logo_url` → "/images/logo.png"
- `support_email` → "support@pvabrand.com"
- `commission_rate` → "10"

---

## 11. Logging & Analytics

### activity_logs
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- action VARCHAR(255)
- model VARCHAR(255) (e.g., 'Product', 'Order')
- model_id INT
- old_values JSON
- new_values JSON
- description TEXT
- ip_address VARCHAR(45)
- user_agent TEXT
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

**Purpose**: Track all user actions and changes

---

## 12. System Tables (Laravel)

### cache
- Session cache storage

### jobs
- Queue jobs for background tasks

### password_reset_tokens
- For password reset functionality

---

## Database Connection Info for Different Environments

### Local Development (SQLite)
```env
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite
```

### Production (MySQL)
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=websouls_pvabrand
DB_USERNAME=pvabrand_user
DB_PASSWORD=your_password
```

### Staging (MySQL)
```env
DB_CONNECTION=mysql
DB_HOST=staging.yourdomain.com
DB_DATABASE=staging_pvabrand
```

---

## Migrations Execution Order

The migrations run in this order (determined by timestamp):

1. `0001_01_01_000000_create_users_table.php` - Users
2. `0001_01_01_000001_create_cache_table.php` - Cache
3. `0001_01_01_000002_create_jobs_table.php` - Jobs
4. `2026_06_27_084102_create_permission_tables.php` - Roles & Permissions
5. `2026_06_27_084543_create_categories_table.php` - Categories
6. `2026_06_27_084544_create_brands_table.php` - Brands
7. `2026_06_27_084545_create_vendor_profiles_table.php` - Vendor Profiles
8. `2026_06_27_090000_create_products_table.php` - Products
9. `2026_06_27_090001_create_product_images_table.php` - Product Images
10. `2026_06_27_090002_create_inventory_table.php` - Inventory
11. `2026_06_27_090003_create_carts_table.php` - Carts
12. `2026_06_27_090004_create_wishlists_table.php` - Wishlists
13. `2026_06_27_090005_create_shipping_addresses_table.php` - Addresses
14. `2026_06_27_090006_create_orders_table.php` - Orders
15. `2026_06_27_090007_create_order_items_table.php` - Order Items
16. `2026_06_27_090008_create_payments_table.php` - Payments
17. `2026_06_27_090009_create_conversations_messages_table.php` - Messages
18. `2026_06_27_090010_create_reviews_table.php` - Reviews
19. `2026_06_27_090011_create_user_notifications_table.php` - Notifications
20. `2026_06_27_090012_create_banners_table.php` - Banners
21. `2026_06_27_090013_create_settings_table.php` - Settings
22. `2026_06_27_090014_create_activity_logs_table.php` - Activity Logs
23. `2026_06_27_090015_create_contact_inquiries_table.php` - Contact Inquiries

---

## Key Relationships

```
users (1) → (many) vendor_profiles
users (1) → (many) products
users (1) → (many) orders
users (1) → (many) wishlists
users (1) → (many) shipping_addresses
users (1) → (many) reviews
users (1) → (many) carts
users (1) → (many) conversations_messages
users (1) → (many) user_notifications

products (1) → (many) product_images
products (1) → (many) order_items
products (1) → (many) reviews
products (1) → (many) wishlists
products (1) → (many) carts

categories (1) → (many) products
brands (1) → (many) products

orders (1) → (many) order_items
orders (1) → (many) payments
```

---

## Seeding Database with Test Data

Two seeders are included:

### 1. DatabaseSeeder
Main seeder that calls other seeders.

### 2. RolesAndPermissionsSeeder
Creates default roles:
- customer
- vendor
- super-admin

Run seeders:
```bash
php artisan db:seed
# or
php artisan db:seed --class=RolesAndPermissionsSeeder
```

---

## Backup & Export

### Export Database to SQL File
```bash
# MySQL
mysqldump -u pvabrand_user -p websouls_pvabrand > backup.sql

# SQLite
cp database/database.sqlite backup.sqlite
```

### Import Database from SQL File
```bash
# MySQL
mysql -u pvabrand_user -p websouls_pvabrand < backup.sql

# SQLite
cp backup.sqlite database/database.sqlite
```

---

## Database Optimization Tips

1. **Indexing**: Most ForeignKeys are indexed automatically
2. **Archival**: Move old orders/logs to archive table
3. **Partitioning**: For large activity_logs table
4. **Regular Backups**: Daily automated backups recommended
5. **Query Optimization**: Monitor slow queries in logs

---

## Summary

- **Total Tables**: 22
- **Key Tables**: users, products, orders, vendor_profiles
- **Migrations**: 23 files
- **Seeders**: 2 files
- **Relationships**: 1-to-many between core entities
- **Production Database**: MySQL recommended
- **Local Development**: SQLite default

**Status**: ✅ Schema Complete & Ready for Deployment
