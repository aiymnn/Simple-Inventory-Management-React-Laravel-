import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface PageProps {
    auth: Auth;
    cartCount: number;
    orderCount: number;
    [key: string]: unknown;
}
