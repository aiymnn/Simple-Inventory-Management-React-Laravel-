import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import clsx from 'clsx';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    image_path: string;
}

interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    unit_price: number;
}

interface Order {
    id: number;
    total_price: string;
    created_at: string;
    status: string;
    items: OrderItem[];
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    orders: Order[];
}

interface PageProps {
    user: User;
    totalSpent: number;
    totalOrders: number;
    completedOrders: number;
}

function formatDate(datetime: string) {
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatTime(datetime: string) {
    const date = new Date(datetime);
    return date.toLocaleTimeString();
}

export default function Show({ user, totalSpent, totalOrders, completedOrders }: PageProps) {
    const [showAllOrders, setShowAllOrders] = useState(false);
    const visibleOrders = showAllOrders ? user.orders : user.orders.slice(0, 3);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Manage User', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
    ];

    console.log(user);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user.name} />
            <div className="pt-4 pl-4">
                <Link href="/admin/users">
                    <Button className="cursor-pointer" variant={'default'}>
                        Back
                    </Button>
                </Link>
            </div>
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <h2 className="text-2xl font-semibold">User Details</h2>

                <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="grid grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-gray-100">Name:</span>
                        <span className="col-span-2">{user.name}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-gray-100">Email:</span>
                        <span className="col-span-2">{user.email}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-gray-100">Role:</span>
                        <span className="col-span-2 capitalize">{user.role}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-gray-100">Registered:</span>
                        <span className="col-span-2">
                            {formatDate(user.created_at)} at {formatTime(user.created_at)}
                        </span>
                    </div>

                    <hr className="my-2 border-gray-200 dark:border-gray-700" />

                    <div className="grid grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-gray-100">Total Orders:</span>
                        <span className="col-span-2">{totalOrders}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-gray-100">Completed Orders:</span>
                        <span className="col-span-2">{completedOrders}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-gray-100">Total Spent:</span>
                        <span className="col-span-2 font-semibold text-green-600 dark:text-green-400">RM {Number(totalSpent).toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-6">
                    {user.orders.length > 0 ? (
                        <>
                            <div className="flex justify-between">
                                <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Orders History ({visibleOrders.length})</h3>
                                {user.orders.length > 3 && (
                                    <div>
                                        <Button variant="link" onClick={() => setShowAllOrders(!showAllOrders)}>
                                            {showAllOrders ? 'Show Less' : 'View More Orders'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {visibleOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                                >
                                    {/* Order Header */}
                                    <div className="mb-4 flex items-center justify-between text-sm">
                                        <div className="flex gap-3 text-gray-700 dark:text-gray-300">
                                            <strong className="text-gray-800 dark:text-gray-100">Order ID:</strong> #{order.id}
                                            <span
                                                className={clsx(
                                                    'rounded px-2 py-0.5 text-xs font-medium',
                                                    order.status === 'paid' && 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100',
                                                    order.status === 'pending' &&
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
                                                    order.status === 'cancelled' && 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100',
                                                    order.status === 'shipped' && 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100',
                                                )}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-base font-semibold text-green-600 dark:text-green-400">RM {order.total_price}</div>
                                    </div>

                                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                        <strong className="text-gray-800 dark:text-gray-100">Date:</strong> {formatDate(order.created_at)}{' '}
                                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-500">{formatTime(order.created_at)}</span>
                                    </div>

                                    {/* Products in Order */}
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 border-t pt-4">
                                                <img
                                                    src={`/storage/${item.product.image_path}`}
                                                    alt={item.product.name}
                                                    className="h-14 w-14 rounded border object-cover shadow-sm"
                                                />
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-800 dark:text-gray-100">
                                                        <Link href={`/admin/products/${item.product.id}`} className="hover:underline">
                                                            {item.product.name}
                                                        </Link>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Total: {(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {user.orders.length > 3 && (
                                <div className="mt-4">
                                    <Button variant="link" onClick={() => setShowAllOrders(!showAllOrders)}>
                                        {showAllOrders ? 'Show Less' : 'View More Orders'}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-lg text-gray-500 italic dark:text-gray-400">This user has no completed orders.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
