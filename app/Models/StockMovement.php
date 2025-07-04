<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockMovement extends Model
{
    //
    use SoftDeletes;

    protected $fillable = ['product_id', 'type', 'quantity', 'note', 'performed_by'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
