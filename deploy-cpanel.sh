#!/bin/bash
# ============================================================
# PVA Brand - cPanel Deployment Script
# Run on the server via SSH: bash deploy-cpanel.sh
# ============================================================

set -e

echo ""
echo "========================================="
echo "  PVA Brand - cPanel Deployment Script"
echo "========================================="
echo ""

# ─── CONFIG - EDIT THESE BEFORE RUNNING ──────────────────
DOMAIN="yourdomain.com"
API_PATH="$HOME/public_html/api"
PUBLIC_PATH="$HOME/public_html"
# ─────────────────────────────────────────────────────────

echo "1. Navigating to backend directory..."
cd "$API_PATH"

echo "2. Installing Composer dependencies (no dev)..."
composer install --optimize-autoloader --no-dev

echo "3. Generating APP_KEY if needed..."
php artisan key:generate --no-interaction

echo "4. Creating storage symlink..."
php artisan storage:link

echo "5. Setting file permissions..."
chmod -R 755 storage bootstrap/cache
chmod 644 .env

echo "6. Running database migrations..."
php artisan migrate --force --no-interaction

echo "7. Running seeders (roles & permissions)..."
php artisan db:seed --class=RolesAndPermissionsSeeder --no-interaction || echo "Seeder skipped (may already exist)"

echo "8. Caching config/routes/views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ""
echo "========================================="
echo "  Backend deployment complete!"
echo ""
echo "  Next: Upload frontend dist/ files to"
echo "  $PUBLIC_PATH/"
echo ""
echo "  Then test:"
echo "  curl https://$DOMAIN/api/up"
echo "========================================="
