<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VendorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VendorProfileController extends Controller
{
    public function index()
    {
        return response()->json(VendorProfile::with('user')->get());
    }

    public function myProfile(Request $request)
    {
        $profile = $request->user()->vendorProfile;
        if (!$profile) {
            return response()->json(['message' => 'No profile found'], 404);
        }
        return response()->json($profile);
    }

    public function store(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'banner' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        // Ensure unique slug
        $baseSlug = Str::slug($request->store_name);
        $slug = $baseSlug;
        $i = 1;
        while (VendorProfile::where('store_slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $i++;
        }

        // Prevent duplicate profiles
        if ($request->user()->vendorProfile) {
            return response()->json(['message' => 'You already have a store profile. Please update it instead.'], 422);
        }

        $profile = VendorProfile::create([
            'user_id' => $request->user()->id,
            'store_name' => $request->store_name,
            'store_slug' => $slug,
            'description' => $request->description,
            'logo' => $request->logo,
            'banner' => $request->banner,
            'address' => $request->address,
            'phone' => $request->phone,
            'is_approved' => false, // Requires admin approval
        ]);

        return response()->json($profile, 201);
    }

    public function show($slug)
    {
        $vendorProfile = VendorProfile::where('store_slug', $slug)->firstOrFail();
        return response()->json($vendorProfile->load('user'));
    }

    public function update(Request $request)
    {
        $vendorProfile = $request->user()->vendorProfile;
        if (!$vendorProfile) {
            return response()->json(['message' => 'Vendor profile not found. Please create one first.'], 404);
        }

        $request->validate([
            'store_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'banner' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'is_approved' => 'sometimes|boolean', // Usually only admins should update this
        ]);

        if ($request->has('store_name')) {
            $vendorProfile->store_slug = Str::slug($request->store_name);
        }
        
        $data = $request->only(['store_name', 'description', 'logo', 'banner', 'address', 'phone']);
        if ($request->has('store_name')) {
            $data['store_slug'] = Str::slug($request->store_name);
        }
        $vendorProfile->update($data);

        return response()->json($vendorProfile);
    }

    public function destroy(Request $request, VendorProfile $vendorProfile)
    {
        if ($request->user()->id !== $vendorProfile->user_id && !$request->user()->hasRole('super-admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $vendorProfile->delete();
        return response()->json(null, 204);
    }
}
