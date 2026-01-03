<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductStorage extends Model
{
    //
    protected $table = 'product_storage';
    protected $fillable = [
        'product_id',
        'value',
        'stock_quantity',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
