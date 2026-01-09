<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $table = 'coupon';
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'usage_limit',
        'used_count',
        'is_active',
        'start_date',
        'end_date',
        'is_delete',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'productCoupon', 'coupon_id', 'product_id');
    }

    public function isValidForOrder($orderAmount, $orderDate = null)
    {
        if ($this->is_delete || !$this->is_active) {
            return false;
        }

        $orderDate = $orderDate ?? date('Y-m-d');
        if ($this->start_date && $this->start_date > $orderDate) {
            return false;
        }
        if ($this->end_date && $this->end_date < $orderDate) {
            return false;
        }

        if ($this->min_order_amount && $orderAmount < $this->min_order_amount) {
            return false;
        }

        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    public function calculateDiscount($orderAmount)
    {
        if (!$this->isValidForOrder($orderAmount)) {
            return 0;
        }

        if ($this->type === 'percentage') {
            return $orderAmount * ($this->value / 100);
        }

        return $this->value;
    }


    public function incrementUsage()
    {
        $this->used_count++;
        $this->save();
    }

    public static function findByCode($code)
    {
        return self::where('code', $code)
            ->where('is_active', 1)
            ->where('is_delete', 0)
            ->first();
    }
}