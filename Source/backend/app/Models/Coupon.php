<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    //
    protected $table = 'coupon';
    protected $fillable = [
        'code',
        'type',
        'value',
        'minimum_order_value',
        'usage_limit',
        'used_count',
        'is_active',
        'start_date',
        'end_date',
        'is_delete',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'productCoupon', 'coupon_id', 'product_id');
    }
}
