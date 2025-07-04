<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PortalController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('portal/home');
    }

    public function products()
    {
        $filters = request([
            'name',
            'category',
            'min_price',
            'max_price',
        ]);

        $categories = Category::select('name')->orderBy('name')->get();

        $products = Product::with(['category', 'supplier'])
            ->withAvg('reviews as avg_rating', 'rating') // ✅ Fix alias
            ->withCount(['orderItems as total_sold']) // ✅ Count total sold
            ->filter($filters)
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('portal/products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }



    public function productView(Product $product): \Inertia\Response
    {
        $product->load(['category', 'supplier', 'reviews.user']);

        $totalSold = $product->orderItems()->sum('quantity');
        $avgRating = round($product->reviews()->avg('rating'), 1);

        // Masukkan terus dalam array
        $productData = $product->toArray();
        $productData['total_sold'] = $totalSold;
        $productData['avg_rating'] = $avgRating;

        return Inertia::render('portal/product-view', [
            'product' => $productData,
        ]);
    }




    public function about(): Response
    {
        return Inertia::render('portal/about');
    }

    public function contact(): Response
    {
        return Inertia::render('portal/contact');
    }

    public function myOrders(Request $request): Response
    {
        $activeTab = $request->query('tab', 'pending');

        $orders = Order::with([
            'items.product.reviews', // sebab accessor guna relationship ni
            'items.product.category',
            'items.product.supplier',
        ])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('portal/myOrder', [
            'orders' => $orders,
            'activeTab' => $activeTab,
        ]);
    }

    public function cancelOrder(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        if ($order->status === 'pending') {
            $order->update(['status' => 'cancelled']);
        }

        return redirect()->route('my-orders', ['tab' => 'cancelled'])->with('success', 'Order cancelled.');
    }

    public function myCarts(): Response
    {
        return Inertia::render('portal/myCart');
    }
}
