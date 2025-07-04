<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->select('id', 'user_id', 'status', 'payment_method', 'total_price as total_amount', 'created_at')
            ->latest()
            ->paginate(10)
            ->through(fn($order) => [
                'id' => $order->id,
                'created_at' => $order->created_at,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'total_amount' => $order->total_amount,
                'user' => [
                    'name' => $order->user->name ?? '—',
                ],
                'items' => $order->items->map(fn($item) => [
                    'product_name' => $item->product->name ?? '—',
                    'product_quantity' => $item->quantity ?? '—',
                ]),
            ]);
        return Inertia::render('admin/order/index', [
            'orders' => $orders,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $order->update([
            'status' => 'shipped',
        ]);

        return back(); // or redirect with success
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
