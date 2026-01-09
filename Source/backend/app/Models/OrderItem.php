<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    //
    protected $table = 'order_item';
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price_at_purchase',
        'color',
        'storage',
    ];
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

}
