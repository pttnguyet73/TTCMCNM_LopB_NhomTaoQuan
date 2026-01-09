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
        Schema::create('product_coupon', function (Blueprint $table) {
    $table->engine = 'InnoDB';

    $table->unsignedBigInteger('coupon_id');
    $table->unsignedBigInteger('product_id');

    $table->primary(['coupon_id', 'product_id']);

    $table->foreign('coupon_id')
          ->references('id')
          ->on('coupon')
          ->cascadeOnDelete()
          ->cascadeOnUpdate();

    $table->foreign('product_id')
          ->references('id')
          ->on('product')
          ->cascadeOnDelete()
          ->cascadeOnUpdate();

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
