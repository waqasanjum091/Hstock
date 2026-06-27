<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendor_profiles')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->string('sku')->nullable()->unique();
            $table->integer('quantity')->default(0);
            $table->boolean('in_stock')->default(true);
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('specifications')->nullable();
            $table->json('tags')->nullable();
            $table->string('featured_image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sales_count')->default(0);
            $table->decimal('avg_rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('vendor_id');
            $table->index('category_id');
            $table->index('brand_id');
            $table->index('is_featured');
            $table->index('is_active');
            $table->index('price');
            $table->index('sales_count');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
