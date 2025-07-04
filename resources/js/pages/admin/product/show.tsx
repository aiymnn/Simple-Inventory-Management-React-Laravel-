import { RestockModal } from '@/components/restock-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, FileClock } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    sku: string;
    description?: string;
    price: number | string;
    quantity: number;
    category?: { name: string };
    supplier?: { name: string; phone: string; address: string; created_at: string };
    image_path?: string;
    avg_rating?: number;
    reviews_count?: number;
    sales_count?: number;
    recent_reviews?: { user: string; rating: number; comment: string; created_at: string }[];
    recent_orders?: { id: number; buyer: string; quantity: number; date: string }[];
}

interface ShowProps {
    product: Product;
}

export default function Show({ product }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/admin/products' },
        { title: product.name, href: `/admin/products/${product.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Product - ${product.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <Link href="/admin/products">
                            <Button className="cursor-pointer" variant={'default'}>
                                Back
                            </Button>
                        </Link>
                        <RestockModal productId={product.id} />
                    </div>
                    <div className="block">
                        <Link href={`/admin/stocks/product/${product.id}`} className="w-fit">
                            <Button variant="default" className="flex cursor-pointer items-center gap-1">
                                <FileClock className="h-4 w-4" />
                                View Logs
                            </Button>
                        </Link>
                    </div>
                </div>

                <div>
                    <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
                    <CardDescription>SKU: {product.sku}</CardDescription>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <Card>
                        <CardContent>
                            <div className="flex w-full items-center justify-center">
                                {product.image_path ? (
                                    <img
                                        src={`/storage/${product.image_path}`}
                                        alt={product.name}
                                        className="h-80 w-auto rounded-md border object-contain"
                                    />
                                ) : (
                                    <div className="text-muted-foreground italic">No product image</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                            <CardDescription>Basic product info</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground font-medium">Category</p>
                                <p>{product.category?.name ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">Description</p>
                                <p className="text-sm whitespace-pre-line text-gray-700">
                                    {product.description || <span className="text-muted-foreground italic">No description provided.</span>}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">Price</p>
                                <p className="text-lg font-bold text-green-600">RM {Number(product.price).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">Stock</p>
                                <Badge
                                    className="flex items-center justify-center text-base"
                                    variant={product.quantity > 0 ? 'default' : 'destructive'}
                                >
                                    {product.quantity} in stock
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier Details</CardTitle>
                            <CardDescription>Basic supplier info</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground font-medium">Name</p>
                                <p>{product.supplier?.name ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">Phone</p>
                                <p>{product.supplier?.phone ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">Address</p>
                                <p>{product.supplier?.address ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">Register at</p>
                                <p>
                                    {product.supplier?.created_at
                                        ? new Date(product.supplier.created_at).toLocaleDateString('en-MY', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })
                                        : '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground font-medium">Total Sales</p>
                                <p className="text-2xl font-bold">{product.sales_count ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">Average Rating</p>
                                <p className="text-2xl font-bold">
                                    {product.avg_rating !== undefined && product.avg_rating !== null
                                        ? `${Number(product.avg_rating).toFixed(1)} / 5`
                                        : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium">Total Reviews</p>
                                <p className="text-2xl font-bold">{product.reviews_count ?? 0}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Latest Reviews */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>📝 Latest Reviews</CardTitle>
                            <Link className="text-primary text-sm underline" href="#">
                                See all
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {product.recent_reviews?.length ? (
                                product.recent_reviews.map((review, idx) => (
                                    <div key={idx} className="bg-muted/50 hover:bg-muted rounded-lg border p-4 transition-colors duration-200">
                                        <div className="mb-1 flex items-center justify-between">
                                            <p className="text-primary font-semibold">{review.user}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {new Date(review.created_at).toLocaleString('en-MY', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-yellow-500">
                                            <span>
                                                {'★'.repeat(review.rating)}
                                                {'☆'.repeat(5 - review.rating)}
                                            </span>
                                            <span className="text-muted-foreground text-xs">{review.rating} / 5</span>
                                        </div>

                                        <p className="text-foreground mt-2 text-sm italic">"{review.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground italic">No reviews yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>📦 Recent Orders</CardTitle>
                            <Link className="text-primary text-sm underline" href="#">
                                See all
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {product.recent_orders?.length ? (
                                product.recent_orders.map((order, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-muted/50 hover:bg-muted flex flex-col gap-3 rounded-lg border p-4 transition-colors duration-200 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div>
                                            <p className="text-primary font-medium">
                                                Order <span className="font-bold">#{order.id}</span>
                                            </p>
                                            <p className="text-foreground text-sm">👤 Buyer: {order.buyer}</p>
                                            <p className="text-foreground text-sm">🛒 Quantity: {order.quantity}</p>
                                            <p className="text-muted-foreground mt-1 text-xs">
                                                {new Date(order.date).toLocaleDateString('en-MY', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <Link href="#">
                                            <Button variant="secondary" size="sm" className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground italic">No recent orders.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
