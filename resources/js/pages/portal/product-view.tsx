import PortalLayout from '@/layouts/portal-layout';
import { PageProps } from '@/types/global';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import dayjs from 'dayjs';

// Types
type Review = {
    id: number;
    user: { name: string };
    comment: string;
    rating: number;
    created_at: string;
};

type ProductViewProps = PageProps & {
    product: {
        id: number;
        name: string;
        sku: string;
        image_path: string | null;
        price: string;
        quantity: number;
        description?: string;
        category: { name: string };
        supplier: { name: string };
        total_sold: number;
        avg_rating: number | null;
        reviews?: Review[];
    };
};

const ProductView: React.FC = () => {
    const { product } = usePage<ProductViewProps>().props;
    const [qty, setQty] = useState(1);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [loading, setLoading] = useState(false);
    const [buyNowLoading, setBuyNowLoading] = useState(false);

    const handleAddToCart = () => {
        setLoading(true);
        router.post(
            route('cart.store'),
            {
                product_id: product.id,
                quantity: qty,
            },
            {
                preserveScroll: true,
                onSuccess: () => alert('Product added to cart!'),
                onFinish: () => setLoading(false),
            },
        );
    };

    const handleBuyNow = () => {
        setBuyNowLoading(true);
        router.post(
            route('checkout.buy-now'),
            {
                product_id: product.id,
                quantity: qty,
            },
            {
                preserveScroll: true,
                onError: () => alert('Something went wrong.'),
                onFinish: () => setBuyNowLoading(false),
            },
        );
    };

    const reviewsToShow = showAllReviews ? product.reviews || [] : (product.reviews || []).slice(0, 3);

    return (
        <PortalLayout>
            <Head title={`${product.name} | Product Details`} />

            {/* Product Section */}
            <section className="bg-white px-6 py-16 transition-colors sm:px-12 dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-12 md:grid-cols-2"
                >
                    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                        <img
                            src={
                                product.image_path
                                    ? `/storage/${product.image_path}`
                                    : 'https://i.pinimg.com/736x/de/3f/ec/de3fecf5e76cad3e5e0ab6163e49d5bd.jpg'
                            }
                            alt={product.name}
                            className="w-full object-cover"
                        />
                    </div>

                    <div>
                        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                        <p className="mb-2 text-gray-600 dark:text-gray-300">
                            <strong>SKU:</strong> {product.sku}
                        </p>
                        <p className="mb-2 text-gray-600 dark:text-gray-300">
                            <strong>Category:</strong> {product.category.name}
                        </p>
                        <p className="mb-2 text-gray-600 dark:text-gray-300">
                            <strong>Supplier:</strong> {product.supplier.name}
                        </p>
                        <p className="mb-2 text-gray-600 dark:text-gray-300">
                            <strong>Price:</strong> RM {Number(product.price).toFixed(2)}
                        </p>

                        <div className="mb-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span>
                                <strong>Sold:</strong> {product.total_sold} pcs
                            </span>
                            {typeof product.avg_rating === 'number' && !isNaN(product.avg_rating) && (
                                <span className="flex items-center gap-1 text-yellow-500">
                                    <span>★</span>
                                    <span>{product.avg_rating.toFixed(1)} / 5</span>
                                </span>
                            )}
                        </div>

                        <p className="mb-4 text-gray-600 dark:text-gray-300">
                            <strong>Stock:</strong>{' '}
                            {product.quantity > 0 ? (
                                <span className="font-medium text-green-600 dark:text-green-400">{product.quantity} available</span>
                            ) : (
                                <span className="font-medium text-red-600 dark:text-red-400">Out of stock</span>
                            )}
                        </p>

                        {product.description && <p className="mb-8 text-gray-700 dark:text-gray-200">{product.description}</p>}

                        <div className="mb-4">
                            <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Quantity
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min={1}
                                max={product.quantity}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="w-24 rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div className="mb-10 flex flex-wrap gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={loading || product.quantity === 0}
                                className={`rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                {loading ? 'Adding...' : 'Add to Cart'}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={buyNowLoading || product.quantity === 0}
                                className={`rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 ${buyNowLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                {buyNowLoading ? 'Redirecting...' : 'Buy Now'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Review Section */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white px-6 pb-20 transition-colors sm:px-12 dark:bg-gray-900"
            >
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Customer Reviews</h2>
                        <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <span>{product.reviews?.length || 0} reviews</span>
                            <span className="hidden sm:inline">|</span>
                            {typeof product.avg_rating === 'number' && !isNaN(product.avg_rating) && (
                                <span className="text-yellow-500">★ {product.avg_rating.toFixed(1)} / 5</span>
                            )}
                        </div>
                    </div>

                    {product.reviews && product.reviews.length > 0 ? (
                        <>
                            <AnimatePresence>
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6 overflow-hidden"
                                >
                                    {reviewsToShow.map((review) => (
                                        <div
                                            key={review.id}
                                            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{review.user.name}</span>
                                                <span className="text-sm text-yellow-500">★ {review.rating}</span>
                                            </div>
                                            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                                {dayjs(review.created_at).format('MMM D, YYYY h:mm A')}
                                            </p>
                                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{review.comment}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {(product.reviews.length > 3 || showAllReviews) && (
                                <button
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                    className="mt-6 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    {showAllReviews ? 'Show Less Reviews' : 'See More Reviews'}
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No reviews yet.</p>
                    )}
                </div>
            </motion.section>
        </PortalLayout>
    );
};

export default ProductView;
