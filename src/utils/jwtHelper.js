import decode from 'jwt-decode';

export const getProfile = (token) => {
    const decoded = decode(token);
    if (!decoded || !decoded.profile) {
        return {};
    }
    return decoded.profile;
};

export function getTokenExpirationDate(token) {
    const decoded = decode(token);
    if (!decoded.exp) {
        return null;
    }

    const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);
    return date;
}

export function isTokenExpired(token) {
    const date = getTokenExpirationDate(token);
    if (date === null) {
        return false;
    }
    return !(date.valueOf() > new Date().valueOf());
}

export const getSignInProfile = (token) => {
    const decoded = decode(token);
    if (!decoded) {
        return {};
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
