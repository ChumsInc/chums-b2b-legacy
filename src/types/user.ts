export interface LocalAuth {
    email: string;
    password: string;
}

export const isLocalAuth = (auth:LocalAuth|string): auth is LocalAuth => {
    return (auth as LocalAuth).email !== undefined;
}
