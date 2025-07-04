<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActivityLog extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'action', 'table_name', 'record_id', 'note'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
