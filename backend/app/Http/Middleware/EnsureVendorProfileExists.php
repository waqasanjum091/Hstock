<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVendorProfileExists
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()->vendorProfile) {
            return response()->json(['message' => 'Vendor profile not found.'], 404);
        }

        return $next($request);
    }
}
