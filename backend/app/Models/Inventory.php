<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = [
        'product_id',
        'quantity_change',
        'quantity_after',
        'reason',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
