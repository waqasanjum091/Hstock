<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::query();

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $banners = $query->orderBy('sort_order')->paginate($request->get('per_page', 20));
        return response()->json($banners);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'      => 'required|string|max:255',
            'subtitle'   => 'nullable|string|max:255',
            'image'      => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'link'       => 'nullable|url',
            'position'   => 'nullable|in:home_top,home_middle,sidebar',
            'is_active'  => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('banners', 'public');
        }

        $banner = Banner::create([
            'title'      => $request->title,
            'subtitle'   => $request->subtitle,
            'image'      => $imagePath,
            'link'       => $request->link,
            'position'   => $request->position ?? 'home_top',
            'is_active'  => $request->boolean('is_active', true),
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return response()->json(['message' => 'Banner created successfully', 'banner' => $banner], 201);
    }

    public function show($id)
    {
        return response()->json(Banner::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $request->validate([
            'title'      => 'sometimes|string|max:255',
            'subtitle'   => 'nullable|string|max:255',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'link'       => 'nullable|url',
            'position'   => 'nullable|in:home_top,home_middle,sidebar',
            'is_active'  => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $data = $request->only(['title', 'subtitle', 'link', 'position', 'is_active', 'sort_order']);

        if ($request->hasFile('image')) {
            if ($banner->image) {
                \Storage::disk('public')->delete($banner->image);
            }
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($data);

        return response()->json(['message' => 'Banner updated successfully', 'banner' => $banner]);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        if ($banner->image) {
            \Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();

        return response()->json(['message' => 'Banner deleted successfully']);
    }
}
