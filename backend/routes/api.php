<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\VendorProfileController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ShippingAddressController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\VendorController;
use App\Http\Controllers\Api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\ContactInquiryController;
use App\Http\Controllers\Api\Admin\ActivityLogController;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Product Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// Public Category & Brand Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/brands', [BrandController::class, 'index']);

// Public Vendor Routes
Route::get('/vendors/{slug}', [VendorProfileController::class, 'show']);

// Public Banner Routes
Route::get('/banners', [BannerController::class, 'index']);

// Public Contact Form
Route::post('/contact', [ContactInquiryController::class, 'store']);

// Protected Routes (Authenticated Users)
Route::middleware('auth:sanctum')->group(function () {
    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Cart Routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Wishlist Routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);

    // Order Routes
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::patch('/orders/{id}/payment-status', [OrderController::class, 'updatePaymentStatus']);
    Route::patch('/orders/{id}/tracking', [OrderController::class, 'updateTracking']);

    // Shipping Address Routes
    Route::apiResource('shipping-addresses', ShippingAddressController::class);

    // Review Routes
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
    Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Chat Routes
    Route::get('/conversations', [ChatController::class, 'conversations']);
    Route::post('/conversations', [ChatController::class, 'startConversation']);
    Route::get('/conversations/{id}/messages', [ChatController::class, 'messages']);
    Route::post('/conversations/{id}/messages', [ChatController::class, 'sendMessage']);

    // Notification Routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Vendor Routes (Vendor Role Required)
    Route::middleware('role:vendor')->group(function () {
        Route::get('/vendor-profile', [VendorProfileController::class, 'myProfile']);
        Route::post('/vendor-profile', [VendorProfileController::class, 'store']);
        Route::put('/vendor-profile', [VendorProfileController::class, 'update']);
        Route::get('/vendor/products', [ProductController::class, 'vendorProducts']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::post('/products/{id}/images', [ProductController::class, 'addImages']);
        Route::delete('/products/{productId}/images/{imageId}', [ProductController::class, 'destroyImage']);
        Route::get('/vendor/orders', [OrderController::class, 'vendorOrders']);
        Route::get('/vendor/stats', [DashboardController::class, 'vendorStats']);
    });

    // Admin Routes (Super-Admin Role Required)
    Route::middleware('role:super-admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // User Management
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{id}/role', [UserController::class, 'updateRole']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Vendor Management
        Route::get('/vendors', [VendorController::class, 'index']);
        Route::patch('/vendors/{id}/approve', [VendorController::class, 'approve']);
        Route::patch('/vendors/{id}/ban', [VendorController::class, 'ban']);

        // Banner Management
        Route::apiResource('banners', BannerController::class);

        // Settings Management
        Route::get('/settings', [SettingsController::class, 'index']);
        Route::post('/settings', [SettingsController::class, 'store']);
        Route::put('/settings/{key}', [SettingsController::class, 'update']);

        // Contact Inquiry Management
        Route::get('/contact-inquiries', [ContactInquiryController::class, 'index']);
        Route::patch('/contact-inquiries/{id}/resolve', [ContactInquiryController::class, 'resolve']);

        // Activity Log Viewing
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);

        // Product Management
        Route::get('/all-products', [ProductController::class, 'adminIndex']);
        Route::patch('/products/{id}/toggle-active', [ProductController::class, 'toggleActive']);

        // All Orders (admin)
        Route::get('/all-orders', [OrderController::class, 'adminOrders']);
    });
});
