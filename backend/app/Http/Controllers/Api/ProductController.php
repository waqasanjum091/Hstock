<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['vendor', 'category', 'brand', 'images'])
            ->where('is_active', true);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->has('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('in_stock')) {
            $query->where('in_stock', true);
        }

        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        if (in_array($sort, ['price', 'sales_count', 'avg_rating', 'name', 'created_at'])) {
            $query->orderBy($sort, $direction);
        }

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json($products);
    }

    public function featured()
    {
        $products = Product::with(['vendor', 'category', 'brand', 'images'])
            ->where('is_featured', true)
            ->where('is_active', true)
            ->limit(8)
            ->get();

        return response()->json($products);
    }

    public function show($slug)
    {
        $product = Product::with(['vendor', 'category', 'brand', 'images', 'reviews.user'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'sku' => 'nullable|string|unique:products',
            'quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'specifications' => 'nullable|array',
            'tags' => 'nullable|array',
            'is_featured' => 'boolean',
        ]);

        $vendor = $request->user()->vendorProfile;

        if (!$vendor) {
            return response()->json(['message' => 'Vendor profile not found'], 404);
        }

        if (!$vendor->is_approved) {
            return response()->json(['message' => 'Vendor not approved'], 403);
        }

        // Ensure unique slug
        $baseSlug = Str::slug($request->name);
        $slug = $baseSlug;
        $i = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $i++;
        }

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'short_description' => $request->short_description,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'sku' => $request->sku,
            'quantity' => $request->quantity,
            'in_stock' => $request->quantity > 0,
            'weight' => $request->weight,
            'specifications' => $request->specifications,
            'tags' => $request->tags,
            'is_featured' => $request->boolean('is_featured', false),
            'featured_image' => $request->featured_image,
        ]);

        return response()->json($product->load(['vendor', 'category', 'brand', 'images']), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($product->vendor_id !== $request->user()->vendorProfile?->id && !$request->user()->hasRole('super-admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'quantity' => 'sometimes|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'specifications' => 'nullable|array',
            'tags' => 'nullable|array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();

        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        if ($request->has('quantity')) {
            $data['in_stock'] = $request->quantity > 0;
        }

        $product->update($data);

        return response()->json($product->load(['vendor', 'category', 'brand', 'images']));
    }

    public function destroy(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($product->vendor_id !== $request->user()->vendorProfile?->id && !$request->user()->hasRole('super-admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();
        return response()->json(null, 204);
    }

    public function addImages(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($product->vendor_id !== $request->user()->vendorProfile?->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'images' => 'required|array',
            'images.*' => 'string',
        ]);

        foreach ($request->images as $index => $imagePath) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $imagePath,
                'sort_order' => $index,
                'is_primary' => $index === 0 && !$product->images()->exists(),
            ]);
        }

        return response()->json($product->load('images'), 201);
    }

    public function destroyImage(Request $request, $productId, $imageId)
    {
        $product = Product::findOrFail($productId);

        if ($product->vendor_id !== $request->user()->vendorProfile?->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        ProductImage::where('product_id', $productId)->where('id', $imageId)->delete();

        return response()->json(null, 204);
    }

    public function vendorProducts(Request $request)
    {
        $vendor = $request->user()->vendorProfile;

        if (!$vendor) {
            return response()->json(['message' => 'Vendor profile not found'], 404);
        }

        $query = Product::with(['category', 'brand', 'images'])
            ->where('vendor_id', $vendor->id);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        if (in_array($sort, ['price', 'sales_count', 'quantity', 'name', 'created_at'])) {
            $query->orderBy($sort, $direction);
        }

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json($products);
    }

    public function adminIndex(Request $request)
    {
        $query = Product::with(['vendor', 'category', 'brand', 'images']);

        if ($request->has('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        if (in_array($sort, ['price', 'sales_count', 'quantity', 'name', 'created_at'])) {
            $query->orderBy($sort, $direction);
        }

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json($products);
    }

    public function toggleActive(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_active' => !$product->is_active]);

        return response()->json([
            'message' => 'Product status updated successfully',
            'product' => $product,
        ]);
    }
}
