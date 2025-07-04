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
import { useForm } from '@inertiajs/react';
import { Check, LoaderCircle, Pencil } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function EditUserDialog({ user }: { user: User }) {
    const { data, setData, put, processing, reset } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
    });

    useEffect(() => {
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }, [user, setData]);

    const closeRef = useRef<HTMLButtonElement>(null);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('users.update', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset(); // Reset form
                closeRef.current?.click(); // tutup dialog
            },
        });
    };

    const roles = ['user', 'staff', 'admin'];

    return (
        <Dialog
            onOpenChange={(open) => {
                if (!open) {
                    reset();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <Pencil />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleUpdate}>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information and click save.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor={`name-${user.id}`}>Name</Label>
                            <Input id={`name-${user.id}`} name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`email-${user.id}`}>Email</Label>
                            <Input
                                id={`email-${user.id}`}
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>

                        {/* <div className="grid gap-2">
                            <Label htmlFor={`role-${user.id}`}>Role</Label>
                            <select
                                id={`role-${user.id}`}
                                name="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="focus:ring-primary rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none dark:bg-gray-800 dark:text-white"
                            >
                                <option value="user">User</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div> */}
                        <div className="grid gap-2">
                            <Label>Role</Label>
                            <div className="flex gap-2">
                                {roles.map((roleOption) => (
                                    <button
                                        key={roleOption}
                                        type="button"
                                        onClick={() => setData('role', roleOption)}
                                        className={`flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                            data.role === roleOption
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {data.role === roleOption && <Check className="h-4 w-4" />}
                                        <span className="capitalize">{roleOption}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose ref={closeRef} asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
