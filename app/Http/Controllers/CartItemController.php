<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartItemController extends Controller
{
    public function update(CartItem $item, Request $request)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check ownership (security)
        if ($item->cart->user_id !== Auth::id()) {
            abort(403);
        }

        $item->update([
            'quantity' => $request->quantity,
        ]);
    }

    public function destroy(CartItem $item)
    {
        if ($item->cart->user_id !== Auth::id()) {
            abort(403);
        }

        $item->delete();
    }
}
