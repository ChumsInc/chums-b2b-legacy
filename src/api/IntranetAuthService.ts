import {EventEmitter} from 'events'
import {isTokenExpired} from '../utils/jwtHelper'
import LocalStore from '../utils/LocalStore';
import {STORE_PROFILE, STORE_AVATAR, STORE_TOKEN, STORE_USER} from '../constants/stores';
import {StoredProfile} from "../types/user";

export class AuthService extends EventEmitter {
    timer = 0;

    loggedIn() {
        // Checks if there is a saved token AND it's still valid
        const token = this.getToken();
        return !!token && !isTokenExpired(token);
    }

    setGoogleUser(googleUser: StoredProfile) {
        LocalStore.setItem<StoredProfile>(STORE_USER, googleUser);
        if (googleUser.imageUrl) {
            LocalStore.setItem<string>(STORE_AVATAR, googleUser.imageUrl);
        }
    }

    getGoogleUser(): StoredProfile | null {
        return LocalStore.getItem<StoredProfile|null>(STORE_PROFILE, null);
    }

    setProfile(profile: StoredProfile|null) {
        if (!profile) {
            LocalStore.removeItem(STORE_PROFILE);
            return;
        }
        // Saves profile data to localStorage
        LocalStore.setItem(STORE_PROFILE, profile);
        if (profile.imageUrl) {
            LocalStore.setItem<string>(STORE_AVATAR, profile.imageUrl);
        }
        // Triggers profile_updated event to update the UI
        this.emit('profile_updated', profile);
    }

    getProfile(): StoredProfile | null {
        // Retrieves the profile data from localStorage
        return LocalStore.getItem<StoredProfile|null>(STORE_PROFILE, null);
    }

    setToken(idToken: string) {
        // Saves user token to localStorage
        LocalStore.setItem<string>(STORE_TOKEN, idToken);
    }

    removeToken() {
        LocalStore.removeItem(STORE_TOKEN);
    }

    getToken(): string | null {
        // Retrieves the user token from localStorage
        return LocalStore.getItem<string|null>(STORE_TOKEN, null);
    }

    logout() {
        // Clear user token and profile data from localStorage
        LocalStore.removeItem(STORE_TOKEN);
        LocalStore.removeItem(STORE_PROFILE);
        LocalStore.removeItem(STORE_AVATAR);
    }
}

export const auth = new AuthService();
