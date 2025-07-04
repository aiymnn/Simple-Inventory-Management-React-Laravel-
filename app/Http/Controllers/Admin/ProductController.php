<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $filters = request(['name', 'sku', 'category', 'supplier']);

        $products = Product::with(['category', 'supplier'])
            ->filter($filters)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/product/index', [
            'filters' => $filters,
            'products' => $products,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::all();
        $categories = Category::all();

        // dd([
        //     $suppliers,
        //     $categories,
        // ]);

        return Inertia::render('admin/product/create', [
            'suppliers' => $suppliers,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'image_path' => 'nullable|image|max:2048', // max 2MB
        ]);

        // dd($validated);

        // Handle image upload
        if ($request->hasFile('image_path')) {

            $imageFile = $request->file("image_path");
            if ($imageFile) {
                $validated['image_path'] = $imageFile->store('products', 'public');
            }
        }

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load([
            'supplier',
            'category',
            'reviews.user',
            'orderItems.order.user'
        ]);

        $recentReviews = $product->reviews()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($r) => [
                'user' => $r->user->name,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'created_at' => $r->created_at->toISOString(),
            ]);

        $recentOrders = $product->orderItems()
            ->with('order.user')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'id' => $item->order_id,
                'buyer' => $item->order->user->name,
                'quantity' => $item->quantity,
                'date' => $item->created_at->toDateString(),
            ]);

        return Inertia::render('admin/product/show', [
            'product' => [
                ...$product->toArray(),
                'avg_rating' => $product->reviews()->avg('rating'),
                'reviews_count' => $product->reviews()->count(),
                'sales_count' => $product->orderItems()->sum('quantity'),
                'recent_reviews' => $recentReviews,
                'recent_orders' => $recentOrders,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::all(['id', 'name']);
        $suppliers = Supplier::all(['id', 'name']);

        return Inertia::render('admin/product/edit', [
            'product' => $product->load('category', 'supplier'),
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'image_path' => 'nullable|image|max:2048', // max 2MB
        ]);

        // Handle image replacement
        if ($request->hasFile('image_path')) {
            // Delete old image if exists
            if ($product->image_path && Storage::disk('public')->exists($product->image_path)) {
                Storage::disk('public')->delete($product->image_path);
            }

            // Upload new image
            $imageFile = $request->file('image_path');
            $validated['image_path'] = $imageFile->store('products', 'public');
        }

        // Update product with validated data
        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if ($product->image_path && Storage::disk('public')->exists($product->image_path)) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
