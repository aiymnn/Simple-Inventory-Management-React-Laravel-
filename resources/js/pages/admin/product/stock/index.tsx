import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import clsx from 'clsx';

interface StockMovement {
    id: number;
    type: 'in' | 'out';
    quantity: number;
    note?: string;
    performed_by: number;
    created_at: string;
    user?: { name: string };
}

interface ShowProps {
    product: {
        id: number;
        name: string;
        stock_movements: StockMovement[];
    };
}

export default function Show({ product }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/admin/products' },
        { title: product.name, href: `/admin/products/${product.id}` },
        { title: 'Logs', href: `/admin/stocks/${product.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Logs - ${product.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <Link href={`/admin/products/${product.id}`}>
                        <Button className="cursor-pointer" variant={'default'}>
                            Back
                        </Button>
                    </Link>
                </div>
                <h2 className="text-2xl font-bold">Stock Movement Log</h2>

                <div className="bg-muted/50 overflow-x-auto rounded-lg border shadow-sm">
                    <Table>
                        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead className="text-right">Performed by</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {product.stock_movements.length > 0 ? (
                                product.stock_movements.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            {new Date(log.created_at).toLocaleString('en-MY', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={clsx(
                                                    'inline-flex rounded-full px-3 py-1 text-xs font-medium',
                                                    log.type === 'in'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
                                                )}
                                            >
                                                {log.type === 'in' ? 'Stock In' : 'Stock Out'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{log.quantity}</TableCell>
                                        <TableCell>{log.note ?? '-'}</TableCell>
                                        <TableCell className="text-right">{log.user?.name ?? '—'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell>No stock movement logs found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {/* <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-muted text-left">
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold">Type</th>
                                <th className="px-4 py-3 font-semibold">Quantity</th>
                                <th className="px-4 py-3 font-semibold">Note</th>
                                <th className="px-4 py-3 font-semibold">Performed By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.stock_movements.length > 0 ? (
                                product.stock_movements.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted border-t transition-colors">
                                        <td className="px-4 py-2">
                                            {new Date(log.created_at).toLocaleString('en-MY', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={clsx(
                                                    'inline-flex rounded-full px-3 py-1 text-xs font-medium',
                                                    log.type === 'in'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
                                                )}
                                            >
                                                {log.type === 'in' ? 'Stock In' : 'Stock Out'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center font-bold">{log.quantity}</td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{log.note ?? '-'}</td>
                                        <td className="px-4 py-2">{log.user?.name ?? '—'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-muted-foreground px-4 py-6 text-center italic">
                                        No stock movement logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table> */}
                </div>
            </div>
        </AppLayout>
    );
}
