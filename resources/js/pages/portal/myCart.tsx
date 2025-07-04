import PortalLayout from '@/layouts/portal-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

type Product = {
    id: number;
    name: string;
    price: number;
    image_path: string | null;
    category?: { id: number; name: string } | null;
    supplier?: { id: number; name: string } | null;
};

type CartItem = {
    id: number;
    quantity: number;
    product: Product;
};

type Cart = {
    id: number;
    items: CartItem[];
};

type PageProps = {
    cart: Cart | null;
};

const MyCart: React.FC = () => {
    const { cart } = usePage<PageProps>().props;
    const [items, setItems] = useState<CartItem[]>(cart?.items || []);
    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
    const { post, processing } = useForm();

    const handleQuantityChange = (id: number, qty: number) => {
        const updatedQty = qty > 0 ? qty : 1;
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: updatedQty } : item)));
        setUpdatingItemId(id);

        router.put(
            `/cart/items/${id}`,
            { quantity: updatedQty },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingItemId(null),
                onError: () => alert('Failed to update quantity.'),
            },
        );
    };

    const handleRemove = (id: number) => {
        if (!confirm('Are you sure you want to remove this item from your cart?')) return;

        setItems((prev) => prev.filter((item) => item.id !== id));

        router.delete(`/cart/items/${id}`, {
            preserveScroll: true,
            onError: () => alert('Failed to remove item from cart.'),
        });
    };

    const handleCheckout = () => {
        post('/checkout', {
            preserveScroll: true,
            onError: () => alert('Checkout failed. Please try again.'),
        });
    };

    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <PortalLayout>
            <Head title="My Cart | MyStore" />
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-5xl px-4 py-8"
            >
                <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">My Cart</h1>

                {items.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Cart List */}
                        <div className="space-y-4 md:col-span-2">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-4 rounded border p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <img
                                        src={item.product.image_path ? `/storage/${item.product.image_path}` : 'https://via.placeholder.com/80'}
                                        alt={item.product.name}
                                        className="h-20 w-20 rounded border object-cover dark:border-gray-600"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 dark:text-white">{item.product.name}</p>
                                        {item.product.category && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Category: {item.product.category.name}</p>
                                        )}
                                        {item.product.supplier && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Supplier: {item.product.supplier.name}</p>
                                        )}
                                        <p className="text-sm text-gray-500 dark:text-gray-400">RM {Number(item.product.price).toFixed(2)} each</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <label className="text-sm text-gray-600 dark:text-gray-300">Qty:</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                className="w-16 rounded border px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                min={1}
                                                disabled={updatingItemId === item.id}
                                            />
                                            {updatingItemId === item.id && (
                                                <span className="animate-pulse text-xs text-gray-400 dark:text-gray-500">Saving...</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                                            RM {(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button onClick={() => handleRemove(item.id)} className="mt-2 text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary Section */}
                        <div className="rounded border p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Summary</h2>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                <span>Subtotal</span>
                                <span>RM {subtotal.toFixed(2)}</span>
                            </div>
                            <hr className="my-4 border-gray-200 dark:border-gray-600" />
                            <button
                                onClick={handleCheckout}
                                disabled={processing}
                                className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Redirecting...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">Your cart is empty.</p>
                )}
            </motion.div>
        </PortalLayout>
    );
};

export default MyCart;
