<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $table = 'products';
    protected $fillable = [
        'name',
        'description',
        'price',
        'original_price',
        'status',
        'is_new',
        'is_featured',
        'rating',
        'review_count',
        'seo_title',
        'seo_description',
        'is_delete',
        'category_id',
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function colors()
    {
        return $this->hasMany(ProductColor::class, 'product_id');
    }

    public function specs()
    {
        return $this->hasMany(ProductSpec::class, 'product_id');
    }

    public function storages()
    {
        return $this->hasMany(ProductStorage::class, 'product_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function coupons()
    {
        return $this->belongsToMany(Coupon::class, 'productcoupon', 'product_id', 'coupon_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'product_id');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'product_id');
    }
    public function mainImage()
    {
        return $this->hasOne(ProductImage::class)->orderBy('id');
    }
}
