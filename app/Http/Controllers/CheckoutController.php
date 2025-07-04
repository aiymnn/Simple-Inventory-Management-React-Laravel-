<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $cart = $user->carts()->with('items.product')->where('status', 'active')->latest()->first();

        if (!$cart || $cart->items->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        foreach ($cart->items as $item) {
            $product = $item->product;
            if ($product->quantity < $item->quantity) {
                return back()->with('error', "Insufficient stock for {$product->name}. Only {$product->quantity} available.");
            }
        }

        $total = $cart->items->sum(fn($item) => $item->product->price * $item->quantity);

        $order = $user->orders()->create([
            'total_price' => $total,
            'status' => 'pending',
            'payment_method' => 'stripe',
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->product->price,
            ]);
        }

        // Mark cart as checked out
        $cart->update(['status' => 'checked_out']);
        // Optionally keep cart items for record, or:
        $cart->items()->delete();

        // Create Stripe checkout session
        Stripe::setApiKey(config('services.stripe.secret'));

        $lineItems = $order->items->map(function ($item) {
            return [
                'price_data' => [
                    'currency' => 'myr',
                    'product_data' => ['name' => $item->product->name],
                    'unit_amount' => intval($item->unit_price * 100),
                ],
                'quantity' => $item->quantity,
            ];
        })->toArray();

        $checkoutSession = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('checkout.success', ['order_id' => $order->id]),
            'cancel_url' => route('checkout.cancel', ['order_id' => $order->id]),
            'metadata' => [
                'user_id' => $user->id,
                'order_id' => $order->id,
            ],
        ]);

        return Inertia::location($checkoutSession->url);
    }

    public function success(Request $request)
    {
        $user = $request->user();
        $orderId = $request->query('order_id');

        $order = $user->orders()->with('items.product')->where('id', $orderId)->where('status', 'pending')->first();

        if (!$order) {
            return redirect()->route('my-orders', ['tab' => 'pending'])->with('error', 'Order not found or already processed.');
        }

        try {
            foreach ($order->items as $item) {
                $product = $item->product;

                if ($product->quantity < $item->quantity) {
                    throw new \Exception("Insufficient stock for {$product->name}. Only {$product->quantity} left.");
                }

                $product->decrement('quantity', $item->quantity);

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'out',
                    'quantity' => $item->quantity,
                    'note' => 'Purchased by user ID: ' . $user->id,
                    'performed_by' => $user->id,
                ]);
            }

            $order->update(['status' => 'paid']);
        } catch (\Exception $e) {
            return redirect()->route('my-orders', ['tab' => 'pending'])->with('error', $e->getMessage());
        }

        return redirect()->route('my-orders', ['tab' => 'paid'])->with('success', 'Payment successful!');
    }

    public function cancel(Request $request)
    {
        $orderId = $request->query('order_id');

        if ($orderId) {
            Order::where('id', $orderId)->where('status', 'pending')->update(['status' => 'cancelled']);
        }

        return redirect()->route('my-orders', ['tab' => 'cancelled'])->with('info', 'Payment was cancelled.');
    }

    public function buyNow(Request $request)
    {
        $user = $request->user();
        $product = Product::findOrFail($request->product_id);
        $quantity = $request->quantity ?? 1;

        if ($product->quantity < $quantity) {
            return back()->with('error', "Only {$product->quantity} item(s) left in stock for {$product->name}.");
        }

        $total = $product->price * $quantity;

        $order = $user->orders()->create([
            'total_price' => $total,
            'status' => 'pending',
            'payment_method' => 'stripe',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price' => $product->price,
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $checkoutSession = StripeSession::create([
            'line_items' => [[
                'price_data' => [
                    'currency' => 'myr',
                    'product_data' => ['name' => $product->name],
                    'unit_amount' => intval($product->price * 100),
                ],
                'quantity' => $quantity,
            ]],
            'mode' => 'payment',
            'success_url' => route('checkout.success', ['order_id' => $order->id]),
            'cancel_url' => route('checkout.cancel', ['order_id' => $order->id]),
            'metadata' => [
                'user_id' => $user->id,
                'order_id' => $order->id,
            ],
        ]);

        return Inertia::location($checkoutSession->url);
    }

    public function pay(Order $order)
    {
        $user = Auth::user();

        if ($order->user_id !== $user->id || $order->status !== 'pending') {
            return back()->with('error', 'Invalid order or already paid.');
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $lineItems = $order->items->map(function ($item) {
            return [
                'price_data' => [
                    'currency' => 'myr',
                    'product_data' => ['name' => $item->product->name],
                    'unit_amount' => intval($item->unit_price * 100),
                ],
                'quantity' => $item->quantity,
            ];
        })->toArray();

        $checkoutSession = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('checkout.success', ['order_id' => $order->id]),
            'cancel_url' => route('checkout.cancel', ['order_id' => $order->id]),
            'metadata' => [
                'user_id' => $user->id,
                'order_id' => $order->id,
            ],
        ]);

        return Inertia::location($checkoutSession->url);
    }
}
