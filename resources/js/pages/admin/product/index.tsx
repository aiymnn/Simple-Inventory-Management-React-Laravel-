import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PaginatedProduct } from '@/types/product';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, Eye, Pencil, RefreshCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductPageProps {
    products: PaginatedProduct;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/admin/products',
    },
];

export function DeleteButton({ productId }: { productId: number }) {
    const form = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            form.delete(`/admin/products/${productId}`, {
                onSuccess: () => {
                    // Optional: redirect or show toast
                },
            });
        }
    };

    return (
        <Button onClick={handleDelete} variant="destructive" disabled={form.processing}>
            <Trash2 />
            Delete
        </Button>
    );
}

export default function Index({ products }: ProductPageProps) {
    // console.log(products);
    const [showFilters, setShowFilters] = useState(false);

    const { filters } = usePage().props as {
        filters?: {
            name?: string;
            sku?: string;
            category?: string;
            supplier?: string;
        };
    };

    const { data, setData, get } = useForm({
        name: filters?.name || '',
        sku: filters?.sku || '',
        category: filters?.category || '',
        supplier: filters?.supplier || '',
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get('/admin/products', {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Link href="/admin/products/create">
                            <Button className="cursor-pointer" variant="secondary">
                                New Product
                            </Button>
                        </Link>

                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex cursor-pointer items-center gap-1">
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                    </div>

                    {/* Collapsible Filter */}
                    <div
                        className={clsx(
                            'overflow-hidden transition-all duration-300 ease-in-out',
                            showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
                        )}
                    >
                        <Card>
                            <CardContent className="pt-6">
                                <form onSubmit={handleFilterSubmit}>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="sku">SKU</Label>
                                            <Input
                                                id="sku"
                                                value={data.sku}
                                                onChange={(e) => setData('sku', e.target.value)}
                                                placeholder="Enter SKU"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="category">Category</Label>
                                            <Input
                                                id="category"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                placeholder="Enter category"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="supplier">Supplier</Label>
                                            <Input
                                                id="supplier"
                                                value={data.supplier}
                                                onChange={(e) => setData('supplier', e.target.value)}
                                                placeholder="Enter supplier"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button className="cursor-pointer" type="submit">
                                            Search
                                        </Button>
                                        <Link href="/admin/products">
                                            <Button className="cursor-pointer" variant="outline">
                                                <RefreshCcw />
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Table>
                    {/* <TableCaption>A list of your products.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.length > 0 ? (
                            products.data.map((product, index) => (
                                <TableRow key={product.id}>
                                    <TableCell>{products.from + index}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.category?.name}</TableCell>
                                    <TableCell>{product.supplier?.name}</TableCell>
                                    <TableCell className="flex justify-end gap-2 text-right">
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Button variant="outline">
                                                <Eye />
                                                View
                                            </Button>
                                        </Link>

                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button variant="secondary">
                                                <Pencil />
                                                Edit
                                            </Button>
                                        </Link>

                                        {/* Delete Form */}
                                        <DeleteButton productId={product.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-muted-foreground text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div>
                    <span>
                        Showing of <strong>{products.from}</strong> to <strong>{products.to}</strong> from <strong>{products.total}</strong>
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {products.links.map((link, index) => {
                        const isDisabled = link.url === null;
                        const isActive = link.active;

                        return (
                            <Link href={link.url ?? '#'} key={index}>
                                <Button
                                    variant={isActive ? 'default' : 'secondary'}
                                    className={`text-sm ${isDisabled ? 'cursor-default opacity-50' : 'cursor-pointer'} `}
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
