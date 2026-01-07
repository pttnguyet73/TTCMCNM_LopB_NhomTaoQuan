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
        Schema::create('order_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('order')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('product_id')->constrained('product')->onDelete('cascade  ')->onUpdate('cascade');
            $table->integer('quantity')->unsigned();
            $table->decimal('price_at_purchase', 10, 2)->unsigned();
            $table->text('color');
            $table->integer('storage')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item');
    }
};
