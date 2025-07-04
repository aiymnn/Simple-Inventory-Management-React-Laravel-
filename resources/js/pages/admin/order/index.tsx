import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import clsx from 'clsx';

interface Order {
    id: number;
    created_at: string;
    status: string;
    payment_method: string;
    total_amount: string;
    user?: {
        name: string;
    };
    items: {
        product_name: string;
        product_quantity: number;
    }[];
}

interface PageProps {
    orders: {
        data: Order[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        from: number;
        to: number;
        total: number;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];

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

export default function Index() {
    const { orders } = usePage<PageProps>().props;

    const { put, processing } = useForm();

    const handleUpdateOrder = (orderId: number) => {
        put(route('orders.update', orderId), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            {/* <TableHead>Method</TableHead> */}
                            <TableHead>User</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Amount (RM)</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{formatDate(order.created_at)}</TableCell>
                                <TableCell>{formatTime(order.created_at)}</TableCell>
                                <TableCell>
                                    <span
                                        className={clsx(
                                            'rounded px-2 py-0.5 text-xs font-medium',
                                            order.status === 'paid' && 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100',
                                            order.status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
                                            order.status === 'cancelled' && 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100',
                                            order.status === 'shipped' && 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100',
                                        )}
                                    >
                                        {order.status}
                                    </span>
                                </TableCell>
                                {/* <TableCell>{order.payment_method}</TableCell> */}
                                <TableCell>{order.user?.name ?? '—'}</TableCell>
                                <TableCell>
                                    <div className="grid gap-1">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 rounded px-2 py-1">
                                                <span>{item.product_quantity}</span>
                                                <span>x</span>
                                                <span>{item.product_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell>{Number(order.total_amount).toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    {order.status === 'paid' ? (
                                        <Button
                                            onClick={() => handleUpdateOrder(order.id)}
                                            className="cursor-pointer"
                                            variant="secondary"
                                            disabled={processing}
                                        >
                                            Shipping
                                        </Button>
                                    ) : (
                                        <span className="text-slate-400 italic">Updated</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div>
                    <span>
                        Showing <strong>{orders.from}</strong> to <strong>{orders.to}</strong> of <strong>{orders.total}</strong>
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {orders.links.map((link, index) => {
                        const isDisabled = link.url === null;
                        const isActive = link.active;

                        return (
                            <Link href={link.url ?? '#'} key={index}>
                                <Button
                                    variant={isActive ? 'default' : 'secondary'}
                                    className={`text-sm ${isDisabled ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
