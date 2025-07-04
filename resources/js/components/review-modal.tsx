// ReviewModal.tsx
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    orderId: number;
    productId: number;
};

export default function ReviewModal({ isOpen, onClose, orderId, productId }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        comment: '',
        order_id: orderId,
        product_id: productId,
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
        } else {
            setData('order_id', orderId);
            setData('product_id', productId);
        }
    }, [isOpen, orderId, productId, reset, setData]);

    const submit = () => {
        // console.log('Submitting review with data:', data);
        post(route('reviews.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-50 focus:outline-none">
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
                    <DialogTitle as="h3" className="text-lg font-semibold text-gray-900 dark:text-white">
                        Leave a Review for Product #{productId}
                    </DialogTitle>

                    {/* Rating */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                        <select
                            value={data.rating}
                            onChange={(e) => setData('rating', Number(e.target.value))}
                            className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        >
                            {[5, 4, 3, 2, 1].map((star) => (
                                <option key={star} value={star}>
                                    {star} Star{star > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                        {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
                    </div>

                    {/* Comment */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comment</label>
                        <textarea
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            rows={4}
                            className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submit}
                            disabled={processing}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            {processing ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
