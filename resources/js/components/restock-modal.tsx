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
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { PackagePlus } from 'lucide-react';
import React, { useState } from 'react';

interface RestockModalProps {
    productId: number;
}

export function RestockModal({ productId }: RestockModalProps) {
    const [quantity, setQuantity] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleRestock = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(
            route('stocks.store'), // make sure this route exists
            { product_id: productId, quantity, note },
            {
                onFinish: () => setSubmitting(false),
                onSuccess: () => {
                    setQuantity('');
                    setNote('');
                },
            },
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="default">
                    <PackagePlus /> Restock Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleRestock}>
                    <DialogHeader>
                        <DialogTitle>Restock Product</DialogTitle>
                        <DialogDescription>Add quantity to this product's stock. This action will be recorded.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input id="quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Note (optional)</Label>
                            <Textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g. Restocked from Supplier ABC"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Restocking...' : 'Confirm Restock'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
