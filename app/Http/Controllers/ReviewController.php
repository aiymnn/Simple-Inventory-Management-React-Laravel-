<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Optional: check jika user benar-benar pemilik order
        $order = $request->user()->orders()->where('id', $validated['order_id'])->firstOrFail();

        // Optional: check jika order mengandungi produk tersebut
        if (!$order->items()->where('product_id', $validated['product_id'])->exists()) {
            abort(403, 'You cannot review this product for this order.');
        }

        // Optional: pastikan belum review lagi untuk order + product ni
        $alreadyReviewed = $request->user()->reviews()
            ->where('order_id', $validated['order_id'])
            ->where('product_id', $validated['product_id'])
            ->exists();

        if ($alreadyReviewed) {
            return back()->withErrors(['product_id' => 'You have already reviewed this product for this order.']);
        }

        $request->user()->reviews()->create($validated);

        return back()->with('success', 'Review submitted.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
