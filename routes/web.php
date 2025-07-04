<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\{
    Admin\CategoryController,
    Admin\ProductController,
    Admin\SupplierController,
    CartController,
    CartItemController,
    CheckoutController,
    OrderController,
    PortalController,
    ReviewController,
    StockMovementController,
    StripePaymentController,
    UserController,
};

// Public Route
Route::get('/', fn() => Inertia::render('welcome'))->name('home');

// Dashboard (Authenticated & Verified)
Route::middleware(['auth', 'verified'])->get('/dashboard', fn() => Inertia::render('dashboard'))->name('dashboard');

// Admin Routes
Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::resources([
        'products' => ProductController::class,
        'categories' => CategoryController::class,
        'suppliers' => SupplierController::class,
        'orders' => OrderController::class,
        'users' => UserController::class,
    ]);

    Route::resource('stocks', StockMovementController::class)->only(['store']);

    // Custom stock logs route per product
    Route::get('stocks/product/{product}', [StockMovementController::class, 'productLogs'])->name('stocks.product');
});

// Portal Routes
Route::prefix('portal')->controller(PortalController::class)->group(function () {
    Route::get('home', 'home')->name('portal.home');
    Route::get('products', 'products')->name('portal.products');
    Route::get('products/{product}/product-view', 'productView')->name('portal.product-view');
    Route::get('about', 'about')->name('portal.about');
    Route::get('contact', 'contact')->name('portal.contact');

    //orders
    Route::get('my-orders', 'myOrders')->name('my-orders');
    Route::post('orders/{order}/cancel', 'cancelOrder')->name('cancel-order');
});

// Cart & Cart Items (Auth Required)
Route::middleware(['auth'])->group(function () {
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::get('/portal/carts', [CartController::class, 'index'])->name('portal.mycart');

    Route::put('/cart/items/{item}', [CartItemController::class, 'update']);
    Route::delete('/cart/items/{item}', [CartItemController::class, 'destroy']);
});

// Checkout & Orders (Auth Required)
Route::middleware(['auth'])->group(function () {
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');
    Route::post('/checkout/buy-now', [CheckoutController::class, 'buyNow'])->name('checkout.buy-now');
    Route::post('/checkout/pay/{order}', [CheckoutController::class, 'pay'])->name('checkout.pay');

    // Route::get('/portal/my-orders', [OrderController::class, 'index'])->name('my-order.index');
    // Route::post('/portal/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');
});

// Reviews (Auth Required)
Route::middleware(['auth'])->resource('reviews', ReviewController::class)->only(['store']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
