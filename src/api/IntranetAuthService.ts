import {EventEmitter} from 'events'
import {isTokenExpired} from '../utils/jwtHelper'
import LocalStore from '../utils/LocalStore';
import {STORE_PROFILE, STORE_TOKEN, STORE_USER} from '../constants/stores';
import {StoredProfile} from "../_types";

export class AuthService extends EventEmitter {
    timer = 0;

    loggedIn() {
        // Checks if there is a saved token AND it's still valid
        const token = this.getToken();
        return !!token && !isTokenExpired(token);
    }

    setGoogleUser(googleUser: StoredProfile) {
        LocalStore.setItem(STORE_USER, googleUser);
    }

    getGoogleUser(): StoredProfile | null {
        return LocalStore.getItem<StoredProfile|null>(STORE_PROFILE, null);
    }

    setProfile(profile: StoredProfile) {
        // Saves profile data to localStorage
        LocalStore.setItem(STORE_PROFILE, profile);
        // Triggers profile_updated event to update the UI
        this.emit('profile_updated', profile);
    }

    getProfile(): StoredProfile | null {
        // Retrieves the profile data from localStorage
        return LocalStore.getItem<StoredProfile|null>(STORE_PROFILE, null);
    }

    setToken(idToken: string) {
        // Saves user token to localStorage
        LocalStore.setItem(STORE_TOKEN, idToken);
    }

    getToken(): string | null {
        // Retrieves the user token from localStorage
        return LocalStore.getItem<string|null>(STORE_TOKEN, null);
    }

    logout() {
        // Clear user token and profile data from localStorage
        LocalStore.removeItem(STORE_TOKEN);
        LocalStore.removeItem(STORE_PROFILE);
    }
}

export const auth = new AuthService();
