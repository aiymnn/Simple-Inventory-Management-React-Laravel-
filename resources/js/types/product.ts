export interface Category {
    id: number;
    name: string;
}

export interface Supplier {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    category_id: number;
    supplier_id?: number | null;
    image_path?: string | null;
    price: string;
    quantity: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
    avg_rating?: string | null;
    total_sold?: number;

    // Optional: if eager-loaded
    category?: Category;
    supplier?: Supplier;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedProduct {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}
