<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\VendorProfile;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $totalUsers = User::count();
        $totalVendors = VendorProfile::count();
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');
        $pendingOrders = Order::where('status', 'pending')->count();

        $recentOrders = Order::with(['user', 'items'])
            ->latest('created_at')
            ->limit(10)
            ->get();

        $topProducts = Product::withCount('orderItems')
            ->orderByDesc('order_items_count')
            ->limit(5)
            ->get(['id', 'name', 'slug', 'price']);

        $pendingVendors = VendorProfile::where('is_approved', false)
            ->with('user')
            ->get();

        // Monthly revenue - works on both SQLite (dev) and MySQL (production)
        $driver = DB::getDriverName();
        if ($driver === 'sqlite') {
            $monthExpr = "strftime('%Y-%m', created_at)";
        } else {
            $monthExpr = "DATE_FORMAT(created_at, '%Y-%m')";
        }
        $monthlyRevenue = Order::where('payment_status', 'paid')
            ->selectRaw("{$monthExpr} as month, SUM(total) as revenue")
            ->groupBy(DB::raw($monthExpr))
            ->orderBy('month')
            ->limit(12)
            ->get();

        return response()->json([
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalVendors' => $totalVendors,
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalRevenue' => (float) $totalRevenue,
                'pendingOrders' => $pendingOrders,
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'pendingVendors' => $pendingVendors,
            'monthlyRevenue' => $monthlyRevenue,
        ]);
    }

    public function vendorStats(Request $request)
    {
        $user = $request->user();
        $vendorProfile = $user->vendorProfile;

        if (!$vendorProfile) {
            return response()->json(['error' => 'Vendor profile not found'], 404);
        }

        $totalProducts = Product::where('vendor_id', $vendorProfile->id)->count();
        $totalOrders = Order::whereHas('items', function ($q) use ($vendorProfile) {
            $q->whereHas('product', function ($pq) use ($vendorProfile) {
                $pq->where('vendor_id', $vendorProfile->id);
            });
        })->count();

        $totalRevenue = Order::whereHas('items', function ($q) use ($vendorProfile) {
            $q->whereHas('product', function ($pq) use ($vendorProfile) {
                $pq->where('vendor_id', $vendorProfile->id);
            });
        })
            ->where('payment_status', 'paid')
            ->sum('total');

        $recentOrders = Order::whereHas('items', function ($q) use ($vendorProfile) {
            $q->whereHas('product', function ($pq) use ($vendorProfile) {
                $pq->where('vendor_id', $vendorProfile->id);
            });
        })
            ->with(['user', 'items'])
            ->latest('created_at')
            ->limit(10)
            ->get();

        $topProducts = Product::where('vendor_id', $vendorProfile->id)
            ->withCount('orderItems')
            ->orderByDesc('order_items_count')
            ->limit(5)
            ->get(['id', 'name', 'slug', 'price']);

        return response()->json([
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalRevenue' => (float) $totalRevenue,
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }
}
