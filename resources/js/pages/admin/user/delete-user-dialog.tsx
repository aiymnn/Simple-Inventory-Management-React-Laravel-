import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

export default function UserDeleteDialog({ user }: { user: User }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('users.destroy', user.id), {
            preserveScroll: true,
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {user.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is permanent and cannot be undone. All data related to this user will be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={processing}>
                        {processing ? 'Deleting...' : 'Confirm Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
