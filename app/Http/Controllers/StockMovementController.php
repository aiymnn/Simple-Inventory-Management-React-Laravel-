<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

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
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'note' => ['nullable', 'string'],
        ]);

        // Rekodkan pergerakan stok (log)
        StockMovement::create([
            'product_id' => $validated['product_id'],
            'type' => 'in', // restock = masuk
            'quantity' => $validated['quantity'],
            'note' => $validated['note'],
            'performed_by' => auth()->id(),
        ]);

        // Kemas kini stok produk
        Product::where('id', $validated['product_id'])->increment('quantity', $validated['quantity']);

        return back()->with('success', 'Stock successfully updated.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StockMovement $stockMovement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockMovement $stockMovement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockMovement $stockMovement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockMovement $stockMovement)
    {
        //
    }


    public function productLogs(Product $product)
    {
        $product->load([
            'stockMovements' => function ($query) {
                $query->with('user')->latest(); // Sort by created_at descending
            }
        ]);

        return Inertia::render('admin/product/stock/index', [
            'product' => $product,
        ]);
    }
}
