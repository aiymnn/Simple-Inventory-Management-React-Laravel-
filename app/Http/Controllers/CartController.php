<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{

    public function index()
    {
        $cart = Cart::with([
            'items.product.category',
            'items.product.supplier'
        ])
            ->where('user_id', Auth::id())
            ->where('status', 'active')
            ->latest()
            ->first();

        return Inertia::render('portal/myCart', [
            'cart' => $cart,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $user = Auth::user();

        // Get or create active cart for the user
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'active'],
            ['status' => 'active']
        );

        // Check if the product already exists in cart
        $cartItem = $cart->items()->where('product_id', $validated['product_id'])->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $validated['quantity']);
        } else {
            $cart->items()->create([
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return back()->with('success', 'Product added to cart!');
    }
}
