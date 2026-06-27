<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\Request;

class ContactInquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactInquiry::query();

        if ($request->has('status')) {
            if ($request->status === 'resolved') {
                $query->where('is_resolved', true);
            } elseif ($request->status === 'open') {
                $query->where('is_resolved', false);
            }
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%");
        }

        $perPage = $request->get('per_page', 15);
        $inquiries = $query->latest('created_at')->paginate($perPage);

        return response()->json($inquiries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $inquiry = ContactInquiry::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_resolved' => false,
        ]);

        return response()->json([
            'message' => 'Your inquiry has been submitted successfully',
            'inquiry' => $inquiry,
        ], 201);
    }

    public function resolve(Request $request, $id)
    {
        $inquiry = ContactInquiry::findOrFail($id);
        $inquiry->update(['is_resolved' => true, 'resolved_at' => now()]);

        return response()->json([
            'message' => 'Inquiry resolved successfully',
            'inquiry' => $inquiry,
        ]);
    }
}
