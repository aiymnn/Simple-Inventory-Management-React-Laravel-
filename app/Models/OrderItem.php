<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class OrderItem extends Model
{
    //
    use SoftDeletes;

    protected $fillable = ['order_id', 'product_id', 'quantity', 'unit_price'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getHasReviewAttribute()
    {
        return $this->product
            ->reviews()
            ->where('order_id', $this->order_id)
            ->where('user_id', Auth::id())
            ->exists();
    }
}
