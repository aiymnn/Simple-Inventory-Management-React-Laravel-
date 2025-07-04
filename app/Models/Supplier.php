<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    /** @use HasFactory<\Database\Factories\SupplierFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'email', 'phone', 'address'];

    // app/Models/Supplier.php

    public function scopeFilter($query, array $filters)
    {
        // Filter by name
        $query->when($filters['name'] ?? null, function ($query, $name) {
            $query->where('name', 'like', '%' . $name . '%');
        });

        // Filter by phone
        $query->when($filters['phone'] ?? null, function ($query, $phone) {
            $query->where('phone', 'like', '%' . $phone . '%');
        });

        // Filter by email
        $query->when($filters['email'] ?? null, function ($query, $email) {
            $query->where('email', 'like', '%' . $email . '%');
        });
    }



    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
