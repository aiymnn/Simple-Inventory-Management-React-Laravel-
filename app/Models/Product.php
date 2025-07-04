<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, SoftDeletes;


    protected $fillable = [
        'name',
        'sku',
        'category_id',
        'supplier_id',
        'image_path',
        'price',
        'quantity',
        'description'
    ];

    public function scopeFilter($query, array $filters)
    {
        // Filter by name
        $query->when($filters['name'] ?? null, function ($query, $name) {
            $query->where('name', 'like', '%' . $name . '%');
        });

        // Filter by SKU
        $query->when($filters['sku'] ?? null, function ($query, $sku) {
            $query->where('sku', 'like', '%' . $sku . '%');
        });

        // Filter by Category name (from related category table)
        $query->when($filters['category'] ?? null, function ($query, $category) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('name', 'like', '%' . $category . '%');
            });
        });

        // Filter by Supplier name (from related supplier table)
        $query->when($filters['supplier'] ?? null, function ($query, $supplier) {
            $query->whereHas('supplier', function ($q) use ($supplier) {
                $q->where('name', 'like', '%' . $supplier . '%');
            });
        });

        //Filter by price max and min
        $query->when($filters['min_price'] ?? null, fn($q, $min) =>
        $q->where('price', '>=', $min));

        $query->when($filters['max_price'] ?? null, fn($q, $max) =>
        $q->where('price', '<=', $max));
    }


    protected static function booted()
    {
        static::creating(function ($product) {
            $product->sku = 'PROD-' . strtoupper(Str::random(8));
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
