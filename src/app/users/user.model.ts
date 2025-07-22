export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    profile: {
        firstName: string;
        lastName: string;
        avatar?: string;
    }
}
