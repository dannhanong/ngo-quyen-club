export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    enabled: boolean;
    roles: string;
    deletedAt: string | null;
    phoneNumber: string | null;
    avatarId: string | null;
}

export interface UsersResponse {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page
    first: boolean;
    last: boolean;
}
