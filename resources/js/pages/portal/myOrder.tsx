import ReviewModal from '@/components/review-modal';
import PortalLayout from '@/layouts/portal-layout';
import { Head, router, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

// Type definitions
type Product = { id: number; name: string; image_path: string; price: number; quantity?: number };
type OrderItem = { product: Product; quantity: number; unit_price: number | string };
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';
type Order = {
    id: number;
    status: OrderStatus;
    created_at: string;
    total_price: number | string;
    items: OrderItem[];
};
type PageProps = {
    orders: Order[];
    activeTab: OrderStatus;
};

const statusColor = {
    shipped: 'text-green-600 bg-green-100',
    paid: 'text-indigo-600 bg-indigo-100',
    pending: 'text-yellow-600 bg-yellow-100',
    cancelled: 'text-red-600 bg-red-100',
};

const tabs: OrderStatus[] = ['pending', 'paid', 'shipped', 'cancelled'];

const MyOrder: React.FC = () => {
    const { orders = [], activeTab: initialTab } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState<OrderStatus>(initialTab);
    const [showModal, setShowModal] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<number | null>(null);
    const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);

    const filteredOrders = orders.filter((order) => order.status === activeTab);

    const switchTab = (tab: OrderStatus) => {
        setActiveTab(tab);
        router.visit(route('my-orders', { tab }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openReviewModal = (orderId: number, productId: number) => {
        setReviewOrderId(orderId);
        setReviewProductId(productId);
        setShowModal(true);
    };

    const closeReviewModal = () => {
        setShowModal(false);
        setReviewOrderId(null);
        setReviewProductId(null);
    };

    const handleCancel = (orderId: number) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.post(route('cancel-order', orderId));
        }
    };

    return (
        <PortalLayout>
            <Head title="My Orders | MyStore" />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-5xl px-4 py-8"
            >
                <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">My Orders</h1>

                <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => switchTab(tab)}
                            className={clsx(
                                'pb-2 text-sm font-medium transition',
                                activeTab === tab
                                    ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300',
                            )}
                        >
                            {tab === 'shipped' ? 'Completed' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                            const total = Number(order.total_price);
                            const hasOutOfStockItem = order.items.some(
                                (item) => item.product.quantity !== undefined && item.quantity > item.product.quantity,
                            );

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.25 }}
                                    className="mb-6 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="mb-4 flex flex-wrap items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: #{order.id}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Date: {order.created_at}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[order.status]}`}>
                                                {order.status === 'shipped' ? 'completed' : order.status}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Total: RM{isNaN(total) ? '0.00' : total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {order.items.map((item, index) => {
                                            const subtotal = Number(item.unit_price) * Number(item.quantity);
                                            const isOutOfStock = item.product.quantity !== undefined && item.quantity > item.product.quantity;

                                            return (
                                                <div key={index} className="flex items-center gap-4 py-3">
                                                    <img
                                                        src={
                                                            item.product.image_path
                                                                ? `/storage/${item.product.image_path}`
                                                                : 'https://i.pinimg.com/736x/de/3f/ec/de3fecf5e76cad3e5e0ab6163e49d5bd.jpg'
                                                        }
                                                        alt={item.product.name}
                                                        className="h-16 w-16 rounded border object-cover dark:border-gray-600"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800 dark:text-white">{item.product.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                        {isOutOfStock && (
                                                            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Out of stock</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        RM{subtotal.toFixed(2)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Review Buttons */}
                                    {order.status === 'shipped' &&
                                        order.items.map((item, index) => (
                                            <div key={index} className="mt-4 flex justify-end gap-2">
                                                <button
                                                    onClick={() => openReviewModal(order.id, item.product.id)}
                                                    className="rounded bg-green-600 px-4 py-1 text-sm text-white hover:bg-green-700"
                                                >
                                                    Review {item.product.name}
                                                </button>
                                            </div>
                                        ))}

                                    {/* Pending Order Actions */}
                                    {order.status === 'pending' && (
                                        <div className="mt-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => handleCancel(order.id)}
                                                className="rounded bg-red-600 px-4 py-1 text-sm text-white hover:bg-red-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={hasOutOfStockItem}
                                                onClick={() => router.post(route('checkout.pay', order.id))}
                                                className={clsx(
                                                    'rounded px-4 py-1 text-sm text-white',
                                                    hasOutOfStockItem ? 'cursor-not-allowed bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700',
                                                )}
                                            >
                                                {hasOutOfStockItem ? 'Out of Stock' : 'Pay Now'}
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">No {activeTab} orders found.</p>
                    )}
                </motion.div>
            </motion.div>

            {reviewProductId && reviewOrderId && (
                <ReviewModal isOpen={showModal} onClose={closeReviewModal} productId={reviewProductId} orderId={reviewOrderId} />
            )}
        </PortalLayout>
    );
};

export default MyOrder;
