import { Head } from '@inertiajs/react';

export default function CheckoutCancelled() {
    return (
        <>
            <Head title="Payment Cancelled" />
            <div className="p-10 text-center">
                <h1 className="text-3xl font-bold text-red-600">❌ Payment Cancelled</h1>
                <p className="mt-4 text-lg">Your payment has been cancelled. You can try again.</p>
            </div>
        </>
    );
}
