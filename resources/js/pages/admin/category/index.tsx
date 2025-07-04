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

interface Category {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCategory {
    data: Category[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Link[];
}

interface CategoriesPageProps {
    filters?: {
        name?: string;
    };
    categories: PaginatedCategory;
}

export default function Index({ categories }: CategoriesPageProps) {
    // console.log(categories);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const { filters } = usePage().props as { filters?: { name?: string } };
    const [name, setName] = useState(filters?.name || '');

    const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.get(
            '/admin/categories',
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
    } = useForm({ name: '' });

    // Edit form
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: updating,
        reset: resetEdit,
        errors: editErrors,
        clearErrors: clearEditErrors,
    } = useForm({ name: '' });

    // Delete form
    const { delete: destroy, processing: deleting } = useForm();

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            onSuccess: () => {
                resetCreate();
                setCreateOpen(false);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        put(`/admin/categories/${editingCategory.id}`, {
            onSuccess: () => {
                resetEdit();
                setEditOpen(false);
                setEditingCategory(null);
            },
        });
    };

    const handleDelete = () => {
        if (!deletingId) return;
        destroy(`/admin/categories/${deletingId}`, {
            onSuccess: () => {
                setDeleteOpen(false);
                setDeletingId(null);
            },
        });
    };

    // const handleReset = () => {
    //     router.get(
    //         '/admin/categories',
    //         {},
    //         {
    //             preserveState: false,
    //             preserveScroll: true,
    //         },
    //     );
    // };

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: '/admin/categories' }]}>
            <Head title="Categories" />
            <div className="flex flex-col gap-4 p-4">
                {/* Create Dialog */}
                <div className="flex items-center justify-between">
                    <div>
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
                                    <CirclePlus className="mr-2 h-4 w-4" />
                                    New Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <form onSubmit={handleCreateSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>New Category</DialogTitle>
                                        <DialogDescription>Enter category name</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-3 py-4">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Category name"
                                        />
                                        {createErrors.name && <p className="text-sm text-red-500">{createErrors.name}</p>}
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
                    </div>
                    <div>
                        <form onSubmit={handleFilterSubmit} className="mb-4 flex gap-2">
                            <Input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Search category..." />
                            <Button className="cursor-pointer" variant={'secondary'} type="submit">
                                <Search />
                            </Button>
                            <Link href={'/admin/categories'}>
                                <Button className="cursor-pointer" variant={'secondary'}>
                                    <RefreshCcw />
                                </Button>
                            </Link>
                        </form>
                    </div>
                </div>

                {/* Edit Dialog */}
                <Dialog
                    open={editOpen}
                    onOpenChange={(open) => {
                        setEditOpen(open);
                        if (!open) {
                            resetEdit();
                            clearEditErrors(); // ✅ Clear edit errors
                            setEditingCategory(null);
                        }
                    }}
                >
                    <DialogContent>
                        <form onSubmit={handleEditSubmit}>
                            <DialogHeader>
                                <DialogTitle>Edit Category</DialogTitle>
                                <DialogDescription>Update category name</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-3 py-4">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    placeholder="Category name"
                                />
                                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
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
                            <DialogTitle>Delete Category</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this category? This action cannot be undone.</DialogDescription>
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
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.data.length > 0 ? (
                            categories.data.map((cat, i) => (
                                <TableRow key={cat.id}>
                                    <TableCell>{categories.from + i}</TableCell>
                                    <TableCell>{cat.name}</TableCell>
                                    <TableCell className="flex justify-end gap-2 text-right">
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingCategory(cat);
                                                setEditData('name', cat.name);
                                                setEditOpen(true);
                                            }}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                setDeletingId(cat.id);
                                                setDeleteOpen(true);
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-muted-foreground text-center">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div>
                    <span>
                        Showing of <strong>{categories.from}</strong> to <strong>{categories.to}</strong> from <strong>{categories.total}</strong>
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.links.map((link, index) => {
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
