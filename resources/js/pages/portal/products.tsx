import PortalLayout from '@/layouts/portal-layout';
import { PaginatedProduct } from '@/types/product';

import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

type PageProps = {
    products: PaginatedProduct;
    categories: { name: string }[];
    filters: {
        name?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
    };
};

const Products: React.FC<PageProps> = ({ products, categories, filters }) => {
    const [name, setName] = useState(filters.name || '');
    const [category, setCategory] = useState(filters.category || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = () => {
        router.get(
            route('portal.products'),
            {
                name,
                category,
                min_price: minPrice,
                max_price: maxPrice,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleReset = () => {
        setName('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        router.get(route('portal.products'));
    };

    // console.log(products);

    return (
        <PortalLayout>
            <Head>
                <title>Our Products | MyStore</title>
                <meta name="description" content="Browse our range of warehouse and inventory management solutions." />
            </Head>

            <section className="px-6 py-20 transition-colors duration-500 sm:px-12 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl">
                    <h1 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white">Our Products</h1>

                    {/* Search + Filter Toggle */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            onClick={() => setShowFilters((prev) => !prev)}
                            className="flex items-center justify-between rounded-md border bg-gray-100 px-4 py-2 text-sm font-medium transition hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        >
                            Filter Products {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                        </button>
                    </div>

                    {/* Filter Form */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                key="filters"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="overflow-hidden"
                            >
                                <div className="mb-10 rounded-md border p-4 dark:border-gray-700">
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Search products..."
                                                className="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                            >
                                                <option value="">All</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.name} value={cat.name}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Price</label>
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                placeholder="e.g. 100"
                                                className="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price</label>
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                placeholder="e.g. 500"
                                                className="mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            onClick={handleReset}
                                            className="rounded-md bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={handleFilter}
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Product Cards */}
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {products.data.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden rounded-xl bg-white shadow transition-transform duration-300 hover:scale-[1.02] dark:bg-gray-800"
                            >
                                <img
                                    src={
                                        product.image_path
                                            ? `/storage/${product.image_path}`
                                            : 'https://i.pinimg.com/736x/de/3f/ec/de3fecf5e76cad3e5e0ab6163e49d5bd.jpg'
                                    }
                                    alt={product.name}
                                    className="h-48 w-full object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{product.name}</h3>

                                    <div className="mt-2 flex items-center gap-4">
                                        {product.avg_rating && !isNaN(parseFloat(product.avg_rating)) ? (
                                            <div className="flex items-center text-sm text-yellow-500">
                                                ★ {parseFloat(product.avg_rating).toFixed(1)}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400">No rating yet</div>
                                        )}
                                        <div className="text-sm text-gray-500">{product.total_sold} sold</div>
                                    </div>

                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{product.description}</p>

                                    {product.category && (
                                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Category: {product.category.name}</p>
                                    )}

                                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">RM {product.price}</p>

                                    <Link
                                        href={route('portal.product-view', product.id)}
                                        className="mt-4 inline-block rounded-md bg-indigo-700 px-4 py-2 text-white transition hover:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                        {products.data.length === 0 && (
                            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No products found.</p>
                        )}
                    </div>

                    {/* Pagination Info + Links */}
                    <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        {/* Showing info */}
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Showing <span className="font-medium">{(products.current_page - 1) * products.per_page + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(products.total, products.current_page * products.per_page)}</span> of{' '}
                            <span className="font-medium">{products.total}</span> products
                        </div>

                        {/* Pagination links */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {products.links.map((link, index) => {
                                const isActive = link.active;
                                const isDisabled = link.url === null;

                                return (
                                    <Link
                                        key={index}
                                        href={link.url ?? '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded px-3 py-1 text-sm transition ${
                                            isActive
                                                ? 'bg-indigo-600 text-white'
                                                : isDisabled
                                                  ? 'cursor-default bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                        }`}
                                        onClick={(e) => {
                                            if (isDisabled) e.preventDefault();
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </PortalLayout>
    );
};

export default Products;
