import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, LoaderCircle, Pencil, RefreshCcw, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at?: string;
    updated_at?: string;
}

interface LinkType {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSupplier {
    data: Supplier[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: LinkType[];
}

interface SupplierPageProps {
    filters?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    suppliers: PaginatedSupplier;
}

export default function Index({ suppliers }: SupplierPageProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const { filters } = usePage().props as { filters?: { name?: string } };
    const [name, setName] = useState(filters?.name || '');

    const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.get(
            '/admin/suppliers',
            { name },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Create form
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: creating,
        reset: resetCreate,
        errors: createErrors,
        clearErrors,
    } = useForm({ name: '', email: '', phone: '', address: '' });

    // Edit form
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: updating,
        reset: resetEdit,
        errors: editErrors,
        clearErrors: clearEditErrors,
    } = useForm({ name: '', email: '', phone: '', address: '' });

    // Delete form
    const { delete: destroy, processing: deleting } = useForm();

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/suppliers', {
            onSuccess: () => {
                resetCreate();
                setCreateOpen(false);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSupplier) return;
        put(`/admin/suppliers/${editingSupplier.id}`, {
            onSuccess: () => {
                resetEdit();
                setEditOpen(false);
                setEditingSupplier(null);
            },
        });
    };

    const handleDelete = () => {
        if (!deletingId) return;
        destroy(`/admin/suppliers/${deletingId}`, {
            onSuccess: () => {
                setDeleteOpen(false);
                setDeletingId(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Suppliers', href: '/admin/suppliers' }]}>
            <Head title="Suppliers" />
            <div className="flex flex-col gap-4 p-4">
                {/* Create Dialog */}
                <div className="flex items-center justify-between">
                    <Dialog
                        open={createOpen}
                        onOpenChange={(open) => {
                            setCreateOpen(open);
                            if (!open) {
                                resetCreate(); // Reset form values
                                clearErrors(); // ✅ Clear validation errors
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="cursor-pointer" variant="secondary">
                                <CirclePlus />
                                New Supplier
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleCreateSubmit}>
                                <DialogHeader>
                                    <DialogTitle>New Supplier</DialogTitle>
                                    <DialogDescription>Enter supplier details</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-3 py-4">
                                    <Label>Name</Label>
                                    <Input value={createData.name} onChange={(e) => setCreateData('name', e.target.value)} placeholder="Name" />
                                    {createErrors.name && <p className="text-sm text-red-500">{createErrors.name}</p>}

                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={createData.email}
                                        onChange={(e) => setCreateData('email', e.target.value)}
                                        placeholder="Email"
                                    />
                                    {createErrors.email && <p className="text-sm text-red-500">{createErrors.email}</p>}

                                    <Label>Phone</Label>
                                    <Input value={createData.phone} onChange={(e) => setCreateData('phone', e.target.value)} placeholder="Phone" />
                                    {createErrors.phone && <p className="text-sm text-red-500">{createErrors.phone}</p>}

                                    <Label>Address</Label>
                                    <Input
                                        value={createData.address}
                                        onChange={(e) => setCreateData('address', e.target.value)}
                                        placeholder="Address"
                                    />
                                    {createErrors.address && <p className="text-sm text-red-500">{createErrors.address}</p>}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={creating}>
                                        {creating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Save
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Search form */}
                    <form onSubmit={handleFilterSubmit} className="flex gap-2">
                        <Input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Search supplier..." />
                        <Button className="cursor-pointer" variant="secondary" type="submit">
                            <Search />
                        </Button>
                        <Link href="/admin/suppliers">
                            <Button className="cursor-pointer" variant="secondary">
                                <RefreshCcw />
                            </Button>
                        </Link>
                    </form>
                </div>

                {/* Edit Dialog */}
                <Dialog
                    open={editOpen}
                    onOpenChange={(open) => {
                        setEditOpen(open);
                        if (!open) {
                            resetEdit();
                            clearEditErrors(); // ✅ Clear edit errors
                            setEditingSupplier(null);
                        }
                    }}
                >
                    <DialogContent>
                        <form onSubmit={handleEditSubmit}>
                            <DialogHeader>
                                <DialogTitle>Edit Supplier</DialogTitle>
                                <DialogDescription>Update supplier details</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-3 py-4">
                                <Label>Name</Label>
                                <Input value={editData.name} onChange={(e) => setEditData('name', e.target.value)} />
                                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}

                                <Label>Email</Label>
                                <Input value={editData.email} onChange={(e) => setEditData('email', e.target.value)} />
                                {editErrors.email && <p className="text-sm text-red-500">{editErrors.email}</p>}

                                <Label>Phone</Label>
                                <Input value={editData.phone} onChange={(e) => setEditData('phone', e.target.value)} />
                                {editErrors.phone && <p className="text-sm text-red-500">{editErrors.phone}</p>}

                                <Label>Address</Label>
                                <Input value={editData.address} onChange={(e) => setEditData('address', e.target.value)} />
                                {editErrors.address && <p className="text-sm text-red-500">{editErrors.address}</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={updating}>
                                    {updating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Supplier</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this supplier?</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                                {deleting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suppliers.data.length > 0 ? (
                            suppliers.data.map((supplier, index) => (
                                <TableRow key={supplier.id}>
                                    <TableCell>{suppliers.from + index}</TableCell>
                                    <TableCell>{supplier.name}</TableCell>
                                    <TableCell>{supplier.email}</TableCell>
                                    <TableCell>{supplier.phone}</TableCell>
                                    <TableCell>{supplier.address}</TableCell>
                                    <TableCell className="flex justify-end gap-2 text-right">
                                        <Button
                                            className="cursor-pointer"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingSupplier(supplier);
                                                setEditData('name', supplier.name);
                                                setEditData('email', supplier.email);
                                                setEditData('phone', supplier.phone);
                                                setEditData('address', supplier.address);
                                                setEditOpen(true);
                                            }}
                                        >
                                            <Pencil /> Edit
                                        </Button>
                                        <Button
                                            className="cursor-pointer"
                                            variant="destructive"
                                            onClick={() => {
                                                setDeletingId(supplier.id);
                                                setDeleteOpen(true);
                                            }}
                                        >
                                            <Trash2 /> Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-muted-foreground text-center">
                                    No suppliers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Info */}
                <div>
                    <span>
                        Showing <strong>{suppliers.from}</strong> to <strong>{suppliers.to}</strong> of <strong>{suppliers.total}</strong>
                    </span>
                </div>

                {/* Pagination Buttons */}
                <div className="flex flex-wrap gap-2">
                    {suppliers.links.map((link, index) => (
                        <Link href={link.url ?? '#'} key={index}>
                            <Button
                                variant={link.active ? 'default' : 'secondary'}
                                className={`text-sm ${!link.url ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
