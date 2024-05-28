import {jwtDecode, JwtPayload} from 'jwt-decode';
import {GoogleProfile, StoredProfile} from "../types/user";
import {UserProfile, UserRole} from "b2b-types";
import {UserCustomerAccess} from "b2b-types/src/user";


interface GoogleSignInPayload extends JwtPayload {
    email: string;
    email_verified: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
}

interface LocalSignInPayload extends JwtPayload {
    user: UserProfile;
    accounts: UserCustomerAccess[];
    roles: UserRole[]
}

export const isGoogleToken = (token:JwtPayload|GoogleSignInPayload|null): token is GoogleSignInPayload => {
    if (!token) {
        return false;
    }
    return (token as GoogleSignInPayload).email !== undefined;
}

export const isLocalToken = (token:JwtPayload|LocalSignInPayload|null): token is LocalSignInPayload => {
    if (!token) {
        return false;
    }
    return token.iss === 'chums.com';
}

export const getLocalAuthUserId = (token:string) => {
    const decoded = jwtDecode(token);
    if (!isLocalToken(decoded)) {
        return 0;
    }
    return decoded.user.id ?? 0;

}

export const getProfile = (token:string):StoredProfile|null => {
    const decoded = jwtDecode(token);
    if (!isLocalToken(decoded)) {
        return null;
    }
    const {user, roles, accounts} = decoded;
    return {
        chums: {
            user: {
                ...user,
                accounts,
                roles: (roles).map(role => role.role)
            }
        }
    }
};

export function getTokenExpiry(token:string):number {
    const decoded = jwtDecode(token);
    return decoded.exp ?? 0;
}

export function getTokenExpirationDate(token:string):Date|null {
    const decoded = jwtDecode(token);
    if (!decoded.exp) {
        return null;
    }

    const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);
    return date;
}

export function isTokenExpired(token:string|null) {
    if (!token) {
        return true;
    }
    const date = getTokenExpirationDate(token);
    if (date === null) {
        return true;
    }
    return !(date.valueOf() > new Date().valueOf());
}

export const getSignInProfile = (token:string):GoogleProfile|null => {
    const decoded = jwtDecode(token);
    if (!isGoogleToken(decoded)) {
        return null;
    }
    const {sub, picture, email, name, given_name, family_name} = decoded;
    return {
        googleId: sub,
        imageUrl: picture,
        email,
        name,
        givenName: given_name,
        familyName: family_name,
    }
}
