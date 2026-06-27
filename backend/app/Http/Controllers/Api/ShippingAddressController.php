<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;

class ShippingAddressController extends Controller
{
    public function index(Request $request)
    {
        $addresses = ShippingAddress::where('user_id', $request->user()->id)->get();
        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ]);

        if ($request->boolean('is_default')) {
            ShippingAddress::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        $address = ShippingAddress::create([
            'user_id' => $request->user()->id,
            ...$request->only(['full_name', 'phone', 'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country', 'is_default']),
        ]);

        return response()->json($address, 201);
    }

    public function show(Request $request, ShippingAddress $shippingAddress)
    {
        if ($shippingAddress->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($shippingAddress);
    }

    public function update(Request $request, ShippingAddress $shippingAddress)
    {
        if ($shippingAddress->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address_line_1' => 'sometimes|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'sometimes|string|max:100',
            'state' => 'sometimes|string|max:100',
            'postal_code' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:100',
            'is_default' => 'boolean',
        ]);

        if ($request->boolean('is_default')) {
            ShippingAddress::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        $shippingAddress->update($request->all());

        return response()->json($shippingAddress);
    }

    public function destroy(Request $request, ShippingAddress $shippingAddress)
    {
        if ($shippingAddress->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $shippingAddress->delete();
        return response()->json(null, 204);
    }
}
