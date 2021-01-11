import {EventEmitter} from 'events'
import {isTokenExpired} from './jwtHelper'
import LocalStore from './LocalStore';
import {STORE_PROFILE, STORE_TOKEN, STORE_USER} from '../constants/stores';
import {fetchPOST} from "./fetch";
import {API_PATH_LOGIN_GOOGLE} from "../constants/paths";

export class AuthService extends EventEmitter {
    timer = 0;

    login(token, profile) {
        fetchPOST(API_PATH_LOGIN_GOOGLE, {token})
            .then(res => {
                const {user} = res;
                auth.setToken(token);
                auth.setProfile({...profile, chums: res});
            })
            .catch(err => {
                auth.logout();
            });
    }

    reAuth() {
        const googleUser = this.getGoogleUser();
        googleUser.reloadAuthResponse()
            .then(result => {
                // console.log('reAuth', result);
                this.login()
            })
            .catch(err => {
                console.log('reAuth', err.message);
            })
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        const loggedIn = !!token && !isTokenExpired(token);
        return loggedIn;
    }

    setGoogleUser(googleUser) {
        LocalStore.setItem(STORE_USER, googleUser);
    }

    getGoogleUser() {
        return LocalStore.getItem(STORE_PROFILE);
    }

    setProfile(profile) {
        // Saves profile data to localStorage
        LocalStore.setItem(STORE_PROFILE, profile);
        // Triggers profile_updated event to update the UI
        this.emit('profile_updated', profile);
    }

    getProfile() {
        // Retrieves the profile data from localStorage
        return LocalStore.getItem(STORE_PROFILE);
    }

    setToken(idToken) {
        // Saves user token to localStorage
        LocalStore.setItem(STORE_TOKEN, idToken);
    }

    getToken() {
        // Retrieves the user token from localStorage
        return LocalStore.getItem(STORE_TOKEN);
    }

    logout() {
        // Clear user token and profile data from localStorage
        LocalStore.removeItem(STORE_TOKEN);
        LocalStore.removeItem(STORE_PROFILE);
    }
}

export const auth = new AuthService();
