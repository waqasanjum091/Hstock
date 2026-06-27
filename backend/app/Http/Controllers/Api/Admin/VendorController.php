<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\VendorProfile;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        // Vendor users who have created a store profile
        $query = VendorProfile::with('user');

        if ($request->has('status')) {
            if ($request->status === 'pending') {
                $query->where('is_approved', false);
            } elseif ($request->status === 'approved') {
                $query->where('is_approved', true);
            }
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('store_name', 'like', "%{$search}%")
                ->orWhere('store_slug', 'like', "%{$search}%")
                ->orWhereHas('user', function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%");
                });
        }

        $vendors = $query->orderBy('is_approved')->paginate($request->get('per_page', 15));

        // Also include vendor users with NO profile yet
        $noProfileVendors = \App\Models\User::role('vendor')
            ->doesntHave('vendorProfile')
            ->get(['id', 'name', 'email', 'created_at'])
            ->map(fn($u) => [
                'id' => null,
                'user_id' => $u->id,
                'store_name' => null,
                'is_approved' => false,
                'no_profile' => true,
                'user' => $u,
                'created_at' => $u->created_at,
            ]);

        return response()->json([
            'profiles' => $vendors,
            'no_profile_vendors' => $noProfileVendors,
        ]);
    }

    public function approve(Request $request, $id)
    {
        $vendor = VendorProfile::findOrFail($id);
        $vendor->update(['is_approved' => true]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'vendor_approved',
            'subject_type' => 'App\Models\VendorProfile',
            'subject_id' => $vendor->id,
            'properties' => ['store_name' => $vendor->store_name],
        ]);

        return response()->json([
            'message' => 'Vendor approved successfully',
            'vendor' => $vendor->load('user'),
        ]);
    }

    public function ban(Request $request, $id)
    {
        $vendor = VendorProfile::findOrFail($id);
        $vendor->update(['is_approved' => false]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'vendor_banned',
            'subject_type' => 'App\Models\VendorProfile',
            'subject_id' => $vendor->id,
            'properties' => ['store_name' => $vendor->store_name],
        ]);

        return response()->json([
            'message' => 'Vendor banned successfully',
            'vendor' => $vendor->load('user'),
        ]);
    }
}
