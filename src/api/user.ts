import {Salesperson} from 'b2b-types'
import {
    API_PATH_LOGIN_GOOGLE,
    API_PATH_LOGIN_LOCAL,
    API_PATH_PASSWORD_RESET,
    API_PATH_PROFILE,
    API_PATH_REP_LIST
} from "../constants/paths";
import {FunkyUserProfileResponse, UserProfileResponse} from "../ducks/user/types";
import {fetchJSON} from "./fetch";
import {LocalAuth, StoredProfile} from "../types/user";
import {auth} from './IntranetAuthService';
import {getSignInProfile, isTokenExpired} from "../utils/jwtHelper";
import localStore from "../utils/LocalStore";
import {STORE_AUTHTYPE} from "../constants/stores";
import {AUTH_GOOGLE} from "../constants/app";
import {isUserRole} from "../utils/typeguards";


export async function postLocalLogin(arg: LocalAuth): Promise<string> {
    try {
        const body = JSON.stringify(arg);
        const res = await fetchJSON<{ token: string }>(API_PATH_LOGIN_LOCAL, {method: 'POST', body}, true);
        return res.token;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("postLocalLogin()", err.message);
            return Promise.reject(err);
        }
        console.debug("postLocalLogin()", err);
        return Promise.reject(new Error('Error in postLocalLogin()'));
    }
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
    try {
        const response = await fetchJSON<FunkyUserProfileResponse>(API_PATH_PROFILE);
        response.reps = [];
        response.roles = response.roles?.map(role => isUserRole(role) ? role.role : role);
        if (response.user?.accountType === 1) {
            response.reps = await fetchRepList();
        }
        return response as UserProfileResponse;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchUserProfile()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchUserProfile()", err);
        return Promise.reject(new Error('Error in fetchUserProfile()'));
    }
}

export async function fetchRepList(): Promise<Salesperson[]> {
    try {
        const response = await fetchJSON<{ list: Salesperson[] }>(API_PATH_REP_LIST, {cache: 'no-cache'});
        return (response.list ?? []).filter(rep => !!rep.active);
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchRepList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchRepList()", err);
        return Promise.reject(new Error('Error in fetchRepList()'));
    }
}


export async function fetchGoogleLogin(token: string): Promise<UserProfileResponse> {
    try {
        if (!isTokenExpired(token)) {
            auth.setToken(token);
        }
        const body = JSON.stringify({token});
        const response = await fetchJSON<UserProfileResponse>(API_PATH_LOGIN_GOOGLE, {method: 'POST', body}, true);
        response.reps = [];
        if (response.user?.accountType === 1) {
            response.reps = await fetchRepList();
        }
        if (response.user) {
            const profile = getSignInProfile(token);
            const {user, roles, accounts} = response;
            const storedProfile: StoredProfile = {
                ...profile,
                chums: {
                    user: {
                        ...user,
                        roles,
                        accounts
                    }
                }
            }
            auth.setProfile(storedProfile);
            localStore.setItem<string>(STORE_AUTHTYPE, AUTH_GOOGLE);
        }
        return response;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchGoogleLogin()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchGoogleLogin()", err);
        return Promise.reject(new Error('Error in fetchGoogleLogin()'));
    }
}

export async function postResetPassword(arg: string):Promise<boolean> {
    try {
        const body = JSON.stringify({email: arg});
        const response = await fetchJSON<{success:boolean}>(API_PATH_PASSWORD_RESET, {method: 'POST', body}, true);
        return response?.success ?? false;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postResetPassword()", err.message);
            return Promise.reject(err);
        }
        console.debug("postResetPassword()", err);
        return Promise.reject(new Error('Error in postResetPassword()'));
    }
}
