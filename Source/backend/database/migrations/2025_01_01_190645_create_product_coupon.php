<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productCoupon', function (Blueprint $table) {
            $table->foreignId('coupon_id')->constrained('coupon')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('product_id')->constrained('product')->cascadeOnDelete()->cascadeOnUpdate();
            $table->primary(['coupon_id', 'product_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productCoupon');
    }
};
