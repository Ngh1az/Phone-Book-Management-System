export interface Contact {
    id: number;
    user_id: number;
    group_id: number | null;
    first_name: string;
    last_name: string;
    full_name: string;
    phone_number: string;
    email: string | null;
    address: string | null;
    company: string | null;
    job_title: string | null;
    website: string | null;
    notes: string | null;
    is_favorite: boolean;
    avatar_url: string | null;
    birthday: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    group?: Group;
    tags?: Tag[];
}

export interface Group {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    color: string;
    contacts_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    color: string;
    contacts_count?: number;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface ContactFilters {
    search?: string;
    group_id?: number | null;
    tag_id?: number | null;
    is_favorite?: boolean;
    per_page?: number;
}
