import {UserCustomerAccess, UserProfile} from "b2b-types";

export interface LocalAuth {
    email: string;
    password: string;
}

export const isLocalAuth = (auth:LocalAuth|string): auth is LocalAuth => {
    return (auth as LocalAuth).email !== undefined;
}


export interface ExtendedUserProfile extends UserProfile {
    accounts?: UserCustomerAccess[];
    roles?: string[]
}

export interface GoogleProfile {
    email?: string;
    familyName?: string;
    givenName?: string;
    googleId?: string;
    imageUrl?: string;
    name?: string;
}

export interface StoredProfile extends GoogleProfile {
    chums?: {
        user?: ExtendedUserProfile
    },
}
