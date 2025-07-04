import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/admin/products' },
    { title: 'New product', href: '/admin/products/create' },
];

interface Category {
    id: string;
    name: string;
}

interface Supplier {
    id: string;
    name: string;
}

interface AddProps {
    categories: Category[];
    suppliers: Supplier[];
}

export default function Create({ categories, suppliers }: AddProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        quantity: '',
        category_id: '',
        supplier_id: '',
        description: '',
        image_path: undefined as File | undefined,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/products', {
            onSuccess: () => {
                reset(); // reset semua field dalam useForm
                setImagePreview(null); // jika ada image preview
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Product" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <Link href="/admin/products">
                        <Button variant={'default'}>Back</Button>
                    </Link>
                </div>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>New product</CardTitle>
                        <CardDescription>Fill all required fields</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-6">
                                {/* Column 1 */}
                                <div className="flex flex-col gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter product name"
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="Enter product price"
                                        />
                                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            placeholder="Enter product quantity"
                                        />
                                        {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="category_id">Category</Label>
                                            <Select
                                                onValueChange={(value) => setData('category_id', value)} // `value` is always a string
                                                value={data.category_id?.toString() || ''} // force string for matching
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="supplier_id">Supplier</Label>
                                            <Select
                                                onValueChange={(value) => setData('supplier_id', value)}
                                                value={data.supplier_id?.toString() || ''}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select supplier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {suppliers.map((sup) => (
                                                            <SelectItem key={sup.id} value={sup.id.toString()}>
                                                                {sup.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            {errors.supplier_id && <p className="text-sm text-red-500">{errors.supplier_id}</p>}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter product description"
                                        />
                                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                    </div>
                                </div>

                                {/* Full width row: image upload */}
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="image_path">Image</Label>
                                    <Input
                                        id="image_path"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setData('image_path', file);
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {errors.image_path && <p className="text-sm text-red-500">{errors.image_path}</p>}
                                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover" />}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="submit" onClick={handleSubmit} disabled={processing}>
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="outline" type="button" onClick={() => router.visit('/admin/products')}>
                            Back
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
