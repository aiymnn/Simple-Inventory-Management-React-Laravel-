import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, Eye, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import UserDeleteDialog from './delete-user-dialog';
import EditUserDialog from './edit-user-dialog';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    users: {
        data: User[];
        links: PaginationLink[];
        from: number;
        total: number;
        to: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage User',
        href: '/admin/users',
    },
];

function formatDate(datetime: string) {
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export default function Index({ users }: PageProps) {
    const [showFilters, setShowFilters] = useState(false);

    const { filters } = usePage().props as {
        filters?: {
            name?: string;
            email?: string;
            role?: string;
        };
    };

    const { data, setData, get } = useForm({
        name: filters?.name || '',
        email: filters?.email || '',
        role: filters?.role || '',
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get('/admin/users', {
            preserveState: true,
            replace: true,
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-end">
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1">
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
                                        {/* Name */}
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter name"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="Enter email"
                                            />
                                        </div>

                                        {/* Role */}
                                        <div>
                                            <Label htmlFor="role">Role</Label>
                                            <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="staff">Staff</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button type="submit">Search</Button>
                                        <Link href="/admin/users">
                                            <Button variant="outline">
                                                <RefreshCcw className="mr-1 h-4 w-4" />
                                                Reset
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Register at</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.length > 0 ? (
                            users.data.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + users.from}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <span
                                            className={clsx(
                                                'rounded px-2 py-0.5 text-xs font-medium',
                                                user.role === 'admin' && 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100',
                                                user.role === 'staff' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
                                                user.role === 'user' && 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100',
                                            )}
                                        >
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>
                                    <TableCell className="flex items-center justify-end space-x-2.5">
                                        <Link href={`/admin/users/${user.id}`}>
                                            <Button variant="outline">
                                                <Eye /> View
                                            </Button>
                                        </Link>
                                        <EditUserDialog user={user} />
                                        <UserDeleteDialog user={user} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-muted-foreground py-6 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div>
                    <span>
                        Showing <strong>{users.from}</strong> to <strong>{users.to}</strong> of <strong>{users.total}</strong>
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {users.links.map((link, index) => {
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
