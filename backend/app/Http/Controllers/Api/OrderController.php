<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'shippingAddress']);

        if ($request->user()->hasRole('customer')) {
            $query->where('user_id', $request->user()->id);
        } elseif ($request->user()->hasRole('vendor')) {
            $vendorId = $request->user()->vendorProfile?->id;
            $query->whereHas('items', function ($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($orders);
    }

    public function show(Request $request, Order $order)
    {
        if ($request->user()->hasRole('customer') && $order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order->load(['items.product', 'shippingAddress', 'payments']));
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'shipping_address_id' => 'required|exists:shipping_addresses,id',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $cartItems = Cart::with('product')->where('user_id', $request->user()->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $subtotal = 0;
        $orderItems = [];

        foreach ($cartItems as $item) {
            $product = $item->product;

            if (!$product->in_stock || $product->quantity < $item->quantity) {
                return response()->json([
                    'message' => "{$product->name} is out of stock or insufficient quantity"
                ], 422);
            }

            $price = $product->discount_price ?? $product->price;
            $total = $price * $item->quantity;
            $subtotal += $total;

            $orderItems[] = [
                'product_id' => $product->id,
                'vendor_id' => $product->vendor_id,
                'product_name' => $product->name,
                'price' => $price,
                'quantity' => $item->quantity,
                'total' => $total,
            ];
        }

        $tax = $subtotal * 0.1;
        $shippingCost = $subtotal > 100 ? 0 : 10;
        $total = $subtotal + $tax + $shippingCost;

        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'user_id' => $request->user()->id,
            'shipping_address_id' => $request->shipping_address_id,
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'tax' => $tax,
            'total' => $total,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'payment_method' => $request->payment_method,
            'notes' => $request->notes,
        ]);

        foreach ($orderItems as $item) {
            OrderItem::create(array_merge($item, ['order_id' => $order->id]));

            Product::where('id', $item['product_id'])->decrement('quantity', $item['quantity']);
        }

        Payment::create([
            'order_id' => $order->id,
            'amount' => $total,
            'method' => $request->payment_method,
            'status' => 'pending',
        ]);

        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json($order->load(['items.product', 'shippingAddress']), 201);
    }

    public function adminOrders(Request $request)
    {
        $query = Order::with(['items.product', 'shippingAddress', 'user']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($orders);
    }

    public function updateStatus(Request $request, Order $order)
    {
        if (!$request->user()->hasAnyRole(['super-admin', 'vendor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        if ($request->status === 'cancelled') {
            foreach ($order->items as $item) {
                Product::where('id', $item->product_id)->increment('quantity', $item->quantity);
            }
        }

        return response()->json($order);
    }

    public function updatePaymentStatus(Request $request, Order $order)
    {
        if (!$request->user()->hasRole('super-admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'payment_status' => 'required|in:unpaid,paid,refunded',
        ]);

        $order->update(['payment_status' => $request->payment_status]);

        if ($request->payment_status === 'paid') {
            $order->payments()->updateOrCreate(
                ['order_id' => $order->id],
                ['status' => 'completed', 'transaction_id' => $request->transaction_id]
            );
        }

        return response()->json($order);
    }

    public function updateTracking(Request $request, Order $order)
    {
        if (!$request->user()->hasAnyRole(['super-admin', 'vendor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'tracking_number' => 'required|string',
        ]);

        $order->update(['tracking_number' => $request->tracking_number]);

        return response()->json($order);
    }

    public function vendorOrders(Request $request)
    {
        $vendor = $request->user()->vendorProfile;

        if (!$vendor) {
            return response()->json(['message' => 'Vendor profile not found'], 404);
        }

        $query = Order::with(['items.product', 'shippingAddress', 'user'])
            ->whereHas('items', function ($q) use ($vendor) {
                $q->where('vendor_id', $vendor->id);
            });

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($orders);
    }
}
