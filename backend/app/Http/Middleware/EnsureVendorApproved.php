<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVendorApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $profile = $request->user()->vendorProfile;

        if (! $profile || ! $profile->is_approved) {
            return response()->json(['message' => 'Your vendor account has not been approved yet.'], 403);
        }

        return $next($request);
    }
}
